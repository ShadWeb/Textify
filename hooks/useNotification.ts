import { useState, useCallback } from "react";
import { Notification } from "../types";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Notification["type"], title: string, message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
