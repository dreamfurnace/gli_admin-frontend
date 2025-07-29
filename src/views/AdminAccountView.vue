<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">관리자 계정 관리</h1>

        <!-- 에러 메시지 -->
        <div
            v-if="store.error"
            class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded"
        >
            <p class="font-medium">{{ store.error }}</p>
            <p v-if="store.error === '접근 권한이 없습니다.'" class="text-sm mt-1">
                이 메뉴는 슈퍼 관리자만 접근할 수 있습니다.
            </p>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="store.loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <!-- 관리자 목록 테이블 -->
        <div
            v-if="!store.error && !store.loading"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-hidden"
        >
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-slate-200 dark:bg-slate-700">
                    <tr>
                        <th class="px-6 py-3 text-center font-bold uppercase tracking-wider">
                            사용자명
                        </th>
                        <th class="px-6 py-3 text-center font-bold uppercase tracking-wider">
                            이메일
                        </th>
                        <th class="px-6 py-3 text-center font-bold uppercase tracking-wider">
                            등급
                        </th>
                        <th class="px-6 py-3 text-center font-bold uppercase tracking-wider">
                            상태
                        </th>
                        <th class="px-6 py-3 text-center font-bold uppercase tracking-wider">
                            작업
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-slate-100 dark:bg-slate-800 divide-y divide-gray-200">
                    <tr
                        v-for="admin in sortedAdminUsers"
                        :key="admin.id"
                        class="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                    >
                        <td class="px-6 py-4 text-center whitespace-nowrap">
                            {{ admin.username }}
                        </td>
                        <td class="px-6 py-4 text-center whitespace-nowrap">{{ admin.email }}</td>
                        <td class="px-6 py-4 text-center whitespace-nowrap">
                            <span
                                class="px-2 inline-flex leading-5 font-semibold rounded-full"
                                :class="
                                    admin.grade.name === '슈퍼 관리자'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                "
                            >
                                {{ admin.grade.name }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center whitespace-nowrap">
                            <span
                                class="px-2 inline-flex leading-5 font-semibold rounded-full"
                                :class="
                                    admin.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                "
                            >
                                {{ admin.is_active ? '활성' : '비활성' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center whitespace-nowrap font-bold">
                            <button
                                @click="openDetailModal(admin)"
                                class="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                                상세보기
                            </button>
                            <button
                                @click="toggleAdminStatus(admin)"
                                :class="
                                    admin.is_active
                                        ? 'text-red-600 hover:text-red-900'
                                        : 'text-green-600 hover:text-green-900'
                                "
                            >
                                {{ admin.is_active ? '비활성화' : '활성화' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 상세 정보 모달 -->
        <div
            v-if="showDetailModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        >
            <div
                class="relative top-20 mx-auto p-5 border border-gray-500 dark:border-slate-700 w-full max-w-2xl shadow-lg rounded-md bg-slate-50 dark:bg-slate-900"
            >
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold">관리자 상세 정보</h3>
                    <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-500">
                        <span class="text-2xl">&times;</span>
                    </button>
                </div>
                <div v-if="store.selectedAdmin" class="mt-2">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2 sm:col-span-1">
                            <label
                                class="block text-base font-bold text-slate-700 dark:text-slate-300"
                                >아이디</label
                            >
                            <p
                                class="mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500"
                            >
                                {{ store.selectedAdmin.username }}
                            </p>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <label
                                class="block text-base font-bold text-slate-700 dark:text-slate-300"
                                >이메일</label
                            >
                            <p
                                class="mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500"
                            >
                                {{ store.selectedAdmin.email }}
                            </p>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <label
                                class="block text-base font-bold text-slate-700 dark:text-slate-300"
                                >이름</label
                            >
                            <p
                                class="mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500"
                            >
                                {{ store.selectedAdmin.last_name }}
                                {{ store.selectedAdmin.first_name }}
                            </p>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <label
                                class="block text-base font-bold text-slate-700 dark:text-slate-300"
                                >등급</label
                            >
                            <select
                                v-model="selectedGrade"
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-slate-200 dark:bg-slate-700"
                            >
                                <option v-for="grade in grades" :key="grade.id" :value="grade.id">
                                    {{ grade.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label
                                class="block text-base font-bold text-slate-700 dark:text-slate-300"
                                >마지막 로그인 IP</label
                            >
                            <p
                                class="mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500"
                            >
                                {{ store.selectedAdmin.last_login_ip || '없음' }}
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end space-x-3">
                        <button
                            @click="closeDetailModal"
                            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            취소
                        </button>
                        <button
                            @click="saveChanges"
                            class="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            변경사항 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAdminManagementStore } from '@/stores/adminManagement';
import type { AdminUser } from '@/types/auth';

const store = useAdminManagementStore();
const showDetailModal = ref(false);
const selectedGrade = ref<number | null>(null);

// 임시 데이터 - 실제로는 API에서 가져와야 함
interface Grade {
    id: number;
    name: string;
}

const grades = ref<Grade[]>([
    { id: 1, name: '슈퍼 관리자' },
    { id: 2, name: '일반 관리자' },
]);

onMounted(async () => {
    await store.fetchAdminUsers();
});

const sortedAdminUsers = computed(() => {
    return [...store.adminUsers].sort((a, b) => a.username.localeCompare(b.username));
});

const openDetailModal = async (admin: AdminUser) => {
    await store.fetchAdminDetail(admin.id);
    if (store.selectedAdmin) {
        selectedGrade.value = store.selectedAdmin.grade.id;
    }
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    store.selectedAdmin = null;
    selectedGrade.value = null;
};

const toggleAdminStatus = async (admin: AdminUser) => {
    try {
        await store.updateAdminUser(admin.id, {
            grade_id: admin.grade.id,
            is_active: !admin.is_active,
        });
    } catch (error) {
        console.error('Failed to toggle admin status:', error);
    }
};

const saveChanges = async () => {
    if (!store.selectedAdmin || !selectedGrade.value) return;

    // 변경사항이 있는지 체크
    const hasChanges =
        selectedGrade.value !== store.selectedAdmin.grade.id ||
        store.selectedAdmin.is_active !== store.selectedAdmin.is_active;

    // 변경사항이 없으면 그냥 모달만 닫기
    if (!hasChanges) {
        closeDetailModal();
        return;
    }

    try {
        await store.updateAdminUser(store.selectedAdmin.id, {
            grade_id: selectedGrade.value,
            is_active: store.selectedAdmin.is_active,
        });
        closeDetailModal();
    } catch (error) {
        console.error('Failed to save changes:', error);
    }
};
</script>
