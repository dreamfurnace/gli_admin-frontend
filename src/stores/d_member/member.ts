// src/stores/d_member/member.ts
import { defineStore } from 'pinia';
import api from '@/utils/axios';

export interface IUser {
    id: number;
    name: string;
    email: string;
    partner_code: string;
    status: string;
    user_type: string;
    image_url?: string;
    phone?: string;
    created_at: string;
    personal_no?: string;
    bank_no?: string;
    corp_ceo?: string;
    biz_no?: string;
    corp_no?: string;
}

export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        users: [],
        totalCount: 0,
        summary: null as null | {
            pending_join: 0;
            pending_change: 0;
            total: 0;
        },
        loading: false,
        error: '',
        page: 1,
        pageSize: 20,
        search: '',
        searchType: 'all',
        ordering: '-created_at',
        selectedUsers: [] as number[],
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
            } catch (err: any) {
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
            } catch (err: any) {
                this.error = err.response?.data?.detail || '회원 목록을 불러오지 못했습니다.';
            } finally {
                this.loading = false;
            }
        },

        setSearch(value: string) {
            this.search = value;
            this.page = 1;
            this.fetchUsers();
        },

        setSearchType(type: string) {
            this.searchType = type;
            this.page = 1;
            this.fetchUsers();
        },

        setPage(page: number) {
            this.page = page;
            this.fetchUsers();
        },

        setPageSize(size: number) {
            this.pageSize = size;
            this.page = 1;
            this.fetchUsers();
        },

        setOrdering(order: string) {
            this.ordering = order;
            this.fetchUsers();
        },

        toggleSelectedUser(userId: number) {
            if (this.selectedUsers.includes(userId)) {
                this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
            } else {
                this.selectedUsers.push(userId);
            }
        },

        toggleShowField(fieldKey: keyof typeof this.showFields) {
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
