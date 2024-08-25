import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 4000
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './app.ts',
      exportName: 'viteNodeApp',
      initAppOnBoot: false,
      tsCompiler: 'esbuild',
      swcOptions: {}
    })
  ],
  optimizeDeps: {
  },
});