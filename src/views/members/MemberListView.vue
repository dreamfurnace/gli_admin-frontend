<template>
	<div class="p-6">
		<!-- Header -->
		<div class="mb-6 flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					회원 목록
				</h1>
				<p class="text-gray-600 dark:text-gray-400">
					플랫폼 회원들을 조회하고 관리할 수 있습니다.
				</p>
			</div>
			<button
				@click="openCreateModal"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					></path>
				</svg>
				회원 추가
			</button>
		</div>

		<!-- Filters -->
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
		>
			<!-- Search -->
			<div class="md:col-span-2">
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					검색
				</label>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="이름, 이메일, 지갑 주소로 검색..."
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
					@input="handleSearch"
				/>
			</div>

			<!-- Membership Level Filter -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					멤버십 레벨
				</label>
				<select
					v-model="filters.membership_level"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
					@change="applyFilters"
				>
					<option value="">전체</option>
					<option value="basic">Basic</option>
					<option value="premium">Premium</option>
					<option value="vip">VIP</option>
				</select>
			</div>

			<!-- Active Status Filter -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					활성 상태
				</label>
				<select
					v-model="filters.is_active"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
					@change="applyFilters"
				>
					<option value="">전체</option>
					<option value="true">활성</option>
					<option value="false">비활성</option>
				</select>
			</div>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center"
		>
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600 dark:text-gray-400">회원 목록을 불러오는 중...</p>
		</div>

		<!-- Error State -->
		<div
			v-else-if="error"
			class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
		>
			<p class="text-red-800 dark:text-red-200">{{ error }}</p>
		</div>

		<!-- Members Table -->
		<div
			v-else
			class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
		>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								사용자명
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								이메일
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								지갑 주소
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								멤버십 레벨
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								SOL 잔액
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								상태
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								가입일
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								작업
							</th>
						</tr>
					</thead>
					<tbody
						class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
					>
						<tr
							v-for="member in paginatedMembers"
							:key="member.id"
							class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
						>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									{{ member.username }}
								</div>
								<div
									v-if="member.first_name || member.last_name"
									class="text-sm text-gray-500 dark:text-gray-400"
								>
									{{ member.first_name }} {{ member.last_name }}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 dark:text-white">
									{{ member.email }}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div
									class="text-sm text-gray-500 dark:text-gray-400 font-mono"
								>
									{{
										member.wallet_address
											? `${member.wallet_address.slice(0, 6)}...${member.wallet_address.slice(-4)}`
											: '-'
									}}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 py-1 text-xs font-semibold rounded-full"
									:class="getMembershipBadgeClass(member.membership_level)"
								>
									{{ getMembershipLabel(member.membership_level) }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 dark:text-white">
									{{ formatBalance(member.sol_balance) }} SOL
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 py-1 text-xs font-semibold rounded-full"
									:class="
										member.is_active
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
									"
								>
									{{ member.is_active ? '활성' : '비활성' }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500 dark:text-gray-400">
									{{ formatDate(member.created_at) }}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									@click="openEditModal(member)"
									class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
								>
									수정
								</button>
								<button
									@click="confirmDelete(member)"
									class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
								>
									삭제
								</button>
							</td>
						</tr>

						<tr v-if="filteredMembers.length === 0">
							<td colspan="8" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
								회원이 없습니다.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div
				v-if="filteredMembers.length > 0"
				class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600"
			>
				<div class="flex-1 flex justify-between sm:hidden">
					<button
						@click="previousPage"
						:disabled="currentPage === 1"
						class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
					>
						이전
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage === totalPages"
						class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
					>
						다음
					</button>
				</div>
				<div
					class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
				>
					<div>
						<p class="text-sm text-gray-700 dark:text-gray-300">
							총 <span class="font-medium">{{ filteredMembers.length }}</span>명 중
							<span class="font-medium">{{ startIndex + 1 }}</span>
							-
							<span class="font-medium">{{
								Math.min(endIndex, filteredMembers.length)
							}}</span>
							명 표시
						</p>
					</div>
					<div>
						<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
							<button
								@click="previousPage"
								:disabled="currentPage === 1"
								class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									></path>
								</svg>
							</button>
							<button
								v-for="page in displayedPages"
								:key="page"
								@click="goToPage(page)"
								:class="[
									'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
									page === currentPage
										? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
										: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
								]"
							>
								{{ page }}
							</button>
							<button
								@click="nextPage"
								:disabled="currentPage === totalPages"
								class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</button>
						</nav>
					</div>
				</div>
			</div>
		</div>

		<!-- Create/Edit Modal -->
		<div
			v-if="showModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			@click.self="closeModal"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
			>
				<div
					class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
				>
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						{{ isEditMode ? '회원 수정' : '회원 추가' }}
					</h3>
					<button
						@click="closeModal"
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<form @submit.prevent="handleSubmit" class="p-6 space-y-4">
					<!-- Username -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							사용자명 <span class="text-red-500">*</span>
						</label>
						<input
							v-model="formData.username"
							type="text"
							required
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<!-- Email -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							이메일 <span class="text-red-500">*</span>
						</label>
						<input
							v-model="formData.email"
							type="email"
							required
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<!-- First Name & Last Name -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								이름
							</label>
							<input
								v-model="formData.first_name"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								성
							</label>
							<input
								v-model="formData.last_name"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- Wallet Address -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							지갑 주소
						</label>
						<input
							v-model="formData.wallet_address"
							type="text"
							placeholder="Solana 지갑 주소"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
						/>
					</div>

					<!-- VPX Grade System -->
					<div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
						<h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							VPX 등급 시스템
						</h4>

						<!-- V (Verify) -->
						<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-semibold text-blue-700 dark:text-blue-300">
									V (Verify) 포인트
								</span>
								<span class="text-lg font-bold text-blue-700 dark:text-blue-300">
									{{ formData.vpx_verify }}
								</span>
							</div>
							<div class="space-y-2">
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.verify_email"
										type="checkbox"
										disabled
										class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 opacity-50 cursor-not-allowed"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										계정 유효 (Score 1) - 항상 참
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.verify_phone"
										type="checkbox"
										class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										핸드폰 번호 인증 (Score 2)
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.verify_face"
										type="checkbox"
										class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										3D 얼굴 인증 (Score 4)
									</label>
								</div>
							</div>
						</div>

						<!-- P (Partner) -->
						<div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-semibold text-green-700 dark:text-green-300">
									P (Partner) 포인트
								</span>
								<span class="text-lg font-bold text-green-700 dark:text-green-300">
									{{ formData.vpx_partner }}
								</span>
							</div>
							<div class="space-y-2">
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.partner_glid_acquired"
										type="checkbox"
										class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										GLID 확보 (Score 1)
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.partner_glid_deposited"
										type="checkbox"
										class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										GLID 예치 (Score 2)
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.partner_glib_presale"
										type="checkbox"
										class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										GLIB 엔젤 & 프리세일 참여 (Score 4)
									</label>
								</div>
							</div>
						</div>

						<!-- X (eXperience) -->
						<div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-semibold text-purple-700 dark:text-purple-300">
									X (eXperience) 포인트
								</span>
								<span class="text-lg font-bold text-purple-700 dark:text-purple-300">
									{{ formData.vpx_experience }}
								</span>
							</div>
							<div class="space-y-2">
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.experience_web3_wallet"
										type="checkbox"
										class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										Web3 지갑 연동 (Score 1)
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.experience_glil_usage"
										type="checkbox"
										class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										GLIL 사용 (소비) (Score 2)
									</label>
								</div>
								<div class="flex items-center">
									<input
										v-model="vpxCheckboxes.experience_glib_usage"
										type="checkbox"
										class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
									/>
									<label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
										GLIB 사용 (투자) (Score 4)
									</label>
								</div>
							</div>
						</div>
					</div>

					<!-- SOL Balance -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							SOL 잔액
						</label>
						<input
							v-model="formData.sol_balance"
							type="text"
							placeholder="0.000000000"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<!-- Active Status -->
					<div class="flex items-center">
						<input
							v-model="formData.is_active"
							type="checkbox"
							id="is_active"
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<label
							for="is_active"
							class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							활성 상태
						</label>
					</div>

					<!-- Submit Buttons -->
					<div class="flex justify-end gap-3 pt-4">
						<button
							type="button"
							@click="closeModal"
							class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
						>
							취소
						</button>
						<button
							type="submit"
							:disabled="submitting"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
						>
							{{ submitting ? '처리 중...' : isEditMode ? '수정' : '추가' }}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Delete Confirmation Modal -->
		<div
			v-if="showDeleteModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			@click.self="closeDeleteModal"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
			>
				<div class="p-6">
					<div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
						<svg
							class="w-6 h-6 text-red-600 dark:text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
						회원 삭제 확인
					</h3>
					<p class="text-gray-600 dark:text-gray-400 text-center mb-6">
						<strong>{{ memberToDelete?.username }}</strong> 회원을 삭제하시겠습니까?
						<br />
						이 작업은 되돌릴 수 없습니다.
					</p>
					<div class="flex justify-end gap-3">
						<button
							@click="closeDeleteModal"
							class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
						>
							취소
						</button>
						<button
							@click="handleDelete"
							:disabled="submitting"
							class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
						>
							{{ submitting ? '삭제 중...' : '삭제' }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import type { Member } from '@/types/api';

// State
const members = ref<Member[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const filters = ref({
	membership_level: '',
	is_active: '',
});

// Modal State
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const submitting = ref(false);
const currentMember = ref<Member | null>(null);
const memberToDelete = ref<Member | null>(null);

// Form Data
const formData = ref({
	username: '',
	email: '',
	first_name: '',
	last_name: '',
	wallet_address: '',
	membership_level: 'premium' as 'basic' | 'premium' | 'vip',
	sol_balance: '0.000000000',
	is_active: true,
	vpx_verify: 1, // 이메일 인증 기본값
	vpx_partner: 0,
	vpx_experience: 0,
});

// VPX 체크박스 상태
const vpxCheckboxes = ref({
	verify_email: true, // 항상 true
	verify_phone: false,
	verify_face: false,
	partner_glid_acquired: false,
	partner_glid_deposited: false,
	partner_glib_presale: false,
	experience_web3_wallet: false,
	experience_glil_usage: false,
	experience_glib_usage: false,
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed
const filteredMembers = computed(() => {
	let result = members.value;

	// Search filter
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(
			(member) =>
				member.username.toLowerCase().includes(query) ||
				member.email?.toLowerCase().includes(query) ||
				member.wallet_address?.toLowerCase().includes(query)
		);
	}

	// Membership level filter
	if (filters.value.membership_level) {
		result = result.filter(
			(member) => member.membership_level === filters.value.membership_level
		);
	}

	// Active status filter
	if (filters.value.is_active !== '') {
		const isActive = filters.value.is_active === 'true';
		result = result.filter((member) => member.is_active === isActive);
	}

	return result;
});

const totalPages = computed(() =>
	Math.ceil(filteredMembers.value.length / itemsPerPage)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedMembers = computed(() =>
	filteredMembers.value.slice(startIndex.value, endIndex.value)
);

const displayedPages = computed(() => {
	const pages: number[] = [];
	const maxPagesToShow = 5;
	let startPage = Math.max(
		1,
		currentPage.value - Math.floor(maxPagesToShow / 2)
	);
	let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

	if (endPage - startPage < maxPagesToShow - 1) {
		startPage = Math.max(1, endPage - maxPagesToShow + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return pages;
});

// Methods
const fetchMembers = async () => {
	try {
		loading.value = true;
		error.value = null;
		members.value = await apiService.getMembers();
	} catch (err: any) {
		error.value = err.message || '회원 목록을 불러오는데 실패했습니다.';
		console.error('Failed to fetch members:', err);
	} finally {
		loading.value = false;
	}
};

const handleSearch = () => {
	currentPage.value = 1;
};

const applyFilters = () => {
	currentPage.value = 1;
	// fetchMembers will be called with filters
	// For now, we filter on client side
};

const openCreateModal = () => {
	isEditMode.value = false;
	currentMember.value = null;
	formData.value = {
		username: '',
		email: '',
		first_name: '',
		last_name: '',
		wallet_address: '',
		membership_level: 'premium',
		sol_balance: '0.000000000',
		is_active: true,
		vpx_verify: 1, // 이메일 인증 기본값
		vpx_partner: 0,
		vpx_experience: 0,
	};
	// VPX 체크박스 초기화
	vpxCheckboxes.value = {
		verify_email: true,
		verify_phone: false,
		verify_face: false,
		partner_glid_acquired: false,
		partner_glid_deposited: false,
		partner_glib_presale: false,
		experience_web3_wallet: false,
		experience_glil_usage: false,
		experience_glib_usage: false,
	};
	showModal.value = true;
};

const openEditModal = (member: Member) => {
	isEditMode.value = true;
	currentMember.value = member;
	formData.value = {
		username: member.username,
		email: member.email,
		first_name: member.first_name || '',
		last_name: member.last_name || '',
		wallet_address: member.wallet_address || '',
		membership_level: member.membership_level,
		sol_balance: member.sol_balance,
		is_active: member.is_active,
		vpx_verify: member.vpx_verify,
		vpx_partner: member.vpx_partner,
		vpx_experience: member.vpx_experience,
	};
	// VPX 값에서 체크박스 상태 복원
	vpxCheckboxes.value = {
		verify_email: true, // 항상 true
		verify_phone: (member.vpx_verify & 2) === 2,
		verify_face: (member.vpx_verify & 4) === 4,
		partner_glid_acquired: (member.vpx_partner & 1) === 1,
		partner_glid_deposited: (member.vpx_partner & 2) === 2,
		partner_glib_presale: (member.vpx_partner & 4) === 4,
		experience_web3_wallet: (member.vpx_experience & 1) === 1,
		experience_glil_usage: (member.vpx_experience & 2) === 2,
		experience_glib_usage: (member.vpx_experience & 4) === 4,
	};
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	isEditMode.value = false;
	currentMember.value = null;
};

const handleSubmit = async () => {
	try {
		submitting.value = true;

		// VPX 체크박스 값을 비트플래그로 변환
		updateVPXFromCheckboxes();

		if (isEditMode.value && currentMember.value) {
			// Update existing member
			await apiService.updateMember(currentMember.value.id, formData.value);
		} else {
			// Create new member
			await apiService.createMember(formData.value);
		}

		await fetchMembers();
		closeModal();
	} catch (err: any) {
		error.value = err.message || '회원 저장에 실패했습니다.';
		console.error('Failed to save member:', err);
	} finally {
		submitting.value = false;
	}
};

// VPX 체크박스 값을 formData VPX 값으로 변환
const updateVPXFromCheckboxes = () => {
	formData.value.vpx_verify =
		(vpxCheckboxes.value.verify_email ? 1 : 0) |
		(vpxCheckboxes.value.verify_phone ? 2 : 0) |
		(vpxCheckboxes.value.verify_face ? 4 : 0);

	formData.value.vpx_partner =
		(vpxCheckboxes.value.partner_glid_acquired ? 1 : 0) |
		(vpxCheckboxes.value.partner_glid_deposited ? 2 : 0) |
		(vpxCheckboxes.value.partner_glib_presale ? 4 : 0);

	formData.value.vpx_experience =
		(vpxCheckboxes.value.experience_web3_wallet ? 1 : 0) |
		(vpxCheckboxes.value.experience_glil_usage ? 2 : 0) |
		(vpxCheckboxes.value.experience_glib_usage ? 4 : 0);
};

const confirmDelete = (member: Member) => {
	memberToDelete.value = member;
	showDeleteModal.value = true;
};

const closeDeleteModal = () => {
	showDeleteModal.value = false;
	memberToDelete.value = null;
};

const handleDelete = async () => {
	if (!memberToDelete.value) return;

	try {
		submitting.value = true;
		await apiService.deleteMember(memberToDelete.value.id);
		await fetchMembers();
		closeDeleteModal();
	} catch (err: any) {
		error.value = err.message || '회원 삭제에 실패했습니다.';
		console.error('Failed to delete member:', err);
	} finally {
		submitting.value = false;
	}
};

// Pagination methods
const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const goToPage = (page: number) => {
	currentPage.value = page;
};

// Helper methods
const getMembershipLabel = (level: string): string => {
	const labels: Record<string, string> = {
		basic: 'Basic',
		premium: 'Premium',
		vip: 'VIP',
	};
	return labels[level] || level;
};

const getMembershipBadgeClass = (level: string): string => {
	const classes: Record<string, string> = {
		basic: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
		premium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		vip: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
	};
	return classes[level] || classes.basic;
};

const formatBalance = (balance: string): string => {
	const num = parseFloat(balance);
	return isNaN(num) ? '0.00' : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
};

// Lifecycle
onMounted(() => {
	fetchMembers();
});
</script>
