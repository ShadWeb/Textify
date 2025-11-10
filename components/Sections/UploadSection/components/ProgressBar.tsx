import React from "react";

interface ProgressBarProps {
  progress: number;
  message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  message = "در حال پردازش تصویر و استخراج متن...",
}) => {
  return (
    <div className="w-full flex-col rounded-2xl gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="flex gap-6 justify-between items-center">
        <p className="text-base font-medium text-slate-900 dark:text-white">
          {message}
        </p>
        <span className="text-base font-medium text-primary">{progress}%</span>
      </div>
      <div className="rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        این عملیات ممکن است چند لحظه طول بکشد...
      </p>
    </div>
  );
};

export default ProgressBar;
