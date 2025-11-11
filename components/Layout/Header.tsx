import React from "react";
import Link from "next/link";
import Button from "../UI/Button";
import DarkModeToggle from "../UI/DarkModeToggle";

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-slate-200/80 dark:border-slate-800/80 py-3">
          <div className="flex items-center gap-4 text-[#111318] dark:text-white">
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-[-0.015em]">picmatn</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary"
            >
              ویژگی‌ها
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary"
            >
              نحوه کار
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary"
            >
              سؤالات متداول
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary"
            >
              درباره ما
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary"
            >
              تماس با ما
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button onClick={() => scrollToSection("upload-tool")}>
              تبدیل کن
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
