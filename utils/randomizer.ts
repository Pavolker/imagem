
import { GenerationParams } from "../types";

const COLOR_POOLS = {
  primarias: ['Vermelho vibrante', 'Azul cobalto', 'Amarelo cadmio'],
  secundarias: ['Verde esmeralda', 'Laranja queimado', 'Violeta profundo'],
  neutras: ['Preto carvão', 'Branco giz', 'Bege linho', 'Ocre terra']
};

const PAPER_TYPES: GenerationParams['paperType'][] = ['cru', 'reciclado', 'envelhecido'];
const COMPOSITIONS: GenerationParams['compositionType'][] = ['horizontal', 'vertical', 'radial'];

export const getRandomParams = (customParams?: Partial<GenerationParams>): GenerationParams => {
  // Random color selection (3 to 6 colors)
  const allColors = [...COLOR_POOLS.primarias, ...COLOR_POOLS.secundarias, ...COLOR_POOLS.neutras];
  const shuffled = allColors.sort(() => 0.5 - Math.random());
  const selectedColors = shuffled.slice(0, Math.floor(Math.random() * 4) + 3);

  return {
    colors: customParams?.colors || selectedColors,
    elementCount: customParams?.elementCount || Math.floor(Math.random() * (40 - 12 + 1)) + 12,
    compositionType: customParams?.compositionType || COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)],
    paperType: customParams?.paperType || PAPER_TYPES[Math.floor(Math.random() * PAPER_TYPES.length)],
    entropy: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    resolution: customParams?.resolution || 600,
    lineWidth: customParams?.lineWidth || (Math.random() * 4 + 1),
    opacity: customParams?.opacity || (Math.random() * 0.7 + 0.3),
    colorIntensity: customParams?.colorIntensity || (Math.random() * 0.8 + 0.2),
    textureDensity: customParams?.textureDensity || (Math.random() * 0.8 + 0.2)
  };
};
