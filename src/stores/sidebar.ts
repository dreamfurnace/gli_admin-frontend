// src/stores/sidebar.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
    const isMinimized = ref(false);

    const setMinimized = (value: boolean) => {
        isMinimized.value = value;
    };

    const minimize = () => {
        isMinimized.value = true;
    };

    return {
        isMinimized,
        setMinimized,
        minimize,
    };
});
