import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // استخدم اسم الريبو كـ base path لـ GitHub Pages
  base: process.env.GITHUB_ACTIONS ? "/my-wallet/" : "/",
  plugins: [react()]
});
