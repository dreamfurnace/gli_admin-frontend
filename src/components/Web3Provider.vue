<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import { supportedChains } from '@/config/web3';

// Web3 state management
const isConnected = ref(false);
const address = ref<string>('');
const chainId = ref<number>(1);
const isConnecting = ref(false);

// supportedChains is imported from config/web3.ts

// Web3 connection methods
const connectWallet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask 또는 호환 지갑을 찾을 수 없습니다. 지갑을 설치해주세요.');
  }

  try {
    isConnecting.value = true;

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts && accounts.length > 0) {
      address.value = accounts[0];
      isConnected.value = true;

      // Get chain ID
      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      });
      chainId.value = parseInt(chainIdHex, 16);

      console.log('🦄 GLI Wallet connected:', address.value, 'Chain:', chainId.value);
    } else {
      throw new Error('지갑 연결에 실패했습니다. 계정이 없습니다.');
    }
  } catch (error: any) {
    console.error('❌ Failed to connect wallet:', error);

    // 사용자 친화적인 에러 메시지 제공
    if (error.code === -32002) {
      throw new Error('지갑 연결 요청이 이미 대기 중입니다. 지갑을 확인해주세요.');
    } else if (error.code === 4001) {
      throw new Error('사용자가 지갑 연결을 거부했습니다.');
    } else if (error.message?.includes('User rejected')) {
      throw new Error('사용자가 지갑 연결을 거부했습니다.');
    } else {
      throw new Error(error.message || '지갑 연결 중 알 수 없는 오류가 발생했습니다.');
    }
  } finally {
    isConnecting.value = false;
  }
};

const disconnectWallet = () => {
  isConnected.value = false;
  address.value = '';
  chainId.value = 1;
  console.log('🔌 GLI Wallet disconnected');
};

const switchChain = async (targetChainId: number) => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${targetChainId.toString(16)}` }],
    });
    chainId.value = targetChainId;
  } catch (error: any) {
    // Chain not added to wallet
    if (error.code === 4902) {
      const chain = supportedChains.find(c => c.id === targetChainId);
      if (chain) {
        await addChainToWallet(chain);
      }
    }
    throw error;
  }
};

const addChainToWallet = async (chain: any) => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chain.id.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: chain.rpcUrls.default.http,
          blockExplorerUrls: chain.blockExplorers?.default ? [chain.blockExplorers.default.url] : [],
        },
      ],
    });
  } catch (error) {
    console.error('Failed to add chain:', error);
    throw error;
  }
};

// Listen for account and chain changes
const setupEventListeners = () => {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      address.value = accounts[0];
      console.log('🔄 GLI Account changed:', address.value);
    }
  });

  window.ethereum.on('chainChanged', (chainIdHex: string) => {
    chainId.value = parseInt(chainIdHex, 16);
    console.log('🔄 GLI Chain changed:', chainId.value);
  });
};

// Check if already connected
const checkConnection = async () => {
  // Phantom 지갑이나 MetaMask 미설치 시 안전하게 처리
  if (typeof window === 'undefined' || !window.ethereum) {
    console.log('🦊 MetaMask 또는 호환 지갑을 찾을 수 없습니다. Web3 기능을 건너뜁니다.');
    return;
  }

  try {
    // 지갑이 있는지 확인하고 계정 요청
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts && accounts.length > 0) {
      address.value = accounts[0];
      isConnected.value = true;

      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      });
      chainId.value = parseInt(chainIdHex, 16);

      console.log('✅ 지갑 연결 확인됨:', address.value, '체인:', chainId.value);
    } else {
      console.log('🔌 연결된 지갑 계정이 없습니다.');
    }
  } catch (error: any) {
    // 더 자세한 에러 정보 제공
    if (error.code === -32002) {
      console.warn('⏳ 지갑 연결 요청이 대기 중입니다. 지갑을 확인해주세요.');
    } else if (error.code === -32603) {
      console.warn('🔗 지갑 RPC 연결에 실패했습니다. 나중에 다시 시도하세요.');
    } else if (error.message?.includes('User rejected')) {
      console.warn('❌ 사용자가 지갑 연결을 거부했습니다.');
    } else {
      console.warn('⚠️  지갑 연결 확인 중 오류가 발생했습니다:', error.message || error);
    }
  }
};

// Provide Web3 context to child components
provide('web3', {
  isConnected,
  address,
  chainId,
  isConnecting,
  connectWallet,
  disconnectWallet,
  switchChain,
  supportedChains,
});

// Initialize on mount
onMounted(() => {
  setupEventListeners();
  checkConnection();
});

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
</script>