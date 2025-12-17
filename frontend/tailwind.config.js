/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6', // Blue-500
                secondary: '#64748B', // Slate-500
                dark: '#0F172A', // Slate-900
            }
        },
    },
    plugins: [],
}
