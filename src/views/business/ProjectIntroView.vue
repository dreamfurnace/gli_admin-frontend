<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">🎯 프로젝트 소개 관리</h1>
          <p class="text-gray-600 dark:text-gray-400">GLI 플랫폼 프로젝트 소개 특징을 관리합니다</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          특징 추가
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="제목으로 검색..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="lg:w-48">
          <select
            v-model="showAll"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option :value="false">활성 특징만</option>
            <option :value="true">전체 보기</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">로딩 중...</span>
      </div>
    </div>

    <!-- Features List -->
    <div v-else-if="filteredFeatures.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                순서
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                아이콘
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                제목
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                설명
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="feature in filteredFeatures" :key="feature.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ feature.order }}
              </td>
              <td class="px-6 py-4 text-2xl">
                {{ feature.icon }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ feature.title_ko }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ feature.title_en }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {{ feature.description_ko }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ feature.description_en }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="feature.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ feature.is_active ? '활성' : '비활성' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="editFeature(feature)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="수정"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="toggleActive(feature)"
                    :class="feature.is_active
                      ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                    :title="feature.is_active ? '비활성화' : '활성화'"
                  >
                    <svg v-if="feature.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteFeature(feature)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="삭제"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">프로젝트 특징이 없습니다</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery ? '검색 결과가 없습니다' : '첫 번째 프로젝트 특징을 추가하세요' }}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          특징 추가
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEditing ? '프로젝트 특징 수정' : '프로젝트 특징 추가' }}
          </h3>
        </div>

        <form @submit.prevent="saveFeature" class="p-6 space-y-4">
          <!-- Icon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">아이콘 (Emoji) *</label>
            <input
              v-model="formData.icon"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: 🌊"
              maxlength="10"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Emoji를 입력하세요
            </p>
          </div>

          <!-- Title (Korean) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">제목 (한글) *</label>
            <input
              v-model="formData.title_ko"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: 비전"
            />
          </div>

          <!-- Title (English) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">제목 (영문) *</label>
            <input
              v-model="formData.title_en"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: Vision"
            />
          </div>

          <!-- Description (Korean) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">설명 (한글) *</label>
            <textarea
              v-model="formData.description_ko"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: GLI는 리조트 경험과 블록체인 기술을 융합하여 새로운 가치를 창출합니다."
            ></textarea>
          </div>

          <!-- Description (English) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">설명 (영문) *</label>
            <textarea
              v-model="formData.description_en"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: GLI creates new value by merging resort experiences with blockchain technology."
            ></textarea>
          </div>

          <!-- Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">표시 순서 *</label>
            <input
              v-model.number="formData.order"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              낮을수록 먼저 표시됩니다
            </p>
          </div>

          <!-- Is Active -->
          <div class="flex items-center">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="is_active" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              활성화 (유저 프론트엔드에 표시)
            </label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center"
            >
              <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ saving ? '저장 중...' : isEditing ? '수정' : '추가' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">프로젝트 특징 삭제</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            정말로 "{{ featureToDelete?.title_ko }}"을(를) 삭제하시겠습니까?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center"
            >
              <div v-if="deleting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ deleting ? '삭제 중...' : '삭제' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import type { ProjectFeature } from '@/types/api';

// Reactive state
const features = ref<ProjectFeature[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

// Filter states
const searchQuery = ref('');
const showAll = ref(false);

// Modal states
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const featureToDelete = ref<ProjectFeature | null>(null);

// Form data
const formData = ref({
  icon: '',
  title_ko: '',
  title_en: '',
  description_ko: '',
  description_en: '',
  order: 0,
  is_active: true,
});

const editingId = ref<string | null>(null);

// Computed properties
const filteredFeatures = computed(() => {
  let filtered = features.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(feature =>
      feature.title_ko.toLowerCase().includes(query) ||
      feature.title_en.toLowerCase().includes(query) ||
      feature.description_ko.toLowerCase().includes(query) ||
      feature.description_en.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Methods
const loadFeatures = async () => {
  try {
    loading.value = true;
    features.value = await apiService.getProjectFeatures(showAll.value);
  } catch (error) {
    console.error('Failed to load project features:', error);
    alert('프로젝트 특징을 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  formData.value = {
    icon: '',
    title_ko: '',
    title_en: '',
    description_ko: '',
    description_en: '',
    order: features.value.length,
    is_active: true,
  };
  editingId.value = null;
  showModal.value = true;
};

const editFeature = (feature: ProjectFeature) => {
  isEditing.value = true;
  formData.value = {
    icon: feature.icon,
    title_ko: feature.title_ko,
    title_en: feature.title_en,
    description_ko: feature.description_ko,
    description_en: feature.description_en,
    order: feature.order,
    is_active: feature.is_active,
  };
  editingId.value = feature.id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    icon: '',
    title_ko: '',
    title_en: '',
    description_ko: '',
    description_en: '',
    order: 0,
    is_active: true,
  };
  editingId.value = null;
};

const saveFeature = async () => {
  try {
    saving.value = true;

    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateProjectFeature(editingId.value, formData.value);
      const index = features.value.findIndex(f => f.id === editingId.value);
      if (index !== -1) {
        features.value[index] = updated;
      }
    } else {
      const created = await apiService.createProjectFeature(formData.value);
      features.value.push(created);
      features.value.sort((a, b) => a.order - b.order);
    }

    closeModal();
  } catch (error) {
    console.error('Failed to save project feature:', error);
    alert('프로젝트 특징 저장에 실패했습니다.');
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (feature: ProjectFeature) => {
  try {
    const updated = await apiService.updateProjectFeature(feature.id, {
      is_active: !feature.is_active
    });
    const index = features.value.findIndex(f => f.id === feature.id);
    if (index !== -1) {
      features.value[index] = updated;
    }
  } catch (error) {
    console.error('Failed to toggle active status:', error);
    alert('상태 변경에 실패했습니다.');
  }
};

const deleteFeature = (feature: ProjectFeature) => {
  featureToDelete.value = feature;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  featureToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!featureToDelete.value) return;

  try {
    deleting.value = true;
    await apiService.deleteProjectFeature(featureToDelete.value.id);
    features.value = features.value.filter(f => f.id !== featureToDelete.value!.id);
    showDeleteModal.value = false;
    featureToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete project feature:', error);
    alert('프로젝트 특징 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
  }
};

// Watch showAll changes
import { watch } from 'vue';
watch(showAll, () => {
  loadFeatures();
});

// Initialize
onMounted(() => {
  loadFeatures();
});
</script>
