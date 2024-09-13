// vite.config.js
import { defineConfig } from "file:///C:/Users/Adminisatire/Documents/Clone/prb_care_api/PRB-Care-Client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Adminisatire/Documents/Clone/prb_care_api/PRB-Care-Client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dotenv from "file:///C:/Users/Adminisatire/Documents/Clone/prb_care_api/PRB-Care-Client/node_modules/dotenv/lib/main.js";
import { viteStaticCopy } from "file:///C:/Users/Adminisatire/Documents/Clone/prb_care_api/PRB-Care-Client/node_modules/vite-plugin-static-copy/dist/index.js";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/prbcare.png",
          dest: "assets"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  define: {
    // Make environment variables available to the client
    "process.env": process.env
  },
  logLevel: "info"
  // or 'silent'
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pbmlzYXRpcmVcXFxcRG9jdW1lbnRzXFxcXENsb25lXFxcXHByYl9jYXJlX2FwaVxcXFxQUkItQ2FyZS1DbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluaXNhdGlyZVxcXFxEb2N1bWVudHNcXFxcQ2xvbmVcXFxccHJiX2NhcmVfYXBpXFxcXFBSQi1DYXJlLUNsaWVudFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWRtaW5pc2F0aXJlL0RvY3VtZW50cy9DbG9uZS9wcmJfY2FyZV9hcGkvUFJCLUNhcmUtQ2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSdcclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiAnc3JjL2Fzc2V0cy9wcmJjYXJlLnBuZycsXHJcbiAgICAgICAgICBkZXN0OiAnYXNzZXRzJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSlcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBcIi9zcmNcIixcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIC8vIE1ha2UgZW52aXJvbm1lbnQgdmFyaWFibGVzIGF2YWlsYWJsZSB0byB0aGUgY2xpZW50XHJcbiAgICBcInByb2Nlc3MuZW52XCI6IHByb2Nlc3MuZW52LFxyXG4gIH0sXHJcbiAgbG9nTGV2ZWw6ICdpbmZvJywgLy8gb3IgJ3NpbGVudCdcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1ksU0FBUyxvQkFBb0I7QUFDbmEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHNCQUFzQjtBQUMvQixPQUFPLE9BQU87QUFFZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLGVBQWUsUUFBUTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxVQUFVO0FBQUE7QUFDWixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
