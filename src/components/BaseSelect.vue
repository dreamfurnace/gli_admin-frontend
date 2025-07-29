<template>
    <select
        v-bind="$attrs"
        :value="modelValue"
        @change="onChange"
        @input="$emit('update:modelValue', $event.target.value)"
        class="px-2 py-1 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-auto min-w-fit pr-10"
    >
        <slot />
    </select>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number;
}>();

const emit = defineEmits(['update:modelValue']);

const onChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
};
</script>
