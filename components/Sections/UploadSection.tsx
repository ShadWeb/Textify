// "use client";

// import React, { useState, useRef, useCallback } from "react";
// import { TranslationState, UploadState, Notification } from "../../types";
// import Button from "../UI/Button";
// import {
//   Upload,
//   Copy,
//   Download,
//   Languages,
//   X,
//   FileText,
//   FileCode,
//   Image as ImageIcon,
//   AlertCircle,
//   CheckCircle2,
//   RefreshCw,
// } from "lucide-react";

// const UploadSection: React.FC = () => {
//   const [uploadState, setUploadState] = useState<UploadState>({
//     file: null,
//     isProcessing: false,
//     progress: 0,
//     extractedText: "",
//     error: null,
//   });

//   const [translationState, setTranslationState] = useState<TranslationState>({
//     translatedText: "",
//     sourceLang: "auto",
//     targetLang: "en",
//     isTranslating: false,
//   });

//   const [showTranslationPanel, setShowTranslationPanel] =
//     useState<boolean>(false);
//   const [isDragActive, setIsDragActive] = useState<boolean>(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [retryCount, setRetryCount] = useState<number>(0);
//   const [lastOperation, setLastOperation] = useState<string>("");

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const MAX_RETRIES = 3;
//   const RETRY_DELAY = 2000;

//   const languages = [
//     { code: "en", name: "انگلیسی" },
//     { code: "fr", name: "فرانسوی" },
//     { code: "de", name: "آلمانی" },
//     { code: "es", name: "اسپانیایی" },
//     { code: "ar", name: "عربی" },
//     { code: "ru", name: "روسی" },
//     { code: "zh", name: "چینی" },
//     { code: "ja", name: "ژاپنی" },
//     { code: "ko", name: "کره‌ای" },
//     { code: "fa", name: "فارسی" },
//   ];

//   // سیستم نوتیفیکیشن
//   const addNotification = useCallback(
//     (type: Notification["type"], title: string, message: string) => {
//       const id = Math.random().toString(36).substr(2, 9);
//       const newNotification: Notification = {
//         id,
//         type,
//         title,
//         message,
//         timestamp: new Date(),
//       };

//       setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // حداکثر ۵ نوتیفیکیشن

//       // حذف خودکار نوتیفیکیشن بعد از ۵ ثانیه
//       setTimeout(() => {
//         setNotifications((prev) => prev.filter((notif) => notif.id !== id));
//       }, 5000);
//     },
//     []
//   );

//   const removeNotification = useCallback((id: string) => {
//     setNotifications((prev) => prev.filter((notif) => notif.id !== id));
//   }, []);

//   // تابع تاخیر
//   const delay = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));

//   // پردازش تصویر با OCR با قابلیت تلاش مجدد
//   const processImageWithOCR = async (
//     file: File,
//     attempt: number = 1
//   ): Promise<string> => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       setLastOperation("ocr_processing");
//       addNotification(
//         "info",
//         "در حال پردازش تصویر",
//         `تلاش ${attempt} از ${MAX_RETRIES}`
//       );

//       return await processWithTesseract(formData);
//     } catch (error) {
//       if (attempt < MAX_RETRIES) {
//         addNotification(
//           "warning",
//           "خطا در پردازش",
//           `تلاش مجدد در ${RETRY_DELAY / 1000} ثانیه...`
//         );
//         await delay(RETRY_DELAY);
//         return processImageWithOCR(file, attempt + 1);
//       }
//       throw error;
//     }
//   };

//   const processWithTesseract = async (formData: FormData): Promise<string> => {
//     try {
//       const { createWorker } = await import("tesseract.js");

//       const worker = await createWorker({
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             const progress = Math.round(m.progress * 100);
//             setUploadState((prev) => ({
//               ...prev,
//               progress: Math.min(90, progress),
//             }));
//           }
//         },
//         errorHandler: (err) => {
//           console.error("Tesseract Worker Error:", err);
//           addNotification("error", "خطای Worker", "خطا در اجرای پردازشگر OCR");
//         },
//       });

//       await worker.loadLanguage("fas+eng");
//       await worker.initialize("fas+eng");

//       // تنظیم timeout برای پردازش
//       const processingTimeout = setTimeout(() => {
//         addNotification(
//           "warning",
//           "پردازش طولانی",
//           "پردازش تصویر بیشتر از حد انتظار طول می‌کشد..."
//         );
//       }, 10000);

//       const file = formData.get("image") as File;
//       const {
//         data: { text },
//       } = await worker.recognize(file);

//       clearTimeout(processingTimeout);
//       await worker.terminate();

//       return text.trim();
//     } catch (error) {
//       console.error("Tesseract error:", error);

//       if (error instanceof Error) {
//         if (error.message.includes("timeout")) {
//           throw new Error(
//             "پردازش تصویر timeout خورد. لطفاً تصویر ساده‌تری آپلود کنید."
//           );
//         } else if (error.message.includes("language")) {
//           throw new Error("خطا در بارگذاری زبان‌های مورد نیاز برای OCR");
//         }
//       }

//       throw new Error(
//         "خطا در پردازش تصویر با Tesseract. لطفاً دوباره تلاش کنید."
//       );
//     }
//   };

//   const validateFile = (file: File): { isValid: boolean; error?: string } => {
//     const validTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "image/bmp",
//       "image/gif",
//     ];

//     if (!validTypes.includes(file.type)) {
//       return {
//         isValid: false,
//         error: "فقط فایل‌های JPG, PNG, WEBP, BMP, GIF مجاز هستند",
//       };
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       return {
//         isValid: false,
//         error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
//       };
//     }

//     if (file.size === 0) {
//       return {
//         isValid: false,
//         error: "فایل خالی است",
//       };
//     }

//     return { isValid: true };
//   };

//   const handleFileSelect = useCallback(
//     async (file: File) => {
//       // اعتبارسنجی فایل
//       const validation = validateFile(file);
//       if (!validation.isValid) {
//         setUploadState((prev) => ({
//           ...prev,
//           error: validation.error || "خطای نامشخص در فایل",
//         }));
//         addNotification(
//           "error",
//           "خطای فایل",
//           validation.error || "فایل نامعتبر است"
//         );
//         return;
//       }

//       setUploadState({
//         file,
//         error: null,
//         isProcessing: true,
//         progress: 0,
//         extractedText: "",
//       });

//       setTranslationState({
//         translatedText: "",
//         sourceLang: "auto",
//         targetLang: "en",
//         isTranslating: false,
//       });

//       setShowTranslationPanel(false);
//       setRetryCount(0);

//       try {
//         // شبیه‌سازی پیشرفت
//         const progressInterval = setInterval(() => {
//           setUploadState((prev) => {
//             if (prev.progress >= 50 || !prev.isProcessing) {
//               clearInterval(progressInterval);
//               return prev;
//             }
//             return { ...prev, progress: prev.progress + 5 };
//           });
//         }, 500);

//         const extractedText = await processImageWithOCR(file);
//         clearInterval(progressInterval);

//         setUploadState((prev) => ({
//           ...prev,
//           progress: 100,
//         }));

//         setTimeout(() => {
//           setUploadState({
//             file,
//             isProcessing: false,
//             progress: 100,
//             extractedText,
//             error: null,
//           });

//           if (extractedText.trim().length === 0) {
//             addNotification(
//               "warning",
//               "هشدار",
//               "هیچ متنی در تصویر شناسایی نشد. ممکن است تصویر واضح نباشد یا متن نداشته باشد."
//             );
//           } else {
//             addNotification(
//               "success",
//               "موفق",
//               `متن با موفقیت استخراج شد (${extractedText.length} کاراکتر)`
//             );
//           }
//         }, 300);
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error
//             ? error.message
//             : "خطای ناشناخته در پردازش تصویر";

//         setUploadState((prev) => ({
//           ...prev,
//           isProcessing: false,
//           error: errorMessage,
//         }));

//         addNotification("error", "خطای پردازش", errorMessage);

//         // پیشنهاد راه‌حل
//         if (errorMessage.includes("timeout")) {
//           addNotification(
//             "info",
//             "راهنمایی",
//             "سعی کنید تصویر با وضوح پایین‌تر یا متن کمتر آپلود کنید."
//           );
//         }
//       }
//     },
//     [addNotification]
//   );

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragActive(false);

//       if (e.dataTransfer.files.length > 1) {
//         addNotification(
//           "warning",
//           "توجه",
//           "فقط یک فایل می‌توانید آپلود کنید. اولین فایل انتخاب شد."
//         );
//       }

//       const file = e.dataTransfer.files[0];
//       if (file) handleFileSelect(file);
//     },
//     [handleFileSelect, addNotification]
//   );

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragActive(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragActive(false);
//   }, []);

//   const handleFileInput = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         handleFileSelect(file);
//       } else {
//         addNotification("error", "خطا", "فایلی انتخاب نشد");
//       }
//       if (e.target) e.target.value = "";
//     },
//     [handleFileSelect, addNotification]
//   );

//   const handleCopyText = useCallback(
//     async (text: string, type: string = "متن") => {
//       if (!text.trim()) {
//         addNotification("warning", "هشدار", "متن برای کپی خالی است");
//         return;
//       }

//       try {
//         await navigator.clipboard.writeText(text);
//         addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
//       } catch (err) {
//         console.error("Failed to copy text:", err);
//         try {
//           // روش fallback برای مرورگرهای قدیمی
//           const textArea = document.createElement("textarea");
//           textArea.value = text;
//           textArea.style.position = "fixed";
//           textArea.style.opacity = "0";
//           document.body.appendChild(textArea);
//           textArea.select();
//           document.execCommand("copy");
//           document.body.removeChild(textArea);
//           addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
//         } catch (fallbackError) {
//           addNotification("error", "خطا", `خطا در کپی ${type}`);
//         }
//       }
//     },
//     [addNotification]
//   );

//   const downloadTextFile = useCallback(
//     (
//       text: string,
//       format: "txt" | "docx",
//       filename: string = "extracted-text"
//     ) => {
//       if (!text.trim()) {
//         addNotification("warning", "هشدار", "متن برای دانلود خالی است");
//         return;
//       }

//       try {
//         const element = document.createElement("a");
//         const blob = new Blob([text], {
//           type:
//             format === "txt"
//               ? "text/plain;charset=utf-8"
//               : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         });
//         element.href = URL.createObjectURL(blob);
//         element.download = `${filename}.${format}`;
//         document.body.appendChild(element);
//         element.click();
//         document.body.removeChild(element);
//         URL.revokeObjectURL(element.href);

//         addNotification(
//           "success",
//           "موفق",
//           `فایل ${format} با موفقیت دانلود شد`
//         );
//       } catch (error) {
//         console.error("Download error:", error);
//         addNotification("error", "خطا", "خطا در دانلود فایل");
//       }
//     },
//     [addNotification]
//   );

//   const resetUpload = useCallback(() => {
//     setUploadState({
//       file: null,
//       isProcessing: false,
//       progress: 0,
//       extractedText: "",
//       error: null,
//     });
//     setTranslationState({
//       translatedText: "",
//       sourceLang: "auto",
//       targetLang: "en",
//       isTranslating: false,
//     });
//     setShowTranslationPanel(false);
//     setRetryCount(0);
//     if (fileInputRef.current) fileInputRef.current.value = "";

//     addNotification("info", "بازنشانی", "آپلود جدید آماده است");
//   }, [addNotification]);

//   const retryLastOperation = useCallback(() => {
//     if (uploadState.file && lastOperation === "ocr_processing") {
//       addNotification("info", "تلاش مجدد", "در حال پردازش مجدد تصویر...");
//       handleFileSelect(uploadState.file);
//     }
//   }, [uploadState.file, lastOperation, handleFileSelect, addNotification]);

//   const handleTranslate = useCallback(
//     async (sourceLang: string = "auto", targetLang: string = "en") => {
//       if (!uploadState.extractedText.trim()) {
//         addNotification("warning", "هشدار", "متن برای ترجمه خالی است");
//         return;
//       }

//       setTranslationState((prev) => ({
//         ...prev,
//         isTranslating: true,
//         sourceLang,
//         targetLang,
//       }));

//       addNotification("info", "شروع ترجمه", "در حال ترجمه متن...");

//       try {
//         const textToTranslate = uploadState.extractedText;
//         const response = await translateWithGoogleAPI(
//           textToTranslate,
//           targetLang
//         );

//         setTranslationState((prev) => ({
//           ...prev,
//           translatedText: response,
//           isTranslating: false,
//         }));

//         setShowTranslationPanel(true);
//         addNotification("success", "ترجمه کامل", "متن با موفقیت ترجمه شد");
//       } catch (error) {
//         console.error("Translation error:", error);

//         try {
//           addNotification(
//             "warning",
//             "سرویس اول",
//             "استفاده از سرویس جایگزین..."
//           );
//           const fallbackResponse = await translateWithFallbackAPI(
//             uploadState.extractedText,
//             targetLang
//           );

//           setTranslationState((prev) => ({
//             ...prev,
//             translatedText: fallbackResponse,
//             isTranslating: false,
//           }));

//           setShowTranslationPanel(true);
//           addNotification(
//             "success",
//             "ترجمه کامل",
//             "متن با سرویس جایگزین ترجمه شد"
//           );
//         } catch (fallbackError) {
//           const errorMsg =
//             "خطا در ترجمه متن. لطفاً اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.";
//           setTranslationState((prev) => ({
//             ...prev,
//             isTranslating: false,
//           }));
//           addNotification("error", "خطای ترجمه", errorMsg);
//         }
//       }
//     },
//     [uploadState.extractedText, addNotification]
//   );

//   const translateWithGoogleAPI = async (
//     text: string,
//     targetLang: string
//   ): Promise<string> => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 ثانیه timeout

//       const response = await fetch(
//         `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
//           text
//         )}`,
//         { signal: controller.signal }
//       );

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data && data[0] && Array.isArray(data[0])) {
//         return data[0].map((item: any[]) => item[0]).join("");
//       }

//       throw new Error("فرمت پاسخ نامعتبر است");
//     } catch (error) {
//       if (error instanceof Error && error.name === "AbortError") {
//         throw new Error("زمان ترجمه به پایان رسید. لطفاً دوباره تلاش کنید.");
//       }
//       console.error("Google Translate API error:", error);
//       throw error;
//     }
//   };

//   const translateWithFallbackAPI = async (
//     text: string,
//     targetLang: string
//   ): Promise<string> => {
//     try {
//       const response = await fetch(
//         `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify([{ Text: text }]),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data[0]?.translations[0]?.text || text;
//     } catch (error) {
//       console.error("Fallback translation error:", error);
//       throw new Error("سرویس جایگزین ترجمه نیز با خطا مواجه شد");
//     }
//   };

//   const toggleTranslationPanel = useCallback(() => {
//     setShowTranslationPanel((prev) => !prev);
//   }, []);

//   const shouldShowUploadBox =
//     !uploadState.file && !uploadState.extractedText && !uploadState.error;

//   return (
//     <section className="py-16 sm:py-24 bg-slate-100 rounded-2xl dark:bg-slate-900/50 transition-colors duration-300 relative">
//       {/* سیستم نوتیفیکیشن */}
//       <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`p-4 rounded-lg shadow-lg border-l-4 ${
//               notification.type === "success"
//                 ? "bg-green-50 border-green-500 dark:bg-green-900/20"
//                 : notification.type === "error"
//                 ? "bg-red-50 border-red-500 dark:bg-red-900/20"
//                 : notification.type === "warning"
//                 ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20"
//                 : "bg-blue-50 border-blue-500 dark:bg-blue-900/20"
//             } transition-all duration-300 transform hover:scale-105`}
//           >
//             <div className="flex items-start gap-3">
//               {notification.type === "success" && (
//                 <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
//               )}
//               {notification.type === "error" && (
//                 <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//               )}
//               {notification.type === "warning" && (
//                 <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//               )}
//               {notification.type === "info" && (
//                 <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//               )}

//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <p
//                     className={`font-medium ${
//                       notification.type === "success"
//                         ? "text-green-800"
//                         : notification.type === "error"
//                         ? "text-red-800"
//                         : notification.type === "warning"
//                         ? "text-yellow-800"
//                         : "text-blue-800"
//                     }`}
//                   >
//                     {notification.title}
//                   </p>
//                   <button
//                     onClick={() => removeNotification(notification.id)}
//                     className="text-slate-400 hover:text-slate-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <p
//                   className={`text-sm mt-1 ${
//                     notification.type === "success"
//                       ? "text-green-600"
//                       : notification.type === "error"
//                       ? "text-red-600"
//                       : notification.type === "warning"
//                       ? "text-yellow-600"
//                       : "text-blue-600"
//                   }`}
//                 >
//                   {notification.message}
//                 </p>
//                 <p className="text-xs text-slate-400 mt-2">
//                   {notification.timestamp.toLocaleTimeString("fa-IR")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-8">
//         {/* Upload Zone */}
//         {shouldShowUploadBox && (
//           <div
//             className={`w-full flex flex-col items-center gap-6 rounded-xl border-2 border-dashed transition-all duration-300 px-6 py-14 cursor-pointer
//               ${
//                 isDragActive
//                   ? "border-primary bg-primary/5 dark:bg-primary/10"
//                   : "border-slate-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50"
//               }
//               bg-white dark:bg-slate-800 shadow-sm hover:shadow-md`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <div
//               className={`transition-colors duration-300 ${
//                 isDragActive ? "text-primary" : "text-slate-400"
//               }`}
//             >
//               {isDragActive ? (
//                 <Upload className="w-16 h-16 animate-pulse" />
//               ) : (
//                 <ImageIcon className="w-16 h-16" />
//               )}
//             </div>
//             <div className="flex max-w-[480px] flex-col items-center gap-2">
//               <p className="text-xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
//                 {isDragActive
//                   ? "فایل را رها کنید"
//                   : "فایل را اینجا بکشید یا انتخاب کنید"}
//               </p>
//               <p className="text-sm text-center text-slate-500 dark:text-slate-400">
//                 فایل تصویری خود را آپلود کنید (JPG, PNG, WEBP, BMP, GIF) -
//                 حداکثر ۱۰ مگابایت
//               </p>
//             </div>
//             <Button
//               variant="secondary"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 fileInputRef.current?.click();
//               }}
//               icon={<Upload className="w-4 h-4" />}
//             >
//               انتخاب فایل
//             </Button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".jpg,.jpeg,.png,.webp,.bmp,.gif"
//               className="hidden"
//               onChange={handleFileInput}
//             />
//           </div>
//         )}

//         {/* Progress Bar */}
//         {uploadState.isProcessing && (
//           <div className="w-full flex-col rounded-2xl gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
//             <div className="flex gap-6 justify-between items-center">
//               <p className="text-base font-medium text-slate-900 dark:text-white">
//                 در حال پردازش تصویر و استخراج متن...
//               </p>
//               <span className="text-base font-medium text-primary">
//                 {uploadState.progress}%
//               </span>
//             </div>
//             <div className="rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
//               <div
//                 className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
//                 style={{ width: `${uploadState.progress}%` }}
//               />
//             </div>
//             <p className="text-xs text-slate-500 mt-2">
//               این عملیات ممکن است چند لحظه طول بکشد...
//             </p>
//           </div>
//         )}

//         {/* Error Message با قابلیت تلاش مجدد */}
//         {uploadState.error && (
//           <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1">
//                 <p className="text-red-700 dark:text-red-300 font-medium">
//                   خطا در پردازش
//                 </p>
//                 <p className="text-red-600 dark:text-red-400 text-sm mt-1">
//                   {uploadState.error}
//                 </p>
//                 <div className="mt-4 flex gap-2 flex-wrap">
//                   <Button variant="outline" onClick={resetUpload} size="sm">
//                     آپلود جدید
//                   </Button>
//                   {uploadState.file && retryCount < MAX_RETRIES && (
//                     <Button
//                       variant="primary"
//                       onClick={retryLastOperation}
//                       size="sm"
//                       icon={<RefreshCw className="w-4 h-4" />}
//                     >
//                       تلاش مجدد
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Extracted Text Section */}
//         {uploadState.extractedText && !uploadState.isProcessing && (
//           <div className="w-full flex flex-col gap-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <p className="text-lg font-bold text-slate-900 dark:text-white">
//                 متن استخراج شده از تصویر
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   variant="primary"
//                   onClick={toggleTranslationPanel}
//                   icon={<Languages className="w-4 h-4" />}
//                 >
//                   {showTranslationPanel ? "بستن ترجمه" : "ترجمه متن"}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={resetUpload}
//                   size="sm"
//                   icon={<X className="w-4 h-4" />}
//                 >
//                   آپلود جدید
//                 </Button>
//               </div>
//             </div>

//             {/* دو بخش کنار هم */}
//             <div
//               className={`grid gap-6 ${
//                 showTranslationPanel
//                   ? "grid-cols-1 lg:grid-cols-2"
//                   : "grid-cols-1"
//               } transition-all duration-300`}
//             >
//               {/* بخش متن اصلی */}
//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     متن اصلی ({uploadState.extractedText.length} کاراکتر)
//                   </label>
//                   <div className="flex gap-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() =>
//                         handleCopyText(uploadState.extractedText, "متن اصلی")
//                       }
//                       icon={<Copy className="w-4 h-4" />}
//                     >
//                       کپی
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <textarea
//                     className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
//                     value={uploadState.extractedText}
//                     readOnly
//                     placeholder="متن استخراج شده از تصویر در اینجا نمایش داده می‌شود..."
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       downloadTextFile(
//                         uploadState.extractedText,
//                         "txt",
//                         "متن-استخراج-شده"
//                       )
//                     }
//                     icon={<FileText className="w-4 h-4" />}
//                     size="sm"
//                   >
//                     دانلود TXT
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       downloadTextFile(
//                         uploadState.extractedText,
//                         "docx",
//                         "متن-استخراج-شده"
//                       )
//                     }
//                     icon={<FileCode className="w-4 h-4" />}
//                     size="sm"
//                   >
//                     دانلود DOCX
//                   </Button>
//                 </div>
//               </div>

//               {/* بخش ترجمه */}
//               {showTranslationPanel && (
//                 <div className="flex flex-col gap-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       متن ترجمه شده
//                       {translationState.translatedText &&
//                         ` (${translationState.translatedText.length} کاراکتر)`}
//                     </label>
//                     <div className="flex gap-2">
//                       <select
//                         className="text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
//                         value={translationState.targetLang}
//                         onChange={(e) =>
//                           handleTranslate("auto", e.target.value)
//                         }
//                         disabled={translationState.isTranslating}
//                       >
//                         {languages.map((lang) => (
//                           <option key={lang.code} value={lang.code}>
//                             {lang.name}
//                           </option>
//                         ))}
//                       </select>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           handleCopyText(
//                             translationState.translatedText,
//                             "متن ترجمه شده"
//                           )
//                         }
//                         icon={<Copy className="w-4 h-4" />}
//                         disabled={!translationState.translatedText}
//                       >
//                         کپی
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <textarea
//                       className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
//                       value={
//                         translationState.isTranslating
//                           ? "در حال ترجمه..."
//                           : translationState.translatedText
//                       }
//                       readOnly
//                       placeholder="متن ترجمه شده در اینجا نمایش داده می‌شود..."
//                     />
//                     {translationState.isTranslating && (
//                       <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
//                         <div className="flex items-center gap-3 text-primary">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
//                           <span className="text-sm font-medium">
//                             در حال ترجمه...
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() =>
//                         downloadTextFile(
//                           translationState.translatedText,
//                           "txt",
//                           "متن-ترجمه-شده"
//                         )
//                       }
//                       icon={<FileText className="w-4 h-4" />}
//                       size="sm"
//                       disabled={!translationState.translatedText}
//                     >
//                       TXT ترجمه
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={() =>
//                         downloadTextFile(
//                           translationState.translatedText,
//                           "docx",
//                           "متن-ترجمه-شده"
//                         )
//                       }
//                       icon={<FileCode className="w-4 h-4" />}
//                       size="sm"
//                       disabled={!translationState.translatedText}
//                     >
//                       DOCX ترجمه
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* دکمه‌های ترجمه در حالت بسته بودن پنل */}
//             {!showTranslationPanel && (
//               <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-slate-200 dark:border-slate-700">
//                 <Button
//                   variant="primary"
//                   onClick={() => handleTranslate("auto", "en")}
//                   icon={<Languages className="w-4 h-4" />}
//                   disabled={translationState.isTranslating}
//                 >
//                   ترجمه به انگلیسی
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={() => handleTranslate("auto", "fr")}
//                   icon={<Languages className="w-4 h-4" />}
//                   disabled={translationState.isTranslating}
//                 >
//                   ترجمه به فرانسوی
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={() => handleTranslate("auto", "de")}
//                   icon={<Languages className="w-4 h-4" />}
//                   disabled={translationState.isTranslating}
//                 >
//                   ترجمه به آلمانی
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default UploadSection;
"use client";

import React, { useState, useRef, useCallback } from "react";
import { TranslationState, UploadState, Notification } from "../../types";
import Button from "../UI/Button";
import {
  Upload,
  Copy,
  Download,
  Languages,
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const UploadSection: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isProcessing: false,
    progress: 0,
    extractedText: "",
    error: null,
  });

  const [translationState, setTranslationState] = useState<TranslationState>({
    translatedText: "",
    sourceLang: "auto",
    targetLang: "en",
    isTranslating: false,
  });

  const [showTranslationPanel, setShowTranslationPanel] =
    useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastOperation, setLastOperation] = useState<string>("");
  const [editableText, setEditableText] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const languages = [
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

  // سیستم نوتیفیکیشن
  const addNotification = useCallback(
    (type: Notification["type"], title: string, message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // حداکثر ۵ نوتیفیکیشن

      // حذف خودکار نوتیفیکیشن بعد از ۵ ثانیه
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // تابع تاخیر
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // پردازش تصویر با OCR با قابلیت تلاش مجدد
  const processImageWithOCR = async (
    file: File,
    attempt: number = 1
  ): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      setLastOperation("ocr_processing");
      addNotification(
        "info",
        "در حال پردازش تصویر",
        `تلاش ${attempt} از ${MAX_RETRIES}`
      );

      return await processWithTesseract(formData);
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        addNotification(
          "warning",
          "خطا در پردازش",
          `تلاش مجدد در ${RETRY_DELAY / 1000} ثانیه...`
        );
        await delay(RETRY_DELAY);
        return processImageWithOCR(file, attempt + 1);
      }
      throw error;
    }
  };

  const processWithTesseract = async (formData: FormData): Promise<string> => {
    try {
      const { createWorker } = await import("tesseract.js");

      const worker = await createWorker({
        logger: (m) => {
          if (m.status === "recognizing text") {
            const progress = Math.round(m.progress * 100);
            setUploadState((prev) => ({
              ...prev,
              progress: Math.min(90, progress),
            }));
          }
        },
        errorHandler: (err) => {
          console.error("Tesseract Worker Error:", err);
          addNotification("error", "خطای Worker", "خطا در اجرای پردازشگر OCR");
        },
      });

      await worker.loadLanguage("fas+eng");
      await worker.initialize("fas+eng");

      // تنظیم timeout برای پردازش
      const processingTimeout = setTimeout(() => {
        addNotification(
          "warning",
          "پردازش طولانی",
          "پردازش تصویر بیشتر از حد انتظار طول می‌کشد..."
        );
      }, 10000);

      const file = formData.get("image") as File;
      const {
        data: { text },
      } = await worker.recognize(file);

      clearTimeout(processingTimeout);
      await worker.terminate();

      return text.trim();
    } catch (error) {
      console.error("Tesseract error:", error);

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          throw new Error(
            "پردازش تصویر timeout خورد. لطفاً تصویر ساده‌تری آپلود کنید."
          );
        } else if (error.message.includes("language")) {
          throw new Error("خطا در بارگذاری زبان‌های مورد نیاز برای OCR");
        }
      }

      throw new Error(
        "خطا در پردازش تصویر با Tesseract. لطفاً دوباره تلاش کنید."
      );
    }
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "فقط فایل‌های JPG, PNG, WEBP, BMP, GIF مجاز هستند",
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: "فایل خالی است",
      };
    }

    return { isValid: true };
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      // اعتبارسنجی فایل
      const validation = validateFile(file);
      if (!validation.isValid) {
        setUploadState((prev) => ({
          ...prev,
          error: validation.error || "خطای نامشخص در فایل",
        }));
        addNotification(
          "error",
          "خطای فایل",
          validation.error || "فایل نامعتبر است"
        );
        return;
      }

      setUploadState({
        file,
        error: null,
        isProcessing: true,
        progress: 0,
        extractedText: "",
      });

      setTranslationState({
        translatedText: "",
        sourceLang: "auto",
        targetLang: "en",
        isTranslating: false,
      });

      setShowTranslationPanel(false);
      setRetryCount(0);

      try {
        // شبیه‌سازی پیشرفت
        const progressInterval = setInterval(() => {
          setUploadState((prev) => {
            if (prev.progress >= 50 || !prev.isProcessing) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, progress: prev.progress + 5 };
          });
        }, 500);

        const extractedText = await processImageWithOCR(file);
        clearInterval(progressInterval);

        setUploadState((prev) => ({
          ...prev,
          progress: 100,
        }));

        setTimeout(() => {
          setUploadState({
            file,
            isProcessing: false,
            progress: 100,
            extractedText,
            error: null,
          });
          setEditableText(extractedText);

          if (extractedText.trim().length === 0) {
            addNotification(
              "warning",
              "هشدار",
              "هیچ متنی در تصویر شناسایی نشد. ممکن است تصویر واضح نباشد یا متن نداشته باشد."
            );
          } else {
            addNotification(
              "success",
              "موفق",
              `متن با موفقیت استخراج شد (${extractedText.length} کاراکتر)`
            );
          }
        }, 300);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "خطای ناشناخته در پردازش تصویر";

        setUploadState((prev) => ({
          ...prev,
          isProcessing: false,
          error: errorMessage,
        }));

        addNotification("error", "خطای پردازش", errorMessage);

        // پیشنهاد راه‌حل
        if (errorMessage.includes("timeout")) {
          addNotification(
            "info",
            "راهنمایی",
            "سعی کنید تصویر با وضوح پایین‌تر یا متن کمتر آپلود کنید."
          );
        }
      }
    },
    [addNotification]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      if (e.dataTransfer.files.length > 1) {
        addNotification(
          "warning",
          "توجه",
          "فقط یک فایل می‌توانید آپلود کنید. اولین فایل انتخاب شد."
        );
      }

      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect, addNotification]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      } else {
        addNotification("error", "خطا", "فایلی انتخاب نشد");
      }
      if (e.target) e.target.value = "";
    },
    [handleFileSelect, addNotification]
  );

  const handleCopyText = useCallback(
    async (text: string, type: string = "متن") => {
      if (!text.trim()) {
        addNotification("warning", "هشدار", "متن برای کپی خالی است");
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
      } catch (err) {
        console.error("Failed to copy text:", err);
        try {
          // روش fallback برای مرورگرهای قدیمی
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          addNotification("success", "موفق", `${type} با موفقیت کپی شد`);
        } catch (fallbackError) {
          addNotification("error", "خطا", `خطا در کپی ${type}`);
        }
      }
    },
    [addNotification]
  );

  const downloadTextFile = useCallback(
    (
      text: string,
      format: "txt" | "docx",
      filename: string = "extracted-text"
    ) => {
      if (!text.trim()) {
        addNotification("warning", "هشدار", "متن برای دانلود خالی است");
        return;
      }

      try {
        const element = document.createElement("a");
        const blob = new Blob([text], {
          type:
            format === "txt"
              ? "text/plain;charset=utf-8"
              : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        element.href = URL.createObjectURL(blob);
        element.download = `${filename}.${format}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);

        addNotification(
          "success",
          "موفق",
          `فایل ${format} با موفقیت دانلود شد`
        );
      } catch (error) {
        console.error("Download error:", error);
        addNotification("error", "خطا", "خطا در دانلود فایل");
      }
    },
    [addNotification]
  );

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      isProcessing: false,
      progress: 0,
      extractedText: "",
      error: null,
    });
    setTranslationState({
      translatedText: "",
      sourceLang: "auto",
      targetLang: "en",
      isTranslating: false,
    });
    setShowTranslationPanel(false);
    setRetryCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";

    addNotification("info", "بازنشانی", "آپلود جدید آماده است");
  }, [addNotification]);

  const retryLastOperation = useCallback(() => {
    if (uploadState.file && lastOperation === "ocr_processing") {
      addNotification("info", "تلاش مجدد", "در حال پردازش مجدد تصویر...");
      handleFileSelect(uploadState.file);
    }
  }, [uploadState.file, lastOperation, handleFileSelect, addNotification]);

  const handleTranslate = useCallback(
    async (sourceLang: string = "auto", targetLang: string = "en") => {
      if (!editableText.trim()) {
        addNotification("warning", "هشدار", "متن برای ترجمه خالی است");
        return;
      }

      setTranslationState((prev) => ({
        ...prev,
        isTranslating: true,
        sourceLang,
        targetLang,
      }));

      addNotification("info", "شروع ترجمه", "در حال ترجمه متن...");

      try {
        const textToTranslate = editableText;
        const response = await translateWithGoogleAPI(
          textToTranslate,
          targetLang
        );

        setTranslationState((prev) => ({
          ...prev,
          translatedText: response,
          isTranslating: false,
        }));

        setShowTranslationPanel(true);
        addNotification("success", "ترجمه کامل", "متن با موفقیت ترجمه شد");
      } catch (error) {
        console.error("Translation error:", error);

        try {
          addNotification(
            "warning",
            "سرویس اول",
            "استفاده از سرویس جایگزین..."
          );
          const fallbackResponse = await translateWithFallbackAPI(
            editableText,
            targetLang
          );

          setTranslationState((prev) => ({
            ...prev,
            translatedText: fallbackResponse,
            isTranslating: false,
          }));

          setShowTranslationPanel(true);
          addNotification(
            "success",
            "ترجمه کامل",
            "متن با سرویس جایگزین ترجمه شد"
          );
        } catch (fallbackError) {
          const errorMsg =
            "خطا در ترجمه متن. لطفاً اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.";
          setTranslationState((prev) => ({
            ...prev,
            isTranslating: false,
          }));
          addNotification("error", "خطای ترجمه", errorMsg);
        }
      }
    },
    [editableText, addNotification]
  );

  const translateWithGoogleAPI = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 ثانیه timeout

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

  const toggleTranslationPanel = useCallback(() => {
    setShowTranslationPanel((prev) => !prev);
    if (!showTranslationPanel && !translationState.translatedText) {
      handleTranslate("auto", translationState.targetLang);
    }
  }, [showTranslationPanel, translationState, handleTranslate]);

  const handleTextChange = useCallback((text: string) => {
    setEditableText(text);
  }, []);

  const shouldShowUploadBox =
    !uploadState.file && !uploadState.extractedText && !uploadState.error;

  return (
    <section className="py-16 sm:py-24 bg-slate-100 rounded-2xl dark:bg-slate-900/50 transition-colors duration-300 relative">
      {/* سیستم نوتیفیکیشن */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === "success"
                ? "bg-green-50 border-green-500 dark:bg-green-900/20"
                : notification.type === "error"
                ? "bg-red-50 border-red-500 dark:bg-red-900/20"
                : notification.type === "warning"
                ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20"
                : "bg-blue-50 border-blue-500 dark:bg-blue-900/20"
            } transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              {notification.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              {notification.type === "warning" && (
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              )}
              {notification.type === "info" && (
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p
                    className={`font-medium ${
                      notification.type === "success"
                        ? "text-green-800"
                        : notification.type === "error"
                        ? "text-red-800"
                        : notification.type === "warning"
                        ? "text-yellow-800"
                        : "text-blue-800"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    notification.type === "success"
                      ? "text-green-600"
                      : notification.type === "error"
                      ? "text-red-600"
                      : notification.type === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {notification.timestamp.toLocaleTimeString("fa-IR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-8">
        {/* Upload Zone */}
        {shouldShowUploadBox && (
          <div
            className={`w-full flex flex-col items-center gap-6 rounded-xl border-2 border-dashed transition-all duration-300 px-6 py-14 cursor-pointer
              ${
                isDragActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-slate-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50"
              }
              bg-white dark:bg-slate-800 shadow-sm hover:shadow-md`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={`transition-colors duration-300 ${
                isDragActive ? "text-primary" : "text-slate-400"
              }`}
            >
              {isDragActive ? (
                <Upload className="w-16 h-16 animate-pulse" />
              ) : (
                <ImageIcon className="w-16 h-16" />
              )}
            </div>
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
                {isDragActive
                  ? "فایل را رها کنید"
                  : "فایل را اینجا بکشید یا انتخاب کنید"}
              </p>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                فایل تصویری خود را آپلود کنید (JPG, PNG, WEBP, BMP, GIF) -
                حداکثر ۱۰ مگابایت
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              icon={<Upload className="w-4 h-4" />}
            >
              انتخاب فایل
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.bmp,.gif"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}

        {/* Progress Bar */}
        {uploadState.isProcessing && (
          <div className="w-full flex-col rounded-2xl gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex gap-6 justify-between items-center">
              <p className="text-base font-medium text-slate-900 dark:text-white">
                در حال پردازش تصویر و استخراج متن...
              </p>
              <span className="text-base font-medium text-primary">
                {uploadState.progress}%
              </span>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              این عملیات ممکن است چند لحظه طول بکشد...
            </p>
          </div>
        )}

        {/* Error Message با قابلیت تلاش مجدد */}
        {uploadState.error && (
          <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  خطا در پردازش
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {uploadState.error}
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={resetUpload} size="sm">
                    آپلود جدید
                  </Button>
                  {uploadState.file && retryCount < MAX_RETRIES && (
                    <Button
                      variant="primary"
                      onClick={retryLastOperation}
                      size="sm"
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      تلاش مجدد
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Text Section */}
        {uploadState.extractedText && !uploadState.isProcessing && (
          <div className="w-full flex flex-col gap-6">
            {/* هدر بخش متن اصلی */}
            <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    متن استخراج شده از تصویر
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {uploadState.extractedText.length} کاراکتر
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={toggleTranslationPanel}
                    icon={<Languages className="w-4 h-4" />}
                  >
                    {showTranslationPanel ? "بستن ترجمه" : "ترجمه متن"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyText(editableText, "متن اصلی")}
                    icon={<Copy className="w-4 h-4" />}
                    size="sm"
                  >
                    کپی متن
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={resetUpload}
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                  >
                    آپلود جدید
                  </Button>
                </div>
              </div>

              {/* متن اصلی قابل ویرایش */}
              <div className="relative">
                <textarea
                  className="form-input w-full min-h-48 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                  value={editableText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="متن استخراج شده از تصویر در اینجا نمایش داده می‌شود. می‌توانید آن را ویرایش کنید..."
                />
              </div>

              {/* دکمه‌های اقدام برای متن اصلی */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadTextFile(editableText, "txt", "متن-استخراج-شده")
                  }
                  icon={<FileText className="w-4 h-4" />}
                  size="sm"
                >
                  دانلود TXT
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadTextFile(editableText, "docx", "متن-استخراج-شده")
                  }
                  icon={<FileCode className="w-4 h-4" />}
                  size="sm"
                >
                  دانلود DOCX
                </Button>
              </div>
            </div>

            {/* بخش ترجمه - در صورت فعال بودن */}
            {showTranslationPanel && (
              <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* بخش متن ورودی */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          متن ورودی (قابل ویرایش)
                        </label>
                        <span className="text-xs text-slate-500">
                          {editableText.length} کاراکتر
                        </span>
                      </div>
                      <div className="relative">
                        <textarea
                          className="form-input w-full min-h-64 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                          value={editableText}
                          onChange={(e) => handleTextChange(e.target.value)}
                          placeholder="متن را برای ترجمه در اینجا ویرایش کنید..."
                        />
                      </div>
                    </div>

                    {/* بخش ترجمه */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          متن ترجمه شده
                        </label>
                        <div className="flex gap-2">
                          <select
                            className="text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                            value={translationState.targetLang}
                            onChange={(e) =>
                              handleTranslate("auto", e.target.value)
                            }
                            disabled={translationState.isTranslating}
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          className="form-input w-full min-h-64 p-4 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-y focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 leading-relaxed"
                          value={
                            translationState.isTranslating
                              ? "در حال ترجمه..."
                              : translationState.translatedText
                          }
                          readOnly
                          placeholder="متن ترجمه شده در اینجا نمایش داده می‌شود..."
                        />
                        {translationState.isTranslating && (
                          <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-3 text-primary">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                              <span className="text-sm font-medium">
                                در حال ترجمه...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* دکمه‌های اقدام برای ترجمه */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleCopyText(
                              translationState.translatedText,
                              "متن ترجمه شده"
                            )
                          }
                          icon={<Copy className="w-4 h-4" />}
                          size="sm"
                          disabled={!translationState.translatedText}
                        >
                          کپی ترجمه
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            downloadTextFile(
                              translationState.translatedText,
                              "txt",
                              "متن-ترجمه-شده"
                            )
                          }
                          icon={<FileText className="w-4 h-4" />}
                          size="sm"
                          disabled={!translationState.translatedText}
                        >
                          TXT ترجمه
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            downloadTextFile(
                              translationState.translatedText,
                              "docx",
                              "متن-ترجمه-شده"
                            )
                          }
                          icon={<FileCode className="w-4 h-4" />}
                          size="sm"
                          disabled={!translationState.translatedText}
                        >
                          DOCX ترجمه
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* دکمه ترجمه مجدد */}
                  <div className="flex justify-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleTranslate("auto", translationState.targetLang)
                      }
                      icon={<RefreshCw className="w-4 h-4" />}
                      disabled={translationState.isTranslating}
                    >
                      ترجمه مجدد
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
