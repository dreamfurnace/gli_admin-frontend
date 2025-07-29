// src/stores/settlement.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/axios';
import { isAxiosError } from 'axios';

// 타입 정의
interface FilesUploaded {
    domestic_uploaded: boolean;
    overseas_uploaded: boolean;
}

interface SettlementProgress {
    adjustment: string;
    balance: string;
    confirm: string;
}

interface MonthData {
    yearMonth: string;
    month_settle_id: number;
    status: 'NotStarted' | 'Adjustment' | 'Balance' | 'Confirm' | 'Completed';
    progress: SettlementProgress;
    files_uploaded: FilesUploaded;
}

export const useSettlementStore = defineStore('settlement', () => {
    const monthlyData = ref<MonthData[]>([]);
    const selectedMonth = ref<string | null>(null);
    const selectedMonthId = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 정렬된 데이터를 제공하는 getter
    const sortedMonthlyData = computed(() => {
        return [...monthlyData.value].sort((a, b) => {
            const [yearA, monthA] = a.yearMonth.split('.');
            const [yearB, monthB] = b.yearMonth.split('.');
            const dateA = new Date(parseInt(`20${yearA}`), parseInt(monthA) - 1);
            const dateB = new Date(parseInt(`20${yearB}`), parseInt(monthB) - 1);
            return dateA.getTime() - dateB.getTime(); // 과거순 정렬
        });
    });

    const fetchMonthlyData = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/settlement/monthly-range/');
            monthlyData.value = response.data.map((item: MonthData) => ({
                yearMonth: item.yearMonth,
                month_settle_id: item.month_settle_id,
                status: item.status,
                progress: item.progress,
                files_uploaded: item.files_uploaded || {
                    domestic_uploaded: false,
                    overseas_uploaded: false,
                },
            }));
        } catch (err) {
            if (isAxiosError(err)) {
                error.value =
                    err.response?.status === 403
                        ? '접근 권한이 없습니다.'
                        : '정산 기간 데이터를 불러오는데 실패했습니다.';
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.';
            }
            console.error('Error fetching monthly data:', err);
        } finally {
            loading.value = false;
        }
    };

    const updateMonthStatus = async (yearMonth: string, status: MonthData['status']) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put(`/settlement/monthly-range/${yearMonth}/`, {
                status,
            });
            // 성공 시 목록 새로고침
            await fetchMonthlyData();
            return response.data;
        } catch (err) {
            if (isAxiosError(err)) {
                console.error('Update Month Status Error Details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    headers: err.response?.headers,
                    config: err.config,
                    message: err.message,
                });
                error.value = '정산 상태 업데이트에 실패했습니다.';
            } else {
                error.value = '알 수 없는 오류가 발생했습니다.';
            }
            console.error('Error updating month status:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const setSelectedMonth = (yearMonth: string | null) => {
        selectedMonth.value = yearMonth;
        selectedMonthId.value =
            monthlyData.value.find((item) => item.yearMonth === yearMonth)?.month_settle_id || null;
        return selectedMonthId.value;
    };

    return {
        monthlyData,
        sortedMonthlyData,
        selectedMonth,
        selectedMonthId,
        loading,
        error,
        fetchMonthlyData,
        updateMonthStatus,
        setSelectedMonth,
    };
});
