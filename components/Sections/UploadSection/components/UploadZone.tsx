import React, { useRef, useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import Button from "../../../UI/Button";

interface UploadZoneProps {
  isDragActive: boolean;
  setIsDragActive: (active: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  isDragActive,
  setIsDragActive,
  handleDrop,
  handleFileSelect,
  fileInputRef,
}) => {
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    },
    [setIsDragActive]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
    },
    [setIsDragActive]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      if (e.target) e.target.value = "";
    },
    [handleFileSelect]
  );

  return (
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
          فایل تصویری خود را آپلود کنید (JPG, PNG, WEBP, BMP, GIF) - حداکثر ۱۰
          مگابایت
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
  );
};

export default UploadZone;
