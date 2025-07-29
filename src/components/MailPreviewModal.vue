<!-- /admin-frontend/src/components/MailPreviewModal.vue -->
<template>
    <BaseModal
        title="메일 미리보기"
        @background-click="onClose"
        :buttons="[
            { text: '메일 전송', type: 'primary', onClick: handleSend },
            { text: '닫기', onClick: onClose },
        ]"
    >
        <div class="space-y-4 max-h-[80vh] overflow-y-auto px-2">
            <!-- 문두 선택 -->
            <div class="flex items-center gap-2">
                <label class="font-semibold w-24">문두 선택:</label>
                <BaseSelect v-model="selectedHead" class="flex-1">
                    <option value="none">없음</option>
                    <option value="first">첫 인사</option>
                    <option value="zero">정산금 0원</option>
                </BaseSelect>
            </div>

            <!-- 문두 입력 -->
            <textarea
                v-model="customHeadText"
                rows="4"
                class="w-full border rounded px-3 py-2"
                placeholder="문두 인사말 입력"
            />

            <!-- 미리보기 본문 -->
            <div class="whitespace-pre-line text-sm bg-white dark:bg-slate-800 p-3 rounded border">
                {{ computedPreviewText }}
            </div>

            <!-- 상세 곡 정보 테이블 -->
            <table class="w-full mt-4 border border-slate-600 text-sm">
                <thead class="bg-slate-200 dark:bg-slate-700">
                    <tr>
                        <th class="border px-2 py-1">앨범명</th>
                        <th class="border px-2 py-1">곡명</th>
                        <th class="border px-2 py-1">유통매출</th>
                        <th class="border px-2 py-1">선차감</th>
                        <th class="border px-2 py-1">파트너 배분율</th>
                        <th class="border px-2 py-1">파트너 정산금</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(track, idx) in mailData.tracks" :key="idx">
                        <td class="border px-2 py-1">{{ track.album }}</td>
                        <td class="border px-2 py-1">{{ track.song }}</td>
                        <td class="border px-2 py-1 text-right">{{ track.sale_amount }}원</td>
                        <td class="border px-2 py-1 text-right">{{ track.offset }}원</td>
                        <td class="border px-2 py-1 text-right">{{ track.rate }}%</td>
                        <td class="border px-2 py-1 text-right">{{ track.settle_amount }}원</td>
                    </tr>
                </tbody>
            </table>

            <!-- 최종 정산금 -->
            <div class="text-right font-bold mt-2">최종 정산금: {{ mailData.total }}원</div>

            <!-- 의견 선택 버튼들 -->
            <div class="flex flex-wrap gap-2 mt-4 justify-center">
                <button
                    v-for="option in feedbackOptions"
                    :key="option.value"
                    @click="selectedFeedback = option.value"
                    :class="[
                        'px-4 py-2 rounded border',
                        selectedFeedback === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800',
                    ]"
                >
                    {{ option.label }}
                </button>
            </div>

            <!-- 문미 입력 -->
            <div class="mt-4 flex items-center gap-2">
                <label class="font-semibold w-24">문미 선택:</label>
                <BaseSelect v-model="selectedTail" class="flex-1">
                    <option value="none">없음</option>
                    <option value="thanks">감사 인사</option>
                    <option value="closing">정중한 종료</option>
                </BaseSelect>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import api from '@/utils/axios';

const props = defineProps<{
    userId: number;
    monthSettleId: number;
    onClose: () => void;
    onSend: () => void;
}>();

const selectedHead = ref('none');
const selectedTail = ref('none');
const selectedFeedback = ref('yes');
const customHeadText = ref('');

const mailData = ref<{
    tracks: {
        album: string;
        song: string;
        sale_amount: number;
        offset: number;
        rate: number;
        settle_amount: number;
    }[];
    total: number;
}>({
    tracks: [],
    total: 0,
});

const feedbackOptions = [
    { value: 'yes', label: 'YES, 상기 내역에 동의합니다.' },
    { value: 'no_content', label: 'NO, 정산 내역이 맞지 않습니다.' },
    { value: 'no_rate', label: 'NO, 분배율이 맞지 않습니다.' },
    { value: 'no_album', label: 'NO, 정산 내역에 빠진 앨범이 있습니다.' },
];

const computedPreviewText = computed(() => {
    const head = selectedHead.value === 'first' ? '안녕하세요. 블랭체크 입니다.' : '';
    const tail = selectedTail.value === 'thanks' ? '감사합니다. 좋은 하루 되세요.' : '';
    return [head, customHeadText.value, tail].filter(Boolean).join('\n\n');
});

async function handleSend() {
    try {
        await api.post('/api/settlement/balance/send-mail/', {
            user_id: props.userId,
            month_settle_id: props.monthSettleId,
            header: customHeadText.value,
            tail: selectedTail.value,
            response: selectedFeedback.value,
        });
        props.onSend();
    } catch (e) {
        alert('메일 전송 실패');
    }
}

onMounted(async () => {
    const res = await api.get('/api/settlement/balance/mail-preview/', {
        params: {
            user_id: props.userId,
            month_settle_id: props.monthSettleId,
        },
    });
    mailData.value = res.data;
});
</script>
