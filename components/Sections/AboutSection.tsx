import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50"
      id="about"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4 text-center lg:text-right">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              درباره ما
            </h2>
            <p className="text-slate-600 dark:text-slate-800 leading-relaxed">
              Textify با هدف ساده‌سازی و در دسترس قرار دادن فناوری تشخیص نوری
              نویسه‌ها (OCR) برای همه ایجاد شده است. ما معتقدیم که دسترسی به
              اطلاعات نباید به فرمت آن محدود باشد. با استفاده از آخرین
              پیشرفت‌های هوش مصنوعی، ابزاری سریع، دقیق و امن را فراهم کرده‌ایم
              تا به شما در تبدیل تصاویر به متن قابل ویرایش کمک کنیم.
            </p>
            <p className="text-slate-600 dark:text-slate-800 leading-relaxed">
              تیم ما متشکل از متخصصان هوش مصنوعی، توسعه‌دهندگان و طراحان تجربه
              کاربری است که با اشتیاق به ایجاد ابزارهای مفید و در دسترس برای
              کاربران فارسی‌زبان می‌پردازند.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div
              className="w-full max-w-sm bg-center bg-no-repeat aspect-square bg-contain"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPRk6N2U0sywK2y6tD50DoM4Mm-jo-qbkW_V_dr3ixbb_Rw3zLZgtYxrfCBy2hbcUbyKLWr13iEtjXhO0gWe1bUCIfEkPvFYO8GK7BC3ZP-u2uE0L_AWiJTmPbpsvrgASkUMfznTtYg_PVzH-l_lrgm2bYSLvculRLgLOMUhdycjKU6UpexS4rtjDhAc5Zv4t3v5TnVcBoRwPXVyrs04ogicpWrGVrFh5bHvKsvIMt5Mmd8MH3G0p9A3RDNbudwB5a60sPGWa55rPo")',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
