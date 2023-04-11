import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "toshi-red": "#a91101",
        "web-white": "#e3e6e6",
      },
    },
  },
  plugins: [],
} satisfies Config;
