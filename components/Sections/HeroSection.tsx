import React from "react";
import Button from "../UI/Button";
import UploadSection from "./UploadSection";

const HeroSection: React.FC = () => {
  const scrollToUpload = () => {
    const element = document.getElementById("upload-tool");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-right">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              تبدیل عکس به متن با یک کلیک
            </h1>
            <h2 className="text-lg font-normal leading-normal text-slate-600 dark:text-slate-400 max-w-lg">
              فایل تصویری خود را آپلود کنید و متن استخراج‌شده را بلافاصله با
              قدرت هوش مصنوعی ببینید.
            </h2>
            {/* <Button onClick={scrollToUpload} size="md" icon="upload_file">
              شروع تبدیل
            </Button> */}
          </div>

          <div className="flex justify-center items-center">
            <UploadSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
