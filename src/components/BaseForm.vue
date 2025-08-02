<!-- 공통 폼 컴포넌트 -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <!-- 폼 헤더 -->
      <div v-if="title || $slots.header" class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div v-if="title">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="description" class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>
          <slot name="header" />
        </div>
      </div>

      <!-- 폼 본체 -->
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <template v-for="field in fields" :key="field.name">
            <div :class="[
              field.fullWidth ? 'sm:col-span-2' : 'sm:col-span-1',
              field.hidden ? 'hidden' : ''
            ]">
              <!-- 필드 라벨 -->
              <label
                v-if="field.label && field.type !== 'checkbox'"
                :for="field.name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <!-- 입력 필드 -->
              <div class="relative">
                <!-- 텍스트 입력 -->
                <input
                  v-if="['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)"
                  :id="field.name"
                  :type="field.type"
                  :name="field.name"
                  :value="modelValue[field.name]"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :disabled="field.disabled || loading"
                  :readonly="field.readonly"
                  :min="field.min"
                  :max="field.max"
                  :step="field.step"
                  @input="updateValue(field.name, ($event.target as HTMLInputElement).value)"
                  :class="[
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                  ]"
                />

                <!-- 텍스트 영역 -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  :id="field.name"
                  :name="field.name"
                  :value="modelValue[field.name]"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :disabled="field.disabled || loading"
                  :readonly="field.readonly"
                  :rows="field.rows || 3"
                  @input="updateValue(field.name, ($event.target as HTMLTextAreaElement).value)"
                  :class="[
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                  ]"
                />

                <!-- 선택 박스 -->
                <select
                  v-else-if="field.type === 'select'"
                  :id="field.name"
                  :name="field.name"
                  :value="modelValue[field.name]"
                  :required="field.required"
                  :disabled="field.disabled || loading"
                  @change="updateValue(field.name, ($event.target as HTMLSelectElement).value)"
                  :class="[
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                  ]"
                >
                  <option value="" v-if="field.placeholder">{{ field.placeholder }}</option>
                  <option
                    v-for="option in field.options"
                    :key="typeof option === 'object' ? option.value : option"
                    :value="typeof option === 'object' ? option.value : option"
                  >
                    {{ typeof option === 'object' ? option.label : option }}
                  </option>
                </select>

                <!-- 체크박스 -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                  <input
                    :id="field.name"
                    :name="field.name"
                    type="checkbox"
                    :checked="!!modelValue[field.name]"
                    :disabled="field.disabled || loading"
                    @change="updateValue(field.name, ($event.target as HTMLInputElement).checked)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    :for="field.name"
                    class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                  >
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                </div>

                <!-- 라디오 버튼 -->
                <div v-else-if="field.type === 'radio'" class="space-y-2">
                  <div
                    v-for="option in field.options"
                    :key="typeof option === 'object' ? option.value : option"
                    class="flex items-center"
                  >
                    <input
                      :id="`${field.name}_${typeof option === 'object' ? option.value : option}`"
                      :name="field.name"
                      type="radio"
                      :value="typeof option === 'object' ? option.value : option"
                      :checked="modelValue[field.name] === (typeof option === 'object' ? option.value : option)"
                      :disabled="field.disabled || loading"
                      @change="updateValue(field.name, ($event.target as HTMLInputElement).value)"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      :for="`${field.name}_${typeof option === 'object' ? option.value : option}`"
                      class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                    >
                      {{ typeof option === 'object' ? option.label : option }}
                    </label>
                  </div>
                </div>

                <!-- 파일 입력 -->
                <input
                  v-else-if="field.type === 'file'"
                  :id="field.name"
                  :name="field.name"
                  type="file"
                  :accept="field.accept"
                  :multiple="field.multiple"
                  :disabled="field.disabled || loading"
                  @change="handleFileChange(field.name, $event)"
                  class="block w-full text-sm text-gray-500 dark:text-gray-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <!-- 커스텀 슬롯 -->
                <slot
                  v-else
                  :name="`field-${field.name}`"
                  :field="field"
                  :value="modelValue[field.name]"
                  :update-value="updateValue"
                  :error="errors[field.name]"
                />
              </div>

              <!-- 필드 도움말 -->
              <p v-if="field.help" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ field.help }}
              </p>

              <!-- 에러 메시지 -->
              <p v-if="errors[field.name]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors[field.name] }}
              </p>
            </div>
          </template>
        </div>

        <!-- 커스텀 컨텐츠 -->
        <div v-if="$slots.default" class="mt-6">
          <slot />
        </div>
      </div>

      <!-- 폼 푸터 -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 space-x-3">
        <slot name="footer">
          <button
            v-if="showCancel"
            type="button"
            @click="handleCancel"
            :disabled="loading"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText }}
          </button>
          <button
            type="submit"
            :disabled="loading || !isValid"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? loadingText : submitText }}
          </button>
        </slot>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'custom';
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  fullWidth?: boolean;
  help?: string;
  
  // 숫자 필드용
  min?: number;
  max?: number;
  step?: number;
  
  // textarea용
  rows?: number;
  
  // select, radio용
  options?: Array<string | { label: string; value: any }>;
  
  // 파일용
  accept?: string;
  multiple?: boolean;
  
  // 유효성 검사
  validator?: (value: any) => string | null;
}

interface Props {
  title?: string;
  description?: string;
  fields: FormField[];
  modelValue: Record<string, any>;
  errors?: Record<string, string>;
  loading?: boolean;
  showCancel?: boolean;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  loading: false,
  showCancel: true,
  submitText: '저장',
  cancelText: '취소',
  loadingText: '처리 중...'
});

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>];
  'submit': [value: Record<string, any>];
  'cancel': [];
}>();

// 폼 값 업데이트
const updateValue = (fieldName: string, value: any) => {
  const newValue = { ...props.modelValue, [fieldName]: value };
  emit('update:modelValue', newValue);
};

// 파일 변경 처리
const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files) {
    const field = props.fields.find(f => f.name === fieldName);
    const value = field?.multiple ? Array.from(files) : files[0];
    updateValue(fieldName, value);
  }
};

// 폼 유효성 검사
const isValid = computed(() => {
  // 필수 필드 체크
  for (const field of props.fields) {
    if (field.required && field.type !== 'checkbox') {
      const value = props.modelValue[field.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return false;
      }
    }
    
    if (field.required && field.type === 'checkbox') {
      if (!props.modelValue[field.name]) {
        return false;
      }
    }
    
    // 커스텀 유효성 검사
    if (field.validator) {
      const error = field.validator(props.modelValue[field.name]);
      if (error) {
        return false;
      }
    }
  }
  
  // 에러가 있는지 체크
  return Object.keys(props.errors).length === 0;
});

// 폼 제출
const handleSubmit = () => {
  if (!props.loading && isValid.value) {
    emit('submit', props.modelValue);
  }
};

// 취소
const handleCancel = () => {
  emit('cancel');
};
</script>