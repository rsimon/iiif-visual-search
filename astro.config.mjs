import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import react from '@astrojs/react';

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/onnxruntime-web/dist/*.wasm',
            dest: 'node_modules/.vite/deps'
          }
        ]
      })
    ],
    optimizeDeps: {
      exclude: ['browser-visual-search', 'onnxruntime-web']
    }
  },
  integrations: [react()]
});