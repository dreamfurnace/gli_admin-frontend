import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const showErrorModal = ref(false);
const error = ref('');
const state = reactive({
    form: {
        username: '',
        password: '',
    },
    error: '',
    isLoading: false,
});
const handleSubmit = async () => {
    try {
        state.isLoading = true;
        state.error = '';
        await authStore.login(state.form);
        router.push(authStore.getInitialRoute());
    }
    catch (err) {
        if (err instanceof Error) {
            // 백엔드에서 전달된 에러 메시지를 그대로 사용
            state.error = err.message;
        }
        else {
            state.error = '알 수 없는 오류가 발생했습니다.';
        }
        showErrorModal.value = true;
    }
    finally {
        state.isLoading = false;
    }
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("fixed inset-0 bg-slate-50 dark:bg-slate-900 flex items-center justify-center") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("container mx-auto px-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex justify-center") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("w-full max-w-md") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("bg-white py-8 px-6 shadow rounded-lg") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("mb-8 text-center text-3xl font-bold text-gray-900") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
        ...{ class: ("space-y-6") },
    });
    if (__VLS_ctx.error) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("rounded-md bg-red-50 dark:bg-red-900/50 p-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex-shrink-0") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: ("h-5 w-5 text-red-400") },
            viewBox: ("0 0 20 20"),
            fill: ("currentColor"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.path)({
            'fill-rule': ("evenodd"),
            d: ("M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"),
            'clip-rule': ("evenodd"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("ml-3") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("text-sm font-medium text-red-800 dark:text-red-200") },
        });
        (__VLS_ctx.error);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("username"),
        ...{ class: ("block text-sm font-medium text-gray-700") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        id: ("username"),
        value: ((__VLS_ctx.state.form.username)),
        type: ("text"),
        required: (true),
        ...{ class: ("mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("password"),
        ...{ class: ("block text-sm font-medium text-gray-700") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        id: ("password"),
        type: ("password"),
        required: (true),
        ...{ class: ("mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500") },
    });
    (__VLS_ctx.state.form.password);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: ("submit"),
        disabled: ((__VLS_ctx.state.isLoading)),
        ...{ class: ("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500") },
    });
    (__VLS_ctx.state.isLoading ? 'Loading...' : 'Sign in');
    if (__VLS_ctx.state.error) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-red-500 text-sm text-center mt-2") },
        });
        (__VLS_ctx.state.error);
    }
    if (__VLS_ctx.showErrorModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-sm") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-white dark:bg-slate-800 w-full max-w-sm rounded-lg shadow-lg p-6") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex items-start mb-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex-shrink-0") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: ("h-6 w-6 text-red-400") },
            fill: ("none"),
            viewBox: ("0 0 24 24"),
            stroke: ("currentColor"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.path)({
            'stroke-linecap': ("round"),
            'stroke-linejoin': ("round"),
            'stroke-width': ("2"),
            d: ("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("ml-3 w-0 flex-1") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("text-lg font-medium text-slate-900 dark:text-slate-100") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("mt-2 text-sm text-slate-500 dark:text-slate-400") },
        });
        (__VLS_ctx.state.error);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("ml-4 flex flex-shrink-0") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.showErrorModal)))
                        return;
                    __VLS_ctx.showErrorModal = false;
                } },
            ...{ class: ("inline-flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: ("h-5 w-5") },
            viewBox: ("0 0 20 20"),
            fill: ("currentColor"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.path)({
            'fill-rule': ("evenodd"),
            d: ("M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"),
            'clip-rule': ("evenodd"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("mt-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.showErrorModal)))
                        return;
                    __VLS_ctx.showErrorModal = false;
                } },
            ...{ class: ("w-full inline-flex justify-center rounded-md border border-transparent bg-emerald-600 dark:bg-emerald-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:text-sm") },
        });
    }
    ['fixed', 'inset-0', 'bg-slate-50', 'dark:bg-slate-900', 'flex', 'items-center', 'justify-center', 'container', 'mx-auto', 'px-4', 'flex', 'justify-center', 'w-full', 'max-w-md', 'bg-white', 'py-8', 'px-6', 'shadow', 'rounded-lg', 'mb-8', 'text-center', 'text-3xl', 'font-bold', 'text-gray-900', 'space-y-6', 'rounded-md', 'bg-red-50', 'dark:bg-red-900/50', 'p-4', 'flex', 'flex-shrink-0', 'h-5', 'w-5', 'text-red-400', 'ml-3', 'text-sm', 'font-medium', 'text-red-800', 'dark:text-red-200', 'block', 'text-sm', 'font-medium', 'text-gray-700', 'mt-1', 'block', 'w-full', 'rounded-md', 'border', 'border-gray-300', 'px-3', 'py-2', 'text-black', 'placeholder-gray-400', 'focus:border-indigo-500', 'focus:outline-none', 'focus:ring-indigo-500', 'block', 'text-sm', 'font-medium', 'text-gray-700', 'mt-1', 'block', 'w-full', 'rounded-md', 'border', 'border-gray-300', 'px-3', 'py-2', 'text-black', 'placeholder-gray-400', 'focus:border-indigo-500', 'focus:outline-none', 'focus:ring-indigo-500', 'w-full', 'flex', 'justify-center', 'py-2', 'px-4', 'border', 'border-transparent', 'rounded-md', 'shadow-sm', 'text-sm', 'font-medium', 'text-white', 'bg-indigo-600', 'hover:bg-indigo-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-indigo-500', 'text-red-500', 'text-sm', 'text-center', 'mt-2', 'fixed', 'inset-0', 'bg-slate-900/50', 'flex', 'items-center', 'justify-center', 'p-4', 'backdrop-blur-sm', 'bg-white', 'dark:bg-slate-800', 'w-full', 'max-w-sm', 'rounded-lg', 'shadow-lg', 'p-6', 'flex', 'items-start', 'mb-4', 'flex-shrink-0', 'h-6', 'w-6', 'text-red-400', 'ml-3', 'w-0', 'flex-1', 'text-lg', 'font-medium', 'text-slate-900', 'dark:text-slate-100', 'mt-2', 'text-sm', 'text-slate-500', 'dark:text-slate-400', 'ml-4', 'flex', 'flex-shrink-0', 'inline-flex', 'text-slate-400', 'hover:text-slate-500', 'dark:text-slate-500', 'dark:hover:text-slate-400', 'h-5', 'w-5', 'mt-4', 'w-full', 'inline-flex', 'justify-center', 'rounded-md', 'border', 'border-transparent', 'bg-emerald-600', 'dark:bg-emerald-700', 'px-4', 'py-2', 'text-base', 'font-medium', 'text-white', 'shadow-sm', 'hover:bg-emerald-700', 'dark:hover:bg-emerald-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-emerald-500', 'focus:ring-offset-2', 'sm:text-sm',];
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
            showErrorModal: showErrorModal,
            error: error,
            state: state,
            handleSubmit: handleSubmit,
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
//# sourceMappingURL=LoginView.vue.js.map