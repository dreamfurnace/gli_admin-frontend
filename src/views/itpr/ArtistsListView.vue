<template>
    <div class="p-4 flex flex-col" style="height: calc(100vh - 6rem)">
        <h1 class="text-2xl font-bold mb-6">아티스트 관리</h1>

        <!-- 검색/정렬/페이지크기 UI -->
        <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
                <BaseInput
                    v-model="searchInput"
                    @keyup.enter="onSearch"
                    placeholder="아티스트 이름 검색"
                    class="border rounded px-3 py-1 relative"
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

        <!-- 아티스트 목록 테이블 -->
        <div
            v-if="!store.loading && store.artists.length"
            class="bg-slate-100 dark:bg-transparent rounded-lg shadow overflow-auto flex-grow"
        >
            <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-slate-200 dark:bg-slate-700 sticky top-0 z-10">
                    <tr>
                        <th class="p-2"><input type="checkbox" /></th>
                        <th class="p-2">아티스트 ID</th>
                        <th class="p-2">아티스트 이름</th>
                        <th class="p-2">아티스트 영문 이름</th>
                        <th class="p-2">앨범</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                    <tr
                        v-for="artist in store.artists"
                        :key="artist.id"
                        class="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                    >
                        <td class="p-2 text-center"><input type="checkbox" /></td>
                        <td class="p-2 text-center" @click="openEditModal(artist)">
                            {{ artist.id }}
                        </td>
                        <td class="p-2" @click="openEditModal(artist)">{{ artist.name }}</td>
                        <td class="p-2" @click="openEditModal(artist)">{{ artist.name_en }}</td>
                        <td class="p-2 text-right">
                            <ul class="space-y-2">
                                <li
                                    v-for="(album, idx) in artist.albums"
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
                                            'inline-flex items-center px-2 py-0.5 rounded-full text-sm font-bold text-white ml-2',
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
        <div class="flex justify-end mt-2">
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
                🤝 아티스트 합치기
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

    <!-- 아티스트 수정 모달 -->
    <div
        v-if="isEditModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
        <div
            class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-slate-50 dark:bg-slate-900"
        >
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-medium">아티스트 수정</h2>
                <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500 text-2xl">
                    &times;
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1"
                        >아티스트명</label
                    >
                    <input
                        v-model="editArtist.name"
                        type="text"
                        class="block w-full border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md px-3 py-2 text-base bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label class="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1"
                        >영문 아티스트명</label
                    >
                    <input
                        v-model="editArtist.name_en"
                        type="text"
                        class="block w-full border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md px-3 py-2 text-base bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                    <button
                        @click="closeEditModal"
                        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        취소
                    </button>
                    <button
                        @click="updateArtist"
                        class="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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
import { useArtistStore } from '@/stores/e_itpr/artist';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseModal from '@/components/BaseModal.vue';

const store = useArtistStore();

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

const isEditModalOpen = ref(false);
const editArtist = ref({ id: 0, name: '', name_en: '' });

const openEditModal = (artist: { id: number; name: string; name_en: string }) => {
    editArtist.value = { ...artist };
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
};

const updateArtist = async () => {
    await store.updateArtist(editArtist.value.id, {
        name: editArtist.value.name,
        name_en: editArtist.value.name_en,
    });
    await store.fetchArtists(); // 수정 후 목록 갱신
    closeEditModal();
};

const searchInput = ref('');
const orderingOptions = [
    { value: '-id', label: 'ID 내림차순' },
    { value: 'name', label: '이름 오름차순' },
    { value: '-name', label: '이름 내림차순' },
    { value: '-created_at', label: '등록일 최신순' },
    { value: 'created_at', label: '등록일 오래된순' },
];
const pageSizeOptions = [20, 50, 100];

onMounted(async () => {
    await store.fetchArtists();
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
            return 'bg-gray-700';
        case 'OkWait':
            return 'bg-yellow-700';
        case 'RevisionSubmit':
            return 'bg-purple-700';
        case 'Ok':
            return 'bg-green-500';
        case 'Submit':
            return 'bg-blue-400';
        case 'WaitDistConfirm':
            return 'bg-orange-700';
        case 'RevisionWait':
            return 'bg-red-700';
        default:
            return 'bg-gray-200';
    }
};
</script>
