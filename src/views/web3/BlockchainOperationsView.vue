<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Blockchain Operations</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage Web3 wallet connections, token balances, and blockchain operations</p>
      </div>
      
      <!-- Wallet Connection Section -->
      <div class="min-w-fit">
        <Web3WalletButton />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Token Balances Panel -->
      <div class="lg:col-span-1">
        <Web3TokenBalance />
      </div>

      <!-- Operations Panel -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Web3 Operations</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Execute blockchain operations for GLI platform administration</p>
          </div>

          <div class="p-6">
            <!-- Network Status -->
            <div class="mb-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Network Status</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Network Connected</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400" v-if="web3?.chainId?.value">
                        Chain ID: {{ web3.chainId.value }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Contract Status</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Ready for operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="mb-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  :disabled="!web3?.isConnected?.value"
                >
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Token Transfer</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Send GLIB/GLID tokens</p>
                    </div>
                  </div>
                </button>

                <button 
                  class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  :disabled="!web3?.isConnected?.value"
                >
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Batch Operations</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Execute batch token operations</p>
                    </div>
                  </div>
                </button>

                <button 
                  class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  :disabled="!web3?.isConnected?.value"
                >
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Transaction History</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">View blockchain transactions</p>
                    </div>
                  </div>
                </button>

                <button 
                  class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  :disabled="!web3?.isConnected?.value"
                >
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Contract Settings</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Manage smart contracts</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="text-center text-gray-500 dark:text-gray-400">
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p class="text-sm">No recent blockchain activities</p>
                  <p class="text-xs">Activities will appear here once you start using Web3 operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Web3WalletButton from '@/components/Web3WalletButton.vue';
import Web3TokenBalance from '@/components/Web3TokenBalance.vue';

// Inject Web3 context from Web3Provider
const web3 = inject('web3');

console.log('🦄 GLI Blockchain Operations View loaded');
</script>