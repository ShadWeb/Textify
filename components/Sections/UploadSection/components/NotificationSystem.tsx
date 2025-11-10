import React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Notification } from "@/types";

interface NotificationSystemProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  removeNotification,
}) => {
  return (
    <div className="fixed top-4 right-10 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === "success"
              ? "bg-green-50 border-green-500 dark:bg-green-900/80"
              : notification.type === "error"
              ? "bg-red-50 border-red-500 dark:bg-red-900/80"
              : notification.type === "warning"
              ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/80"
              : "bg-blue-50 border-blue-500 dark:bg-blue-900/80"
          } transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex items-start dark:text-white gap-3">
            {notification.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            {(notification.type === "error" ||
              notification.type === "warning" ||
              notification.type === "info") && (
              <AlertCircle
                className={`w-5 h-5 ${
                  notification.type === "error"
                    ? "text-red-600"
                    : notification.type === "warning"
                    ? "text-yellow-600"
                    : "text-blue-600"
                } mt-0.5`}
              />
            )}

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p
                  className={`font-medium ${
                    notification.type === "success"
                      ? "text-green-800"
                      : notification.type === "error"
                      ? "text-red-800"
                      : notification.type === "warning"
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  {notification.title}
                </p>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p
                className={`text-sm mt-1 ${
                  notification.type === "success"
                    ? "text-green-600"
                    : notification.type === "error"
                    ? "text-red-600"
                    : notification.type === "warning"
                    ? "text-yellow-600"
                    : "text-blue-600"
                }`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {notification.timestamp.toLocaleTimeString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
