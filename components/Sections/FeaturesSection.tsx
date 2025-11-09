import Image from "next/image";
import React from "react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      image: "/images/Frame121528.png",
      title: "تبدیل عکس به متن آنلاین",
      description:
        "با ابزار تبدیل عکس به متن آنلاین، می‌توانید هر عکسی را به متن قابل ویرایش تبدیل کنید.",
    },
    {
      image: "/images/Frame121524.png",
      title: "تبدیل عکس به متن رایگان",
      description:
        "با این ابزار کاربردی شما می‌توانید به راحتی متن‌های عکس‌ها را بدون نیاز به نصب نرم‌افزار دریافت کنید.",
    },
    {
      image: "/images/Frame121522.png",
      title: "تبدیل عکس به ورد رایگان",
      description:
        "تبدیل عکس به ورد رایگان فقط با چند کلیک؛ عکس‌هایتان را به فایل ورد قابل ویرایش تبدیل کنید.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 dark:bg-gray-700" id="features">
      <div className="container mx-auto px-4">
        {/* عنوان بخش */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">
            ربات تبدیل عکس به متن
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl">
            بهترین ابزار برای تبدیل عکس به متن آنلاین؛ شما می‌توانید متن‌ داخل
            عکس‌ها را بدون تایپ دستی فقط در چند ثانیه دریافت کنید.
          </p>
        </div>

        {/* کارت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              {/* عکس */}
              <div className="relative w-24 h-24 sm:w-40 sm:h-40 mb-4">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* عنوان */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>

              {/* توضیحات */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
