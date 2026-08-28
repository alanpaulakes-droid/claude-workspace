import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base relativa para que funcione tanto en la raíz como en subcarpetas
// (por ejemplo GitHub Pages en /repo/portal-estudio/dist/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
