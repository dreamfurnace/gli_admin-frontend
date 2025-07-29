import { onMounted, computed, watch, ref, nextTick } from 'vue';
import { useDark } from '@vueuse/core';
import { useSidebarStore } from '@/stores/sidebar';
import { useSettlementStore } from '@/stores/settlement';
import AdjustmentTab from './AdjustmentTab.vue';
import BalanceTab from './BalanceTab.vue';
import ConfirmTab from './ConfirmTab.vue';
// 테이블 컨테이너 ref 추가
const tableContainer = ref(null);
const sidebarStore = useSidebarStore();
const store = useSettlementStore();
const isDark = useDark();
// 표시할 월 데이터 계산
const displayMonths = computed(() => store.sortedMonthlyData);
const currentTab = ref('adjustment');
const progressState = ref({
    adjustment: 'initial', // 'initial' | 'inProgress' | 'completed'
    balance: 'initial',
    confirm: 'initial',
});
const isInitialState = computed(() => progressState.value.adjustment === 'initial' &&
    progressState.value.balance === 'initial' &&
    progressState.value.confirm === 'initial');
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
    progressState.value[tab] = status;
};
// 가장 최근 월 선택 함수
const selectLatestMonth = () => {
    if (store.monthlyData.length > 0) {
        const latestMonth = [...store.monthlyData].sort((a, b) => {
            const [yearA, monthA] = a.yearMonth.split('.');
            const [yearB, monthB] = b.yearMonth.split('.');
            const dateA = new Date(parseInt(`20${yearA}`), parseInt(monthA) - 1);
            const dateB = new Date(parseInt(`20${yearB}`), parseInt(monthB) - 1);
            return dateB.getTime() - dateA.getTime();
        })[0];
        store.setSelectedMonth(latestMonth.yearMonth);
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
        e.preventDefault();
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
        'not-started': '미진행',
        adjustment: 'A.진행중',
        balance: 'B.진행중',
        confirm: 'C.진행중',
        completed: '완료',
    };
    return statusMap[status];
};
const getStatusChipClasses = (status) => {
    const baseClasses = 'px-2 inline-flex text-s leading-5 font-semibold rounded-full';
    const statusClasses = {
        'not-started': 'bg-gray-200 text-gray-500',
        adjustment: 'bg-orange-100 text-orange-800',
        balance: 'bg-yellow-100 text-yellow-800',
        confirm: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
    };
    return `${baseClasses} ${statusClasses[status]}`;
};
const getSelectedHeaderClasses = (yearMonth) => {
    const isSelected = store.selectedMonth === yearMonth;
    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/80': isSelected,
        'rounded-t-2xl border-red-700': isSelected,
        'font-bold': isSelected,
    };
};
const getSelectedBodyClasses = (yearMonth) => {
    const isSelected = store.selectedMonth === yearMonth;
    return {
        'hover-column': true,
        'bg-red-200/60 dark:bg-red-900/70': isSelected,
        'rounded-b-2xl ': isSelected,
        // 'font-bold': isSelected,
    };
};
// 월 선택 처리
const selectMonth = (yearMonth) => {
    store.setSelectedMonth(yearMonth);
    sidebarStore.minimize();
};
// 새 월 추가 처리
const handleAddMonth = async () => {
    try {
        await store.addNewMonth();
        sidebarStore.minimize();
    }
    catch (error) {
        console.error('Failed to add new month:', error);
    }
};
const handleTabClick = (tab) => {
    currentTab.value = tab;
    sidebarStore.minimize();
};
// 버튼 비활성화 조건 계산
const isAddButtonDisabled = computed(() => {
    if (store.sortedMonthlyData.length === 0)
        return false;
    const latestMonth = store.sortedMonthlyData[store.sortedMonthlyData.length - 1];
    const [year, month] = latestMonth.yearMonth.split('.').map(Number);
    const currentDate = new Date();
    const threeMonthsLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 1);
    const latestDate = new Date(2000 + year, month - 1, 1);
    return latestDate >= threeMonthsLater;
});
// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
    await store.fetchMonthlyData();
    selectLatestMonth();
    // DOM 업데이트를 기다린 후 스크롤
    nextTick(() => {
        scrollToRight();
    });
});
watch(() => store.monthlyData, (newData) => {
    console.log('Monthly data updated:', newData);
    nextTick(() => {
        scrollToRight();
    });
}, { deep: true });
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    ['scrollbar-hide',];
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("p-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("text-2xl font-bold mb-6") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("text-m font-bold") },
    });
    if (__VLS_ctx.store.error) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("font-medium") },
        });
        (__VLS_ctx.store.error);
    }
    if (__VLS_ctx.store.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex justify-center items-center h-32") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500") },
        });
    }
    if (!__VLS_ctx.store.error && !__VLS_ctx.store.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden") },
            ...{ style: ({}) },
            ...{ style: (({
                    background: __VLS_ctx.isDark
                        ? 'linear-gradient(to bottom, rgb(51, 65, 85) 39%, rgb(30, 41, 59) 47%)'
                        : 'linear-gradient(to bottom, rgb(226, 232, 240) 39%, rgb(241, 245, 249) 47%)',
                })) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onWheel: (__VLS_ctx.handleWheel) },
            ref: ("tableContainer"),
            ...{ class: ("overflow-x-auto scrollbar-hide") },
        });
        // @ts-ignore navigation for `const tableContainer = ref()`
        /** @type { typeof __VLS_ctx.tableContainer } */ ;
        __VLS_elementAsFunction(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
            ...{ class: ("min-w-full bg-transparent table-fixed") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.colgroup, __VLS_intrinsicElements.colgroup)({});
        for (const [month] of __VLS_getVForSourceType((__VLS_ctx.displayMonths))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.col)({
                key: ((month.yearMonth)),
                ...{ class: ("w-[200px]") },
            });
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.col)({
            ...{ class: ("w-[200px]") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
            ...{ class: ("bg-transparent") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        for (const [month] of __VLS_getVForSourceType((__VLS_ctx.displayMonths))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
                ...{ onClick: (...[$event]) => {
                        if (!((!__VLS_ctx.store.error && !__VLS_ctx.store.loading)))
                            return;
                        __VLS_ctx.selectMonth(month.yearMonth);
                    } },
                'data-column': ((month.yearMonth)),
                ...{ class: ((__VLS_ctx.getSelectedHeaderClasses(month.yearMonth))) },
                ...{ class: ("w-[200px] py-2 text-center border-b-2 border-white p-0") },
            });
            (__VLS_ctx.formatYearMonth(month.yearMonth));
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("w-[200px] text-center") },
            rowspan: ("2"),
            ...{ style: ({}) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleAddMonth) },
            ...{ class: ("bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium py-4 px-3 rounded-xl my-2 transition-colors duration-200") },
            disabled: ((__VLS_ctx.isAddButtonDisabled || __VLS_ctx.store.loading)),
        });
        (__VLS_ctx.store.loading ? '추가 중...' : '추가하기');
        __VLS_elementAsFunction(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        for (const [month] of __VLS_getVForSourceType((__VLS_ctx.displayMonths))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ onClick: (...[$event]) => {
                        if (!((!__VLS_ctx.store.error && !__VLS_ctx.store.loading)))
                            return;
                        __VLS_ctx.selectMonth(month.yearMonth);
                    } },
                'data-column': ((month.yearMonth)),
                ...{ class: ((__VLS_ctx.getSelectedBodyClasses(month.yearMonth))) },
                ...{ class: ("w-[200px] py-4 text-center") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ((__VLS_ctx.getStatusChipClasses(month.status))) },
            });
            (__VLS_ctx.getStatusDisplay(month.status));
        }
    }
    if (__VLS_ctx.store.selectedMonth) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("mt-6") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("border-b-1 border-gray-400") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex -mb-px space-x-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.store.selectedMonth)))
                        return;
                    __VLS_ctx.handleTabClick('adjustment');
                } },
            ...{ class: (([
                    'py-4 px-6 font-medium rounded-t-lg transition-colors',
                    __VLS_ctx.currentTab === 'adjustment'
                        ? 'bg-gray-50 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-500 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                ])) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex items-center space-x-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.isInitialState) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            if (__VLS_ctx.progressState.adjustment === 'inProgress') {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            else if (__VLS_ctx.progressState.adjustment === 'completed') {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.store.selectedMonth)))
                        return;
                    __VLS_ctx.handleTabClick('balance');
                } },
            ...{ class: (([
                    'py-4 px-6 font-medium rounded-t-lg transition-colors',
                    __VLS_ctx.currentTab === 'balance'
                        ? 'bg-gray-50 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-500 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                ])) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex items-center space-x-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.isInitialState) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            if (__VLS_ctx.progressState.balance === 'completed') {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.store.selectedMonth)))
                        return;
                    __VLS_ctx.handleTabClick('confirm');
                } },
            ...{ class: (([
                    'py-4 px-6 font-medium rounded-t-lg transition-colors',
                    __VLS_ctx.currentTab === 'confirm'
                        ? 'bg-gray-50 dark:bg-slate-700 text-blue-600 dark:text-white mb-0'
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-500 hover:text-gray-700 border-b-1  border-gray-200 mb-1',
                ])) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex items-center space-x-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.isInitialState) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            if (__VLS_ctx.progressState.confirm === 'inProgress') {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-gray-50 dark:bg-slate-700 p-6 rounded-b-lg") },
        });
        const __VLS_0 = ((__VLS_ctx.currentTabComponent));
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onUpdateProgress': {} },
            selectedMonth: ((__VLS_ctx.store.selectedMonth)),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onUpdateProgress': {} },
            selectedMonth: ((__VLS_ctx.store.selectedMonth)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_6;
        const __VLS_7 = {
            onUpdateProgress: (__VLS_ctx.handleProgressUpdate)
        };
        let __VLS_3;
        let __VLS_4;
        var __VLS_5;
    }
    ['p-4', 'text-2xl', 'font-bold', 'mb-6', 'text-m', 'font-bold', 'bg-red-100', 'dark:bg-red-900', 'border', 'border-red-400', 'dark:border-red-700', 'text-red-700', 'dark:text-red-100', 'px-4', 'py-3', 'rounded', 'mb-4', 'font-medium', 'flex', 'justify-center', 'items-center', 'h-32', 'animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-emerald-500', 'bg-white', 'dark:bg-slate-800', 'rounded-lg', 'shadow', 'overflow-hidden', 'overflow-x-auto', 'scrollbar-hide', 'min-w-full', 'bg-transparent', 'table-fixed', 'w-[200px]', 'w-[200px]', 'bg-transparent', 'w-[200px]', 'py-2', 'text-center', 'border-b-2', 'border-white', 'p-0', 'w-[200px]', 'text-center', 'bg-emerald-600', 'hover:bg-emerald-700', 'dark:bg-emerald-700', 'dark:hover:bg-emerald-600', 'text-white', 'font-medium', 'py-4', 'px-3', 'rounded-xl', 'my-2', 'transition-colors', 'duration-200', 'w-[200px]', 'py-4', 'text-center', 'mt-6', 'border-b-1', 'border-gray-400', 'flex', '-mb-px', 'space-x-2', 'py-4', 'px-6', 'font-medium', 'rounded-t-lg', 'transition-colors', 'flex', 'items-center', 'space-x-2', 'py-4', 'px-6', 'font-medium', 'rounded-t-lg', 'transition-colors', 'flex', 'items-center', 'space-x-2', 'py-4', 'px-6', 'font-medium', 'rounded-t-lg', 'transition-colors', 'flex', 'items-center', 'space-x-2', 'bg-gray-50', 'dark:bg-slate-700', 'p-6', 'rounded-b-lg',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'tableContainer': __VLS_nativeElements['div'],
    };
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            tableContainer: tableContainer,
            store: store,
            isDark: isDark,
            displayMonths: displayMonths,
            currentTab: currentTab,
            progressState: progressState,
            isInitialState: isInitialState,
            currentTabComponent: currentTabComponent,
            handleProgressUpdate: handleProgressUpdate,
            handleWheel: handleWheel,
            formatYearMonth: formatYearMonth,
            getStatusDisplay: getStatusDisplay,
            getStatusChipClasses: getStatusChipClasses,
            getSelectedHeaderClasses: getSelectedHeaderClasses,
            getSelectedBodyClasses: getSelectedBodyClasses,
            selectMonth: selectMonth,
            handleAddMonth: handleAddMonth,
            handleTabClick: handleTabClick,
            isAddButtonDisabled: isAddButtonDisabled,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeRefs: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SettlementView.vue.js.map