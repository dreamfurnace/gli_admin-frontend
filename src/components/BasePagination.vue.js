import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const delta = 1;
const pageNumbers = computed(() => {
    const total = props.totalPages;
    const current = props.currentPage;
    const pages = [];
    if (total <= 5) {
        for (let i = 1; i <= total; i++)
            pages.push(i);
    }
    else {
        if (current <= delta + 1) {
            pages.push(1, 2, 3, '...', total);
        }
        else if (current >= total - delta) {
            pages.push(1, '...', total - 2, total - 1, total);
        }
        else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
    }
    return pages;
});
function emitPage(page) {
    if (page < 1 || page > props.totalPages)
        return;
    emit('page-change', page);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.totalPages > 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-2 items-center justify-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.totalPages > 1))
                    return;
                __VLS_ctx.emitPage(__VLS_ctx.currentPage - 1);
            } },
        disabled: (__VLS_ctx.currentPage === 1),
        ...{ class: "px-2 py-1 border rounded" },
        ...{ class: (__VLS_ctx.currentPage === 1
                ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 cursor-not-allowed'
                : 'hover:bg-emerald-100 hover:text-emerald-700') },
    });
    for (const [num] of __VLS_getVForSourceType((__VLS_ctx.pageNumbers))) {
        (num);
        if (typeof num === 'number') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.totalPages > 1))
                            return;
                        if (!(typeof num === 'number'))
                            return;
                        __VLS_ctx.emitPage(num);
                    } },
                disabled: (num === __VLS_ctx.currentPage),
                ...{ class: "px-2 py-1 rounded" },
                ...{ class: (num === __VLS_ctx.currentPage
                        ? 'bg-emerald-700 text-white font-bold cursor-default'
                        : 'hover:bg-emerald-100 hover:text-emerald-700') },
            });
            (num);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "px-2 py-1" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.totalPages > 1))
                    return;
                __VLS_ctx.emitPage(__VLS_ctx.currentPage + 1);
            } },
        disabled: (__VLS_ctx.currentPage === __VLS_ctx.totalPages),
        ...{ class: "px-2 py-1 border rounded" },
        ...{ class: (__VLS_ctx.currentPage === __VLS_ctx.totalPages
                ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 cursor-not-allowed'
                : 'hover:bg-emerald-100 hover:text-emerald-700') },
    });
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            pageNumbers: pageNumbers,
            emitPage: emitPage,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BasePagination.vue.js.map