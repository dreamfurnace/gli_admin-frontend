<template>
  <div class="web3-token-balance">
    <div v-if="web3.isConnected.value" class="token-balances bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
        GLI Token Balances
      </h3>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="animate-pulse">
          <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div class="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div class="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Token Balance Display -->
      <div v-else class="space-y-3">
        <!-- GLIB Balance -->
        <div class="token-item flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-blue-600 dark:text-blue-400">GL</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">GLIB</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">GLI Base Token</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatBalance(balances.glib) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">GLIB</p>
          </div>
        </div>

        <!-- GLID Balance -->
        <div class="token-item flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-green-600 dark:text-green-400">GD</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">GLID</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">GLI Dividend Token</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatBalance(balances.glid) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">GLID</p>
          </div>
        </div>

        <!-- Refresh Button -->
        <button
          @click="loadBalances"
          :disabled="loading"
          class="w-full mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>{{ loading ? 'Refreshing...' : 'Refresh Balances' }}</span>
        </button>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        <button
          @click="error = ''"
          class="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Dismiss
        </button>
      </div>
    </div>

    <!-- Not Connected State -->
    <div v-else class="not-connected bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Connect Wallet</h3>
      <p class="text-gray-600 dark:text-gray-400">Connect your wallet to view GLI token balances</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted } from 'vue';
import { getTokenContract, ERC20_ABI, formatTokenAmount } from '@/config/web3';
import { errorHandler } from '@/utils/errorHandler';

// Inject Web3 context from Web3Provider
const web3 = inject('web3') as any;

if (!web3) {
  throw new Error('Web3TokenBalance must be used within Web3Provider');
}

// Local state
const loading = ref(false);
const error = ref('');
const balances = ref({
  glib: BigInt(0),
  glid: BigInt(0),
});

// Mock token balances for development
const mockBalances = {
  glib: BigInt('5000000000000000000000'), // 5000 GLIB
  glid: BigInt('2500000000000000000000'), // 2500 GLID
};

// Methods
const loadBalances = async () => {
  if (!web3.isConnected.value || !web3.address.value) {
    return;
  }

  try {
    loading.value = true;
    error.value = '';

    // For now, use mock data since we don't have real contract addresses
    console.log('🧪 Using mock token balances for development');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    balances.value = {
      glib: mockBalances.glib,
      glid: mockBalances.glid,
    };

    console.log('💰 GLI Token balances loaded:', {
      glib: formatTokenAmount(balances.value.glib),
      glid: formatTokenAmount(balances.value.glid),
    });

    // In production, this would make actual contract calls:
    /*
    const glibContract = getTokenContract('GLIB', web3.chainId.value);
    const glidContract = getTokenContract('GLID', web3.chainId.value);
    
    if (glibContract && glidContract) {
      // Contract calls would go here using ethers or viem
      // const glibBalance = await contract.balanceOf(web3.address.value);
      // const glidBalance = await contract.balanceOf(web3.address.value);
    }
    */
  } catch (err: any) {
    console.error('❌ Failed to load token balances:', err);
    error.value = err.message || 'Failed to load token balances';
    errorHandler.showErrorToast('Failed to load token balances: ' + (err.message || 'Unknown error'));
  } finally {
    loading.value = false;
  }
};

const formatBalance = (balance: bigint): string => {
  return parseFloat(formatTokenAmount(balance)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

// Watch for wallet connection changes
watch(() => web3.isConnected.value, (isConnected) => {
  if (isConnected) {
    loadBalances();
  } else {
    balances.value = { glib: BigInt(0), glid: BigInt(0) };
  }
});

watch(() => web3.chainId.value, () => {
  if (web3.isConnected.value) {
    loadBalances();
  }
});

// Load balances on mount if already connected
onMounted(() => {
  if (web3.isConnected.value) {
    loadBalances();
  }
});
</script>

<style scoped>
.token-item {
  transition: transform 0.2s ease-in-out;
}

.token-item:hover {
  transform: translateY(-1px);
}
</style>