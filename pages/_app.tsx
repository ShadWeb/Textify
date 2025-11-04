import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useEffect } from "react";
import { initializeTheme } from "@/utils/theme";
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeTheme();
  }, []);
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <Component {...pageProps} />
    </HeroUIProvider>
  );
}
