import React, { useState, useEffect } from "react";
import { toggleDarkMode, initializeTheme } from "../../utils/theme";

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initializeTheme();
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleToggle = () => {
    toggleDarkMode();
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300"
      aria-label="Toggle dark mode"
    >
      <span className="material-symbols-outlined text-xl">
        {isDark ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
