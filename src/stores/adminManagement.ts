// src/stores/adminManagement.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';
import { isAxiosError } from 'axios';
import type { AdminUser, AdminUpdateData } from '@/types/auth';

export const useAdminManagementStore = defineStore('adminManagement', () => {
    const adminUsers = ref<AdminUser[]>([]);
    const selectedAdmin = ref<AdminUser | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAdminUsers = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/auth/admins/');
            adminUsers.value = response.data;
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.status === 403) {
                    error.value = '접근 권한이 없습니다.';
                } else {
                    error.value = '관리자 목록을 불러오는데 실패했습니다.';
                }
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.';
            }
            console.error('Error fetching admin users:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchAdminDetail = async (adminId: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/auth/admins/${adminId}/`);
            selectedAdmin.value = response.data;
        } catch (err) {
            if (isAxiosError(err)) {
                error.value = '관리자 정보를 불러오는데 실패했습니다.';
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.';
            }
            console.error('Error fetching admin detail:', err);
        } finally {
            loading.value = false;
        }
    };

    const updateAdminUser = async (adminId: number, data: AdminUpdateData) => {
        loading.value = true;
        error.value = null;
        try {
            // 요청 데이터 로깅
            console.log('Uaaaapdate Admin Request:', {
                adminId,
                data,
            });
            console.log('📦 axios baseURL:', import.meta.env.VITE_API_BASE);
            console.log('✅ import.meta.env:', import.meta.env);

            const response = await api.put(`/auth/admins/${adminId}/`, data);
            // 성공 시 목록 새로고침
            await fetchAdminUsers();
            return response.data;
        } catch (err) {
            if (isAxiosError(err)) {
                console.error('Update Admin Error Details:', {
                    status: err.response?.status,
                    data: err.response?.data, // 백엔드에서 보낸 전체 에러 응답
                    headers: err.response?.headers,
                    config: err.config,
                    message: err.message,
                });
                error.value = '관리자 정보 수정에 실패했습니다.';
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.';
            }
            console.error('Error updating admin user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        adminUsers,
        selectedAdmin,
        loading,
        error,
        fetchAdminUsers,
        fetchAdminDetail,
        updateAdminUser,
    };
});
