export interface UploadState {
  file: File | null;
  isProcessing: boolean;
  progress: number;
  extractedText: string;
  error: string | null;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}
