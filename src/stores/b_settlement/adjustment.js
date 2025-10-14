// admin-frontend/src/stores/b_settlement/adjustment.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/axios';
export const useAdjustmentStore = defineStore('adjustmentStore', () => {
    const selectedMonthId = ref(null);
    const precheckList = ref([]);
    const uploadRows = ref([
        {
            label: '국내정산',
            file: null,
            fileName: '',
            distributor_settle_form_id: 1,
            status: 'None',
        },
        {
            label: '해외정산',
            file: null,
            fileName: '',
            distributor_settle_form_id: 2,
            status: 'None',
        },
    ]);
    const emailDeadline = ref('');
    const initialEmailDeadline = ref('');
    const initialFileNames = ref(['', '']); // 초기 파일 상태 저장
    const loading = ref(false);
    const error = ref('');
    // 삭제한 파일들을 저장할 배열 추가
    const deletedFiles = ref([]);
    function setFile(idx, file) {
        uploadRows.value[idx].file = file;
        // ✅ fileName을 항상 새로운 값으로 강제 할당 (동일 이름이라도 반응성 유도)
        uploadRows.value[idx].fileName = '';
        requestAnimationFrame(() => {
            uploadRows.value[idx].fileName = file.name;
        });
    }
    function removeFile(idx) {
        const fileToRemove = uploadRows.value[idx];
        if (fileToRemove.fileName) {
            deletedFiles.value.push(fileToRemove.distributor_settle_form_id);
            fileToRemove.fileName = '';
        }
        fileToRemove.file = null;
    }
    const hasChanges = computed(() => {
        return (deletedFiles.value.length > 0 ||
            uploadRows.value.some((row) => row.file !== null) ||
            emailDeadline.value !== initialEmailDeadline.value);
    });
    const canSave = computed(() => {
        const emailDeadlineChanged = emailDeadline.value !== initialEmailDeadline.value;
        const fileCount = uploadRows.value.filter((row) => row.file !== null).length;
        const validFileCount = fileCount === 0 || fileCount === 2;
        return emailDeadlineChanged || validFileCount;
    });
    async function getPresignedUrls() {
        const filesPayload = uploadRows.value
            .map((row, idx) => {
            if (!row.file)
                return null;
            return {
                type: idx === 0 ? 'domestic' : 'overseas',
                fileName: row.file.name,
                contentType: row.file.type,
            };
        })
            .filter(Boolean); // null 제거
        if (filesPayload.length === 0) {
            throw new Error('선택된 파일이 없습니다.');
        }
        const payload = {
            month_settle_id: selectedMonthId.value,
            files: filesPayload,
        };
        const { data } = await api.post('/settlement/generate-presigned-urls/', payload);
        return data;
    }
    async function uploadAllFilesToS3(presigned) {
        const failedUploads = [];
        for (let i = 0; i < uploadRows.value.length; i++) {
            const row = uploadRows.value[i];
            if (!row.file)
                continue;
            const type = i === 0 ? 'domestic' : 'overseas';
            const url = presigned.upload_urls[type];
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': row.file.type },
                body: row.file,
            });
            if (!res.ok) {
                failedUploads.push(type);
            }
        }
        if (failedUploads.length > 0) {
            throw new Error(`S3 업로드 실패: ${failedUploads.join(', ')}`);
        }
        // ✅ 모든 업로드 성공 시 분석 실행
        await analyzeFiles(presigned.s3_keys);
    }
    async function analyzeFiles(s3_keys) {
        const payload = {
            month_settle_id: selectedMonthId.value,
            s3_keys,
        };
        await api.post('/settlement/analyze-files/', payload);
    }
    async function saveAdjustmentData_Date_or_Files() {
        if (!selectedMonthId.value || !canSave.value) {
            throw new Error('변경사항이 없습니다. : ' +
                selectedMonthId.value +
                'canSave.value : ' +
                canSave.value +
                'emailDeadline : ' +
                emailDeadline.value +
                'fileCount : ' +
                uploadRows.value.filter((row) => row.file !== null).length);
        }
        const formData = new FormData();
        uploadRows.value.forEach((row, idx) => {
            if (row.file) {
                formData.append(idx === 0 ? 'domestic_file' : 'overseas_file', row.file);
            }
            else if (!row.file && row.fileName === '' && initialFileNames.value[idx] !== '') {
                formData.append(idx === 0 ? 'domestic_file_delete' : 'overseas_file_delete', 'true');
            }
        });
        if (emailDeadline.value !== initialEmailDeadline.value) {
            formData.append('email_deadline', emailDeadline.value);
        }
        formData.append('month_settle_id', String(selectedMonthId.value));
        loading.value = true;
        try {
            const res = await api.post('/settlement/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // 저장
            console.log('res.data.files', res.data.files);
            res.data.files.forEach((file) => {
                // const idx = file.file_id === 1 ? 0 : 1; // distributor_settle_form_id로 구분
                const idx = file.distributor_settle_form_id === '1' ? 0 : 1;
                uploadRows.value[idx].status = file.status;
            });
            // 초기 상태 업데이트
            initialEmailDeadline.value = emailDeadline.value;
            initialFileNames.value = uploadRows.value.map((row) => row.fileName);
            uploadRows.value.forEach((row) => (row.file = null));
        }
        catch (error) {
            console.error('파일 업로드 또는 저장 실패:', error);
            throw new Error('파일 업로드 또는 저장 실패');
        }
        finally {
            loading.value = false;
        }
    }
    const AdjustmentStatus = computed(() => [
        precheckList.value.every((item) => item.errorCount === 0),
        uploadRows.value.every((row) => row.status === 'Parsed' || row.status === 'Parsed-S2'),
        Boolean(emailDeadline.value),
    ]);
    const canCreateSettlement = computed(() => {
        const allOk = precheckList.value.every((item) => item.errorCount === 0);
        const filesOk = uploadRows.value.every((row) => row.status === 'Parsed');
        const deadlineOk = emailDeadline.value !== '';
        // console.log('filesOk-0', uploadRows.value[0].status);
        // console.log('filesOk-1', uploadRows.value[1].status);
        return allOk && filesOk && deadlineOk;
    });
    function setSelectedMonth(monthId) {
        selectedMonthId.value = monthId;
    }
    async function fetchVerificationData() {
        if (!selectedMonthId.value)
            return;
        loading.value = true;
        try {
            const res = await api.get(`/settlement/${selectedMonthId.value}/adjustment-data/`);
            precheckList.value = res.data.verification.map((item) => ({
                target: item.target,
                label: item.check,
                totalCount: item.total,
                normalCount: item.valid,
                errorCount: item.invalid,
                errorDetail: item.errorDetail,
                errorModalTitle: item.errorModalTitle,
            }));
            // distributor_settle_form_id를 기준으로 정확히 파일 이름과 상태 매칭
            uploadRows.value.forEach((row) => {
                const fileData = res.data.files.find((f) => f.distributor_settle_form_id === row.distributor_settle_form_id);
                row.fileName = fileData?.file_name || '';
                row.status = fileData?.status || 'None';
            });
            // 초기 파일 이름 저장 (중요!)
            initialFileNames.value = [uploadRows.value[0].fileName, uploadRows.value[1].fileName];
            emailDeadline.value = res.data.mail_dead_line?.substring(0, 10) || '';
            initialEmailDeadline.value = emailDeadline.value;
        }
        catch (err) {
            console.error('정산 데이터 조회 중 오류 발생:', err);
            error.value = '정산 데이터 조회 실패';
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchDetailTableData_Status(monthSettleId) {
        try {
            const res = await api.get(`/settlement/load-status/`, {
                params: { month_settle_id: monthSettleId },
            });
            // 예: [{ table: 'settle_files', exists: true }, ...]
            return res.data;
        }
        catch (e) {
            console.error('load-status 불러오기 실패:', e);
            throw new Error('적재 상태 불러오기 실패');
        }
    }
    async function deleteDetaileTableData(monthSettleId, table) {
        try {
            const res = await api.delete(`/settlement/del-step/${table}/`, {
                params: { month_settle_id: monthSettleId },
            });
            if (table === 'user_settles') {
                // 상태를 Parsed → Parsed-S2로 복원
                uploadRows.value.forEach((row) => {
                    if (row.status === 'Parsed') {
                        row.status = 'Parsed-S2';
                    }
                });
            }
            else if (table === 'settle_files') {
                // ✅ 상태와 파일 이름 초기화
                const resetIds = res.data.reset_form_ids || [];
                resetIds.forEach((formId) => {
                    const idx = formId === 1 ? 0 : 1;
                    uploadRows.value[idx].status = 'None';
                    uploadRows.value[idx].fileName = '';
                });
            }
        }
        catch (e) {
            console.error(`${table} 삭제 실패:`, e);
            throw new Error(`${table} 삭제 중 오류 발생`);
        }
    }
    async function processTable(monthSettleId, tableKey) {
        try {
            const res = await api.post(`/settlement/process-step/`, {
                month_settle_id: monthSettleId,
                table: tableKey,
            });
            // ✅ 상태가 Parsed로 바뀐 파일 업데이트
            if (res.data.updated_settle_files) {
                res.data.updated_settle_files.forEach((formId) => {
                    const idx = Number(formId) === 1 ? 0 : 1;
                    uploadRows.value[idx].status = 'Parsed';
                });
            }
            return res.data;
        }
        catch (e) {
            console.error(`${tableKey} 단계 적재 실패:`, e);
            throw new Error(`${tableKey} 단계 적재 중 오류 발생`);
        }
    }
    return {
        selectedMonthId,
        precheckList,
        uploadRows,
        emailDeadline,
        initialEmailDeadline,
        initialFileNames,
        loading,
        error,
        canSave,
        canCreateSettlement,
        setSelectedMonth,
        fetchVerificationData,
        getPresignedUrls,
        uploadAllFilesToS3,
        analyzeFiles,
        saveAdjustmentData_Date_or_Files,
        setFile,
        removeFile,
        AdjustmentStatus,
        hasChanges,
        fetchDetailTableData_Status,
        deleteDetaileTableData,
        processTable,
    };
});
//# sourceMappingURL=adjustment.js.map