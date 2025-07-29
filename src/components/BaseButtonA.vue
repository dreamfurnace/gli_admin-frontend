<!-- components/BaseButtonA.vue -->
<template>
    <!-- <button :class="computedClass" :disabled="!canClick" @click="$emit('click')"> -->
    <button :class="computedClass" @click="$emit('click')">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        canClick?: boolean;
    }>(),
    {
        canClick: true,
    }
);

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
</script>
