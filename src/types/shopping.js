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
];
// 주문 상태 상수
export const ORDER_STATUSES = {
    pending: { label: '주문 접수', color: 'yellow', description: '주문이 접수되었습니다' },
    processing: { label: '처리 중', color: 'blue', description: '주문을 처리하고 있습니다' },
    shipped: { label: '배송 중', color: 'purple', description: '상품이 배송 중입니다' },
    delivered: { label: '배송 완료', color: 'green', description: '배송이 완료되었습니다' },
    cancelled: { label: '취소됨', color: 'red', description: '주문이 취소되었습니다' },
    refunded: { label: '환불됨', color: 'gray', description: '주문이 환불되었습니다' }
};
// 결제 방법 상수
export const PAYMENT_METHODS = {
    glib: { label: 'GLI-L 토큰', icon: '🪙', description: 'GLI-L 토큰으로 결제' },
    card: { label: '신용카드', icon: '💳', description: '신용카드 결제' },
    bank: { label: '계좌이체', icon: '🏦', description: '계좌이체' }
};
//# sourceMappingURL=shopping.js.map