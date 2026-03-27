import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // THIS COPIES THE WORKER SO GITHUB PAGES CAN FIND IT LOCALLY
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
          dest: './'
        }
      ]
    })
  ],
  base: '/Bm-Advertisers/', 
})