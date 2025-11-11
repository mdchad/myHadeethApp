/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#1C2A4F'
      },
      fontFamily: {
        'arabic-symbols': ['kfgqpc-arabic-symbols'],
        'arabic-regular': ['KFGQPC Uthman Taha Naskh'],
        'arabic-bold': ['KFGQPC Uthman Taha Naskh'],
        'uthmanic-hafs': ['kfgqpc_hafs_uthmanic_script']
      }
    }
  },
  plugins: []
}
