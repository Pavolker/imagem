"""
Video Creator API - Backend FastAPI
Gera vídeos a partir de imagens da pasta local
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import shutil
import uuid

from services.video_generator import VideoGenerator

app = FastAPI(title="Video Creator API", version="1.0")

# CORS para permitir acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class VideoRequest(BaseModel):
    image_urls: List[str]  # URLs das imagens no formato /api/images/{filename}
    duration_per_image: float = 3.0
    transition_duration: float = 0.5
    resolution: str = "1920x1080"
    fps: int = 24
    add_fade: bool = True


class VideoResponse(BaseModel):
    video_id: str
    status: str
    message: str


# Armazenamento temporário de vídeos gerados
video_storage = {}


@app.get("/")
async def root():
    """Rota raiz para verificar se API está ativa"""
    return {
        "message": "Video Creator API",
        "version": "1.0",
        "description": "Cria vídeos a partir de imagens da pasta local backend/images/",
        "endpoints": {
            "local_images": "GET /api/local-images",
            "create_video": "POST /api/create-video",
            "video_status": "GET /api/video-status/{video_id}",
            "download": "GET /api/download/{video_id}",
            "serve_image": "GET /api/images/{filename}"
        }
    }


@app.get("/api/local-images")
async def get_local_images():
    """Lista todas as imagens na pasta local images/"""
    images_dir = "images"
    os.makedirs(images_dir, exist_ok=True)

    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    images = []

    for filename in os.listdir(images_dir):
        ext = os.path.splitext(filename)[1].lower()
        if ext in image_extensions:
            images.append({
                "filename": filename,
                "url": f"/api/images/{filename}"
            })

    # Ordenar por nome
    images.sort(key=lambda x: x["filename"])

    return {
        "success": True,
        "count": len(images),
        "images": images
    }


@app.get("/api/images/{filename}")
async def serve_image(filename: str):
    """Serve uma imagem da pasta local"""
    file_path = os.path.join("images", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return FileResponse(file_path)


@app.post("/api/create-video", response_model=VideoResponse)
async def create_video(request: VideoRequest, background_tasks: BackgroundTasks):
    """Inicia criação do vídeo"""
    video_id = str(uuid.uuid4())

    # Parse resolution
    try:
        width, height = map(int, request.resolution.split('x'))
    except:
        width, height = 1920, 1080

    # Criar vídeo em background para não travar a requisição
    def generate_video_task():
        try:
            generator = VideoGenerator()
            output_path = generator.create_video(
                image_urls=[str(url) for url in request.image_urls],
                duration_per_image=request.duration_per_image,
                transition_duration=request.transition_duration,
                resolution=(width, height),
                fps=request.fps,
                add_fade=request.add_fade,
                use_local=True  # Sempre usa imagens locais
            )

            # Mover para pasta de vídeos gerados
            os.makedirs("generated_videos", exist_ok=True)
            final_path = f"generated_videos/{video_id}.mp4"
            shutil.move(output_path, final_path)

            video_storage[video_id] = {
                "path": final_path,
                "status": "completed"
            }
        except Exception as e:
            video_storage[video_id] = {
                "status": "error",
                "message": str(e)
            }

    background_tasks.add_task(generate_video_task)
    video_storage[video_id] = {"status": "processing"}

    return VideoResponse(
        video_id=video_id,
        status="processing",
        message="Vídeo está sendo gerado"
    )


@app.get("/api/video-status/{video_id}")
async def check_status(video_id: str):
    """Verifica status da geração do vídeo"""
    if video_id not in video_storage:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")

    return video_storage[video_id]


@app.get("/api/download/{video_id}")
async def download_video(video_id: str):
    """Download do vídeo gerado"""
    if video_id not in video_storage or video_storage[video_id].get("status") != "completed":
        raise HTTPException(status_code=404, detail="Vídeo não pronto ou não encontrado")

    file_path = video_storage[video_id]["path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return FileResponse(
        file_path,
        media_type="video/mp4",
        filename=f"video_gerado_{video_id}.mp4"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
