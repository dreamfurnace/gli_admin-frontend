import { useSettlementStore } from '@/stores/b_settlement/settlement';
import { useAdjustmentStore } from '@/stores/b_settlement/adjustment';
import BaseModal from '@/components/BaseModal.vue';
import BaseButtonA from '@/components/BaseButtonA.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
const settlementStore = useSettlementStore();
const adjustmentStore = useAdjustmentStore();
const props = defineProps();
// 서버 반영 상태를 별도의 ref로 관리
const savedAdjustmentStatus = ref([false, false, false]);
const showLoadStatus = ref(true);
const fileInputKey = ref([0, 0]); // uploadRows의 개수와 동일한 길이로 초기화
onMounted(async () => {
    if (props.selectedMonth) {
        await onMonthChanged(props.selectedMonth);
    }
});
const emit = defineEmits();
// 하나라도 처리 중인 파일이 있는지 확인
const isAnyFileProcessing = computed(() => {
    return adjustmentStore.uploadRows.some((row) => ['Parsing'].includes(row.status));
});
const showErrorModal = ref(false);
const errorModalTitle = ref('');
const errorModalMsg = ref('[]');
function openErrorModal(title, jsonMsg) {
    errorModalTitle.value = title;
    errorModalMsg.value = jsonMsg || '[]';
    showErrorModal.value = true;
}
const parsedErrorDetails = computed(() => {
    try {
        const data = JSON.parse(errorModalMsg.value);
        return Array.isArray(data) ? data : [];
    }
    catch (error) {
        console.error('오류 데이터 파싱 중 오류 발생:', error);
        return [];
    }
});
const tableHeaders = computed(() => {
    if (!parsedErrorDetails.value.length)
        return [];
    return Object.keys(parsedErrorDetails.value[0]);
});
// 옵션: 헤더를 보기 좋게 바꿔줌
function formatHeader(key) {
    const headersMap = {
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
const modalButtons = ref([]);
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
function onFileChange(e, idx) {
    const file = e.target.files?.[0];
    if (file) {
        adjustmentStore.setFile(idx, file);
    }
}
function removeFile(idx) {
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
    }
    catch (e) {
        modalTitle.value = '파일 등록 및 저장 실패';
        modalMessage.value = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
    }
    finally {
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
    if (!precheckOk)
        reasons.push(' > 사전 정보 확인 표에 오류가 있습니다.\n');
    const filesOk = adjustmentStore.uploadRows.every((row) => row.status === 'Parsed');
    if (!filesOk)
        reasons.push(' > 정산 파일 2개가 모두 정상적으로 분석 완료(Parsed)가 되어야 합니다.\n');
    if (!adjustmentStore.emailDeadline)
        reasons.push(' > 메일 마감일이 입력되지 않았습니다.\n');
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
const tableLoadStatus = ref({});
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
        result.forEach(({ table, exists }) => {
            tableLoadStatus.value[table] = exists;
        });
    }
    catch (e) {
        console.error('테이블 상태 조회 실패:', e);
    }
    finally {
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
async function deleteDetailTableData(tableKey) {
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
    if (!confirmed)
        return;
    try {
        await adjustmentStore.deleteDetaileTableData(props.selectedMonthId, tableKey);
        await fetchDetaileTablesLoadStatus();
        // ✅ [Del 8] (user_settles 삭제) 시 상태 전달
        if (tableKey === 'user_settles') {
            emit('update-abc-progress', 'adjustment', 'inProgress');
        }
    }
    catch (e) {
        console.error(`${tableKey} 삭제 실패:`, e);
    }
}
async function processDetailTable(tableKey) {
    if (tableKey !== firstNotLoadedTableKey.value) {
        alert(`[Do] ${tableKey}는 적재할 수 없습니다. 가장 앞 단계만 가능합니다.`);
        return;
    }
    try {
        await adjustmentStore.processTable(props.selectedMonthId, tableKey);
        await fetchDetaileTablesLoadStatus();
    }
    catch (e) {
        console.error(`단계 적재 실패 (${tableKey}):`, e);
    }
}
watch(() => props.selectedMonth, async (newMonth) => {
    if (newMonth) {
        await onMonthChanged(newMonth);
    }
});
async function onMonthChanged(month) {
    await adjustmentStore.fetchVerificationData();
    savedAdjustmentStatus.value = [...adjustmentStore.AdjustmentStatus];
    emit('update-inside-status', { adjustment: savedAdjustmentStatus.value });
    fileInputKey.value = [Date.now(), Date.now() + 1];
    await fetchDetaileTablesLoadStatus();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 space-y-8 h-full overflow-y-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-xl font-bold" },
});
(props.selectedMonth);
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-6 overflow-x-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "min-w-[600px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
    ...{ class: "bg-slate-200 dark:bg-orange-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [item, idx] of __VLS_getVForSourceType((__VLS_ctx.adjustmentStore.precheckList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (item.label),
    });
    if (idx === 0 || idx === 4) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            rowspan: (idx === 0 ? 4 : 3),
            ...{ class: "px-3 py-1 border-b border-r border-slate-600 text-center" },
        });
        (item.target);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600" },
        ...{ class: ({ 'border-b border-slate-600': idx === 3 }) },
    });
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600 text-right" },
        ...{ class: ({ 'border-b border-slate-600': idx === 3 }) },
    });
    (item.totalCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600 text-right" },
        ...{ class: ({ 'border-b border-slate-600': idx === 3 }) },
    });
    (item.normalCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600 text-right" },
        ...{ class: ({
                'border-b border-slate-600': idx === 3,
                'text-red-600': item.errorCount > 0,
            }) },
    });
    (item.errorCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 text-center" },
        ...{ class: ({ 'border-b border-slate-600': idx === 3 }) },
    });
    if (item.errorCount === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-green-600" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(item.errorCount === 0))
                        return;
                    __VLS_ctx.openErrorModal(item.errorModalTitle, item.errorDetail);
                } },
            ...{ class: "inline-block bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-xs font-bold transition-colors" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-6 overflow-x-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "text-balance min-w-[600px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
    ...{ class: "bg-amber-100 dark:bg-yellow-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2 border-r border-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "px-3 py-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [row, idx] of __VLS_getVForSourceType((__VLS_ctx.adjustmentStore.uploadRows))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (row.label),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600" },
    });
    (row.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600 text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.openNotSupportModal) },
        ...{ class: "bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium rounded px-3 py-1 transition-colors whitespace-nowrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 border-r border-slate-600 text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "inline-flex items-center cursor-pointer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: ((e) => __VLS_ctx.onFileChange(e, idx)) },
        key: ('file-input-' + __VLS_ctx.fileInputKey[idx]),
        type: "file",
        accept: ".xlsx,.xls",
        ...{ class: "hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded px-4 py-1 transition-colors whitespace-nowrap cursor-pointer" },
    });
    if (row.fileName) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ml-2 text-xs text-gray-500" },
        });
        (row.fileName);
    }
    if (row.fileName) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(row.fileName))
                        return;
                    __VLS_ctx.removeFile(idx);
                } },
            ...{ class: "ml-1" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "px-3 py-1 text-center" },
    });
    if (row.status === 'None') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
    else if (row.status === 'Parsed') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-emerald-700" },
        });
    }
    else if (row.status === 'Parsed-S2') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-blue-600" },
        });
    }
    else if (row.status === 'Parsing') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-blue-600" },
        });
    }
    else if (row.status === 'Error') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-red-600" },
        });
    }
    else if (row.status === 'Error-Parsing') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-red-600" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "ml-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-m" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.fetchDetaileTablesLoadStatus) },
    ...{ class: "text-sm text-blue-600 hover:underline focus:outline-none" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showLoadStatus = !__VLS_ctx.showLoadStatus;
        } },
    ...{ class: "text-sm text-gray-600 hover:underline focus:outline-none" },
});
(__VLS_ctx.showLoadStatus ? '숨기기 ▲' : '펼치기 ▼');
if (__VLS_ctx.showLoadStatus) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overflow-x-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "min-w-[800px] w-full text-m border border-slate-600 rounded-lg shadow bg-white dark:bg-slate-800" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
        ...{ class: "bg-slate-100 dark:bg-slate-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "px-3 py-0 border border-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        ...{ class: "text-center" },
    });
    for (const [table] of __VLS_getVForSourceType((__VLS_ctx.loadProcessTables))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            key: (table.key),
            ...{ class: "px-1 text-sm py-1 border border-slate-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (table.label);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        ...{ class: "text-center" },
    });
    for (const [table, idx] of __VLS_getVForSourceType((__VLS_ctx.filteredTables))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            key: (table.key + '-status'),
            colspan: (idx === 3 || idx === 4 ? 2 : undefined),
            ...{ class: "px-0 text-sm py-1 border border-slate-600" },
        });
        if (!__VLS_ctx.isTableStatusLoaded) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (__VLS_ctx.tableLoadStatus[table.key]
                        ? 'text-green-600'
                        : 'text-gray-400') },
            });
            (__VLS_ctx.tableLoadStatus[table.key] ? '유' : '무');
        }
        if (__VLS_ctx.isTableStatusLoaded) {
            if (__VLS_ctx.tableLoadStatus[table.key]) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.showLoadStatus))
                                return;
                            if (!(__VLS_ctx.isTableStatusLoaded))
                                return;
                            if (!(__VLS_ctx.tableLoadStatus[table.key]))
                                return;
                            __VLS_ctx.deleteDetailTableData(table.key);
                        } },
                    ...{ class: "ml-1 text-red-600 hover:underline" },
                });
                (table.step);
            }
            else if (table.step > 1) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.showLoadStatus))
                                return;
                            if (!(__VLS_ctx.isTableStatusLoaded))
                                return;
                            if (!!(__VLS_ctx.tableLoadStatus[table.key]))
                                return;
                            if (!(table.step > 1))
                                return;
                            __VLS_ctx.processDetailTable(table.key);
                        } },
                    ...{ class: "ml-1 text-blue-600 hover:underline" },
                });
                (table.step);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        ...{ class: "text-center" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "ml-6 font-semibold whitespace-nowrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "date",
    ...{ class: "border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" },
    ...{ style: {} },
});
(__VLS_ctx.adjustmentStore.emailDeadline);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-center gap-4 mt-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onClickSaveConfirm) },
    ...{ class: "bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-2 rounded disabled:bg-gray-300" },
});
/** @type {[typeof BaseButtonA, typeof BaseButtonA, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseButtonA, new BaseButtonA({
    ...{ 'onClick': {} },
    canClick: (__VLS_ctx.adjustmentStore.canCreateSettlement),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClick': {} },
    canClick: (__VLS_ctx.adjustmentStore.canCreateSettlement),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClick: (__VLS_ctx.onGoToBalance)
};
__VLS_2.slots.default;
var __VLS_2;
if (__VLS_ctx.showModal) {
    /** @type {[typeof BaseModal, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(BaseModal, new BaseModal({
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.modalTitle),
        message: (__VLS_ctx.modalMessage),
        buttons: (__VLS_ctx.modalButtons),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.modalTitle),
        message: (__VLS_ctx.modalMessage),
        buttons: (__VLS_ctx.modalButtons),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    let __VLS_12;
    const __VLS_13 = {
        onBackgroundClick: (...[$event]) => {
            if (!(__VLS_ctx.showModal))
                return;
            __VLS_ctx.showModal = false;
        }
    };
    var __VLS_9;
}
if (__VLS_ctx.showErrorModal) {
    /** @type {[typeof BaseModal, typeof BaseModal, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(BaseModal, new BaseModal({
        ...{ 'onClose': {} },
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.errorModalTitle),
        message: (__VLS_ctx.errorModalMsg),
        buttons: ([{ text: '확인', type: 'primary', onClick: () => (__VLS_ctx.showErrorModal = false) }]),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClose': {} },
        ...{ 'onBackgroundClick': {} },
        title: (__VLS_ctx.errorModalTitle),
        message: (__VLS_ctx.errorModalMsg),
        buttons: ([{ text: '확인', type: 'primary', onClick: () => (__VLS_ctx.showErrorModal = false) }]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.showErrorModal))
                return;
            __VLS_ctx.showErrorModal = false;
        }
    };
    const __VLS_21 = {
        onBackgroundClick: (...[$event]) => {
            if (!(__VLS_ctx.showErrorModal))
                return;
            __VLS_ctx.showErrorModal = false;
        }
    };
    __VLS_16.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_16.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "overflow-auto max-h-[400px]" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
            ...{ class: "w-full text-sm border-collapse" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
            ...{ class: "bg-slate-200 dark:bg-slate-700 sticky top-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ class: "border border-gray-400 px-3 py-2" },
        });
        for (const [key] of __VLS_getVForSourceType((__VLS_ctx.tableHeaders))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
                key: (key),
                ...{ class: "border border-gray-400 px-3 py-2" },
            });
            (__VLS_ctx.formatHeader(key));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
        for (const [detail, idx] of __VLS_getVForSourceType((__VLS_ctx.parsedErrorDetails))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
                key: (idx),
                ...{ class: "text-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: "border border-gray-400 px-3 py-1" },
            });
            (idx + 1);
            for (const [key] of __VLS_getVForSourceType((__VLS_ctx.tableHeaders))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                    key: (key),
                    ...{ class: "border border-gray-400 px-3 py-1" },
                });
                (detail[key]);
            }
        }
        if (!__VLS_ctx.parsedErrorDetails.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                colspan: (__VLS_ctx.tableHeaders.length + 1),
                ...{ class: "text-center border border-gray-400 px-3 py-2" },
            });
        }
    }
    var __VLS_16;
}
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-6']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[600px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-orange-900']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-6']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-balance']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[600px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-yellow-900']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-amber-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-900']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[800px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-m']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-amber-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[400px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseModal: BaseModal,
            BaseButtonA: BaseButtonA,
            adjustmentStore: adjustmentStore,
            showLoadStatus: showLoadStatus,
            fileInputKey: fileInputKey,
            showErrorModal: showErrorModal,
            errorModalTitle: errorModalTitle,
            errorModalMsg: errorModalMsg,
            openErrorModal: openErrorModal,
            parsedErrorDetails: parsedErrorDetails,
            tableHeaders: tableHeaders,
            formatHeader: formatHeader,
            showModal: showModal,
            modalTitle: modalTitle,
            modalMessage: modalMessage,
            modalButtons: modalButtons,
            openNotSupportModal: openNotSupportModal,
            onFileChange: onFileChange,
            removeFile: removeFile,
            onClickSaveConfirm: onClickSaveConfirm,
            onGoToBalance: onGoToBalance,
            isTableStatusLoaded: isTableStatusLoaded,
            loadProcessTables: loadProcessTables,
            tableLoadStatus: tableLoadStatus,
            filteredTables: filteredTables,
            fetchDetaileTablesLoadStatus: fetchDetaileTablesLoadStatus,
            deleteDetailTableData: deleteDetailTableData,
            processDetailTable: processDetailTable,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AdjustmentTab.vue.js.map