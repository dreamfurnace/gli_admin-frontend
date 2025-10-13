// GLI Admin API Service Layer
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { errorHandler } from '@/utils/errorHandler';
import type {
  LoginCredentials,
  AdminUser,
  BusinessContent,
  ShoppingCategory,
  ShoppingProduct,
  ShoppingOrder,
  TokenDestination,
  TokenDistribution,
  TokenDistributionPlan,
  TokenDistributionRecipient,
  TokenDistributionTemplate,
  MemberTransaction,
  MemberAuthStatus,
  PlatformStatistics,
  TeamMember,
  ProjectFeature,
  StrategyPhase,
  DevelopmentTimeline,
  TokenEcosystem,
  Member
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
        const response = await this.client.get('/api/v1/business-content/', { params });
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
    
    const response = await this.client.post('/api/v1/business-content/', data);
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
    
    const response = await this.client.put(`/api/v1/business-content/${id}/`, data);
    return response.data;
  }

  async deleteBusinessContent(id: number): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete business content:', id);
      return;
    }
    
    await this.client.delete(`/api/v1/business-content/${id}/`);
  }

  // Shopping Mall APIs
  async getShoppingCategories(params?: any): Promise<ShoppingCategory[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          icon: '💻',
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Resort Bookings',
          description: 'Luxury resort reservations',
          icon: '🏖️',
          order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/v1/shopping/categories/', { params });
        return response.data;
      },
      'Get Shopping Categories'
    );
  }

  async createShoppingCategory(data: Omit<ShoppingCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ShoppingCategory> {
    if (this.useMockApi) {
      const mockCategory: ShoppingCategory = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create shopping category:', mockCategory);
      return mockCategory;
    }
    
    const response = await this.client.post('/api/v1/shopping/categories/', data);
    return response.data;
  }

  async updateShoppingCategory(id: string, data: Partial<ShoppingCategory>): Promise<ShoppingCategory> {
    if (this.useMockApi) {
      const mockCategory: ShoppingCategory = {
        id,
        name: data.name || 'Updated Category',
        description: data.description,
        icon: data.icon,
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update shopping category:', mockCategory);
      return mockCategory;
    }
    
    const response = await this.client.put(`/api/v1/shopping/categories/${id}/`, data);
    return response.data;
  }

  async deleteShoppingCategory(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete shopping category:', id);
      return;
    }
    
    await this.client.delete(`/api/v1/shopping/categories/${id}/`);
  }

  async getShoppingProducts(params?: any): Promise<ShoppingProduct[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          category: '1',
          name: 'Premium Laptop',
          description: 'High-performance laptop for professionals',
          short_description: 'Professional laptop with latest specs',
          product_type: 'goods',
          price_glil: '1500.00000000',
          price_usd: '1200.00',
          stock_quantity: 25,
          unlimited_stock: false,
          main_image_url: 'https://example.com/laptop.jpg',
          image_urls: [],
          status: 'active',
          is_featured: true,
          tags: ['electronics', 'laptop', 'premium'],
          attributes: { brand: 'TechBrand', model: 'Pro-2024' },
          view_count: 150,
          purchase_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/v1/shopping/products/', { params });
        return response.data;
      },
      'Get Shopping Products'
    );
  }

  async createShoppingProduct(data: Omit<ShoppingProduct, 'id' | 'view_count' | 'purchase_count' | 'created_at' | 'updated_at'>): Promise<ShoppingProduct> {
    if (this.useMockApi) {
      const mockProduct: ShoppingProduct = {
        ...data,
        id: Date.now().toString(),
        view_count: 0,
        purchase_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create shopping product:', mockProduct);
      return mockProduct;
    }
    
    const response = await this.client.post('/api/v1/shopping/products/', data);
    return response.data;
  }

  async updateShoppingProduct(id: string, data: Partial<ShoppingProduct>): Promise<ShoppingProduct> {
    if (this.useMockApi) {
      const mockProduct: ShoppingProduct = {
        id,
        category: data.category || '1',
        name: data.name || 'Updated Product',
        description: data.description || 'Updated description',
        short_description: data.short_description,
        product_type: data.product_type || 'goods',
        price_glil: data.price_glil || '0.00000000',
        price_usd: data.price_usd,
        stock_quantity: data.stock_quantity || 0,
        unlimited_stock: data.unlimited_stock || false,
        main_image_url: data.main_image_url,
        image_urls: data.image_urls || [],
        status: data.status || 'active',
        is_featured: data.is_featured || false,
        tags: data.tags || [],
        attributes: data.attributes || {},
        view_count: 0,
        purchase_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update shopping product:', mockProduct);
      return mockProduct;
    }
    
    const response = await this.client.put(`/api/v1/shopping/products/${id}/`, data);
    return response.data;
  }

  async deleteShoppingProduct(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete shopping product:', id);
      return;
    }
    
    await this.client.delete(`/api/v1/shopping/products/${id}/`);
  }

  async getShoppingOrders(params?: any): Promise<ShoppingOrder[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          customer: 123,
          order_number: 'ORD-2024-001',
          status: 'pending',
          total_amount_glil: '1500.00000000',
          total_amount_usd: '1200.00',
          items: [],
          shipping_address: { city: 'Seoul', country: 'Korea' },
          payment_info: { method: 'GLIL' },
          notes: 'Rush delivery requested',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
    
    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/v1/shopping/orders/', { params });
        return response.data;
      },
      'Get Shopping Orders'
    );
  }

  async updateShoppingOrderStatus(id: string, status: ShoppingOrder['status']): Promise<ShoppingOrder> {
    if (this.useMockApi) {
      const mockOrder: ShoppingOrder = {
        id,
        customer: 123,
        order_number: 'ORD-2024-001',
        status,
        total_amount_glil: '1500.00000000',
        total_amount_usd: '1200.00',
        items: [],
        shipping_address: { city: 'Seoul', country: 'Korea' },
        payment_info: { method: 'GLIL' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update order status:', mockOrder);
      return mockOrder;
    }
    
    const response = await this.client.patch(`/api/v1/shopping/orders/${id}/`, { status });
    return response.data;
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

  // Team Member APIs
  async getTeamMembers(showAll: boolean = false): Promise<TeamMember[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          image_url: 'https://example.com/ceo.jpg',
          position_ko: 'GLI CEO',
          position_en: 'Chief Executive Officer',
          role_ko: '블록체인 비즈니스 전략 및 전반적인 경영을 담당합니다.',
          role_en: 'Responsible for blockchain business strategy and overall management.',
          tags: ['Blockchain', 'Business Strategy', 'Leadership'],
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return this.withRetry(
      async () => {
        const params = showAll ? { show_all: 'true' } : {};
        const response = await this.client.get('/api/team-members/', { params });
        return response.data;
      },
      'Get Team Members'
    );
  }

  async createTeamMember(data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    if (this.useMockApi) {
      const mockMember: TeamMember = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create team member:', mockMember);
      return mockMember;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/team-members/', data);
        return response.data;
      },
      'Create Team Member'
    );
  }

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    if (this.useMockApi) {
      const mockMember: TeamMember = {
        id,
        image_url: data.image_url || 'https://example.com/default.jpg',
        position_ko: data.position_ko || 'Updated Position',
        position_en: data.position_en || 'Updated Position',
        role_ko: data.role_ko || 'Updated Role',
        role_en: data.role_en || 'Updated Role',
        tags: data.tags || [],
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update team member:', mockMember);
      return mockMember;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/team-members/${id}/`, data);
        return response.data;
      },
      'Update Team Member'
    );
  }

  async deleteTeamMember(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete team member:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/team-members/${id}/`);
      },
      'Delete Team Member'
    );
  }

  // Project Feature APIs
  async getProjectFeatures(showAll: boolean = false): Promise<ProjectFeature[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          icon: '🌊',
          title_ko: '비전',
          title_en: 'Vision',
          description_ko: 'GLI는 리조트 경험과 블록체인 기술을 융합하여 새로운 가치를 창출합니다.',
          description_en: 'GLI creates new value by merging resort experiences with blockchain technology.',
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return this.withRetry(
      async () => {
        const params = showAll ? { show_all: 'true' } : {};
        const response = await this.client.get('/api/project-features/', { params });
        return response.data;
      },
      'Get Project Features'
    );
  }

  async createProjectFeature(data: Omit<ProjectFeature, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectFeature> {
    if (this.useMockApi) {
      const mockFeature: ProjectFeature = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create project feature:', mockFeature);
      return mockFeature;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/project-features/', data);
        return response.data;
      },
      'Create Project Feature'
    );
  }

  async updateProjectFeature(id: string, data: Partial<ProjectFeature>): Promise<ProjectFeature> {
    if (this.useMockApi) {
      const mockFeature: ProjectFeature = {
        id,
        icon: data.icon || '🌊',
        title_ko: data.title_ko || 'Updated Title',
        title_en: data.title_en || 'Updated Title',
        description_ko: data.description_ko || 'Updated Description',
        description_en: data.description_en || 'Updated Description',
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update project feature:', mockFeature);
      return mockFeature;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/project-features/${id}/`, data);
        return response.data;
      },
      'Update Project Feature'
    );
  }

  async deleteProjectFeature(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete project feature:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/project-features/${id}/`);
      },
      'Delete Project Feature'
    );
  }

  // Strategy Phase APIs
  async getStrategyPhases(showAll: boolean = false): Promise<StrategyPhase[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          icon: '🚀',
          title_ko: '플랫폼 구축',
          title_en: 'Platform Development',
          description_ko: 'GLI 플랫폼의 기반을 구축하고 핵심 토큰을 발행합니다.',
          description_en: 'Build the foundation of the GLI platform and issue core tokens.',
          features: ['웹 플랫폼 개발', 'GLIB/GLID/GLIL 토큰 발행', '지갑 연동 시스템'],
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return this.withRetry(
      async () => {
        const params = showAll ? { show_all: 'true' } : {};
        const response = await this.client.get('/api/strategy-phases/', { params });
        return response.data;
      },
      'Get Strategy Phases'
    );
  }

  async createStrategyPhase(data: Omit<StrategyPhase, 'id' | 'created_at' | 'updated_at'>): Promise<StrategyPhase> {
    if (this.useMockApi) {
      const mockPhase: StrategyPhase = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create strategy phase:', mockPhase);
      return mockPhase;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/strategy-phases/', data);
        return response.data;
      },
      'Create Strategy Phase'
    );
  }

  async updateStrategyPhase(id: string, data: Partial<StrategyPhase>): Promise<StrategyPhase> {
    if (this.useMockApi) {
      const mockPhase: StrategyPhase = {
        id,
        icon: data.icon || '🚀',
        title_ko: data.title_ko || 'Updated Title',
        title_en: data.title_en || 'Updated Title',
        description_ko: data.description_ko || 'Updated Description',
        description_en: data.description_en || 'Updated Description',
        features: data.features || [],
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update strategy phase:', mockPhase);
      return mockPhase;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/strategy-phases/${id}/`, data);
        return response.data;
      },
      'Update Strategy Phase'
    );
  }

  async deleteStrategyPhase(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete strategy phase:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/strategy-phases/${id}/`);
      },
      'Delete Strategy Phase'
    );
  }

  // Image Upload APIs
  async uploadImage(file: File): Promise<{ url: string; key?: string; filename?: string; size?: number; content_type?: string }> {
    if (this.useMockApi) {
      const mockUrl = `https://mock-s3.amazonaws.com/gli-platform-media-dev/${Date.now()}-${file.name}`;
      console.log('🧪 Mock upload image:', mockUrl);
      return { url: mockUrl };
    }

    return this.withRetry(
      async () => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.client.post('/api/upload/image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Backend response format: { success: true, data: { url, key, filename, size, content_type } }
        console.log('✅ Image uploaded successfully:', response.data.data);
        return response.data.data;
      },
      'Upload Image'
    );
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete image:', imageUrl);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete('/api/upload/image/delete/', {
          data: { image_url: imageUrl },
        });
      },
      'Delete Image'
    );
  }

  // Development Timeline APIs
  async getDevelopmentTimelines(showAll: boolean = false): Promise<DevelopmentTimeline[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          quarter: '2024 Q1',
          status_icon: '✅',
          title_ko: '플랫폼 MVP 출시',
          title_en: 'Platform MVP Launch',
          description_ko: '기본 플랫폼과 토큰 시스템 출시',
          description_en: 'Launch basic platform and token system',
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return this.withRetry(
      async () => {
        const params = showAll ? { show_all: 'true' } : {};
        const response = await this.client.get('/api/development-timelines/', { params });
        return response.data;
      },
      'Get Development Timelines'
    );
  }

  async createDevelopmentTimeline(data: Omit<DevelopmentTimeline, 'id' | 'created_at' | 'updated_at'>): Promise<DevelopmentTimeline> {
    if (this.useMockApi) {
      const mockTimeline: DevelopmentTimeline = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create development timeline:', mockTimeline);
      return mockTimeline;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/development-timelines/', data);
        return response.data;
      },
      'Create Development Timeline'
    );
  }

  async updateDevelopmentTimeline(id: string, data: Partial<DevelopmentTimeline>): Promise<DevelopmentTimeline> {
    if (this.useMockApi) {
      const mockTimeline: DevelopmentTimeline = {
        id,
        quarter: data.quarter || '2024 Q1',
        status_icon: data.status_icon || '✅',
        title_ko: data.title_ko || 'Updated Title',
        title_en: data.title_en || 'Updated Title',
        description_ko: data.description_ko || 'Updated Description',
        description_en: data.description_en || 'Updated Description',
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update development timeline:', mockTimeline);
      return mockTimeline;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/development-timelines/${id}/`, data);
        return response.data;
      },
      'Update Development Timeline'
    );
  }

  async deleteDevelopmentTimeline(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete development timeline:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/development-timelines/${id}/`);
      },
      'Delete Development Timeline'
    );
  }

  // Token Ecosystem APIs
  async getTokenEcosystems(showAll: boolean = false): Promise<TokenEcosystem[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          icon: '🔵',
          name: 'GLI Business',
          symbol: 'GLIB',
          description_ko: 'GLI 플랫폼의 핵심 비즈니스 토큰',
          description_en: 'Core business token of GLI platform',
          features: ['리조트 예약', '스테이킹 보상', 'NFT 거래'],
          total_supply: '100,000,000 GLIB',
          current_price: '$0.25',
          order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return this.withRetry(
      async () => {
        const params = showAll ? { show_all: 'true' } : {};
        const response = await this.client.get('/api/token-ecosystems/', { params });
        return response.data;
      },
      'Get Token Ecosystems'
    );
  }

  async createTokenEcosystem(data: Omit<TokenEcosystem, 'id' | 'created_at' | 'updated_at'>): Promise<TokenEcosystem> {
    if (this.useMockApi) {
      const mockToken: TokenEcosystem = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create token ecosystem:', mockToken);
      return mockToken;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/token-ecosystems/', data);
        return response.data;
      },
      'Create Token Ecosystem'
    );
  }

  async updateTokenEcosystem(id: string, data: Partial<TokenEcosystem>): Promise<TokenEcosystem> {
    if (this.useMockApi) {
      const mockToken: TokenEcosystem = {
        id,
        icon: data.icon || '🔵',
        name: data.name || 'Updated Token',
        symbol: data.symbol || 'TOK',
        description_ko: data.description_ko || 'Updated Description',
        description_en: data.description_en || 'Updated Description',
        features: data.features || [],
        total_supply: data.total_supply || '0',
        current_price: data.current_price || '$0',
        order: data.order || 0,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock update token ecosystem:', mockToken);
      return mockToken;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/token-ecosystems/${id}/`, data);
        return response.data;
      },
      'Update Token Ecosystem'
    );
  }

  async deleteTokenEcosystem(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete token ecosystem:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/token-ecosystems/${id}/`);
      },
      'Delete Token Ecosystem'
    );
  }

  // Member APIs (회원 관리)
  async getMembers(params?: {
    search?: string;
    membership_level?: 'basic' | 'premium' | 'vip';
    is_active?: boolean;
  }): Promise<Member[]> {
    if (this.useMockApi) {
      return [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          wallet_address: '0x123...abc',
          membership_level: 'premium',
          sol_balance: '1000.000000000',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          membership_level: 'vip',
          sol_balance: '5000.000000000',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          first_name: 'Jane',
          last_name: 'Smith',
        },
      ];
    }

    return this.withRetry(
      async () => {
        const response = await this.client.get('/api/members/', { params });
        return response.data;
      },
      'Get Members'
    );
  }

  async getMember(id: string): Promise<Member> {
    if (this.useMockApi) {
      return {
        id,
        username: 'user1',
        email: 'user1@example.com',
        wallet_address: '0x123...abc',
        membership_level: 'premium',
        sol_balance: '1000.000000000',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        first_name: 'John',
        last_name: 'Doe',
      };
    }

    return this.withRetry(
      async () => {
        const response = await this.client.get(`/api/members/${id}/`);
        return response.data;
      },
      'Get Member'
    );
  }

  async createMember(data: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'last_login'>): Promise<Member> {
    if (this.useMockApi) {
      const mockMember: Member = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('🧪 Mock create member:', mockMember);
      return mockMember;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.post('/api/members/', data);
        return response.data;
      },
      'Create Member'
    );
  }

  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    if (this.useMockApi) {
      const mockMember: Member = {
        id,
        username: data.username || 'updated_user',
        email: data.email || 'updated@example.com',
        wallet_address: data.wallet_address,
        membership_level: data.membership_level || 'basic',
        sol_balance: data.sol_balance || '0.000000000',
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        first_name: data.first_name,
        last_name: data.last_name,
      };
      console.log('🧪 Mock update member:', mockMember);
      return mockMember;
    }

    return this.withRetry(
      async () => {
        const response = await this.client.put(`/api/members/${id}/`, data);
        return response.data;
      },
      'Update Member'
    );
  }

  async deleteMember(id: string): Promise<void> {
    if (this.useMockApi) {
      console.log('🧪 Mock delete member:', id);
      return;
    }

    return this.withRetry(
      async () => {
        await this.client.delete(`/api/members/${id}/`);
      },
      'Delete Member'
    );
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