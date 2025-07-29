<template>
    <div v-if="totalPages > 1" class="flex gap-2 items-center justify-center">
        <button
            :disabled="currentPage === 1"
            @click="emitPage(currentPage - 1)"
            class="px-2 py-1 border rounded"
            :class="
                currentPage === 1
                    ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 cursor-not-allowed'
                    : 'hover:bg-emerald-100 hover:text-emerald-700'
            "
        >
            ←
        </button>

        <template v-for="num in pageNumbers" :key="num">
            <button
                v-if="typeof num === 'number'"
                @click="emitPage(num)"
                :disabled="num === currentPage"
                class="px-2 py-1 rounded"
                :class="
                    num === currentPage
                        ? 'bg-emerald-700 text-white font-bold cursor-default'
                        : 'hover:bg-emerald-100 hover:text-emerald-700'
                "
            >
                {{ num }}
            </button>
            <span v-else class="px-2 py-1">...</span>
        </template>

        <button
            :disabled="currentPage === totalPages"
            @click="emitPage(currentPage + 1)"
            class="px-2 py-1 border rounded"
            :class="
                currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 cursor-not-allowed'
                    : 'hover:bg-emerald-100 hover:text-emerald-700'
            "
        >
            →
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();
const emit = defineEmits<{
    (e: 'page-change', page: number): void;
}>();

const delta = 1;
const pageNumbers = computed(() => {
    const total = props.totalPages;
    const current = props.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (current <= delta + 1) {
            pages.push(1, 2, 3, '...', total);
        } else if (current >= total - delta) {
            pages.push(1, '...', total - 2, total - 1, total);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
    }
    return pages;
});

function emitPage(page: number) {
    if (page < 1 || page > props.totalPages) return;
    emit('page-change', page);
}
</script>
