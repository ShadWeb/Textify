import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
      <Head>
        <title>تبدیل عکس به متن آنلاین</title>
        <meta
          name="description"
          content="سرویس آنلاین تبدیل عکس به متن با هوش مصنوعی، بهترین ابزار برای استخراج متن از عکس‌ فارسی و انگلیسی است. فقط کافیست تصویر خود را آپلود کنید تا متن آن را یصورت دقیق و بدون بهم ریختگی دریافت کنید. این ابزار رایگان است و می‌تواند خروجی Word یا متن تایپ‌شده فارسی تولید کند."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
