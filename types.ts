
export enum ConversionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type ToolType = 'PDF_TO_IMAGE' | 'IMAGE_TO_PDF' | 'MERGE_PDF' | 'SPLIT_PDF' | 'COMPRESS_PDF' | 'OCR_PDF';

export interface FileMetadata {
  name: string;
  size: number;
  totalPages?: number;
}

export interface ConversionConfig {
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  scale: number;
}

export interface PDFOutputConfig {
  quality: 'low' | 'medium' | 'high';
  dpi: number;
  layout: 'fit' | 'a4';
}
