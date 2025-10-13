<!-- src/components/AdminSidebar.vue -->
<template>
	<div
		:class="[
			'flex flex-col h-screen bg-slate-200 dark:bg-slate-800 transition-all duration-300 shadow-xl',
			isMinimized ? 'w-16 min-w-[4rem]' : 'w-64 min-w-[14rem]',
		]"
	>
		<button
			@click="toggleDark()"
			class="fixed bottom-2 left-2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-50 transition-colors duration-200 bg-slate-600 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500"
		>
			{{ isDark ? "🌙" : "☀️" }}
		</button>
		<div
			class="flex flex-col justify-between items-center p-4 bg-blue-600 dark:bg-blue-800"
		>
			<div class="flex flex-row items-center">
				<img
					:src="logoImg"
					alt="GLI Logo"
					class="w-12 p-1 object-contain bg-white rounded"
				/>
				<p v-if="!isMinimized" class="ml-2 font-medium text-white">
					GLI Platform
				</p>
			</div>
			<h2 v-if="!isMinimized" class="text-xl font-bold my-2 text-white">
				관리자 대시보드
			</h2>
			<span
				class="w-full cursor-pointer self-end text-white hover:text-green-400"
				:class="isMinimized ? 'text-center' : 'text-right'"
				@click="toggleSidebar"
			>
				{{ isMinimized ? "▶︎" : "◀︎" }}
			</span>
		</div>

		<div
			v-if="!isMinimized"
			class="bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded p-3 m-2"
		>
			<div v-if="userInfo" class="space-y-1">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">{{ userInfo.username }}</span>
					<button
						@click="handleLogout"
						class="text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
					>
						로그아웃
					</button>
				</div>
				<p class="text-xs text-slate-500 dark:text-slate-400 truncate">
					{{ userInfo.email }}
				</p>

				<div
					class="text-xs font-medium"
					:class="
						userInfo?.membership_level === 'vip' ||
						userInfo?.grade?.name === 'Super Admin'
							? 'text-purple-800 dark:text-purple-400'
							: 'text-emerald-600 dark:text-emerald-400'
					"
				>
					{{
						userInfo?.grade?.name || userInfo?.membership_level || "No Grade"
					}}
				</div>
			</div>
			<div v-else class="text-center">로그인 필요</div>
		</div>

		<nav class="menu flex-1 overflow-y-auto">
			<div v-for="item in menuItems" :key="item.path" class="font-bold">
				<div
					class="flex items-center p-3 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors duration-200"
					:class="{
						'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300':
							isActiveMenu(item),
						'justify-center': isMinimized,
					}"
					@click="handleMenuClick(item)"
				>
					<span class="icon" :class="{ 'mr-3': !isMinimized }">{{
						item.icon
					}}</span>
					<span v-if="!isMinimized">{{ item.title }}</span>
					<span v-if="!isMinimized && item.children" class="ml-auto">
						{{ expandedMenus.includes(item.path) ? "◀︎" : "▼" }}
					</span>
				</div>

				<!-- 하위 메뉴 -->
				<div
					v-if="
						!isMinimized && item.children && expandedMenus.includes(item.path)
					"
					class="pl-8 space-y-0.5"
				>
					<router-link
						v-for="child in item.children"
						:key="child.path"
						:to="child.path"
						class="flex items-center py-1.5 px-3 text-m hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors duration-200"
						:class="{
							'bg-emerald-100 text-emerald-800 dark:bg-slate-600 dark:text-emerald-300':
								$route.path === child.path,
						}"
					>
						<span class="text-slate-400 mr-2">-</span>
						<span class="font-medium">{{ child.title }}</span>
					</router-link>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import type { AdminUser } from "@/types/auth";
import logoImg from "/img/logo/logo.png";

import { useDark, useToggle } from "@vueuse/core";

interface MenuItem {
	icon: string;
	title: string;
	path: string;
	children?: Pick<MenuItem, "title" | "path">[]; // children은 icon을 제외한 MenuItem의 속성만 가집니다
}

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const userInfo = computed<AdminUser | null>(() => {
	try {
		return authStore.user;
	} catch (error) {
		console.error("Error accessing authStore.user:", error);
		return null;
	}
});
const isMinimized = ref(false);

// Simplified dark mode implementation to avoid @vueuse/core issues
const isDark = ref(false);
const toggleDark = () => {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle("dark", isDark.value);
	localStorage.setItem("admin-theme", isDark.value ? "dark" : "light");
};

// Initialize dark mode from localStorage
onMounted(() => {
	const savedTheme = localStorage.getItem("admin-theme");
	if (savedTheme === "dark") {
		isDark.value = true;
		document.documentElement.classList.add("dark");
	}
});

const handleLogout = async () => {
	try {
		await authStore.logout();
		router.push("/login");
	} catch (error) {
		console.error("로그아웃 실패:", error);
	}
};

const menuItems = [
	{ icon: "🏠", title: "대시보드", path: "/admin" },
	{ icon: "🔐", title: "관리자 관리", path: "/admin-management" },
	{
		icon: "📄",
		title: "사업소개-콘텐츠 관리",
		path: "/business",
		children: [
			{ title: "🎯 프로젝트 소개", path: "/business/project" },
			{ title: "👥 팀 구성원", path: "/business/team" },
			{ title: "📊 전략 로드맵", path: "/business/strategy" },
			{ title: "🗓️ 개발 일정", path: "/business/schedule" },
			{ title: "🪙 토큰 에코시스템", path: "/business/token-ecosystem" },
		],
	},
	{
		icon: "👥",
		title: "회원 관리",
		path: "/members",
		children: [
			{ title: "회원 목록", path: "/members/list" },
			{ title: "인증 상태", path: "/members/auth-status" },
			{ title: "거래 모니터링", path: "/members/transactions" },
		],
	},
	{
		icon: "🪙",
		title: "토큰 관리",
		path: "/tokens",
		children: [
			{ title: "토큰 사용처", path: "/tokens/usage" },
			{ title: "배포 계획", path: "/tokens/distribution" },
			{ title: "GLIB/GLID 관리", path: "/tokens/management" },
		],
	},
	{
		icon: "🔗",
		title: "Web3 통합",
		path: "/web3",
		children: [
			{ title: "블록체인 운영", path: "/web3/operations" },
			{ title: "스마트 계약", path: "/web3/contracts" },
			{ title: "토큰 전송", path: "/web3/transfers" },
		],
	},
	{
		icon: "📊",
		title: "분석 & 보고서",
		path: "/analytics",
		children: [
			{ title: "플랫폼 통계", path: "/analytics/platform" },
			{ title: "토큰 분석", path: "/analytics/tokens" },
			{ title: "사용자 활동", path: "/analytics/activity" },
		],
	},
	{
		icon: "⚙️",
		title: "시스템 설정",
		path: "/settings",
		children: [
			{ title: "API 설정", path: "/settings/api" },
			{ title: "시스템 로그", path: "/settings/logs" },
			{ title: "백업 & 복구", path: "/settings/backup" },
		],
	},
];

// const expandedMenus = ref<string[]>([]);
// 임시로 모든 하위 메뉴 expended
const expandedMenus = ref<string[]>(menuItems.map((item) => item.path));

const toggleSidebar = () => {
	isMinimized.value = !isMinimized.value;
	if (isMinimized.value) {
		expandedMenus.value = [];
	}
};

const findParentMenu = (currentPath: string) => {
	return menuItems.find((item) =>
		item.children?.some((child) => child.path === currentPath)
	);
};

const handleMenuClick = (item: MenuItem) => {
	if (item.children) {
		const isActive = expandedMenus.value.includes(item.path);
		const isOnChildRoute = item.children.some(
			(child) => route.path === child.path
		);

		if (isActive) {
			// 닫기
			expandedMenus.value = expandedMenus.value.filter((p) => p !== item.path);
		} else {
			// 열기
			expandedMenus.value.push(item.path);

			// 현재 경로가 이 하위 메뉴 중 하나가 아니면 첫 번째 자식으로 이동
			if (!isOnChildRoute) {
				router.push(item.children[0].path);
			}
		}
	} else {
		// 단일 메뉴일 경우
		router.push(item.path);
	}
};

const isActiveMenu = (item: MenuItem) => {
	if (item.children) {
		return item.children.some((child) => route.path === child.path);
	}
	return route.path === item.path;
};

// 현재 경로에 해당하는 상위 메뉴를 자동으로 확장
onMounted(() => {
	const parentMenu = findParentMenu(route.path);
	if (parentMenu && !expandedMenus.value.includes(parentMenu.path)) {
		expandedMenus.value.push(parentMenu.path);
	}
});

// 라우트 변경 시 해당하는 상위 메뉴 자동 확장
watch(
	() => route.path,
	(newPath) => {
		const parentMenu = findParentMenu(newPath);
		if (parentMenu && !expandedMenus.value.includes(parentMenu.path)) {
			expandedMenus.value.push(parentMenu.path);
		}
	}
);
</script>

<style>
/* 사이드메뉴 스크롤바 없애기 */
.menu {
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE and Edge */
}
.menu::-webkit-scrollbar {
	display: none; /* Chrome, Safari, Opera */
}
</style>
