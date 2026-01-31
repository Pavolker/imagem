import React, { useState } from 'react';
import { ImageTransformParams } from '../types';

interface PostEditPanelProps {
  currentTransform: ImageTransformParams;
  onTransformChange: (transform: ImageTransformParams) => void;
  onApplyChanges: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const PostEditPanel: React.FC<PostEditPanelProps> = ({ 
  currentTransform, 
  onTransformChange,
  onApplyChanges,
  onCancel,
  isVisible
}) => {
  const [localTransform, setLocalTransform] = useState<ImageTransformParams>(currentTransform);

  // Atualizar estado local quando as props mudarem
  React.useEffect(() => {
    setLocalTransform(currentTransform);
  }, [currentTransform]);

  const handleParamChange = (param: keyof ImageTransformParams, value: any) => {
    const newTransform = {
      ...localTransform,
      [param]: value
    };
    setLocalTransform(newTransform);
    onTransformChange(newTransform);
  };

  const handleApply = () => {
    onApplyChanges();
  };

  const handleCancel = () => {
    // Resetar para os valores originais
    setLocalTransform(currentTransform);
    onTransformChange(currentTransform);
    onCancel();
  };

  const resetToDefault = () => {
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
    setLocalTransform(defaultTransform);
    onTransformChange(defaultTransform);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="serif-font text-2xl">Editar Imagem na Composição</h2>
            <button
              onClick={handleCancel}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Escala */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-700">
                  Escala
                </label>
                <span className="text-xs text-zinc-500">
                  X: {(localTransform.scaleX * 100).toFixed(0)}% | Y: {(localTransform.scaleY * 100).toFixed(0)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={localTransform.scaleX}
                    onChange={(e) => handleParamChange('scaleX', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] text-center text-zinc-500 mt-1">Horizontal</div>
                </div>
                <div>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={localTransform.scaleY}
                    onChange={(e) => handleParamChange('scaleY', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] text-center text-zinc-500 mt-1">Vertical</div>
                </div>
              </div>
            </div>

            {/* Rotação e Opacidade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-zinc-700">
                  Rotação ({localTransform.rotation.toFixed(0)}°)
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={localTransform.rotation}
                  onChange={(e) => handleParamChange('rotation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-zinc-700">
                  Opacidade ({(localTransform.opacity * 100).toFixed(0)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localTransform.opacity}
                  onChange={(e) => handleParamChange('opacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Posição */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-zinc-700">
                Posição
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">Horizontal: {localTransform.posX}px</div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={localTransform.posX}
                    onChange={(e) => handleParamChange('posX', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">Vertical: {localTransform.posY}px</div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={localTransform.posY}
                    onChange={(e) => handleParamChange('posY', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Blend Mode */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-zinc-700">
                Modo de Mesclagem
              </label>
              <select
                value={localTransform.blendMode}
                onChange={(e) => handleParamChange('blendMode', e.target.value as any)}
                className="w-full text-sm p-2 border border-zinc-200 rounded"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
              </select>
            </div>

            {/* Distorção */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-zinc-700">
                Tipo de Distorção
              </label>
              <select
                value={localTransform.distortion}
                onChange={(e) => handleParamChange('distortion', e.target.value as any)}
                className="w-full text-sm p-2 border border-zinc-200 rounded mb-3"
              >
                <option value="none">Nenhuma</option>
                <option value="wave">Onda</option>
                <option value="twist">Torção</option>
                <option value="ripple">Ripple</option>
                <option value="stretch">Alongamento</option>
              </select>

              {localTransform.distortion !== 'none' && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-zinc-700">
                    Intensidade ({(localTransform.distortionIntensity * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localTransform.distortionIntensity}
                    onChange={(e) => handleParamChange('distortionIntensity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              <button
                onClick={resetToDefault}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors rounded"
              >
                Aplicar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditPanel;