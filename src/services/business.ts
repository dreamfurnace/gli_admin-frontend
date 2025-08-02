// 사업소개 콘텐츠 관리 API 서비스
import api from '@/utils/axios';
import type {
  BusinessContent,
  CreateBusinessContentRequest,
  UpdateBusinessContentRequest,
  BusinessContentListResponse,
  BusinessContentFilter,
  BusinessContentStats,
  BusinessPageConfig
} from '@/types/business';

class BusinessContentService {
  private basePath = '/api/admin/business';

  /**
   * 사업소개 콘텐츠 목록 조회
   */
  async getContents(filter: BusinessContentFilter = {}): Promise<BusinessContentListResponse> {
    try {
      // 개발 환경에서 모크 데이터 사용
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.getMockContents(filter);
      }

      const response = await api.get(`${this.basePath}/contents`, { params: filter });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch business contents:', error);
      throw error;
    }
  }

  /**
   * 사업소개 콘텐츠 상세 조회
   */
  async getContent(id: string): Promise<BusinessContent> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.getMockContent(id);
      }

      const response = await api.get(`${this.basePath}/contents/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch business content:', error);
      throw error;
    }
  }

  /**
   * 타입별 사업소개 콘텐츠 조회
   */
  async getContentByType(type: BusinessContent['type']): Promise<BusinessContent | null> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        const content = this.mockContents.find(c => c.type === type && c.isActive);
        return content || null;
      }

      const response = await api.get(`${this.basePath}/contents/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch business content by type:', error);
      return null;
    }
  }

  /**
   * 사업소개 콘텐츠 생성
   */
  async createContent(data: CreateBusinessContentRequest): Promise<BusinessContent> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.createMockContent(data);
      }

      const response = await api.post(`${this.basePath}/contents`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create business content:', error);
      throw error;
    }
  }

  /**
   * 사업소개 콘텐츠 수정
   */
  async updateContent(id: string, data: UpdateBusinessContentRequest): Promise<BusinessContent> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.updateMockContent(id, data);
      }

      const response = await api.put(`${this.basePath}/contents/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update business content:', error);
      throw error;
    }
  }

  /**
   * 사업소개 콘텐츠 삭제
   */
  async deleteContent(id: string): Promise<void> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        this.deleteMockContent(id);
        return;
      }

      await api.delete(`${this.basePath}/contents/${id}`);
    } catch (error) {
      console.error('❌ Failed to delete business content:', error);
      throw error;
    }
  }

  /**
   * 사업소개 콘텐츠 활성화/비활성화
   */
  async toggleContentStatus(id: string, isActive: boolean): Promise<BusinessContent> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.updateMockContent(id, { isActive });
      }

      const response = await api.patch(`${this.basePath}/contents/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to toggle content status:', error);
      throw error;
    }
  }

  /**
   * 사업소개 콘텐츠 순서 변경
   */
  async updateContentOrder(id: string, order: number): Promise<BusinessContent> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.updateMockContent(id, { order });
      }

      const response = await api.patch(`${this.basePath}/contents/${id}/order`, { order });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update content order:', error);
      throw error;
    }
  }

  /**
   * 사업소개 통계 조회
   */
  async getContentStats(): Promise<BusinessContentStats> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.getMockContentStats();
      }

      const response = await api.get(`${this.basePath}/stats`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch content stats:', error);
      throw error;
    }
  }

  /**
   * 전체 사업소개 페이지 구성 조회
   */
  async getPageConfig(): Promise<BusinessPageConfig> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return this.getMockPageConfig();
      }

      const response = await api.get(`${this.basePath}/page-config`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch page config:', error);
      throw error;
    }
  }

  /**
   * 콘텐츠 이미지 업로드
   */
  async uploadContentImage(file: File): Promise<string> {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        // 모크 이미지 URL 반환
        return `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}`;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`${this.basePath}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('❌ Failed to upload content image:', error);
      throw error;
    }
  }

  // === 모크 데이터 메서드들 ===
  private mockContents: BusinessContent[] = [
    {
      id: '1',
      type: 'hero',
      title: 'GLI Platform',
      subtitle: '미래를 여는 블록체인 투자 플랫폼',
      content: '<p>GLI Platform은 실물 자산(RWA) 투자와 혁신적인 쇼핑 경험을 제공하는 차세대 Web3 플랫폼입니다.</p><p>블록체인 기술을 통해 더 투명하고 안전한 투자 환경을 만들어가고 있습니다.</p>',
      images: ['https://via.placeholder.com/1200x600?text=GLI+Hero'],
      metadata: {
        backgroundImage: 'https://via.placeholder.com/1920x1080?text=Hero+Background',
        ctaText: '지금 시작하기',
        ctaLink: '/register',
        features: [
          { icon: '🏢', title: 'RWA 투자', description: '실물 자산에 안전하게 투자하세요' },
          { icon: '🛍️', title: '쇼핑몰', description: 'GLI-L 토큰으로 쇼핑하세요' },
          { icon: '🔒', title: '보안', description: '블록체인 기반 보안 시스템' },
        ]
      },
      order: 1,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'about',
      title: '회사 소개',
      subtitle: 'GLI Platform이 추구하는 가치',
      content: '<p>GLI Platform은 블록체인 기술을 통해 전통적인 투자의 한계를 뛰어넘는 혁신적인 플랫폼입니다.</p><p>우리는 투명성, 접근성, 그리고 수익성을 바탕으로 모든 사용자가 안전하고 효율적인 투자를 할 수 있도록 돕습니다.</p>',
      images: ['https://via.placeholder.com/800x600?text=About+GLI'],
      metadata: {},
      order: 2,
      isActive: true,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: '3',
      type: 'services',
      title: '서비스 소개',
      subtitle: 'GLI Platform의 핵심 서비스',
      content: '<p>GLI Platform은 다양한 투자 및 생활 서비스를 제공합니다.</p>',
      images: [],
      metadata: {
        services: [
          {
            icon: '🏢',
            title: 'RWA 투자',
            description: '부동산, 원자재 등 실물 자산 투자',
            features: ['전문가 검증', '투명한 수익률', '최소 투자금액', '실시간 모니터링']
          },
          {
            icon: '🛍️',
            title: 'GLI 쇼핑몰',
            description: 'GLI-L 토큰을 활용한 쇼핑 플랫폼',
            features: ['토큰 결제', '할인 혜택', '품질 보증', '빠른 배송']
          },
          {
            icon: '🔄',
            title: '토큰 변환',
            description: 'GLI 토큰 간 자유로운 변환',
            features: ['즉시 변환', '낮은 수수료', '안전한 거래', '24/7 서비스']
          }
        ]
      },
      order: 3,
      isActive: true,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-22')
    }
  ];

  private getMockContents(filter: BusinessContentFilter): BusinessContentListResponse {
    let filteredContents = [...this.mockContents];

    // 필터링
    if (filter.search) {
      filteredContents = filteredContents.filter(content => 
        content.title.includes(filter.search!) || 
        content.subtitle?.includes(filter.search!) ||
        content.content.includes(filter.search!)
      );
    }

    if (filter.type) {
      filteredContents = filteredContents.filter(content => content.type === filter.type);
    }

    if (filter.isActive !== undefined) {
      filteredContents = filteredContents.filter(content => content.isActive === filter.isActive);
    }

    // 정렬
    if (filter.sortBy) {
      filteredContents.sort((a, b) => {
        const aVal = a[filter.sortBy as keyof BusinessContent];
        const bVal = b[filter.sortBy as keyof BusinessContent];
        const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filter.sortOrder === 'desc' ? -result : result;
      });
    } else {
      // 기본 정렬: order ASC
      filteredContents.sort((a, b) => a.order - b.order);
    }

    // 페이지네이션
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const start = (page - 1) * limit;
    const paginatedContents = filteredContents.slice(start, start + limit);

    return {
      contents: paginatedContents,
      total: filteredContents.length,
      page,
      limit,
      totalPages: Math.ceil(filteredContents.length / limit)
    };
  }

  private getMockContent(id: string): BusinessContent {
    const content = this.mockContents.find(c => c.id === id);
    if (!content) {
      throw new Error('Content not found');
    }
    return content;
  }

  private createMockContent(data: CreateBusinessContentRequest): BusinessContent {
    const newContent: BusinessContent = {
      id: Date.now().toString(),
      ...data,
      images: data.images || [],
      metadata: data.metadata || {},
      order: data.order || this.mockContents.length + 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockContents.push(newContent);
    return newContent;
  }

  private updateMockContent(id: string, data: UpdateBusinessContentRequest): BusinessContent {
    const index = this.mockContents.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Content not found');
    }
    
    this.mockContents[index] = {
      ...this.mockContents[index],
      ...data,
      updatedAt: new Date()
    };
    
    return this.mockContents[index];
  }

  private deleteMockContent(id: string): void {
    const index = this.mockContents.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Content not found');
    }
    this.mockContents.splice(index, 1);
  }

  private getMockContentStats(): BusinessContentStats {
    const typeCount: Record<string, number> = {};
    
    this.mockContents.forEach(content => {
      typeCount[content.type] = (typeCount[content.type] || 0) + 1;
    });

    return {
      totalContents: this.mockContents.length,
      activeContents: this.mockContents.filter(c => c.isActive).length,
      contentsByType: Object.entries(typeCount).map(([type, count]) => ({ type, count })),
      lastUpdated: new Date()
    };
  }

  private getMockPageConfig(): BusinessPageConfig {
    const config: BusinessPageConfig = {};
    
    this.mockContents.forEach(content => {
      if (content.isActive) {
        config[content.type] = content;
      }
    });
    
    return config;
  }
}

export const businessContentService = new BusinessContentService();