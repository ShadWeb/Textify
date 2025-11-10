import { useState, useCallback } from "react";
import { UploadState } from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const useFileProcessing = (
  addNotification: (type: any, title: string, message: string) => void
) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isProcessing: false,
    progress: 0,
    extractedText: "",
    error: null,
  });

  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastOperation, setLastOperation] = useState<string>("");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "فقط فایل‌های JPG, PNG, WEBP, BMP, GIF مجاز هستند",
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: "فایل خالی است",
      };
    }

    return { isValid: true };
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
        errorHandler: (err) => {
          console.error("Tesseract Worker Error:", err);
          addNotification("error", "خطای Worker", "خطا در اجرای پردازشگر OCR");
        },
      });

      await worker.loadLanguage("fas+eng");
      await worker.initialize("fas+eng");

      const processingTimeout = setTimeout(() => {
        addNotification(
          "warning",
          "پردازش طولانی",
          "پردازش تصویر بیشتر از حد انتظار طول می‌کشد..."
        );
      }, 10000);

      const file = formData.get("image") as File;
      const {
        data: { text },
      } = await worker.recognize(file);

      clearTimeout(processingTimeout);
      await worker.terminate();

      return text.trim();
    } catch (error) {
      console.error("Tesseract error:", error);

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          throw new Error(
            "پردازش تصویر timeout خورد. لطفاً تصویر ساده‌تری آپلود کنید."
          );
        } else if (error.message.includes("language")) {
          throw new Error("خطا در بارگذاری زبان‌های مورد نیاز برای OCR");
        }
      }

      throw new Error(
        "خطا در پردازش تصویر با Tesseract. لطفاً دوباره تلاش کنید."
      );
    }
  };

  const processImageWithOCR = async (
    file: File,
    attempt: number = 1
  ): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      setLastOperation("ocr_processing");
      addNotification(
        "info",
        "در حال پردازش تصویر",
        `تلاش ${attempt} از ${MAX_RETRIES}`
      );

      return await processWithTesseract(formData);
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        addNotification(
          "warning",
          "خطا در پردازش",
          `تلاش مجدد در ${RETRY_DELAY / 1000} ثانیه...`
        );
        await delay(RETRY_DELAY);
        return processImageWithOCR(file, attempt + 1);
      }
      throw error;
    }
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setUploadState((prev) => ({
          ...prev,
          error: validation.error || "خطای نامشخص در فایل",
        }));
        addNotification(
          "error",
          "خطای فایل",
          validation.error || "فایل نامعتبر است"
        );
        return;
      }

      setUploadState({
        file,
        error: null,
        isProcessing: true,
        progress: 0,
        extractedText: "",
      });

      setRetryCount(0);

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

          if (extractedText.trim().length === 0) {
            addNotification(
              "warning",
              "هشدار",
              "هیچ متنی در تصویر شناسایی نشد. ممکن است تصویر واضح نباشد یا متن نداشته باشد."
            );
          } else {
            addNotification(
              "success",
              "موفق",
              `متن با موفقیت استخراج شد (${extractedText.length} کاراکتر)`
            );
          }
        }, 300);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "خطای ناشناخته در پردازش تصویر";

        setUploadState((prev) => ({
          ...prev,
          isProcessing: false,
          error: errorMessage,
        }));

        addNotification("error", "خطای پردازش", errorMessage);

        if (errorMessage.includes("timeout")) {
          addNotification(
            "info",
            "راهنمایی",
            "سعی کنید تصویر با وضوح پایین‌تر یا متن کمتر آپلود کنید."
          );
        }
      }
    },
    [addNotification]
  );

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      isProcessing: false,
      progress: 0,
      extractedText: "",
      error: null,
    });
    setRetryCount(0);
    addNotification("info", "بازنشانی", "آپلود جدید آماده است");
  }, [addNotification]);

  const retryLastOperation = useCallback(() => {
    if (uploadState.file && lastOperation === "ocr_processing") {
      addNotification("info", "تلاش مجدد", "در حال پردازش مجدد تصویر...");
      handleFileSelect(uploadState.file);
    }
  }, [uploadState.file, lastOperation, handleFileSelect, addNotification]);

  return {
    uploadState,
    setUploadState,
    retryCount,
    handleFileSelect,
    resetUpload,
    retryLastOperation,
  };
};
