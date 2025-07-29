<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Member Transaction Monitoring</h1>
          <p class="text-gray-600 dark:text-gray-400">Monitor member token deposits, withdrawals, and internal transactions</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportTransactions"
            class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export
          </button>
          <button
            @click="refreshTransactions"
            :disabled="loading"
            class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-2" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalTransactions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Deposits</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ depositsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Withdrawals</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ withdrawalsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Transfers</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ transfersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <!-- Search by Member -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Member</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by email or ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- Transaction Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="exchange">Exchange</option>
          </select>
        </div>

        <!-- Token Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Token</label>
          <select
            v-model="selectedToken"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Tokens</option>
            <option value="GLIB">GLIB</option>
            <option value="GLID">GLID</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
          <select
            v-model="selectedDateRange"
            @change="applyDateRange"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div v-if="selectedDateRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
          <input
            v-model="fromDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
          <input
            v-model="toDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading transactions...</span>
      </div>
    </div>

    <!-- Transactions Table -->
    <div v-else-if="filteredTransactions.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Member
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Token & Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ID: {{ transaction.memberId }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ transaction.memberEmail }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getTypeClass(transaction.type)">
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2"
                    :class="transaction.tokenType === 'GLIB' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                    {{ transaction.tokenType }}
                  </span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatAmount(transaction.amount) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(transaction.status)">
                  {{ getStatusLabel(transaction.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(transaction.createdAt) }}
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="viewTransactionDetail(transaction)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="View Details"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-600 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of {{ filteredTransactions.length }} transactions
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ hasFilters ? 'Try adjusting your filters to see more transactions' : 'No member transactions available yet' }}
        </p>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <div v-if="showDetailModal && selectedTransaction" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Transaction Details</h3>
            <button
              @click="closeDetailModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Transaction ID -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.id }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(selectedTransaction.status)">
                {{ getStatusLabel(selectedTransaction.status) }}
              </span>
            </div>
          </div>

          <!-- Member Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Member ID</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.memberId }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Email</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.memberEmail }}</p>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getTypeClass(selectedTransaction.type)">
                {{ getTypeLabel(selectedTransaction.type) }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Token & Amount</p>
              <div class="flex items-center">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2"
                  :class="selectedTransaction.tokenType === 'GLIB' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                  {{ selectedTransaction.tokenType }}
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatAmount(selectedTransaction.amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Transaction Hash -->
          <div v-if="selectedTransaction.transactionHash">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
            <p class="text-sm text-gray-900 dark:text-white font-mono break-all">{{ selectedTransaction.transactionHash }}</p>
          </div>

          <!-- Timestamps -->
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDetailDate(selectedTransaction.createdAt) }}</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
          <button
            @click="closeDetailModal"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import type { MemberTransaction } from '@/types/api';

// Reactive state
const transactions = ref<MemberTransaction[]>([]);
const loading = ref(false);

// Filter states
const searchQuery = ref('');
const selectedType = ref('');
const selectedToken = ref('');
const selectedStatus = ref('');
const selectedDateRange = ref('');
const fromDate = ref('');
const toDate = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Modal state
const showDetailModal = ref(false);
const selectedTransaction = ref<MemberTransaction | null>(null);

// Computed properties
const filteredTransactions = computed(() => {
  let filtered = transactions.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.memberEmail.toLowerCase().includes(query) ||
      item.memberId.toString().includes(query)
    );
  }

  if (selectedType.value) {
    filtered = filtered.filter(item => item.type === selectedType.value);
  }

  if (selectedToken.value) {
    filtered = filtered.filter(item => item.tokenType === selectedToken.value);
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value);
  }

  if (fromDate.value && toDate.value) {
    const from = new Date(fromDate.value);
    const to = new Date(toDate.value);
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= from && itemDate <= to;
    });
  }

  return filtered;
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
});

const hasFilters = computed(() => {
  return searchQuery.value || selectedType.value || selectedToken.value || selectedStatus.value || selectedDateRange.value;
});

// Statistics
const totalTransactions = computed(() => transactions.value.length);
const depositsCount = computed(() => transactions.value.filter(t => t.type === 'deposit').length);
const withdrawalsCount = computed(() => transactions.value.filter(t => t.type === 'withdrawal').length);
const transfersCount = computed(() => transactions.value.filter(t => t.type === 'transfer').length);

// Methods
const loadTransactions = async () => {
  try {
    loading.value = true;
    transactions.value = await apiService.getMemberTransactions();
  } catch (error) {
    console.error('Failed to load transactions:', error);
  } finally {
    loading.value = false;
  }
};

const refreshTransactions = () => {
  loadTransactions();
};

const exportTransactions = () => {
  // Implementation for CSV export
  const csvContent = generateCSV(filteredTransactions.value);
  downloadCSV(csvContent, 'member-transactions.csv');
};

const generateCSV = (data: MemberTransaction[]): string => {
  const headers = ['ID', 'Member ID', 'Member Email', 'Type', 'Token Type', 'Amount', 'Status', 'Created At', 'Transaction Hash'];
  const rows = data.map(transaction => [
    transaction.id,
    transaction.memberId,
    transaction.memberEmail,
    transaction.type,
    transaction.tokenType,
    transaction.amount,
    transaction.status,
    transaction.createdAt,
    transaction.transactionHash || ''
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const applyDateRange = () => {
  const now = new Date();
  
  switch (selectedDateRange.value) {
    case 'today':
      fromDate.value = toDate.value = now.toISOString().split('T')[0];
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      fromDate.value = weekAgo.toISOString().split('T')[0];
      toDate.value = now.toISOString().split('T')[0];
      break;
    case 'month':
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      fromDate.value = monthAgo.toISOString().split('T')[0];
      toDate.value = now.toISOString().split('T')[0];
      break;
    case 'quarter':
      const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      fromDate.value = quarterAgo.toISOString().split('T')[0];
      toDate.value = now.toISOString().split('T')[0];
      break;
    default:
      fromDate.value = toDate.value = '';
  }
};

const viewTransactionDetail = (transaction: MemberTransaction) => {
  selectedTransaction.value = transaction;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedTransaction.value = null;
};

// Utility methods
const getTypeClass = (type: MemberTransaction['type']) => {
  const classes = {
    'deposit': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'withdrawal': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'transfer': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'exchange': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

const getTypeLabel = (type: MemberTransaction['type']) => {
  const labels = {
    'deposit': 'Deposit',
    'withdrawal': 'Withdrawal',
    'transfer': 'Transfer',
    'exchange': 'Exchange',
  };
  return labels[type] || type;
};

const getStatusClass = (status: MemberTransaction['status']) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

const getStatusLabel = (status: MemberTransaction['status']) => {
  const labels = {
    'pending': 'Pending',
    'completed': 'Completed',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
  };
  return labels[status] || status;
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount);
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

const formatDetailDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Initialize
onMounted(() => {
  loadTransactions();
});
</script>