import { defineStore } from 'pinia';
import api from '@/utils/axios';
export const useArtistStore = defineStore('artistStore', {
    state: () => ({
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
                const params = {
                    page: this.page,
                    page_size: this.pageSize,
                };
                if (this.search)
                    params.search = this.search;
                if (this.ordering)
                    params.ordering = this.ordering;
                const res = await api.get('/itpr/artists/', { params });
                this.artists = res.data.results;
                this.totalCount = res.data.count;
            }
            catch (err) {
                this.error = err?.response?.data?.detail || '데이터를 불러오는 데 실패했습니다.';
            }
            finally {
                this.loading = false;
            }
        },
        async updateArtist(id, payload) {
            try {
                await api.patch(`/itpr/artists/${id}/`, payload);
            }
            catch (err) {
                this.error = '업데이트 실패';
                console.error(err);
            }
        },
        setSearch(search) {
            this.search = search;
            this.page = 1;
            this.fetchArtists();
        },
        setPageSize(size) {
            this.pageSize = size;
            this.page = 1;
            this.fetchArtists();
        },
        setOrdering(ordering) {
            this.ordering = ordering;
            this.page = 1;
            this.fetchArtists();
        },
        setPage(page) {
            this.page = page;
            this.fetchArtists();
        },
    },
});
//# sourceMappingURL=artist.js.map