import { defineStore } from 'pinia';
import api from '@/utils/axios';
export const useAlbumsStore = defineStore('albumsStore', {
    state: () => ({
        albums: [],
        totalCount: 0,
        summary: null,
        loading: false,
        error: '',
        page: 1,
        pageSize: 20,
        searchQuery: '',
        searchType: 'all',
        ordering: '-created_at',
    }),
    actions: {
        async fetchSummary() {
            try {
                const res = await api.get('/itpr/albums/summary/');
                this.summary = res.data.summary;
            }
            catch {
                this.summary = null;
            }
        },
        async fetchAlbums() {
            this.loading = true;
            this.error = '';
            try {
                const response = await api.get('/itpr/albums/', {
                    params: {
                        page: this.page,
                        page_size: this.pageSize,
                        search: this.searchQuery,
                        search_type: this.searchType,
                        ordering: this.ordering,
                    },
                });
                this.albums = response.data.results;
                this.totalCount = response.data.count;
                if (response.data.summary) {
                    this.summary = response.data.summary;
                }
            }
            catch (e) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                    // @ts-expect-error axios error type is any, so response property access is allowed
                    this.error = e.response?.data?.detail || '앨범 목록을 불러오지 못했습니다.';
                }
                else {
                    this.error = '앨범 목록을 불러오지 못했습니다.';
                }
            }
            finally {
                this.loading = false;
            }
        },
        setSearch(value, type) {
            this.searchQuery = value;
            this.searchType = type;
            this.page = 1;
            this.fetchAlbums();
        },
        setPage(page) {
            this.page = page;
            this.fetchAlbums();
        },
        setPageSize(size) {
            this.pageSize = size;
            this.page = 1;
            this.fetchAlbums();
        },
        setOrdering(order) {
            this.ordering = order;
            this.fetchAlbums();
        },
    },
    getters: {
        totalPages(state) {
            return Math.ceil(state.totalCount / state.pageSize);
        },
        currentPage(state) {
            return state.page;
        },
    },
});
//# sourceMappingURL=albums.js.map