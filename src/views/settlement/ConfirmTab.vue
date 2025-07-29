// AdjustmentTab.vue
<template>
    <div class="confirm-tab">
        <h2 class="text-xl font-bold mb-4">확정, 입금, 부가세 양식</h2>
        <!-- 구체적인 컨텐츠 -->
    </div>
</template>

<script setup lang="ts">
import { TabType } from '@/types/settlement';

const props = defineProps<{
    selectedMonth: string;
}>();

const emit = defineEmits<{
    (e: 'update-abc-progress', tab: TabType, status: string): void;
}>();
</script>

// BalanceTab.vue와 ConfirmTab.vue도 유사한 구조로 구현
