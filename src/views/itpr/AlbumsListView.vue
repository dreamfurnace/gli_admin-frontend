<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">앨범 관리</h1>

        <AlbumHeaderSummary v-if="store.summary" :summary="store.summary" />

        <!-- 에러 메시지 -->
        <div
            v-if="store.error"
            class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4"
        >
            <p class="font-medium">{{ store.error }}</p>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="store.loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <!-- 검색 및 보기 설정 -->
        <div class="flex flex-wrap justify-between gap-4 mb-6">
            <div class="flex items-center gap-2">
                <BaseSelect v-model="searchType">
                    <option value="all">통합검색</option>
                    <option value="name">앨범명</option>
                    <option value="artist">아티스트</option>
                    <option value="song">곡명</option>
                    <option value="isrc">ISRC</option>
                    <option value="creator">등록자</option>
                </BaseSelect>
                <BaseInput
                    v-model="searchQuery"
                    @keyup.enter="onSearch"
                    type="text"
                    placeholder="검색어 입력"
                />
                <button
                    @click="onSearch"
                    class="bg-emerald-700 font-bold text-white px-4 py-1 whitespace-nowrap rounded"
                >
                    검색
                </button>
            </div>
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">정렬 기준:</label>
                <BaseSelect v-model="sortBy" @change="refresh">
                    <option value="name_asc">이름 오름차순</option>
                    <option value="name_desc">이름 내림차순</option>
                    <option value="created_desc">등록일 내림차순</option>
                    <option value="created_asc">등록일 오름차순</option>
                    <option value="updated_desc">수정일 내림차순</option>
                    <option value="updated_asc">수정일 오름차순</option>
                </BaseSelect>
                <label class="whitespace-nowrap">한 페이지 보기:</label>
                <BaseSelect v-model="store.pageSize" @change="refresh">
                    <option value="20">20개</option>
                    <option value="50">50개</option>
                    <option value="100">100개</option>
                </BaseSelect>
            </div>
        </div>

        <!-- 앨범 목록 테이블 -->
        <div
            v-if="!store.error && !store.loading"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-auto mb-6"
        >
            <table class="min-w-full divide-y text-sm divide-gray-200">
                <thead class="bg-slate-200 dark:bg-slate-700">
                    <tr>
                        <th class="table-cell-tight">ID</th>
                        <th class="table-cell-tight">상태</th>
                        <th class="table-cell-tight">앨범명</th>
                        <th class="table-cell-tight">영문명</th>
                        <th class="table-cell-tight">발매일</th>
                        <th class="table-cell-tight">앨범타입</th>
                        <th class="table-cell-tight">등록타입</th>
                        <th class="table-cell-tight">등록자</th>
                        <th class="table-cell-tight">등록일</th>
                        <th class="table-cell-tight">수정일</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                    <tr
                        v-for="album in store.albums"
                        :key="album.id"
                        @click="goToAlbum(album.id)"
                        class="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                    >
                        <td class="table-cell-tight text-center">{{ album.id }}</td>
                        <td class="table-cell-tight text-center">{{ statusText(album.status) }}</td>
                        <td class="table-cell-tight">{{ album.name }}</td>
                        <td class="table-cell-tight">{{ album.name_en }}</td>
                        <td class="table-cell-tight text-center">{{ album.release_date }}</td>
                        <td class="table-cell-tight text-center">{{ album.album_type }}</td>
                        <td class="table-cell-tight text-center">{{ album.register_type }}</td>
                        <td class="table-cell-tight text-center">
                            {{ album.creator_name || album.created_by }}
                        </td>
                        <td class="table-cell-tight text-center">
                            {{ formatDate(album.created_at) }}
                        </td>
                        <td class="table-cell-tight text-center">
                            {{ formatDate(album.updated_at) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <BasePagination
            :current-page="store.page"
            :total-pages="totalPages"
            @page-change="onPageChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAlbumsStore } from '@/stores/e_itpr/albums';
import { formatDate } from '@/utils/format';

import AlbumHeaderSummary from './AlbumHeaderSummary.vue';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';

const store = useAlbumsStore();

const searchType = ref('all');
const searchQuery = ref('');
const sortBy = ref('created_desc');

onMounted(() => {
    store.fetchAlbums();
    store.fetchSummary();
});

const onPageChange = (page: number) => {
    store.setPage(page);
};
const totalPages = computed(() => Math.ceil(store.totalCount / store.pageSize));

const onSearch = () => {
    store.setSearch(searchQuery.value, searchType.value);
};

const refresh = () => {
    // 정렬 기준 변환
    switch (sortBy.value) {
        case 'name_asc':
            store.setOrdering('name');
            break;
        case 'name_desc':
            store.setOrdering('-name');
            break;
        case 'created_asc':
            store.setOrdering('created_at');
            break;
        case 'created_desc':
            store.setOrdering('-created_at');
            break;
        case 'updated_asc':
            store.setOrdering('updated_at');
            break;
        case 'updated_desc':
            store.setOrdering('-updated_at');
            break;
        default:
            store.setOrdering('-created_at');
    }
};

const goToPage = (page: number) => {
    store.setPage(page);
};

const goToAlbum = (id: number) => {
    window.open(`https://blnchk.com/albums/${id}`, '_blank');
};

const statusText = (status: string) => {
    switch (status) {
        case 'Temp':
            return '임시저장';
        case 'Submit':
            return '권리자 확인중';
        case 'WaitDistConfirm':
            return '발매일 확인중';
        case 'OkWait':
            return '발매 대기중';
        case 'Ok':
            return '유통중';
        case 'ServiceExpired':
            return '자동 연장 불가';
        case 'RevisionWait':
            return '수정 반영 대기중';
        case 'RevisionSubmit':
            return '권리자 수정 확인중';
        default:
            return status;
    }
};

const paginationArray = computed(() => {
    const total = store.totalPages;
    const current = store.currentPage;
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        range.push(i);
    }
    if (typeof range[0] === 'number' && range[0] > 1) {
        if (typeof range[0] === 'number' && range[0] > 2) range.unshift('...');
        range.unshift(1);
    }
    const last = range[range.length - 1];
    if (typeof last === 'number' && last < total) {
        if (last < total - 1) range.push('...');
        range.push(total);
    }
    return range;
});
</script>
