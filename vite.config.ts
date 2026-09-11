import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/smart-agro-market/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
