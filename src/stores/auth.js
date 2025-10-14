// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';
import { apiService } from '@/services/api';
import { isAxiosError } from 'axios'; // 상단에 추가
export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const user = ref(null);
    const token = ref(localStorage.getItem('token'));
    const refreshToken = ref(localStorage.getItem('refreshToken'));
    const isAuthenticated = computed(() => !!token.value);
    const resetTokens = () => {
        token.value = '';
        refreshToken.value = '';
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        api.defaults.headers.common['Authorization'] = '';
    };
    const fetchUserInfo = async () => {
        if (!token.value)
            return;
        try {
            user.value = await apiService.getCurrentUser();
            console.log('Updated user in store:', user.value);
        }
        catch (error) {
            console.error('Failed to fetch user info:', error);
            // 토큰 갱신 시도
            try {
                console.log('@fetchUserInfo() - refreshAccessToken 호출');
                await refreshAccessToken();
                user.value = await apiService.getCurrentUser();
            }
            catch (refreshError) {
                console.error('Failed to refresh token and fetch user info:', refreshError);
                await logout();
                router.push('/login');
            }
        }
    };
    const refreshAccessToken = async () => {
        try {
            console.log('@refreshAccessToken() - 토큰 갱신 시도');
            const response = await api.post('/api/auth/refresh/', {
                refresh: refreshToken.value,
            });
            const newToken = response.data.access;
            localStorage.setItem('token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            token.value = newToken;
            return newToken;
        }
        catch (error) {
            console.error('Token refresh failed:', error);
            await logout();
            throw error;
        }
    };
    const initializeAuth = async () => {
        if (initializeAuth.isRetrying) {
            return;
        }
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedToken || !storedRefreshToken) {
            return;
        }
        try {
            initializeAuth.isRetrying = true;
            // 토큰 설정
            token.value = storedToken;
            refreshToken.value = storedRefreshToken;
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // 사용자 정보 조회 시도
            await fetchUserInfo();
        }
        catch (error) {
            console.error('Initial fetchUserInfo failed:', error);
            await logout();
        }
        finally {
            initializeAuth.isRetrying = false;
        }
    };
    const login = async (credentials) => {
        try {
            console.log('GLI Admin Login Request:', credentials);
            console.log('🔥 GLI Admin Environment:', import.meta.env.MODE);
            console.log('🌐 GLI API Server:', import.meta.env.VITE_API_BASE);
            resetTokens();
            // 개발 환경에서 모크 API 사용
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                console.log('🧪 Using Mock API for authentication');
                // 모크 로그인 로직
                if (credentials.username === 'admin' && credentials.password === 'admin123') {
                    const mockToken = {
                        access: 'mock-access-token-' + Date.now(),
                        refresh: 'mock-refresh-token-' + Date.now()
                    };
                    const mockUserData = {
                        id: 1,
                        username: 'admin',
                        email: 'admin@gli.io',
                        first_name: 'GLI',
                        last_name: 'Administrator',
                        grade: {
                            id: 1,
                            name: 'Super Admin'
                        }
                    };
                    token.value = mockToken.access;
                    refreshToken.value = mockToken.refresh;
                    user.value = mockUserData;
                    localStorage.setItem('token', mockToken.access);
                    localStorage.setItem('refreshToken', mockToken.refresh);
                    api.defaults.headers.common['Authorization'] = `Bearer ${mockToken.access}`;
                    console.log('✅ GLI Admin Mock Login Success');
                    return true;
                }
                else {
                    throw new Error('Invalid credentials (use admin/admin123 for mock login)');
                }
            }
            // 실제 API 호출
            const response = await api.post('/api/auth/login/', credentials);
            console.log('✅ GLI Admin Login Success:', response.data);
            const { token: newToken, user: rawUserData } = response.data;
            // API 응답을 AdminUser 타입에 맞게 변환
            const adaptedUserData = {
                id: rawUserData.id, // UUID를 그대로 사용 (타입 정의를 나중에 수정)
                username: rawUserData.username,
                email: rawUserData.email,
                first_name: rawUserData.first_name,
                last_name: rawUserData.last_name,
                is_staff: true, // 관리자이므로 true
                is_active: rawUserData.is_active || true,
                grade: {
                    id: 1,
                    name: rawUserData.membership_level === 'vip' ? 'Super Admin' : 'Admin',
                    description: null
                },
                last_login_ip: null,
                created_at: rawUserData.created_at,
                updated_at: rawUserData.updated_at
            };
            token.value = newToken.access;
            refreshToken.value = newToken.refresh;
            user.value = adaptedUserData;
            localStorage.setItem('token', newToken.access);
            localStorage.setItem('refreshToken', newToken.refresh);
            // axios 기본 헤더 설정 추가
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken.access}`;
            return true;
        }
        catch (err) {
            console.error('❌ 로그인 실패', err);
            if (isAxiosError(err)) {
                console.error('📛 로그인 실패 응답 데이터:', err.response?.data);
                throw new Error(err.response?.data?.error || '로그인에 실패했습니다.');
            }
            if (err instanceof Error) {
                throw err;
            }
            throw new Error('로그인에 실패했습니다.');
        }
    };
    const logout = async () => {
        user.value = null;
        token.value = null;
        refreshToken.value = null;
        resetTokens();
        // axios 헤더 제거 추가
        delete api.defaults.headers.common['Authorization'];
    };
    const isSuperAdmin = computed(() => {
        return user.value?.grade?.name === 'Super Admin' ||
            user.value?.grade?.name === '슈퍼 관리자' ||
            user.value?.membership_level === 'vip';
    });
    const getInitialRoute = () => {
        if (!user.value)
            return '/login';
        return '/admin'; // GLI Platform에서는 모든 관리자가 대시보드로 이동
    };
    return {
        user,
        isSuperAdmin,
        getInitialRoute,
        token,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        initializeAuth,
        fetchUserInfo,
        refreshAccessToken,
    };
});
//# sourceMappingURL=auth.js.map