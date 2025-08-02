// 사업소개 콘텐츠 관련 타입 정의
export interface BusinessContent {
  id: string;
  type: 'hero' | 'about' | 'services' | 'team' | 'values' | 'milestones' | 'contact';
  title: string;
  subtitle?: string;
  content: string;
  images: string[];
  metadata?: Record<string, any>;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessContentRequest {
  type: BusinessContent['type'];
  title: string;
  subtitle?: string;
  content: string;
  images?: string[];
  metadata?: Record<string, any>;
  order?: number;
}

export interface UpdateBusinessContentRequest extends Partial<CreateBusinessContentRequest> {
  isActive?: boolean;
}

export interface BusinessContentListResponse {
  contents: BusinessContent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BusinessContentFilter {
  search?: string;
  type?: BusinessContent['type'];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'type' | 'order' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// 사업소개 섹션 타입
export const BUSINESS_CONTENT_TYPES = [
  { id: 'hero', name: '메인 히어로', icon: '🎯', description: '메인 페이지 상단 히어로 섹션' },
  { id: 'about', name: '회사 소개', icon: '🏢', description: '회사 개요 및 비전' },
  { id: 'services', name: '서비스 소개', icon: '⚙️', description: '제공하는 서비스 및 솔루션' },
  { id: 'team', name: '팀 소개', icon: '👥', description: '팀원 및 조직 구조' },
  { id: 'values', name: '핵심 가치', icon: '💎', description: '회사의 핵심 가치 및 철학' },
  { id: 'milestones', name: '주요 성과', icon: '📈', description: '회사의 주요 성과 및 이정표' },
  { id: 'contact', name: '연락처', icon: '📞', description: '연락처 및 위치 정보' }
] as const;

// 히어로 섹션 전용 메타데이터
export interface HeroMetadata {
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

// 서비스 섹션 전용 메타데이터
export interface ServicesMetadata {
  services?: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
}

// 팀 섹션 전용 메타데이터
export interface TeamMetadata {
  members?: Array<{
    name: string;
    position: string;
    bio: string;
    image?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>;
}

// 핵심 가치 섹션 전용 메타데이터
export interface ValuesMetadata {
  values?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

// 주요 성과 섹션 전용 메타데이터
export interface MilestonesMetadata {
  milestones?: Array<{
    year: string;
    title: string;
    description: string;
    achievement?: string;
  }>;
}

// 연락처 섹션 전용 메타데이터
export interface ContactMetadata {
  address?: string;
  phone?: string;
  email?: string;
  businessHours?: string;
  mapUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

// 사업소개 페이지 전체 구조
export interface BusinessPageConfig {
  hero?: BusinessContent;
  about?: BusinessContent;
  services?: BusinessContent;
  team?: BusinessContent;
  values?: BusinessContent;
  milestones?: BusinessContent;
  contact?: BusinessContent;
}

// 사업소개 통계
export interface BusinessContentStats {
  totalContents: number;
  activeContents: number;
  contentsByType: Array<{
    type: string;
    count: number;
  }>;
  lastUpdated?: Date;
}