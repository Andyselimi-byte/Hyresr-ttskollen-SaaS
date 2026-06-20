import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1a56a0",
          "blue-dark": "#0c447c",
          "blue-light": "#e6f1fb",
        },
        success: {
          bg: "#eaf3de",
          border: "#97c459",
          text: "#27500a",
        },
        warn: {
          bg: "#faeeda",
          border: "#ef9f27",
          text: "#633806",
        },
        danger: {
          bg: "#fcebeb",
          border: "#f09595",
          text: "#791f1f",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
