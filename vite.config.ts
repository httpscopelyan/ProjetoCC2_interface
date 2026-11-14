import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const API_TARGET = 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': API_TARGET } },
  preview: { proxy: { '/api': API_TARGET } },
})
