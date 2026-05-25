import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#861F41",
          hover:   "#6E1834",
          light:   "#F4E8EC",
        },
        burnt: {
          DEFAULT: "#E5751F",
          light:   "#FCF0E5",
        },
        stone: {
          50:  "#FAFAF7",
          100: "#F5F4F0",
          200: "#E8E6E1",
          600: "#6B6B6B",
          900: "#1A1A1A",
        },
        success: { DEFAULT: "#1F7A3A" },
        error:   { DEFAULT: "#B83232" },
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans:  ["var(--font-sans)"],
        mono:  ["var(--font-mono)"],
      },
    },
  },
} satisfies Config;
