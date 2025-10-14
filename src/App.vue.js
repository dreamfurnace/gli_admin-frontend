import { onMounted, ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';
import Web3Provider from '@/components/Web3Provider.vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const initialized = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);
// const isDev = ref(true);
// const isDev = ref(false);
const isDev = ref(import.meta.env.MODE === 'development');
onMounted(async () => {
    console.log('GLI Admin App mounted');
    if (!initialized.value) {
        await authStore.initializeAuth();
        initialized.value = true;
    }
});
console.log('🔥 GLI Admin Environment:', import.meta.env.MODE);
console.log('🌐 GLI API Server:', import.meta.env.VITE_API_BASE);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof Web3Provider, typeof Web3Provider, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Web3Provider, new Web3Provider({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-container bg-gray-50 dark:bg-gray-900" },
});
if (!__VLS_ctx.isAuthenticated) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_3 = {}.RouterView;
    /** @type {[typeof __VLS_components.RouterView, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
    const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex w-full fixed-layout" },
    });
    /** @type {[typeof AdminSidebar, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(AdminSidebar, new AdminSidebar({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "flex-1 p-4 overflow-auto" },
    });
    if (__VLS_ctx.isDev) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "debug-info p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-blue-800" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.isAuthenticated);
        (__VLS_ctx.authStore.user?.username);
        (__VLS_ctx.authStore.user?.grade?.name || 'Loading...');
    }
    const __VLS_10 = {}.RouterView;
    /** @type {[typeof __VLS_components.RouterView, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({}));
    const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['debug-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterView: RouterView,
            AdminSidebar: AdminSidebar,
            Web3Provider: Web3Provider,
            authStore: authStore,
            isAuthenticated: isAuthenticated,
            isDev: isDev,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map