import React, { useState } from 'react';
import { GenerationParams, UploadedImage, ImageTransformParams } from '../types';
import { EXTENDED_COLOR_PALETTE, PRESET_THEMES, getColorsByCategory } from '../utils/colorPalette';
import PreviewPanel from './PreviewPanel';
import ImageUploader from './ImageUploader';
import DistortionControls from './DistortionControls';

interface ControlsPanelProps {
  onGenerate: (params: GenerationParams) => void;
  currentParams: GenerationParams;
  onClearImage: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ onGenerate, currentParams, onClearImage }) => {
  console.log('ControlsPanel: Recebendo currentParams:', currentParams);
  
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(currentParams.uploadedImage || null);
  
  // Garantir valores padrão para imageTransform
  const defaultTransform: ImageTransformParams = {
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    posX: 0,
    posY: 0,
    opacity: 0.7,
    blendMode: 'normal',
    distortion: 'none',
    distortionIntensity: 0.5
  };
  
  const [imageTransform, setImageTransform] = useState<ImageTransformParams>(
    currentParams.imageTransform || defaultTransform
  );

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
  };

  const handleTransformChange = (transform: ImageTransformParams) => {
    setImageTransform(transform);
  };

  const handleGenerate = () => {
    try {
      console.log('ControlsPanel: Gerando com params:', {
        currentParams,
        uploadedImage,
        imageTransform
      });
      
      const finalParams: GenerationParams = {
        ...currentParams,
        uploadedImage: uploadedImage,
        imageTransform: imageTransform
      };
      
      console.log('ControlsPanel: Parâmetros finais:', finalParams);
      onGenerate(finalParams);
    } catch (error) {
      console.error('Erro no ControlsPanel handleGenerate:', error);
    }
  };

  // Parâmetros atualizados para o preview
  const previewParams: GenerationParams = {
    ...currentParams,
    uploadedImage: uploadedImage,
    imageTransform: imageTransform
  } as GenerationParams;

  return (
    <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
      <h3 className="serif-font text-xl mb-4">Controles Criativos</h3>

      {/* Upload de Imagem - Container Quadrado */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-full aspect-square max-w-[300px] max-h-[300px]">
          <ImageUploader
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            currentImage={uploadedImage}
          />
        </div>
      </div>

      {/* Controles de Distorção - Container Quadrado */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-full aspect-square max-w-[300px] max-h-[300px]">
          <DistortionControls
            transformParams={imageTransform}
            onTransformChange={handleTransformChange}
            isEnabled={!!uploadedImage}
          />
        </div>
      </div>

      {/* Preview Panel - Container Quadrado */}
      <div className="flex items-center justify-center">
        <div className="w-full aspect-square max-w-[300px] max-h-[300px]">
          <PreviewPanel
            params={{
              ...currentParams,
              uploadedImage: uploadedImage,
              imageTransform: imageTransform
            }}
            isVisible={true}
          />
        </div>
      </div>

      {/* Botão Limpar Imagem */}
      <div className="mt-6">
        <button
          onClick={onClearImage}
          className="w-full py-3 bg-red-500 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-colors rounded-full"
        >
          Limpar Imagem
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;