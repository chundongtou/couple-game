import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      name: "CoupleFlightBoard",
      formats: ["iife"],
      fileName: () => "board.js"
    },
    outDir: "../../assets",
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: { extend: true }
    }
  }
});
