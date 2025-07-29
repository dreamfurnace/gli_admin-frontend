<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Member Authentication Status</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage member authentication levels and approval processes</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="refreshAuthStatus"
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalMembers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400 font-bold text-sm">R</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">R Level</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ rLevelCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">W</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">W Level</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ wLevelCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">X</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">X Level</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ xLevelCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search by Member -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Member</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- Auth Level Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Level</label>
          <select
            v-model="selectedLevel"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Levels</option>
            <option value="none">None</option>
            <option value="R">R Level</option>
            <option value="W">W Level</option>
            <option value="X">X Level</option>
          </select>
        </div>

        <!-- KYC Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KYC Status</label>
          <select
            v-model="selectedKycStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <!-- Pending Approvals Only -->
        <div class="flex items-end">
          <label class="flex items-center">
            <input
              v-model="showPendingOnly"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Pending approvals only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading member authentication status...</span>
      </div>
    </div>

    <!-- Members List -->
    <div v-else-if="filteredMembers.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Member Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Auth Level
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                KYC Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Verifications
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Verification
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="member in paginatedMembers" :key="member.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ID: {{ member.memberId }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ member.memberEmail }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getAuthLevelClass(member.authLevel)">
                    {{ getAuthLevelLabel(member.authLevel) }}
                  </span>
                  <span v-if="member.pendingLevel" class="text-xs text-gray-500 dark:text-gray-400">
                    → {{ member.pendingLevel }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getKycStatusClass(member.kycStatus)">
                  {{ getKycStatusLabel(member.kycStatus) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-1">
                  <div v-if="member.documentsSubmitted" class="w-2 h-2 bg-green-400 rounded-full" title="Documents Submitted"></div>
                  <div v-else class="w-2 h-2 bg-gray-300 rounded-full" title="Documents Not Submitted"></div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(member.lastVerificationDate) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewMemberDetail(member)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="member.kycStatus === 'pending'"
                    @click="approveMember(member)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Approve"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    v-if="member.kycStatus === 'pending'"
                    @click="rejectMember(member)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Reject"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
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
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredMembers.length) }} of {{ filteredMembers.length }} members
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ hasFilters ? 'Try adjusting your filters to see more members' : 'No member authentication records available yet' }}
        </p>
      </div>
    </div>

    <!-- Member Detail Modal -->
    <div v-if="showDetailModal && selectedMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Member Authentication Details</h3>
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
        
        <div class="p-6 space-y-6">
          <!-- Member Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Member ID</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedMember.memberId }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedMember.memberEmail }}</p>
            </div>
          </div>

          <!-- Auth Level & KYC Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Authentication Level</p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getAuthLevelClass(selectedMember.authLevel)">
                  {{ getAuthLevelLabel(selectedMember.authLevel) }}
                </span>
                <span v-if="selectedMember.pendingLevel" class="text-xs text-gray-500 dark:text-gray-400">
                  → {{ selectedMember.pendingLevel }} (Pending)
                </span>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">KYC Status</p>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                :class="getKycStatusClass(selectedMember.kycStatus)">
                {{ getKycStatusLabel(selectedMember.kycStatus) }}
              </span>
            </div>
          </div>

          <!-- Verification Status -->
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Verification Status</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Documents Submitted</span>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="selectedMember.documentsSubmitted 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                    {{ selectedMember.documentsSubmitted ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Verification</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDetailDate(selectedMember.lastVerificationDate) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDetailDate(selectedMember.createdAt) }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="selectedMember.kycStatus === 'pending'" class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              @click="approveMember(selectedMember)"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Approve
            </button>
            <button
              @click="rejectMember(selectedMember)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject
            </button>
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

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Reject Authentication</h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Please provide a reason for rejecting this authentication request:
          </p>
          <textarea
            v-model="rejectionReason"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Enter rejection reason..."
          ></textarea>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
          <button
            @click="cancelReject"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectionReason.trim() || rejecting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center"
          >
            <div v-if="rejecting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ rejecting ? 'Rejecting...' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import type { MemberAuthStatus } from '@/types/api';

// Reactive state
const members = ref<MemberAuthStatus[]>([]);
const loading = ref(false);
const rejecting = ref(false);

// Filter states
const searchQuery = ref('');
const selectedLevel = ref('');
const selectedKycStatus = ref('');
const showPendingOnly = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Modal states
const showDetailModal = ref(false);
const showRejectModal = ref(false);
const selectedMember = ref<MemberAuthStatus | null>(null);
const rejectionReason = ref('');

// Computed properties
const filteredMembers = computed(() => {
  let filtered = members.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.memberEmail.toLowerCase().includes(query) ||
      item.memberId.toString().includes(query)
    );
  }

  if (selectedLevel.value) {
    filtered = filtered.filter(item => item.authLevel === selectedLevel.value);
  }

  if (selectedKycStatus.value) {
    filtered = filtered.filter(item => item.kycStatus === selectedKycStatus.value);
  }

  if (showPendingOnly.value) {
    filtered = filtered.filter(item => item.kycStatus === 'pending');
  }

  return filtered;
});

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMembers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / itemsPerPage.value);
});

const hasFilters = computed(() => {
  return searchQuery.value || selectedLevel.value || selectedKycStatus.value || showPendingOnly.value;
});

// Statistics
const totalMembers = computed(() => members.value.length);
const pendingCount = computed(() => members.value.filter(m => m.kycStatus === 'pending').length);
const rLevelCount = computed(() => members.value.filter(m => m.authLevel === 'basic').length);
const wLevelCount = computed(() => members.value.filter(m => m.authLevel === 'verified').length);
const xLevelCount = computed(() => members.value.filter(m => m.authLevel === 'premium').length);

// Methods
const loadAuthStatus = async () => {
  try {
    loading.value = true;
    members.value = await apiService.getMemberAuthStatus();
  } catch (error) {
    console.error('Failed to load auth status:', error);
  } finally {
    loading.value = false;
  }
};

const refreshAuthStatus = () => {
  loadAuthStatus();
};

const viewMemberDetail = (member: MemberAuthStatus) => {
  selectedMember.value = member;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedMember.value = null;
};

const approveMember = async (member: MemberAuthStatus) => {
  try {
    // In a real implementation, this would call an API
    console.log('🎉 Approved member:', member.memberEmail);
    
    // Update local state
    const index = members.value.findIndex(m => m.id === member.id);
    if (index !== -1) {
      members.value[index] = {
        ...members.value[index],
        kycStatus: 'approved',
        lastVerificationDate: new Date().toISOString(),
      };
    }
    
    if (showDetailModal.value) {
      closeDetailModal();
    }
  } catch (error) {
    console.error('Failed to approve member:', error);
  }
};

const rejectMember = (member: MemberAuthStatus) => {
  selectedMember.value = member;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const cancelReject = () => {
  showRejectModal.value = false;
  selectedMember.value = null;
  rejectionReason.value = '';
};

const confirmReject = async () => {
  if (!selectedMember.value || !rejectionReason.value.trim()) return;
  
  try {
    rejecting.value = true;
    
    // In a real implementation, this would call an API
    console.log('❌ Rejected member:', selectedMember.value.memberEmail, 'Reason:', rejectionReason.value);
    
    // Update local state
    const index = members.value.findIndex(m => m.id === selectedMember.value!.id);
    if (index !== -1) {
      members.value[index] = {
        ...members.value[index],
        kycStatus: 'rejected',
        lastVerificationDate: new Date().toISOString(),
      };
    }
    
    showRejectModal.value = false;
    if (showDetailModal.value) {
      closeDetailModal();
    }
  } catch (error) {
    console.error('Failed to reject member:', error);
  } finally {
    rejecting.value = false;
  }
};

// Utility methods
const getAuthLevelClass = (level: MemberAuthStatus['authLevel']) => {
  const classes = {
    'none': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'basic': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'verified': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  return classes[level] || classes.none;
};

const getAuthLevelLabel = (level: MemberAuthStatus['authLevel']) => {
  const labels = {
    'none': 'None',
    'basic': 'R Level',
    'verified': 'W Level',
    'premium': 'X Level',
  };
  return labels[level] || 'None';
};

const getKycStatusClass = (status: MemberAuthStatus['kycStatus']) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'expired': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return classes[status] || classes.pending;
};

const getKycStatusLabel = (status: MemberAuthStatus['kycStatus']) => {
  const labels = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'expired': 'Expired',
  };
  return labels[status] || 'Unknown';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
  loadAuthStatus();
});
</script>