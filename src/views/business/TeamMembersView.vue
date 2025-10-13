<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">👥 팀 구성원 관리</h1>
          <p class="text-gray-600 dark:text-gray-400">GLI 플랫폼 팀 구성원 정보를 관리합니다</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          팀 구성원 추가
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
              placeholder="이름 또는 직책으로 검색..."
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
            <option :value="false">활성 팀원만</option>
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

    <!-- Team Members List -->
    <div v-else-if="filteredMembers.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                순서
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                사진
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                직책
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                역할
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                태그
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
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ member.order }}
              </td>
              <td class="px-6 py-4">
                <img
                  v-if="member.image_url"
                  :src="member.image_url"
                  :alt="member.position_ko"
                  class="w-12 h-12 rounded-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ member.position_ko }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ member.position_en }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {{ member.role_ko }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ member.role_en }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(tag, idx) in member.tags.slice(0, 3)"
                    :key="idx"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="member.tags.length > 3"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  >
                    +{{ member.tags.length - 3 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="member.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ member.is_active ? '활성' : '비활성' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="editMember(member)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="수정"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="toggleActive(member)"
                    :class="member.is_active
                      ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                    :title="member.is_active ? '비활성화' : '활성화'"
                  >
                    <svg v-if="member.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteMember(member)"
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">팀 구성원이 없습니다</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery ? '검색 결과가 없습니다' : '첫 번째 팀 구성원을 추가하세요' }}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          팀 구성원 추가
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEditing ? '팀 구성원 수정' : '팀 구성원 추가' }}
          </h3>
        </div>

        <form @submit.prevent="saveMember" class="p-6 space-y-4">
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">사진</label>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img
                  v-if="formData.image_url && !imageLoadError"
                  :src="formData.image_url"
                  alt="미리보기"
                  class="w-24 h-24 rounded-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  ref="imageInput"
                  accept="image/*"
                  @change="handleImageSelect"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.imageInput.click()"
                  :disabled="uploading"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {{ uploading ? '업로드 중...' : '이미지 선택' }}
                </button>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG 또는 GIF (최대 5MB)
                </p>
              </div>
            </div>
          </div>

          <!-- Position (Korean) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">직책 (한글) *</label>
            <input
              v-model="formData.position_ko"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: GLI CEO"
            />
          </div>

          <!-- Position (English) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">직책 (영문) *</label>
            <input
              v-model="formData.position_en"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: Chief Executive Officer"
            />
          </div>

          <!-- Role (Korean) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">역할 (한글) *</label>
            <textarea
              v-model="formData.role_ko"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: 블록체인 비즈니스 전략 및 전반적인 경영을 담당합니다."
            ></textarea>
          </div>

          <!-- Role (English) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">역할 (영문) *</label>
            <textarea
              v-model="formData.role_en"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="예: Responsible for blockchain business strategy and overall management."
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">태그</label>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, idx) in formData.tags"
                  :key="idx"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(idx)"
                    class="ml-2 focus:outline-none"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newTag"
                  type="text"
                  @keypress.enter.prevent="addTag"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="태그 입력 후 Enter"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">팀 구성원 삭제</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            정말로 "{{ memberToDelete?.position_ko }}"을(를) 삭제하시겠습니까?
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
import type { TeamMember } from '@/types/api';

// Reactive state
const members = ref<TeamMember[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const uploading = ref(false);
const imageLoadError = ref(false);

// Filter states
const searchQuery = ref('');
const showAll = ref(false);

// Modal states
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const memberToDelete = ref<TeamMember | null>(null);

// Form data
const formData = ref({
  image_url: '',
  position_ko: '',
  position_en: '',
  role_ko: '',
  role_en: '',
  tags: [] as string[],
  order: 0,
  is_active: true,
});

const newTag = ref('');
const editingId = ref<string | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

// Computed properties
const filteredMembers = computed(() => {
  let filtered = members.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(member =>
      member.position_ko.toLowerCase().includes(query) ||
      member.position_en.toLowerCase().includes(query) ||
      member.role_ko.toLowerCase().includes(query) ||
      member.role_en.toLowerCase().includes(query) ||
      member.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
});

// Methods
const loadMembers = async () => {
  try {
    loading.value = true;
    members.value = await apiService.getTeamMembers(showAll.value);
  } catch (error) {
    console.error('Failed to load team members:', error);
    alert('팀 구성원을 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  imageLoadError.value = false;
  formData.value = {
    image_url: '',
    position_ko: '',
    position_en: '',
    role_ko: '',
    role_en: '',
    tags: [],
    order: members.value.length,
    is_active: true,
  };
  editingId.value = null;
  showModal.value = true;
};

const editMember = (member: TeamMember) => {
  isEditing.value = true;
  imageLoadError.value = false;
  formData.value = {
    image_url: member.image_url,
    position_ko: member.position_ko,
    position_en: member.position_en,
    role_ko: member.role_ko,
    role_en: member.role_en,
    tags: [...member.tags],
    order: member.order,
    is_active: member.is_active,
  };
  editingId.value = member.id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  imageLoadError.value = false;
  formData.value = {
    image_url: '',
    position_ko: '',
    position_en: '',
    role_ko: '',
    role_en: '',
    tags: [],
    order: 0,
    is_active: true,
  };
  editingId.value = null;
  newTag.value = '';
};

const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Check file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 크기는 5MB 이하여야 합니다.');
    return;
  }

  try {
    uploading.value = true;
    imageLoadError.value = false; // 새 업로드 시 에러 상태 초기화
    const result = await apiService.uploadImage(file);
    formData.value.image_url = result.url;
    console.log('✅ Image URL set to formData:', result.url);
  } catch (error) {
    console.error('Failed to upload image:', error);
    alert('이미지 업로드에 실패했습니다.');
  } finally {
    uploading.value = false;
    if (target) target.value = '';
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.error('❌ Failed to load image:', target.src);
  imageLoadError.value = true;
  // 무한 루프 방지: src를 변경하지 않고 에러 상태만 설정
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1);
};

const saveMember = async () => {
  try {
    saving.value = true;

    // Plain object로 변환하여 전송
    const dataToSend = {
      image_url: formData.value.image_url,
      position_ko: formData.value.position_ko,
      position_en: formData.value.position_en,
      role_ko: formData.value.role_ko,
      role_en: formData.value.role_en,
      tags: [...formData.value.tags],
      order: formData.value.order,
      is_active: formData.value.is_active,
    };

    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateTeamMember(editingId.value, dataToSend);
      const index = members.value.findIndex(m => m.id === editingId.value);
      if (index !== -1) {
        members.value[index] = updated;
      }
    } else {
      const created = await apiService.createTeamMember(dataToSend);
      members.value.push(created);
      members.value.sort((a, b) => a.order - b.order);
    }

    closeModal();
  } catch (error) {
    console.error('Failed to save team member:', error);
    alert('팀 구성원 저장에 실패했습니다.');
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (member: TeamMember) => {
  try {
    const updated = await apiService.updateTeamMember(member.id, {
      is_active: !member.is_active
    });
    const index = members.value.findIndex(m => m.id === member.id);
    if (index !== -1) {
      members.value[index] = updated;
    }
  } catch (error) {
    console.error('Failed to toggle active status:', error);
    alert('상태 변경에 실패했습니다.');
  }
};

const deleteMember = (member: TeamMember) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  memberToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!memberToDelete.value) return;

  try {
    deleting.value = true;
    await apiService.deleteTeamMember(memberToDelete.value.id);
    members.value = members.value.filter(m => m.id !== memberToDelete.value!.id);
    showDeleteModal.value = false;
    memberToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete team member:', error);
    alert('팀 구성원 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
  }
};

// Watch showAll changes
import { watch } from 'vue';
watch(showAll, () => {
  loadMembers();
});

// Initialize
onMounted(() => {
  loadMembers();
});
</script>
