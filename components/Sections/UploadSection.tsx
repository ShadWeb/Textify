import React, { useState, useRef, useCallback } from "react";
import { UploadState } from "../../types";
import Button from "../UI/Button";

// اضافه کردن نوع برای پاسخ API
interface OCRResponse {
  text: string;
  confidence?: number;
  error?: string;
}

const UploadSection: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isProcessing: false,
    progress: 0,
    extractedText: "",
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // تابع برای ارسال تصویر به API OCR
  const processImageWithOCR = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    // شما می‌توانید از یکی از سرویس‌های زیر استفاده کنید:

    // گزینه ۱: استفاده از Tesseract.js (رایگان - کلاینت‌ساید)
    // return await processWithTesseract(formData);

    // گزینه ۲: استفاده از API خارجی (نیاز به API Key)
    return await processWithTesseract(formData);
  };

  // پردازش با Tesseract.js (رایگان)
  const processWithTesseract = async (formData: FormData): Promise<string> => {
    try {
      const { createWorker } = await import("tesseract.js");

      const worker = await createWorker({
        logger: (m) => console.log(m), // اختیاری برای نمایش پیشرفت
      });

      // مرحله ۱: بارگذاری زبان
      await worker.loadLanguage("fas+eng"); // فارسی + انگلیسی

      // مرحله ۲: فعال‌سازی زبان
      await worker.initialize("fas+eng");

      const file = formData.get("image") as File;

      // مرحله ۳: انجام OCR
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

  // پردازش با API خارجی (مثال: OCR.space)
  const processWithExternalAPI = async (
    formData: FormData
  ): Promise<string> => {
    try {
      // برای استفاده از این API نیاز به کلید API دارید
      const API_KEY = process.env.REACT_APP_OCR_API_KEY; // کلید API در env variables
      const API_URL = "https://api.ocr.space/parse/image";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY || "helloworld", // جایگزین کنید با کلید واقعی
        },
        body: formData,
      });

      const data = await response.json();

      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage || "خطا در پردازش تصویر");
      }

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        return data.ParsedResults[0].ParsedText.trim();
      }

      throw new Error("نتیجه‌ای از OCR دریافت نشد");
    } catch (error) {
      console.error("API OCR error:", error);
      throw new Error("خطا در ارتباط با سرویس OCR");
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    // اعتبارسنجی نوع فایل
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

    // اعتبارسنجی سایز فایل (حداکثر ۱۰ مگابایت)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState((prev) => ({
        ...prev,
        error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
      }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      file,
      error: null,
      isProcessing: true,
      progress: 0,
      extractedText: "",
    }));

    try {
      // شبیه‌سازی پیشرفت
      const progressInterval = setInterval(() => {
        setUploadState((prev) => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          const newProgress = prev.progress + 10;
          return { ...prev, progress: newProgress };
        });
      }, 300);

      // پردازش واقعی تصویر
      const extractedText = await processImageWithOCR(file);

      clearInterval(progressInterval);

      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        isProcessing: false,
        extractedText: extractedText || "متنی در تصویر شناسایی نشد.",
      }));
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
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // ریست کردن input برای امکان انتخاب فایل تکراری
      if (e.target) {
        e.target.value = "";
      }
    },
    [handleFileSelect]
  );

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uploadState.extractedText);
      alert("متن با موفقیت کپی شد");
    } catch (err) {
      console.error("Failed to copy text:", err);
      // فال‌بک برای مرورگرهای قدیمی
      const textArea = document.createElement("textarea");
      textArea.value = uploadState.extractedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("متن با موفقیت کپی شد");
    }
  }, [uploadState.extractedText]);

  const downloadTextFile = useCallback(
    (format: "txt" | "docx") => {
      const element = document.createElement("a");

      if (format === "txt") {
        const blob = new Blob([uploadState.extractedText], {
          type: "text/plain;charset=utf-8",
        });
        element.href = URL.createObjectURL(blob);
        element.download = `extracted-text.${format}`;
      } else {
        // برای DOCX نیاز به کتابخانه اضافی دارید
        // فعلاً همان TXT دانلود می‌شود
        const blob = new Blob([uploadState.extractedText], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        element.href = URL.createObjectURL(blob);
        element.download = `extracted-text.${format}`;
      }

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    [uploadState.extractedText]
  );

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      isProcessing: false,
      progress: 0,
      extractedText: "",
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50"
      id="upload-tool"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center gap-8">
          {/* Upload Zone */}
          <div
            className="w-full flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-14 bg-background-light dark:bg-background-dark cursor-pointer hover:border-primary/50 transition-colors duration-200"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-primary">
              <span className="material-symbols-outlined text-6xl">
                cloud_upload
              </span>
            </div>
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
                فایل را اینجا بکشید یا انتخاب کنید
              </p>
              <p className="text-sm font-normal leading-normal text-center text-slate-500 dark:text-slate-400">
                فایل تصویری خود را آپلود کنید (JPG, PNG, WEBP, BMP, GIF)
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
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

          {/* Progress Bar */}
          {uploadState.isProcessing && (
            <div className="w-full flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-base font-medium leading-normal">
                  در حال پردازش تصویر و استخراج متن...
                </p>
                <span className="text-base font-medium leading-normal">
                  {uploadState.progress}%
                </span>
              </div>
              <div className="rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadState.error && (
            <div className="w-full p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-center">
                {uploadState.error}
              </p>
              <div className="flex justify-center mt-3">
                <Button variant="outline" onClick={resetUpload} size="sm">
                  تلاش مجدد
                </Button>
              </div>
            </div>
          )}

          {/* Text Result */}
          {uploadState.extractedText && !uploadState.isProcessing && (
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="flex flex-col w-full">
                  <p className="text-base font-medium leading-normal pb-2">
                    متن استخراج شده از تصویر
                  </p>
                </label>
                <Button variant="ghost" onClick={resetUpload} size="sm">
                  آپلود جدید
                </Button>
              </div>
              <textarea
                className="form-input flex w-full min-w-0 flex-1 resize-y overflow-auto rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-48 placeholder:text-slate-400 dark:placeholder:text-slate-600 p-4 text-base font-normal leading-relaxed"
                value={uploadState.extractedText}
                readOnly
                placeholder="متن استخراج شده از تصویر در اینجا نمایش داده می‌شود..."
              />
              <div className="flex flex-wrap gap-3 justify-start">
                <Button
                  variant="outline"
                  onClick={handleCopyText}
                  icon="content_copy"
                >
                  کپی متن
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => downloadTextFile("txt")}
                  icon="download"
                >
                  دانلود TXT
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => downloadTextFile("docx")}
                  icon="download"
                >
                  دانلود DOCX
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
