<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">회원 정보 관리</h1>

        <MemberHeaderSummary v-if="store.summary" :summary="store.summary" />

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
        <div class="flex flex-wrap justify-between gap-4 mb-2">
            <div class="flex items-center gap-2">
                <BaseSelect v-model="searchType">
                    <option value="all">통합검색</option>
                    <option value="name">이름</option>
                    <option value="email">이메일</option>
                    <option value="phone">전화번호</option>
                    <option value="artist_name">활동명</option>
                </BaseSelect>
                <BaseInput v-model="searchQuery" type="text" placeholder="검색어 입력" />

                <button
                    @click="search"
                    class="bg-emerald-700 text-white px-4 py-1 whitespace-nowrap rounded"
                >
                    검색
                </button>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">정렬 기준:</label>
                <BaseSelect v-model="sortBy" @change="refresh">
                    <option value="name_asc">이름 오름차순</option>
                    <option value="name_desc">이름 내림차순</option>
                    <option value="created_asc">등록일 오름차순</option>
                    <option value="created_desc">등록일 내림차순</option>
                </BaseSelect>

                <label class="whitespace-nowrap">한 페이지 보기:</label>
                <BaseSelect v-model="store.pageSize" @change="refresh">
                    <option value="10">10개</option>
                    <option value="20">20개</option>
                    <option value="50">50개</option>
                </BaseSelect>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
                <span>추가 노출필드:</span>
                <label><input type="checkbox" v-model="showFields.personal_no" /> 주민번호</label>
                <label><input type="checkbox" v-model="showFields.bank_no" /> 계좌</label>
                <label><input type="checkbox" v-model="showFields.corp_ceo" /> 대표자</label>
                <label><input type="checkbox" v-model="showFields.biz_no" /> 사업자번호</label>
                <label><input type="checkbox" v-model="showFields.corp_no" /> 법인번호</label>
            </div>
        </div>

        <!-- 회원 목록 테이블 -->
        <div
            v-if="!store.error && !store.loading"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-auto"
        >
            <table class="min-w-full divide-y text-sm divide-gray-200">
                <thead class="bg-slate-200 dark:bg-slate-700">
                    <tr>
                        <th class="table-cell-tight"><input type="checkbox" /></th>
                        <th class="table-cell-tight">ID</th>
                        <th class="table-cell-tight">이미지</th>
                        <th class="table-cell-tight">파트너코드</th>
                        <th class="table-cell-tight">상태</th>
                        <th class="table-cell-tight">타입</th>
                        <th class="table-cell-tight">이름</th>
                        <th class="table-cell-tight">이메일</th>
                        <th class="table-cell-tight">전화번호</th>
                        <th class="table-cell-tight">가입일자</th>
                        <th v-if="showFields.personal_no" class="table-cell-tight">주민번호</th>
                        <th v-if="showFields.bank_no" class="table-cell-tight">계좌</th>
                        <th v-if="showFields.corp_ceo" class="table-cell-tight">대표자</th>
                        <th v-if="showFields.biz_no" class="table-cell-tight">사업자번호</th>
                        <th v-if="showFields.corp_no" class="table-cell-tight">법인번호</th>
                        <th class="table-cell-tight">메일 전송</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                    <tr
                        v-for="user in store.users"
                        :key="user.id"
                        @click="goToDetail(user.id)"
                        class="hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
                    >
                        <td class="table-cell-tight text-center"><input type="checkbox" /></td>
                        <td class="table-cell-tight text-center">{{ user.id }}</td>
                        <td class="table-cell-tight">
                            <img
                                :src="user.image_url"
                                class="h-10 w-10 rounded-full object-cover"
                                v-if="user.image_url"
                            />
                        </td>
                        <td class="table-cell-tight text-center">{{ user.partner_code }}</td>
                        <td class="table-cell-tight text-center">{{ user.status }}</td>
                        <td class="table-cell-tight text-center">{{ user.user_type }}</td>
                        <td class="table-cell-tight text-center">{{ user.name }}</td>
                        <td class="table-cell-tight">{{ user.email }}</td>
                        <td class="table-cell-tight text-center">{{ user.phone }}</td>
                        <td class="table-cell-tight text-center">
                            {{ formatDate(user.created_at) }}
                        </td>
                        <td v-if="showFields.personal_no" class="table-cell-tight text-center">
                            {{ user.personal_no }}
                        </td>
                        <td v-if="showFields.bank_no" class="table-cell-tight">
                            {{ user.bank_no }}
                        </td>
                        <td v-if="showFields.corp_ceo" class="table-cell-tight text-center">
                            {{ user.corp_ceo }}
                        </td>
                        <td v-if="showFields.biz_no" class="table-cell-tight text-center">
                            {{ user.biz_no }}
                        </td>
                        <td v-if="showFields.corp_no" class="table-cell-tight text-center">
                            {{ user.corp_no }}
                        </td>
                        <td class="table-cell-tight text-center">
                            <button class="text-emerald-600 hover:text-emerald-900">
                                메일 전송
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 메일 발송 버튼 (하단) -->
        <div class="mt-2">
            <button class="bg-emerald-700 text-white px-4 py-1 rounded mr-2">
                선택 회원 메일 보내기
            </button>
            <button class="bg-emerald-700 text-white px-4 py-1 rounded">전체 메일 보내기</button>
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
import { useMemberStore } from '@/stores/d_member/member';
import { formatDate } from '@/utils/format';

import MemberHeaderSummary from './MemberHeaderSummary.vue';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';

const store = useMemberStore();

const showFields = ref({
    personal_no: false,
    bank_no: false,
    corp_ceo: false,
    biz_no: false,
    corp_no: false,
});

const searchType = ref('all');
const searchQuery = ref('');
const sortBy = ref('created_desc');

onMounted(() => {
    store.fetchUsers();
    store.fetchSummary();
});

const onPageChange = (page: number) => {
    store.setPage(page);
};

const search = () => {
    store.setSearch(searchQuery.value, searchType.value);
};

const refresh = () => {
    store.setSortAndPage(sortBy.value, store.pageSize);
};

const goToDetail = (id: number) => {
    window.open(`https://blnchk.com/users/${id}`, '_blank');
};

const totalPages = computed(() => Math.ceil(store.totalCount / store.pageSize));
</script>
