<template>
    <div class="grid grid-cols-6 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">임시저장</p>
            <p class="text-2xl font-bold text-gray-500 mt-2">{{ summary.temp }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">권리자 확인중</p>
            <p class="text-2xl font-bold text-amber-500 mt-2">{{ summary.submit }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">발매일 확인중</p>
            <p class="text-2xl font-bold text-blue-400 mt-2">{{ summary.wait_dist_confirm }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">발매 대기중</p>
            <p class="text-2xl font-bold text-yellow-500 mt-2">{{ summary.ok_wait }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">유통중</p>
            <p class="text-2xl font-bold text-green-500 mt-2">{{ summary.ok }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-300">자동 연장 불가</p>
            <p class="text-2xl font-bold text-red-500 mt-2">{{ summary.service_expired }}</p>
        </div>
        <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center hidden"
        >
            <p class="text-sm text-gray-500 dark:text-gray-300">수정 반영 대기중</p>
            <p class="text-2xl font-bold text-purple-500 mt-2">{{ summary.revision_wait }}</p>
        </div>
        <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center hidden"
        >
            <p class="text-sm text-gray-500 dark:text-gray-300">권리자 수정 확인중</p>
            <p class="text-2xl font-bold text-pink-500 mt-2">{{ summary.revision_submit }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    summary: {
        temp: number;
        submit: number;
        wait_dist_confirm: number;
        ok_wait: number;
        ok: number;
        service_expired: number;
        revision_wait: number;
        revision_submit: number;
    };
}>();
</script>
