import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // ISSO GARANTE QUE SEMPRE ABRA NA 5175
    strictPort: true,
  }
})