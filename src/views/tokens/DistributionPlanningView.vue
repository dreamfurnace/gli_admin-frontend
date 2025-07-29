<template>
    <div class="p-6">
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Token Distribution Planning</h1>
                <p class="text-gray-600 dark:text-gray-400">Manage and execute token distribution plans for GLIB and GLID tokens</p>
            </div>
            <button
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>New Distribution Plan</span>
            </button>
        </div>

        <!-- Filters and Statistics -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plans</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ distributionPlans.length }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div class="flex items-center">
                    <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Executed</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ executedPlansCount }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingPlansCount }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div class="flex items-center">
                    <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tokens</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalTokensPlanned.toLocaleString() }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Distribution Plans List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Distribution Plans</h3>
            </div>
            
            <div v-if="loading" class="p-6">
                <div class="animate-pulse space-y-4">
                    <div v-for="i in 3" :key="i" class="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            <div v-else-if="distributionPlans.length === 0" class="p-6">
                <div class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No distribution plans</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new distribution plan.</p>
                    <div class="mt-6">
                        <button
                            @click="showCreateModal = true"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Create Distribution Plan
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Plan Name
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Token Type
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Amount
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Recipients
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Scheduled Date
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="plan in distributionPlans" :key="plan.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4">
                                <div>
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ plan.name }}</div>
                                    <div v-if="plan.description" class="text-sm text-gray-500 dark:text-gray-400">{{ plan.description }}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                      :class="plan.tokenType === 'GLIB' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                                    {{ plan.tokenType }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {{ plan.totalAmount.toLocaleString() }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {{ plan.recipients.length }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                      :class="getStatusColor(plan.status)">
                                    {{ getStatusText(plan.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(plan.scheduledDate) }}
                            </td>
                            <td class="px-6 py-4 text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="viewPlan(plan)"
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View
                                    </button>
                                    <button
                                        v-if="plan.status === 'draft'"
                                        @click="editPlan(plan)"
                                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        v-if="plan.status === 'draft'"
                                        @click="approvePlan(plan)"
                                        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        v-if="plan.status === 'approved'"
                                        @click="executePlan(plan)"
                                        class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                    >
                                        Execute
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal (placeholder) -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Create Distribution Plan</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Distribution plan creation form will be implemented here.</p>
                <div class="flex justify-end space-x-3">
                    <button
                        @click="showCreateModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        @click="showCreateModal = false"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create Plan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import { errorHandler } from '@/utils/errorHandler';
import type { TokenDistributionPlan } from '@/types/api';

// State
const distributionPlans = ref<TokenDistributionPlan[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);

// Computed properties
const executedPlansCount = computed(() => 
  distributionPlans.value.filter(plan => plan.status === 'executed').length
);

const pendingPlansCount = computed(() => 
  distributionPlans.value.filter(plan => ['draft', 'pending_approval', 'approved'].includes(plan.status)).length
);

const totalTokensPlanned = computed(() => 
  distributionPlans.value.reduce((total, plan) => total + plan.totalAmount, 0)
);

// Methods
const loadDistributionPlans = async () => {
  try {
    loading.value = true;
    distributionPlans.value = await apiService.getDistributionPlans();
  } catch (error) {
    console.error('Failed to load distribution plans:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: string): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    executing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    executed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return colors[status as keyof typeof colors] || colors.draft;
};

const getStatusText = (status: string): string => {
  const texts = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    executing: 'Executing',
    executed: 'Executed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return texts[status as keyof typeof texts] || status;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const viewPlan = (plan: TokenDistributionPlan) => {
  console.log('View plan:', plan);
  // TODO: Navigate to plan detail view
};

const editPlan = (plan: TokenDistributionPlan) => {
  console.log('Edit plan:', plan);
  // TODO: Open edit modal
};

const approvePlan = async (plan: TokenDistributionPlan) => {
  try {
    await apiService.approveDistributionPlan(plan.id);
    errorHandler.showSuccessToast(`Distribution plan "${plan.name}" approved successfully`);
    await loadDistributionPlans();
  } catch (error) {
    console.error('Failed to approve plan:', error);
  }
};

const executePlan = async (plan: TokenDistributionPlan) => {
  if (!confirm(`Are you sure you want to execute the distribution plan "${plan.name}"? This action cannot be undone.`)) {
    return;
  }

  try {
    await apiService.executeDistributionPlan(plan.id);
    errorHandler.showSuccessToast(`Distribution plan "${plan.name}" executed successfully`);
    await loadDistributionPlans();
  } catch (error) {
    console.error('Failed to execute plan:', error);
  }
};

// Lifecycle
onMounted(() => {
  loadDistributionPlans();
});
</script>