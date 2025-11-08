import React from "react";
import { Copy, FileText, FileCode } from "lucide-react";
import Button from "../../../UI/Button";

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, format: "txt" | "docx", filename: string) => void;
  title: string;
  placeholder?: string;
  readOnly?: boolean;
  showActions?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onTextChange,
  onCopy,
  onDownload,
  title,
  placeholder = "متن در اینجا نمایش داده می‌شود...",
  readOnly = false,
  showActions = true,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700  p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {text.length} کاراکتر
          </p>
        </div> */}

        <div className="flex flex-wrap gap-2">
          <Button
            className="border-none md:ring-2"
            variant="outline"
            onClick={() => onCopy(text, "متن")}
            icon={<Copy className="w-4 mr-1 h-4" />}
            size="sm"
          >
            <span className="hidden md:flex">کپی متن</span>
          </Button>
          <Button
            className="border-none md:ring-2"
            variant="outline"
            onClick={() => onDownload(text, "txt", "متن-استخراج-شده")}
            icon={<FileText className="w-4 h-4" />}
            size="sm"
          >
            <div className="flex gap-2">
              <span className="hidden md:flex">دانلود </span>TXT
            </div>
          </Button>
          <Button
            className="border-none md:ring-2"
            variant="outline"
            onClick={() => onDownload(text, "docx", "متن-استخراج-شده")}
            icon={<FileCode className="w-4 h-4" />}
            size="sm"
          >
            <div className="flex gap-2">
              <span className="hidden md:flex">دانلود </span>DOCX
            </div>
          </Button>
        </div>
      </div>

      <div className="relative">
        <textarea
          className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextEditor;
