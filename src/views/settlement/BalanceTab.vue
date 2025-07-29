<!-- /admin-frontend/src/views/settlement/BalanceTab.vue -->
<template>
    <div class="p-4 space-y-4 h-full flex flex-col">
        <!-- 정렬 및 페이지 크기 설정 -->
        <div class="flex justify-between items-center h-auto">
            <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold">{{ props.selectedMonth }} 정산 내역</h1>
                <div class="flex items-center gap-2">
                    <button
                        class="text-sm text-blue-600 hover:underline"
                        @click="refreshBalanceList"
                    >
                        🔄 새로고침
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <!-- 정렬 & 페이지 크기 설정 위쪽 -->

                <label>정렬:</label>
                <BaseSelect v-model="sortBy" class="border rounded px-3 py-1 w-44">
                    <option value="nameAsc">이름 오름차순</option>
                    <option value="nameDesc">이름 내림차순</option>
                    <option value="balanceAsc">정산금 오름차순</option>
                    <option value="balanceDesc">정산금 내림차순</option>
                </BaseSelect>
                <label>한 페이지 보기:</label>
                <BaseSelect v-model="pageSize" class="border rounded px-3 py-1 w-24">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">
                        {{ size }}개
                    </option>
                </BaseSelect>
            </div>
        </div>

        <!-- 정산 목록 테이블 -->
        <section
            class="glow bg-white dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden"
        >
            <div class="overflow-y-auto max-h-full">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-amber-200 dark:bg-green-700 sticky top-0 z-10">
                        <tr>
                            <th class="table-cell-style"></th>
                            <th class="table-cell-style">회원</th>
                            <th class="table-cell-style">앨범명</th>
                            <th class="table-cell-style">발매일</th>
                            <th class="table-cell-style">앨범 정산금</th>
                            <th class="table-cell-style">비스포크 요율</th>
                            <th class="table-cell-style">상계 전 잔액</th>
                            <th class="table-cell-style">상계 후 잔액</th>
                            <th class="table-cell-style">선금 전 %</th>
                            <th class="table-cell-style">선금 후 %</th>
                            <th class="table-cell-style">파트너 정산금</th>
                            <th class="table-cell-style-r">전송</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="balanceStore.loading">
                            <tr>
                                <td colspan="12" class="text-center py-4 text-gray-600">
                                    불러오는 중...⏳
                                </td>
                            </tr>
                        </template>

                        <template v-else-if="balanceStore.hasError">
                            <tr>
                                <td colspan="12" class="text-center py-4 text-red-600">
                                    {{ balanceStore.error }}
                                </td>
                            </tr>
                        </template>

                        <template v-else-if="balanceStore.balanceList.length === 0">
                            <tr>
                                <td colspan="12" class="text-center py-4 text-gray-400">
                                    정산 내역이 없습니다.
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr
                                v-for="item in balanceStore.balanceList"
                                :key="item.id"
                                class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                <td class="table-cell-style">
                                    <input
                                        type="checkbox"
                                        :checked="isSelected(item.id)"
                                        @change="toggleSelection(item.id)"
                                    />
                                </td>

                                <td class="table-cell-style">{{ item.member }}</td>
                                <td class="table-cell-style">{{ item.album }}</td>
                                <td class="table-cell-style">
                                    {{ item.releaseDate || '-' }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatCurrency(item.albumBalance) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatPercent(item.bespokeRate) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatCurrency(item.beforeOffset) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatCurrency(item.afterOffset) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatPercent(item.beforeAdvance) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatPercent(item.afterAdvance) }}
                                </td>
                                <td class="table-cell-style">
                                    {{ formatCurrency(item.partnerBalance) }}
                                </td>

                                <td class="table-cell-style-r">
                                    <button
                                        class="text-lg text-center hover:text-blue-700"
                                        @click="openMailPreviewModal(item.id)"
                                    >
                                        📨
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </section>

        <div class="flex justify-between items-center mt-4">
            <div class="flex-1 flex justify-center">
                <BasePagination
                    :current-page="currentPage"
                    :total-pages="balanceStore.totalPages"
                    @page-changed="fetchBalanceList"
                />
            </div>

            <div class="flex justify-end w-64">
                <button
                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="selectedIds.length === 0"
                    @click="showMailModal = true"
                >
                    📧 메일 일괄 전송
                </button>
            </div>
        </div>

        <div class="flex justify-center">
            <BaseButtonA
                class="border bg-gray-700 hover:bg-blue-800 text-white font-bold px-8 py-2 rounded transition-colors"
            >
                이체 준비 : (C)onfirm 으로
            </BaseButtonA>
        </div>
    </div>

    <BaseModal
        v-if="showMailModal"
        title="정산서 메일 전송"
        :message="'선택된 회원에게 정산서 메일을 일괄로 전송하시겠습니까?'"
        :buttons="[
            {
                text: '네',
                type: 'primary',
                onClick: async () => {
                    await sendBatchMail();
                    showMailModal = false;
                },
            },
            {
                text: '아니오',
                onClick: () => (showMailModal = false),
            },
        ]"
        @background-click="showMailModal = false"
    />

    <MailPreviewModal
        v-if="showPreviewModal && selectedUserId !== null"
        :user-id="selectedUserId"
        :month-settle-id="props.selectedMonthId"
        :on-send="handleMailSent"
        :on-close="closePreviewModal"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBalanceStore } from '@/stores/b_settlement/balance';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseButtonA from '@/components/BaseButtonA.vue';
import BaseModal from '@/components/BaseModal.vue';
import MailPreviewModal from '@/components/MailPreviewModal.vue';

const showMailModal = ref(false);
const showPreviewModal = ref(false);

const props = defineProps<{
    selectedMonth: string;
    selectedMonthId: number;
}>();

const balanceStore = useBalanceStore();

const sortBy = ref('nameAsc');
const pageSize = ref(20);
const pageSizeOptions = [20, 50, 100];

const currentPage = ref(1);
const totalPages = ref(1);
const selectedIds = ref<number[]>([]); // ✅ 고침
// 단일 선택용 selectedUserId 따로 선언
const selectedUserId = ref<number | null>(null);

function openMailPreviewModal(id: number) {
    selectedUserId.value = id;
    showPreviewModal.value = true;
}

function closePreviewModal() {
    showPreviewModal.value = false;
    selectedUserId.value = null;
}

function handleMailSent() {
    alert('메일 전송 완료!');
    closePreviewModal();
}

function toggleSelection(id: number) {
    const idx = selectedIds.value.indexOf(id);
    if (idx !== -1) {
        selectedIds.value.splice(idx, 1);
    } else {
        selectedIds.value.push(id);
    }
}

function isSelected(id: number) {
    return selectedIds.value.includes(id);
}

function fetchBalanceList(page: number = 1) {
    balanceStore
        .fetchBalanceList(props.selectedMonthId, page, sortBy.value, pageSize.value)
        .then((data) => {
            totalPages.value = data.totalPages;
            currentPage.value = page;
        });
}

function formatCurrency(val: number): string {
    return new Intl.NumberFormat('ko-KR').format(val ?? 0);
}

function formatPercent(val: number | string): string {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) ? `${num.toFixed(1)}%` : '-';
}

async function sendBatchMail() {
    if (selectedIds.value.length === 0) {
        self.alert('선택된 회원이 없습니다.');
        return;
    }

    try {
        await balanceStore.sendBatchMail(selectedIds.value);
        self.alert('정산서 메일이 성공적으로 전송되었습니다.');
        selectedIds.value = [];
    } catch (e) {
        console.error(e);
        self.alert('메일 전송 실패: 서버 오류가 발생했습니다.');
    }
}

watch([sortBy, pageSize, () => props.selectedMonthId], () => {
    fetchBalanceList(1);
    // fetch 후 데이터 확인
    setTimeout(() => {
        console.log('balanceList:', balanceStore.balanceList);
    }, 500);
});

watch(
    () => balanceStore.balanceList,
    (newVal) => {
        console.log('📦 balanceList 변경:', newVal);
    }
);

onMounted(() => {
    fetchBalanceList(currentPage.value);
});

function refreshBalanceList() {
    fetchBalanceList(currentPage.value);
}
</script>

<style lang="postcss">
.table-cell-style-r {
    @apply px-1 py-1 text-sm  border-b border-slate-300 text-black dark:text-white;
}
.table-cell-style {
    @apply table-cell-style-r border-r border-slate-300;
}
</style>
