import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chess-repertoire/",
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            "@react-oauth/google",
            "@tanstack/react-query",
            "react",
            "react-dom",
            "react-icons",
            "react-minimal-pie-chart",
            "slate-react",
            "react-toastify",
          ],
          libs: [
            "axios",
            "chess.js",
            "chessops",
            "chessground",
            "classnames",
            "idb-keyval",
            "local-storage-superjson",
            "lodash",
            "slate",
            "slate-history",
            "superjson",
            "zustand",
          ],
        },
      },
    },
  },
});
