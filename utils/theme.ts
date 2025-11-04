export const toggleDarkMode = () => {
  const htmlElement = document.documentElement;
  const isDark = htmlElement.classList.contains("dark");

  if (isDark) {
    htmlElement.classList.remove("dark");
    localStorage.theme = "light";
  } else {
    htmlElement.classList.add("dark");
    localStorage.theme = "dark";
  }
};

export const initializeTheme = () => {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};
