import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        mainFields: [],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://192.168.137.1:8000',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    base: './',
})
