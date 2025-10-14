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
};
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
];
//# sourceMappingURL=rwa.js.map