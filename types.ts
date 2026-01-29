
export interface GeneratedArt {
  id: string;
  url: string;
  timestamp: number;
  promptParams: GenerationParams;
}

export interface GenerationParams {
  colors: string[];
  elementCount: number;
  compositionType: 'horizontal' | 'vertical' | 'radial';
  paperType: 'cru' | 'reciclado' | 'envelhecido';
  entropy: string;
}

export enum AppStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  ERROR = 'error'
}
