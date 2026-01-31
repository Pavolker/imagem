// Sistema de paletas de cores expandido para o Abstrato Modernista

export interface ColorOption {
  name: string;
  hex: string;
  category: 'primary' | 'secondary' | 'neutral' | 'accent' | 'gradient';
}

export const EXTENDED_COLOR_PALETTE: ColorOption[] = [
  // Cores Primárias Modernistas
  { name: 'Vermelho Vibrante', hex: '#E53835', category: 'primary' },
  { name: 'Azul Cobalto', hex: '#3A86FF', category: 'primary' },
  { name: 'Amarelo Cádmio', hex: '#FFB100', category: 'primary' },
  { name: 'Verde Esmeralda', hex: '#2EC4B6', category: 'primary' },
  { name: 'Laranja Queimado', hex: '#FF9F1C', category: 'primary' },
  { name: 'Violeta Profundo', hex: '#9D4EDD', category: 'primary' },
  
  // Cores Neutras Sofisticadas
  { name: 'Preto Carvão', hex: '#000000', category: 'neutral' },
  { name: 'Branco Giz', hex: '#FFFFFF', category: 'neutral' },
  { name: 'Bege Linho', hex: '#D4A574', category: 'neutral' },
  { name: 'Ocre Terra', hex: '#BF9B7A', category: 'neutral' },
  { name: 'Cinza Neutro', hex: '#8B8680', category: 'neutral' },
  { name: 'Marfim Clássico', hex: '#FFFFF0', category: 'neutral' },
  { name: 'Sepia Antigo', hex: '#704214', category: 'neutral' },
  { name: 'Grafite Médio', hex: '#4A4A4A', category: 'neutral' },
  
  // Cores de Acento
  { name: 'Turquesa Profunda', hex: '#40E0D0', category: 'accent' },
  { name: 'Rosa Quente', hex: '#FF6B9D', category: 'accent' },
  { name: 'Índigo Royal', hex: '#4B0082', category: 'accent' },
  { name: 'Âmbar Dourado', hex: '#FFBF00', category: 'accent' },
  { name: 'Salmão Suave', hex: '#FA8072', category: 'accent' },
  { name: 'Menta Fresca', hex: '#98FB98', category: 'accent' },
  
  // Gradientes (valores iniciais)
  { name: 'Gradiente Solar', hex: 'linear-gradient(45deg, #FFB100, #FF9F1C)', category: 'gradient' },
  { name: 'Gradiente Oceano', hex: 'linear-gradient(135deg, #3A86FF, #2EC4B6)', category: 'gradient' },
  { name: 'Gradiente Pôr do Sol', hex: 'linear-gradient(90deg, #E53835, #9D4EDD)', category: 'gradient' },
  { name: 'Gradiente Terra', hex: 'linear-gradient(180deg, #D4A574, #BF9B7A)', category: 'gradient' }
];

export const PRESET_THEMES = [
  {
    name: 'Bauhaus Clássico',
    colors: ['#E53835', '#3A86FF', '#FFB100', '#000000', '#FFFFFF'],
    description: 'Paleta fundamental do movimento Bauhaus'
  },
  {
    name: 'Minimalismo Nórdico',
    colors: ['#FFFFFF', '#4A4A4A', '#D4A574', '#8B8680', '#F5E6CB'],
    description: 'Tons suaves e elegância escandinava'
  },
  {
    name: 'Expressionismo Abstrato',
    colors: ['#E53835', '#9D4EDD', '#FF9F1C', '#2EC4B6', '#000000'],
    description: 'Cores intensas e emocionais'
  },
  {
    name: 'Geométrico Moderno',
    colors: ['#3A86FF', '#FFB100', '#FFFFFF', '#000000', '#8B8680'],
    description: 'Contrastes fortes e formas puras'
  },
  {
    name: 'Orgânico Terrestre',
    colors: ['#BF9B7A', '#D4A574', '#704214', '#8B8680', '#4A4A4A'],
    description: 'Tons terrosos e naturais'
  }
];

// Função para converter nome de cor para valor hexadecimal
export const getColorHex = (colorName: string): string => {
  const color = EXTENDED_COLOR_PALETTE.find(c => c.name === colorName);
  return color ? color.hex : '#000000';
};

// Função para obter cores por categoria
export const getColorsByCategory = (category: ColorOption['category']): ColorOption[] => {
  return EXTENDED_COLOR_PALETTE.filter(color => color.category === category);
};
