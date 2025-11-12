import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useEffect } from "react";
import { initializeTheme } from "@/utils/theme";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeTheme();
  }, []);
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <div className={vazirmatn.className}>
        <Component {...pageProps} />
      </div>
    </HeroUIProvider>
  );
}
