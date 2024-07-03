import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chess-repertoire/",
  plugins: [react()],
  server: {
    host: true,
    cors: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "^/upload.*": {
        target: "https://www.googleapis.com/upload",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
