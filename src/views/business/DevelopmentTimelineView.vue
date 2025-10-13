<template>
  <div class="development-timeline-view">
    <div class="page-header">
      <h1>🗓️ 개발 일정 관리</h1>
      <p class="description">프로젝트 개발 일정과 마일스톤을 관리합니다.</p>
    </div>

    <div class="actions-bar">
      <div class="left-actions">
        <button @click="openCreateModal" class="btn-primary">
          <span class="icon">➕</span>
          새 일정 추가
        </button>
        <button @click="loadTimelines" class="btn-secondary">
          <span class="icon">🔄</span>
          새로고침
        </button>
      </div>
      <div class="right-actions">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="분기 또는 제목으로 검색..."
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="filter-toggle">
          <label>
            <input type="checkbox" v-model="showAll" @change="loadTimelines" />
            <span>비활성 포함</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>일정 데이터를 불러오는 중...</p>
    </div>

    <div v-else-if="filteredTimelines.length === 0" class="empty-state">
      <span class="empty-icon">📅</span>
      <h3>등록된 개발 일정이 없습니다</h3>
      <p>새 일정 추가 버튼을 클릭하여 첫 개발 일정을 등록하세요.</p>
    </div>

    <div v-else class="timeline-table-container">
      <table class="timeline-table">
        <thead>
          <tr>
            <th>순서</th>
            <th>분기</th>
            <th>상태</th>
            <th>제목</th>
            <th>설명</th>
            <th>활성화</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeline in filteredTimelines" :key="timeline.id" :class="{ inactive: !timeline.is_active }">
            <td>{{ timeline.order }}</td>
            <td><strong>{{ timeline.quarter }}</strong></td>
            <td class="status-cell">{{ timeline.status_icon }}</td>
            <td>
              <div class="title-cell">
                <div class="title-ko">{{ timeline.title_ko }}</div>
                <div class="title-en">{{ timeline.title_en }}</div>
              </div>
            </td>
            <td>
              <div class="description-cell">
                <div class="desc-ko">{{ timeline.description_ko }}</div>
                <div class="desc-en">{{ timeline.description_en }}</div>
              </div>
            </td>
            <td>
              <span :class="['status-badge', timeline.is_active ? 'active' : 'inactive']">
                {{ timeline.is_active ? '✓ 활성' : '✗ 비활성' }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="openEditModal(timeline)" class="btn-icon" title="수정">
                ✏️
              </button>
              <button @click="confirmDelete(timeline)" class="btn-icon btn-danger" title="삭제">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 생성/수정 모달 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? '개발 일정 수정' : '새 개발 일정 추가' }}</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>분기 <span class="required">*</span></label>
            <input v-model="formData.quarter" type="text" placeholder="예: 2024 Q1" required />
          </div>

          <div class="form-group">
            <label>상태 아이콘 <span class="required">*</span></label>
            <input v-model="formData.status_icon" type="text" placeholder="예: ✅, 🔄, ⏳" required />
            <small>이모지를 입력하세요 (✅ 완료, 🔄 진행중, ⏳ 대기)</small>
          </div>

          <div class="form-group">
            <label>제목 (한글) <span class="required">*</span></label>
            <input v-model="formData.title_ko" type="text" placeholder="한글 제목" required />
          </div>

          <div class="form-group">
            <label>제목 (영문) <span class="required">*</span></label>
            <input v-model="formData.title_en" type="text" placeholder="English Title" required />
          </div>

          <div class="form-group">
            <label>설명 (한글) <span class="required">*</span></label>
            <textarea v-model="formData.description_ko" rows="3" placeholder="한글 설명" required></textarea>
          </div>

          <div class="form-group">
            <label>설명 (영문) <span class="required">*</span></label>
            <textarea v-model="formData.description_en" rows="3" placeholder="English Description" required></textarea>
          </div>

          <div class="form-group">
            <label>정렬 순서 <span class="required">*</span></label>
            <input v-model.number="formData.order" type="number" min="0" required />
            <small>낮은 숫자가 먼저 표시됩니다</small>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.is_active" type="checkbox" />
              <span>활성화</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">취소</button>
          <button @click="saveTimeline" class="btn-primary" :disabled="saving">
            {{ saving ? '저장 중...' : (isEditing ? '수정' : '추가') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>삭제 확인</h2>
          <button @click="closeDeleteModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body">
          <p>정말 이 개발 일정을 삭제하시겠습니까?</p>
          <p class="delete-target"><strong>{{ deletingTimeline?.quarter }} - {{ deletingTimeline?.title_ko }}</strong></p>
          <p class="warning">⚠️ 이 작업은 되돌릴 수 없습니다.</p>
        </div>

        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-secondary">취소</button>
          <button @click="deleteTimeline" class="btn-danger" :disabled="deleting">
            {{ deleting ? '삭제 중...' : '삭제' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DevelopmentTimeline } from '@/types/api';
import apiService from '@/services/api';

// State
const timelines = ref<DevelopmentTimeline[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const deletingTimeline = ref<DevelopmentTimeline | null>(null);
const searchQuery = ref('');
const showAll = ref(false);

// Form data
const formData = ref<Omit<DevelopmentTimeline, 'id' | 'created_at' | 'updated_at'>>({
  quarter: '',
  status_icon: '✅',
  title_ko: '',
  title_en: '',
  description_ko: '',
  description_en: '',
  order: 0,
  is_active: true,
});

// Computed
const filteredTimelines = computed(() => {
  if (!searchQuery.value) return timelines.value;

  const query = searchQuery.value.toLowerCase();
  return timelines.value.filter(timeline =>
    timeline.quarter.toLowerCase().includes(query) ||
    timeline.title_ko.toLowerCase().includes(query) ||
    timeline.title_en.toLowerCase().includes(query)
  );
});

// Methods
const loadTimelines = async () => {
  try {
    loading.value = true;
    timelines.value = await apiService.getDevelopmentTimelines(showAll.value);
  } catch (error) {
    console.error('Failed to load development timelines:', error);
    alert('개발 일정을 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // 검색은 computed에서 자동으로 처리됨
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  formData.value = {
    quarter: '',
    status_icon: '✅',
    title_ko: '',
    title_en: '',
    description_ko: '',
    description_en: '',
    order: timelines.value.length,
    is_active: true,
  };
  showModal.value = true;
};

const openEditModal = (timeline: DevelopmentTimeline) => {
  isEditing.value = true;
  editingId.value = timeline.id;
  formData.value = {
    quarter: timeline.quarter,
    status_icon: timeline.status_icon,
    title_ko: timeline.title_ko,
    title_en: timeline.title_en,
    description_ko: timeline.description_ko,
    description_en: timeline.description_en,
    order: timeline.order,
    is_active: timeline.is_active,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  editingId.value = null;
};

const saveTimeline = async () => {
  try {
    // 필수 필드 검증
    if (!formData.value.quarter || !formData.value.status_icon || !formData.value.title_ko ||
        !formData.value.title_en || !formData.value.description_ko || !formData.value.description_en) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    saving.value = true;

    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateDevelopmentTimeline(editingId.value, formData.value);
      const index = timelines.value.findIndex(t => t.id === editingId.value);
      if (index !== -1) {
        timelines.value[index] = updated;
      }
    } else {
      const created = await apiService.createDevelopmentTimeline(formData.value);
      timelines.value.push(created);
      timelines.value.sort((a, b) => a.order - b.order);
    }

    closeModal();
  } catch (error) {
    console.error('Failed to save development timeline:', error);
    alert('개발 일정 저장에 실패했습니다.');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (timeline: DevelopmentTimeline) => {
  deletingTimeline.value = timeline;
  showDeleteConfirm.value = true;
};

const closeDeleteModal = () => {
  showDeleteConfirm.value = false;
  deletingTimeline.value = null;
};

const deleteTimeline = async () => {
  if (!deletingTimeline.value) return;

  try {
    deleting.value = true;
    await apiService.deleteDevelopmentTimeline(deletingTimeline.value.id);
    timelines.value = timelines.value.filter(t => t.id !== deletingTimeline.value!.id);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete development timeline:', error);
    alert('개발 일정 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadTimelines();
});
</script>

<style scoped>
.development-timeline-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-header .description {
  font-size: 14px;
  color: #666;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 10px 40px 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 280px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.filter-toggle label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  color: #666;
}

.timeline-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.timeline-table {
  width: 100%;
  border-collapse: collapse;
}

.timeline-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.timeline-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.timeline-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.timeline-table tbody tr:hover {
  background-color: #f8f9fa;
}

.timeline-table tbody tr.inactive {
  opacity: 0.6;
}

.timeline-table td {
  padding: 16px;
  font-size: 14px;
}

.status-cell {
  font-size: 24px;
  text-align: center;
}

.title-cell,
.description-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-ko,
.desc-ko {
  font-weight: 600;
  color: #333;
}

.title-en,
.desc-en {
  font-size: 12px;
  color: #888;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 12px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

.btn-icon.btn-danger:hover {
  background: #fee;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
}

.modal-content.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.required {
  color: #e74c3c;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-target {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 16px 0;
}

.warning {
  color: #856404;
  background: #fff3cd;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
}
</style>
