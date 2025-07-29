<!-- GLI Admin Frontend App.vue -->
<template>
    <!-- GLI Admin Dashboard Layout with Web3 Provider -->
    <Web3Provider>
        <div class="app-container bg-gray-50 dark:bg-gray-900">
            <!-- Authentication Layout -->
            <div v-if="!isAuthenticated">
                <RouterView />
            </div>

            <div v-else class="flex w-full fixed-layout">
                <AdminSidebar />
                <main class="flex-1 p-4 overflow-auto">
                    <!-- Development Debug Info -->
                    <div
                        v-if="isDev"
                        class="debug-info p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                        <p class="text-sm text-blue-800">
                            <strong>[GLI Development]</strong> Auth: {{ isAuthenticated }} | 
                            Admin: {{ authStore.user?.username }} | 
                            Role: {{ authStore.user?.grade?.name || 'Loading...' }}
                        </p>
                    </div>
                    <RouterView />
                </main>
            </div>
        </div>
    </Web3Provider>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';
import Web3Provider from '@/components/Web3Provider.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const initialized = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);
// const isDev = ref(true);
// const isDev = ref(false);
const isDev = ref(import.meta.env.MODE === 'development');

onMounted(async () => {
    console.log('GLI Admin App mounted');
    if (!initialized.value) {
        await authStore.initializeAuth();
        initialized.value = true;
    }
});

console.log('🔥 GLI Admin Environment:', import.meta.env.MODE);
console.log('🌐 GLI API Server:', import.meta.env.VITE_API_BASE);
</script>

<style>
body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

.app-container {
    min-height: 100vh;
}

.fixed-layout {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

/* AdminSidebar가 있을 때의 메인 콘텐츠 여백 */
.fixed-layout main {
    height: 100vh;
    width: 100vw;
}
</style>
