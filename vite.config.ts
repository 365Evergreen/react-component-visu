import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path';

const projectRoot = __dirname;

// https://vite.dev/config/
export default defineConfig({
  base: '/react-component-visu/',
  plugins: [
    react(),
    // NOTE: Originally this project used a phospor icon proxy plugin which attempted to provide
    // imports for Phosphor icons. We are standardizing on Fluent UI icons and not using the proxy.
    // The plugin was removed to avoid noisy fallback warnings from the proxy.
    // createIconImportProxy({ fallback: false }) as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
