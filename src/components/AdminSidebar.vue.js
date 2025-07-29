import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import logoImg from '/img/logo/logo.png';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const userInfo = computed(() => authStore.user);
const isMinimized = ref(false);
const expandedMenus = ref([]);
const handleLogout = async () => {
    try {
        await authStore.logout();
        router.push('/login');
    }
    catch (error) {
        console.error('로그아웃 실패:', error);
    }
};
const menuItems = [
    { icon: '👁️', title: '관리자 관리', path: '/admin' },
    { icon: '💰', title: '정산수행 관리', path: '/settlement' },
    {
        icon: '🧮',
        title: '계산로직 관리',
        path: '/calculation',
        children: [
            { title: '블랭체크 로직', path: '/calculation/blanchk' },
            { title: '원천세 로직(개인 회원 대상)', path: '/calculation/withholding' },
            { title: '부가세 로직(법인 회원 대상)', path: '/calculation/vat' },
        ],
    },
    { icon: '👤', title: '회원정보 관리', path: '/members' },
    {
        icon: '💽',
        title: '앨범&기획사정보 관리',
        path: '/albums',
        children: [
            { title: '앨범 관리', path: '/albums/albums' },
            { title: '기획사 관리', path: '/albums/agencies' },
        ],
    },
    {
        icon: '🛠️',
        title: '사이트 관리',
        path: '/site',
        children: [
            { title: '장르목록 관리', path: '/site/genres' },
            { title: '공지 & FAQ 등록', path: '/site/notice' },
            { title: '정산양식 등록', path: '/site/settlement-form' },
            { title: '메일 설정', path: '/site/mail-settings' },
        ],
    },
    {
        icon: '📊',
        title: '통계 조회분석',
        path: '/statistics',
        children: [
            { title: '통계 메인', path: '/statistics/main' },
            { title: '회원별 누적 정산액', path: '/statistics/accumulated' },
            { title: '정산 RAW/Pivot', path: '/statistics/settlement' },
            { title: '메일 전송 이력', path: '/statistics/mail-history' },
            { title: '방문자수 통계', path: '/statistics/visitors' },
        ],
    },
];
const toggleSidebar = () => {
    isMinimized.value = !isMinimized.value;
    if (isMinimized.value) {
        expandedMenus.value = [];
    }
};
const findParentMenu = (currentPath) => {
    return menuItems.find((item) => item.children?.some((child) => child.path === currentPath));
};
const handleMenuClick = (item) => {
    if (item.children) {
        const index = expandedMenus.value.indexOf(item.path);
        if (index === -1) {
            expandedMenus.value.push(item.path);
        }
        else {
            expandedMenus.value.splice(index, 1);
        }
        // 항상 첫 번째 하위 메뉴로 라우팅
        router.push(item.children[0].path);
    }
};
const getRouterLink = (item) => {
    return item.children ? item.children[0].path : item.path;
};
const isActiveMenu = (item) => {
    if (item.children) {
        return item.children.some((child) => route.path === child.path);
    }
    return route.path === item.path;
};
// 현재 경로에 해당하는 상위 메뉴를 자동으로 확장
onMounted(() => {
    const parentMenu = findParentMenu(route.path);
    if (parentMenu && !expandedMenus.value.includes(parentMenu.path)) {
        expandedMenus.value.push(parentMenu.path);
    }
});
// 라우트 변경 시 해당하는 상위 메뉴 자동 확장
watch(() => route.path, (newPath) => {
    const parentMenu = findParentMenu(newPath);
    if (parentMenu && !expandedMenus.value.includes(parentMenu.path)) {
        expandedMenus.value.push(parentMenu.path);
    }
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: (([
                'flex flex-col h-screen bg-slate-50 transition-all duration-300 dark:bg-slate-800',
                __VLS_ctx.isMinimized ? 'w-16 min-w-[4rem]' : 'w-64 min-w-[14rem]',
            ])) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex flex-col justify-between items-center p-4 bg-slate-800 text-white") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex flex-row items-center") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
        src: ((__VLS_ctx.logoImg)),
        alt: ("로고"),
        ...{ class: ("w-12 object-contain bg-white rounded") },
    });
    if (!__VLS_ctx.isMinimized) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("ml-2 font-medium") },
        });
    }
    if (!__VLS_ctx.isMinimized) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: ("text-xl font-bold my-2") },
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (__VLS_ctx.toggleSidebar) },
        ...{ class: ("w-full cursor-pointer self-end hover:text-green-400") },
        ...{ class: ((__VLS_ctx.isMinimized ? 'text-center' : 'text-right')) },
    });
    (__VLS_ctx.isMinimized ? '▶︎' : '◀︎');
    if (!__VLS_ctx.isMinimized) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded p-3 m-2") },
        });
        if (__VLS_ctx.userInfo) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("space-y-1") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("flex items-center justify-between") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("text-sm font-medium text-slate-900 dark:text-white") },
            });
            (__VLS_ctx.userInfo.username);
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.handleLogout) },
                ...{ class: ("text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-xs text-slate-500 dark:text-slate-400 truncate") },
            });
            (__VLS_ctx.userInfo.email);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("text-xs font-medium") },
                ...{ class: ((__VLS_ctx.userInfo?.grade?.name === '슈퍼 관리자'
                        ? 'text-purple-800 dark:text-purple-400'
                        : 'text-emerald-600 dark:text-emerald-400')) },
            });
            (__VLS_ctx.userInfo?.grade?.name || '등급 없음');
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("text-center text-slate-700 dark:text-white") },
            });
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: ("menu flex-1 overflow-y-auto") },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.menuItems))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: ((item.path)),
            ...{ class: ("menu-item") },
        });
        const __VLS_0 = {}.RouterLink;
        /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onClick': {} },
            to: ((__VLS_ctx.getRouterLink(item))),
            ...{ class: ("flex items-center p-3 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors duration-200") },
            ...{ class: (({
                    'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.isActiveMenu(item),
                    'justify-center': __VLS_ctx.isMinimized,
                })) },
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onClick': {} },
            to: ((__VLS_ctx.getRouterLink(item))),
            ...{ class: ("flex items-center p-3 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors duration-200") },
            ...{ class: (({
                    'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.isActiveMenu(item),
                    'justify-center': __VLS_ctx.isMinimized,
                })) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_6;
        const __VLS_7 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleMenuClick(item);
            }
        };
        let __VLS_3;
        let __VLS_4;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("icon") },
            ...{ class: (({ 'mr-3': !__VLS_ctx.isMinimized })) },
        });
        (item.icon);
        if (!__VLS_ctx.isMinimized) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("font-medium") },
            });
            (item.title);
        }
        if (!__VLS_ctx.isMinimized && item.children) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("ml-auto") },
            });
            (__VLS_ctx.expandedMenus.includes(item.path) ? '▼' : '▶');
        }
        __VLS_5.slots.default;
        var __VLS_5;
        if (!__VLS_ctx.isMinimized && item.children && __VLS_ctx.expandedMenus.includes(item.path)) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("pl-8 space-y-0.5") },
            });
            for (const [child] of __VLS_getVForSourceType((item.children))) {
                const __VLS_8 = {}.RouterLink;
                /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
                // @ts-ignore
                const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                    key: ((child.path)),
                    to: ((child.path)),
                    ...{ class: ("flex items-center py-1.5 px-3 text-sm text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors duration-200") },
                    ...{ class: (({
                            'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.$route.path === child.path,
                        })) },
                }));
                const __VLS_10 = __VLS_9({
                    key: ((child.path)),
                    to: ((child.path)),
                    ...{ class: ("flex items-center py-1.5 px-3 text-sm text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors duration-200") },
                    ...{ class: (({
                            'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.$route.path === child.path,
                        })) },
                }, ...__VLS_functionalComponentArgsRest(__VLS_9));
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: ("text-slate-400 mr-2") },
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: ("font-medium") },
                });
                (child.title);
                __VLS_13.slots.default;
                var __VLS_13;
            }
        }
    }
    ['flex', 'flex-col', 'h-screen', 'bg-slate-50', 'transition-all', 'duration-300', 'dark:bg-slate-800', 'flex', 'flex-col', 'justify-between', 'items-center', 'p-4', 'bg-slate-800', 'text-white', 'flex', 'flex-row', 'items-center', 'w-12', 'object-contain', 'bg-white', 'rounded', 'ml-2', 'font-medium', 'text-xl', 'font-bold', 'my-2', 'w-full', 'cursor-pointer', 'self-end', 'hover:text-green-400', 'bg-white', 'dark:bg-slate-700', 'shadow-sm', 'border', 'border-slate-200', 'dark:border-slate-600', 'rounded', 'p-3', 'm-2', 'space-y-1', 'flex', 'items-center', 'justify-between', 'text-sm', 'font-medium', 'text-slate-900', 'dark:text-white', 'text-xs', 'text-slate-500', 'hover:text-red-500', 'dark:text-slate-400', 'dark:hover:text-red-400', 'text-xs', 'text-slate-500', 'dark:text-slate-400', 'truncate', 'text-xs', 'font-medium', 'text-center', 'text-slate-700', 'dark:text-white', 'menu', 'flex-1', 'overflow-y-auto', 'menu-item', 'flex', 'items-center', 'p-3', 'text-emerald-700', 'hover:bg-emerald-50', 'dark:text-emerald-400', 'dark:hover:bg-slate-700', 'transition-colors', 'duration-200', 'bg-emerald-100', 'text-emerald-800', 'dark:bg-slate-600', 'dark:text-emerald-300', 'justify-center', 'icon', 'mr-3', 'font-medium', 'ml-auto', 'pl-8', 'space-y-0.5', 'flex', 'items-center', 'py-1.5', 'px-3', 'text-sm', 'text-slate-600', 'hover:bg-emerald-50', 'dark:text-slate-300', 'dark:hover:bg-slate-700', 'transition-colors', 'duration-200', 'bg-emerald-100', 'text-emerald-800', 'dark:bg-slate-600', 'dark:text-emerald-300', 'text-slate-400', 'mr-2', 'font-medium',];
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
            logoImg: logoImg,
            userInfo: userInfo,
            isMinimized: isMinimized,
            expandedMenus: expandedMenus,
            handleLogout: handleLogout,
            menuItems: menuItems,
            toggleSidebar: toggleSidebar,
            handleMenuClick: handleMenuClick,
            getRouterLink: getRouterLink,
            isActiveMenu: isActiveMenu,
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
//# sourceMappingURL=AdminSidebar.vue.js.map