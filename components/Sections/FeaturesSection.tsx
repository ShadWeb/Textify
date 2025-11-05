import React from "react";
import { Feature } from "../../types";

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: "translate",
      title: "پشتیبانی از فارسی و انگلیسی",
      description:
        "با دقت بالا متن‌های فارسی و انگلیسی را از تصاویر شما استخراج می‌کنیم.",
    },
    {
      icon: "bolt",
      title: "پردازش سریع و دقیق",
      description:
        "به لطف الگوریتم‌های هوش مصنوعی پیشرفته، نتایج را در چند ثانیه دریافت کنید.",
    },
    {
      icon: "security",
      title: "کاملاً امن و خصوصی",
      description:
        "ما به حریم خصوصی شما احترام می‌گذاریم. فایل‌های شما هرگز ذخیره نمی‌شوند.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 dark:bg-gray-700" id="features">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">
            چرا Textify؟
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl">
            سرویس ما برای ارائه بهترین تجربه تبدیل عکس به متن طراحی شده است.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-8 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 transition hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
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
