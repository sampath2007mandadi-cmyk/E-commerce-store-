/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0", 100: "#faefd8", 200: "#f4d9a0",
          300: "#ecbd5e", 400: "#e5a030", 500: "#d4831a",
          600: "#b86414", 700: "#8f4812", 800: "#6d3414",
          900: "#572b13",
        },
        dark: {
          50: "#f4f4f5", 100: "#e4e4e7", 200: "#a1a1aa",
          300: "#71717a", 400: "#52525b", 500: "#3f3f46",
          600: "#27272a", 700: "#18181b", 800: "#0f0f10",
          900: "#09090b",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideIn: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
