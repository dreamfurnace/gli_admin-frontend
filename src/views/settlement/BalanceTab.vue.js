import { ref, onMounted, watch } from 'vue';
import { useBalanceStore } from '@/stores/b_settlement/balance';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseButtonA from '@/components/BaseButtonA.vue';
import BaseModal from '@/components/BaseModal.vue';
import MailPreviewModal from '@/components/MailPreviewModal.vue';
const showMailModal = ref(false);
const showPreviewModal = ref(false);
const props = defineProps();
const balanceStore = useBalanceStore();
const sortBy = ref('nameAsc');
const pageSize = ref(20);
const pageSizeOptions = [20, 50, 100];
const currentPage = ref(1);
const totalPages = ref(1);
const selectedIds = ref([]); // ✅ 고침
// 단일 선택용 selectedUserId 따로 선언
const selectedUserId = ref(null);
function openMailPreviewModal(id) {
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
function toggleSelection(id) {
    const idx = selectedIds.value.indexOf(id);
    if (idx !== -1) {
        selectedIds.value.splice(idx, 1);
    }
    else {
        selectedIds.value.push(id);
    }
}
function isSelected(id) {
    return selectedIds.value.includes(id);
}
function fetchBalanceList(page = 1) {
    balanceStore
        .fetchBalanceList(props.selectedMonthId, page, sortBy.value, pageSize.value)
        .then((data) => {
        totalPages.value = data.totalPages;
        currentPage.value = page;
    });
}
function formatCurrency(val) {
    return new Intl.NumberFormat('ko-KR').format(val ?? 0);
}
function formatPercent(val) {
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
    }
    catch (e) {
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
watch(() => balanceStore.balanceList, (newVal) => {
    console.log('📦 balanceList 변경:', newVal);
});
onMounted(() => {
    fetchBalanceList(currentPage.value);
});
function refreshBalanceList() {
    fetchBalanceList(currentPage.value);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 space-y-4 h-full flex flex-col" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center h-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-xl font-bold" },
});
(props.selectedMonth);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.refreshBalanceList) },
    ...{ class: "text-sm text-blue-600 hover:underline" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
/** @type {[typeof BaseSelect, typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    modelValue: (__VLS_ctx.sortBy),
    ...{ class: "border rounded px-3 py-1 w-44" },
}));
const __VLS_1 = __VLS_0({
    modelValue: (__VLS_ctx.sortBy),
    ...{ class: "border rounded px-3 py-1 w-44" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "nameAsc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "nameDesc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "balanceAsc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "balanceDesc",
});
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
/** @type {[typeof BaseSelect, typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    modelValue: (__VLS_ctx.pageSize),
    ...{ class: "border rounded px-3 py-1 w-24" },
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.pageSize),
    ...{ class: "border rounded px-3 py-1 w-24" },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
for (const [size] of __VLS_getVForSourceType((__VLS_ctx.pageSizeOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (size),
        value: (size),
    });
    (size);
}
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "glow bg-white dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-y-auto max-h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "min-w-full divide-y divide-gray-200 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
    ...{ class: "bg-amber-200 dark:bg-green-700 sticky top-0 z-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "table-cell-style-r" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
if (__VLS_ctx.balanceStore.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        colspan: "12",
        ...{ class: "text-center py-4 text-gray-600" },
    });
}
else if (__VLS_ctx.balanceStore.hasError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        colspan: "12",
        ...{ class: "text-center py-4 text-red-600" },
    });
    (__VLS_ctx.balanceStore.error);
}
else if (__VLS_ctx.balanceStore.balanceList.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        colspan: "12",
        ...{ class: "text-center py-4 text-gray-400" },
    });
}
else {
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.balanceStore.balanceList))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (item.id),
            ...{ class: "bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-700" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (...[$event]) => {
                    if (!!(__VLS_ctx.balanceStore.loading))
                        return;
                    if (!!(__VLS_ctx.balanceStore.hasError))
                        return;
                    if (!!(__VLS_ctx.balanceStore.balanceList.length === 0))
                        return;
                    __VLS_ctx.toggleSelection(item.id);
                } },
            type: "checkbox",
            checked: (__VLS_ctx.isSelected(item.id)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (item.member);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (item.album);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (item.releaseDate || '-');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatCurrency(item.albumBalance));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatPercent(item.bespokeRate));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatCurrency(item.beforeOffset));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatCurrency(item.afterOffset));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatPercent(item.beforeAdvance));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatPercent(item.afterAdvance));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style" },
        });
        (__VLS_ctx.formatCurrency(item.partnerBalance));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-style-r" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.balanceStore.loading))
                        return;
                    if (!!(__VLS_ctx.balanceStore.hasError))
                        return;
                    if (!!(__VLS_ctx.balanceStore.balanceList.length === 0))
                        return;
                    __VLS_ctx.openMailPreviewModal(item.id);
                } },
            ...{ class: "text-lg text-center hover:text-blue-700" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 flex justify-center" },
});
/** @type {[typeof BasePagination, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(BasePagination, new BasePagination({
    ...{ 'onPageChanged': {} },
    currentPage: (__VLS_ctx.currentPage),
    totalPages: (__VLS_ctx.balanceStore.totalPages),
}));
const __VLS_7 = __VLS_6({
    ...{ 'onPageChanged': {} },
    currentPage: (__VLS_ctx.currentPage),
    totalPages: (__VLS_ctx.balanceStore.totalPages),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onPageChanged: (__VLS_ctx.fetchBalanceList)
};
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end w-64" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showMailModal = true;
        } },
    ...{ class: "bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50" },
    disabled: (__VLS_ctx.selectedIds.length === 0),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-center" },
});
/** @type {[typeof BaseButtonA, typeof BaseButtonA, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(BaseButtonA, new BaseButtonA({
    ...{ class: "border bg-gray-700 hover:bg-blue-800 text-white font-bold px-8 py-2 rounded transition-colors" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "border bg-gray-700 hover:bg-blue-800 text-white font-bold px-8 py-2 rounded transition-colors" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
if (__VLS_ctx.showMailModal) {
    /** @type {[typeof BaseModal, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(BaseModal, new BaseModal({
        ...{ 'onBackgroundClick': {} },
        title: "정산서 메일 전송",
        message: ('선택된 회원에게 정산서 메일을 일괄로 전송하시겠습니까?'),
        buttons: ([
            {
                text: '네',
                type: 'primary',
                onClick: async () => {
                    await __VLS_ctx.sendBatchMail();
                    __VLS_ctx.showMailModal = false;
                },
            },
            {
                text: '아니오',
                onClick: () => (__VLS_ctx.showMailModal = false),
            },
        ]),
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onBackgroundClick': {} },
        title: "정산서 메일 전송",
        message: ('선택된 회원에게 정산서 메일을 일괄로 전송하시겠습니까?'),
        buttons: ([
            {
                text: '네',
                type: 'primary',
                onClick: async () => {
                    await __VLS_ctx.sendBatchMail();
                    __VLS_ctx.showMailModal = false;
                },
            },
            {
                text: '아니오',
                onClick: () => (__VLS_ctx.showMailModal = false),
            },
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_19;
    let __VLS_20;
    let __VLS_21;
    const __VLS_22 = {
        onBackgroundClick: (...[$event]) => {
            if (!(__VLS_ctx.showMailModal))
                return;
            __VLS_ctx.showMailModal = false;
        }
    };
    var __VLS_18;
}
if (__VLS_ctx.showPreviewModal && __VLS_ctx.selectedUserId !== null) {
    /** @type {[typeof MailPreviewModal, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(MailPreviewModal, new MailPreviewModal({
        userId: (__VLS_ctx.selectedUserId),
        monthSettleId: (props.selectedMonthId),
        onSend: (__VLS_ctx.handleMailSent),
        onClose: (__VLS_ctx.closePreviewModal),
    }));
    const __VLS_24 = __VLS_23({
        userId: (__VLS_ctx.selectedUserId),
        monthSettleId: (props.selectedMonthId),
        onSend: (__VLS_ctx.handleMailSent),
        onClose: (__VLS_ctx.closePreviewModal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
}
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-44']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-24']} */ ;
/** @type {__VLS_StyleScopedClasses['glow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style-r']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-style-r']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['w-64']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseSelect: BaseSelect,
            BasePagination: BasePagination,
            BaseButtonA: BaseButtonA,
            BaseModal: BaseModal,
            MailPreviewModal: MailPreviewModal,
            showMailModal: showMailModal,
            showPreviewModal: showPreviewModal,
            balanceStore: balanceStore,
            sortBy: sortBy,
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            currentPage: currentPage,
            selectedIds: selectedIds,
            selectedUserId: selectedUserId,
            openMailPreviewModal: openMailPreviewModal,
            closePreviewModal: closePreviewModal,
            handleMailSent: handleMailSent,
            toggleSelection: toggleSelection,
            isSelected: isSelected,
            fetchBalanceList: fetchBalanceList,
            formatCurrency: formatCurrency,
            formatPercent: formatPercent,
            sendBatchMail: sendBatchMail,
            refreshBalanceList: refreshBalanceList,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BalanceTab.vue.js.map