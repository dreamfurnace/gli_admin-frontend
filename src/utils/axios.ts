// src/utils/axios.ts
import axios from 'axios';
import router from '@/router';

console.log('🚀 GLI Admin axios.ts loaded');
console.log('📦 GLI API baseURL:', import.meta.env.VITE_API_BASE);
console.log('✅ GLI Environment:', import.meta.env.MODE);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export function setupAxiosInterceptors(
    authStore: ReturnType<typeof import('@/stores/auth').useAuthStore>
) {
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;
            if (!error.response || originalRequest?._retry) return Promise.reject(error);

            if (error.response.status === 401 && originalRequest?.url !== '/api/auth/login/') {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        addRefreshSubscriber(async (token: string) => {
                            try {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                const response = await api(originalRequest);
                                resolve(response);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    });
                }

                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('리프레시 토큰 없음');

                    const response = await api.post('/api/auth/refresh/', {
                        refresh: refreshToken,
                    });

                    const newToken = response.data.access;
                    localStorage.setItem('token', newToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    onRefreshed(newToken);
                    return api(originalRequest);
                } catch (err) {
                    await authStore.logout();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
}

export default api;
