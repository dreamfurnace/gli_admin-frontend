import { defineStore } from 'pinia';
import api from '@/utils/axios';

export interface IAlbum {
    id: number;
    name: string;
    status: string;
}

export interface IAgency {
    id: number;
    name: string;
    name_en: string;
    albums: IAlbum[];
}

export interface IAgencyListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IAgency[];
}

interface IState {
    agencies: IAgency[];
    totalCount: number;
    loading: boolean;
    error: string;
    page: number;
    pageSize: number;
    search: string;
    ordering: string;
}

export const useAgencyStore = defineStore('agencyStore', {
    state: (): IState => ({
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
                const params: Record<string, unknown> = {
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
            } catch (e: unknown) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type is any, so response property access is allowed
                    this.error = e.response?.data?.detail || '기획사 목록 조회 실패';
                } else {
                    this.error = '기획사 목록 조회 실패';
                }
            } finally {
                this.loading = false;
            }
        },
        setSearch(search: string) {
            this.search = search;
            this.page = 1;
            this.fetchAgencies();
        },
        setPageSize(size: number) {
            this.pageSize = size;
            this.page = 1;
            this.fetchAgencies();
        },
        setOrdering(ordering: string) {
            this.ordering = ordering;
            this.page = 1;
            this.fetchAgencies();
        },
        setPage(page: number) {
            this.page = page;
            this.fetchAgencies();
        },
        async updateAgency(agencyId: number, payload: { name: string; name_en: string }) {
            try {
                await api.patch(`/itpr/agencies/${agencyId}/`, payload);
            } catch (e: unknown) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type is any, so response property access is allowed
                    this.error = e.response?.data?.detail || '기획사 정보 수정 실패';
                } else {
                    this.error = '기획사 정보 수정 실패';
                }
            }
        },
    },
});
