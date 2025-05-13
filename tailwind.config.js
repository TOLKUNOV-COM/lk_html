/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,pug,ts,jsx,tsx}'],
    safelist: [
        'grid-cols-4',
        'text-green-500',
        'text-lime-400',
        'text-gold',
        'text-orange-400',
        'text-orange-500',
    ],
    theme: {
        fontFamily: {
            sans: ['Craftwork Sans', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
            serif: ['Craftwork Grotesk', 'serif'],
        },
    },
};
