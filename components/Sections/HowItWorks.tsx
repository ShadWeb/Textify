import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "آپلود تصویر",
      description: "تصویر مورد نظر خود را در ابزار آپلود کنید.",
    },
    {
      number: 2,
      title: "تحلیل با هوش مصنوعی",
      description: "سیستم هوشمند ما متن موجود در تصویر را شناسایی می‌کند.",
    },
    {
      number: 3,
      title: "نمایش و دانلود متن",
      description: "متن استخراج‌شده را کپی یا به صورت فایل دریافت کنید.",
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50"
      id="how-it-works"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">
            چطور کار می‌کند؟
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl">
            فرآیند تبدیل در سه مرحله ساده انجام می‌شود.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting Line */}
          <div
            className="absolute hidden md:block top-1/2 left-0 w-full h-0.5 bg-slate-300 dark:bg-slate-700"
            style={{ transform: "translateY(-50%)" }}
          />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center gap-4"
            >
              <div className="flex items-center justify-center size-16 rounded-full bg-background-light dark:bg-background-dark border-2 border-primary text-primary text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
