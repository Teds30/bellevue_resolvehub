import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    resolve: {
        mainFields: [],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://202.124.157.19:8000',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    base: './',
})
