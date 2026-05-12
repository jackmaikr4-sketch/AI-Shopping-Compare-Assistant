import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#172033", muted: "#687089", line: "#E6EAF2", surface: "#F7F9FC" }, boxShadow: { card: "0 12px 30px rgba(31,46,84,.09)", soft: "0 18px 55px rgba(31,46,84,.12)" } } },
  plugins: []
};

export default config;
