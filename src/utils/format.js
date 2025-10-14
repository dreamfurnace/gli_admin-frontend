// src/utils/format.ts
export function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return '-';
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
//# sourceMappingURL=format.js.map