import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: { port: 5180, strictPort: true, host: "127.0.0.1" },
  preview: { port: 5180, strictPort: true, host: "127.0.0.1" },
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "http://127.0.0.1:5180/" } },
  },
});
