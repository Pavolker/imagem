
import { GenerationParams } from "../types";

const COLOR_POOLS = {
  primarias: ['Vermelho vibrante', 'Azul cobalto', 'Amarelo cadmio'],
  secundarias: ['Verde esmeralda', 'Laranja queimado', 'Violeta profundo'],
  neutras: ['Preto carvão', 'Branco giz', 'Bege linho', 'Ocre terra']
};

const PAPER_TYPES: GenerationParams['paperType'][] = ['cru', 'reciclado', 'envelhecido'];
const COMPOSITIONS: GenerationParams['compositionType'][] = ['horizontal', 'vertical', 'radial'];

export const getRandomParams = (): GenerationParams => {
  // Random color selection (3 to 6 colors)
  const allColors = [...COLOR_POOLS.primarias, ...COLOR_POOLS.secundarias, ...COLOR_POOLS.neutras];
  const shuffled = allColors.sort(() => 0.5 - Math.random());
  const selectedColors = shuffled.slice(0, Math.floor(Math.random() * 4) + 3);

  return {
    colors: selectedColors,
    elementCount: Math.floor(Math.random() * (40 - 12 + 1)) + 12,
    compositionType: COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)],
    paperType: PAPER_TYPES[Math.floor(Math.random() * PAPER_TYPES.length)],
    entropy: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  };
};
