module.exports = [
"[externals]/tesseract.js [external] (tesseract.js, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_tesseract_463eb979.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/tesseract.js [external] (tesseract.js, cjs)");
    });
});
}),
];