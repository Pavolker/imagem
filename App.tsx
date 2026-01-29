
import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, GeneratedArt } from './types';
import { getRandomParams } from './utils/randomizer';
import { generateArtImage } from './services/geminiService';
import InspirationGallery from './components/InspirationGallery';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [history, setHistory] = useState<GeneratedArt[]>(() => {
    // Carrega o histórico do localStorage ao iniciar
    const savedHistory = localStorage.getItem('artHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentArt, setCurrentArt] = useState<GeneratedArt | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Salva o histórico no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('artHistory', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    try {
      setStatus(AppStatus.GENERATING);
      setError(null);

      const params = getRandomParams();
      const imageUrl = await generateArtImage(params);

      const newArt: GeneratedArt = {
        id: params.entropy,
        url: imageUrl,
        timestamp: Date.now(),
        promptParams: params
      };

      setCurrentArt(newArt);
      setHistory(prev => [newArt, ...prev].slice(0, 10)); // Keep last 10
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro inesperado ao gerar a imagem.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!currentArt) return;
    
    const link = document.createElement('a');
    link.href = currentArt.url;
    link.download = `abstrato-modernista-${currentArt.id.split('-')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f8f5f2]/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="serif-font text-3xl font-bold tracking-tight">Abstrato Modernista</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Lógica Formal • Estética Manual</span>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={status === AppStatus.GENERATING}
            className={`
              px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all
              ${status === AppStatus.GENERATING 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                : 'bg-zinc-900 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-lg shadow-zinc-900/20'}
            `}
          >
            {status === AppStatus.GENERATING ? 'Materializando...' : 'Gerar Obra Única'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Stage */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className={`
              relative aspect-square w-full bg-white border border-zinc-200 shadow-2xl overflow-hidden
              flex items-center justify-center transition-all duration-700
              ${status === AppStatus.GENERATING ? 'opacity-50 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100'}
            `}>
              {currentArt ? (
                <img 
                  src={currentArt.url} 
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
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 border border-zinc-900 text-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PNG
                    </button>
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

          {/* Sidebar: History */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h2 className="serif-font text-2xl mb-6 border-b border-zinc-200 pb-2">Arquivo Recente</h2>
              {history.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((art) => (
                    <button 
                      key={art.id}
                      onClick={() => setCurrentArt(art)}
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
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-sm rounded-lg">
                  Nenhuma obra no arquivo ainda.
                </div>
              )}
            </div>
          </div>
        </div>

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
          <div className="text-right text-[10px] text-zinc-500 max-w-xs md:max-w-md">
            ESTE APLICATIVO UTILIZA O MODELO GEMINI-2.5-FLASH-IMAGE PARA MATERIALIZAR COMPOSIÇÕES BASEADAS EM UM LÉXICO VISUAL MODERNO. TODAS AS IMAGENS SÃO ÚNICAS E GERADAS EM TEMPO REAL.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
