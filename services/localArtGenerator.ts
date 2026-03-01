import { GenerationParams, ImageTransformParams } from '../types';
import { renderSolidToUrl } from './SolidRenderer';

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
 * Aplica transformações e distorções à imagem uploaded
 */
const applyImageTransformations = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: ImageTransformParams,
  canvasWidth: number,
  canvasHeight: number
): void => {
  ctx.save();

  // Aplicar blend mode (converter para tipo compatível)
  const blendModes: Record<string, GlobalCompositeOperation> = {
    'normal': 'source-over',
    'multiply': 'multiply',
    'screen': 'screen',
    'overlay': 'overlay',
    'soft-light': 'soft-light',
    'hard-light': 'hard-light'
  };
  ctx.globalCompositeOperation = blendModes[transform.blendMode] || 'source-over';

  // Aplicar opacidade
  ctx.globalAlpha = transform.opacity;

  // Calcular posição central
  const centerX = canvasWidth / 2 + transform.posX;
  const centerY = canvasHeight / 2 + transform.posY;

  // Aplicar transformações
  ctx.translate(centerX, centerY);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.scaleX, transform.scaleY);

  // Desenhar imagem
  const imgWidth = image.width;
  const imgHeight = image.height;

  // Aplicar distorções
  if (transform.distortion !== 'none' && transform.distortionIntensity > 0) {
    applyDistortionEffects(ctx, image, transform, imgWidth, imgHeight);
  } else {
    // Desenho normal
    ctx.drawImage(
      image,
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
  }

  ctx.restore();
};

/**
 * Aplica efeitos de distorção à imagem
 */
const applyDistortionEffects = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: ImageTransformParams,
  width: number,
  height: number
): void => {
  const intensity = transform.distortionIntensity;

  switch (transform.distortion) {
    case 'wave':
      // Efeito de onda
      for (let y = 0; y < height; y += 2) {
        const waveOffset = Math.sin(y * 0.05) * 10 * intensity;
        ctx.drawImage(
          image,
          0, y, width, 2,
          -width / 2 + waveOffset, y - height / 2, width, 2
        );
      }
      break;

    case 'twist':
      // Efeito de torção
      const twistCenterX = 0;
      const twistCenterY = 0;

      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) + (distance * 0.02 * intensity);
          const twistedX = Math.cos(angle) * distance;
          const twistedY = Math.sin(angle) * distance;

          ctx.drawImage(
            image,
            x, y, 3, 3,
            twistedX - 1.5, twistedY - 1.5, 3, 3
          );
        }
      }
      break;

    case 'ripple':
      // Efeito de ripple
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const rippleX = x + Math.sin(x * 0.1) * 5 * intensity;
          const rippleY = y + Math.cos(y * 0.1) * 5 * intensity;

          ctx.drawImage(
            image,
            x, y, 2, 2,
            rippleX - width / 2, rippleY - height / 2, 2, 2
          );
        }
      }
      break;

    case 'stretch':
      // Efeito de alongamento
      const stretchFactor = 1 + (intensity * 2);
      ctx.drawImage(
        image,
        -width / 2, -height / 2,
        width * stretchFactor, height / stretchFactor
      );
      break;
  }
};

/**
 * Gera uma forma geométrica aleatória
 */
const drawRandomShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shapeType: 'geometric' | 'organic', color: string, params: GenerationParams) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.globalAlpha = params.opacity;
  ctx.lineWidth = params.lineWidth || (Math.random() * 3 + 1);

  const rotation = Math.random() * Math.PI * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Get selected figures from params if available, otherwise use all shapes
  const selectedFigures: any = (params as any).selectedFigures || { geometric: SHAPES.geometric, organic: SHAPES.organic };

  switch (shapeType) {
    case 'geometric':
      // Filter available geometric shapes based on selections
      const availableGeometricShapes = SHAPES.geometric.filter(shape => selectedFigures.geometric.includes(shape));
      // If no shapes selected, use all geometric shapes
      const filteredGeometricShapes = availableGeometricShapes.length > 0 ? availableGeometricShapes : SHAPES.geometric;
      const geoShape = filteredGeometricShapes[Math.floor(Math.random() * filteredGeometricShapes.length)];
      switch (geoShape) {
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
      // Filter available organic shapes based on selections
      const availableOrganicShapes = SHAPES.organic.filter(shape => selectedFigures.organic.includes(shape));
      // If no shapes selected, use all organic shapes
      const filteredOrganicShapes = availableOrganicShapes.length > 0 ? availableOrganicShapes : SHAPES.organic;
      const orgShape = filteredOrganicShapes[Math.floor(Math.random() * filteredOrganicShapes.length)];
      switch (orgShape) {
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
const drawConnectionLines = (ctx: CanvasRenderingContext2D, positions: { x: number, y: number }[]) => {
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
const drawPaperTexture = (ctx: CanvasRenderingContext2D, width: number, height: number, paperType: string, params: GenerationParams) => {
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

  // Adiciona textura sutil de papel com densidade configurável
  const density = params.textureDensity || 0.5;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let i = 0; i < (width * height / 200) * density; i++) {
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
  console.log('=== INICIANDO generateLocalArtImage ===');
  console.log('Parâmetros recebidos:', params);

  return new Promise(async (resolve) => {
    // Criar canvas temporário
    const canvas = document.createElement('canvas');
    const size = params.resolution || 600;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // --- 1. Preparar recursos assíncronos (Sólidos 3D) ---
    // Decidir aleatoriamente quantos e quais sólidos incluir (0 a 3)
    const numSolids = Math.floor(Math.random() * 4);
    const solidImages: HTMLImageElement[] = [];

    if (numSolids > 0) {
      console.log(`Gerando ${numSolids} sólidos platônicos...`);
      const solidTypes = ['tetra', 'octa', 'cube', 'ico', 'dodeca'] as const;

      const solidPromises = Array.from({ length: numSolids }).map(() => {
        const type = solidTypes[Math.floor(Math.random() * solidTypes.length)];
        const hasDual = Math.random() > 0.5; // 50% de chance de ter dual
        const dual = hasDual ? solidTypes[Math.floor(Math.random() * solidTypes.length)] : null;

        // Renderizar com resolução adequada (aprox 40% do tamanho do canvas principal para boa qualidade)
        return renderSolidToUrl(type, dual, Math.floor(size * 0.5));
      });

      try {
        const solidUrls = await Promise.all(solidPromises);

        // Carregar URLs como elementos de imagem
        await Promise.all(solidUrls.map(url => new Promise<void>((resolveImg) => {
          const img = new Image();
          img.onload = () => {
            solidImages.push(img);
            resolveImg();
          };
          img.onerror = () => resolveImg(); // Ignorar erros para não travar
          img.src = url;
        })));
        console.log('Sólidos gerados e carregados.');
      } catch (e) {
        console.error('Erro ao gerar sólidos:', e);
      }
    }

    // --- 2. Iniciar processo de desenho síncrono ---

    // Desenhar textura de papel
    drawPaperTexture(ctx, size, size, params.paperType, params);

    // Compor imagem uploaded se existir
    if (params.uploadedImage && params.imageTransform) {
      const img = new Image();
      img.onload = () => {
        applyImageTransformations(ctx, img, params.imageTransform!, size, size);
        generateShapesWithSolids();
      };
      img.src = params.uploadedImage.url;
    } else {
      generateShapesWithSolids();
    }

    function generateShapesWithSolids() {
      // Determinar layout
      const positions: { x: number, y: number }[] = [];

      // Criar posições
      for (let i = 0; i < params.elementCount; i++) {
        let x, y;
        switch (params.compositionType) {
          case 'horizontal':
            x = Math.random() * size * 0.8 + size * 0.1;
            y = Math.random() * size * 0.6 + size * 0.2;
            break;
          case 'vertical':
            x = Math.random() * size * 0.6 + size * 0.2;
            y = Math.random() * size * 0.8 + size * 0.1;
            break;
          case 'radial':
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * size * 0.35;
            x = size / 2 + Math.cos(angle) * distance;
            y = size / 2 + Math.sin(angle) * distance;
            break;
          default:
            x = size / 2; y = size / 2;
        }
        positions.push({ x, y });
      }

      // Embaralhar índices para distribuir os sólidos aleatoriamente entre as formas
      const indices = Array.from({ length: params.elementCount }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // Get selected figures from params if available, otherwise use all shapes
      const selectedFigures: any = (params as any).selectedFigures || { geometric: SHAPES.geometric, organic: SHAPES.organic };

      // Check if any figures are selected
      const hasSelectedGeometric = selectedFigures.geometric && selectedFigures.geometric.length > 0;
      const hasSelectedOrganic = selectedFigures.organic && selectedFigures.organic.length > 0;
      const hasAnySelectedFigures = hasSelectedGeometric || hasSelectedOrganic;

      // Desenhar formas e sólidos
      let solidIndex = 0;

      for (let i = 0; i < params.elementCount; i++) {
        const pos = positions[i];
        const sizeFactor = Math.random() * 0.15 + 0.05;
        const elementSize = size * sizeFactor;

        // Decidir se desenha um sólido nesta posição
        // Apenas se ainda houver sólidos disponíveis e cair num índice sorteado para ser sólido
        // Ou simplesmente: distribuir os sólidos nos primeiros N índices embaralhados
        const shouldDrawSolid = solidIndex < solidImages.length && Math.random() < 0.15; // 15% de chance por iteração se houver sólidos

        if (shouldDrawSolid) {
          // Desenhar Sólido
          const solidImg = solidImages[solidIndex];
          const solidSize = elementSize * 2.5; // Sólidos um pouco maiores que formas normais

          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(Math.random() * Math.PI * 0.2 - 0.1); // Leve rotação 2D extra
          ctx.globalAlpha = params.opacity * 0.9;
          // Sombra suave para dar destaque
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 5;

          ctx.drawImage(solidImg, -solidSize / 2, -solidSize / 2, solidSize, solidSize);
          ctx.restore();

          solidIndex++;
        } else if (hasAnySelectedFigures) {
          // Only draw shapes if at least one type of figure is selected
          // Determine shape type based on which figures are selected
          let shapeType: 'geometric' | 'organic';

          if (hasSelectedGeometric && hasSelectedOrganic) {
            // If both types are selected, choose randomly
            shapeType = Math.random() > 0.5 ? 'geometric' : 'organic';
          } else if (hasSelectedGeometric) {
            // Only geometric shapes are selected
            shapeType = 'geometric';
          } else {
            // Only organic shapes are selected
            shapeType = 'organic';
          }

          let color = params.colors.length > 0
            ? params.colors[Math.floor(Math.random() * params.colors.length)]
            : getRandomColor();

          if (!color.startsWith('#')) {
            // ... mapa de cores (simplificado aqui para brevidade, mas o ideal é manter ou usar a função getRandomColor se falhar)
            const colorMap: Record<string, string> = {
              'Vermelho vibrante': '#E53835', 'Azul cobalto': '#3A86FF', 'Amarelo cádmio': '#FFB100',
              'Verde esmeralda': '#2EC4B6', 'Laranja queimado': '#FF9F1C', 'Violeta profundo': '#9D4EDD',
              'Preto carvão': '#000000', 'Branco giz': '#FFFFFF', 'Bege linho': '#D4A574', 'Ocre terra': '#BF9B7A'
            };
            color = colorMap[color] || getRandomColor();
          }

          drawRandomShape(ctx, pos.x, pos.y, elementSize, shapeType, color, params);
        }
      }

      // Se sobraram sólidos que não foram desenhados (pela chance aleatória), desenhá-los agora em posições aleatórias extras
      // Only draw remaining solids if there are any selected figures
      if (hasAnySelectedFigures) {
        while (solidIndex < solidImages.length) {
          const solidImg = solidImages[solidIndex];
          const randomX = Math.random() * size * 0.8 + size * 0.1;
          const randomY = Math.random() * size * 0.8 + size * 0.1;
          const solidSize = size * 0.25;

          ctx.save();
          ctx.translate(randomX, randomY);
          ctx.globalAlpha = params.opacity;
          ctx.drawImage(solidImg, -solidSize / 2, -solidSize / 2, solidSize, solidSize);
          ctx.restore();

          solidIndex++;
        }
      }

      // Draw connection lines only if there are selected figures
      if (hasAnySelectedFigures) {
        drawConnectionLines(ctx, positions);
      }

      resolve(canvas.toDataURL('image/png'));
    }
  });
};