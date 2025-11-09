"use client";

import React, {
  useState,
  useRef,
  useCallback,
  HtmlHTMLAttributes,
} from "react";
import { useNotification } from "@/hooks/useNotification";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { useTranslation } from "@/hooks/useTranslation";
import NotificationSystem from "./components/NotificationSystem";
import UploadZone from "./components/UploadZone";
import ProgressBar from "./components/ProgressBar";
import ErrorDisplay from "./components/ErrorDisplay";
import TextEditor from "./components/TextEditor";
import TranslationPanel from "./components/TranslationPanel";
import Button from "../../UI/Button";
import { Copy, FileCode, FileText, Languages, X } from "lucide-react";

const UploadSection: React.FC<HTMLElement> = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const {
    uploadState,
    setUploadState,
    retryCount,
    handleFileSelect,
    resetUpload,
    retryLastOperation,
  } = useFileProcessing(addNotification);

  const {
    translationState,
    setTranslationState,
    showTranslationPanel,
    setShowTranslationPanel,
    languages,
    handleTranslate,
    toggleTranslationPanel,
  } = useTranslation(addNotification);

  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // مدیریت دراپ فایل
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      if (e.dataTransfer.files.length > 1) {
        addNotification(
          "warning",
          "توجه",
          "فقط یک فایل می‌توانید آپلود کنید. اولین فایل انتخاب شد."
        );
      }

      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect, addNotification]
  );

  // کپی متن
  const handleCopyText = useCallback(
    async (text: string, type: string = "متن") => {
      if (!text.trim()) {
        addNotification("warning", "هشدار", "متن برای کپی خالی است");
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
      } catch (err) {
        console.error("Failed to copy text:", err);
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
        } catch (fallbackError) {
          addNotification("error", "خطا", `خطا در کپی ${type}`);
        }
      }
    },
    [addNotification]
  );

  // دانلود فایل
  const downloadTextFile = useCallback(
    (
      text: string,
      format: "txt" | "docx",
      filename: string = "extracted-text"
    ) => {
      if (!text.trim()) {
        addNotification("warning", "هشدار", "متن برای دانلود خالی است");
        return;
      }

      try {
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
        URL.revokeObjectURL(element.href);

        addNotification(
          "success",
          "موفق",
          `فایل ${format} با موفقیت دانلود شد`
        );
      } catch (error) {
        console.error("Download error:", error);
        addNotification("error", "خطا", "خطا در دانلود فایل");
      }
    },
    [addNotification]
  );

  // مدیریت تغییر متن
  const handleTextChange = useCallback((text: string) => {
    setEditableText(text);
  }, []);

  // مدیریت ترجمه
  const handleTranslateWrapper = useCallback(
    async (sourceLang: string = "auto", targetLang: string = "en") => {
      const translatedText = await handleTranslate(
        editableText,
        sourceLang,
        targetLang
      );
      return translatedText;
    },
    [handleTranslate, editableText]
  );

  // تنظیم متن استخراج شده وقتی آپلود کامل شد
  React.useEffect(() => {
    if (uploadState.extractedText && !uploadState.isProcessing) {
      setEditableText(uploadState.extractedText);
    }
  }, [uploadState.extractedText, uploadState.isProcessing]);

  const shouldShowUploadBox =
    !uploadState.file && !uploadState.extractedText && !uploadState.error;

  return (
    <section className="py-10 bg-slate-100 w-full rounded-2xl dark:bg-slate-900/50 transition-colors duration-300 relative">
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-8">
        {/* Upload Zone */}
        {shouldShowUploadBox && (
          <UploadZone
            isDragActive={isDragActive}
            setIsDragActive={setIsDragActive}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
            fileInputRef={fileInputRef || null}
          />
        )}

        {/* Progress Bar */}
        {uploadState.isProcessing && (
          <ProgressBar progress={uploadState.progress} />
        )}

        {/* Error Message */}
        {uploadState.error && (
          <ErrorDisplay
            error={uploadState.error}
            retryCount={retryCount}
            onRetry={retryLastOperation}
            onReset={resetUpload}
          />
        )}

        {/* Extracted Text Section */}
        {uploadState.extractedText && !uploadState.isProcessing && (
          <div className="w-full flex flex-col gap-6">
            {/* هدر بخش متن اصلی */}
            <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    متن استخراج شده از تصویر
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {uploadState.extractedText.length} کاراکتر
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="bg-primary text-white py-2 font-bold px-3 gap-2 rounded-lg flex items-center"
                    onClick={toggleTranslationPanel}
                  >
                    <Languages className="w-4 h-4" />
                    {showTranslationPanel ? "بستن ترجمه" : "ترجمه متن"}
                  </button>
                  {/* <Button
                    className="border-none md:ring-2"
                    variant="outline"
                    onClick={() => handleCopyText(editableText, "متن اصلی")}
                    icon={<Copy className="w-4 h-4" />}
                    size="sm"
                  >
                    <span className="hidden md:flex">کپی متن</span>
                  </Button> */}
                  <Button
                    className="bg-red-500"
                    variant="secondary"
                    onClick={resetUpload}
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                  >
                    آپلود جدید
                  </Button>
                </div>
              </div>

              {/* متن اصلی قابل ویرایش */}
              <TextEditor
                text={editableText}
                onTextChange={handleTextChange}
                onCopy={handleCopyText}
                onDownload={downloadTextFile}
                title="متن استخراج شده از تصویر"
                placeholder="متن استخراج شده از تصویر در اینجا نمایش داده می‌شود. می‌توانید آن را ویرایش کنید..."
                showActions={false}
              />

              {/* دکمه‌های اقدام برای متن اصلی */}
              {/* <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadTextFile(editableText, "txt", "متن-استخراج-شده")
                  }
                  icon={<FileText className="w-4 h-4" />}
                  size="sm"
                >
                  دانلود TXT
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadTextFile(editableText, "docx", "متن-استخراج-شده")
                  }
                  icon={<FileCode className="w-4 h-4" />}
                  size="sm"
                >
                  دانلود DOCX
                </Button>
              </div> */}
            </div>

            {/* بخش ترجمه - در صورت فعال بودن */}
            {showTranslationPanel && (
              <TranslationPanel
                translationState={translationState}
                languages={languages}
                originalText={editableText}
                onOriginalTextChange={handleTextChange}
                onTranslate={handleTranslateWrapper}
                onCopy={handleCopyText}
                onDownload={downloadTextFile}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
