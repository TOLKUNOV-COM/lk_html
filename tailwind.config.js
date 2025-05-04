/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,pug,ts,jsx,tsx}'],
    safelist: [
        'grid-cols-4',
    ],
    theme: {
        fontFamily: {
            sans: ['Craftwork Sans', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
            serif: ['Craftwork Grotesk', 'serif'],
        },
    },
};
