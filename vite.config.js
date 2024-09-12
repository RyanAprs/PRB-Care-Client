import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { viteStaticCopy } from 'vite-plugin-static-copy'
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
    })
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
  logLevel: 'info', // or 'silent'
});
