// RWA 투자 자산 관리 API 서비스
import api from '@/utils/axios';
class RWAService {
    basePath = '/api/admin/rwa';
    /**
     * RWA 자산 목록 조회
     */
    async getAssets(filter = {}) {
        try {
            // 개발 환경에서 모크 데이터 사용
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.getMockAssets(filter);
            }
            const response = await api.get(`${this.basePath}/assets`, { params: filter });
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch RWA assets:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 상세 조회
     */
    async getAsset(id) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.getMockAsset(id);
            }
            const response = await api.get(`${this.basePath}/assets/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch RWA asset:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 생성
     */
    async createAsset(data) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.createMockAsset(data);
            }
            const response = await api.post(`${this.basePath}/assets`, data);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to create RWA asset:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 수정
     */
    async updateAsset(id, data) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.updateMockAsset(id, data);
            }
            const response = await api.put(`${this.basePath}/assets/${id}`, data);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to update RWA asset:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 삭제
     */
    async deleteAsset(id) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                this.deleteMockAsset(id);
                return;
            }
            await api.delete(`${this.basePath}/assets/${id}`);
        }
        catch (error) {
            console.error('❌ Failed to delete RWA asset:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 활성화/비활성화
     */
    async toggleAssetStatus(id, isActive) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.updateMockAsset(id, { isActive });
            }
            const response = await api.patch(`${this.basePath}/assets/${id}/status`, { isActive });
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to toggle asset status:', error);
            throw error;
        }
    }
    /**
     * RWA 투자 통계 조회
     */
    async getInvestmentStats() {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.getMockInvestmentStats();
            }
            const response = await api.get(`${this.basePath}/stats`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch investment stats:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 투자자 목록 조회
     */
    async getAssetInvestors(assetId) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.getMockAssetInvestors(assetId);
            }
            const response = await api.get(`${this.basePath}/assets/${assetId}/investors`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch asset investors:', error);
            throw error;
        }
    }
    /**
     * RWA 자산 성과 조회
     */
    async getAssetPerformance(assetId) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                return this.getMockAssetPerformance(assetId);
            }
            const response = await api.get(`${this.basePath}/assets/${assetId}/performance`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch asset performance:', error);
            throw error;
        }
    }
    /**
     * 자산 이미지 업로드
     */
    async uploadAssetImage(file) {
        try {
            if (import.meta.env.VITE_USE_MOCK_API === 'true') {
                // 모크 이미지 URL 반환
                return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
            }
            const formData = new FormData();
            formData.append('image', file);
            const response = await api.post(`${this.basePath}/upload/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url;
        }
        catch (error) {
            console.error('❌ Failed to upload asset image:', error);
            throw error;
        }
    }
    // === 모크 데이터 메서드들 ===
    mockAssets = [
        {
            id: '1',
            name: '서울 강남 오피스텔',
            shortDescription: '서울 강남구 중심가 프리미엄 오피스텔 투자',
            fullDescription: '<p>서울 강남구 테헤란로에 위치한 프리미엄 오피스텔 투자 기회입니다.</p><p>교통이 편리하고 임대 수요가 안정적인 지역으로 장기적인 수익성이 기대됩니다.</p>',
            images: ['https://via.placeholder.com/400x300?text=오피스텔1', 'https://via.placeholder.com/400x300?text=오피스텔2'],
            expectedReturn: 8.5,
            riskLevel: 'medium',
            minimumInvestment: 10000000,
            totalValue: 5000000000,
            currentInvestment: 3200000000,
            location: '서울특별시 강남구',
            assetType: 'real-estate',
            isActive: true,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-20')
        },
        {
            id: '2',
            name: '부산 해운대 리조트',
            shortDescription: '부산 해운대 해변가 리조트 콘도 투자',
            fullDescription: '<p>부산 해운대 해변가에 위치한 리조트 콘도 투자입니다.</p><p>관광 성수기 임대 수익과 장기적인 자산 가치 상승이 기대됩니다.</p>',
            images: ['https://via.placeholder.com/400x300?text=리조트1'],
            expectedReturn: 12.3,
            riskLevel: 'high',
            minimumInvestment: 5000000,
            totalValue: 2000000000,
            currentInvestment: 1800000000,
            location: '부산광역시 해운대구',
            assetType: 'real-estate',
            isActive: true,
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-05')
        },
        {
            id: '3',
            name: '제주 풍력발전 프로젝트',
            shortDescription: '제주도 재생에너지 풍력발전 인프라 투자',
            fullDescription: '<p>제주도 신재생에너지 풍력발전 프로젝트 투자입니다.</p><p>정부 정책 지원과 안정적인 전력 판매 계약으로 장기 수익이 보장됩니다.</p>',
            images: ['https://via.placeholder.com/400x300?text=풍력발전'],
            expectedReturn: 6.8,
            riskLevel: 'low',
            minimumInvestment: 50000000,
            totalValue: 10000000000,
            currentInvestment: 7500000000,
            location: '제주특별자치도',
            assetType: 'infrastructure',
            isActive: true,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-02-10')
        }
    ];
    getMockAssets(filter) {
        let filteredAssets = [...this.mockAssets];
        // 필터링
        if (filter.search) {
            filteredAssets = filteredAssets.filter(asset => asset.name.includes(filter.search) ||
                asset.shortDescription.includes(filter.search));
        }
        if (filter.assetType) {
            filteredAssets = filteredAssets.filter(asset => asset.assetType === filter.assetType);
        }
        if (filter.riskLevel) {
            filteredAssets = filteredAssets.filter(asset => asset.riskLevel === filter.riskLevel);
        }
        if (filter.isActive !== undefined) {
            filteredAssets = filteredAssets.filter(asset => asset.isActive === filter.isActive);
        }
        // 정렬
        if (filter.sortBy) {
            filteredAssets.sort((a, b) => {
                const aVal = a[filter.sortBy];
                const bVal = b[filter.sortBy];
                const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                return filter.sortOrder === 'desc' ? -result : result;
            });
        }
        // 페이지네이션
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const start = (page - 1) * limit;
        const paginatedAssets = filteredAssets.slice(start, start + limit);
        return {
            assets: paginatedAssets,
            total: filteredAssets.length,
            page,
            limit,
            totalPages: Math.ceil(filteredAssets.length / limit)
        };
    }
    getMockAsset(id) {
        const asset = this.mockAssets.find(a => a.id === id);
        if (!asset) {
            throw new Error('Asset not found');
        }
        return asset;
    }
    createMockAsset(data) {
        const newAsset = {
            id: Date.now().toString(),
            ...data,
            images: data.images || [],
            currentInvestment: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.mockAssets.push(newAsset);
        return newAsset;
    }
    updateMockAsset(id, data) {
        const index = this.mockAssets.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('Asset not found');
        }
        this.mockAssets[index] = {
            ...this.mockAssets[index],
            ...data,
            updatedAt: new Date()
        };
        return this.mockAssets[index];
    }
    deleteMockAsset(id) {
        const index = this.mockAssets.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('Asset not found');
        }
        this.mockAssets.splice(index, 1);
    }
    getMockInvestmentStats() {
        return {
            totalAssets: this.mockAssets.length,
            activeAssets: this.mockAssets.filter(a => a.isActive).length,
            totalValue: this.mockAssets.reduce((sum, a) => sum + a.totalValue, 0),
            totalInvestment: this.mockAssets.reduce((sum, a) => sum + a.currentInvestment, 0),
            averageReturn: this.mockAssets.reduce((sum, a) => sum + a.expectedReturn, 0) / this.mockAssets.length,
            riskDistribution: {
                low: this.mockAssets.filter(a => a.riskLevel === 'low').length,
                medium: this.mockAssets.filter(a => a.riskLevel === 'medium').length,
                high: this.mockAssets.filter(a => a.riskLevel === 'high').length,
            },
            typeDistribution: [
                { type: 'real-estate', count: 2, value: 7000000000 },
                { type: 'infrastructure', count: 1, value: 10000000000 },
            ],
            monthlyGrowth: [
                { month: '2024-01', value: 15000000000, investment: 10000000000 },
                { month: '2024-02', value: 17000000000, investment: 12500000000 },
            ]
        };
    }
    getMockAssetInvestors(assetId) {
        return [
            {
                id: '1',
                userId: 'user1',
                userName: '김투자',
                userEmail: 'investor1@example.com',
                assetId,
                investmentAmount: 50000000,
                investmentDate: new Date('2024-01-20'),
                currentValue: 52500000,
                returnRate: 5.0
            },
            {
                id: '2',
                userId: 'user2',
                userName: '이부자',
                userEmail: 'investor2@example.com',
                assetId,
                investmentAmount: 100000000,
                investmentDate: new Date('2024-02-01'),
                currentValue: 108000000,
                returnRate: 8.0
            }
        ];
    }
    getMockAssetPerformance(assetId) {
        return {
            assetId,
            currentReturn: 7.2,
            projectedReturn: 8.5,
            performance: 'meeting',
            monthlyReturns: [
                { month: '2024-01', actualReturn: 0.5, projectedReturn: 0.7 },
                { month: '2024-02', actualReturn: 0.8, projectedReturn: 0.7 },
            ],
            riskMetrics: {
                volatility: 12.5,
                sharpeRatio: 0.68,
                maxDrawdown: -5.2
            }
        };
    }
}
export const rwaService = new RWAService();
//# sourceMappingURL=rwa.js.map