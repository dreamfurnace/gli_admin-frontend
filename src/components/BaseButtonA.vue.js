import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    canClick: true,
});
const computedClass = computed(() => {
    if (!props.canClick) {
        return `
      px-8 py-2 rounded border-2 font-bold
      bg-gray-600 border-gray-600 text-gray-400
      hover:bg-gray-500 hover:border-gray-700 hover:text-white
      dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400
      dark:hover:bg-gray-500 dark:hover:text-white dark:hover:border-white
      cursor-not-allowed
    `;
    }
    return `
    px-8 py-2 rounded border-2 font-bold
    text-white bg-blue-700 border-blue-700
    hover:bg-blue-500 hover:border-blue-900
    dark:bg-blue-800 dark:border-blue-800
    dark:hover:bg-blue-700 dark:hover:border-white
  `;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    canClick: true,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('click');
        } },
    ...{ class: (__VLS_ctx.computedClass) },
});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            computedClass: computedClass,
        };
    },
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BaseButtonA.vue.js.map