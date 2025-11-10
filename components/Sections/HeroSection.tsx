import React from "react";
import UploadSection from "./UploadSection/UploadSection";

const HeroSection: React.FC = () => {
  const scrollToUpload = () => {
    const element = document.getElementById("upload-tool");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-2 flex items-center justify-center md:min-h-[800px] dark:bg-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex gap-18 justify-between md:flex-row flex-col items-center">
          {/* متن سمت راست */}
          <div className="flex flex-col items-center gap-6 max-w-2xl text-center md:text-right  lg:col-row-1">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              تبدیل عکس به متن آنلاین
            </h1>
            <h2 className="text-lg font-normal md:text-right leading-normal text-slate-600 dark:text-slate-400 max-w-lg ">
              فایل تصویری خود را آپلود کنید و متن استخراج‌ شده را بلافاصله با
              قدرت هوش مصنوعی ببینید.
            </h2>
            {/* <Button onClick={scrollToUpload} size="md" icon="upload_file">
              شروع تبدیل
            </Button> */}
          </div>

          {/* بخش آپلود */}
          <div className="flex justify-center items-center w-full  lg:col-row-2">
            <UploadSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
