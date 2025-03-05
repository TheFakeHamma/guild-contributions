import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist", // ✅ Ensure this is the correct directory
    emptyOutDir: true, // ✅ Clean old builds before building
  },
});
