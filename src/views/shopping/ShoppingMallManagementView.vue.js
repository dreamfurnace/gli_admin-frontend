import { ref, computed, onMounted } from 'vue';
import ShoppingCategoriesManager from '@/components/shopping/ShoppingCategoriesManager.vue';
import ShoppingProductsManager from '@/components/shopping/ShoppingProductsManager.vue';
import ShoppingOrdersManager from '@/components/shopping/ShoppingOrdersManager.vue';
import { apiService } from '@/services/api';
// Tab management
const activeTab = ref('categories');
// Data counts
const categoriesCount = ref(0);
const productsCount = ref(0);
const ordersCount = ref(0);
const tabs = computed(() => [
    { id: 'categories', name: 'Categories', count: categoriesCount.value },
    { id: 'products', name: 'Products', count: productsCount.value },
    { id: 'orders', name: 'Orders', count: ordersCount.value },
]);
// Data loading methods
const loadCategoriesData = async () => {
    try {
        const categories = await apiService.getShoppingCategories();
        categoriesCount.value = categories.length;
    }
    catch (error) {
        console.error('Failed to load categories count:', error);
    }
};
const loadProductsData = async () => {
    try {
        const products = await apiService.getShoppingProducts();
        productsCount.value = products.length;
    }
    catch (error) {
        console.error('Failed to load products count:', error);
    }
};
const loadOrdersData = async () => {
    try {
        const orders = await apiService.getShoppingOrders();
        ordersCount.value = orders.length;
    }
    catch (error) {
        console.error('Failed to load orders count:', error);
    }
};
// Initialize
onMounted(async () => {
    await Promise.all([
        loadCategoriesData(),
        loadProductsData(),
        loadOrdersData(),
    ]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6 max-w-7xl mx-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-gray-900 dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600 dark:text-gray-400" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "flex space-x-8" },
    'aria-label': "Tabs",
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.tabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.id;
            } },
        key: (tab.id),
        ...{ class: ([
                __VLS_ctx.activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]) },
    });
    (tab.name);
    if (tab.count !== undefined) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs" },
        });
        (tab.count);
    }
}
if (__VLS_ctx.activeTab === 'categories') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof ShoppingCategoriesManager, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ShoppingCategoriesManager, new ShoppingCategoriesManager({
        ...{ 'onCategoryUpdated': {} },
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onCategoryUpdated': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onCategoryUpdated: (__VLS_ctx.loadCategoriesData)
    };
    var __VLS_2;
}
if (__VLS_ctx.activeTab === 'products') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof ShoppingProductsManager, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(ShoppingProductsManager, new ShoppingProductsManager({
        ...{ 'onProductUpdated': {} },
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onProductUpdated': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    let __VLS_12;
    const __VLS_13 = {
        onProductUpdated: (__VLS_ctx.loadProductsData)
    };
    var __VLS_9;
}
if (__VLS_ctx.activeTab === 'orders') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof ShoppingOrdersManager, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(ShoppingOrdersManager, new ShoppingOrdersManager({
        ...{ 'onOrderUpdated': {} },
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onOrderUpdated': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onOrderUpdated: (__VLS_ctx.loadOrdersData)
    };
    var __VLS_16;
}
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-8']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ShoppingCategoriesManager: ShoppingCategoriesManager,
            ShoppingProductsManager: ShoppingProductsManager,
            ShoppingOrdersManager: ShoppingOrdersManager,
            activeTab: activeTab,
            tabs: tabs,
            loadCategoriesData: loadCategoriesData,
            loadProductsData: loadProductsData,
            loadOrdersData: loadOrdersData,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ShoppingMallManagementView.vue.js.map