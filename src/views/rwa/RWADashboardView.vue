<!-- RWA 투자 현황 대시보드 -->
<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">RWA 투자 대시보드</h1>
      <p class="text-gray-600 dark:text-gray-400">실물 자산 투자 현황을 한눈에 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">총 자산 수</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ loading ? '...' : stats.totalAssets.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">활성 자산</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ loading ? '...' : stats.activeAssets.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">총 자산 가치</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ loading ? '...' : formatCurrency(stats.totalValue) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">평균 수익률</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ loading ? '...' : `${stats.averageReturn.toFixed(1)}%` }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 차트 섹션 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- 위험도별 분포 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">위험도별 자산 분포</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">낮음</span>
            </div>
            <span class="text-sm font-medium">{{ stats.riskDistribution.low }}개</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">중간</span>
            </div>
            <span class="text-sm font-medium">{{ stats.riskDistribution.medium }}개</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-red-500 rounded mr-3"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">높음</span>
            </div>
            <span class="text-sm font-medium">{{ stats.riskDistribution.high }}개</span>
          </div>
        </div>
      </div>

      <!-- 자산 유형별 분포 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">자산 유형별 분포</h3>
        <div class="space-y-4">
          <div
            v-for="item in stats.typeDistribution"
            :key="item.type"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <span class="text-lg mr-2">{{ getAssetTypeIcon(item.type) }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ getAssetTypeName(item.type) }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ item.count }}개</div>
              <div class="text-xs text-gray-500">{{ formatCurrency(item.value) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 월별 성장 추이 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">월별 투자 현황</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div
          v-for="item in stats.monthlyGrowth"
          :key="item.month"
          class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ formatMonth(item.month) }}</div>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatCurrencyShort(item.value) }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">
            투자: {{ formatCurrencyShort(item.investment) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 자산 관리 활동 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 최근 등록된 자산 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">최근 등록 자산</h3>
        </div>
        <div class="p-6">
          <div v-if="recentAssets.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            등록된 자산이 없습니다.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="asset in recentAssets"
              :key="asset.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="asset.images && asset.images.length > 0"
                    :src="asset.images[0]"
                    :alt="asset.name"
                    class="h-10 w-10 rounded object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
                  >
                    {{ getAssetTypeIcon(asset.assetType) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ asset.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ asset.expectedReturn.toFixed(1) }}% • {{ formatCurrency(asset.totalValue) }}
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                {{ formatDateShort(asset.createdAt) }}
              </div>
            </div>
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <router-link
                to="/rwa/assets"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                모든 자산 보기 →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 투자 성과 요약 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">투자 성과 요약</h3>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">총 투자금액</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(stats.totalInvestment) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">투자 진행률</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ investmentProgress.toFixed(1) }}%
              </span>
            </div>

            <div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>진행률</span>
                <span>{{ investmentProgress.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(investmentProgress, 100)}%` }"
                ></div>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="refreshData"
                :disabled="loading"
                class="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {{ loading ? '새로고침 중...' : '데이터 새로고침' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { rwaService } from '@/services/rwa';
import type { RWAInvestmentStats, RWAAsset } from '@/types/rwa';
import { ASSET_TYPES } from '@/types/rwa';

const router = useRouter();

// 반응형 데이터
const loading = ref(false);
const stats = ref<RWAInvestmentStats>({
  totalAssets: 0,
  activeAssets: 0,
  totalValue: 0,
  totalInvestment: 0,
  averageReturn: 0,
  riskDistribution: { low: 0, medium: 0, high: 0 },
  typeDistribution: [],
  monthlyGrowth: []
});

const recentAssets = ref<RWAAsset[]>([]);

// 투자 진행률 계산
const investmentProgress = computed(() => {
  if (stats.value.totalValue === 0) return 0;
  return (stats.value.totalInvestment / stats.value.totalValue) * 100;
});

// 데이터 로드
const loadDashboardData = async () => {
  try {
    loading.value = true;
    
    // 통계 데이터 로드
    const statsData = await rwaService.getInvestmentStats();
    stats.value = statsData;

    // 최근 자산 로드
    const assetsResponse = await rwaService.getAssets({
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    recentAssets.value = assetsResponse.assets;

  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

// 데이터 새로고침
const refreshData = () => {
  loadDashboardData();
};

// 유틸리티 함수들
const getAssetTypeIcon = (assetType: string) => {
  const type = ASSET_TYPES.find(t => t.id === assetType);
  return type?.icon || '📦';
};

const getAssetTypeName = (assetType: string) => {
  const type = ASSET_TYPES.find(t => t.id === assetType);
  return type?.name || assetType;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatCurrencyShort = (value: number) => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)}조`;
  }
  if (value >= 1e8) {
    return `${(value / 1e8).toFixed(1)}억`;
  }
  if (value >= 1e4) {
    return `${(value / 1e4).toFixed(1)}만`;
  }
  return value.toLocaleString();
};

const formatMonth = (month: string) => {
  const date = new Date(month + '-01');
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short'
  }).format(date);
};

const formatDateShort = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};

// 컴포넌트 마운트
onMounted(() => {
  loadDashboardData();
});
</script>