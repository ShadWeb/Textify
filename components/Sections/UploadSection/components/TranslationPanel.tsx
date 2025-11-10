import React from "react";
import { Copy, FileText, FileCode, RefreshCw, Languages } from "lucide-react";
import Button from "../../../UI/Button";
import { Language, TranslationState } from "@/types";
import TextEditor from "./TextEditor";

interface TranslationPanelProps {
  translationState: TranslationState;
  languages: Language[];
  originalText: string;
  onOriginalTextChange: (text: string) => void;
  onTranslate: (sourceLang: string, targetLang: string) => void;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, format: "txt" | "docx", filename: string) => void;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  translationState,
  languages,
  originalText,
  onOriginalTextChange,
  onTranslate,
  onCopy,
  onDownload,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="items-start  gap-6">
          {/* بخش متن ورودی */}
          {/* <div className="flex flex-col mt-2 gap-5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                متن ورودی (قابل ویرایش)
              </label>
              <span className="text-xs text-slate-500">
                {originalText.length} کاراکتر
              </span>
            </div>
            <div className="relative">
              <textarea
                className="form-input w-full min-h-64 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                value={originalText}
                onChange={(e) => onOriginalTextChange(e.target.value)}
                placeholder="متن را برای ترجمه در اینجا ویرایش کنید..."
              />
            </div>
          </div> */}

          {/* بخش ترجمه */}
          <div className="flex flex-col w-full gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                متن ترجمه شده
              </label>
              <div className="flex gap-2">
                {/* دکمه ترجمه مجدد */}
                <div className="flex justify-center  border-slate-200 dark:border-slate-700">
                  <button
                    className="bg-primary text-white py-2 font-bold px-3 gap-2 rounded-lg flex items-center"
                    onClick={() =>
                      onTranslate("auto", translationState.targetLang)
                    }
                    disabled={translationState.isTranslating}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden md:flex">ترجمه مجدد</span>
                  </button>
                </div>
                <select
                  className="text-sm px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg  py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  value={translationState.targetLang}
                  onChange={(e) => onTranslate("auto", e.target.value)}
                  disabled={translationState.isTranslating}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <textarea
                className="form-input w-full min-h-64 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                value={
                  translationState.isTranslating
                    ? "در حال ترجمه..."
                    : translationState.translatedText
                }
                readOnly
                placeholder="متن ترجمه شده در اینجا نمایش داده می‌شود...
                اگه نشد لطفا ترجمه مجدد رو بفشارید"
              />
              {translationState.isTranslating && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-sm font-medium">در حال ترجمه...</span>
                  </div>
                </div>
              )}
            </div>

            {/* دکمه‌های اقدام برای ترجمه */}
            <div className="flex flex-wrap gap-2">
              <Button
                className="border-none md:ring-2"
                variant="outline"
                onClick={() =>
                  onCopy(translationState.translatedText, "متن ترجمه شده")
                }
                icon={<Copy className="w-4 h-4" />}
                size="sm"
                disabled={!translationState.translatedText}
              >
                <span className="hidden md:flex">کپی ترجمه</span>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onDownload(
                    translationState.translatedText,
                    "txt",
                    "متن-ترجمه-شده"
                  )
                }
                icon={<FileText className="w-4 h-4" />}
                size="sm"
                disabled={!translationState.translatedText}
              >
                <div className="flex gap-2">
                  <span className="hidden md:flex">دانلود </span>TXT
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onDownload(
                    translationState.translatedText,
                    "docx",
                    "متن-ترجمه-شده"
                  )
                }
                icon={<FileCode className="w-4 h-4" />}
                size="sm"
                disabled={!translationState.translatedText}
              >
                <div className="flex gap-2">
                  <span className="hidden md:flex">دانلود </span>DOCX
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;
