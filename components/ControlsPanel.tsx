import React, { useState } from 'react';
import { GenerationParams, UploadedImage, ImageTransformParams } from '../types';
import { EXTENDED_COLOR_PALETTE, PRESET_THEMES, getColorsByCategory } from '../utils/colorPalette';
import PreviewPanel from './PreviewPanel';
import ImageUploader from './ImageUploader';
import DistortionControls from './DistortionControls';

interface ControlsPanelProps {
  onGenerate: (params: GenerationParams) => void;
  currentParams: GenerationParams;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ onGenerate, currentParams }) => {
  console.log('ControlsPanel: Recebendo currentParams:', currentParams);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
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
  const [selectedColors, setSelectedColors] = useState<string[]>(currentParams.colors);
  const [manualParams, setManualParams] = useState<Partial<GenerationParams>>({
    elementCount: currentParams.elementCount,
    compositionType: currentParams.compositionType,
    paperType: currentParams.paperType,
    resolution: currentParams.resolution,
    lineWidth: currentParams.lineWidth,
    opacity: currentParams.opacity,
    colorIntensity: currentParams.colorIntensity,
    textureDensity: currentParams.textureDensity
  });

  const handleColorToggle = (colorName: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorName)) {
        return prev.filter(c => c !== colorName);
      } else {
        return [...prev, colorName].slice(0, 8); // Máximo de 8 cores
      }
    });
  };

  const applyPreset = (presetColors: string[]) => {
    setSelectedColors(presetColors);
    setManualParams(prev => ({
      ...prev,
      colors: presetColors
    }));
  };

  const handleParamChange = (param: keyof GenerationParams, value: any) => {
    setManualParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

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
        manualParams,
        selectedColors,
        uploadedImage,
        imageTransform
      });
      
      const finalParams: GenerationParams = {
        ...currentParams,
        ...manualParams,
        colors: selectedColors,
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
    ...manualParams,
    colors: selectedColors,
    uploadedImage: uploadedImage,
    imageTransform: imageTransform
  } as GenerationParams;

  return (
    <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
      <h3 className="serif-font text-xl mb-4">Controles Criativos</h3>
      
      {/* Upload de Imagem */}
      <div className="mb-6">
        <ImageUploader 
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          currentImage={uploadedImage}
        />
      </div>
      
      {/* Controles de Distorção */}
      <div className="mb-6">
        <DistortionControls
          transformParams={imageTransform}
          onTransformChange={handleTransformChange}
          isEnabled={!!uploadedImage}
        />
      </div>
      
      {/* Presets de Tema */}
      <div className="mb-6">
        <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-zinc-600">Temas Pré-definidos</h4>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_THEMES.map((theme, index) => (
            <button
              key={index}
              onClick={() => applyPreset(theme.colors)}
              className="text-left p-2 border border-zinc-200 rounded text-xs hover:bg-zinc-50 transition-colors"
            >
              <div className="font-medium">{theme.name}</div>
              <div className="text-zinc-500 mt-1 text-[10px]">{theme.description}</div>
              <div className="flex gap-1 mt-2">
                {theme.colors.slice(0, 3).map((color, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-full border border-zinc-300" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Seleção de Cores */}
      <div className="mb-6">
        <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-zinc-600">
          Paleta de Cores ({selectedColors.length}/8 selecionadas)
        </h4>
        <div className="space-y-3">
          {(['primary', 'neutral', 'accent'] as const).map(category => (
            <div key={category}>
              <div className="text-xs font-medium text-zinc-500 mb-2 capitalize">{category}</div>
              <div className="flex flex-wrap gap-2">
                {getColorsByCategory(category).map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.name)
                        ? 'border-zinc-900 scale-110'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles Básicos */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
            Elementos ({manualParams.elementCount})
          </label>
          <input
            type="range"
            min="5"
            max="60"
            value={manualParams.elementCount || 20}
            onChange={(e) => handleParamChange('elementCount', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
            Resolução ({manualParams.resolution}px)
          </label>
          <select
            value={manualParams.resolution || 600}
            onChange={(e) => handleParamChange('resolution', parseInt(e.target.value))}
            className="w-full text-sm p-2 border border-zinc-200 rounded"
          >
            <option value={600}>600px (Padrão)</option>
            <option value={800}>800px (Alta)</option>
            <option value={1000}>1000px (Muito Alta)</option>
            <option value={1200}>1200px (Ultra)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
            Composição
          </label>
          <select
            value={manualParams.compositionType || 'horizontal'}
            onChange={(e) => handleParamChange('compositionType', e.target.value)}
            className="w-full text-sm p-2 border border-zinc-200 rounded"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
            Textura do Papel
          </label>
          <select
            value={manualParams.paperType || 'cru'}
            onChange={(e) => handleParamChange('paperType', e.target.value)}
            className="w-full text-sm p-2 border border-zinc-200 rounded"
          >
            <option value="cru">Cru</option>
            <option value="reciclado">Reciclado</option>
            <option value="envelhecido">Envelhecido</option>
          </select>
        </div>
      </div>

      {/* Controles Avançados */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 mb-3 flex items-center justify-between"
      >
        <span>Controles Avançados</span>
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
        <div className="space-y-4 pt-2 border-t border-zinc-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
              Espessura da Linha ({manualParams.lineWidth?.toFixed(1)})
            </label>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={manualParams.lineWidth || 2}
              onChange={(e) => handleParamChange('lineWidth', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
              Opacidade ({(manualParams.opacity || 1).toFixed(1)})
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={manualParams.opacity || 1}
              onChange={(e) => handleParamChange('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
              Intensidade das Cores ({(manualParams.colorIntensity || 1).toFixed(1)})
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={manualParams.colorIntensity || 1}
              onChange={(e) => handleParamChange('colorIntensity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-600">
              Densidade da Textura ({(manualParams.textureDensity || 0.5).toFixed(1)})
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={manualParams.textureDensity || 0.5}
              onChange={(e) => handleParamChange('textureDensity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Preview Toggle */}
      <div className="flex items-center justify-between mb-4 pt-2 border-t border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Preview</span>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            showPreview ? 'bg-orange-500' : 'bg-zinc-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showPreview ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Preview Panel */}
      <PreviewPanel params={previewParams} isVisible={showPreview} />

      {/* Botão de Geração */}
      <button
        onClick={() => {
          console.log('Botão Gerar com Configurações clicado');
          handleGenerate();
        }}
        className="w-full mt-6 px-4 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors rounded-full"
      >
        Gerar com Configurações
      </button>
    </div>
  );
};

export default ControlsPanel;