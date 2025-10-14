import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import logoImg from "/img/logo/logo.png";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const userInfo = computed(() => {
    try {
        return authStore.user;
    }
    catch (error) {
        console.error("Error accessing authStore.user:", error);
        return null;
    }
});
const isMinimized = ref(false);
// Simplified dark mode implementation to avoid @vueuse/core issues
const isDark = ref(false);
const toggleDark = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("admin-theme", isDark.value ? "dark" : "light");
};
// Initialize dark mode from localStorage
onMounted(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme === "dark") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
    }
});
const handleLogout = async () => {
    try {
        await authStore.logout();
        router.push("/login");
    }
    catch (error) {
        console.error("로그아웃 실패:", error);
    }
};
const menuItems = [
    { icon: "🏠", title: "대시보드", path: "/admin" },
    { icon: "🔐", title: "관리자 관리", path: "/admin-management" },
    {
        icon: "📄",
        title: "사업소개-콘텐츠 관리",
        path: "/business",
        children: [
            { title: "🎯 프로젝트 소개", path: "/business/project" },
            { title: "👥 팀 구성원", path: "/business/team" },
            { title: "📊 전략 로드맵", path: "/business/strategy" },
            { title: "🗓️ 개발 일정", path: "/business/schedule" },
            { title: "🪙 토큰 에코시스템", path: "/business/token-ecosystem" },
        ],
    },
    {
        icon: "👥",
        title: "회원 관리",
        path: "/members",
        children: [
            { title: "회원 목록", path: "/members/list" },
            { title: "인증 상태", path: "/members/auth-status" },
            { title: "거래 모니터링", path: "/members/transactions" },
        ],
    },
    {
        icon: "🪙",
        title: "토큰 관리",
        path: "/tokens",
        children: [
            { title: "토큰 사용처", path: "/tokens/usage" },
            { title: "배포 계획", path: "/tokens/distribution" },
            { title: "GLIB/GLID 관리", path: "/tokens/management" },
        ],
    },
    {
        icon: "🔗",
        title: "Web3 통합",
        path: "/web3",
        children: [
            { title: "블록체인 운영", path: "/web3/operations" },
            { title: "스마트 계약", path: "/web3/contracts" },
            { title: "토큰 전송", path: "/web3/transfers" },
        ],
    },
    {
        icon: "📊",
        title: "분석 & 보고서",
        path: "/analytics",
        children: [
            { title: "플랫폼 통계", path: "/analytics/platform" },
            { title: "토큰 분석", path: "/analytics/tokens" },
            { title: "사용자 활동", path: "/analytics/activity" },
        ],
    },
    {
        icon: "⚙️",
        title: "시스템 설정",
        path: "/settings",
        children: [
            { title: "API 설정", path: "/settings/api" },
            { title: "시스템 로그", path: "/settings/logs" },
            { title: "백업 & 복구", path: "/settings/backup" },
        ],
    },
];
// const expandedMenus = ref<string[]>([]);
// 임시로 모든 하위 메뉴 expended
const expandedMenus = ref(menuItems.map((item) => item.path));
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
        const isActive = expandedMenus.value.includes(item.path);
        const isOnChildRoute = item.children.some((child) => route.path === child.path);
        if (isActive) {
            // 닫기
            expandedMenus.value = expandedMenus.value.filter((p) => p !== item.path);
        }
        else {
            // 열기
            expandedMenus.value.push(item.path);
            // 현재 경로가 이 하위 메뉴 중 하나가 아니면 첫 번째 자식으로 이동
            if (!isOnChildRoute) {
                router.push(item.children[0].path);
            }
        }
    }
    else {
        // 단일 메뉴일 경우
        router.push(item.path);
    }
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ([
            'flex flex-col h-screen bg-slate-200 dark:bg-slate-800 transition-all duration-300 shadow-xl',
            __VLS_ctx.isMinimized ? 'w-16 min-w-[4rem]' : 'w-64 min-w-[14rem]',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDark();
        } },
    ...{ class: "fixed bottom-2 left-2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-50 transition-colors duration-200 bg-slate-600 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500" },
});
(__VLS_ctx.isDark ? "🌙" : "☀️");
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col justify-between items-center p-4 bg-blue-600 dark:bg-blue-800" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-row items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.logoImg),
    alt: "GLI Logo",
    ...{ class: "w-12 p-1 object-contain bg-white rounded" },
});
if (!__VLS_ctx.isMinimized) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "ml-2 font-medium text-white" },
    });
}
if (!__VLS_ctx.isMinimized) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-bold my-2 text-white" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onClick: (__VLS_ctx.toggleSidebar) },
    ...{ class: "w-full cursor-pointer self-end text-white hover:text-green-400" },
    ...{ class: (__VLS_ctx.isMinimized ? 'text-center' : 'text-right') },
});
(__VLS_ctx.isMinimized ? "▶︎" : "◀︎");
if (!__VLS_ctx.isMinimized) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded p-3 m-2" },
    });
    if (__VLS_ctx.userInfo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm font-medium" },
        });
        (__VLS_ctx.userInfo.username);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-slate-500 dark:text-slate-400 truncate" },
        });
        (__VLS_ctx.userInfo.email);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-xs font-medium" },
            ...{ class: (__VLS_ctx.userInfo?.membership_level === 'vip' ||
                    __VLS_ctx.userInfo?.grade?.name === 'Super Admin'
                    ? 'text-purple-800 dark:text-purple-400'
                    : 'text-emerald-600 dark:text-emerald-400') },
        });
        (__VLS_ctx.userInfo?.grade?.name || __VLS_ctx.userInfo?.membership_level || "No Grade");
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "menu flex-1 overflow-y-auto" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.menuItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.path),
        ...{ class: "font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleMenuClick(item);
            } },
        ...{ class: "flex items-center p-3 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors duration-200" },
        ...{ class: ({
                'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.isActiveMenu(item),
                'justify-center': __VLS_ctx.isMinimized,
            }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "icon" },
        ...{ class: ({ 'mr-3': !__VLS_ctx.isMinimized }) },
    });
    (item.icon);
    if (!__VLS_ctx.isMinimized) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.title);
    }
    if (!__VLS_ctx.isMinimized && item.children) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ml-auto" },
        });
        (__VLS_ctx.expandedMenus.includes(item.path) ? "◀︎" : "▼");
    }
    if (!__VLS_ctx.isMinimized && item.children && __VLS_ctx.expandedMenus.includes(item.path)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pl-8 space-y-0.5" },
        });
        for (const [child] of __VLS_getVForSourceType((item.children))) {
            const __VLS_0 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
                key: (child.path),
                to: (child.path),
                ...{ class: "flex items-center py-1.5 px-3 text-m hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors duration-200" },
                ...{ class: ({
                        'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.$route.path === child.path,
                    }) },
            }));
            const __VLS_2 = __VLS_1({
                key: (child.path),
                to: (child.path),
                ...{ class: "flex items-center py-1.5 px-3 text-m hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors duration-200" },
                ...{ class: ({
                        'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300': __VLS_ctx.$route.path === child.path,
                    }) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            __VLS_3.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-slate-400 mr-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-medium" },
            });
            (child.title);
            var __VLS_3;
        }
    }
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['self-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['m-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['menu']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-emerald-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-emerald-300']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-emerald-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            logoImg: logoImg,
            userInfo: userInfo,
            isMinimized: isMinimized,
            isDark: isDark,
            toggleDark: toggleDark,
            handleLogout: handleLogout,
            menuItems: menuItems,
            expandedMenus: expandedMenus,
            toggleSidebar: toggleSidebar,
            handleMenuClick: handleMenuClick,
            isActiveMenu: isActiveMenu,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AdminSidebar.vue.js.map