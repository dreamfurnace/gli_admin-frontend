import { defineStore } from 'pinia';
import api from '@/utils/axios';
export const useAgencyStore = defineStore('agencyStore', {
    state: () => ({
        agencies: [],
        totalCount: 0,
        loading: false,
        error: '',
        page: 1,
        pageSize: 20,
        search: '',
        ordering: '-id', // 기본값: 최신순
    }),
    actions: {
        async fetchAgencies() {
            this.loading = true;
            this.error = '';
            try {
                const params = {
                    page: this.page,
                    page_size: this.pageSize,
                    ordering: this.ordering,
                };
                if (this.search) {
                    params.search = this.search;
                }
                const res = await api.get('/itpr/agencies/', { params });
                this.agencies = res.data.results;
                this.totalCount = res.data.count;
            }
            catch (e) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type is any, so response property access is allowed
                    this.error = e.response?.data?.detail || '기획사 목록 조회 실패';
                }
                else {
                    this.error = '기획사 목록 조회 실패';
                }
            }
            finally {
                this.loading = false;
            }
        },
        setSearch(search) {
            this.search = search;
            this.page = 1;
            this.fetchAgencies();
        },
        setPageSize(size) {
            this.pageSize = size;
            this.page = 1;
            this.fetchAgencies();
        },
        setOrdering(ordering) {
            this.ordering = ordering;
            this.page = 1;
            this.fetchAgencies();
        },
        setPage(page) {
            this.page = page;
            this.fetchAgencies();
        },
        async updateAgency(agencyId, payload) {
            try {
                await api.patch(`/itpr/agencies/${agencyId}/`, payload);
            }
            catch (e) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type is any, so response property access is allowed
                    this.error = e.response?.data?.detail || '기획사 정보 수정 실패';
                }
                else {
                    this.error = '기획사 정보 수정 실패';
                }
            }
        },
    },
});
//# sourceMappingURL=agency.js.map