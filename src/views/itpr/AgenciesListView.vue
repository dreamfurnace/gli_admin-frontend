<template>
    <!-- <div class="p-4 flex flex-col" style="height: calc(100vh - 6rem)"> -->
    <div class="p-4 flex flex-col" style="height: 100%">
        <h1 class="text-2xl font-bold mb-6">기획사 관리</h1>

        <!-- 검색/정렬/페이지크기 UI -->
        <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
                <BaseSelect v-model="searchType" class="border border-r-0 rounded-l px-3 py-1">
                    <option value="name">이름</option>
                    <!-- <option value="name_en">영문 이름</option> -->
                </BaseSelect>
                <BaseInput
                    v-model="searchInput"
                    @keyup.enter="onSearch"
                    placeholder="검색"
                    class="border rounded-r px-3 py-1 relative"
                    style="min-width: 220px"
                >
                    <template #append>
                        <button @click="onSearch">🔍</button>
                        <button @click="searchInput = ''">✕</button>
                    </template>
                </BaseInput>
            </div>

            <div class="flex items-center gap-2">
                <label>정렬:</label>
                <BaseSelect
                    v-model="store.ordering"
                    @change="onOrderingChange"
                    class="border rounded px-3 py-1"
                >
                    <option v-for="opt in orderingOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </BaseSelect>

                <BaseSelect
                    v-model="store.pageSize"
                    @change="onPageSizeChange"
                    class="border rounded px-3 py-1"
                >
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">
                        {{ size }}개
                    </option>
                </BaseSelect>
            </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="store.loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <!-- 에러 메시지 -->
        <div
            v-if="store.error"
            class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4"
        >
            <p class="font-medium">{{ store.error }}</p>
        </div>

        <!-- 기획사 목록 테이블 -->
        <div
            v-if="!store.loading && store.agencies.length"
            class="bg-slate-100 dark:bg-transparent rounded-lg shadow overflow-auto flex-grow"
        >
            <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-slate-200 dark:bg-slate-700 sticky top-0 z-10">
                    <tr>
                        <th class="p-2"><input type="checkbox" /></th>
                        <th class="p-2">기획사 ID</th>
                        <th class="p-2">기획사 명</th>
                        <th class="p-2">기획사 명 (EN)</th>
                        <th class="p-2">앨범 목록</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                    <tr
                        v-for="agency in store.agencies"
                        :key="agency.id"
                        class="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                    >
                        <td class="p-2 text-center"><input type="checkbox" /></td>
                        <td class="p-2 text-center">{{ agency.id }}</td>
                        <td class="p-2" @click="openEditModal(agency)">{{ agency.name }}</td>
                        <td class="p-2" @click="openEditModal(agency)">{{ agency.name_en }}</td>
                        <td class="p-2 text-right">
                            <ul class="space-y-2">
                                <li
                                    v-for="(album, idx) in agency.albums"
                                    :key="album.id"
                                    class="flex items-center justify-between gap-2"
                                >
                                    <span>
                                        <span class="text-xs text-gray-400 mr-1"
                                            >{{ idx + 1 }}.</span
                                        >
                                        {{ album.name }}
                                    </span>
                                    <span
                                        :class="[
                                            statusColor(album.status),
                                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white ml-2',
                                        ]"
                                    >
                                        {{ statusText(album.status) }}
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 삭제 합치기 버튼 (하단) -->
        <div class="flex justify-end mt-4">
            <button
                class="font-bold bg-emerald-700 text-white px-4 py-1 rounded mr-2"
                @click="openNotSupportedModal"
            >
                🗑️ 선택 삭제
            </button>
            <button
                class="font-bold bg-emerald-700 text-white px-4 py-1 rounded"
                @click="openNotSupportedModal"
            >
                🤝 기획사 합치기
            </button>
        </div>

        <BasePagination
            :current-page="store.page"
            :total-pages="totalPages"
            @page-change="onPageChange"
        />
    </div>

    <!-- 모달 -->
    <BaseModal
        v-if="showNotSupportModal"
        :title="modalTitle"
        :message="modalMessage"
        :buttons="modalButtons"
    />

    <!-- 기획사 수정 모달 -->
    <div
        v-if="isEditModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
        <div
            class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-slate-50 dark:bg-slate-900"
        >
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-medium">기획사 수정</h2>
                <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500 text-2xl">
                    &times;
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1"
                        >기획사명</label
                    >
                    <input
                        v-model="editAgency.name"
                        type="text"
                        class="block w-full border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md px-3 py-2 text-base bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label class="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1"
                        >영문 기획사명</label
                    >
                    <input
                        v-model="editAgency.name_en"
                        type="text"
                        class="block w-full border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md px-3 py-2 text-base bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                    <button
                        @click="closeEditModal"
                        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        취소
                    </button>
                    <button
                        @click="updateAgency"
                        class="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white font-bold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAgencyStore } from '@/stores/e_itpr/agency';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseModal from '@/components/BaseModal.vue';
const store = useAgencyStore();

const showNotSupportModal = ref(false);

const modalTitle = ref('');
const modalMessage = ref('');
const modalButtons = ref<{ text: string; onClick: () => void; type?: 'primary' | 'default' }[]>([]);

function openNotSupportedModal() {
    modalTitle.value = '지원하지 않는 기능';
    modalMessage.value = '현재 제공하지 않는 기능입니다. 관리자에게 문의해주세요.';
    modalButtons.value = [
        {
            text: '확인',
            type: 'primary',
            onClick: () => {
                showNotSupportModal.value = false;
            },
        },
    ];
    showNotSupportModal.value = true;
}

const searchInput = ref('');
const searchType = ref('name');
const orderingOptions = [
    { value: '-id', label: 'ID 내림차순' },
    { value: 'name', label: '이름 오름차순' },
    { value: '-name', label: '이름 내림차순' },
    { value: '-created_at', label: '등록일 최신순' },
    { value: 'created_at', label: '등록일 오래된순' },
];
const pageSizeOptions = [20, 50, 100];

onMounted(async () => {
    await store.fetchAgencies();
});

const onSearch = () => {
    store.setSearch(searchInput.value.trim());
};
const onOrderingChange = (e: Event) => {
    store.setOrdering((e.target as HTMLSelectElement).value);
};
const onPageSizeChange = (e: Event) => {
    store.setPageSize(Number((e.target as HTMLSelectElement).value));
};
const onPageChange = (page: number) => {
    store.setPage(page);
};

const totalPages = computed(() => Math.ceil(store.totalCount / store.pageSize));

const statusText = (status: string) => {
    switch (status) {
        case 'Ok':
            return '유통중';
        case 'Temp':
            return '임시저장/작성중';
        case 'OkWait':
            return '발매 대기중';
        case 'RevisionWait':
            return '수정 반영 대기중';
        case 'RevisionSubmit':
            return '수정 제출됨';
        case 'Submit':
            return '제출됨';
        case 'WaitDistConfirm':
            return '배급 승인 대기';
        default:
            return status;
    }
};

const statusColor = (status: string) => {
    switch (status) {
        case 'Temp':
            return 'bg-gray-700'; // 임시 저장 (회색)
        case 'OkWait':
            return 'bg-yellow-700'; // 승인 대기 (노랑)
        case 'RevisionSubmit':
            return 'bg-purple-700'; // 수정 제출됨 (보라)
        case 'Ok':
            return 'bg-green-500'; // 승인 완료 (초록)
        case 'Submit':
            return 'bg-blue-400'; // 제출됨 (파랑)
        case 'WaitDistConfirm':
            return 'bg-orange-700'; // 배급 승인 대기 (주황)
        case 'RevisionWait':
            return 'bg-red-700'; // 수정 대기 (빨강)
        default:
            return 'bg-gray-200'; // 기본색
    }
};

const isEditModalOpen = ref(false);
const editAgency = ref({ id: 0, name: '', name_en: '' });

const openEditModal = (agency: { id: number; name: string; name_en: string }) => {
    editAgency.value = { ...agency };
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
};

const updateAgency = async () => {
    await store.updateAgency(editAgency.value.id, {
        name: editAgency.value.name,
        name_en: editAgency.value.name_en,
    });
    await store.fetchAgencies(); // 수정 후 목록 갱신
    closeEditModal();
};
</script>
