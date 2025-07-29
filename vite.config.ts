import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [vue(), vueDevTools()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        define: {
            __API_BASE__: JSON.stringify(env.VITE_API_BASE), // ✨ define에 삽입
        },
        server: {
            host: '0.0.0.0', // 👈 외부 접속 허용
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:8000', // 👈 Django dev 서버 주소
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },
    };
});
