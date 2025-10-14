// GLI Admin API Types
// Auth types are imported from types/auth.ts
import type { AdminUser, LoginCredentials } from './auth';

export type { AdminUser, LoginCredentials };

export interface BusinessContent {
  id: string; // UUID in backend
  section: 'background' | 'team' | 'strategy' | 'roadmap' | 'tokens';
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  order: number;
  status: 'draft' | 'published' | 'archived';
  meta_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TokenDestination {
  id: number;
  name: string;
  category: 'resort' | 'goods' | 'service' | 'other';
  address: string;
  acceptedTokens: ('GLIB' | 'GLID')[];
  exchangeRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface TokenDistribution {
  id: number;
  name: string;
  tokenType: 'GLIB' | 'GLID';
  totalAmount: number;
  distributedAmount: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface TokenDistributionPlan {
  id: number;
  name: string;
  description?: string;
  tokenType: 'GLIB' | 'GLID';
  totalAmount: number;
  recipients: TokenDistributionRecipient[];
  scheduledDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'executing' | 'executed' | 'failed' | 'cancelled';
  createdBy: number;
  createdByEmail: string;
  approvedBy?: number;
  approvedByEmail?: string;
  executedBy?: number;
  executedByEmail?: string;
  executionResult?: TokenDistributionResult;
  createdAt: string;
  updatedAt: string;
}

export interface TokenDistributionRecipient {
  id?: number;
  userId: number;
  userEmail: string;
  userName?: string;
  amount: number;
  reason: string;
  status?: 'pending' | 'success' | 'failed';
  transactionHash?: string;
  errorMessage?: string;
}

export interface TokenDistributionResult {
  success: boolean;
  timestamp: string;
  totalRecipients: number;
  successfulRecipients: number;
  failedRecipients: number;
  transactionIds: string[];
  failedRecipientDetails?: Array<{
    userId: number;
    userEmail: string;
    reason: string;
    errorCode?: string;
  }>;
}

export interface TokenDistributionTemplate {
  id: number;
  name: string;
  description?: string;
  tokenType: 'GLIB' | 'GLID';
  recipients: Omit<TokenDistributionRecipient, 'id' | 'amount'>[];
  createdBy: number;
  createdAt: string;
}

export interface MemberTransaction {
  id: number;
  memberId: number;
  memberEmail: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'exchange';
  tokenType: 'GLIB' | 'GLID';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionHash?: string;
  createdAt: string;
}

export interface MemberAuthStatus {
  id: number;
  memberId: number;
  memberEmail: string;
  authLevel: 'basic' | 'verified' | 'premium';
  kycStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  documentsSubmitted: boolean;
  lastVerificationDate: string;
  createdAt: string;
}

export interface PlatformStatistics {
  totalMembers: number;
  totalGLIBTokens: number;
  activeTransactions: number;
  platformGrowth: number;
  monthlyActiveUsers: number;
  totalTokenDistributed: number;
  verifiedMembers: number;
  pendingVerifications: number;
}

export interface BlockchainOperation {
  id: number;
  type: 'token_transfer' | 'contract_deployment' | 'contract_interaction';
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  amount?: number;
  tokenType?: 'GLIB' | 'GLID';
  gasUsed?: number;
  gasPrice?: number;
  createdAt: string;
  completedAt?: string;
}

export interface SmartContract {
  id: number;
  name: string;
  contractAddress: string;
  contractType: 'token' | 'distribution' | 'staking' | 'governance';
  abi: string;
  isActive: boolean;
  deployedAt: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Shopping Mall Types
export interface ShoppingCategory {
  id: string; // UUID
  name: string;
  description?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingProduct {
  id: string; // UUID
  category: string; // Category ID
  name: string;
  description: string;
  short_description?: string;
  product_type: 'goods' | 'resort' | 'restaurant' | 'service';
  price_glil: string; // Decimal as string
  price_usd?: string; // Decimal as string
  stock_quantity: number;
  unlimited_stock: boolean;
  main_image_url?: string;
  image_urls: string[];
  status: 'active' | 'inactive' | 'sold_out' | 'discontinued';
  is_featured: boolean;
  tags: string[];
  attributes: Record<string, any>;
  view_count: number;
  purchase_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShoppingOrder {
  id: string; // UUID
  customer: number; // User ID
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount_glil: string; // Decimal as string
  total_amount_usd?: string; // Decimal as string
  items: ShoppingOrderItem[];
  shipping_address: Record<string, any>;
  payment_info: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingOrderItem {
  id: string; // UUID
  order: string; // Order ID
  product: string; // Product ID
  quantity: number;
  unit_price_glil: string; // Decimal as string
  unit_price_usd?: string; // Decimal as string
  total_price_glil: string; // Decimal as string
  total_price_usd?: string; // Decimal as string
  created_at: string;
  updated_at: string;
}

// Team Member Types
export interface TeamMember {
  id: string; // UUID
  image_url: string;
  position_ko: string;
  position_en: string;
  role_ko: string;
  role_en: string;
  tags: string[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Project Feature Types
export interface ProjectFeature {
  id: string; // UUID
  icon: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Strategy Phase Types
export interface StrategyPhase {
  id: string; // UUID
  icon: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  features: string[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Development Timeline Types
export interface DevelopmentTimeline {
  id: string; // UUID
  quarter: string;
  status_icon: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Token Ecosystem Types
export interface TokenEcosystem {
  id: string; // UUID
  icon: string;
  name: string;
  symbol: string;
  description_ko: string;
  description_en: string;
  features: string[];
  total_supply: string;
  current_price: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Member Types (회원 관리)
export interface Member {
  id: string; // UUID
  username: string;
  email: string;
  wallet_address?: string;
  membership_level: 'basic' | 'premium' | 'vip';
  sol_balance: string; // Decimal as string
  is_active: boolean;
  vpx_verify: number; // V(Verify) 포인트: 비트플래그 (0-7)
  vpx_partner: number; // P(Partner) 포인트: 비트플래그 (0-7)
  vpx_experience: number; // X(eXperience) 포인트: 비트플래그 (0-7)
  created_at: string;
  updated_at: string;
  last_login?: string;
  first_name?: string;
  last_name?: string;
}