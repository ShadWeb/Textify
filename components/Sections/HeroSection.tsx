import React, { useEffect, useState } from "react";
import UploadSection from "./UploadSection/UploadSection";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToUpload = () => {
    const element = document.getElementById("upload-tool");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className=" py-4 flex items-center justify-center md:min-h-[600px] bg-background-light dark:bg-background-dark overflow-hidden">
      {/* افکت‌های دکوراتیو ظریف */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-8 md:gap-12 justify- md:flex-row flex-col items-center">
          {/* متن سمت راست */}
          <div
            className={`flex flex-col items-center md:items-start gap-2 md:gap-6 max-w-2xl text-center md:text-right transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white ">
              تبدیل <span className="text-primary">عکس به متن</span> آنلاین
            </h1>

            <h2 className="text-base md:text-xl font-normal leading-relaxed text-slate-600 dark:text-slate-300 max-w-lg">
              فایل تصویری خود را آپلود کنید و متن استخراج‌شده را بلافاصله با
              <span className="font-semibold text-primary">
                {" "}
                قدرت هوش مصنوعی
              </span>{" "}
              ببینید.
            </h2>

            {/* ویژگی‌های اصلی */}
            <div className="flex flex-col gap-1  md:gap-4 md:mt-2">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">
                  پشتیبانی از فرمت‌های مختلف تصویر
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">استخراج متن فارسی با دقت بالا</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">ویرایش و کپی متن استخراج‌شده</span>
              </div>
            </div>

            {/* دکمه‌های اقدام */}
            {/* <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={scrollToUpload}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>شروع تبدیل رایگان</span>
              </button>

              <button className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-600 ">
                راهنمای استفاده
              </button>
            </div> */}

            {/* آمار و ارقام */}
            <div className="flex items-center gap-6 mt-2 md:mt-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <div className="text-lg font-bold text-primary ">۵۰۰+</div>
                <div>تبدیل موفق</div>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary ">٪۹۸</div>
                <div>دقت تشخیص</div>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary ">۱۰+</div>
                <div>فرمت پشتیبانی</div>
              </div>
            </div>
          </div>

          {/* بخش آپلود */}
          <div
            className={`flex justify-center items-center w-full mx-auto max-w-lg md:max-w-3xl transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-10 scale-95"
            }`}
          >
            <div className="  w-full">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <UploadSection />
              </div>
              {/* هایلایت ظریف */}
              <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-sm -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
