
import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, GeneratedArt, GenerationParams, ImageTransformParams } from './types';
import { getRandomParams } from './utils/randomizer';
import ControlsPanel from './components/ControlsPanel';
import LeftSidebarControls from './components/LeftSidebarControls';
import PostEditPanel from './components/PostEditPanel';
import { generateArtImage } from './services/geminiService';
import InspirationGallery from './components/InspirationGallery';

console.log('=== CARREGANDO APP ===');

const App: React.FC = () => {
  console.log('=== RENDERIZANDO COMPONENTE APP ===');
  
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  console.log('Status inicial:', status, '(', AppStatus.IDLE, ')');
  
  const [history, setHistory] = useState<GeneratedArt[]>(() => {
    console.log('Inicializando histórico...');
    // Carrega o histórico do localStorage ao iniciar
    const savedHistory = localStorage.getItem('artHistory');
    console.log('Histórico salvo encontrado:', !!savedHistory, '(tipo:', typeof savedHistory, ')');
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
    console.log('Histórico parseado:', parsedHistory.length, 'itens', '(tipo:', typeof parsedHistory, ')');
    return parsedHistory;
  });
  const [currentArt, setCurrentArt] = useState<GeneratedArt | null>(null);
  console.log('CurrentArt inicial:', currentArt, '(tipo:', typeof currentArt, ')');
  
  const [lastGeneratedParams, setLastGeneratedParams] = useState<GenerationParams | null>(null);
  console.log('LastGeneratedParams inicial:', lastGeneratedParams, '(tipo:', typeof lastGeneratedParams, ')');
  
  // Inicializar com parâmetros padrão
  const defaultParams = getRandomParams();
  console.log('DefaultParams gerados:', defaultParams, '(tipo:', typeof defaultParams, ')');
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  console.log('IsEditingExisting inicial:', isEditingExisting, '(tipo:', typeof isEditingExisting, ')');
  
  const [showPostEditPanel, setShowPostEditPanel] = useState(false);
  console.log('ShowPostEditPanel inicial:', showPostEditPanel, '(tipo:', typeof showPostEditPanel, ')');
  
  const [tempTransform, setTempTransform] = useState<ImageTransformParams>({
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
  console.log('TempTransform inicial:', tempTransform, '(tipo:', typeof tempTransform, ')');
  const [error, setError] = useState<string | null>(null);
  console.log('Error inicial:', error, '(tipo:', typeof error, ')');

  // Salva o histórico no localStorage sempre que ele mudar
  useEffect(() => {
    console.log('Salvando histórico no localStorage:', history.length, 'itens', '(tipo:', typeof history, ')');
    localStorage.setItem('artHistory', JSON.stringify(history));
  }, [history]);
  
  // Monitorar mudanças de estado para debug
  useEffect(() => {
    console.log('Estado atualizado - status:', status, '(tipo:', typeof status, ')');
    console.log('Estado atualizado - currentArt:', !!currentArt, '(tipo:', typeof currentArt, ')');
    console.log('Estado atualizado - error:', error, '(tipo:', typeof error, ')');
  }, [status, currentArt, error]);

  const handleGenerate = useCallback(async (customParams?: GenerationParams) => {
    try {
      console.log('=== INICIANDO handleGenerate ===');
      console.log('Parâmetros recebidos:', customParams);
      console.log('Estado atual - status:', status);
      console.log('Estado atual - error:', error);
      
      setStatus(AppStatus.GENERATING);
      setError(null);
      
      console.log('Status definido para GENERATING');
      console.log('Novo status:', AppStatus.GENERATING, '(tipo:', typeof AppStatus.GENERATING, ')');

      // Garantir que temos parâmetros válidos
      const baseParams = getRandomParams();
      console.log('Base params gerados:', baseParams);
      
      const params = customParams ? 
        { ...baseParams, ...customParams } : 
        baseParams;
      
      // Garantir valores padrão para campos críticos
      const safeParams: GenerationParams = {
        ...params,
        resolution: params.resolution || 600,
        elementCount: params.elementCount || 20,
        lineWidth: params.lineWidth || 2,
        opacity: params.opacity || 1,
        colorIntensity: params.colorIntensity || 1,
        textureDensity: params.textureDensity || 0.5,
        imageTransform: params.imageTransform || {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          posX: 0,
          posY: 0,
          opacity: 0.7,
          blendMode: 'normal',
          distortion: 'none',
          distortionIntensity: 0.5
        }
      };
      
      console.log('Parâmetros seguros criados:', safeParams);
      console.log('Chamando generateArtImage...');
      
      const imageUrl = await generateArtImage(safeParams);
      console.log('Imagem gerada com sucesso');

      const newArt: GeneratedArt = {
        id: safeParams.entropy,
        fullImageUrl: imageUrl,
        timestamp: Date.now(),
        promptParams: safeParams
      };

      setCurrentArt(newArt);
      setLastGeneratedParams(safeParams);
      console.log('Tamanho dos promptParams para histórico:', JSON.stringify({ ...newArt, fullImageUrl: undefined }).length, 'caracteres');
      setHistory(prev => {
        const historyItem = { ...newArt, fullImageUrl: undefined };
        if (historyItem.promptParams.uploadedImage) {
          historyItem.promptParams.uploadedImage = {
            ...historyItem.promptParams.uploadedImage,
            url: undefined // Não salvar a URL da imagem carregada no histórico
          };
        }
        return [historyItem, ...prev].slice(0, 5);
      }); // Keep last 5
      setIsEditingExisting(false);
      setStatus(AppStatus.IDLE);
      console.log('Status definido para IDLE');
      console.log('Geração concluída com sucesso');
    } catch (err: any) {
      console.error('Erro na geração:', err);
      setError(err.message || 'Ocorreu um erro inesperado ao gerar a imagem.');
      setStatus(AppStatus.ERROR);
      console.log('Status definido para ERROR');
    }
  }, [status, error]);

  const handleEditExisting = useCallback(async (newImageTransform: ImageTransformParams) => {
    if (!lastGeneratedParams) return;
    
    try {
      setStatus(AppStatus.GENERATING);
      setError(null);
      setIsEditingExisting(true);
      console.log('Iniciando edição existente');

      // Criar novos parâmetros com a transformação atualizada
      const updatedParams = {
        ...lastGeneratedParams,
        imageTransform: newImageTransform,
        // Gerar novo ID para diferenciar da versão anterior
        entropy: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      };

      const imageUrl = await generateArtImage(updatedParams);

      const editedArt: GeneratedArt = {
        id: updatedParams.entropy,
        fullImageUrl: imageUrl,
        timestamp: Date.now(),
        promptParams: updatedParams
      };

      setCurrentArt(editedArt);
      setLastGeneratedParams(updatedParams);
      console.log('Tamanho dos promptParams para histórico (edição):', JSON.stringify({ ...editedArt, fullImageUrl: undefined }).length, 'caracteres');
      setHistory(prev => {
        const historyItem = { ...editedArt, fullImageUrl: undefined };
        if (historyItem.promptParams.uploadedImage) {
          historyItem.promptParams.uploadedImage = {
            ...historyItem.promptParams.uploadedImage,
            url: undefined // Não salvar a URL da imagem carregada no histórico
          };
        }
        return [historyItem, ...prev].slice(0, 5);
      });
      setStatus(AppStatus.IDLE);
      console.log('Edição concluída com sucesso');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao editar a imagem.');
      setStatus(AppStatus.ERROR);
      console.log('Status definido para ERROR na edição');
    }
  }, [lastGeneratedParams]);

  const handleReuseLastImage = useCallback(() => {
    console.log('handleReuseLastImage chamado');
    console.log('lastGeneratedParams:', lastGeneratedParams);
    console.log('uploadedImage existe:', !!lastGeneratedParams?.uploadedImage);
    
    if (lastGeneratedParams?.uploadedImage) {
      console.log('Reutilizando última imagem');
      // Reutilizar a mesma imagem uploaded com novos parâmetros aleatórios
      const newParams = getRandomParams({
        uploadedImage: lastGeneratedParams.uploadedImage,
        imageTransform: lastGeneratedParams.imageTransform
      });
      console.log('Novos parâmetros gerados:', newParams);
      handleGenerate(newParams);
    } else {
      console.log('Nenhuma imagem para reutilizar');
    }
  }, [lastGeneratedParams, handleGenerate]);

  const handleOpenPostEdit = useCallback(() => {
    console.log('handleOpenPostEdit chamado');
    console.log('lastGeneratedParams:', lastGeneratedParams);
    console.log('imageTransform existe:', !!lastGeneratedParams?.imageTransform);
    
    if (lastGeneratedParams?.imageTransform) {
      console.log('Abrindo painel de edição');
      setTempTransform(lastGeneratedParams.imageTransform);
      setShowPostEditPanel(true);
      console.log('Painel de edição aberto');
    } else {
      console.log('Nenhuma transformação para editar');
    }
  }, [lastGeneratedParams]);

  const handleTransformChange = useCallback((newTransform: ImageTransformParams) => {
    console.log('handleTransformChange chamado');
    console.log('Nova transformação:', newTransform);
    setTempTransform(newTransform);
    console.log('TempTransform atualizado');
  }, []);

  const handleApplyPostEdit = useCallback(() => {
    console.log('handleApplyPostEdit chamado');
    console.log('tempTransform:', tempTransform);
    console.log('lastGeneratedParams:', lastGeneratedParams);
    
    if (lastGeneratedParams) {
      console.log('Aplicando edição pós-geração');
      const updatedParams = {
        ...lastGeneratedParams,
        imageTransform: tempTransform
      };
      console.log('Parâmetros atualizados:', updatedParams);
      handleEditExisting(updatedParams);
      setShowPostEditPanel(false);
      console.log('Painel de edição fechado');
    } else {
      console.log('Nenhum parâmetro para aplicar');
    }
  }, [tempTransform, lastGeneratedParams, handleEditExisting]);

  const handleCancelPostEdit = useCallback(() => {
    console.log('handleCancelPostEdit chamado');
    setShowPostEditPanel(false);
    console.log('Painel de edição fechado');
    // Resetar tempTransform para os valores originais
    if (lastGeneratedParams?.imageTransform) {
      console.log('Resetando tempTransform');
      setTempTransform(lastGeneratedParams.imageTransform);
      console.log('TempTransform resetado');
    }
  }, [lastGeneratedParams]);

  const handleDownload = useCallback(() => {
    console.log('handleDownload chamado');
    console.log('currentArt:', currentArt);

    if (!currentArt) {
      console.log('Nenhuma arte para baixar');
      return;
    }

    console.log('Baixando arte:', currentArt.id);
    const link = document.createElement('a');
    link.href = currentArt.fullImageUrl;
    link.download = `abstrato-modernista-${currentArt.id.split('-')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Download concluído');
  }, [currentArt]);

  const handleClearImage = useCallback(() => {
    console.log('handleClearImage chamado');
    setCurrentArt(null);
    console.log('Imagem atual limpa');
  }, []);

  return (
    <div className="min-h-screen paper-texture">
      {/* Debug Info */}
      <div className="fixed top-0 left-0 bg-black text-white text-xs p-2 z-50 pointer-events-none">
        Status: {status} | CurrentArt: {currentArt ? 'Sim' : 'Não'} | Error: {error ? 'Sim' : 'Não'}
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f8f5f2]/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="serif-font text-3xl font-bold tracking-tight">Imagem Centauro</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Lógica Formal • Estética Manual</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log('Botão Gerar Aleatório clicado');
                handleGenerate();
              }}
              disabled={status === AppStatus.GENERATING}
              className={`
                px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all
                ${status === AppStatus.GENERATING 
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                  : 'bg-zinc-900 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-lg shadow-zinc-900/20'}
              `}
            >
              {status === AppStatus.GENERATING ? 'Materializando...' : 'Gerar Aleatório'}
            </button>
            <button
              onClick={() => {
                console.log('Botão Reset clicado');
                const defaultParams = getRandomParams();
                console.log('Default params para reset:', defaultParams);
                handleGenerate(defaultParams);
              }}
              className="px-6 py-3 border-2 border-zinc-900 text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-all rounded-full"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Sidebar: Controls from LeftSidebarControls */}
          <div className="lg:col-span-3 space-y-8">
            <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4 custom-scrollbar flex flex-col h-full">
              <LeftSidebarControls
                onGenerate={handleGenerate}
                currentParams={lastGeneratedParams || defaultParams}
              />
            </div>
          </div>

          {/* Main Stage */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className={`
              relative aspect-square w-full bg-white border border-zinc-200 shadow-2xl overflow-hidden
              flex items-center justify-center transition-all duration-700
              ${status === AppStatus.GENERATING ? 'opacity-50 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100'}
            `}>
              {currentArt ? (
                <img 
                  src={currentArt.fullImageUrl} 
                  alt="Arte Abstrata Gerada" 
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="text-center p-12 flex flex-col items-center">
                  <div className="w-24 h-24 mb-6 border-2 border-zinc-200 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="serif-font text-3xl mb-2">Pronto para criar?</h3>
                  <p className="text-zinc-500 max-w-sm">
                    Clique no botão acima para compor uma imagem abstrata inédita baseada em padrões modernistas europeus.
                  </p>
                </div>
              )}

              {/* Loading Overlay */}
              {status === AppStatus.GENERATING && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40">
                  <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-900">Aplicando Camadas...</p>
                </div>
              )}
            </div>

            {/* Artwork Metadata & Actions */}
            {currentArt && status !== AppStatus.GENERATING && (
              <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="serif-font text-2xl">Série Morpho-{currentArt.id.split('-')[0]}</h2>
                    <p className="text-xs text-zinc-400 font-mono">HASH: {currentArt.id}</p>
                    {isEditingExisting && (
                      <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                        ✨ Versão Editada
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        console.log('Botão Download clicado');
                        handleDownload();
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-zinc-900 text-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PNG
                    </button>
                    {lastGeneratedParams?.uploadedImage && (
                      <button 
                        onClick={() => {
                          console.log('Botão Editar Imagem clicado');
                          handleOpenPostEdit();
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Imagem
                      </button>
                    )}
                    <span className="bg-zinc-100 px-3 py-1 flex items-center rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">
                      {currentArt.promptParams.paperType} • {currentArt.promptParams.compositionType}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border-l-2 border-zinc-100 pl-3">
                    <span className="block text-[10px] uppercase text-zinc-400 font-bold">Elementos</span>
                    <span className="text-lg font-medium">{currentArt.promptParams.elementCount}</span>
                  </div>
                  <div className="border-l-2 border-zinc-100 pl-3 col-span-3">
                    <span className="block text-[10px] uppercase text-zinc-400 font-bold">Paleta Dominante</span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {currentArt.promptParams.colors.map((color, i) => (
                        <span key={i} className="text-xs bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm">
                <strong>Opa!</strong> {error}
              </div>
            )}
          </div>

          {/* Right Sidebar: ControlsPanel (ImageUploader, DistortionControls) and History */}
          <div className="lg:col-span-3 space-y-8">
            {/* Controls Panel (agora mais enxuto) */}
            <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4 custom-scrollbar flex flex-col h-full">
              <ControlsPanel
                onGenerate={handleGenerate}
                currentParams={lastGeneratedParams || defaultParams}
                onClearImage={handleClearImage}
              />
            </div>
            
            {/* History Section */}
            <div>
              <h2 className="serif-font text-2xl mb-6 border-b border-zinc-200 pb-2">Arquivo Recente</h2>
              {history.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((art) => {
                    return (
                      <button 
                        key={art.id}
                        onClick={() => {
                          if (!art.fullImageUrl && art.promptParams) {
                            handleGenerate(art.promptParams);
                          } else {
                            setCurrentArt(art);
                          }
                        }}
                        className={`
                          w-full flex gap-4 p-2 rounded-md border transition-all text-left group
                          ${currentArt?.id === art.id ? 'bg-zinc-100 border-zinc-300' : 'bg-transparent border-transparent hover:bg-zinc-50'}
                        `}
                      >
                        <img src={art.url} className="w-16 h-16 object-cover bg-zinc-200 rounded-sm" alt="Thumbnail" />
                        <div className="flex flex-col justify-center overflow-hidden">
                          <span className="text-xs font-bold uppercase truncate">ID: {art.id.split('-')[0]}</span>
                          <span className="text-[10px] text-zinc-400">{new Date(art.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </button>
                    );
                  })}                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-sm rounded-lg">
                  Nenhuma obra no arquivo ainda.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Edit Panel Modal */}
        <PostEditPanel
          currentTransform={tempTransform}
          onTransformChange={(transform) => {
            console.log('PostEditPanel onTransformChange chamado');
            handleTransformChange(transform);
          }}
          onApplyChanges={() => {
            console.log('PostEditPanel onApplyChanges chamado');
            handleApplyPostEdit();
          }}
          onCancel={() => {
            console.log('PostEditPanel onCancel chamado');
            handleCancelPostEdit();
          }}
          isVisible={showPostEditPanel}
        />

        {/* Separator */}
        <div className="my-20 h-px bg-zinc-200"></div>

        {/* Instructions / Rules Section */}
        <div className="grid md:grid-cols-3 gap-12 py-12">
          <div>
            <span className="text-4xl serif-font italic text-orange-500 mb-4 block">01.</span>
            <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">Abstração Pura</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              O motor recusa qualquer elemento figurativo. Não espere ver rostos ou paisagens; apenas o diálogo entre formas orgânicas e geométricas.
            </p>
          </div>
          <div>
            <span className="text-4xl serif-font italic text-orange-500 mb-4 block">02.</span>
            <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">Materialidade</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Inspirado no método da colagem manual, o sistema simula texturas de papel, rasgos irregulares e a opacidade da tinta guache seca.
            </p>
          </div>
          <div>
            <span className="text-4xl serif-font italic text-orange-500 mb-4 block">03.</span>
            <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">Não-Repetição</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Cada execução combina centenas de variáveis aleatórias controladas (cores, rotações, escalas), garantindo que nenhuma imagem seja igual a outra.
            </p>
          </div>
        </div>

        {/* Inspiration Section */}
        <InspirationGallery />
      </main>

      <footer className="bg-zinc-900 text-white py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="serif-font text-2xl mb-2 italic">Laboratório de Arte Algorítmica</h4>
            <p className="text-zinc-400 text-xs uppercase tracking-widest">Inspirado pela BauHaus e o Surrealismo Abstrato</p>
          </div>
          <div className="text-right text-sm text-zinc-500 max-w-xs md:max-w-md">
            Copywriter 2025 - MDH - Versão 2.0. Desenvolvido por Pvolker
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
