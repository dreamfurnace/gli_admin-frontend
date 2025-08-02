// RWA 투자 자산 관련 타입 정의
export interface RWAAsset {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  expectedReturn: number; // 예상 수익률 (%)
  riskLevel: 'low' | 'medium' | 'high';
  minimumInvestment: number;
  totalValue: number;
  currentInvestment: number;
  location?: string;
  assetType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRWAAssetRequest {
  name: string;
  shortDescription: string;
  fullDescription: string;
  images?: string[];
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  minimumInvestment: number;
  totalValue: number;
  location?: string;
  assetType: string;
}

export interface UpdateRWAAssetRequest extends Partial<CreateRWAAssetRequest> {
  isActive?: boolean;
}

export interface RWAAssetListResponse {
  assets: RWAAsset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RWAAssetFilter {
  search?: string;
  assetType?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  isActive?: boolean;
  minReturn?: number;
  maxReturn?: number;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'expectedReturn' | 'totalValue' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface RWAAssetType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface RWAInvestmentStats {
  totalAssets: number;
  activeAssets: number;
  totalValue: number;
  totalInvestment: number;
  averageReturn: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  typeDistribution: Array<{
    type: string;
    count: number;
    value: number;
  }>;
  monthlyGrowth: Array<{
    month: string;
    value: number;
    investment: number;
  }>;
}

export interface RWAAssetInvestor {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  assetId: string;
  investmentAmount: number;
  investmentDate: Date;
  currentValue?: number;
  returnRate?: number;
}

export interface RWAAssetPerformance {
  assetId: string;
  currentReturn: number;
  projectedReturn: number;
  performance: 'outperforming' | 'meeting' | 'underperforming';
  monthlyReturns: Array<{
    month: string;
    actualReturn: number;
    projectedReturn: number;
  }>;
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

// 리스크 레벨 정보
export const RISK_LEVELS = {
  low: {
    label: '낮음',
    color: 'green',
    description: '안정적인 수익을 추구하는 보수적 투자',
    range: '0-5%'
  },
  medium: {
    label: '중간',
    color: 'yellow',
    description: '적정한 위험을 감수하여 수익성을 추구',
    range: '5-15%'
  },
  high: {
    label: '높음',
    color: 'red',
    description: '높은 수익을 위해 상당한 위험을 감수',
    range: '15%+'
  }
} as const;

// 자산 타입 상수
export const ASSET_TYPES = [
  { id: 'real-estate', name: '부동산', icon: '🏢' },
  { id: 'commodities', name: '원자재', icon: '🛢️' },
  { id: 'infrastructure', name: '인프라', icon: '🌉' },
  { id: 'art', name: '예술품', icon: '🎨' },
  { id: 'collectibles', name: '수집품', icon: '💎' },
  { id: 'precious-metals', name: '귀금속', icon: '🥇' },
  { id: 'intellectual-property', name: '지적재산권', icon: '💡' },
  { id: 'natural-resources', name: '천연자원', icon: '🌿' },
] as const;