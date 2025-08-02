<!-- 공통 테이블 컴포넌트 -->
<template>
  <div class="overflow-hidden bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- 테이블 헤더 -->
    <div v-if="title || $slots.header" class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div v-if="title">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="description" class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
        <slot name="header" />
      </div>
    </div>

    <!-- 필터 및 검색 영역 -->
    <div v-if="$slots.filters" class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <slot name="filters" />
    </div>

    <!-- 테이블 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center">
                {{ column.label }}
                <template v-if="column.sortable">
                  <svg
                    v-if="sortKey === column.key && sortOrder === 'asc'"
                    class="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg
                    v-else-if="sortKey === column.key && sortOrder === 'desc'"
                    class="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <svg
                    v-else
                    class="ml-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </template>
              </div>
            </th>
            <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          <tr
            v-for="(item, index) in sortedData"
            :key="getRowKey(item, index)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                {{ formatCellValue(item, column) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item" :index="index" />
            </td>
          </tr>
          
          <!-- 데이터가 없을 때 -->
          <tr v-if="!data || data.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <slot name="empty">
                <div class="flex flex-col items-center">
                  <svg class="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
                  <p class="text-lg font-medium mb-2">데이터가 없습니다</p>
                  <p class="text-sm">표시할 항목이 없습니다.</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="pagination" class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          :disabled="pagination.currentPage <= 1"
          @click="$emit('page-change', pagination.currentPage - 1)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <button
          :disabled="pagination.currentPage >= pagination.totalPages"
          @click="$emit('page-change', pagination.currentPage + 1)"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            총 <span class="font-medium">{{ pagination.total }}</span>개 중
            <span class="font-medium">{{ ((pagination.currentPage - 1) * pagination.perPage) + 1 }}</span>-<span class="font-medium">{{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }}</span>개 표시
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- 이전 페이지 -->
            <button
              :disabled="pagination.currentPage <= 1"
              @click="$emit('page-change', pagination.currentPage - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 페이지 번호들 -->
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="$emit('page-change', page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.currentPage
                    ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ...
              </span>
            </template>
            
            <!-- 다음 페이지 -->
            <button
              :disabled="pagination.currentPage >= pagination.totalPages"
              @click="$emit('page-change', pagination.currentPage + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, item: any) => string;
  width?: string;
}

interface TablePagination {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

interface Props {
  title?: string;
  description?: string;
  columns: TableColumn[];
  data: any[];
  pagination?: TablePagination;
  rowKey?: string | ((item: any, index: number) => string | number);
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id'
});

const emit = defineEmits<{
  'sort-change': [key: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
}>();

const sortKey = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');

// 정렬 처리
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  emit('sort-change', key, sortOrder.value);
};

// 정렬된 데이터
const sortedData = computed(() => {
  if (!sortKey.value) return props.data;
  
  return [...props.data].sort((a, b) => {
    const aValue = getNestedValue(a, sortKey.value);
    const bValue = getNestedValue(b, sortKey.value);
    
    let result = 0;
    if (aValue < bValue) result = -1;
    else if (aValue > bValue) result = 1;
    
    return sortOrder.value === 'desc' ? -result : result;
  });
});

// 중첩된 객체의 값 가져오기
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// 셀 값 포맷팅
const formatCellValue = (item: any, column: TableColumn): string => {
  const value = getNestedValue(item, column.key);
  if (column.formatter) {
    return column.formatter(value, item);
  }
  return value?.toString() || '';
};

// 행 키 가져오기
const getRowKey = (item: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index);
  }
  return getNestedValue(item, props.rowKey) || index;
};

// 표시할 페이지 번호들
const visiblePages = computed(() => {
  if (!props.pagination) return [];
  
  const { currentPage, totalPages } = props.pagination;
  const pages: (number | string)[] = [];
  
  // 페이지가 7개 이하면 모두 표시
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 현재 페이지 기준으로 앞뒤 2개씩 표시
    pages.push(1);
    
    if (currentPage > 4) {
      pages.push('...');
    }
    
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
});
</script>