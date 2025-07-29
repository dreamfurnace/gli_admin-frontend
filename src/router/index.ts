// src/router/index.ts
declare module 'vue-router' {
    export interface RouteMeta {
        requiresAuth: boolean;
        title?: string;
        permissions?: string[];
    }
}

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresAuth: false },
    },
    // GLI Platform Admin Routes
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/AdminDashboardView.vue'),
        meta: { requiresAuth: true, title: 'Dashboard' },
    },
    // Business Content Management Routes
    {
        path: '/business',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'info',
                name: 'business-info',
                component: () => import('@/views/business/CompanyInfoView.vue'),
                meta: { requiresAuth: true, title: 'Company Info' },
            },
            {
                path: 'team',
                name: 'business-team',
                component: () => import('@/views/business/TeamManagementView.vue'),
                meta: { requiresAuth: true, title: 'Team Management' },
            },
            {
                path: 'strategy',
                name: 'business-strategy',
                component: () => import('@/views/business/StrategyRoadmapView.vue'),
                meta: { requiresAuth: true, title: 'Strategy & Roadmap' },
            },
        ],
    },
    // Token Management Routes
    {
        path: '/tokens',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'usage',
                name: 'tokens-usage',
                component: () => import('@/views/tokens/TokenUsageView.vue'),
                meta: { requiresAuth: true, title: 'Token Usage Destinations' },
            },
            {
                path: 'distribution',
                name: 'tokens-distribution',
                component: () => import('@/views/tokens/DistributionPlanningView.vue'),
                meta: { requiresAuth: true, title: 'Distribution Planning' },
            },
            {
                path: 'management',
                name: 'tokens-management',
                component: () => import('@/views/tokens/GLIBGLIDManagementView.vue'),
                meta: { requiresAuth: true, title: 'GLIB/GLID Management' },
            },
        ],
    },
    // Member Management Routes
    {
        path: '/members',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'list',
                name: 'members-list',
                component: () => import('@/views/members/MemberListView.vue'),
                meta: { requiresAuth: true, title: 'Member List' },
            },
            {
                path: 'auth-status',
                name: 'members-auth-status',
                component: () => import('@/views/members/AuthStatusView.vue'),
                meta: { requiresAuth: true, title: 'Authentication Status' },
            },
            {
                path: 'transactions',
                name: 'members-transactions',
                component: () => import('@/views/members/TransactionMonitoringView.vue'),
                meta: { requiresAuth: true, title: 'Transaction Monitoring' },
            },
        ],
    },
    // Web3 Integration Routes
    {
        path: '/web3',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'operations',
                name: 'web3-operations',
                component: () => import('@/views/web3/BlockchainOperationsView.vue'),
                meta: { requiresAuth: true, title: 'Blockchain Operations' },
            },
            {
                path: 'contracts',
                name: 'web3-contracts',
                component: () => import('@/views/web3/SmartContractsView.vue'),
                meta: { requiresAuth: true, title: 'Smart Contracts' },
            },
            {
                path: 'transfers',
                name: 'web3-transfers',
                component: () => import('@/views/web3/TokenTransfersView.vue'),
                meta: { requiresAuth: true, title: 'Token Transfers' },
            },
        ],
    },
    // Analytics & Reports Routes
    {
        path: '/analytics',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'platform',
                name: 'analytics-platform',
                component: () => import('@/views/analytics/PlatformStatisticsView.vue'),
                meta: { requiresAuth: true, title: 'Platform Statistics' },
            },
            {
                path: 'tokens',
                name: 'analytics-tokens',
                component: () => import('@/views/analytics/TokenAnalyticsView.vue'),
                meta: { requiresAuth: true, title: 'Token Analytics' },
            },
            {
                path: 'activity',
                name: 'analytics-activity',
                component: () => import('@/views/analytics/UserActivityView.vue'),
                meta: { requiresAuth: true, title: 'User Activity' },
            },
        ],
    },
    // System Settings Routes
    {
        path: '/settings',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'api',
                name: 'settings-api',
                component: () => import('@/views/settings/APIConfigurationView.vue'),
                meta: { requiresAuth: true, title: 'API Configuration' },
            },
            {
                path: 'logs',
                name: 'settings-logs',
                component: () => import('@/views/settings/SystemLogsView.vue'),
                meta: { requiresAuth: true, title: 'System Logs' },
            },
            {
                path: 'backup',
                name: 'settings-backup',
                component: () => import('@/views/settings/BackupRecoveryView.vue'),
                meta: { requiresAuth: true, title: 'Backup & Recovery' },
            },
        ],
    },
    // Fallback route for 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { requiresAuth: false },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    try {
        const authStore = useAuthStore();
        const isAuthenticated = authStore.isAuthenticated;

        const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

        if (requiresAuth && !isAuthenticated) {
            return next('/login'); // ✅ 조기 리턴
        }

        next();
    } catch (error) {
        console.error('Router navigation error:', error);
        try {
            const authStore = useAuthStore();
            authStore.logout();
        } catch (e) {
            console.error('Logout failed during navigation error recovery:', e);
        }
        return next('/login');
    }
});

export default router;
