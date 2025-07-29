// GLI Admin API Service Layer
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { errorHandler } from '@/utils/errorHandler';
import type { 
  LoginCredentials, 
  AdminUser,
  BusinessContent,
  TokenDestination,
  TokenDistribution,
  TokenDistributionPlan,
  TokenDistributionRecipient,
  TokenDistributionTemplate,
  MemberTransaction,
  MemberAuthStatus,
  PlatformStatistics 
} from '@/types/api';

class ApiService {
  private client: AxiosInstance;
  private useMockApi: boolean;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor() {
    this.useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
    
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private async withRetry<T>(
    fn: () => Promise<T>, 
    context: string,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        console.log(`🔄 GLI API Retry ${this.maxRetries - retries + 1}/${this.maxRetries} for ${context}`);
        await this.delay(this.retryDelay * (this.maxRetries - retries + 1));
        return this.withRetry(fn, context, retries - 1);
      }
      
      throw errorHandler.handleApiError(error, context);
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🌐 GLI API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚨 GLI API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ GLI API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await this.client.post('/api/common/token/refresh/', {
              refresh: refreshToken,
            });

            const newToken = response.data.access;
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('🚨 GLI Token Refresh Failed:', refreshError);
            // Redirect to login will be handled by auth store
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        console.error(`🚨 GLI API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Mock data generators
  private generateMockBusinessContent(): BusinessContent[] {
    return [
      {
        id: 1,
        title: 'GLI Platform Overview',
        content: 'GLI Platform is a comprehensive blockchain-based ecosystem...',
        category: 'company-info',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Team Structure',
        content: 'Our team consists of blockchain experts, developers...',
        category: 'team',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private generateMockTokenDestinations(): TokenDestination[] {
    return [
      {
        id: 1,
        name: 'Resort Paradise',
        category: 'resort',
        address: '123 Paradise Island',
        acceptedTokens: ['GLIB', 'GLID'],
        exchangeRate: 1.0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'GLI Merchandise Store',
        category: 'goods',
        address: 'Online Store',
        acceptedTokens: ['GLIB'],
        exchangeRate: 0.95,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  private generateMockDistributionPlans(): TokenDistributionPlan[] {
    return [
      {
        id: 1,
        name: 'Q1 2024 Community Rewards',
        description: 'Quarterly distribution for active community members',
        tokenType: 'GLIB',
        totalAmount: 50000,
        recipients: [
          {
            id: 1,
            userId: 101,
            userEmail: 'user1@example.com',
            userName: 'Alice Smith',
            amount: 1000,
            reason: 'Community contribution',
            status: 'success',
            transactionHash: '0x123...abc',
          },
          {
            id: 2,
            userId: 102,
            userEmail: 'user2@example.com',
            userName: 'Bob Johnson',
            amount: 1500,
            reason: 'Developer rewards',
            status: 'success',
            transactionHash: '0x456...def',
          },
        ],
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'executed',
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        approvedBy: 1,
        approvedByEmail: 'admin@gli.io',
        executedBy: 1,
        executedByEmail: 'admin@gli.io',
        executionResult: {
          success: true,
          timestamp: new Date().toISOString(),
          totalRecipients: 2,
          successfulRecipients: 2,
          failedRecipients: 0,
          transactionIds: ['0x123...abc', '0x456...def'],
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Beta Tester Incentives',
        description: 'Rewards for beta testing program participants',
        tokenType: 'GLID',
        totalAmount: 25000,
        recipients: [
          {
            id: 3,
            userId: 103,
            userEmail: 'tester1@example.com',
            userName: 'Carol Davis',
            amount: 500,
            reason: 'Beta testing participation',
            status: 'pending',
          },
          {
            id: 4,
            userId: 104,
            userEmail: 'tester2@example.com',
            userName: 'Dave Wilson',
            amount: 750,
            reason: 'Bug reporting',
            status: 'pending',
          },
        ],
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        approvedBy: 1,
        approvedByEmail: 'admin@gli.io',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Authentication APIs
  async login(credentials: LoginCredentials): Promise<{ token: any; user: AdminUser }> {
    if (this.useMockApi) {
      // Mock login logic is handled in auth store
      throw new Error('Mock login should be handled in auth store');
    }
    
    const response = await this.client.post('/api/common/login/', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock logout');
      return;
    }
    
    await this.client.post('/api/common/logout/');
  }

  async getCurrentUser(): Promise<AdminUser> {
    if (this.useMockApi) {
      return {
        id: 1,
        username: 'admin',
        email: 'admin@gli.io',
        first_name: 'GLI',
        last_name: 'Administrator',
        grade: {
          id: 1,
          name: 'Super Admin'
        }
      };
    }
    
    const response = await this.client.get('/api/common/user/');
    return response.data;
  }

  // Business Content APIs
  async getBusinessContent(params?: any): Promise<BusinessContent[]> {
    if (this.useMockApi) {
      return this.generateMockBusinessContent();
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/admin/business-content/', { params });
        return response.data;
      },
      'Get Business Content'
    );
  }

  async createBusinessContent(data: Omit<BusinessContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessContent> {
    if (this.useMockApi) {
      const mockContent: BusinessContent = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock create business content:', mockContent);
      return mockContent;
    }
    
    const response = await this.client.post('/api/admin/business-content/', data);
    return response.data;
  }

  async updateBusinessContent(id: number, data: Partial<BusinessContent>): Promise<BusinessContent> {
    if (this.useMockApi) {
      const mockContent: BusinessContent = {
        id,
        title: data.title || 'Updated Content',
        content: data.content || 'Updated content...',
        category: data.category || 'general',
        isPublished: data.isPublished ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock update business content:', mockContent);
      return mockContent;
    }
    
    const response = await this.client.put(`/api/admin/business-content/${id}/`, data);
    return response.data;
  }

  async deleteBusinessContent(id: number): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete business content:', id);
      return;
    }
    
    await this.client.delete(`/api/admin/business-content/${id}/`);
  }

  // Token Usage Destination APIs
  async getTokenDestinations(params?: any): Promise<TokenDestination[]> {
    if (this.useMockApi) {
      return this.generateMockTokenDestinations();
    }
    
    const response = await this.client.get('/api/admin/token-destinations/', { params });
    return response.data;
  }

  async createTokenDestination(data: Omit<TokenDestination, 'id' | 'createdAt'>): Promise<TokenDestination> {
    if (this.useMockApi) {
      const mockDestination: TokenDestination = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      console.log('🧪 Mock create token destination:', mockDestination);
      return mockDestination;
    }
    
    const response = await this.client.post('/api/admin/token-destinations/', data);
    return response.data;
  }

  async updateTokenDestination(id: number, data: Partial<TokenDestination>): Promise<TokenDestination> {
    if (this.useMockApi) {
      const mockDestination: TokenDestination = {
        id,
        name: data.name || 'Updated Destination',
        category: data.category || 'other',
        address: data.address || 'Updated Address',
        acceptedTokens: data.acceptedTokens || ['GLIB'],
        exchangeRate: data.exchangeRate || 1.0,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
      };
      console.log('🧪 Mock update token destination:', mockDestination);
      return mockDestination;
    }
    
    const response = await this.client.put(`/api/admin/token-destinations/${id}/`, data);
    return response.data;
  }

  async deleteTokenDestination(id: number): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete token destination:', id);
      return;
    }
    
    await this.client.delete(`/api/admin/token-destinations/${id}/`);
  }

  // Token Distribution APIs
  async getTokenDistributions(params?: any): Promise<TokenDistribution[]> {
    if (this.useMockApi) {
      return [
        {
          id: 1,
          name: 'Q1 2024 Distribution',
          tokenType: 'GLIB',
          totalAmount: 100000,
          distributedAmount: 75000,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
    }
    
    const response = await this.client.get('/api/admin/token-distributions/', { params });
    return response.data;
  }

  // Token Distribution Plan APIs
  async getDistributionPlans(params?: any): Promise<TokenDistributionPlan[]> {
    if (this.useMockApi) {
      return this.generateMockDistributionPlans();
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/admin/distribution-plans/', { params });
        return response.data;
      },
      'Get Distribution Plans'
    );
  }

  async getDistributionPlan(id: number): Promise<TokenDistributionPlan> {
    if (this.useMockApi) {
      const plans = this.generateMockDistributionPlans();
      const plan = plans.find(p => p.id === id);
      if (!plan) throw new Error('Distribution plan not found');
      return plan;
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get(`/api/admin/distribution-plans/${id}/`);
        return response.data;
      },
      'Get Distribution Plan'
    );
  }

  async createDistributionPlan(data: Omit<TokenDistributionPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByEmail'>): Promise<TokenDistributionPlan> {
    if (this.useMockApi) {
      const mockPlan: TokenDistributionPlan = {
        ...data,
        id: Date.now(),
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock create distribution plan:', mockPlan);
      return mockPlan;
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/admin/distribution-plans/', data);
        return response.data;
      },
      'Create Distribution Plan'
    );
  }

  async updateDistributionPlan(id: number, data: Partial<TokenDistributionPlan>): Promise<TokenDistributionPlan> {
    if (this.useMockApi) {
      const mockPlan: TokenDistributionPlan = {
        id,
        name: data.name || 'Updated Plan',
        description: data.description || 'Updated description',
        tokenType: data.tokenType || 'GLIB',
        totalAmount: data.totalAmount || 0,
        recipients: data.recipients || [],
        scheduledDate: data.scheduledDate || new Date().toISOString(),
        status: data.status || 'draft',
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock update distribution plan:', mockPlan);
      return mockPlan;
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/admin/distribution-plans/${id}/`, data);
        return response.data;
      },
      'Update Distribution Plan'
    );
  }

  async deleteDistributionPlan(id: number): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete distribution plan:', id);
      return;
    }
    
    return this.withRetry(
      async () => {
        await this.client.delete(`/api/admin/distribution-plans/${id}/`);
      },
      'Delete Distribution Plan'
    );
  }

  async approveDistributionPlan(id: number): Promise<TokenDistributionPlan> {
    if (this.useMockApi) {
      const mockPlan: TokenDistributionPlan = {
        id,
        name: 'Approved Plan',
        tokenType: 'GLIB',
        totalAmount: 10000,
        recipients: [],
        scheduledDate: new Date().toISOString(),
        status: 'approved',
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        approvedBy: 1,
        approvedByEmail: 'admin@gli.io',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock approve distribution plan:', mockPlan);
      return mockPlan;
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.post(`/api/admin/distribution-plans/${id}/approve/`);
        return response.data;
      },
      'Approve Distribution Plan'
    );
  }

  async executeDistributionPlan(id: number): Promise<TokenDistributionPlan> {
    if (this.useMockApi) {
      const mockPlan: TokenDistributionPlan = {
        id,
        name: 'Executed Plan',
        tokenType: 'GLIB',
        totalAmount: 10000,
        recipients: [],
        scheduledDate: new Date().toISOString(),
        status: 'executed',
        createdBy: 1,
        createdByEmail: 'admin@gli.io',
        approvedBy: 1,
        approvedByEmail: 'admin@gli.io',
        executedBy: 1,
        executedByEmail: 'admin@gli.io',
        executionResult: {
          success: true,
          timestamp: new Date().toISOString(),
          totalRecipients: 0,
          successfulRecipients: 0,
          failedRecipients: 0,
          transactionIds: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('🧪 Mock execute distribution plan:', mockPlan);
      return mockPlan;
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.post(`/api/admin/distribution-plans/${id}/execute/`);
        return response.data;
      },
      'Execute Distribution Plan'
    );
  }

  // Member Transaction APIs
  async getMemberTransactions(params?: any): Promise<MemberTransaction[]> {
    if (this.useMockApi) {
      return [
        {
          id: 1,
          memberId: 123,
          memberEmail: 'user@example.com',
          type: 'deposit',
          tokenType: 'GLIB',
          amount: 1000,
          status: 'completed',
          transactionHash: '0x123...abc',
          createdAt: new Date().toISOString(),
        },
      ];
    }
    
    const response = await this.client.get('/api/admin/member-transactions/', { params });
    return response.data;
  }

  // Member Authentication Status APIs
  async getMemberAuthStatus(params?: any): Promise<MemberAuthStatus[]> {
    if (this.useMockApi) {
      return [
        {
          id: 1,
          memberId: 123,
          memberEmail: 'user@example.com',
          authLevel: 'verified',
          kycStatus: 'approved',
          documentsSubmitted: true,
          lastVerificationDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
    }
    
    const response = await this.client.get('/api/admin/member-auth-status/', { params });
    return response.data;
  }

  // Platform Statistics APIs
  async getPlatformStatistics(): Promise<PlatformStatistics> {
    if (this.useMockApi) {
      return {
        totalMembers: 12847,
        totalGLIBTokens: 2845392,
        activeTransactions: 1284,
        platformGrowth: 24.5,
        monthlyActiveUsers: 8456,
        totalTokenDistributed: 1890234,
        verifiedMembers: 9876,
        pendingVerifications: 234,
      };
    }
    
    const response = await this.client.get('/api/admin/platform-statistics/');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.client.get('/api/common/health/');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;