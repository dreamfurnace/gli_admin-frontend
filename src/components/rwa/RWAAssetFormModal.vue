<!-- RWA 자산 생성/수정 모달 -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- 모달 헤더 -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEdit ? 'RWA 자산 수정' : 'RWA 자산 등록' }}
          </h3>
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

      <!-- 모달 본문 -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 기본 정보 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                자산명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="예: 서울 강남 오피스텔"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                자산 유형 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.assetType"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">자산 유형 선택</option>
                <option v-for="type in ASSET_TYPES" :key="type.id" :value="type.id">
                  {{ type.icon }} {{ type.name }}
                </option>
              </select>
              <p v-if="errors.assetType" class="mt-1 text-sm text-red-600">{{ errors.assetType }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                위험도 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.riskLevel"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">위험도 선택</option>
                <option value="low">🟢 낮음 (0-5%)</option>
                <option value="medium">🟡 중간 (5-15%)</option>
                <option value="high">🔴 높음 (15%+)</option>
              </select>
              <p v-if="errors.riskLevel" class="mt-1 text-sm text-red-600">{{ errors.riskLevel }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                예상 수익률 (%) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.expectedReturn"
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="8.5"
              />
              <p v-if="errors.expectedReturn" class="mt-1 text-sm text-red-600">{{ errors.expectedReturn }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                위치
              </label>
              <input
                v-model="formData.location"
                type="text"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="예: 서울특별시 강남구"
              />
            </div>
          </div>

          <!-- 투자 금액 정보 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                최소 투자금액 (원) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.minimumInvestment"
                type="number"
                min="0"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="10000000"
              />
              <p class="mt-1 text-xs text-gray-500">{{ formatCurrency(formData.minimumInvestment || 0) }}</p>
              <p v-if="errors.minimumInvestment" class="mt-1 text-sm text-red-600">{{ errors.minimumInvestment }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                총 자산 가치 (원) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.totalValue"
                type="number"
                min="0"
                required
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="5000000000"
              />
              <p class="mt-1 text-xs text-gray-500">{{ formatCurrency(formData.totalValue || 0) }}</p>
              <p v-if="errors.totalValue" class="mt-1 text-sm text-red-600">{{ errors.totalValue }}</p>
            </div>
          </div>

          <!-- 설명 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              간단 설명 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.shortDescription"
              rows="2"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="투자 상품에 대한 간단한 설명을 입력하세요."
            />
            <p v-if="errors.shortDescription" class="mt-1 text-sm text-red-600">{{ errors.shortDescription }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              상세 설명 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.fullDescription"
              rows="4"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="투자 상품에 대한 상세한 설명을 입력하세요. HTML 태그 사용 가능합니다."
            />
            <p class="mt-1 text-xs text-gray-500">HTML 태그를 사용하여 서식을 지정할 수 있습니다.</p>
            <p v-if="errors.fullDescription" class="mt-1 text-sm text-red-600">{{ errors.fullDescription }}</p>
          </div>

          <!-- 이미지 업로드 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              자산 이미지
            </label>
            <div class="mt-1">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.fileInput?.click()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                이미지 업로드
              </button>
            </div>

            <!-- 업로드된 이미지 미리보기 -->
            <div v-if="formData.images && formData.images.length > 0" class="mt-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image"
                    :alt="`이미지 ${index + 1}`"
                    class="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- 모달 푸터 -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          취소
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading || !isFormValid"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? '저장 중...' : (isEdit ? '수정하기' : '등록하기') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { rwaService } from '@/services/rwa';
import { useAuthStore } from '@/stores/auth';
import { loggingService } from '@/services/logging';
import type { RWAAsset, CreateRWAAssetRequest } from '@/types/rwa';
import { ASSET_TYPES } from '@/types/rwa';

interface Props {
  asset?: RWAAsset | null;
  isEdit: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  asset: null,
  isEdit: false
});

const emit = defineEmits<{
  close: [];
  saved: [asset: RWAAsset];
}>();

const authStore = useAuthStore();
const loading = ref(false);
const fileInput = ref<HTMLInputElement>();

// 폼 데이터
const formData = reactive<CreateRWAAssetRequest>({
  name: '',
  shortDescription: '',
  fullDescription: '',
  images: [],
  expectedReturn: 0,
  riskLevel: 'medium',
  minimumInvestment: 0,
  totalValue: 0,
  location: '',
  assetType: ''
});

// 에러 상태
const errors = reactive<Record<string, string>>({});

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    formData.name.trim() !== '' &&
    formData.shortDescription.trim() !== '' &&
    formData.fullDescription.trim() !== '' &&
    formData.assetType !== '' &&
    formData.riskLevel !== '' &&
    formData.expectedReturn > 0 &&
    formData.minimumInvestment > 0 &&
    formData.totalValue > 0 &&
    formData.totalValue >= formData.minimumInvestment
  );
});

// 통화 포맷
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// 이미지 업로드 처리
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (!files || files.length === 0) return;

  loading.value = true;
  try {
    const uploadPromises = Array.from(files).map(file => rwaService.uploadAssetImage(file));
    const imageUrls = await Promise.all(uploadPromises);
    
    formData.images = [...(formData.images || []), ...imageUrls];
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    alert('이미지 업로드에 실패했습니다.');
  } finally {
    loading.value = false;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

// 이미지 제거
const removeImage = (index: number) => {
  if (formData.images) {
    formData.images.splice(index, 1);
  }
};

// 폼 유효성 검사
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);

  if (!formData.name.trim()) {
    errors.name = '자산명을 입력해주세요.';
  }

  if (!formData.assetType) {
    errors.assetType = '자산 유형을 선택해주세요.';
  }

  if (!formData.riskLevel) {
    errors.riskLevel = '위험도를 선택해주세요.';
  }

  if (formData.expectedReturn <= 0) {
    errors.expectedReturn = '예상 수익률을 입력해주세요.';
  }

  if (formData.minimumInvestment <= 0) {
    errors.minimumInvestment = '최소 투자금액을 입력해주세요.';
  }

  if (formData.totalValue <= 0) {
    errors.totalValue = '총 자산 가치를 입력해주세요.';
  }

  if (formData.totalValue > 0 && formData.minimumInvestment > 0 && formData.totalValue < formData.minimumInvestment) {
    errors.totalValue = '총 자산 가치는 최소 투자금액보다 커야 합니다.';
  }

  if (!formData.shortDescription.trim()) {
    errors.shortDescription = '간단 설명을 입력해주세요.';
  }

  if (!formData.fullDescription.trim()) {
    errors.fullDescription = '상세 설명을 입력해주세요.';
  }

  return Object.keys(errors).length === 0;
};

// 폼 제출
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    let savedAsset: RWAAsset;
    
    if (props.isEdit && props.asset) {
      savedAsset = await rwaService.updateAsset(props.asset.id, formData);
      
      // 활동 로그 기록
      if (authStore.user) {
        await loggingService.logDataModification(
          authStore.user.id,
          authStore.user.username,
          'UPDATE',
          'RWA_ASSET',
          props.asset.id,
          props.asset,
          savedAsset
        );
      }
    } else {
      savedAsset = await rwaService.createAsset(formData);
      
      // 활동 로그 기록
      if (authStore.user) {
        await loggingService.logDataModification(
          authStore.user.id,
          authStore.user.username,
          'CREATE',
          'RWA_ASSET',
          savedAsset.id,
          undefined,
          savedAsset
        );
      }
    }

    emit('saved', savedAsset);
  } catch (error) {
    console.error('자산 저장 실패:', error);
    alert('자산 저장에 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

// 수정 모드인 경우 기존 데이터 로드
onMounted(() => {
  if (props.isEdit && props.asset) {
    Object.assign(formData, {
      name: props.asset.name,
      shortDescription: props.asset.shortDescription,
      fullDescription: props.asset.fullDescription,
      images: [...(props.asset.images || [])],
      expectedReturn: props.asset.expectedReturn,
      riskLevel: props.asset.riskLevel,
      minimumInvestment: props.asset.minimumInvestment,
      totalValue: props.asset.totalValue,
      location: props.asset.location || '',
      assetType: props.asset.assetType
    });
  }
});
</script>