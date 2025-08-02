// 쇼핑몰 상품 관련 타입 정의
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  tags: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  images?: string[];
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  tags?: string[];
  specifications?: Record<string, any>;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingInfo?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  order?: number;
}

export interface UpdateProductCategoryRequest extends Partial<CreateProductCategoryRequest> {
  isActive?: boolean;
}

export interface ProductCategoryListResponse {
  categories: ProductCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalValue: number;
  averagePrice: number;
  topCategories: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  recentProducts: Product[];
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: 'glib' | 'card' | 'bank';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: Record<string, any>;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderFilter {
  search?: string;
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  paymentMethod?: Order['paymentMethod'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 상품 카테고리 상수
export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: '전자제품', icon: '📱', description: '스마트폰, 노트북, 가전제품 등' },
  { id: 'fashion', name: '패션', icon: '👕', description: '의류, 신발, 액세서리' },
  { id: 'home', name: '홈&리빙', icon: '🏠', description: '가구, 인테리어, 생활용품' },
  { id: 'books', name: '도서', icon: '📚', description: '도서, 전자책, 교육자료' },
  { id: 'sports', name: '스포츠', icon: '⚽', description: '운동용품, 피트니스 장비' },
  { id: 'beauty', name: '뷰티', icon: '💄', description: '화장품, 스킨케어, 향수' },
  { id: 'food', name: '식품', icon: '🍎', description: '신선식품, 가공식품, 건강식품' },
  { id: 'toys', name: '완구', icon: '🧸', description: '장난감, 게임, 취미용품' },
] as const;

// 주문 상태 상수
export const ORDER_STATUSES = {
  pending: { label: '주문 접수', color: 'yellow', description: '주문이 접수되었습니다' },
  processing: { label: '처리 중', color: 'blue', description: '주문을 처리하고 있습니다' },
  shipped: { label: '배송 중', color: 'purple', description: '상품이 배송 중입니다' },
  delivered: { label: '배송 완료', color: 'green', description: '배송이 완료되었습니다' },
  cancelled: { label: '취소됨', color: 'red', description: '주문이 취소되었습니다' },
  refunded: { label: '환불됨', color: 'gray', description: '주문이 환불되었습니다' }
} as const;

// 결제 방법 상수
export const PAYMENT_METHODS = {
  glib: { label: 'GLI-L 토큰', icon: '🪙', description: 'GLI-L 토큰으로 결제' },
  card: { label: '신용카드', icon: '💳', description: '신용카드 결제' },
  bank: { label: '계좌이체', icon: '🏦', description: '계좌이체' }
} as const;