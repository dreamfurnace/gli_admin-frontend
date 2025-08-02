<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shopping Mall Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage shopping categories, products, and orders</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab.name }}
          <span v-if="tab.count !== undefined" class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'" class="space-y-6">
      <ShoppingCategoriesManager @category-updated="loadCategoriesData" />
    </div>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'" class="space-y-6">
      <ShoppingProductsManager @product-updated="loadProductsData" />
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'" class="space-y-6">
      <ShoppingOrdersManager @order-updated="loadOrdersData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ShoppingCategoriesManager from '@/components/shopping/ShoppingCategoriesManager.vue';
import ShoppingProductsManager from '@/components/shopping/ShoppingProductsManager.vue';
import ShoppingOrdersManager from '@/components/shopping/ShoppingOrdersManager.vue';
import { apiService } from '@/services/api';

// Tab management
const activeTab = ref('categories');

// Data counts
const categoriesCount = ref(0);
const productsCount = ref(0);
const ordersCount = ref(0);

const tabs = computed(() => [
  { id: 'categories', name: 'Categories', count: categoriesCount.value },
  { id: 'products', name: 'Products', count: productsCount.value },
  { id: 'orders', name: 'Orders', count: ordersCount.value },
]);

// Data loading methods
const loadCategoriesData = async () => {
  try {
    const categories = await apiService.getShoppingCategories();
    categoriesCount.value = categories.length;
  } catch (error) {
    console.error('Failed to load categories count:', error);
  }
};

const loadProductsData = async () => {
  try {
    const products = await apiService.getShoppingProducts();
    productsCount.value = products.length;
  } catch (error) {
    console.error('Failed to load products count:', error);
  }
};

const loadOrdersData = async () => {
  try {
    const orders = await apiService.getShoppingOrders();
    ordersCount.value = orders.length;
  } catch (error) {
    console.error('Failed to load orders count:', error);
  }
};

// Initialize
onMounted(async () => {
  await Promise.all([
    loadCategoriesData(),
    loadProductsData(),
    loadOrdersData(),
  ]);
});
</script>