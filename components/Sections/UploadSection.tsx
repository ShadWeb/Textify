"use client";

import React, { useState, useRef, useCallback } from "react";
import { UploadState } from "../../types";
import Button from "../UI/Button";
import {
  Upload,
  Copy,
  Download,
  Languages,
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";

interface TranslationState {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  isTranslating: boolean;
}

const UploadSection: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isProcessing: false,
    progress: 0,
    extractedText: "",
    error: null,
  });

  const [translationState, setTranslationState] = useState<TranslationState>({
    translatedText: "",
    sourceLang: "auto",
    targetLang: "en",
    isTranslating: false,
  });

  const [showTranslationPanel, setShowTranslationPanel] =
    useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: "en", name: "انگلیسی" },
    { code: "fr", name: "فرانسوی" },
    { code: "de", name: "آلمانی" },
    { code: "es", name: "اسپانیایی" },
    { code: "ar", name: "عربی" },
    { code: "ru", name: "روسی" },
    { code: "zh", name: "چینی" },
    { code: "ja", name: "ژاپنی" },
    { code: "ko", name: "کره‌ای" },
    { code: "fa", name: "فارسی" },
  ];

  const processImageWithOCR = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    return await processWithTesseract(formData);
  };

  const processWithTesseract = async (formData: FormData): Promise<string> => {
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker({
        logger: (m) => {
          if (m.status === "recognizing text") {
            const progress = Math.round(m.progress * 100);
            setUploadState((prev) => ({
              ...prev,
              progress: Math.min(90, progress),
            }));
          }
        },
      });

      await worker.loadLanguage("fas+eng");
      await worker.initialize("fas+eng");
      const file = formData.get("image") as File;
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();
      return text.trim();
    } catch (error) {
      console.error("Tesseract error:", error);
      throw new Error("خطا در پردازش تصویر با Tesseract");
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      setUploadState((prev) => ({
        ...prev,
        error: "فقط فایل‌های JPG, PNG, WEBP, BMP, GIF مجاز هستند",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadState((prev) => ({
        ...prev,
        error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
      }));
      return;
    }

    setUploadState({
      file,
      error: null,
      isProcessing: true,
      progress: 0,
      extractedText: "",
    });

    setTranslationState({
      translatedText: "",
      sourceLang: "auto",
      targetLang: "en",
      isTranslating: false,
    });

    setShowTranslationPanel(false);

    try {
      const progressInterval = setInterval(() => {
        setUploadState((prev) => {
          if (prev.progress >= 50 || !prev.isProcessing) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 5 };
        });
      }, 500);

      const extractedText = await processImageWithOCR(file);
      clearInterval(progressInterval);

      setUploadState((prev) => ({
        ...prev,
        progress: 100,
      }));

      setTimeout(() => {
        setUploadState({
          file,
          isProcessing: false,
          progress: 100,
          extractedText,
          error: null,
        });
      }, 300);
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        error:
          error instanceof Error
            ? error.message
            : "خطای ناشناخته در پردازش تصویر",
      }));
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      if (e.target) e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleCopyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("متن با موفقیت کپی شد");
    } catch (err) {
      console.error("Failed to copy text:", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("متن با موفقیت کپی شد");
    }
  }, []);

  const downloadTextFile = useCallback(
    (
      text: string,
      format: "txt" | "docx",
      filename: string = "extracted-text"
    ) => {
      const element = document.createElement("a");
      const blob = new Blob([text], {
        type:
          format === "txt"
            ? "text/plain;charset=utf-8"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      element.href = URL.createObjectURL(blob);
      element.download = `${filename}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    []
  );

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      isProcessing: false,
      progress: 0,
      extractedText: "",
      error: null,
    });
    setTranslationState({
      translatedText: "",
      sourceLang: "auto",
      targetLang: "en",
      isTranslating: false,
    });
    setShowTranslationPanel(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleTranslate = useCallback(
    async (sourceLang: string = "auto", targetLang: string = "en") => {
      if (!uploadState.extractedText.trim()) {
        alert("متن برای ترجمه خالی است");
        return;
      }

      setTranslationState((prev) => ({
        ...prev,
        isTranslating: true,
        sourceLang,
        targetLang,
      }));

      try {
        const textToTranslate = uploadState.extractedText;
        const response = await translateWithGoogleAPI(
          textToTranslate,
          targetLang
        );

        setTranslationState((prev) => ({
          ...prev,
          translatedText: response,
          isTranslating: false,
        }));

        setShowTranslationPanel(true);
      } catch (error) {
        console.error("Translation error:", error);
        try {
          const fallbackResponse = await translateWithFallbackAPI(
            uploadState.extractedText,
            targetLang
          );
          setTranslationState((prev) => ({
            ...prev,
            translatedText: fallbackResponse,
            isTranslating: false,
          }));
          setShowTranslationPanel(true);
        } catch (fallbackError) {
          alert("خطا در ترجمه متن. لطفاً دوباره تلاش کنید.");
          setTranslationState((prev) => ({
            ...prev,
            isTranslating: false,
          }));
        }
      }
    },
    [uploadState.extractedText]
  );

  const translateWithGoogleAPI = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        return data[0].map((item: any[]) => item[0]).join("");
      }

      throw new Error("فرمت پاسخ نامعتبر است");
    } catch (error) {
      console.error("Google Translate API error:", error);
      throw error;
    }
  };

  const translateWithFallbackAPI = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ Text: text }]),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0]?.translations[0]?.text || text;
    } catch (error) {
      console.error("Fallback translation error:", error);
      return `متن ترجمه شده (شبیه‌سازی): ${text.substring(0, 100)}...`;
    }
  };

  const toggleTranslationPanel = useCallback(() => {
    setShowTranslationPanel((prev) => !prev);
  }, []);

  // شرط برای نمایش آپلود باکس
  const shouldShowUploadBox =
    !uploadState.file && !uploadState.extractedText && !uploadState.error;

  return (
    <section className="py-16 sm:py-24 bg-slate-100 rounded-2xl dark:bg-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-8">
        {/* Upload Zone - فقط وقتی نمایش داده می‌شود که فایلی آپلود نشده باشد */}
        {shouldShowUploadBox && (
          <div
            className={`w-full flex flex-col items-center gap-6 rounded-xl border-2 border-dashed transition-all duration-300 px-6 py-14 cursor-pointer
              ${
                isDragActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-slate-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50"
              }
              bg-white dark:bg-slate-800 shadow-sm hover:shadow-md`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={`transition-colors duration-300 ${
                isDragActive ? "text-primary" : "text-slate-400"
              }`}
            >
              {isDragActive ? (
                <Upload className="w-16 h-16 animate-pulse" />
              ) : (
                <ImageIcon className="w-16 h-16" />
              )}
            </div>
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
                {isDragActive
                  ? "فایل را رها کنید"
                  : "فایل را اینجا بکشید یا انتخاب کنید"}
              </p>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                فایل تصویری خود را آپلود کنید (JPG, PNG, WEBP, BMP, GIF) -
                حداکثر ۱۰ مگابایت
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              icon={<Upload className="w-4 h-4" />}
            >
              انتخاب فایل
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.bmp,.gif"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}

        {/* Progress Bar */}
        {uploadState.isProcessing && (
          <div className="w-full flex-col rounded-2xl gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex gap-6 justify-between items-center">
              <p className="text-base font-medium text-slate-900 dark:text-white">
                در حال پردازش تصویر و استخراج متن...
              </p>
              <span className="text-base font-medium text-primary">
                {uploadState.progress}%
              </span>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center transition-colors duration-300">
            <p className="text-red-700 dark:text-red-300 font-medium">
              {uploadState.error}
            </p>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={resetUpload} size="sm">
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        {/* Extracted Text Section */}
        {uploadState.extractedText && !uploadState.isProcessing && (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                متن استخراج شده از تصویر
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={toggleTranslationPanel}
                  icon={<Languages className="w-4 h-4" />}
                >
                  {showTranslationPanel ? "بستن ترجمه" : "ترجمه متن"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetUpload}
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                >
                  آپلود جدید
                </Button>
              </div>
            </div>

            {/* دو بخش کنار هم - شبیه گوگل ترنسلیت */}
            <div
              className={`grid gap-6 ${
                showTranslationPanel
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              } transition-all duration-300`}
            >
              {/* بخش متن اصلی */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    متن اصلی
                  </label>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(uploadState.extractedText)}
                      icon={<Copy className="w-4 h-4" />}
                    >
                      کپی
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                    value={uploadState.extractedText}
                    readOnly
                    placeholder="متن استخراج شده از تصویر در اینجا نمایش داده می‌شود..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadTextFile(
                        uploadState.extractedText,
                        "txt",
                        "متن-استخراج-شده"
                      )
                    }
                    icon={<FileText className="w-4 h-4" />}
                    size="sm"
                  >
                    دانلود TXT
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadTextFile(
                        uploadState.extractedText,
                        "docx",
                        "متن-استخراج-شده"
                      )
                    }
                    icon={<FileCode className="w-4 h-4" />}
                    size="sm"
                  >
                    دانلود DOCX
                  </Button>
                </div>
              </div>

              {/* بخش ترجمه */}
              {showTranslationPanel && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      متن ترجمه شده
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                        value={translationState.targetLang}
                        onChange={(e) =>
                          handleTranslate("auto", e.target.value)
                        }
                        disabled={translationState.isTranslating}
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopyText(translationState.translatedText)
                        }
                        icon={<Copy className="w-4 h-4" />}
                        disabled={!translationState.translatedText}
                      >
                        کپی
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                      value={
                        translationState.isTranslating
                          ? "در حال ترجمه..."
                          : translationState.translatedText
                      }
                      readOnly
                      placeholder="متن ترجمه شده در اینجا نمایش داده می‌شود..."
                    />
                    {translationState.isTranslating && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-primary">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="text-sm font-medium">
                            در حال ترجمه...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadTextFile(
                          translationState.translatedText,
                          "txt",
                          "متن-ترجمه-شده"
                        )
                      }
                      icon={<FileText className="w-4 h-4" />}
                      size="sm"
                      disabled={!translationState.translatedText}
                    >
                      TXT ترجمه
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadTextFile(
                          translationState.translatedText,
                          "docx",
                          "متن-ترجمه-شده"
                        )
                      }
                      icon={<FileCode className="w-4 h-4" />}
                      size="sm"
                      disabled={!translationState.translatedText}
                    >
                      DOCX ترجمه
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* دکمه‌های ترجمه در حالت بسته بودن پنل */}
            {!showTranslationPanel && (
              <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="primary"
                  onClick={() => handleTranslate("auto", "en")}
                  icon={<Languages className="w-4 h-4" />}
                  disabled={translationState.isTranslating}
                >
                  ترجمه به انگلیسی
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleTranslate("auto", "fr")}
                  icon={<Languages className="w-4 h-4" />}
                  disabled={translationState.isTranslating}
                >
                  ترجمه به فرانسوی
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleTranslate("auto", "de")}
                  icon={<Languages className="w-4 h-4" />}
                  disabled={translationState.isTranslating}
                >
                  ترجمه به آلمانی
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
