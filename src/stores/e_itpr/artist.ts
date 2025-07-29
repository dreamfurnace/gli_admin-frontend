import { defineStore } from 'pinia';
import api from '@/utils/axios';

export interface IAlbum {
    id: number;
    name: string;
    status: string;
}

export interface IArtist {
    id: number;
    name: string;
    name_en: string;
    albums: IAlbum[];
}

interface IState {
    artists: IArtist[];
    totalCount: number;
    loading: boolean;
    error: string;
    page: number;
    pageSize: number;
    search: string;
    ordering: string;
}

export const useArtistStore = defineStore('artistStore', {
    state: (): IState => ({
        artists: [],
        totalCount: 0,
        loading: false,
        error: '',
        page: 1,
        pageSize: 20,
        search: '',
        ordering: '-id', // 기본값: 최신순
    }),
    actions: {
        async fetchArtists() {
            this.loading = true;
            this.error = '';
            try {
                const params: Record<string, string | number> = {
                    page: this.page,
                    page_size: this.pageSize,
                };
                if (this.search) params.search = this.search;
                if (this.ordering) params.ordering = this.ordering;

                const res = await api.get('/itpr/artists/', { params });
                this.artists = res.data.results;
                this.totalCount = res.data.count;
            } catch (err: any) {
                this.error = err?.response?.data?.detail || '데이터를 불러오는 데 실패했습니다.';
            } finally {
                this.loading = false;
            }
        },
        async updateArtist(id: number, payload: { name: string; name_en: string }) {
            try {
                await api.patch(`/itpr/artists/${id}/`, payload);
            } catch (err) {
                this.error = '업데이트 실패';
                console.error(err);
            }
        },
        setSearch(search: string) {
            this.search = search;
            this.page = 1;
            this.fetchArtists();
        },
        setPageSize(size: number) {
            this.pageSize = size;
            this.page = 1;
            this.fetchArtists();
        },
        setOrdering(ordering: string) {
            this.ordering = ordering;
            this.page = 1;
            this.fetchArtists();
        },
        setPage(page: number) {
            this.page = page;
            this.fetchArtists();
        },
    },
});
