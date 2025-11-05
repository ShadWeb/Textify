import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="w-full  py-8  dark:bg-gray-900 border-t  border-border-light dark:border-border-dark"
    >
      <div className="container p-4 bg-white mx-auto px-4 rounded-2xl mt-2">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-18">
          {/* Brand Section */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <Image
                alt="PDF to Image Logo"
                src="/images/piphoto.png"
                height={100}
                width={150}
                className="rounded-lg"
              />
              {/* <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                تبدیل پی دی اف به عکس
              </h2> */}
            </div>
            <p className="text-gray-600 dark:text-gray-800 mb-4 leading-relaxed">
              تبدیل پی دی اف به عکس با کیفیت و آنلاین رایگان بدون نرم افزار در
              ویندوز و یا گوشی اندروید امکان پذیر است. برنامه تبدیل PDF به عکس
              به صورت انلاین و با کیفیت بالا
            </p>
            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <h2>تبدیل پی‌دی‌اف به عکس با کیفیت آنلاین</h2>
              <h2>تبدیل PDF به عکس رایگان</h2>
              <h2>برنامه تبدیل پی‌دی‌اف به JPEG, PNG, WEBP</h2>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div className="flex-1 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                لینک‌های سریع
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    صفحه اصلی
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    تبدیل PDF
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    راهنما
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    تماس با ما
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                پشتیبانی
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    سوالات متداول
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    قوانین استفاده
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    حریم خصوصی
                  </a>
                </li>
              </ul>
            </div>
          </div> */}

          {/* Social Media & Contact */}
          <div className="flex-1 max-w-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              در ارتباط باشید
            </h3>

            {/* Social Media Icons */}
            <div className="flex gap-4 mb-6">
              {/* Instagram */}
              <Link
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                href="https://www.instagram.com/vada_house_of_mobile?igsh=MXFjeTEybTg0dzZ6dQ=="
                aria-label="اینستاگرام"
              >
                <svg
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C8.396 0 7.988.012 6.756.06 5.526.107 4.704.26 3.982.56c-.78.326-1.443.72-2.106 1.383S.886 3.202.56 3.982C.26 4.704.107 5.526.06 6.756.012 7.988 0 8.396 0 12.017c0 3.62.012 4.028.06 5.26.047 1.23.2 2.052.5 2.774.326.78.72 1.443 1.383 2.106.663.663 1.325 1.057 2.106 1.383.722.3 1.544.453 2.774.5 1.232.048 1.64.06 5.26.06 3.62 0 4.028-.012 5.26-.06 1.23-.047 2.052-.2 2.774-.5.78-.326 1.443-.72 2.106-1.383.663-.663 1.057-1.325 1.383-2.106.3-.722.453-1.544.5-2.774.048-1.232.06-1.64.06-5.26 0-3.62-.012-4.028-.06-5.26-.047-1.23-.2-2.052-.5-2.774-.326-.78-.72-1.443-1.383-2.106S20.798.886 20.018.56C19.296.26 18.474.107 17.244.06 16.012.012 15.604 0 12.017 0zm0 2.158c3.5 0 3.88.008 5.098.056.96.044 1.48.2 1.826.332.457.174.784.382 1.127.725.343.343.551.67.725 1.127.132.346.288.866.332 1.826.048 1.218.056 1.598.056 5.098 0 3.5-.008 3.88-.056 5.098-.044.96-.2 1.48-.332 1.826-.174.457-.382.784-.725 1.127-.343.343-.67.551-1.127.725-.346.132-.866.288-1.826.332-1.218.048-1.598.056-5.098.056-3.5 0-3.88-.008-5.098-.056-.96-.044-1.48-.2-1.826-.332-.457-.174-.784-.382-1.127-.725-.343-.343-.551-.67-.725-1.127-.132-.346-.288-.866-.332-1.826C2.166 15.898 2.158 15.518 2.158 12.017c0-3.5.008-3.88.056-5.098.044-.96.2-1.48.332-1.826.174-.457.382-.784.725-1.127.343-.343.67-.551 1.127-.725.346-.132.866-.288 1.826-.332 1.218-.048 1.598-.056 5.098-.056z" />
                  <path d="M12.017 5.838a6.18 6.18 0 1 0 0 12.36 6.18 6.18 0 0 0 0-12.36zm0 10.18a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </Link>

              {/* Telegram */}
              <Link
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                href="https://t.me/crmapps"
                aria-label="تلگرام"
              >
                <svg
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 7.935c-.18.02-.435.072-.765.156-1.054.27-3.564 1.146-7.032 2.625-.57.24-.975.438-1.215.594-.42.273-.72.6-.9.984-.18.384-.21.75-.09 1.098.12.348.36.642.72.882.27.18.66.36 1.17.54.51.18 1.008.312 1.494.396.486.084.882.144 1.188.18.684.084 1.434.168 2.25.252.816.084 1.488.18 2.016.288.528.108.972.288 1.332.54.36.252.54.594.54 1.026 0 .36-.12.66-.36.9-.24.24-.558.39-.954.45-.396.06-.834.06-1.314 0-1.2-.24-2.388-.54-3.564-.9-1.176-.36-2.304-.78-3.384-1.26-1.08-.48-2.004-1.05-2.772-1.71-.768-.66-1.38-1.38-1.836-2.16-.456-.78-.624-1.53-.504-2.25.12-.72.48-1.32 1.08-1.8.6-.48 1.38-.78 2.34-.9 1.92-.24 3.84-.18 5.76.18 1.92.36 3.54.96 4.86 1.8.36.24.54.54.54.9 0 .36-.18.66-.54.9-.36.24-.78.36-1.26.36-.48 0-.9-.12-1.26-.36-.84-.6-1.8-1.02-2.88-1.26-1.08-.24-2.16-.3-3.24-.18-.36 0-.66.06-.9.18-.24.12-.42.3-.54.54-.12.24-.18.48-.18.72 0 .24.06.48.18.72.12.24.3.42.54.54.24.12.54.18.9.18.36 0 .72-.06 1.08-.18.36-.12.78-.24 1.26-.36 1.68-.48 3.24-.78 4.68-.9.36 0 .66-.06.9-.18.24-.12.42-.3.54-.54.12-.24.18-.48.18-.72 0-.36-.12-.66-.36-.9-.24-.24-.54-.36-.9-.36z" />
                </svg>
              </Link>

              {/* LinkedIn */}
              <Link
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                href="https://www.linkedin.com/company/vada-house-of-mobile/"
                aria-label="لینکدین"
              >
                <svg
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>

              {/* WhatsApp */}
              <Link
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                href="https://api.whatsapp.com/send/?phone=989109838553"
                aria-label="واتساپ"
              >
                <svg
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444" />
                </svg>
              </Link>
            </div>

            {/* Vada Logo */}
            <div className=" w-fit p-3 px-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Image
                alt="Vada Logo"
                src="/images/vada_logo.png"
                height={150}
                width={150}
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} PDF به عکس. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
