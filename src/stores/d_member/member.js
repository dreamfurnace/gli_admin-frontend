// src/stores/d_member/member.ts
import { defineStore } from 'pinia';
import api from '@/utils/axios';
export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        users: [],
        totalCount: 0,
        summary: null,
        loading: false,
        error: '',
        page: 1,
        pageSize: 20,
        search: '',
        searchType: 'all',
        ordering: '-created_at',
        selectedUsers: [],
        showFields: {
            personalNo: false,
            bankNo: false,
            corpCeo: false,
            bizNo: false,
            corpNo: false,
        },
    }),
    actions: {
        async fetchSummary() {
            try {
                const res = await api.get('/member/summary/');
                this.summary = res.data;
            }
            catch (err) {
                console.error('요약 정보 불러오기 실패:', err);
            }
        },
        async fetchUsers() {
            this.loading = true;
            this.error = '';
            try {
                const response = await api.get('/member/users/', {
                    params: {
                        page: this.page,
                        page_size: this.pageSize,
                        search: this.search,
                        search_type: this.searchType,
                        ordering: this.ordering,
                    },
                });
                this.users = response.data.results;
                this.totalCount = response.data.count;
            }
            catch (err) {
                this.error = err.response?.data?.detail || '회원 목록을 불러오지 못했습니다.';
            }
            finally {
                this.loading = false;
            }
        },
        setSearch(value) {
            this.search = value;
            this.page = 1;
            this.fetchUsers();
        },
        setSearchType(type) {
            this.searchType = type;
            this.page = 1;
            this.fetchUsers();
        },
        setPage(page) {
            this.page = page;
            this.fetchUsers();
        },
        setPageSize(size) {
            this.pageSize = size;
            this.page = 1;
            this.fetchUsers();
        },
        setOrdering(order) {
            this.ordering = order;
            this.fetchUsers();
        },
        toggleSelectedUser(userId) {
            if (this.selectedUsers.includes(userId)) {
                this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
            }
            else {
                this.selectedUsers.push(userId);
            }
        },
        toggleShowField(fieldKey) {
            this.showFields[fieldKey] = !this.showFields[fieldKey];
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
//# sourceMappingURL=member.js.map