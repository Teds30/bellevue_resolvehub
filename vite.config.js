import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { createProxyMiddleware } from 'http-proxy-middleware'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    resolve: {
        mainFields: [],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://10.5.5.19:8000',
                changeOrigin: true,
            },
        },
        // middleware: createProxyMiddleware('/api', {
        //     target: 'http://10.5.5.19:8000',
        //     changeOrigin: true,
        //     pathRewrite: {
        //         '^/api': '',
        //     },
        // }),
    },
})
