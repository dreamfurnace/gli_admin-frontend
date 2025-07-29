// GLI Web3 Configuration
import { mainnet, sepolia, polygon, polygonMumbai } from 'viem/chains';

// GLI Token Contract Addresses
export const TOKEN_CONTRACTS = {
  GLIB: {
    mainnet: '0x...', // Mainnet GLIB contract address (placeholder)
    sepolia: '0x...', // Sepolia GLIB contract address (placeholder)
    polygon: '0x...', // Polygon GLIB contract address (placeholder)
    mumbai: '0x...', // Mumbai GLIB contract address (placeholder)
  },
  GLID: {
    mainnet: '0x...', // Mainnet GLID contract address (placeholder)
    sepolia: '0x...', // Sepolia GLID contract address (placeholder)
    polygon: '0x...', // Polygon GLID contract address (placeholder)
    mumbai: '0x...', // Mumbai GLID contract address (placeholder)
  },
} as const;

// Supported chains for GLI Platform
export const supportedChains = [
  mainnet,
  polygon,
  ...(import.meta.env.MODE === 'development' ? [sepolia, polygonMumbai] : []),
];

// ERC20 Token ABI (minimal for GLI tokens)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
] as const;

// Utility functions
export const getTokenContract = (tokenType: 'GLIB' | 'GLID', chainId: number) => {
  const chainName = getChainName(chainId);
  return TOKEN_CONTRACTS[tokenType][chainName as keyof typeof TOKEN_CONTRACTS.GLIB];
};

export const getChainName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 11155111:
      return 'sepolia';
    case 137:
      return 'polygon';
    case 80001:
      return 'mumbai';
    default:
      return 'mainnet';
  }
};

export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(4);
};

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));
};