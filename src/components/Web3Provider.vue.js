import { onMounted, provide, ref } from 'vue';
import { supportedChains } from '@/config/web3';
// Web3 state management
const isConnected = ref(false);
const address = ref('');
const chainId = ref(1);
const isConnecting = ref(false);
// supportedChains is imported from config/web3.ts
// Web3 connection methods
const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask or compatible wallet not found');
    }
    try {
        isConnecting.value = true;
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
            address.value = accounts[0];
            isConnected.value = true;
            // Get chain ID
            const chainIdHex = await window.ethereum.request({
                method: 'eth_chainId',
            });
            chainId.value = parseInt(chainIdHex, 16);
            console.log('🦄 GLI Wallet connected:', address.value, 'Chain:', chainId.value);
        }
    }
    catch (error) {
        console.error('❌ Failed to connect wallet:', error);
        throw error;
    }
    finally {
        isConnecting.value = false;
    }
};
const disconnectWallet = () => {
    isConnected.value = false;
    address.value = '';
    chainId.value = 1;
    console.log('🔌 GLI Wallet disconnected');
};
const switchChain = async (targetChainId) => {
    if (!window.ethereum)
        return;
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
        chainId.value = targetChainId;
    }
    catch (error) {
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
const addChainToWallet = async (chain) => {
    if (!window.ethereum)
        return;
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
    }
    catch (error) {
        console.error('Failed to add chain:', error);
        throw error;
    }
};
// Listen for account and chain changes
const setupEventListeners = () => {
    if (!window.ethereum)
        return;
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
        }
        else {
            address.value = accounts[0];
            console.log('🔄 GLI Account changed:', address.value);
        }
    });
    window.ethereum.on('chainChanged', (chainIdHex) => {
        chainId.value = parseInt(chainIdHex, 16);
        console.log('🔄 GLI Chain changed:', chainId.value);
    });
};
// Check if already connected
const checkConnection = async () => {
    if (!window.ethereum)
        return;
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts',
        });
        if (accounts.length > 0) {
            address.value = accounts[0];
            isConnected.value = true;
            const chainIdHex = await window.ethereum.request({
                method: 'eth_chainId',
            });
            chainId.value = parseInt(chainIdHex, 16);
        }
    }
    catch (error) {
        console.error('Failed to check connection:', error);
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Web3Provider.vue.js.map