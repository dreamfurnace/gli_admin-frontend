<!-- RWA 자산 상세보기 모달 -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- 모달 헤더 -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            RWA 자산 상세정보
          </h3>
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', asset)"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="수정"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 모달 본문 -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div class="space-y-6">
          <!-- 자산 기본 정보 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 이미지 갤러리 -->
            <div v-if="asset.images && asset.images.length > 0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">자산 이미지</h4>
              <div class="space-y-3">
                <div class="aspect-w-16 aspect-h-9">
                  <img
                    :src="currentImage"
                    :alt="asset.name"
                    class="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div v-if="asset.images.length > 1" class="grid grid-cols-4 gap-2">
                  <button
                    v-for="(image, index) in asset.images"
                    :key="index"
                    @click="currentImage = image"
                    :class="[
                      'aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2',
                      currentImage === image ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                    ]"
                  >
                    <img
                      :src="image"
                      :alt="`${asset.name} ${index + 1}`"
                      class="w-full h-16 object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- 자산 정보 -->
            <div class="space-y-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ asset.name }}</h4>
                <div class="flex items-center space-x-2 mt-2">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    asset.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]">
                    {{ asset.isActive ? '🟢 활성화' : '🔴 비활성화' }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {{ getAssetTypeIcon(asset.assetType) }} {{ getAssetTypeName(asset.assetType) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">위험도</span>
                  <div class="mt-1">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getRiskLevelClass(asset.riskLevel)
                    ]">
                      {{ getRiskLevelIcon(asset.riskLevel) }} {{ RISK_LEVELS[asset.riskLevel].label }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span class="text-gray-500 dark:text-gray-400">예상 수익률</span>
                  <div class="mt-1 font-semibold text-lg text-green-600 dark:text-green-400">
                    {{ asset.expectedReturn.toFixed(1) }}%
                  </div>
                </div>

                <div>
                  <span class="text-gray-500 dark:text-gray-400">최소 투자금액</span>
                  <div class="mt-1 font-semibold">
                    {{ formatCurrency(asset.minimumInvestment) }}
                  </div>
                </div>

                <div>
                  <span class="text-gray-500 dark:text-gray-400">총 자산 가치</span>
                  <div class="mt-1 font-semibold">
                    {{ formatCurrency(asset.totalValue) }}
                  </div>
                </div>

                <div v-if="asset.location" class="col-span-2">
                  <span class="text-gray-500 dark:text-gray-400">위치</span>
                  <div class="mt-1">{{ asset.location }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 투자 현황 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">투자 현황</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(asset.currentInvestment) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">현재 투자금액</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ investmentProgress.toFixed(1) }}%
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">투자 진행률</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ formatCurrency(remainingAmount) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">남은 투자 한도</div>
              </div>
            </div>

            <!-- 진행률 바 -->
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>투자 진행률</span>
                <span>{{ investmentProgress.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(investmentProgress, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 설명 -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">간단 설명</h4>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ asset.shortDescription }}
            </p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">상세 설명</h4>
            <div
              class="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
              v-html="asset.fullDescription"
            ></div>
          </div>

          <!-- 투자자 정보 (향후 구현) -->
          <div v-if="showInvestors" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">투자자 현황</h4>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              투자자 정보는 개발 중입니다.
            </div>
          </div>

          <!-- 성과 정보 (향후 구현) -->
          <div v-if="showPerformance" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">투자 성과</h4>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              성과 분석 정보는 개발 중입니다.
            </div>
          </div>

          <!-- 메타 정보 -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <span>등록일:</span>
                <span class="ml-2">{{ formatDate(asset.createdAt) }}</span>
              </div>
              <div>
                <span>수정일:</span>
                <span class="ml-2">{{ formatDate(asset.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { RWAAsset } from '@/types/rwa';
import { ASSET_TYPES, RISK_LEVELS } from '@/types/rwa';

interface Props {
  asset: RWAAsset;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  edit: [asset: RWAAsset];
}>();

// 현재 표시중인 이미지
const currentImage = ref('');

// 추가 섹션 표시 여부
const showInvestors = ref(false);
const showPerformance = ref(false);

// 투자 진행률 계산
const investmentProgress = computed(() => {
  if (props.asset.totalValue === 0) return 0;
  return (props.asset.currentInvestment / props.asset.totalValue) * 100;
});

// 남은 투자 한도
const remainingAmount = computed(() => {
  return Math.max(0, props.asset.totalValue - props.asset.currentInvestment);
});

// 유틸리티 함수들
const getAssetTypeIcon = (assetType: string) => {
  const type = ASSET_TYPES.find(t => t.id === assetType);
  return type?.icon || '📦';
};

const getAssetTypeName = (assetType: string) => {
  const type = ASSET_TYPES.find(t => t.id === assetType);
  return type?.name || assetType;
};

const getRiskLevelIcon = (riskLevel: string) => {
  const icons = { low: '🟢', medium: '🟡', high: '🔴' };
  return icons[riskLevel as keyof typeof icons] || '⚪';
};

const getRiskLevelClass = (riskLevel: string) => {
  const classes = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return classes[riskLevel as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// 컴포넌트 마운트
onMounted(() => {
  if (props.asset.images && props.asset.images.length > 0) {
    currentImage.value = props.asset.images[0];
  }
});
</script>

<style scoped>
.prose {
  @apply text-gray-700 dark:text-gray-300;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-gray-900 dark:text-white;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400;
}

.prose strong {
  @apply text-gray-900 dark:text-white;
}
</style>