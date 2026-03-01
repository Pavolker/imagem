import React, { useState } from 'react';

export interface ImageTransformParams {
  scaleX: number;
  scaleY: number;
  rotation: number;
  posX: number;
  posY: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
  distortion: 'none' | 'wave' | 'twist' | 'ripple' | 'stretch';
  distortionIntensity: number;
}

interface DistortionControlsProps {
  transformParams: ImageTransformParams;
  onTransformChange: (params: ImageTransformParams) => void;
  isEnabled: boolean;
}

const DistortionControls: React.FC<DistortionControlsProps> = ({ 
  transformParams, 
  onTransformChange,
  isEnabled
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParamChange = (param: keyof ImageTransformParams, value: any) => {
    onTransformChange({
      ...transformParams,
      [param]: value
    });
  };

  const resetToDefault = () => {
    onTransformChange({
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      posX: 0,
      posY: 0,
      opacity: 0.7,
      blendMode: 'normal',
      distortion: 'none',
      distortionIntensity: 0.5
    });
  };

  return (
    <div className={`bg-white p-4 border border-zinc-200 rounded-sm shadow-sm h-full flex flex-col ${!isEnabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="serif-font text-lg">Distorção da Imagem</h3>
        {isEnabled && (
          <button
            onClick={resetToDefault}
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700"
          >
            Reset
          </button>
        )}
      </div>

      {!isEnabled ? (
        <div className="flex-grow flex flex-col items-center justify-center text-zinc-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">Faça upload de uma imagem primeiro</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow space-y-3">
          {/* Escala */}
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Escala
              </label>
              <span className="text-xs text-zinc-500">
                X: {(transformParams.scaleX * 100).toFixed(0)}% | Y: {(transformParams.scaleY * 100).toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={transformParams.scaleX}
                  onChange={(e) => handleParamChange('scaleX', parseFloat(e.target.value))}
                  className="w-full"
                  disabled={!isEnabled}
                />
                <div className="text-[10px] text-center text-zinc-500 mt-1">Hor</div>
              </div>
              <div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={transformParams.scaleY}
                  onChange={(e) => handleParamChange('scaleY', parseFloat(e.target.value))}
                  className="w-full"
                  disabled={!isEnabled}
                />
                <div className="text-[10px] text-center text-zinc-500 mt-1">Ver</div>
              </div>
            </div>
          </div>

          {/* Rotação e Opacidade */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
                Rotação ({transformParams.rotation.toFixed(0)}°)
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={transformParams.rotation}
                onChange={(e) => handleParamChange('rotation', parseInt(e.target.value))}
                className="w-full"
                disabled={!isEnabled}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
                Opacidade ({(transformParams.opacity * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={transformParams.opacity}
                onChange={(e) => handleParamChange('opacity', parseFloat(e.target.value))}
                className="w-full"
                disabled={!isEnabled}
              />
            </div>
          </div>

          {/* Posição */}
          <div className="flex-shrink-0">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
              Posição
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-zinc-500 mb-1">Hor: {transformParams.posX}</div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={transformParams.posX}
                  onChange={(e) => handleParamChange('posX', parseInt(e.target.value))}
                  className="w-full"
                  disabled={!isEnabled}
                />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 mb-1">Ver: {transformParams.posY}</div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={transformParams.posY}
                  onChange={(e) => handleParamChange('posY', parseInt(e.target.value))}
                  className="w-full"
                  disabled={!isEnabled}
                />
              </div>
            </div>
          </div>

          {/* Blend Mode */}
          <div className="flex-shrink-0">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
              Modo
            </label>
            <select
              value={transformParams.blendMode}
              onChange={(e) => handleParamChange('blendMode', e.target.value as any)}
              className="w-full text-xs p-1 border border-zinc-200 rounded"
              disabled={!isEnabled}
            >
              <option value="normal">Normal</option>
              <option value="multiply">Mult</option>
              <option value="screen">Screen</option>
              <option value="overlay">Over</option>
              <option value="soft-light">Soft</option>
              <option value="hard-light">Hard</option>
            </select>
          </div>

          {/* Controles Avançados */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left py-1 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 flex items-center justify-between flex-shrink-0"
            disabled={!isEnabled}
          >
            <span>Avançado</span>
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-1 border-t border-zinc-100 flex-shrink-0">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
                  Distorção
                </label>
                <select
                  value={transformParams.distortion}
                  onChange={(e) => handleParamChange('distortion', e.target.value as any)}
                  className="w-full text-xs p-1 border border-zinc-200 rounded"
                  disabled={!isEnabled}
                >
                  <option value="none">Nenhuma</option>
                  <option value="wave">Onda</option>
                  <option value="twist">Torção</option>
                  <option value="ripple">Ripple</option>
                  <option value="stretch">Stretch</option>
                </select>
              </div>

              {transformParams.distortion !== 'none' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600">
                    Intensidade ({(transformParams.distortionIntensity * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={transformParams.distortionIntensity}
                    onChange={(e) => handleParamChange('distortionIntensity', parseFloat(e.target.value))}
                    className="w-full"
                    disabled={!isEnabled}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistortionControls;