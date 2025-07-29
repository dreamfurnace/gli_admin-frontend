<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Token Usage Destinations</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage destinations where GLIB/GLID tokens can be used</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Destination
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Destinations</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ destinations.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Resorts</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ resortCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Goods</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ goodsCount }}</p>
          </div>
        </div>
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
              placeholder="Search destinations..."
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
            <option value="resort">Resort</option>
            <option value="goods">Goods</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="lg:w-48">
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading destinations...</span>
      </div>
    </div>

    <!-- Destinations Grid -->
    <div v-else-if="filteredDestinations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="destination in filteredDestinations"
        :key="destination.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg v-if="destination.category === 'resort'" class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <svg v-else-if="destination.category === 'goods'" class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <svg v-else class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ destination.name }}</h3>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getCategoryClass(destination.category)">
                  {{ getCategoryLabel(destination.category) }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="destination.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                {{ destination.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ destination.address }}</p>

          <!-- Token Acceptance -->
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accepted Tokens:</p>
            <div class="flex space-x-2">
              <span
                v-for="token in destination.acceptedTokens"
                :key="token"
                class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                :class="token === 'GLIB' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'"
              >
                {{ token }}
              </span>
            </div>
          </div>

          <!-- Exchange Rate -->
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exchange Rate: <span class="text-green-600 dark:text-green-400 font-bold">{{ destination.exchangeRate }}x</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Created {{ formatDate(destination.createdAt) }}
            </p>
            <div class="flex items-center space-x-2">
              <button
                @click="editDestination(destination)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="toggleActiveStatus(destination)"
                :class="destination.isActive 
                  ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                :title="destination.isActive ? 'Deactivate' : 'Activate'"
              >
                <svg v-if="destination.isActive" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              <button
                @click="deleteDestination(destination)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No destinations found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery || selectedCategory || selectedStatus ? 'Try adjusting your filters' : 'Create your first token usage destination to get started' }}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Destination
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Destination' : 'Create New Destination' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveDestination" class="p-6 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination name"
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
              <option value="resort">Resort</option>
              <option value="goods">Goods</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input
              v-model="formData.address"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address or location"
            />
          </div>

          <!-- Accepted Tokens -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accepted Tokens</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="formData.acceptedTokens"
                  type="checkbox"
                  value="GLIB"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">GLIB Token</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.acceptedTokens"
                  type="checkbox"
                  value="GLID"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">GLID Token</span>
              </label>
            </div>
          </div>

          <!-- Exchange Rate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exchange Rate</label>
            <input
              v-model.number="formData.exchangeRate"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="1.0"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Exchange rate multiplier (e.g., 1.0 = face value, 0.95 = 5% discount)</p>
          </div>

          <!-- Active Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="formData.isActive"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active destination</span>
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delete Destination</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete "{{ destinationToDelete?.name }}"?
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
import type { TokenDestination } from '@/types/api';

// Reactive state
const destinations = ref<TokenDestination[]>([]);
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
const destinationToDelete = ref<TokenDestination | null>(null);

// Form data
const formData = ref({
  name: '',
  category: '' as TokenDestination['category'],
  address: '',
  acceptedTokens: [] as ('GLIB' | 'GLID')[],
  exchangeRate: 1.0,
  isActive: true,
});

const editingId = ref<number | null>(null);

// Computed properties
const filteredDestinations = computed(() => {
  let filtered = destinations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }

  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active';
    filtered = filtered.filter(item => item.isActive === isActive);
  }

  return filtered;
});

const activeCount = computed(() => destinations.value.filter(d => d.isActive).length);
const resortCount = computed(() => destinations.value.filter(d => d.category === 'resort').length);
const goodsCount = computed(() => destinations.value.filter(d => d.category === 'goods').length);

// Methods
const loadDestinations = async () => {
  try {
    loading.value = true;
    destinations.value = await apiService.getTokenDestinations();
  } catch (error) {
    console.error('Failed to load destinations:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  formData.value = {
    name: '',
    category: '' as TokenDestination['category'],
    address: '',
    acceptedTokens: [],
    exchangeRate: 1.0,
    isActive: true,
  };
  editingId.value = null;
  showModal.value = true;
};

const editDestination = (item: TokenDestination) => {
  isEditing.value = true;
  formData.value = {
    name: item.name,
    category: item.category,
    address: item.address,
    acceptedTokens: [...item.acceptedTokens],
    exchangeRate: item.exchangeRate,
    isActive: item.isActive,
  };
  editingId.value = item.id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    name: '',
    category: '' as TokenDestination['category'],
    address: '',
    acceptedTokens: [],
    exchangeRate: 1.0,
    isActive: true,
  };
  editingId.value = null;
};

const saveDestination = async () => {
  try {
    saving.value = true;
    
    if (isEditing.value && editingId.value) {
      const updated = await apiService.updateTokenDestination(editingId.value, formData.value);
      const index = destinations.value.findIndex(item => item.id === editingId.value);
      if (index !== -1) {
        destinations.value[index] = updated;
      }
    } else {
      const created = await apiService.createTokenDestination(formData.value);
      destinations.value.unshift(created);
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save destination:', error);
  } finally {
    saving.value = false;
  }
};

const toggleActiveStatus = async (item: TokenDestination) => {
  try {
    const updated = await apiService.updateTokenDestination(item.id, {
      isActive: !item.isActive
    });
    const index = destinations.value.findIndex(d => d.id === item.id);
    if (index !== -1) {
      destinations.value[index] = updated;
    }
  } catch (error) {
    console.error('Failed to update active status:', error);
  }
};

const deleteDestination = (item: TokenDestination) => {
  destinationToDelete.value = item;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  destinationToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!destinationToDelete.value) return;
  
  try {
    deleting.value = true;
    await apiService.deleteTokenDestination(destinationToDelete.value.id);
    destinations.value = destinations.value.filter(item => item.id !== destinationToDelete.value!.id);
    showDeleteModal.value = false;
    destinationToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete destination:', error);
  } finally {
    deleting.value = false;
  }
};

const getCategoryClass = (category: TokenDestination['category']) => {
  const classes = {
    'resort': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'goods': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'service': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return classes[category] || classes.other;
};

const getCategoryLabel = (category: TokenDestination['category']) => {
  const labels = {
    'resort': 'Resort',
    'goods': 'Goods',
    'service': 'Service',
    'other': 'Other',
  };
  return labels[category] || 'Other';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Initialize
onMounted(() => {
  loadDestinations();
});
</script>