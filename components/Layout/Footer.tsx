import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      id="contact"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-5 text-primary">
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
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Textify AI OCR © 2024
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#about"
              className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              درباره ما
            </Link>
            <Link
              href="#"
              className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              حریم خصوصی
            </Link>
            <a
              href="mailto:support@textify.ai"
              className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              تماس با ما
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
