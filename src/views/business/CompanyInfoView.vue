<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Business Content Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage company information and business content</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Content
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
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
              placeholder="Search content..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="lg:w-48">
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="company-info">Company Info</option>
            <option value="team">Team</option>
            <option value="strategy">Strategy</option>
            <option value="general">General</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="lg:w-48">
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading content...</span>
      </div>
    </div>

    <!-- Content List -->
    <div v-else-if="filteredContent.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Updated
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="content in filteredContent" :key="content.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ content.title }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                  {{ content.content }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getCategoryClass(content.category)">
                  {{ getCategoryLabel(content.category) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="content.isPublished 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                  {{ content.isPublished ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(content.updatedAt) }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="editContent(content)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="togglePublishStatus(content)"
                    :class="content.isPublished 
                      ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                    :title="content.isPublished ? 'Unpublish' : 'Publish'"
                  >
                    <svg v-if="content.isPublished" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteContent(content)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No content found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery || selectedCategory || selectedStatus ? 'Try adjusting your filters' : 'Create your first business content to get started' }}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Content
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Content' : 'Create New Content' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveContent" class="p-6 space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content title"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              v-model="formData.category"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="company-info">Company Info</option>
              <option value="team">Team</option>
              <option value="strategy">Strategy</option>
              <option value="general">General</option>
            </select>
          </div>

          <!-- Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
            <textarea
              v-model="formData.content"
              required
              rows="10"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your content here..."
            ></textarea>
          </div>

          <!-- Publish Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="formData.isPublished"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center"
            >
              <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ saving ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delete Content</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete "{{ contentToDelete?.title }}"?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center"
            >
              <div v-if="deleting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ deleting ? 'Deleting...' : 'Delete' }}
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
import type { BusinessContent } from '@/types/api';

// Reactive state
const content = ref<BusinessContent[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

// Filter states
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');

// Modal states
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const contentToDelete = ref<BusinessContent | null>(null);

// Form data
const formData = ref({
  title: '',
  content: '',
  category: '' as BusinessContent['category'],
  isPublished: false,
});

const editingId = ref<number | null>(null);

// Computed properties
const filteredContent = computed(() => {
  let filtered = content.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }

  if (selectedStatus.value) {
    const isPublished = selectedStatus.value === 'published';
    filtered = filtered.filter(item => item.isPublished === isPublished);
  }

  return filtered;
});

// Methods
const loadContent = async () => {
  try {
    loading.value = true;
    content.value = await apiService.getBusinessContent();
  } catch (error) {
    console.error('Failed to load content:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  formData.value = {
    title: '',
    content: '',
    category: '' as BusinessContent['category'],
    isPublished: false,
  };
  editingId.value = null;
  showModal.value = true;
};

const editContent = (item: BusinessContent) => {
  isEditing.value = true;
  formData.value = {
    title: item.title,
    content: item.content,
    category: item.category,
    isPublished: item.isPublished,
  };
  editingId.value = item.id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    title: '',
    content: '',
    category: '' as BusinessContent['category'],
    isPublished: false,
  };
  editingId.value = null;
};

const saveContent = async () => {
  try {
    saving.value = true;
    
    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateBusinessContent(editingId.value, formData.value);
      const index = content.value.findIndex(item => item.id === editingId.value);
      if (index !== -1) {
        content.value[index] = updated;
      }
    } else {
      const created = await apiService.createBusinessContent(formData.value);
      content.value.unshift(created);
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save content:', error);
  } finally {
    saving.value = false;
  }
};

const togglePublishStatus = async (item: BusinessContent) => {
  try {
    const updated = await apiService.updateBusinessContent(item.id, {
      isPublished: !item.isPublished
    });
    const index = content.value.findIndex(c => c.id === item.id);
    if (index !== -1) {
      content.value[index] = updated;
    }
  } catch (error) {
    console.error('Failed to update publish status:', error);
  }
};

const deleteContent = (item: BusinessContent) => {
  contentToDelete.value = item;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  contentToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!contentToDelete.value) return;
  
  try {
    deleting.value = true;
    await apiService.deleteBusinessContent(contentToDelete.value.id);
    content.value = content.value.filter(item => item.id !== contentToDelete.value!.id);
    showDeleteModal.value = false;
    contentToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete content:', error);
  } finally {
    deleting.value = false;
  }
};

const getCategoryClass = (category: BusinessContent['category']) => {
  const classes = {
    'company-info': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'team': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'strategy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'general': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return classes[category] || classes.general;
};

const getCategoryLabel = (category: BusinessContent['category']) => {
  const labels = {
    'company-info': 'Company Info',
    'team': 'Team',
    'strategy': 'Strategy',
    'general': 'General',
  };
  return labels[category] || 'General';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Initialize
onMounted(() => {
  loadContent();
});
</script>