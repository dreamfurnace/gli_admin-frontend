<!-- RWA 자산 목록 관리 페이지 -->
<template>
  <div class="p-6">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">RWA 투자 자산 관리</h1>
          <p class="text-gray-600 dark:text-gray-400">실물 자산 투자 상품을 관리합니다</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          새 자산 등록
        </button>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">검색</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="자산명, 설명 검색..."
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">자산 유형</label>
          <select
            v-model="filters.assetType"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="loadAssets"
          >
            <option value="">전체</option>
            <option v-for="type in ASSET_TYPES" :key="type.id" :value="type.id">
              {{ type.icon }} {{ type.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">위험도</label>
          <select
            v-model="filters.riskLevel"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="loadAssets"
          >
            <option value="">전체</option>
            <option value="low">🟢 낮음</option>
            <option value="medium">🟡 중간</option>
            <option value="high">🔴 높음</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">상태</label>
          <select
            v-model="filters.isActive"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="loadAssets"
          >
            <option value="">전체</option>
            <option :value="true">활성화</option>
            <option :value="false">비활성화</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 자산 목록 테이블 -->
    <BaseTable
      :columns="tableColumns"
      :data="assets"
      :pagination="pagination"
      @sort-change="handleSort"
      @page-change="handlePageChange"
    >
      <template #cell-name="{ item }">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img
              v-if="item.images && item.images.length > 0"
              :src="item.images[0]"
              :alt="item.name"
              class="h-10 w-10 rounded object-cover"
            />
            <div
              v-else
              class="h-10 w-10 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
            >
              {{ getAssetTypeIcon(item.assetType) }}
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {{ item.shortDescription }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-assetType="{ item }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {{ getAssetTypeIcon(item.assetType) }} {{ getAssetTypeName(item.assetType) }}
        </span>
      </template>

      <template #cell-riskLevel="{ item }">
        <span :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getRiskLevelClass(item.riskLevel)
        ]">
          {{ getRiskLevelIcon(item.riskLevel) }} {{ RISK_LEVELS[item.riskLevel].label }}
        </span>
      </template>

      <template #cell-expectedReturn="{ value }">
        <span class="font-mono text-sm">{{ value.toFixed(1) }}%</span>
      </template>

      <template #cell-totalValue="{ value }">
        <span class="font-mono text-sm">{{ formatCurrency(value) }}</span>
      </template>

      <template #cell-currentInvestment="{ item }">
        <div>
          <div class="text-sm font-medium">{{ formatCurrency(item.currentInvestment) }}</div>
          <div class="text-xs text-gray-500">
            {{ ((item.currentInvestment / item.totalValue) * 100).toFixed(1) }}%
          </div>
        </div>
      </template>

      <template #cell-isActive="{ item }">
        <button
          @click="toggleAssetStatus(item)"
          :class="[
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            item.isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
          ]"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              item.isActive ? 'translate-x-5' : 'translate-x-0'
            ]"
          />
        </button>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <button
            @click="viewAsset(item)"
            class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="상세보기"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            @click="editAsset(item)"
            class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="수정"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="deleteAsset(item)"
            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            title="삭제"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- 자산 생성/수정 모달 -->
    <RWAAssetFormModal
      v-if="showCreateModal || showEditModal"
      :asset="editingAsset"
      :is-edit="!!editingAsset"
      @close="closeModal"
      @saved="handleAssetSaved"
    />

    <!-- 자산 상세보기 모달 -->
    <RWAAssetDetailModal
      v-if="showDetailModal && selectedAsset"
      :asset="selectedAsset"
      @close="showDetailModal = false"
      @edit="editAsset"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseTable from '@/components/BaseTable.vue';
import RWAAssetFormModal from '@/components/rwa/RWAAssetFormModal.vue';
import RWAAssetDetailModal from '@/components/rwa/RWAAssetDetailModal.vue';
import { rwaService } from '@/services/rwa';
import { useAuthStore } from '@/stores/auth';
import { loggingService } from '@/services/logging';
import type { RWAAsset, RWAAssetFilter } from '@/types/rwa';
import { ASSET_TYPES, RISK_LEVELS } from '@/types/rwa';

const router = useRouter();
const authStore = useAuthStore();

// 반응형 데이터
const assets = ref<RWAAsset[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const editingAsset = ref<RWAAsset | null>(null);
const selectedAsset = ref<RWAAsset | null>(null);

// 필터 및 페이지네이션
const filters = reactive<RWAAssetFilter>({
  search: '',
  assetType: '',
  riskLevel: undefined,
  isActive: undefined,
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 10
});

// 테이블 컬럼 설정
const tableColumns = [
  { key: 'name', label: '자산명', sortable: true },
  { key: 'assetType', label: '유형', sortable: true },
  { key: 'riskLevel', label: '위험도', sortable: true },
  { key: 'expectedReturn', label: '예상수익률', sortable: true },
  { key: 'totalValue', label: '총 가치', sortable: true },
  { key: 'currentInvestment', label: '현재 투자', sortable: false },
  { key: 'isActive', label: '상태', sortable: true },
];

// 디바운스된 검색
let searchTimeout: NodeJS.Timeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.page = 1;
    loadAssets();
  }, 300);
};

// 자산 목록 로드
const loadAssets = async () => {
  try {
    loading.value = true;
    const response = await rwaService.getAssets(filters);
    
    assets.value = response.assets;
    pagination.value = {
      currentPage: response.page,
      totalPages: response.totalPages,
      total: response.total,
      perPage: response.limit
    };
  } catch (error) {
    console.error('Failed to load assets:', error);
  } finally {
    loading.value = false;
  }
};

// 정렬 처리
const handleSort = (key: string, order: 'asc' | 'desc') => {
  filters.sortBy = key as any;
  filters.sortOrder = order;
  loadAssets();
};

// 페이지 변경 처리
const handlePageChange = (page: number) => {
  filters.page = page;
  loadAssets();
};

// 자산 상태 토글
const toggleAssetStatus = async (asset: RWAAsset) => {
  try {
    const updatedAsset = await rwaService.toggleAssetStatus(asset.id, !asset.isActive);
    const index = assets.value.findIndex(a => a.id === asset.id);
    if (index !== -1) {
      assets.value[index] = updatedAsset;
    }

    // 활동 로그 기록
    if (authStore.user) {
      await loggingService.logDataModification(
        authStore.user.id,
        authStore.user.username,
        'UPDATE',
        'RWA_ASSET',
        asset.id,
        { isActive: asset.isActive },
        { isActive: !asset.isActive }
      );
    }
  } catch (error) {
    console.error('Failed to toggle asset status:', error);
  }
};

// 자산 보기
const viewAsset = (asset: RWAAsset) => {
  selectedAsset.value = asset;
  showDetailModal.value = true;
};

// 자산 수정
const editAsset = (asset: RWAAsset) => {
  editingAsset.value = asset;
  showEditModal.value = true;
  showDetailModal.value = false;
};

// 자산 삭제
const deleteAsset = async (asset: RWAAsset) => {
  if (!confirm(`"${asset.name}" 자산을 삭제하시겠습니까?`)) {
    return;
  }

  try {
    await rwaService.deleteAsset(asset.id);
    await loadAssets();

    // 활동 로그 기록
    if (authStore.user) {
      await loggingService.logDataModification(
        authStore.user.id,
        authStore.user.username,
        'DELETE',
        'RWA_ASSET',
        asset.id,
        { name: asset.name }
      );
    }
  } catch (error) {
    console.error('Failed to delete asset:', error);
  }
};

// 모달 닫기
const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingAsset.value = null;
};

// 자산 저장 완료 처리
const handleAssetSaved = () => {
  closeModal();
  loadAssets();
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

// 컴포넌트 마운트
onMounted(() => {
  loadAssets();
});
</script>