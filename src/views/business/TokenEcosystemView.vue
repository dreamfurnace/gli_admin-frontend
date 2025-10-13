<template>
  <div class="token-ecosystem-view">
    <div class="page-header">
      <h1>🪙 토큰 에코시스템 관리</h1>
      <p class="description">GLI 플랫폼의 토큰 정보를 관리합니다.</p>
    </div>

    <div class="actions-bar">
      <div class="left-actions">
        <button @click="openCreateModal" class="btn-primary">
          <span class="icon">➕</span>
          새 토큰 추가
        </button>
        <button @click="loadTokens" class="btn-secondary">
          <span class="icon">🔄</span>
          새로고침
        </button>
      </div>
      <div class="right-actions">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="토큰 이름 또는 심볼로 검색..."
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="filter-toggle">
          <label>
            <input type="checkbox" v-model="showAll" @change="loadTokens" />
            <span>비활성 포함</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>토큰 데이터를 불러오는 중...</p>
    </div>

    <div v-else-if="filteredTokens.length === 0" class="empty-state">
      <span class="empty-icon">🪙</span>
      <h3>등록된 토큰이 없습니다</h3>
      <p>새 토큰 추가 버튼을 클릭하여 첫 토큰을 등록하세요.</p>
    </div>

    <div v-else class="token-grid">
      <div v-for="token in filteredTokens" :key="token.id" class="token-card" :class="{ inactive: !token.is_active }">
        <div class="token-header">
          <div class="token-icon">{{ token.icon }}</div>
          <div class="token-info">
            <h3>{{ token.name }}</h3>
            <div class="token-symbol">{{ token.symbol }}</div>
          </div>
          <div class="token-actions">
            <button @click="openEditModal(token)" class="btn-icon" title="수정">✏️</button>
            <button @click="confirmDelete(token)" class="btn-icon btn-danger" title="삭제">🗑️</button>
          </div>
        </div>

        <div class="token-body">
          <div class="description-section">
            <div class="desc-ko">{{ token.description_ko }}</div>
            <div class="desc-en">{{ token.description_en }}</div>
          </div>

          <div class="features-section">
            <h4>주요 기능</h4>
            <ul class="features-list">
              <li v-for="(feature, idx) in token.features" :key="idx">✅ {{ feature }}</li>
            </ul>
          </div>

          <div class="token-stats">
            <div class="stat-item">
              <span class="stat-label">총 공급량</span>
              <span class="stat-value">{{ token.total_supply }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">현재 가격</span>
              <span class="stat-value price">{{ token.current_price }}</span>
            </div>
          </div>

          <div class="token-footer">
            <span class="order-badge">순서: {{ token.order }}</span>
            <span :class="['status-badge', token.is_active ? 'active' : 'inactive']">
              {{ token.is_active ? '✓ 활성' : '✗ 비활성' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 생성/수정 모달 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? '토큰 정보 수정' : '새 토큰 추가' }}</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>아이콘 <span class="required">*</span></label>
            <input v-model="formData.icon" type="text" placeholder="예: 🔵" required />
            <small>이모지를 입력하세요</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>토큰 이름 <span class="required">*</span></label>
              <input v-model="formData.name" type="text" placeholder="예: GLI Business" required />
            </div>
            <div class="form-group">
              <label>심볼 <span class="required">*</span></label>
              <input v-model="formData.symbol" type="text" placeholder="예: GLIB" required />
            </div>
          </div>

          <div class="form-group">
            <label>설명 (한글) <span class="required">*</span></label>
            <textarea v-model="formData.description_ko" rows="2" placeholder="한글 설명" required></textarea>
          </div>

          <div class="form-group">
            <label>설명 (영문) <span class="required">*</span></label>
            <textarea v-model="formData.description_en" rows="2" placeholder="English Description" required></textarea>
          </div>

          <div class="form-group">
            <label>주요 기능 <span class="required">*</span></label>
            <textarea
              v-model="featuresText"
              rows="4"
              placeholder="한 줄에 하나씩 입력하세요"
              required
            ></textarea>
            <small>각 기능을 한 줄씩 입력해주세요</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>총 공급량 <span class="required">*</span></label>
              <input v-model="formData.total_supply" type="text" placeholder="예: 100,000,000 GLIB" required />
            </div>
            <div class="form-group">
              <label>현재 가격 <span class="required">*</span></label>
              <input v-model="formData.current_price" type="text" placeholder="예: $0.25" required />
            </div>
          </div>

          <div class="form-group">
            <label>정렬 순서 <span class="required">*</span></label>
            <input v-model.number="formData.order" type="number" min="0" required />
            <small>낮은 숫자가 먼저 표시됩니다</small>
          </div>

          <div class="form-group">
            <label>활성화 상태</label>
            <div class="toggle-container">
              <label class="toggle-switch">
                <input v-model="formData.is_active" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">{{ formData.is_active ? '✓ 활성화됨 (사용자 화면에 표시)' : '✗ 비활성화됨 (사용자 화면에 숨김)' }}</span>
            </div>
            <small>활성화하면 사용자 프론트엔드에 이 토큰 정보가 표시됩니다</small>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">취소</button>
          <button @click="saveToken" class="btn-primary" :disabled="saving">
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
          <p>정말 이 토큰 정보를 삭제하시겠습니까?</p>
          <p class="delete-target"><strong>{{ deletingToken?.symbol }} - {{ deletingToken?.name }}</strong></p>
          <p class="warning">⚠️ 이 작업은 되돌릴 수 없습니다.</p>
        </div>

        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-secondary">취소</button>
          <button @click="deleteToken" class="btn-danger" :disabled="deleting">
            {{ deleting ? '삭제 중...' : '삭제' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { TokenEcosystem } from '@/types/api';
import apiService from '@/services/api';

const tokens = ref<TokenEcosystem[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const deletingToken = ref<TokenEcosystem | null>(null);
const searchQuery = ref('');
const showAll = ref(false);
const featuresText = ref('');

const formData = ref<Omit<TokenEcosystem, 'id' | 'created_at' | 'updated_at'>>({
  icon: '🔵',
  name: '',
  symbol: '',
  description_ko: '',
  description_en: '',
  features: [],
  total_supply: '',
  current_price: '',
  order: 0,
  is_active: true,
});

const filteredTokens = computed(() => {
  if (!searchQuery.value) return tokens.value;
  const query = searchQuery.value.toLowerCase();
  return tokens.value.filter(token =>
    token.name.toLowerCase().includes(query) ||
    token.symbol.toLowerCase().includes(query)
  );
});

const loadTokens = async () => {
  try {
    loading.value = true;
    tokens.value = await apiService.getTokenEcosystems(showAll.value);
  } catch (error) {
    console.error('Failed to load token ecosystems:', error);
    alert('토큰 정보를 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  formData.value = {
    icon: '🔵',
    name: '',
    symbol: '',
    description_ko: '',
    description_en: '',
    features: [],
    total_supply: '',
    current_price: '',
    order: tokens.value.length,
    is_active: true,
  };
  featuresText.value = '';
  showModal.value = true;
};

const openEditModal = (token: TokenEcosystem) => {
  isEditing.value = true;
  editingId.value = token.id;
  formData.value = {
    icon: token.icon,
    name: token.name,
    symbol: token.symbol,
    description_ko: token.description_ko,
    description_en: token.description_en,
    features: token.features,
    total_supply: token.total_supply,
    current_price: token.current_price,
    order: token.order,
    is_active: token.is_active,
  };
  featuresText.value = token.features.join('\n');
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  editingId.value = null;
};

const saveToken = async () => {
  try {
    if (!formData.value.icon || !formData.value.name || !formData.value.symbol ||
        !formData.value.description_ko || !formData.value.description_en ||
        !formData.value.total_supply || !formData.value.current_price) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    saving.value = true;
    const features = featuresText.value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const dataToSave = { ...formData.value, features };
    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateTokenEcosystem(editingId.value, dataToSave);
      const index = tokens.value.findIndex(t => t.id === editingId.value);
      if (index !== -1) tokens.value[index] = updated;
    } else {
      const created = await apiService.createTokenEcosystem(dataToSave);
      tokens.value.push(created);
      tokens.value.sort((a, b) => a.order - b.order);
    }
    closeModal();
  } catch (error) {
    console.error('Failed to save token ecosystem:', error);
    alert('토큰 정보 저장에 실패했습니다.');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (token: TokenEcosystem) => {
  deletingToken.value = token;
  showDeleteConfirm.value = true;
};

const closeDeleteModal = () => {
  showDeleteConfirm.value = false;
  deletingToken.value = null;
};

const deleteToken = async () => {
  if (!deletingToken.value) return;
  try {
    deleting.value = true;
    await apiService.deleteTokenEcosystem(deletingToken.value.id);
    tokens.value = tokens.value.filter(t => t.id !== deletingToken.value!.id);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete token ecosystem:', error);
    alert('토큰 정보 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
  }
};

onMounted(() => loadTokens());
</script>

<style scoped>
.token-ecosystem-view { padding: 24px; max-width: 1400px; margin: 0 auto; }
.page-header { margin-bottom: 32px; }
.page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
.page-header .description { font-size: 14px; color: #666; }
.actions-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
.left-actions, .right-actions { display: flex; gap: 12px; align-items: center; }
.btn-primary, .btn-secondary { padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; border: none; }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
.btn-secondary { background: white; color: #333; border: 1px solid #ddd; }
.btn-secondary:hover { background: #f5f5f5; }
.search-box { position: relative; }
.search-box input { padding: 10px 40px 10px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 280px; transition: all 0.2s; }
.search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.filter-toggle label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #666; }
.loading-state, .empty-state { text-align: center; padding: 60px 20px; }
.spinner { width: 48px; height: 48px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.empty-icon { font-size: 64px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: #333; margin-bottom: 8px; }
.empty-state p { color: #666; }
.token-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
.token-card { background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); overflow: hidden; transition: all 0.3s; }
.token-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
.token-card.inactive { opacity: 0.6; }
.token-header { display: flex; align-items: center; gap: 16px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.token-icon { font-size: 48px; flex-shrink: 0; }
.token-info { flex: 1; }
.token-info h3 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.token-symbol { font-size: 16px; font-weight: 600; opacity: 0.9; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 12px; display: inline-block; }
.token-actions { display: flex; gap: 8px; }
.btn-icon { padding: 8px; border: none; background: rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer; font-size: 18px; transition: all 0.2s; color: white; }
.btn-icon:hover { background: rgba(255, 255, 255, 0.3); transform: scale(1.1); }
.token-body { padding: 20px; }
.description-section { margin-bottom: 20px; }
.desc-ko { font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 8px; }
.desc-en { font-size: 13px; color: #888; line-height: 1.5; }
.features-section { margin-bottom: 20px; }
.features-section h4 { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; }
.features-list { list-style: none; padding: 0; margin: 0; }
.features-list li { font-size: 13px; color: #555; padding: 6px 0; line-height: 1.5; }
.token-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px; }
.stat-item { display: flex; flex-direction: column; gap: 4px; }
.stat-label { font-size: 12px; color: #888; font-weight: 600; }
.stat-value { font-size: 16px; color: #333; font-weight: 700; }
.stat-value.price { color: #28a745; }
.token-footer { display: flex; justify-content: space-between; align-items: center; }
.order-badge { font-size: 12px; color: #888; background: #f0f0f0; padding: 4px 12px; border-radius: 12px; }
.status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.status-badge.active { background: #d4edda; color: #155724; }
.status-badge.inactive { background: #f8d7da; color: #721c24; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); width: 90%; max-width: 700px; max-height: 90vh; overflow: auto; }
.modal-content.modal-small { max-width: 400px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #f0f0f0; }
.modal-header h2 { font-size: 20px; font-weight: 700; color: #333; }
.btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.2s; }
.btn-close:hover { background: #f5f5f5; color: #333; }
.modal-body { padding: 24px; }
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #333; }
.required { color: #e74c3c; }
.form-group input[type="text"], .form-group input[type="number"], .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.form-group textarea { resize: vertical; min-height: 80px; }
.form-group small { display: block; margin-top: 4px; font-size: 12px; color: #888; }
.toggle-container { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.toggle-switch { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0; }
.toggle-switch input[type="checkbox"] { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 28px; }
.toggle-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
.toggle-switch input:checked + .toggle-slider { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(24px); }
.toggle-label { font-size: 14px; font-weight: 600; color: #333; user-select: none; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 24px; border-top: 1px solid #f0f0f0; }
.btn-danger { background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.btn-danger:hover { background: #c82333; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4); }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.delete-target { padding: 12px; background: #f8f9fa; border-radius: 8px; margin: 16px 0; }
.warning { color: #856404; background: #fff3cd; padding: 12px; border-radius: 8px; font-size: 13px; }
</style>
