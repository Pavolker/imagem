
export interface GeneratedArt {
  id: string;
  url?: string;
  thumbnailUrl?: string;
  fullImageUrl?: string;
  timestamp: number;
  promptParams: GenerationParams;
}

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface ImageTransformParams {
  scaleX: number;
  scaleY: number;
  rotation: number;
  posX: number;
  posY: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
  distortion: 'none' | 'wave' | 'twist' | 'ripple' | 'stretch';
  distortionIntensity: number;
}

export interface GenerationParams {
  colors: string[];
  elementCount: number;
  compositionType: 'horizontal' | 'vertical' | 'radial';
  paperType: 'cru' | 'reciclado' | 'envelhecido';
  entropy: string;
  resolution: number;
  lineWidth: number;
  opacity: number;
  colorIntensity: number;
  textureDensity: number;
  uploadedImage?: UploadedImage;
  imageTransform?: ImageTransformParams;
}

export enum AppStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  ERROR = 'error'
}
