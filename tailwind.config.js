/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        barber: {
          primary: "#1C1917", // Deep charcoal
          secondary: "#C4A484", // Vintage brown
          accent: "#D4AF37", // Gold
          light: "#F5F5DC", // Beige
          dark: "#0C0A09", // Almost black
        },
      },
      backgroundImage: {
        "barber-pattern": "url('/patterns/barber-pattern.png')",
      },
    },
  },
  plugins: [],
};
