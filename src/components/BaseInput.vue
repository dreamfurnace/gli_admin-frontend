<!-- components/BaseInput.vue -->
<template>
    <input
        :value="modelValue"
        @input="onInput"
        v-bind="$attrs"
        class="w-full px-2 py-1 rounded-md border border-gray-300 text-sm placeholder-gray-400 text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-600"
    />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

function onInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>
