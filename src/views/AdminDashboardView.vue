<template>
    <div class="p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">GLI 플랫폼 대시보드</h1>
            <p class="text-gray-600 dark:text-gray-400">GLI 관리자 패널에 오신 것을 환영합니다</p>
        </div>

        <!-- 대시보드 통계 카드들 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">전체 멤버</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ loading ? '...' : stats.totalMembers.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">GLIB 토큰</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ loading ? '...' : stats.totalGLIBTokens.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">활성 거래</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ loading ? '...' : stats.activeTransactions.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">플랫폼 성장률</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ loading ? '...' : `+${stats.platformGrowth}%` }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 최근 활동 및 퀵 액션 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 최근 활동 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">최근 활동</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">U</span>
                                </div>
                            </div>
                            <div class="ml-3 flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">새 사용자 등록</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">user@example.com 이 GLI 플랫폼에 가입했습니다</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">2분 전</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium text-green-600 dark:text-green-400">T</span>
                                </div>
                            </div>
                            <div class="ml-3 flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">토큰 배포 완료</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">5,000 GLIB 토큰이 배포되었습니다</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">1시간 전</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium text-yellow-600 dark:text-yellow-400">S</span>
                                </div>
                            </div>
                            <div class="ml-3 flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">시스템 유지보수</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">예정된 유지보수가 완료되었습니다</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">3시간 전</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 퀵 액션 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">빠른 실행</h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-2 gap-4">
                        <router-link
                            to="/members/list"
                            class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">멤버 관리</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">사용자 보기 및 관리</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/tokens/usage"
                            class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                            <svg class="w-8 h-8 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">토큰 관리</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">GLIB/GLID 토큰 관리</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/analytics/platform"
                            class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">분석</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">플랫폼 통계 보기</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/settings/api"
                            class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg class="w-8 h-8 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">설정</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">시스템 구성</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';
import type { PlatformStatistics } from '@/types/api';

// GLI Platform 대시보드
const stats = ref<PlatformStatistics>({
  totalMembers: 0,
  totalGLIBTokens: 0,
  activeTransactions: 0,
  platformGrowth: 0,
  monthlyActiveUsers: 0,
  totalTokenDistributed: 0,
  verifiedMembers: 0,
  pendingVerifications: 0,
});

const loading = ref(true);

const loadDashboardData = async () => {
  try {
    loading.value = true;
    stats.value = await apiService.getPlatformStatistics();
    console.log('✅ Dashboard data loaded:', stats.value);
  } catch (error) {
    console.error('❌ Failed to load dashboard data:', error);
    // Error is already handled by API service and displayed to user
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>