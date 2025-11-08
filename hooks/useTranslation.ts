import { useState, useCallback } from "react";
import { TranslationState, Language } from "../types";

const languages: Language[] = [
  { code: "en", name: "انگلیسی" },
  { code: "fr", name: "فرانسوی" },
  { code: "de", name: "آلمانی" },
  { code: "es", name: "اسپانیایی" },
  { code: "ar", name: "عربی" },
  { code: "ru", name: "روسی" },
  { code: "zh", name: "چینی" },
  { code: "ja", name: "ژاپنی" },
  { code: "ko", name: "کره‌ای" },
  { code: "fa", name: "فارسی" },
];

export const useTranslation = (
  addNotification: (type: any, title: string, message: string) => void
) => {
  const [translationState, setTranslationState] = useState<TranslationState>({
    translatedText: "",
    sourceLang: "auto",
    targetLang: "en",
    isTranslating: false,
  });

  const [showTranslationPanel, setShowTranslationPanel] =
    useState<boolean>(false);

  const translateWithGoogleAPI = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          text
        )}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        return data[0].map((item: any[]) => item[0]).join("");
      }

      throw new Error("فرمت پاسخ نامعتبر است");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("زمان ترجمه به پایان رسید. لطفاً دوباره تلاش کنید.");
      }
      console.error("Google Translate API error:", error);
      throw error;
    }
  };

  const translateWithFallbackAPI = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ Text: text }]),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0]?.translations[0]?.text || text;
    } catch (error) {
      console.error("Fallback translation error:", error);
      throw new Error("سرویس جایگزین ترجمه نیز با خطا مواجه شد");
    }
  };

  const handleTranslate = useCallback(
    async (
      text: string,
      sourceLang: string = "auto",
      targetLang: string = "en"
    ) => {
      if (!text.trim()) {
        addNotification("warning", "هشدار", "متن برای ترجمه خالی است");
        return "";
      }

      setTranslationState((prev) => ({
        ...prev,
        isTranslating: true,
        sourceLang,
        targetLang,
      }));

      addNotification("info", "شروع ترجمه", "در حال ترجمه متن...");

      try {
        const response = await translateWithGoogleAPI(text, targetLang);

        setTranslationState((prev) => ({
          ...prev,
          translatedText: response,
          isTranslating: false,
        }));

        addNotification("success", "ترجمه کامل", "متن با موفقیت ترجمه شد");
        return response;
      } catch (error) {
        console.error("Translation error:", error);

        try {
          addNotification(
            "warning",
            "سرویس اول",
            "استفاده از سرویس جایگزین..."
          );
          const fallbackResponse = await translateWithFallbackAPI(
            text,
            targetLang
          );

          setTranslationState((prev) => ({
            ...prev,
            translatedText: fallbackResponse,
            isTranslating: false,
          }));

          addNotification(
            "success",
            "ترجمه کامل",
            "متن با سرویس جایگزین ترجمه شد"
          );
          return fallbackResponse;
        } catch (fallbackError) {
          const errorMsg =
            "خطا در ترجمه متن. لطفاً اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.";
          setTranslationState((prev) => ({
            ...prev,
            isTranslating: false,
          }));
          addNotification("error", "خطای ترجمه", errorMsg);
          return "";
        }
      }
    },
    [addNotification]
  );

  const toggleTranslationPanel = useCallback(() => {
    setShowTranslationPanel((prev) => !prev);
  }, []);

  return {
    translationState,
    setTranslationState,
    showTranslationPanel,
    setShowTranslationPanel,
    languages,
    handleTranslate,
    toggleTranslationPanel,
  };
};
