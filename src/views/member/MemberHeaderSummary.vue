<template>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">가입 승인 대기자 수</p>
            <p class="text-2xl font-bold text-emerald-600 mt-2">{{ summary.pending_join }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">변경 승인 대기자 수</p>
            <p class="text-2xl font-bold text-amber-500 mt-2">{{ summary.pending_change }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">총 회원 수</p>
            <p class="text-2xl font-bold text-blue-500 mt-2">{{ summary.total }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    summary: {
        pending_join: number;
        pending_change: number;
        total: number;
    };
}>();
</script>
