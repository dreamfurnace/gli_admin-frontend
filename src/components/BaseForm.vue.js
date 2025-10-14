import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    errors: () => ({}),
    loading: false,
    showCancel: true,
    submitText: '저장',
    cancelText: '취소',
    loadingText: '처리 중...'
});
const emit = defineEmits();
// 폼 값 업데이트
const updateValue = (fieldName, value) => {
    const newValue = { ...props.modelValue, [fieldName]: value };
    emit('update:modelValue', newValue);
};
// 파일 변경 처리
const handleFileChange = (fieldName, event) => {
    const target = event.target;
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    errors: () => ({}),
    loading: false,
    showCancel: true,
    submitText: '저장',
    cancelText: '취소',
    loadingText: '처리 중...'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white dark:bg-gray-800 shadow rounded-lg" },
});
if (__VLS_ctx.title || __VLS_ctx.$slots.header) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    if (__VLS_ctx.title) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-lg leading-6 font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.title);
        if (__VLS_ctx.description) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400" },
            });
            (__VLS_ctx.description);
        }
    }
    var __VLS_0 = {};
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 py-5 sm:p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 gap-6 sm:grid-cols-2" },
});
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.fields))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ([
                field.fullWidth ? 'sm:col-span-2' : 'sm:col-span-1',
                field.hidden ? 'hidden' : ''
            ]) },
    });
    if (field.label && field.type !== 'checkbox') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: (field.name),
            ...{ class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" },
        });
        (field.label);
        if (field.required) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-red-500" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
    });
    if (['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (...[$event]) => {
                    if (!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                        return;
                    __VLS_ctx.updateValue(field.name, $event.target.value);
                } },
            id: (field.name),
            type: (field.type),
            name: (field.name),
            value: (__VLS_ctx.modelValue[field.name]),
            placeholder: (field.placeholder),
            required: (field.required),
            disabled: (field.disabled || __VLS_ctx.loading),
            readonly: (field.readonly),
            min: (field.min),
            max: (field.max),
            step: (field.step),
            ...{ class: ([
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    __VLS_ctx.errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || __VLS_ctx.loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                ]) },
        });
    }
    else if (field.type === 'textarea') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
            ...{ onInput: (...[$event]) => {
                    if (!!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                        return;
                    if (!(field.type === 'textarea'))
                        return;
                    __VLS_ctx.updateValue(field.name, $event.target.value);
                } },
            id: (field.name),
            name: (field.name),
            value: (__VLS_ctx.modelValue[field.name]),
            placeholder: (field.placeholder),
            required: (field.required),
            disabled: (field.disabled || __VLS_ctx.loading),
            readonly: (field.readonly),
            rows: (field.rows || 3),
            ...{ class: ([
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    __VLS_ctx.errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || __VLS_ctx.loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                ]) },
        });
    }
    else if (field.type === 'select') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
            ...{ onChange: (...[$event]) => {
                    if (!!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                        return;
                    if (!!(field.type === 'textarea'))
                        return;
                    if (!(field.type === 'select'))
                        return;
                    __VLS_ctx.updateValue(field.name, $event.target.value);
                } },
            id: (field.name),
            name: (field.name),
            value: (__VLS_ctx.modelValue[field.name]),
            required: (field.required),
            disabled: (field.disabled || __VLS_ctx.loading),
            ...{ class: ([
                    'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                    __VLS_ctx.errors[field.name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
                    field.disabled || __VLS_ctx.loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                ]) },
        });
        if (field.placeholder) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "",
            });
            (field.placeholder);
        }
        for (const [option] of __VLS_getVForSourceType((field.options))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (typeof option === 'object' ? option.value : option),
                value: (typeof option === 'object' ? option.value : option),
            });
            (typeof option === 'object' ? option.label : option);
        }
    }
    else if (field.type === 'checkbox') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (...[$event]) => {
                    if (!!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                        return;
                    if (!!(field.type === 'textarea'))
                        return;
                    if (!!(field.type === 'select'))
                        return;
                    if (!(field.type === 'checkbox'))
                        return;
                    __VLS_ctx.updateValue(field.name, $event.target.checked);
                } },
            id: (field.name),
            name: (field.name),
            type: "checkbox",
            checked: (!!__VLS_ctx.modelValue[field.name]),
            disabled: (field.disabled || __VLS_ctx.loading),
            ...{ class: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: (field.name),
            ...{ class: "ml-2 block text-sm text-gray-900 dark:text-gray-100" },
        });
        (field.label);
        if (field.required) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-red-500" },
            });
        }
    }
    else if (field.type === 'radio') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-2" },
        });
        for (const [option] of __VLS_getVForSourceType((field.options))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (typeof option === 'object' ? option.value : option),
                ...{ class: "flex items-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ onChange: (...[$event]) => {
                        if (!!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                            return;
                        if (!!(field.type === 'textarea'))
                            return;
                        if (!!(field.type === 'select'))
                            return;
                        if (!!(field.type === 'checkbox'))
                            return;
                        if (!(field.type === 'radio'))
                            return;
                        __VLS_ctx.updateValue(field.name, $event.target.value);
                    } },
                id: (`${field.name}_${typeof option === 'object' ? option.value : option}`),
                name: (field.name),
                type: "radio",
                value: (typeof option === 'object' ? option.value : option),
                checked: (__VLS_ctx.modelValue[field.name] === (typeof option === 'object' ? option.value : option)),
                disabled: (field.disabled || __VLS_ctx.loading),
                ...{ class: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                for: (`${field.name}_${typeof option === 'object' ? option.value : option}`),
                ...{ class: "ml-2 block text-sm text-gray-900 dark:text-gray-100" },
            });
            (typeof option === 'object' ? option.label : option);
        }
    }
    else if (field.type === 'file') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (...[$event]) => {
                    if (!!(['text', 'email', 'password', 'number', 'url', 'tel'].includes(field.type)))
                        return;
                    if (!!(field.type === 'textarea'))
                        return;
                    if (!!(field.type === 'select'))
                        return;
                    if (!!(field.type === 'checkbox'))
                        return;
                    if (!!(field.type === 'radio'))
                        return;
                    if (!(field.type === 'file'))
                        return;
                    __VLS_ctx.handleFileChange(field.name, $event);
                } },
            id: (field.name),
            name: (field.name),
            type: "file",
            accept: (field.accept),
            multiple: (field.multiple),
            disabled: (field.disabled || __VLS_ctx.loading),
            ...{ class: "block w-full text-sm text-gray-500 dark:text-gray-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" },
        });
    }
    else {
        var __VLS_2 = {
            field: (field),
            value: (__VLS_ctx.modelValue[field.name]),
            updateValue: (__VLS_ctx.updateValue),
            error: (__VLS_ctx.errors[field.name]),
        };
        var __VLS_3 = __VLS_tryAsConstant(`field-${field.name}`);
    }
    if (field.help) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-1 text-sm text-gray-500 dark:text-gray-400" },
        });
        (field.help);
    }
    if (__VLS_ctx.errors[field.name]) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-1 text-sm text-red-600 dark:text-red-400" },
        });
        (__VLS_ctx.errors[field.name]);
    }
}
if (__VLS_ctx.$slots.default) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-6" },
    });
    var __VLS_6 = {};
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 space-x-3" },
});
var __VLS_8 = {};
if (__VLS_ctx.showCancel) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleCancel) },
        type: "button",
        disabled: (__VLS_ctx.loading),
        ...{ class: "inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" },
    });
    (__VLS_ctx.cancelText);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    disabled: (__VLS_ctx.loading || !__VLS_ctx.isValid),
    ...{ class: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white" },
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
}
(__VLS_ctx.loading ? __VLS_ctx.loadingText : __VLS_ctx.submitText);
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['file:py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['file:px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['file:rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['file:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['file:font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['file:bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['file:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:file:bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['-ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_4 = __VLS_3, __VLS_5 = __VLS_2, __VLS_7 = __VLS_6, __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            updateValue: updateValue,
            handleFileChange: handleFileChange,
            isValid: isValid,
            handleSubmit: handleSubmit,
            handleCancel: handleCancel,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BaseForm.vue.js.map