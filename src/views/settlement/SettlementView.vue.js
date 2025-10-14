import { onMounted, computed, watch, ref, nextTick } from 'vue';
import { useDark } from '@vueuse/core';
import { useSidebarStore } from '@/stores/sidebar';
import { useSettlementStore } from '@/stores/b_settlement/settlement';
import { useAdjustmentStore } from '@/stores/b_settlement/adjustment';
import AdjustmentTab from './AdjustmentTab.vue';
import BalanceTab from './BalanceTab.vue';
import ConfirmTab from './ConfirmTab.vue';
import BaseModal from '@/components/BaseModal.vue';
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalButtons = ref([]);
const adjustmentTabStatus = ref([false, false, false]);
const tabProgress = ref({});
function updateStatus(update) {
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
        const statusMap = {
            'true,false,false': ` - ✅❌❌ "작업 중 …🧐"`,
            'false,true,false': ` - ❌✅❌ "작업 중 …🧐"`,
            'false,false,true': ` - ❌❌✅ "작업 중 …🧐"`,
            'true,true,false': ` - ✅✅❌ "작업 중 …🧐"`,
            'false,true,true': ` - ❌✅✅ "작업 중 …🧐"`,
            'true,false,true': ` - ✅❌✅ "작업 중 …🧐"`,
            'true,true,true': ` - ✅✅✅ "작업 중 …🧐"`,
        };
        return statusMap[key] || '...🥚';
    }
    else if (progressState.value.adjustment === 'completed') {
        return ` - ✅✅✅ "확정! …🏁"`;
    }
    return '...🥚'; // 기본값 반환 추가
});
const balanceStatusText = computed(() => {
    const [done, total] = tabProgress.value.balance || [0, 0];
    if (progressState.value.balance === 'initial') {
        return '...🥚';
    }
    else if (done === 0 && total === 0) {
        if (progressState.value.balance === 'inProgress') {
            return ` - "금액 확인/메일 발송 …📮"`;
        }
        else if (progressState.value.balance === 'completed') {
            return ` - "메일 발송 완료 …🏁"`;
        }
    }
    else if (progressState.value.balance === 'inProgress') {
        return ` - ${done}/${total} "메일 발송 중 …📮"`;
    }
    else if (progressState.value.balance === 'completed') {
        return ` - ${done}/${total} "메일 발송 완료 …🏁"`;
    }
    return '';
});
const confirmStatusText = computed(() => {
    const [done, total] = tabProgress.value.confirm || [0, 0];
    if (progressState.value.confirm === 'initial') {
        return '...🥚';
    }
    else if (done === 0 && total === 0) {
        if (progressState.value.confirm === 'inProgress') {
            return ` - 출금 확인 중…💸`;
        }
        else if (progressState.value.confirm === 'completed') {
            return ` - 출금 완료…🏁`;
        }
    }
    else if (progressState.value.confirm === 'inProgress') {
        return ` - ${done}/${total} "출금 확인 중…💸`;
    }
    else if (progressState.value.confirm === 'completed') {
        return ` - ${done}/${total} "출금 완료…🏁"`;
    }
    return '';
});
// 테이블 컨테이너 ref 추가
const tableContainer = ref(null);
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
    const monthData = settlementstore.monthlyData.find((m) => m.yearMonth === settlementstore.selectedMonth);
    if (monthData) {
        adjustmentStore.setSelectedMonth(monthData.month_settle_id);
        await adjustmentStore.fetchVerificationData();
    }
    nextTick(scrollToRight);
    // 현재 월 상태 출력
    console.log('[SettleView] @onMounted : 현재 월 상태 : ', settlementstore.selectedMonth);
    // 현재 월 데이터 출력
    console.log('[SettleView] @onMounted : 현재 월 데이터 : ', settlementstore.monthlyData.find((m) => m.yearMonth === settlementstore.selectedMonth));
    // 현재 월 상태 기반 progressState 설정
    setProgressStateByStatus(settlementstore.monthlyData.find((m) => m.yearMonth === settlementstore.selectedMonth)
        ?.status || 'NotStarted');
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
const getMonthStatus = (yearMonth) => {
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
const handleProgressUpdate = (tab, status) => {
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
    }
    else if (settlementstore.monthlyData.length > 0) {
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
const handleWheel = (e) => {
    if (tableContainer.value) {
        // e.preventDefault();
        tableContainer.value.scrollLeft += e.deltaY;
    }
};
// 년.월 포맷 변환
const formatYearMonth = (yearMonth) => {
    const [year, month] = yearMonth.split('.');
    return `${year}.${month.padStart(2, '0')}`;
};
const getStatusDisplay = (status) => {
    const statusMap = {
        NotStarted: '...',
        Adjustment: 'A.진행중',
        Balance: 'B.진행중',
        Confirm: 'C.진행중',
        Completed: '완료',
    };
    return statusMap[status];
};
const getStatusChipClasses = (status) => {
    const baseClasses = 'py-1 px-2 inline-flex text-sm leading-5 font-bold rounded-full';
    const statusClasses = {
        NotStarted: 'border border-gray-600 bg-gray-200 text-gray-600 font-bold',
        Adjustment: 'border border-orange-600 bg-orange-100 text-orange-800',
        Balance: 'border border-yellow-600 bg-yellow-100 text-yellow-800',
        Confirm: 'border border-blue-600 bg-blue-100 text-blue-800',
        Completed: 'border border-green-600 bg-green-100 text-green-800',
    };
    return `${baseClasses} ${statusClasses[status]}`;
};
const getSelectedHeaderClasses = (yearMonth) => {
    const isSelected = settlementstore.selectedMonth === yearMonth;
    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/80': isSelected,
        'rounded-t-2xl border-red-700': isSelected,
        'font-bold': isSelected,
    };
};
const getSelectedBodyClasses = (yearMonth) => {
    const isSelected = settlementstore.selectedMonth === yearMonth;
    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/70': isSelected,
        'rounded-b-2xl ': isSelected,
        // 'font-bold': isSelected,
    };
};
const setProgressStateByStatus = (status) => {
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
const selectMonth = (yearMonth) => {
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
        }
        else if (status === 'Balance' && currentTab.value === 'confirm') {
            currentTab.value = 'balance';
        }
        // Confirm, Completed → 현재 탭 유지
        // 상태 기반 progressState 설정
        setProgressStateByStatus(status);
        console.log('selectedMonthData.status : ', selectedMonthData.status);
    }
    sidebarStore.minimize();
};
const handleTabClick = (tab) => {
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
watch(() => settlementstore.monthlyData, (newData) => {
    console.log('[SettleView] @watch : All Monthly data updated:', newData);
    nextTick(() => {
        scrollToRight();
    });
    // 현재 월 상태 출력
    console.log('[SettleView] @watch : 현재 월 상태 : ', settlementstore.selectedMonth);
    // 현재 월 데이터 출력
    console.log('[SettleView] @watch : 현재 월 데이터 : ', newData.find((m) => m.yearMonth === settlementstore.selectedMonth));
    // 현재 월 상태 기반 progressState 설정
    setProgressStateByStatus(newData.find((m) => m.yearMonth === settlementstore.selectedMonth)?.status ||
        'NotStarted');
}, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['scrollbar-hide']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-2 flex flex-col h-full" },
});
if (__VLS_ctx.settlementstore.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.settlementstore.error);
}
if (__VLS_ctx.settlementstore.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center h-32" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-m font-bold" },
});
if (!__VLS_ctx.settlementstore.error && !__VLS_ctx.settlementstore.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden shrink-0" },
        ...{ style: ({
                height: '85px',
                background: __VLS_ctx.isDark
                    ? 'linear-gradient(to bottom, rgb(51, 65, 85) 39%, rgb(30, 41, 59) 47%)'
                    : 'linear-gradient(to bottom, rgb(226, 232, 240) 39%, rgb(241, 245, 249) 47%)',
            }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onWheel: (__VLS_ctx.handleWheel) },
        ref: "tableContainer",
        ...{ class: "overflow-x-auto scrollbar-hide" },
    });
    /** @type {typeof __VLS_ctx.tableContainer} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "min-w-full bg-transparent table-fixed" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
        ...{ class: "bg-transparent" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ onClick: (__VLS_ctx.handlePrevPeriod) },
        rowspan: "2",
        ...{ class: "w-[80px] cursor-pointer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        disabled: (__VLS_ctx.isPrevDisabled),
        ...{ class: "py-2 px-4" },
        ...{ class: ({ 'opacity-30 cursor-not-allowed': __VLS_ctx.isPrevDisabled }) },
    });
    for (const [monthNum] of __VLS_getVForSourceType((12))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.settlementstore.error && !__VLS_ctx.settlementstore.loading))
                        return;
                    __VLS_ctx.selectMonth(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`));
                } },
            key: (monthNum),
            ...{ class: (__VLS_ctx.getSelectedHeaderClasses(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`))) },
            ...{ class: "w-[120px] py-2 text-center border-b-2 border-white p-0 cursor-pointer" },
        });
        (__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ onClick: (__VLS_ctx.handleNextPeriod) },
        rowspan: "2",
        ...{ class: "w-[80px] cursor-pointer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        disabled: (__VLS_ctx.isNextDisabled),
        ...{ class: "py-2 px-4" },
        ...{ class: ({ 'opacity-30 cursor-not-allowed': __VLS_ctx.isNextDisabled }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    for (const [monthNum] of __VLS_getVForSourceType((12))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.settlementstore.error && !__VLS_ctx.settlementstore.loading))
                        return;
                    __VLS_ctx.selectMonth(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`));
                } },
            key: (`status-${monthNum}`),
            ...{ class: (__VLS_ctx.getSelectedBodyClasses(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`))) },
            ...{ class: "w-[120px] py-2 text-center cursor-pointer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.getStatusChipClasses(__VLS_ctx.getMonthStatus(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`)))) },
        });
        (__VLS_ctx.getStatusDisplay(__VLS_ctx.getMonthStatus(__VLS_ctx.formatYearMonth(`${String(__VLS_ctx.currentYear).slice(-2)}.${monthNum}`))));
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-b-1 border-gray-400 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex -mb-px space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleTabClick('adjustment');
        } },
    ...{ class: ([
            'p-3 font-medium rounded-t-lg transition-colors',
            __VLS_ctx.currentTab === 'adjustment'
                ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg flex items-center space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-extrabold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm" },
});
(__VLS_ctx.adjustmentStatusText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleTabClick('balance');
        } },
    ...{ class: ([
            'p-3 font-medium rounded-t-lg transition-colors',
            __VLS_ctx.currentTab === 'balance'
                ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg flex items-center space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-extrabold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm" },
});
(__VLS_ctx.balanceStatusText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleTabClick('confirm');
        } },
    ...{ class: ([
            'p-3 font-medium rounded-t-lg transition-colors',
            __VLS_ctx.currentTab === 'confirm'
                ? 'bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg flex items-center space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-extrabold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm" },
});
(__VLS_ctx.confirmStatusText);
if (__VLS_ctx.settlementstore.selectedMonth) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-200 dark:bg-slate-700 mt-4p-0 rounded-b-lg flex-1 overflow-hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-200 dark:bg-slate-700 p-0 rounded-lg flex-1 overflow-hidden" },
        ...{ style: {} },
    });
    const __VLS_0 = ((__VLS_ctx.currentTabComponent));
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onUpdateAbcProgress': {} },
        ...{ 'onUpdateInsideStatus': {} },
        ...{ 'onGoBalance': {} },
        selectedMonth: (__VLS_ctx.settlementstore.selectedMonth),
        selectedMonthId: (__VLS_ctx.settlementstore.selectedMonthId),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onUpdateAbcProgress': {} },
        ...{ 'onUpdateInsideStatus': {} },
        ...{ 'onGoBalance': {} },
        selectedMonth: (__VLS_ctx.settlementstore.selectedMonth),
        selectedMonthId: (__VLS_ctx.settlementstore.selectedMonthId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onUpdateAbcProgress: (__VLS_ctx.handleProgressUpdate)
    };
    const __VLS_8 = {
        onUpdateInsideStatus: (__VLS_ctx.updateStatus)
    };
    const __VLS_9 = {
        onGoBalance: (() => {
            __VLS_ctx.currentTab = 'balance';
        })
    };
    var __VLS_3;
}
if (__VLS_ctx.showModal) {
    /** @type {[typeof BaseModal, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(BaseModal, new BaseModal({
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.modalTitle),
        message: (__VLS_ctx.modalMessage),
        buttons: (__VLS_ctx.modalButtons),
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.modalTitle),
        message: (__VLS_ctx.modalMessage),
        buttons: (__VLS_ctx.modalButtons),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_13;
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = {
        onBackgroundClick: (...[$event]) => {
            if (!(__VLS_ctx.showModal))
                return;
            __VLS_ctx.showModal = false;
        }
    };
    var __VLS_12;
}
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-red-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['scrollbar-hide']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['table-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[80px]']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[80px]']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['-mb-px']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseModal: BaseModal,
            showModal: showModal,
            modalTitle: modalTitle,
            modalMessage: modalMessage,
            modalButtons: modalButtons,
            updateStatus: updateStatus,
            adjustmentStatusText: adjustmentStatusText,
            balanceStatusText: balanceStatusText,
            confirmStatusText: confirmStatusText,
            tableContainer: tableContainer,
            settlementstore: settlementstore,
            isDark: isDark,
            currentYear: currentYear,
            handlePrevPeriod: handlePrevPeriod,
            handleNextPeriod: handleNextPeriod,
            isPrevDisabled: isPrevDisabled,
            isNextDisabled: isNextDisabled,
            getMonthStatus: getMonthStatus,
            currentTab: currentTab,
            currentTabComponent: currentTabComponent,
            handleProgressUpdate: handleProgressUpdate,
            handleWheel: handleWheel,
            formatYearMonth: formatYearMonth,
            getStatusDisplay: getStatusDisplay,
            getStatusChipClasses: getStatusChipClasses,
            getSelectedHeaderClasses: getSelectedHeaderClasses,
            getSelectedBodyClasses: getSelectedBodyClasses,
            selectMonth: selectMonth,
            handleTabClick: handleTabClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SettlementView.vue.js.map