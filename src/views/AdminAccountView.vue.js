import { onMounted, ref, computed } from 'vue';
import { useAdminManagementStore } from '@/stores/adminManagement';
const store = useAdminManagementStore();
const showDetailModal = ref(false);
const selectedGrade = ref(null);
const grades = ref([
    { id: 1, name: '슈퍼 관리자' },
    { id: 2, name: '일반 관리자' },
]);
onMounted(async () => {
    await store.fetchAdminUsers();
});
const sortedAdminUsers = computed(() => {
    return [...store.adminUsers].sort((a, b) => a.username.localeCompare(b.username));
});
const openDetailModal = async (admin) => {
    await store.fetchAdminDetail(admin.id);
    if (store.selectedAdmin) {
        selectedGrade.value = store.selectedAdmin.grade.id;
    }
    showDetailModal.value = true;
};
const closeDetailModal = () => {
    showDetailModal.value = false;
    store.selectedAdmin = null;
    selectedGrade.value = null;
};
const toggleAdminStatus = async (admin) => {
    try {
        await store.updateAdminUser(admin.id, {
            grade_id: admin.grade.id,
            is_active: !admin.is_active,
        });
    }
    catch (error) {
        console.error('Failed to toggle admin status:', error);
    }
};
const saveChanges = async () => {
    if (!store.selectedAdmin || !selectedGrade.value)
        return;
    // 변경사항이 있는지 체크
    const hasChanges = selectedGrade.value !== store.selectedAdmin.grade.id ||
        store.selectedAdmin.is_active !== store.selectedAdmin.is_active;
    // 변경사항이 없으면 그냥 모달만 닫기
    if (!hasChanges) {
        closeDetailModal();
        return;
    }
    try {
        await store.updateAdminUser(store.selectedAdmin.id, {
            grade_id: selectedGrade.value,
            is_active: store.selectedAdmin.is_active,
        });
        closeDetailModal();
    }
    catch (error) {
        console.error('Failed to save changes:', error);
    }
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("p-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("text-2xl font-bold mb-6") },
    });
    if (__VLS_ctx.store.error) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("font-medium") },
        });
        (__VLS_ctx.store.error);
        if (__VLS_ctx.store.error === '접근 권한이 없습니다.') {
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-sm mt-1") },
            });
        }
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
            ...{ class: ("bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-hidden") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
            ...{ class: ("min-w-full divide-y divide-gray-200") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
            ...{ class: ("bg-slate-200 dark:bg-slate-700") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: ("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({
            ...{ class: ("bg-slate-100 dark:bg-slate-800 divide-y divide-gray-200") },
        });
        for (const [admin] of __VLS_getVForSourceType((__VLS_ctx.sortedAdminUsers))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
                key: ((admin.id)),
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: ("px-6 py-4 whitespace-nowrap") },
            });
            (admin.username);
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: ("px-6 py-4 whitespace-nowrap") },
            });
            (admin.email);
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: ("px-6 py-4 whitespace-nowrap") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("px-2 inline-flex text-xs leading-5 font-semibold rounded-full") },
                ...{ class: ((admin.grade.name === '슈퍼 관리자'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800')) },
            });
            (admin.grade.name);
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: ("px-6 py-4 whitespace-nowrap") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("px-2 inline-flex text-xs leading-5 font-semibold rounded-full") },
                ...{ class: ((admin.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800')) },
            });
            (admin.is_active ? '활성' : '비활성');
            __VLS_elementAsFunction(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: ("px-6 py-4 whitespace-nowrap text-sm font-medium") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!((!__VLS_ctx.store.error && !__VLS_ctx.store.loading)))
                            return;
                        __VLS_ctx.openDetailModal(admin);
                    } },
                ...{ class: ("text-emerald-600 hover:text-emerald-900 mr-3") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!((!__VLS_ctx.store.error && !__VLS_ctx.store.loading)))
                            return;
                        __VLS_ctx.toggleAdminStatus(admin);
                    } },
                ...{ class: ((admin.is_active
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900')) },
            });
            (admin.is_active ? '비활성화' : '활성화');
        }
    }
    if (__VLS_ctx.showDetailModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-slate-50 dark:bg-slate-900") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex justify-between items-center mb-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("text-lg font-medium") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.closeDetailModal) },
            ...{ class: ("text-gray-400 hover:text-gray-500") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("text-2xl") },
        });
        if (__VLS_ctx.store.selectedAdmin) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("mt-2") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("grid grid-cols-2 gap-4") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("col-span-2 sm:col-span-1") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: ("block text-base font-bold text-slate-700 dark:text-slate-300") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500") },
            });
            (__VLS_ctx.store.selectedAdmin.username);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("col-span-2 sm:col-span-1") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: ("block text-base font-bold text-slate-700 dark:text-slate-300") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500") },
            });
            (__VLS_ctx.store.selectedAdmin.email);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("col-span-2 sm:col-span-1") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: ("block text-base font-bold text-slate-700 dark:text-slate-300") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500") },
            });
            (__VLS_ctx.store.selectedAdmin.last_name);
            (__VLS_ctx.store.selectedAdmin.first_name);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("col-span-2 sm:col-span-1") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: ("block text-base font-bold text-slate-700 dark:text-slate-300") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
                value: ((__VLS_ctx.selectedGrade)),
                ...{ class: ("mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-slate-200 dark:bg-slate-700") },
            });
            for (const [grade] of __VLS_getVForSourceType((__VLS_ctx.grades))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                    key: ((grade.id)),
                    value: ((grade.id)),
                });
                (grade.name);
            }
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("col-span-2") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: ("block text-base font-bold text-slate-700 dark:text-slate-300") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("mt-1 text-sm text-slate-900 dark:text-slate-100 pl-2 border-l-2 border-emerald-500") },
            });
            (__VLS_ctx.store.selectedAdmin.last_login_ip || '없음');
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("mt-4 flex justify-end space-x-3") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.closeDetailModal) },
                ...{ class: ("bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.saveChanges) },
                ...{ class: ("bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500") },
            });
        }
    }
    ['p-4', 'text-2xl', 'font-bold', 'mb-6', 'bg-red-100', 'dark:bg-red-900', 'border', 'border-red-400', 'dark:border-red-700', 'text-red-700', 'dark:text-red-100', 'px-4', 'py-3', 'rounded', 'font-medium', 'text-sm', 'mt-1', 'flex', 'justify-center', 'items-center', 'h-32', 'animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-emerald-500', 'bg-slate-100', 'dark:bg-slate-800', 'rounded-lg', 'shadow', 'overflow-hidden', 'min-w-full', 'divide-y', 'divide-gray-200', 'bg-slate-200', 'dark:bg-slate-700', 'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'bg-slate-100', 'dark:bg-slate-800', 'divide-y', 'divide-gray-200', 'px-6', 'py-4', 'whitespace-nowrap', 'px-6', 'py-4', 'whitespace-nowrap', 'px-6', 'py-4', 'whitespace-nowrap', 'px-2', 'inline-flex', 'text-xs', 'leading-5', 'font-semibold', 'rounded-full', 'px-6', 'py-4', 'whitespace-nowrap', 'px-2', 'inline-flex', 'text-xs', 'leading-5', 'font-semibold', 'rounded-full', 'px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium', 'text-emerald-600', 'hover:text-emerald-900', 'mr-3', 'fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'relative', 'top-20', 'mx-auto', 'p-5', 'border', 'w-full', 'max-w-2xl', 'shadow-lg', 'rounded-md', 'bg-slate-50', 'dark:bg-slate-900', 'flex', 'justify-between', 'items-center', 'mb-4', 'text-lg', 'font-medium', 'text-gray-400', 'hover:text-gray-500', 'text-2xl', 'mt-2', 'grid', 'grid-cols-2', 'gap-4', 'col-span-2', 'sm:col-span-1', 'block', 'text-base', 'font-bold', 'text-slate-700', 'dark:text-slate-300', 'mt-1', 'text-sm', 'text-slate-900', 'dark:text-slate-100', 'pl-2', 'border-l-2', 'border-emerald-500', 'col-span-2', 'sm:col-span-1', 'block', 'text-base', 'font-bold', 'text-slate-700', 'dark:text-slate-300', 'mt-1', 'text-sm', 'text-slate-900', 'dark:text-slate-100', 'pl-2', 'border-l-2', 'border-emerald-500', 'col-span-2', 'sm:col-span-1', 'block', 'text-base', 'font-bold', 'text-slate-700', 'dark:text-slate-300', 'mt-1', 'text-sm', 'text-slate-900', 'dark:text-slate-100', 'pl-2', 'border-l-2', 'border-emerald-500', 'col-span-2', 'sm:col-span-1', 'block', 'text-base', 'font-bold', 'text-slate-700', 'dark:text-slate-300', 'mt-1', 'block', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-base', 'border-gray-300', 'focus:outline-none', 'focus:ring-emerald-500', 'focus:border-emerald-500', 'sm:text-sm', 'rounded-md', 'bg-slate-200', 'dark:bg-slate-700', 'col-span-2', 'block', 'text-base', 'font-bold', 'text-slate-700', 'dark:text-slate-300', 'mt-1', 'text-sm', 'text-slate-900', 'dark:text-slate-100', 'pl-2', 'border-l-2', 'border-emerald-500', 'mt-4', 'flex', 'justify-end', 'space-x-3', 'bg-white', 'py-2', 'px-4', 'border', 'border-gray-300', 'rounded-md', 'shadow-sm', 'text-sm', 'font-medium', 'text-gray-700', 'hover:bg-gray-50', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-emerald-500', 'bg-emerald-600', 'py-2', 'px-4', 'border', 'border-transparent', 'rounded-md', 'shadow-sm', 'text-sm', 'font-medium', 'text-white', 'hover:bg-emerald-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-emerald-500',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
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
            store: store,
            showDetailModal: showDetailModal,
            selectedGrade: selectedGrade,
            grades: grades,
            sortedAdminUsers: sortedAdminUsers,
            openDetailModal: openDetailModal,
            closeDetailModal: closeDetailModal,
            toggleAdminStatus: toggleAdminStatus,
            saveChanges: saveChanges,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AdminAccountView.vue.js.map