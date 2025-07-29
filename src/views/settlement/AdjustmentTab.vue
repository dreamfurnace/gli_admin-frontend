<!-- /admin-frontend/src/views/settlement/AdjustmentTab.vue -->
<template>
    <div class="p-4 space-y-8 h-full overflow-y-auto">
        <h1 class="text-xl font-bold">{{ props.selectedMonth }} 정산 준비</h1>
        <!-- 1. 사전 정보 확인 -->
        <section>
            <h2 class="text-lg font-bold mb-2">1. 사전 정보 확인</h2>
            <div class="ml-6 overflow-x-auto">
                <table
                    class="min-w-[600px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800"
                >
                    <thead class="bg-slate-200 dark:bg-orange-900">
                        <tr>
                            <th class="px-3 py-2 border-r border-slate-600">검사 대상</th>
                            <th class="px-3 py-2 border-r border-slate-600">항목</th>
                            <th class="px-3 py-2 border-r border-slate-600">검사 대상 건</th>
                            <th class="px-3 py-2 border-r border-slate-600">정상 건수</th>
                            <th class="px-3 py-2 border-r border-slate-600">오류 건수</th>
                            <th class="px-3 py-2 text-center">결과</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in adjustmentStore.precheckList" :key="item.label">
                            <td
                                v-if="idx === 0 || idx === 4"
                                :rowspan="idx === 0 ? 4 : 3"
                                class="px-3 py-1 border-b border-r border-slate-600 text-center"
                            >
                                {{ item.target }}
                            </td>
                            <td
                                class="px-3 py-1 border-r border-slate-600"
                                :class="{ 'border-b border-slate-600': idx === 3 }"
                            >
                                {{ item.label }}
                            </td>
                            <td
                                class="px-3 py-1 border-r border-slate-600 text-right"
                                :class="{ 'border-b border-slate-600': idx === 3 }"
                            >
                                {{ item.totalCount }}
                            </td>
                            <td
                                class="px-3 py-1 border-r border-slate-600 text-right"
                                :class="{ 'border-b border-slate-600': idx === 3 }"
                            >
                                {{ item.normalCount }}
                            </td>
                            <td
                                class="px-3 py-1 border-r border-slate-600 text-right"
                                :class="{
                                    'border-b border-slate-600': idx === 3,
                                    'text-red-600': item.errorCount > 0,
                                }"
                            >
                                {{ item.errorCount }}
                            </td>
                            <td
                                class="px-3 py-1 text-center"
                                :class="{ 'border-b border-slate-600': idx === 3 }"
                            >
                                <span v-if="item.errorCount === 0" class="text-green-600">✅</span>
                                <button
                                    v-else
                                    @click="openErrorModal(item.errorModalTitle, item.errorDetail)"
                                    class="inline-block bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-xs font-bold transition-colors"
                                >
                                    오류 [자세히 보기]
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 2. 정산 파일 업로드 -->
        <section>
            <h2 class="text-lg font-bold mb-2">2. 정산 파일 업로드</h2>
            <div class="ml-6 overflow-x-auto">
                <table
                    class="text-balance min-w-[600px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800"
                >
                    <thead class="bg-amber-100 dark:bg-yellow-900">
                        <tr>
                            <th class="px-3 py-2 border-r border-slate-600">유통사 양식</th>
                            <th class="px-3 py-2 border-r border-slate-600">양식 관리</th>
                            <th class="px-3 py-2 border-r border-slate-600">파일 업로드</th>
                            <th class="px-3 py-2">파일 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in adjustmentStore.uploadRows" :key="row.label">
                            <td class="px-3 py-1 border-r border-slate-600">{{ row.label }}</td>
                            <td class="px-3 py-1 border-r border-slate-600 text-center">
                                <button
                                    class="bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium rounded px-3 py-1 transition-colors whitespace-nowrap"
                                    @click="openNotSupportModal"
                                >
                                    양식 관리
                                </button>
                            </td>
                            <td class="px-3 py-1 border-r border-slate-600 text-center">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input
                                        :key="'file-input-' + fileInputKey[idx]"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        class="hidden"
                                        @change="(e) => onFileChange(e, idx)"
                                    />
                                    <span
                                        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded px-4 py-1 transition-colors whitespace-nowrap cursor-pointer"
                                        >선택</span
                                    >
                                </label>
                                <span class="ml-2 text-xs text-gray-500" v-if="row.fileName">
                                    {{ row.fileName }}
                                </span>
                                <button v-if="row.fileName" class="ml-1" @click="removeFile(idx)">
                                    🗑️
                                </button>
                            </td>
                            <td class="px-3 py-1 text-center">
                                <span v-if="row.status === 'None'" class="text-gray-400">
                                    미처리
                                </span>
                                <span v-else-if="row.status === 'Parsed'" class="text-emerald-700">
                                    분석 완료
                                </span>
                                <span v-else-if="row.status === 'Parsed-S2'" class="text-blue-600">
                                    분석 중..(S2)
                                </span>
                                <span v-else-if="row.status === 'Parsing'" class="text-blue-600">
                                    처리 중
                                </span>
                                <!-- Error 포함 시 -->
                                <span v-else-if="row.status === 'Error'" class="text-red-600">
                                    오류
                                </span>
                                <span
                                    v-else-if="row.status === 'Error-Parsing'"
                                    class="text-red-600"
                                >
                                    오류
                                </span>
                                <span v-else class="text-gray-400">오류 값 확인 필요</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 적재 프로세스 현황 -->
        <section class="ml-6">
            <div class="flex items-center gap-2 mb-2">
                <h2 class="text-m">세부 적재 프로세스</h2>

                <!-- 새로고침 버튼 -->
                <button
                    @click="fetchDetaileTablesLoadStatus"
                    class="text-sm text-blue-600 hover:underline focus:outline-none"
                >
                    🔄 새로고침
                </button>
                <button
                    @click="showLoadStatus = !showLoadStatus"
                    class="text-sm text-gray-600 hover:underline focus:outline-none"
                >
                    {{ showLoadStatus ? '숨기기 ▲' : '펼치기 ▼' }}
                </button>
            </div>

            <div v-if="showLoadStatus" class="overflow-x-auto">
                <table
                    class="min-w-[800px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800"
                >
                    <thead class="bg-slate-100 dark:bg-slate-900">
                        <tr>
                            <th class="px-3 py-0 border border-slate-600">1</th>
                            <th class="px-3 py-0 border border-slate-600">2</th>
                            <th class="px-3 py-0 border border-slate-600">3</th>
                            <th class="px-3 py-0 border border-slate-600">4</th>
                            <th class="px-3 py-0 border border-slate-600">5</th>
                            <th class="px-3 py-0 border border-slate-600">6</th>
                            <th class="px-3 py-0 border border-slate-600">7</th>
                            <th class="px-3 py-0 border border-slate-600">8</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-center">
                            <td
                                v-for="table in loadProcessTables"
                                :key="table.key"
                                class="px-1 text-sm py-1 border border-slate-600"
                            >
                                <span>
                                    {{ table.label }}
                                </span>
                            </td>
                        </tr>

                        <tr class="text-center">
                            <td
                                v-for="(table, idx) in filteredTables"
                                :key="table.key + '-status'"
                                :colspan="idx === 3 || idx === 4 ? 2 : undefined"
                                class="px-0 text-sm py-1 border border-slate-600"
                            >
                                <span v-if="!isTableStatusLoaded">...⏳</span>
                                <span
                                    v-else
                                    :class="
                                        tableLoadStatus[table.key]
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    "
                                >
                                    {{ tableLoadStatus[table.key] ? '유' : '무' }}
                                </span>

                                <!-- 버튼도 로딩되기 전에는 숨김 -->
                                <template v-if="isTableStatusLoaded">
                                    <button
                                        v-if="tableLoadStatus[table.key]"
                                        class="ml-1 text-red-600 hover:underline"
                                        @click="deleteDetailTableData(table.key)"
                                    >
                                        [Del {{ table.step }}]
                                    </button>
                                    <button
                                        v-else-if="table.step > 1"
                                        class="ml-1 text-blue-600 hover:underline"
                                        @click="processDetailTable(table.key)"
                                    >
                                        [Do {{ table.step }}]
                                    </button>
                                </template>
                            </td>
                        </tr>
                        <tr class="text-center"></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 3. 이메일 확인 마감일 설정 -->
        <section>
            <h2 class="text-lg font-bold mb-2">3. 이메일 확인 마감일 설정</h2>
            <div class="flex items-center gap-4">
                <label class="ml-6 font-semibold whitespace-nowrap"> 메일확인 마감일 설정 </label>
                <input
                    type="date"
                    v-model="adjustmentStore.emailDeadline"
                    class="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    style="min-width: 160px"
                />
            </div>
        </section>

        <!-- 4. 하단 버튼 -->
        <div class="flex justify-center gap-4 mt-10">
            <button
                class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-2 rounded disabled:bg-gray-300"
                @click="onClickSaveConfirm"
            >
                저장
            </button>
            <BaseButtonA :canClick="adjustmentStore.canCreateSettlement" @click="onGoToBalance">
                정산 만들기 : (B)alance로
            </BaseButtonA>
        </div>
    </div>

    <!-- 모달 -->
    <BaseModal
        v-if="showModal"
        :title="modalTitle"
        :message="modalMessage"
        :buttons="modalButtons"
        @background-click="showModal = false"
    />

    <BaseModal
        v-if="showErrorModal"
        :title="errorModalTitle"
        :message="errorModalMsg"
        :buttons="[{ text: '확인', type: 'primary', onClick: () => (showErrorModal = false) }]"
        @close="showErrorModal = false"
        @background-click="showErrorModal = false"
    >
        <template #default>
            <div class="overflow-auto max-h-[400px]">
                <table class="w-full text-sm border-collapse">
                    <thead class="bg-slate-200 dark:bg-slate-700 sticky top-0">
                        <tr>
                            <th class="border border-gray-400 px-3 py-2">No</th>
                            <th
                                v-for="key in tableHeaders"
                                :key="key"
                                class="border border-gray-400 px-3 py-2"
                            >
                                {{ formatHeader(key) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(detail, idx) in parsedErrorDetails"
                            :key="idx"
                            class="text-center"
                        >
                            <td class="border border-gray-400 px-3 py-1">{{ idx + 1 }}</td>
                            <td
                                v-for="key in tableHeaders"
                                :key="key"
                                class="border border-gray-400 px-3 py-1"
                            >
                                {{ detail[key] }}
                            </td>
                        </tr>
                        <tr v-if="!parsedErrorDetails.length">
                            <td
                                :colspan="tableHeaders.length + 1"
                                class="text-center border border-gray-400 px-3 py-2"
                            >
                                상세 오류 정보가 없습니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { useSettlementStore } from '@/stores/b_settlement/settlement';
import { useAdjustmentStore } from '@/stores/b_settlement/adjustment';
import BaseModal from '@/components/BaseModal.vue';
import BaseButtonA from '@/components/BaseButtonA.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { TabType } from '@/types/settlement';
import { useToast } from 'vue-toastification';

const settlementStore = useSettlementStore();
const adjustmentStore = useAdjustmentStore();

const props = defineProps<{
    selectedMonth: string;
    selectedMonthId: number;
}>();

// 서버 반영 상태를 별도의 ref로 관리
const savedAdjustmentStatus = ref<boolean[]>([false, false, false]);
const showLoadStatus = ref(true);

const fileInputKey = ref([0, 0]); // uploadRows의 개수와 동일한 길이로 초기화

onMounted(async () => {
    if (props.selectedMonth) {
        await onMonthChanged(props.selectedMonth);
    }
});

const emit = defineEmits<{
    (e: 'update-abc-progress', tab: TabType, status: string): void;
    (e: 'update-inside-status', status: { adjustment: boolean[] }): void;
    (e: 'go-balance'): void;
}>();

// 하나라도 처리 중인 파일이 있는지 확인
const isAnyFileProcessing = computed(() => {
    return adjustmentStore.uploadRows.some((row) => ['Parsing'].includes(row.status));
});

const showErrorModal = ref(false);
const errorModalTitle = ref('');
const errorModalMsg = ref('[]');

function openErrorModal(title: string, jsonMsg: string) {
    errorModalTitle.value = title;
    errorModalMsg.value = jsonMsg || '[]';
    showErrorModal.value = true;
}

interface ErrorDetailItem {
    [key: string]: string | number; // key-value 형식 범용
}

const parsedErrorDetails = computed<ErrorDetailItem[]>(() => {
    try {
        const data = JSON.parse(errorModalMsg.value);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('오류 데이터 파싱 중 오류 발생:', error);
        return [];
    }
});

const tableHeaders = computed(() => {
    if (!parsedErrorDetails.value.length) return [];
    return Object.keys(parsedErrorDetails.value[0]);
});

// 옵션: 헤더를 보기 좋게 바꿔줌
function formatHeader(key: string) {
    const headersMap: Record<string, string> = {
        album_id: '앨범 ID',
        album_name: '앨범명',
        song_name: '곡명',
        song_id: '곡 ID',
        artist_name: '아티스트명',
        reason: '오류 이유',
        user_name: '회원명',
        user_id: '회원 ID',
        bank_info: '은행 정보',
        email: '이메일',
        biz_type: '사업자 유형',
        settle_rate: '지분율',
    };
    return headersMap[key] || key;
}

const showModal = ref(false);

const modalTitle = ref('');
const modalMessage = ref('');
const modalButtons = ref<{ text: string; onClick: () => void; type?: 'primary' | 'default' }[]>([]);

function openNotSupportModal() {
    modalTitle.value = '지원하지 않는 기능';
    modalMessage.value = '현재 제공하지 않는 기능입니다. 관리자에게 문의해주세요.';
    modalButtons.value = [
        {
            text: '확인',
            type: 'primary',
            onClick: () => {
                showModal.value = false;
            },
        },
    ];
    showModal.value = true;
}

function onFileChange(e: Event, idx: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        adjustmentStore.setFile(idx, file);
    }
}

function removeFile(idx: number) {
    if (adjustmentStore.uploadRows[idx]) {
        adjustmentStore.uploadRows[idx].file = null;
        adjustmentStore.uploadRows[idx].fileName = '';
        fileInputKey.value[idx]++;
    }
}

function onClickSaveConfirm() {
    const changedEmail = adjustmentStore.emailDeadline !== adjustmentStore.initialEmailDeadline;
    const uploadedFiles = adjustmentStore.uploadRows.map((row) => row.file?.name || '없음');

    modalTitle.value = '저장 확인';
    modalMessage.value = `
   📅 이메일 마감일: ${changedEmail ? '변경됨' : '변경 없음'}  
   📁 업로드 파일: 국내 - ${uploadedFiles[0]}, 해외 - ${uploadedFiles[1]}

   위 내용으로 저장하시겠습니까?
    `;

    modalButtons.value = [
        { text: '취소', type: 'default', onClick: () => (showModal.value = false) },
        { text: '확인', type: 'primary', onClick: onSaveClick },
    ];
    showModal.value = true;
}

async function onSaveClick() {
    showModal.value = false;

    try {
        // 1. 현재 업로드된 파일 상태 확인
        const files = adjustmentStore.uploadRows.map((row) => row.file).filter(Boolean); // null이 아닌 것만

        // 2. 파일이 1개만 있는 경우 → 허용 안 함
        if (files.length === 1) {
            modalTitle.value = '업로드 오류';
            modalMessage.value = '파일은 반드시 2개를 함께 업로드해야 합니다.';
            showModal.value = true;
            return;
        }

        // 3. 변경된 것이 없는 경우 → 저장 불가
        const emailChanged = adjustmentStore.emailDeadline !== adjustmentStore.initialEmailDeadline;
        if (!emailChanged && files.length === 0) {
            modalTitle.value = '저장할 변경 내용이 없습니다.';
            modalMessage.value = '이메일이나 파일이 변경되지 않았습니다.';
            showModal.value = true;
            return;
        }

        // 4. 저장 요청

        const presign = await adjustmentStore.getPresignedUrls();
        await adjustmentStore.uploadAllFilesToS3(presign);

        modalTitle.value = '저장 완료';
        modalMessage.value = '정상적으로 저장되었습니다.';

        // 5. 서버 상태 새로 조회 후 저장
        // await adjustmentStore.fetchVerificationData();
        // savedAdjustmentStatus.value = [...adjustmentStore.AdjustmentStatus];
        emit('update-inside-status', { adjustment: savedAdjustmentStatus.value });

        // 6. 상위 파일에 상태 전달
        emit('update-abc-progress', 'adjustment', 'inProgress');
        useToast().success('업로드 및 분석 요청 완료');
    } catch (e: unknown) {
        modalTitle.value = '파일 등록 및 저장 실패';
        modalMessage.value = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
    } finally {
        modalButtons.value = [
            { text: '확인', type: 'primary', onClick: () => (showModal.value = false) },
        ];
        showModal.value = true;
    }
}

async function onGoToBalance() {
    if (!adjustmentStore.canCreateSettlement) {
        modalTitle.value = '정산을 진행할 수 없습니다';
        modalMessage.value = getSettlementBlockedReasons();
        modalButtons.value = [
            { text: '확인', type: 'primary', onClick: () => (showModal.value = false) },
        ];
        showModal.value = true;
        return;
    }

    await settlementStore.updateMonthStatus(props.selectedMonth, 'Balance');

    emit('update-abc-progress', 'adjustment', 'completed');
    emit('update-abc-progress', 'balance', 'inProgress');
    emit('update-inside-status', { adjustment: [true, true, true] });
    emit('go-balance');
}

function getSettlementBlockedReasons() {
    const reasons = [];

    const precheckOk = adjustmentStore.precheckList.every((i) => i.errorCount === 0);
    if (!precheckOk) reasons.push(' > 사전 정보 확인 표에 오류가 있습니다.\n');

    const filesOk = adjustmentStore.uploadRows.every((row) => row.status === 'Parsed');
    if (!filesOk)
        reasons.push(' > 정산 파일 2개가 모두 정상적으로 분석 완료(Parsed)가 되어야 합니다.\n');

    if (!adjustmentStore.emailDeadline) reasons.push(' > 메일 마감일이 입력되지 않았습니다.\n');

    return reasons.join('');
}

// 적재 프로세스 상세 보기 표 영역 관련 기능
const isTableStatusLoaded = ref(false);

const loadProcessTables = [
    // 1단계
    { key: 'settle_files', label: 'settle_files', step: 1 },

    // 2단계
    { key: 'settle_data', label: 'settle_data', step: 2 },

    // 3단계
    { key: 'song_settles', label: 'song_settles', step: 3 },

    // 4단계 (5단계는 버튼 없음 )
    { key: 'album_settles', label: 'album_settles', step: 4 },
    { key: 'b5_album_advances_bespoke', label: 'b5_album_advances (bespok_fee 차감)', step: 5 },

    // 6단계 (7단계는 버튼 없음)
    { key: 'b6_user_album_settles', label: 'b6_user_album_settles', step: 6 },
    {
        key: 'b5_album_advances_normal',
        label: 'b5_album_advances (normal_recoup 차감)',
        step: 7,
    },

    // 8단계
    { key: 'user_settles', label: 'user_settles', step: 8 },
];

// 테이블별 유/무 상태
const tableLoadStatus = ref<{ [key: string]: boolean }>({});

const filteredTables = computed(() => loadProcessTables.filter((_, idx) => idx !== 4 && idx !== 6));

let latestRequestId = 0;

// 테이블 상태 불러오기 API 호출 (예시: adjustmentStore.fetchDetailTableData_Status)
async function fetchDetaileTablesLoadStatus() {
    const requestId = ++latestRequestId;
    isTableStatusLoaded.value = false;

    try {
        const result = await adjustmentStore.fetchDetailTableData_Status(props.selectedMonthId);

        // ✅ 응답 도착 시점에 여전히 최신 요청인지 확인
        if (requestId !== latestRequestId) {
            console.warn('이전 월 응답 도착: 무시됨');
            return;
        }

        tableLoadStatus.value = {};
        result.forEach(({ table, exists }: { table: string; exists: boolean }) => {
            tableLoadStatus.value[table] = exists;
        });
    } catch (e) {
        console.error('테이블 상태 조회 실패:', e);
    } finally {
        isTableStatusLoaded.value = true; // 로딩 완료
    }
}
// 1,2,3,4,6,8 단계만 처리 대상 (index 기준으로 0,1,2,3,5,7)
const processableTables = computed(() => {
    return loadProcessTables.filter((_, idx) => [0, 1, 2, 3, 5, 7].includes(idx));
});

const lastLoadedTableKey = computed(() => {
    const reversed = [...processableTables.value].reverse();
    return reversed.find((t) => tableLoadStatus.value[t.key])?.key || null;
});

const firstNotLoadedTableKey = computed(() => {
    return processableTables.value.find((t) => !tableLoadStatus.value[t.key])?.key || null;
});

// 삭제 요청
async function deleteDetailTableData(tableKey: string) {
    if (tableKey !== lastLoadedTableKey.value) {
        alert(`[Del] ${tableKey}는 삭제할 수 없습니다. 마지막 단계만 가능합니다.`);
        return;
    }

    // ✅ settle_files일 경우 추가 검사
    if (tableKey === 'settle_files' && isAnyFileProcessing.value) {
        alert('파일 처리 작업이 끝나고 가능합니다.');
        return;
    }

    const confirmed = confirm(`${tableKey}의 데이터를 정말 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
        await adjustmentStore.deleteDetaileTableData(props.selectedMonthId, tableKey);
        await fetchDetaileTablesLoadStatus();

        // ✅ [Del 8] (user_settles 삭제) 시 상태 전달
        if (tableKey === 'user_settles') {
            emit('update-abc-progress', 'adjustment', 'inProgress');
        }
    } catch (e) {
        console.error(`${tableKey} 삭제 실패:`, e);
    }
}

async function processDetailTable(tableKey: string) {
    if (tableKey !== firstNotLoadedTableKey.value) {
        alert(`[Do] ${tableKey}는 적재할 수 없습니다. 가장 앞 단계만 가능합니다.`);
        return;
    }

    try {
        await adjustmentStore.processTable(props.selectedMonthId, tableKey);
        await fetchDetaileTablesLoadStatus();
    } catch (e) {
        console.error(`단계 적재 실패 (${tableKey}):`, e);
    }
}

watch(
    () => props.selectedMonth,
    async (newMonth) => {
        if (newMonth) {
            await onMonthChanged(newMonth);
        }
    }
);

async function onMonthChanged(month: string) {
    await adjustmentStore.fetchVerificationData();

    savedAdjustmentStatus.value = [...adjustmentStore.AdjustmentStatus];
    emit('update-inside-status', { adjustment: savedAdjustmentStatus.value });

    fileInputKey.value = [Date.now(), Date.now() + 1];

    await fetchDetaileTablesLoadStatus();
}
</script>
