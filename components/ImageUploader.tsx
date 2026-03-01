import React, { useState, useRef } from 'react';

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  onImageRemove: () => void;
  currentImage: UploadedImage | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onImageRemove, 
  currentImage 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage?.url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.match('image.*')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter menos de 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewUrl(imageUrl);
      
      const uploadedImage: UploadedImage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        name: file.name,
        size: file.size
      };
      
      onImageUpload(uploadedImage);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
  };

  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-sm h-full flex flex-col">
      <h3 className="serif-font text-lg mb-3">Imagem de Composição</h3>

      {!previewUrl ? (
        <div
          className={`flex-grow border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col justify-center ${
            isDragging
              ? 'border-orange-500 bg-orange-50'
              : 'border-zinc-300 hover:border-zinc-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-zinc-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-zinc-600 font-medium text-sm mb-1">
              Arraste ou clique
            </p>
            <p className="text-xs text-zinc-500">
              JPG, PNG, GIF, WEBP
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          {/* Preview da imagem */}
          <div className="flex-grow relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain bg-zinc-100 rounded border border-zinc-200"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Informações do arquivo e botão substituir */}
          <div className="mt-2 space-y-1">
            <div className="text-xs text-zinc-600">
              <div className="truncate">{currentImage?.name}</div>
              <div className="text-right">
                {(currentImage?.size! / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>

            <button
              onClick={triggerFileSelect}
              className="w-full py-1 text-xs font-bold uppercase tracking-wider border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
            >
              Substituir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;