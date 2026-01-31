# 🎬 Video Creator App

Aplicativo completo para criar vídeos a partir de imagens extraídas de páginas web ou enviadas via upload.

## 📋 Estrutura do Projeto

```
video-creator-app/
├── backend/
│   ├── main.py              # API FastAPI principal
│   ├── requirements.txt     # Dependências Python
│   └── services/
│       ├── image_extractor.py   # Extração de imagens de URLs
│       └── video_generator.py   # Geração de vídeos com MoviePy
└── frontend/
    └── index.html           # Interface web completa
```

## 🚀 Como Executar

### Pré-requisitos

**FFmpeg** é necessário para processamento de vídeo:

- **macOS:** `brew install ffmpeg`
- **Linux:** `sudo apt-get install ffmpeg`
- **Windows:** `choco install ffmpeg` ou baixe em [ffmpeg.org](https://ffmpeg.org/download.html)

### 1. Instalar dependências do Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Iniciar o Backend

```bash
python main.py
```

O servidor estará rodando em `http://localhost:8000`

### 3. Abrir o Frontend

Abra o arquivo `frontend/index.html` no navegador ou use Live Server no VS Code.

## ✨ Funcionalidades

### 📥 Extração de Imagens
- **Web Scraping:** Extrai automaticamente imagens de qualquer URL
- **Upload Direto:** Suporte a drag-and-drop de múltiplas imagens
- **Validação:** Verifica formato e acessibilidade
- **Pré-visualização:** Grid visual com seleção ordenada

### 🎞️ Geração de Vídeo
- **Codec H.264:** Compatível universalmente
- **Resoluções:** Full HD, HD, Stories (9:16), 4K
- **Transições:** Fade in/out configurável
- **Ajuste Inteligente:** Mantém aspect ratio
- **Processamento Assíncrono:** Não trava a interface

### ⚙️ Configurações
- **Duração:** 0.5s a 10s por imagem
- **FPS:** 24, 30 ou 60
- **Transição:** 0s a 2s
- **Resolução:** Várias opções disponíveis

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Status da API |
| POST | `/api/extract-images` | Extrai imagens de uma página |
| POST | `/api/create-video` | Inicia geração do vídeo |
| GET | `/api/video-status/{id}` | Verifica status do processamento |
| GET | `/api/download/{id}` | Download do vídeo gerado |
| POST | `/api/upload-images` | Upload de imagens |

## 📦 Dependências

- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `moviepy` - Processamento de vídeo
- `requests` - HTTP client
- `beautifulsoup4` - Web scraping
- `pillow` - Processamento de imagens
- `python-multipart` - Upload de arquivos
- `aiofiles` - Arquivos assíncronos

## 🔧 Customizações

### Adicionar música de fundo

No `video_generator.py`:

```python
from moviepy.editor import AudioFileClip

# Adicionar música de fundo
audio = AudioFileClip("background_music.mp3").subclip(0, final_video.duration)
final_video = final_video.set_audio(audio.volumex(0.3))  # 30% volume
```

### Adicionar watermark/texto

```python
from moviepy.editor import TextClip, CompositeVideoClip

txt_clip = TextClip("Meu Vídeo", fontsize=70, color='white')
txt_clip = txt_clip.set_pos('center').set_duration(final_video.duration)
final_video = CompositeVideoClip([final_video, txt_clip])
```

## 🚀 Deploy

Para produção, considere:

1. **Fila de processamento:** Redis + Celery para múltiplos vídeos
2. **Armazenamento:** AWS S3 ou Cloudinary para persistência
3. **Autenticação:** JWT para controle de usuários
4. **CDN:** Para distribuição dos vídeos gerados
