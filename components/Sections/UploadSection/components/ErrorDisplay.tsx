import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../../../UI/Button";

interface ErrorDisplayProps {
  error: string;
  retryCount: number;
  onRetry: () => void;
  onReset: () => void;
  maxRetries?: number;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  retryCount,
  onRetry,
  onReset,
  maxRetries = 3,
}) => {
  return (
    <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-700 dark:text-red-300 font-medium">
            خطا در پردازش
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="outline" onClick={onReset} size="sm">
              آپلود جدید
            </Button>
            {retryCount < maxRetries && (
              <Button
                variant="primary"
                onClick={onRetry}
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                تلاش مجدد
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
