import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
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
      className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default DarkModeToggle;
