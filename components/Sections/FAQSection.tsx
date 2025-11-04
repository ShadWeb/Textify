import React, { useState } from "react";
import { FAQItem } from "../../types";

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "آیا فایل‌های من ذخیره می‌شوند؟",
      answer:
        "خیر. ما به حریم خصوصی شما اهمیت می‌دهیم. هیچ‌کدام از فایل‌های آپلود شده در سرورهای ما ذخیره نمی‌شوند و پس از پردازش بلافاصله حذف می‌گردند.",
    },
    {
      question: "از چه زبان‌هایی پشتیبانی می‌شود؟",
      answer:
        "در حال حاضر، Textify از زبان‌های فارسی و انگلیسی با دقت بالا پشتیبانی می‌کند. ما در حال کار برای افزودن زبان‌های بیشتر در آینده هستیم.",
    },
    {
      question: "آیا استفاده از این سرویس رایگان است؟",
      answer:
        "بله، استفاده از ویژگی‌های اصلی Textify کاملاً رایگان است. ممکن است در آینده برای کاربران حرفه‌ای با نیازهای خاص، پلن‌های ویژه‌ای ارائه شود.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">
            پرسش‌های رایج کاربران
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300"
            >
              <button
                className="flex items-center justify-between w-full cursor-pointer font-bold text-slate-800 dark:text-slate-200 text-right"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span
                  className={`material-symbols-outlined transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
