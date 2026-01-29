
import { GenerationParams } from "../types";
import { generateLocalArtImage } from "./localArtGenerator";

/**
 * Função auxiliar para adicionar a assinatura via Canvas para garantir precisão do texto.
 */
const applySignature = async (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      // Desenha a imagem original
      ctx.drawImage(img, 0, 0);

      // Configurações da assinatura
      const fontSize = Math.max(12, Math.floor(canvas.width * 0.015));
      ctx.font = `${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const text = "Copywriter - Pvolker - Sistema Centauro";
      const margin = fontSize;

      // Sombra leve para legibilidade em fundos variados
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillText(text, canvas.width - margin + 1, canvas.height - margin + 1);

      // Texto principal (ocre escuro ou cinza para ser discreto e modernista)
      ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
      ctx.fillText(text, canvas.width - margin, canvas.height - margin);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = base64Image;
  });
};

export const generateArtImage = async (params: GenerationParams): Promise<string> => {
  // Geração local de imagens (única opção disponível)
  const localImage = await generateLocalArtImage(params);

  // Verificar se a imagem local foi gerada corretamente antes de aplicar a assinatura
  if (!localImage || localImage === '') {
    throw new Error("Falha ao gerar imagem localmente");
  }

  return await applySignature(localImage);
};
