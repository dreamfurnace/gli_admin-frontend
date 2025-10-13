<!-- src/views/LoginView.vue -->
<template>
    <div class="fixed inset-0 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <!-- container div 추가하여 최대 너비 제한 및 중앙 정렬 -->
        <div class="container mx-auto px-4">
            <!-- flex 컨테이너 추가하여 내부 요소 중앙 정렬 -->
            <div class="flex justify-center">
                <div class="w-full max-w-md">
                    <div class="bg-white py-8 px-6 shadow rounded-lg">
                        <h2 class="mb-0 text-center text-3xl font-bold text-gray-900">
                            GLI 관리자 로그인
                        </h2>
                        <h2 class="mb-8 text-center text-l text-gray-900">
                            - ENV:
                            <span class="text-blue-600 font-bold">{{ envInfo }}</span>
                            / GLI Platform Admin
                        </h2>
                        <p class="text-center text-gray-700 mt-2">
                            🚀 GLI 플랫폼 관리자 페이지에 오신 것을 환영합니다 🚀
                        </p>

                        <form class="space-y-6" @submit.prevent="handleSubmit">
                            <!-- 에러 메시지 -->
                            <div
                                v-if="state.error"
                                class="rounded-md bg-red-50 dark:bg-red-900 p-4"
                            >
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg
                                            class="h-5 w-5 text-red-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3
                                            class="text-sm font-medium text-red-800 dark:text-red-200"
                                        >
                                            {{ state.error }}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label
                                    for="username"
                                    class="block text-sm font-medium text-gray-700"
                                    >사용자명</label
                                >
                                <input
                                    id="username"
                                    v-model="state.form.username"
                                    type="text"
                                    required
                                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    placeholder="아이디를 입력해주세요."
                                    autocomplete="username"
                                />
                            </div>

                            <div>
                                <label
                                    for="password"
                                    class="block text-sm font-medium text-gray-700"
                                    >비밀번호</label
                                >
                                <input
                                    id="password"
                                    v-model="state.form.password"
                                    type="password"
                                    required
                                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    placeholder="비밀번호를 입력해주세요."
                                    autocomplete="current-password"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    :disabled="state.isLoading"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {{ state.isLoading ? '로그인 중...' : '로그인' }}
                                </button>
                            </div>

                            <div v-if="state.error" class="text-red-500 text-sm text-center mt-2">
                                {{ state.error }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 개발환경용 원클릭 로그인 패널 -->
        <div
            v-if="isDevelopment"
            class="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 border-2 border-blue-500 max-w-sm"
        >
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    🚀 개발환경 원클릭 로그인
                </h3>
                <button
                    @click="showDevPanel = !showDevPanel"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    {{ showDevPanel ? '▼' : '▲' }}
                </button>
            </div>

            <div v-show="showDevPanel" class="space-y-2">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                    슈퍼 관리자 계정
                </div>
                <button
                    @click="quickLogin('superadmin1@gli.com', 'super1234!')"
                    class="w-full text-left px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 rounded text-sm font-medium"
                >
                    🔐 슈퍼 관리자 1<br />
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        superadmin1@gli.com
                    </span>
                </button>
                <button
                    @click="quickLogin('superadmin2@gli.com', 'super1234!')"
                    class="w-full text-left px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 rounded text-sm font-medium"
                >
                    🔐 슈퍼 관리자 2<br />
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        superadmin2@gli.com
                    </span>
                </button>

                <div class="text-xs text-gray-500 dark:text-gray-400 mt-3 mb-2 font-semibold">
                    일반 관리자 계정
                </div>
                <button
                    @click="quickLogin('admin1@gli.com', 'admin1234!')"
                    class="w-full text-left px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded text-sm font-medium"
                >
                    👤 일반 관리자 1<br />
                    <span class="text-xs text-gray-600 dark:text-gray-400">admin1@gli.com</span>
                </button>
                <button
                    @click="quickLogin('admin2@gli.com', 'admin1234!')"
                    class="w-full text-left px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded text-sm font-medium"
                >
                    👤 일반 관리자 2<br />
                    <span class="text-xs text-gray-600 dark:text-gray-400">admin2@gli.com</span>
                </button>
            </div>
        </div>

        <!-- 에러 모달 -->
        <div
            v-if="showErrorModal"
            class="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
            <div class="bg-white dark:bg-slate-800 w-full max-w-sm rounded-lg shadow-lg p-6">
                <div class="flex items-start mb-4">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-6 w-6 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div class="ml-3 w-0 flex-1">
                        <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100">
                            로그인 실패
                        </h3>
                        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {{ state.error }}
                        </p>
                    </div>
                    <div class="ml-4 flex flex-shrink-0">
                        <button
                            @click="showErrorModal = false"
                            class="inline-flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                        >
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mt-4">
                    <button
                        @click="showErrorModal = false"
                        class="w-full inline-flex justify-center rounded-md border border-transparent bg-emerald-600 dark:bg-emerald-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:text-sm"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginFormState } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const showErrorModal = ref(false);
const envInfo = `${import.meta.env.MODE}`;
const isDevelopment = import.meta.env.MODE === 'development';
const showDevPanel = ref(true);

const state = reactive<LoginFormState>({
    form: {
        username: '',
        password: '',
    },
    error: '',
    isLoading: false,
});

const handleSubmit = async () => {
    try {
        state.isLoading = true;
        state.error = '';

        const success = await authStore.login(state.form);

        // ✅ 로그인 성공 시에만 user 값 확인 후 라우팅
        if (success) {
            router.push(authStore.getInitialRoute());
        } else {
            state.error = '로그인 실패';
            showErrorModal.value = true;
        }
    } catch (err) {
        console.error('@LoginView.vue - handleSubmit : 로그인 실패:', err);
        if (err instanceof Error) {
            // 백엔드에서 전달된 에러 메시지를 그대로 사용
            state.error = err.message;
        } else {
            state.error = '알 수 없는 오류가 발생했습니다.';
        }
        showErrorModal.value = true;
    } finally {
        state.isLoading = false;
    }
};

const quickLogin = async (username: string, password: string) => {
    state.form.username = username;
    state.form.password = password;
    await handleSubmit();
};
</script>
