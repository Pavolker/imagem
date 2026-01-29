
import React from 'react';

const InspirationGallery: React.FC = () => {
  const examples = [
    { url: 'https://picsum.photos/seed/abstrato1/600/600', label: 'Equilíbrio Cromático' },
    { url: 'https://picsum.photos/seed/abstrato2/600/600', label: 'Tensão de Formas' },
    { url: 'https://picsum.photos/seed/abstrato3/600/600', label: 'Signos Gráficos' },
    { url: 'https://picsum.photos/seed/abstrato4/600/600', label: 'Textura e Vazio' },
  ];

  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="serif-font text-4xl mb-8 border-b border-zinc-200 pb-4">Inspirações</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {examples.map((ex, idx) => (
            <div key={idx} className="group cursor-pointer overflow-hidden rounded-sm">
              <div className="relative aspect-square overflow-hidden bg-zinc-100 border border-zinc-200">
                <img 
                  src={ex.url} 
                  alt={ex.label}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium uppercase tracking-widest">{ex.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-zinc-500 text-sm max-w-2xl">
          * As imagens acima são referências conceituais de equilíbrio, paleta e textura que guiam o motor de geração. Cada obra criada pelo aplicativo é única e nunca repetirá estes exatos padrões.
        </p>
      </div>
    </div>
  );
};

export default InspirationGallery;
