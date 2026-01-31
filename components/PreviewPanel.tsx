import React, { useState, useEffect } from 'react';
import { GenerationParams } from '../types';
import { generateLocalArtImage } from '../services/localArtGenerator';

interface PreviewPanelProps {
  params: GenerationParams;
  isVisible: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ params, isVisible }) => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      generatePreview();
    }
  }, [params, isVisible]);

  const generatePreview = async () => {
    if (!isVisible) return;
    
    setIsLoading(true);
    try {
      // Gerar preview em resolução reduzida para performance
      const previewParams = {
        ...params,
        resolution: 300, // Resolução menor para preview rápido
        elementCount: Math.min(params.elementCount, 15) // Menos elementos para preview
      };
      
      const imageData = await generateLocalArtImage(previewParams);
      setPreviewImage(imageData);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-zinc-600">
        Preview em Tempo Real
      </h4>
      
      <div className="relative aspect-square bg-zinc-50 border border-zinc-200 rounded overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          </div>
        ) : previewImage ? (
          <img 
            src={previewImage} 
            alt="Preview da composição" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
            Ajuste os parâmetros para ver o preview
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-zinc-500">
        <div className="flex justify-between">
          <span>Resolução:</span>
          <span className="font-medium">{params.resolution}px</span>
        </div>
        <div className="flex justify-between">
          <span>Elementos:</span>
          <span className="font-medium">{params.elementCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Cores selecionadas:</span>
          <span className="font-medium">{params.colors.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;