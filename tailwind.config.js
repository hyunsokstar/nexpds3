/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}", // widgets 폴더 추가
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}", // features 폴더 추가
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}" 
    ],
    theme: {
        extend: {
            // 여기에 필요한 색상 테마 추가
        },
    },
    plugins: [],
}