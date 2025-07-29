import { onMounted, ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';
import { useAuthStore } from '@/stores/auth';
import { useSidebarStore } from '@/stores/sidebar';
const sidebarStore = useSidebarStore();
const isMinimized = computed(() => sidebarStore.isMinimized);
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isDev = ref(import.meta.env.MODE === 'development');
const toggleSidebar = () => {
    sidebarStore.setMinimized(!isMinimized.value);
};
onMounted(async () => {
    console.log('App mounted');
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("app-container bg-white dark:bg-slate-900") },
    });
    if (!__VLS_ctx.isAuthenticated) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_0 = {}.RouterView;
        /** @type { [typeof __VLS_components.RouterView, ] } */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
        const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex w-full fixed-layout") },
        });
        // @ts-ignore
        /** @type { [typeof AdminSidebar, ] } */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(AdminSidebar, new AdminSidebar({}));
        const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
        __VLS_elementAsFunction(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
            ...{ class: ("flex-1 p-4 overflow-auto") },
        });
        if (__VLS_ctx.isDev) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("debug-info p-4") },
                ...{ style: ({}) },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
            (__VLS_ctx.isAuthenticated);
            (__VLS_ctx.authStore.user?.username);
            (__VLS_ctx.authStore.user?.grade?.name || '불러오는 중...');
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        }
        const __VLS_11 = {}.RouterView;
        /** @type { [typeof __VLS_components.RouterView, ] } */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
        const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
    }
    ['app-container', 'bg-white', 'dark:bg-slate-900', 'flex', 'w-full', 'fixed-layout', 'flex-1', 'p-4', 'overflow-auto', 'debug-info', 'p-4',];
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
            RouterView: RouterView,
            AdminSidebar: AdminSidebar,
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