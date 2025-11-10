export interface UploadState {
  file: File | null;
  isProcessing: boolean;
  progress: number;
  extractedText: string;
  error: string | null;
}

export interface TranslationState {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  isTranslating: boolean;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
}