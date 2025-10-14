// stores/b_settlement/balance.ts
import { defineStore } from 'pinia';
import api from '@/utils/axios';
export const useBalanceStore = defineStore('balanceStore', {
    state: () => ({
        balanceList: [],
        totalCount: 0,
        totalPages: 1,
        loading: false,
        error: '',
    }),
    actions: {
        async fetchBalanceList(monthSettleId, page = 1, sortBy = 'nameAsc', pageSize = 20) {
            this.loading = true;
            this.error = '';
            const orderingMap = {
                nameAsc: 'user_name',
                nameDesc: '-user_name',
                balanceAsc: 'user_final_settle_amount',
                balanceDesc: '-user_final_settle_amount',
            };
            try {
                const response = await api.get('/settlement/balance/', {
                    params: {
                        month_settle_id: monthSettleId,
                        page,
                        page_size: pageSize,
                        ordering: orderingMap[sortBy],
                    },
                });
                this.balanceList = response.data.results;
                this.totalCount = response.data.count;
                this.totalPages = response.data.total_pages;
                return {
                    results: this.balanceList,
                    totalPages: this.totalPages,
                    count: this.totalCount,
                };
            }
            catch (e) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type
                    this.error = e.response?.data?.detail || '정산 내역을 불러오지 못했습니다.';
                }
                else {
                    this.error = '정산 내역을 불러오지 못했습니다.';
                }
                return {
                    results: [],
                    totalPages: 1,
                    count: 0,
                };
            }
            finally {
                this.loading = false;
            }
        },
        async sendMailToUser(id) {
            this.loading = true;
            try {
                await api.post(`/settlement/balance/send-mail/`, { id });
            }
            catch (e) {
                console.error('메일 전송 실패', e);
                throw e;
            }
            finally {
                this.loading = false;
            }
        },
        async sendBatchMail(ids) {
            this.loading = true;
            try {
                await api.post(`/settlement/balance/send-batch-mail/`, { ids });
            }
            catch (e) {
                console.error('메일 일괄 전송 실패', e);
                throw e;
            }
            finally {
                this.loading = false;
            }
        },
    },
    getters: {
        hasError(state) {
            return state.error !== '';
        },
    },
});
//# sourceMappingURL=balance.js.map