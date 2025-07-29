<!-- /admin-frontend/src/views/settlement/SettlementView.vue -->
<template>
    <div class="p-2 flex flex-col h-full">
        <!-- 에러 메시지 -->
        <div
            v-if="settlementstore.error"
            class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4"
        >
            <p class="font-medium">{{ settlementstore.error }}</p>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="settlementstore.loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <h1 class="text-2xl font-bold mb-2">정산수행 관리</h1>
        <h2 class="text-m font-bold">작업 년/월 선택</h2>

        <!-- 년/월 선택기 테이블 컨테이너 -->
        <div
            v-if="!settlementstore.error && !settlementstore.loading"
            class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden shrink-0"
            :style="{
                height: '85px',
                background: isDark
                    ? 'linear-gradient(to bottom, rgb(51, 65, 85) 39%, rgb(30, 41, 59) 47%)'
                    : 'linear-gradient(to bottom, rgb(226, 232, 240) 39%, rgb(241, 245, 249) 47%)',
            }"
        >
            <div
                ref="tableContainer"
                class="overflow-x-auto scrollbar-hide"
                @wheel.passive="handleWheel"
            >
                <table class="min-w-full bg-transparent table-fixed">
                    <thead class="bg-transparent">
                        <!-- 첫 번째 행: 년/월 -->
                        <tr>
                            <!-- 이전 기간 보기 버튼 -->
                            <th
                                rowspan="2"
                                class="w-[80px] cursor-pointer"
                                @click="handlePrevPeriod"
                            >
                                <button
                                    :disabled="isPrevDisabled"
                                    class="py-2 px-4"
                                    :class="{ 'opacity-30 cursor-not-allowed': isPrevDisabled }"
                                >
                                    &lt;&lt;
                                </button>
                            </th>

                            <!-- 1월부터 12월까지 -->

                            <th
                                v-for="monthNum in 12"
                                :key="monthNum"
                                :class="
                                    getSelectedHeaderClasses(
                                        formatYearMonth(
                                            `${String(currentYear).slice(-2)}.${monthNum}`
                                        )
                                    )
                                "
                                @click="
                                    selectMonth(
                                        formatYearMonth(
                                            `${String(currentYear).slice(-2)}.${monthNum}`
                                        )
                                    )
                                "
                                class="w-[120px] py-2 text-center border-b-2 border-white p-0 cursor-pointer"
                            >
                                {{
                                    formatYearMonth(`${String(currentYear).slice(-2)}.${monthNum}`)
                                }}
                            </th>

                            <!-- 다음 기간 보기 버튼 -->
                            <th
                                rowspan="2"
                                class="w-[80px] cursor-pointer"
                                @click="handleNextPeriod"
                            >
                                <button
                                    :disabled="isNextDisabled"
                                    class="py-2 px-4"
                                    :class="{ 'opacity-30 cursor-not-allowed': isNextDisabled }"
                                >
                                    &gt;&gt;
                                </button>
                            </th>
                        </tr>

                        <!-- 두 번째 행: 상태 -->
                        <tr>
                            <td
                                v-for="monthNum in 12"
                                :key="`status-${monthNum}`"
                                :class="
                                    getSelectedBodyClasses(
                                        formatYearMonth(
                                            `${String(currentYear).slice(-2)}.${monthNum}`
                                        )
                                    )
                                "
                                @click="
                                    selectMonth(
                                        formatYearMonth(
                                            `${String(currentYear).slice(-2)}.${monthNum}`
                                        )
                                    )
                                "
                                class="w-[120px] py-2 text-center cursor-pointer"
                            >
                                <span
                                    :class="
                                        getStatusChipClasses(
                                            getMonthStatus(
                                                formatYearMonth(
                                                    `${String(currentYear).slice(-2)}.${monthNum}`
                                                )
                                            )
                                        )
                                    "
                                >
                                    {{
                                        getStatusDisplay(
                                            getMonthStatus(
                                                formatYearMonth(
                                                    `${String(currentYear).slice(-2)}.${monthNum}`
                                                )
                                            )
                                        )
                                    }}
                                </span>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <div class="border-b-1 border-gray-400 mt-4">
            <div class="flex -mb-px space-x-2">
                <!-- A 단계 탭 타이틀 -->
                <button
                    @click="handleTabClick('adjustment')"
                    :class="[
                        'p-3 font-medium rounded-t-lg transition-colors',
                        currentTab === 'adjustment'
                            ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                    ]"
                >
                    <div class="text-lg flex items-center space-x-2">
                        <span class="font-extrabold">(A)djustment</span>
                        <span class="text-sm">{{ adjustmentStatusText }}</span>
                    </div>
                </button>

                <!-- B 단계 탭 타이틀 -->
                <button
                    @click="handleTabClick('balance')"
                    :class="[
                        'p-3 font-medium rounded-t-lg transition-colors',
                        currentTab === 'balance'
                            ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                    ]"
                >
                    <div class="text-lg flex items-center space-x-2">
                        <span class="font-extrabold">(B)alance</span>
                        <span class="text-sm">{{ balanceStatusText }}</span>
                    </div>
                </button>

                <!-- C 단계 탭 타이틀 -->
                <button
                    @click="handleTabClick('confirm')"
                    :class="[
                        'p-3 font-medium rounded-t-lg transition-colors',
                        currentTab === 'confirm'
                            ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                    ]"
                >
                    <div class="text-lg flex items-center space-x-2">
                        <span class="font-extrabold">(C)onfirm</span>
                        <span class="text-sm">{{ confirmStatusText }}</span>
                    </div>
                </button>
            </div>
        </div>

        <!-- 탭 메뉴 -->
        <div
            v-if="settlementstore.selectedMonth"
            class="bg-gray-200 dark:bg-slate-700 mt-4p-0 rounded-b-lg flex-1 overflow-hidden"
        >
            <!-- 탭 컨텐츠 -->
            <div
                class="bg-gray-200 dark:bg-slate-700 p-0 rounded-lg flex-1 overflow-hidden"
                style="height: 100%"
            >
                <component
                    :is="currentTabComponent"
                    :selected-month="settlementstore.selectedMonth"
                    :selected-month-id="settlementstore.selectedMonthId"
                    @update-abc-progress="handleProgressUpdate"
                    @update-inside-status="updateStatus"
                    @go-balance="
                        () => {
                            currentTab = 'balance';
                        }
                    "
                />
            </div>
        </div>
    </div>

    <BaseModal
        v-if="showModal"
        :title="modalTitle"
        :message="modalMessage"
        :buttons="modalButtons"
        @background-click="showModal = false"
    />
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref, nextTick } from 'vue';
import { useDark } from '@vueuse/core';
import { useSidebarStore } from '@/stores/sidebar';
import { useSettlementStore } from '@/stores/b_settlement/settlement';
import { useAdjustmentStore } from '@/stores/b_settlement/adjustment';

import { TabType } from '@/types/settlement';

import AdjustmentTab from './AdjustmentTab.vue';
import BalanceTab from './BalanceTab.vue';
import ConfirmTab from './ConfirmTab.vue';

import BaseModal from '@/components/BaseModal.vue';

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalButtons = ref<{ text: string; onClick: () => void }[]>([]);

type AdjustmentProgress = boolean[];
type BalanceOrConfirmProgress = [number, number];

interface TabProgressData {
    adjustment?: AdjustmentProgress;
    balance?: BalanceOrConfirmProgress;
    confirm?: BalanceOrConfirmProgress;
}

const adjustmentTabStatus = ref<boolean[]>([false, false, false]);
const tabProgress = ref<TabProgressData>({});

function updateStatus(update: TabProgressData) {
    if (update.adjustment) {
        adjustmentTabStatus.value = update.adjustment;
    }
    tabProgress.value = {
        ...tabProgress.value,
        ...update,
    };
}

// 상태를 문자열로 변환
const adjustmentStatusText = computed(() => {
    if (progressState.value.adjustment === 'inProgress') {
        const key = adjustmentTabStatus.value.join(',');

        const statusMap: Record<string, string> = {
            'true,false,false': ` - ✅❌❌ "작업 중 …🧐"`,
            'false,true,false': ` - ❌✅❌ "작업 중 …🧐"`,
            'false,false,true': ` - ❌❌✅ "작업 중 …🧐"`,
            'true,true,false': ` - ✅✅❌ "작업 중 …🧐"`,
            'false,true,true': ` - ❌✅✅ "작업 중 …🧐"`,
            'true,false,true': ` - ✅❌✅ "작업 중 …🧐"`,
            'true,true,true': ` - ✅✅✅ "작업 중 …🧐"`,
        };

        return statusMap[key] || '...🥚';
    } else if (progressState.value.adjustment === 'completed') {
        return ` - ✅✅✅ "확정! …🏁"`;
    }

    return '...🥚'; // 기본값 반환 추가
});

const balanceStatusText = computed(() => {
    const [done, total] = tabProgress.value.balance || [0, 0];

    if (progressState.value.balance === 'initial') {
        return '...🥚';
    } else if (done === 0 && total === 0) {
        if (progressState.value.balance === 'inProgress') {
            return ` - "금액 확인/메일 발송 …📮"`;
        } else if (progressState.value.balance === 'completed') {
            return ` - "메일 발송 완료 …🏁"`;
        }
    } else if (progressState.value.balance === 'inProgress') {
        return ` - ${done}/${total} "메일 발송 중 …📮"`;
    } else if (progressState.value.balance === 'completed') {
        return ` - ${done}/${total} "메일 발송 완료 …🏁"`;
    }
    return '';
});

const confirmStatusText = computed(() => {
    const [done, total] = tabProgress.value.confirm || [0, 0];

    if (progressState.value.confirm === 'initial') {
        return '...🥚';
    } else if (done === 0 && total === 0) {
        if (progressState.value.confirm === 'inProgress') {
            return ` - 출금 확인 중…💸`;
        } else if (progressState.value.confirm === 'completed') {
            return ` - 출금 완료…🏁`;
        }
    } else if (progressState.value.confirm === 'inProgress') {
        return ` - ${done}/${total} "출금 확인 중…💸`;
    } else if (progressState.value.confirm === 'completed') {
        return ` - ${done}/${total} "출금 완료…🏁"`;
    }

    return '';
});

// 테이블 컨테이너 ref 추가
const tableContainer = ref<HTMLDivElement | null>(null);

const sidebarStore = useSidebarStore();
const settlementstore = useSettlementStore();
const adjustmentStore = useAdjustmentStore();
const isDark = useDark();

// 상태 관리용 추가 변수
const currentYear = ref(new Date().getFullYear());
const minYear = 2022;
const maxYear = new Date().getFullYear();

// store로부터 데이터를 전체 조회 (이미 존재하는 fetchMonthlyData로 가정)
onMounted(async () => {
    await settlementstore.fetchMonthlyData();
    selectPrevMonth();
    const monthData = settlementstore.monthlyData.find(
        (m) => m.yearMonth === settlementstore.selectedMonth
    );
    if (monthData) {
        adjustmentStore.setSelectedMonth(monthData.month_settle_id);
        await adjustmentStore.fetchVerificationData();
    }
    nextTick(scrollToRight);

    // 현재 월 상태 출력
    console.log('[SettleView] @onMounted : 현재 월 상태 : ', settlementstore.selectedMonth);
    // 현재 월 데이터 출력
    console.log(
        '[SettleView] @onMounted : 현재 월 데이터 : ',
        settlementstore.monthlyData.find((m) => m.yearMonth === settlementstore.selectedMonth)
    );
    // 현재 월 상태 기반 progressState 설정
    setProgressStateByStatus(
        settlementstore.monthlyData.find((m) => m.yearMonth === settlementstore.selectedMonth)
            ?.status || 'NotStarted'
    );
});

// 연도 이동 처리
const handlePrevPeriod = () => {
    if (currentYear.value > minYear) {
        currentYear.value--;
    }
};

const handleNextPeriod = () => {
    if (currentYear.value < maxYear) {
        currentYear.value++;
    }
};

// 이동 버튼 disabled 상태
const isPrevDisabled = computed(() => currentYear.value <= minYear);
const isNextDisabled = computed(() => currentYear.value >= maxYear);

// 특정 월 상태 반환 함수
const getMonthStatus = (yearMonth: string): StatusType => {
    const monthData = settlementstore.monthlyData.find((m) => m.yearMonth === yearMonth);
    return monthData ? monthData.status : 'NotStarted';
};

const currentTab = ref('adjustment');
const progressState = ref({
    adjustment: 'inProgress', // 'initial' | 'inProgress' | 'completed'
    balance: 'initial',
    confirm: 'initial',
});

const currentTabComponent = computed(() => {
    switch (currentTab.value) {
        case 'adjustment':
            return AdjustmentTab;
        case 'balance':
            return BalanceTab;
        case 'confirm':
            return ConfirmTab;
        default:
            return AdjustmentTab;
    }
});

const handleProgressUpdate = (tab: TabType, status: string) => {
    console.log('handleProgressUpdate', tab, status);
    progressState.value[tab] = status;
};

// 가장 최근 월 대신, 한 달 전 월을 기본 선택
const selectPrevMonth = () => {
    const now = new Date();
    // 한 달 전 계산
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = String(prevMonthDate.getFullYear()).slice(-2); // '24'
    const month = String(prevMonthDate.getMonth() + 1).padStart(2, '0'); // '05'
    const prevYearMonth = `${year}.${month}`; // '24.05' 등

    // settlementstore.monthlyData에서 해당 월 찾기
    const found = settlementstore.monthlyData.find((m) => m.yearMonth === prevYearMonth);
    if (found) {
        settlementstore.setSelectedMonth(prevYearMonth);
    } else if (settlementstore.monthlyData.length > 0) {
        // 없으면 가장 최근 월 선택 (기존 백업 로직)
        const latestMonth = [...settlementstore.monthlyData].sort((a, b) => {
            const [yearA, monthA] = a.yearMonth.split('.');
            const [yearB, monthB] = b.yearMonth.split('.');
            const dateA = new Date(parseInt(`20${yearA}`), parseInt(monthA) - 1);
            const dateB = new Date(parseInt(`20${yearB}`), parseInt(monthB) - 1);
            return dateB.getTime() - dateA.getTime();
        })[0];
        settlementstore.setSelectedMonth(latestMonth.yearMonth);
    }
};

// 스크롤 오른쪽으로 이동 함수
const scrollToRight = () => {
    if (tableContainer.value) {
        tableContainer.value.scrollLeft = tableContainer.value.scrollWidth;
    }
};

// 휠 이벤트 핸들러
const handleWheel = (e: WheelEvent) => {
    if (tableContainer.value) {
        // e.preventDefault();
        tableContainer.value.scrollLeft += e.deltaY;
    }
};

// 년.월 포맷 변환
const formatYearMonth = (yearMonth: string): string => {
    const [year, month] = yearMonth.split('.');
    return `${year}.${month.padStart(2, '0')}`;
};

type StatusType = 'NotStarted' | 'Adjustment' | 'Balance' | 'Confirm' | 'Completed';

const getStatusDisplay = (status: StatusType): string => {
    const statusMap: Record<StatusType, string> = {
        NotStarted: '...',
        Adjustment: 'A.진행중',
        Balance: 'B.진행중',
        Confirm: 'C.진행중',
        Completed: '완료',
    };
    return statusMap[status];
};

const getStatusChipClasses = (status: StatusType): string => {
    const baseClasses = 'py-1 px-2 inline-flex text-sm leading-5 font-bold rounded-full';
    const statusClasses: Record<StatusType, string> = {
        NotStarted: 'border border-gray-600 bg-gray-200 text-gray-600 font-bold',
        Adjustment: 'border border-orange-600 bg-orange-100 text-orange-800',
        Balance: 'border border-yellow-600 bg-yellow-100 text-yellow-800',
        Confirm: 'border border-blue-600 bg-blue-100 text-blue-800',
        Completed: 'border border-green-600 bg-green-100 text-green-800',
    };
    return `${baseClasses} ${statusClasses[status]}`;
};

const getSelectedHeaderClasses = (yearMonth: string) => {
    const isSelected = settlementstore.selectedMonth === yearMonth;

    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/80': isSelected,
        'rounded-t-2xl border-red-700': isSelected,
        'font-bold': isSelected,
    };
};
const getSelectedBodyClasses = (yearMonth: string) => {
    const isSelected = settlementstore.selectedMonth === yearMonth;

    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/70': isSelected,
        'rounded-b-2xl ': isSelected,

        // 'font-bold': isSelected,
    };
};

const setProgressStateByStatus = (status: StatusType) => {
    switch (status) {
        case 'NotStarted':
        case 'Adjustment':
            progressState.value = {
                adjustment: 'inProgress',
                balance: 'initial',
                confirm: 'initial',
            };
            break;
        case 'Balance':
            progressState.value = {
                adjustment: 'completed',
                balance: 'inProgress',
                confirm: 'initial',
            };
            break;
        case 'Confirm':
            progressState.value = {
                adjustment: 'completed',
                balance: 'inProgress',
                confirm: 'inProgress',
            };
            break;
        case 'Completed':
            progressState.value = {
                adjustment: 'completed',
                balance: 'completed',
                confirm: 'completed',
            };
            break;
    }
};

// 월 선택 처리
const selectMonth = (yearMonth: string) => {
    const selectedMonthId = settlementstore.setSelectedMonth(yearMonth);
    if (selectedMonthId) {
        // 바뀐 년월로 adjustmentStore 에 정보 갱신 지시
        adjustmentStore.setSelectedMonth(selectedMonthId);
        adjustmentStore.fetchVerificationData();
    }

    const selectedMonthData = settlementstore.monthlyData.find((m) => m.yearMonth === yearMonth);

    if (selectedMonthData) {
        const status = selectedMonthData.status;
        if (status === 'NotStarted' || status === 'Adjustment') {
            currentTab.value = 'adjustment';
        } else if (status === 'Balance' && currentTab.value === 'confirm') {
            currentTab.value = 'balance';
        }
        // Confirm, Completed → 현재 탭 유지

        // 상태 기반 progressState 설정
        setProgressStateByStatus(status);

        console.log('selectedMonthData.status : ', selectedMonthData.status);
    }

    sidebarStore.minimize();
};

const handleTabClick = (tab: TabType) => {
    if (tab === 'balance' && progressState.value.adjustment !== 'completed') {
        modalTitle.value = '접근 제한';
        modalMessage.value = '(A)djustment 가 완료되어야 접근이 가능합니다.';
        modalButtons.value = [{ text: '확인', onClick: () => (showModal.value = false) }];
        showModal.value = true;
        return;
    }

    if (tab === 'confirm' && progressState.value.balance === 'initial') {
        modalTitle.value = '접근 제한';
        modalMessage.value = '(B)alance 가 진행 중이거나 완료되어야만 접근이 가능합니다.';
        modalButtons.value = [{ text: '확인', onClick: () => (showModal.value = false) }];
        showModal.value = true;
        return;
    }

    currentTab.value = tab;
    sidebarStore.minimize();
};

watch(
    () => settlementstore.monthlyData,
    (newData) => {
        console.log('[SettleView] @watch : All Monthly data updated:', newData);
        nextTick(() => {
            scrollToRight();
        });
        // 현재 월 상태 출력
        console.log('[SettleView] @watch : 현재 월 상태 : ', settlementstore.selectedMonth);
        // 현재 월 데이터 출력
        console.log(
            '[SettleView] @watch : 현재 월 데이터 : ',
            newData.find((m) => m.yearMonth === settlementstore.selectedMonth)
        );
        // 현재 월 상태 기반 progressState 설정
        setProgressStateByStatus(
            newData.find((m) => m.yearMonth === settlementstore.selectedMonth)?.status ||
                'NotStarted'
        );
    },
    { deep: true }
);
</script>

<style scoped lang="postcss">
.scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}

/* 셀 너비 강제 적용 */
th,
td {
    min-width: 50px;
    max-width: 160px;
}

/* 비활성화된 버튼 스타일 */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
