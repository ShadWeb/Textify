import React from "react";

export default function VideoIntroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* محتوا */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/15 text-primary rounded-full text-sm font-semibold tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              اپلیکیشن کاربردی
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              برنامه تبدیل عکس به متن با{" "}
              <span className="text-primary">هوش مصنوعی</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              فقط کافیه یه عکس آپلود کنی تا در چند ثانیه متن داخلش با دقت بالا
              استخراج بشه. مناسب برای اسکن اسناد، کتاب‌ها، فاکتورها و هر نوع
              متنی در تصویر.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-5 py-2.5 bg-primary/15 text-primary rounded-xl text-sm font-medium">
                #هوش_مصنوعی
              </span>
              <span className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">
                #اپلیکیشن_کاربردی
              </span>
            </div>

            <div className="pt-6">
              <a
                href="https://youtu.be/Zl9wV9Pzpbw?si=QAYwhGNw5xm609lz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                تماشای ویدیو معرفی
              </a>
            </div>
          </div>

          {/* ویدیو عمودی iPhone 12 - شبیه دموی اپ */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative group w-full max-w-sm mx-auto">
              {/* فریم iPhone با notch و گردی واقعی */}
              <div className="relative bg-black rounded-3xl p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-3xl bg-gray-900">
                  {/* نسبت 9:16 (عمودی - iPhone 12) */}
                  <div className="aspect-[9/16] w-full">
                    <iframe
                      className="w-full h-full object-cover rounded-3xl"
                      src="/video/IMG_9664.MP4"
                      title="برنامه تبدیل عکس به متن با هوش مصنوعی"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* افکت play در hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/30 rounded-3xl">
                    <div className="w-20 h-20 bg-primary/95 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                      <svg
                        className="w-10 h-10 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* نوچ (Notch) iPhone */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl"></div>
              </div>
            </div>

            {/* <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
              ویدیو معرفی کامل اپلیکیشن — ۲:۴۵ دقیقه
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}
