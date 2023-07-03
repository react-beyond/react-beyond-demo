import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactBeyond from 'react-beyond/plugin/vite'

export default defineConfig({
  plugins: [
    react(),
    reactBeyond()
  ]
})
