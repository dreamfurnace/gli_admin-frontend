<!-- admin-frontend/src/components/BaseModal.vue -->
<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        @click.self="handleBackgroundClick"
    >
        <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]"
            @click.stop
        >
            <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
            <div class="p-4">
                <slot>
                    <!-- 슬롯이 없으면 기존의 message를 표시 -->
                    <pre>{{ message }}</pre>
                </slot>
            </div>
            <div class="flex justify-center gap-2">
                <button
                    v-for="(btn, idx) in buttons"
                    :key="idx"
                    :class="[
                        'px-4 py-1 rounded',
                        btn.type === 'primary'
                            ? 'font-bold bg-emerald-700 text-white'
                            : 'font-bold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
                    ]"
                    @click="btn.onClick"
                >
                    {{ btn.text }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'background-click']);

defineProps<{
    title: string;
    message: string;
    buttons: { text: string; onClick: () => void; type?: 'primary' | 'default' }[];
}>();

function handleBackgroundClick() {
    emit('background-click');
    emit('close');
}
</script>
