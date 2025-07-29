<template>
    <div class="p-8 space-y-6">
        <h1 class="text-2xl font-bold">회원 등록</h1>

        <!-- 프로필 및 기본 정보 -->
        <div class="flex gap-6">
            <div class="flex flex-col items-center gap-2">
                <div
                    class="h-32 w-32 bg-slate-200 rounded-full overflow-hidden flex justify-center items-center"
                >
                    <span v-if="!profileImage">파일을 선택하세요.</span>
                    <img v-else :src="profileImage" class="object-cover w-full h-full" />
                </div>
                <input type="file" hidden ref="profileInput" @change="onProfileSelected" />
                <button
                    @click="triggerProfileInput"
                    class="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors"
                >
                    선택
                </button>
            </div>

            <div class="grid grid-cols-2 gap-4 flex-grow">
                <label class="col-span-2 flex items-center gap-4">
                    <span class="w-32 font-medium"
                        >파트너 타입<span class="text-red-500">*</span></span
                    >
                    <BaseSelect v-model="form.partnerType">
                        <option value="individual">개인</option>
                        <option value="business">사업자</option>
                    </BaseSelect>
                </label>

                <label class="flex items-center gap-4">
                    <span class="w-32 font-medium">이름<span class="text-red-500">*</span></span>
                    <BaseInput v-model="form.name" placeholder="이름 입력" />
                </label>

                <label class="flex items-center gap-4">
                    <span class="w-32 font-medium">활동명<span class="text-red-500">*</span></span>
                    <BaseInput v-model="form.artistName" placeholder="활동명 입력" />
                </label>
            </div>
        </div>

        <!-- 회원 정보 -->
        <div class="space-y-4">
            <h2 class="font-semibold text-lg">회원 정보</h2>

            <div class="grid grid-cols-[8rem,1fr,auto] items-center gap-4">
                <label class="font-medium">이메일<span class="text-red-500">*</span></label>
                <BaseInput v-model="form.email" placeholder="이메일 입력" />
                <button
                    class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors"
                >
                    중복 체크
                </button>

                <label class="font-medium">패스워드<span class="text-red-500">*</span></label>
                <BaseInput v-model="form.password" type="password" placeholder="패스워드 입력" />
                <div></div>

                <label class="font-medium">패스워드 확인<span class="text-red-500">*</span></label>
                <BaseInput
                    v-model="form.passwordConfirm"
                    type="password"
                    placeholder="패스워드 재입력"
                />
                <div></div>

                <label class="font-medium">전화번호<span class="text-red-500">*</span></label>
                <div class="flex gap-2">
                    <BaseSelect v-model="form.phonePrefix" class="w-24">
                        <option value="010">010</option>
                        <option value="011">011</option>
                    </BaseSelect>
                    <BaseInput v-model="form.phoneMiddle" placeholder="0000" />
                    <BaseInput v-model="form.phoneLast" placeholder="0000" />
                </div>
                <div></div>

                <label class="font-medium">생년월일<span class="text-red-500">*</span></label>
                <BaseInput v-model="form.birthDate" type="date" />
                <div></div>

                <label class="font-medium">주민등록번호<span class="text-red-500">*</span></label>
                <div class="flex gap-2 items-center">
                    <BaseInput v-model="form.regNoFront" placeholder="앞자리" />
                    <span>-</span>
                    <BaseInput v-model="form.regNoBack" placeholder="뒷자리" type="password" />
                </div>
                <div></div>

                <label class="font-medium">주소<span class="text-red-500">*</span></label>
                <div class="flex gap-2 items-center">
                    <BaseInput
                        v-model="form.zipCode"
                        placeholder="우편번호"
                        disabled
                        class="bg-slate-100"
                    />
                    <button
                        class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors whitespace-nowrap"
                    >
                        주소 찾기
                    </button>
                </div>
                <div></div>

                <label></label>
                <BaseInput
                    v-model="form.address"
                    placeholder="주소"
                    disabled
                    class="bg-slate-100"
                />
                <div></div>

                <label></label>
                <BaseInput v-model="form.addressDetail" placeholder="상세 주소" />
                <div></div>
            </div>
        </div>

        <!-- 정산 정보 -->
        <div class="space-y-4">
            <h2 class="font-semibold text-lg">정산 정보</h2>

            <div class="grid grid-cols-[8rem,1fr] items-center gap-4">
                <label class="font-medium">은행명<span class="text-red-500">*</span></label>
                <BaseSelect v-model="form.bankName">
                    <option value="KEB">KEB하나은행</option>
                    <option value="KB">국민은행</option>
                </BaseSelect>

                <label class="font-medium">예금주<span class="text-red-500">*</span></label>
                <BaseInput v-model="form.accountHolder" placeholder="예금주 입력" />

                <label class="font-medium">계좌번호<span class="text-red-500">*</span></label>
                <BaseInput v-model="form.accountNumber" placeholder="계좌번호 입력" />

                <label class="font-medium">계좌사본<span class="text-red-500">*</span></label>
                <input type="file" ref="accountFileInput" hidden @change="onAccountFileSelected" />
                <button
                    @click="triggerAccountFileInput"
                    class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors"
                >
                    선택
                </button>

                <label class="font-medium">신분증 사본<span class="text-red-500">*</span></label>
                <input type="file" ref="idCardFileInput" hidden @change="onIdCardFileSelected" />
                <button
                    @click="triggerIdCardFileInput"
                    class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors"
                >
                    선택
                </button>
            </div>
        </div>
        <button
            class="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-colors"
        >
            저장
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';

const form = ref({
    partnerType: 'individual',
    name: '',
    artistName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phonePrefix: '010',
    phoneMiddle: '',
    phoneLast: '',
    birthDate: '',
    regNoFront: '',
    regNoBack: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    bankName: 'KEB',
    accountHolder: '',
    accountNumber: '',
});

const profileImage = ref('');
const profileInput = ref<HTMLInputElement | null>(null);
const accountFileInput = ref<HTMLInputElement | null>(null);
const idCardFileInput = ref<HTMLInputElement | null>(null);

const triggerProfileInput = () => profileInput.value?.click();
const triggerAccountFileInput = () => accountFileInput.value?.click();
const triggerIdCardFileInput = () => idCardFileInput.value?.click();

const onProfileSelected = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) profileImage.value = URL.createObjectURL(file);
};

const onAccountFileSelected = (e: Event) => {
    /* 파일 처리 */
};
const onIdCardFileSelected = (e: Event) => {
    /* 파일 처리 */
};
</script>
