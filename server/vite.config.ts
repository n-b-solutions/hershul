import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    port: process.env.VITE_PORT ? +process.env.VITE_PORT : 4000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './app.ts',
      exportName: 'viteNodeApp',
      initAppOnBoot: false,
      tsCompiler: 'esbuild',
      swcOptions: {},
    }),
  ],
  optimizeDeps: {},
});
