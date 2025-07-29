<template>
  <div class="web3-wallet-button">
    <!-- Connection Status Display -->
    <div v-if="!web3.isConnected.value" class="wallet-connection">
      <button
        @click="handleConnect"
        :disabled="web3.isConnecting.value"
        class="connect-button bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg v-if="web3.isConnecting.value" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <span>{{ web3.isConnecting.value ? 'Connecting...' : 'Connect Wallet' }}</span>
      </button>
    </div>

    <!-- Connected Wallet Display -->
    <div v-else class="wallet-connected bg-green-50 dark:bg-green-900 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Wallet Connected</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {{ formatAddress(web3.address.value) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Chain: {{ getChainName(web3.chainId.value) }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Chain Switch Button -->
          <button
            @click="showChainSelector = !showChainSelector"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Switch Chain
          </button>
          <!-- Disconnect Button -->
          <button
            @click="handleDisconnect"
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>

      <!-- Chain Selector Dropdown -->
      <div v-if="showChainSelector" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Select Network</h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="chain in web3.supportedChains"
            :key="chain.id"
            @click="handleSwitchChain(chain.id)"
            :disabled="web3.chainId.value === chain.id"
            class="p-2 text-left rounded border hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
            :class="{
              'border-blue-500 bg-blue-50 dark:bg-blue-900': web3.chainId.value === chain.id,
              'border-gray-200 dark:border-gray-600': web3.chainId.value !== chain.id
            }"
          >
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ chain.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ chain.id }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      <button
        @click="error = ''"
        class="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { errorHandler } from '@/utils/errorHandler';

// Inject Web3 context from Web3Provider
const web3 = inject('web3') as any;

if (!web3) {
  throw new Error('Web3WalletButton must be used within Web3Provider');
}

// Local state
const showChainSelector = ref(false);
const error = ref('');

// Methods
const handleConnect = async () => {
  try {
    error.value = '';
    await web3.connectWallet();
    console.log('🦄 GLI Wallet connected successfully');
  } catch (err: any) {
    console.error('❌ Failed to connect wallet:', err);
    error.value = err.message || 'Failed to connect wallet';
    errorHandler.showErrorToast('Failed to connect wallet: ' + (err.message || 'Unknown error'));
  }
};

const handleDisconnect = () => {
  try {
    web3.disconnectWallet();
    showChainSelector.value = false;
    error.value = '';
    console.log('🔌 GLI Wallet disconnected');
  } catch (err: any) {
    console.error('❌ Failed to disconnect wallet:', err);
    error.value = err.message || 'Failed to disconnect wallet';
  }
};

const handleSwitchChain = async (chainId: number) => {
  try {
    error.value = '';
    await web3.switchChain(chainId);
    showChainSelector.value = false;
    console.log(`🔄 GLI Chain switched to:`, chainId);
  } catch (err: any) {
    console.error('❌ Failed to switch chain:', err);
    error.value = err.message || 'Failed to switch chain';
    errorHandler.showErrorToast('Failed to switch chain: ' + (err.message || 'Unknown error'));
  }
};

const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getChainName = (chainId: number): string => {
  const chainNames: { [key: number]: string } = {
    1: 'Ethereum',
    11155111: 'Sepolia',
    137: 'Polygon',
    80001: 'Mumbai',
  };
  return chainNames[chainId] || `Chain ${chainId}`;
};
</script>

<style scoped>
.web3-wallet-button {
  min-width: 200px;
}

.connect-button {
  min-height: 40px;
}

.wallet-connected {
  min-width: 300px;
}
</style>