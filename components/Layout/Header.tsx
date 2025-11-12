import React, { useState } from "react";
import Link from "next/link";
import Button from "../UI/Button";
import DarkModeToggle from "../UI/DarkModeToggle";
import Image from "next/image";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // بستن منو پس از کلیک
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md  bg-white dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-slate-200/80 dark:border-slate-800/80 py-3">
          {/* لوگو و نام */}
          <div className="flex items-center text-[#111318] dark:text-white">
            <h2 className="text-xl font-bold tracking-[-0.015em]">picmatn</h2>
            <div className="text-primary">
              <Image
                src={"images/picmatn.png"}
                width={60}
                height={60}
                alt="تبدیل عکس به متن آنلاین"
              />
            </div>
          </div>

          {/* ناوبری دسکتاپ */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              ویژگی‌ها
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              نحوه کار
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              سؤالات متداول
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              درباره ما
            </button>
            <button
              onClick={() => scrollToSection("footer")}
              className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              تماس با ما
            </button>
          </nav>

          {/* بخش سمت چپ - دکمه‌ها */}
          <div className="flex items-center gap-3">
            {/* <Button onClick={() => scrollToSection("upload-tool")}>
              تبدیل کن
            </Button> */}
            <DarkModeToggle />

            {/* دکمه منو همبرگری برای موبایل */}
            <button
              className="md:hidden flex flex-col w-6 h-6 justify-center items-center gap-1"
              onClick={toggleMobileMenu}
              aria-label="منو"
            >
              <span
                className={`w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* منو موبایل */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="text-right py-2 px-4 text-sm font-medium hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              ویژگی‌ها
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-right py-2 px-4 text-sm font-medium hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              نحوه کار
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-right py-2 px-4 text-sm font-medium hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              سؤالات متداول
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-right py-2 px-4 text-sm font-medium hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              درباره ما
            </button>
            <button
              onClick={() => scrollToSection("footer")}
              className="text-right py-2 px-4 text-sm font-medium hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              تماس با ما
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
