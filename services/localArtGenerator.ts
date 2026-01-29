import { GenerationParams } from '../types';

// Paletas de cores baseadas no estilo modernista europeu
const MODERNIST_COLOR_PALETTE = [
  // Cores primárias
  '#E53835', // Vermelho vibrante
  '#3A86FF', // Azul cobalto
  '#FFB100', // Amarelo cadmio
  
  // Cores secundárias
  '#2EC4B6', // Verde esmeralda
  '#FF9F1C', // Laranja queimado
  '#9D4EDD', // Violeta profundo
  
  // Cores neutras
  '#000000', // Preto carvão
  '#FFFFFF', // Branco giz
  '#D4A574', // Bege linho
  '#BF9B7A', // Ocre terra
  '#8B8680', // Cinza neutro
];

// Tipos de formas geométricas e orgânicas
const SHAPES = {
  geometric: [
    'circle',
    'square',
    'triangle',
    'rectangle',
    'ellipse',
    'polygon',
    'crescent',
    'arc'
  ],
  organic: [
    'blob',
    'wave',
    'curve',
    'swirl',
    'loop',
    'spiral'
  ]
};

/**
 * Gera uma cor aleatória a partir da paleta modernista
 */
const getRandomColor = (): string => {
  return MODERNIST_COLOR_PALETTE[Math.floor(Math.random() * MODERNIST_COLOR_PALETTE.length)];
};

/**
 * Gera uma forma geométrica aleatória
 */
const drawRandomShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shapeType: 'geometric' | 'organic', color: string) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.random() * 3 + 1;
  
  const rotation = Math.random() * Math.PI * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  switch(shapeType) {
    case 'geometric':
      const geoShape = SHAPES.geometric[Math.floor(Math.random() * SHAPES.geometric.length)];
      switch(geoShape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'square':
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'rectangle':
          ctx.fillRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6);
          ctx.strokeRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6);
          break;
        case 'ellipse':
          ctx.beginPath();
          ctx.ellipse(0, 0, size / 2, size / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'polygon':
          const sides = Math.floor(Math.random() * 4) + 5; // 5-8 lados
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const radius = size / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'crescent':
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF'; // Fundo branco para criar o crescente
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(size / 4, 0, size / 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#000000'; // Cor preta para ocultar parte do círculo
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.stroke();
          break;
        case 'arc':
          const startAngle = Math.random() * Math.PI * 2;
          const arcSize = Math.random() * Math.PI * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, startAngle, startAngle + arcSize);
          ctx.stroke();
          break;
      }
      break;
      
    case 'organic':
      const orgShape = SHAPES.organic[Math.floor(Math.random() * SHAPES.organic.length)];
      switch(orgShape) {
        case 'blob':
          ctx.beginPath();
          const points = 8 + Math.floor(Math.random() * 6); // 8-13 pontos
          const radiusVariation = size / 4;
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radius = (size / 2) + (Math.random() - 0.5) * radiusVariation;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'wave':
          ctx.beginPath();
          ctx.moveTo(-size / 2, 0);
          for (let i = -size / 2; i < size / 2; i += 5) {
            const waveHeight = Math.sin(i * 0.1 + rotation) * (size / 6);
            ctx.lineTo(i, waveHeight);
          }
          ctx.stroke();
          break;
        case 'curve':
          ctx.beginPath();
          ctx.moveTo(-size / 2, -size / 4);
          ctx.bezierCurveTo(
            -size / 4, size / 2,
            size / 4, -size / 2,
            size / 2, size / 4
          );
          ctx.stroke();
          break;
        case 'swirl':
          ctx.beginPath();
          for (let i = 0; i < Math.PI * 4; i += 0.1) {
            const radius = i * (size / 20);
            const x = Math.cos(i) * radius;
            const y = Math.sin(i) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          break;
        case 'loop':
          ctx.beginPath();
          ctx.ellipse(0, 0, size / 3, size / 6, rotation, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'spiral':
          ctx.beginPath();
          for (let i = 0; i < Math.PI * 3; i += 0.1) {
            const radius = i * (size / 30);
            const x = Math.cos(i) * radius;
            const y = Math.sin(i) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          break;
      }
      break;
  }
  
  ctx.restore();
};

/**
 * Desenha linhas de conexão irregulares entre formas
 */
const drawConnectionLines = (ctx: CanvasRenderingContext2D, positions: {x: number, y: number}[]) => {
  if (positions.length < 2) return;
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.random() * 2 + 1;
  ctx.lineCap = 'round';
  
  for (let i = 0; i < positions.length - 1; i++) {
    if (Math.random() > 0.3) { // Apenas algumas conexões
      ctx.beginPath();
      ctx.moveTo(positions[i].x, positions[i].y);
      
      // Linha irregular com curvas
      const midX = (positions[i].x + positions[i + 1].x) / 2 + (Math.random() - 0.5) * 50;
      const midY = (positions[i].y + positions[i + 1].y) / 2 + (Math.random() - 0.5) * 50;
      
      ctx.quadraticCurveTo(midX, midY, positions[i + 1].x, positions[i + 1].y);
      ctx.stroke();
    }
  }
};

/**
 * Gera uma textura de papel baseada no tipo especificado
 */
const drawPaperTexture = (ctx: CanvasRenderingContext2D, width: number, height: number, paperType: string) => {
  // Define a cor base do papel
  let baseColor = '#FAF7F0'; // Papel cru por padrão
  if (paperType === 'reciclado') {
    baseColor = '#F0E6D2';
  } else if (paperType === 'envelhecido') {
    baseColor = '#F5E6CB';
  }
  
  // Preenche o fundo com a cor base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);
  
  // Adiciona textura sutil de papel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let i = 0; i < width * height / 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Adiciona alguns "rasgos" irregulares
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const length = Math.random() * 30 + 10;
    const angle = Math.random() * Math.PI * 2;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
    ctx.stroke();
  }
};

/**
 * Gera uma composição abstrata modernista localmente
 */
export const generateLocalArtImage = (params: GenerationParams): Promise<string> => {
  return new Promise((resolve) => {
    // Criar canvas temporário
    const canvas = document.createElement('canvas');
    const size = 600; // Tamanho padrão 1:1
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }
    
    // Desenhar textura de papel
    drawPaperTexture(ctx, size, size, params.paperType);
    
    // Determinar layout com base no tipo de composição
    const positions: {x: number, y: number}[] = [];
    
    // Distribuir elementos com base no tipo de composição
    for (let i = 0; i < params.elementCount; i++) {
      let x, y;
      
      switch(params.compositionType) {
        case 'horizontal':
          x = Math.random() * size * 0.8 + size * 0.1; // Margem de 10% em cada lado
          y = Math.random() * size * 0.6 + size * 0.2; // Concentrar na parte central horizontalmente
          break;
        case 'vertical':
          x = Math.random() * size * 0.6 + size * 0.2; // Concentrar na parte central verticalmente
          y = Math.random() * size * 0.8 + size * 0.1; // Margem de 10% em cada lado
          break;
        case 'radial':
          // Distribuição radial a partir do centro
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * size * 0.35; // Até 35% do raio
          x = size / 2 + Math.cos(angle) * distance;
          y = size / 2 + Math.sin(angle) * distance;
          break;
      }
      
      positions.push({x, y});
    }
    
    // Desenhar formas
    for (let i = 0; i < params.elementCount; i++) {
      const pos = positions[i];
      const sizeFactor = Math.random() * 0.15 + 0.05; // 5-20% do tamanho do canvas
      const elementSize = size * sizeFactor;
      
      // Escolher tipo de forma (geométrica ou orgânica)
      const shapeType = Math.random() > 0.5 ? 'geometric' : 'organic';
      
      // Escolher cor (priorizar as cores dos parâmetros)
      let color = params.colors.length > 0 
        ? params.colors[Math.floor(Math.random() * params.colors.length)]
        : getRandomColor();
      
      // Converter nome da cor para valor hexadecimal se necessário
      if (!color.startsWith('#')) {
        // Mapeamento simplificado de nomes de cores para hexadecimais
        const colorMap: Record<string, string> = {
          'Vermelho vibrante': '#E53835',
          'Azul cobalto': '#3A86FF',
          'Amarelo cadmio': '#FFB100',
          'Verde esmeralda': '#2EC4B6',
          'Laranja queimado': '#FF9F1C',
          'Violeta profundo': '#9D4EDD',
          'Preto carvão': '#000000',
          'Branco giz': '#FFFFFF',
          'Bege linho': '#D4A574',
          'Ocre terra': '#BF9B7A'
        };
        color = colorMap[color] || getRandomColor();
      }
      
      drawRandomShape(ctx, pos.x, pos.y, elementSize, shapeType, color);
    }
    
    // Desenhar linhas de conexão
    drawConnectionLines(ctx, positions);
    
    // Converter canvas para imagem base64
    const imageData = canvas.toDataURL('image/png');
    resolve(imageData);
  });
};