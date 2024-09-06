import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { visualizer } from "rollup-plugin-visualizer";
// Load environment variables from .env
dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/prbcare.png',
          dest: 'assets'
        }
      ]
    }),
    visualizer()
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    // Make environment variables available to the client
    "process.env": process.env,
  },
});
