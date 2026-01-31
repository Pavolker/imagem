"""
Video Generator - Gera vídeos a partir de imagens usando MoviePy
"""
from moviepy.editor import ImageClip, concatenate_videoclips
from moviepy.video.fx.all import fadein, fadeout
import tempfile
import os
import requests
from typing import List, Optional
from PIL import Image
import io
import shutil


class VideoGenerator:
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp()

    def get_image_path(self, url: str, index: int, use_local: bool = False) -> str:
        """
        Obtém caminho local da imagem (baixando ou usando arquivo local)
        """
        if use_local:
            # Se for caminho local da API (/api/images/filename)
            if url.startswith("/api/images/"):
                filename = url.replace("/api/images/", "")
                local_path = os.path.join("images", filename)
            else:
                local_path = url

            # Verificar se arquivo existe
            if not os.path.exists(local_path):
                raise Exception(f"Arquivo não encontrado: {local_path}")

            # Copiar para temp_dir e converter para JPG se necessário
            temp_path = os.path.join(self.temp_dir, f"img_{index:04d}.jpg")
            try:
                img = Image.open(local_path)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(temp_path, quality=95)
            except Exception as e:
                # Se não conseguir converter, apenas copiar
                shutil.copy(local_path, temp_path)
            return temp_path
        else:
            # Baixar da URL
            try:
                headers = {'User-Agent': 'Mozilla/5.0'}
                response = requests.get(url, headers=headers, timeout=10)
                img = Image.open(io.BytesIO(response.content))

                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')

                path = os.path.join(self.temp_dir, f"img_{index:04d}.jpg")
                img.save(path, quality=95)
                return path
            except Exception as e:
                raise Exception(f"Erro ao baixar imagem {url}: {str(e)}")

    def create_video(
        self,
        image_urls: List[str],
        duration_per_image: float = 3.0,
        transition_duration: float = 0.5,
        resolution: tuple = (1920, 1080),
        fps: int = 24,
        add_fade: bool = True,
        use_local: bool = False
    ) -> str:
        """
        Cria vídeo a partir de lista de imagens (URLs ou caminhos locais)

        Args:
            image_urls: Lista de URLs ou caminhos locais das imagens
            duration_per_image: Duração de cada imagem em segundos
            transition_duration: Duração da transição em segundos
            resolution: Resolução do vídeo (largura, altura)
            fps: Frames por segundo
            add_fade: Adicionar efeito fade entre imagens
            use_local: Se True, trata como arquivos locais
        """
        clips = []

        print(f"Processando {len(image_urls)} imagens...")

        for i, url in enumerate(image_urls):
            try:
                # Obter caminho local da imagem
                local_path = self.get_image_path(url, i, use_local)

                # Criar clip
                clip = ImageClip(local_path, duration=duration_per_image)

                # Redimensionar mantendo aspect ratio (letterbox se necessário)
                clip = clip.resize(height=resolution[1])
                if clip.w > resolution[0]:
                    clip = clip.resize(width=resolution[0])

                # Centralizar
                clip = clip.set_position('center')

                # Adicionar fade
                if add_fade and i > 0:
                    clip = fadein(clip, transition_duration)
                if add_fade and i < len(image_urls) - 1:
                    clip = fadeout(clip, transition_duration)

                clips.append(clip)
                print(f"✓ Processada imagem {i+1}/{len(image_urls)}")

            except Exception as e:
                print(f"✗ Erro na imagem {i+1}: {str(e)}")
                continue

        if not clips:
            raise Exception("Nenhuma imagem foi processada com sucesso")

        # Concatenar clips
        final_video = concatenate_videoclips(clips, method="compose")

        # Definir tamanho do canvas
        final_video = final_video.set_duration(sum([c.duration for c in clips]))

        # Salvar vídeo
        output_path = os.path.join(self.temp_dir, "output.mp4")
        final_video.write_videofile(
            output_path,
            fps=fps,
            codec='libx264',
            audio=False,
            threads=4,
            preset='medium',
            logger=None  # Remove logs verbosos do ffmpeg
        )

        # Limpar imagens temporárias
        for i in range(len(image_urls)):
            img_path = os.path.join(self.temp_dir, f"img_{i:04d}.jpg")
            if os.path.exists(img_path):
                os.remove(img_path)

        return output_path
