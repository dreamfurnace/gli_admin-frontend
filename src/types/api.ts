// GLI Admin API Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  grade: {
    id: number;
    name: string;
  };
}

export interface BusinessContent {
  id: number;
  title: string;
  content: string;
  category: 'company-info' | 'team' | 'strategy' | 'general';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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