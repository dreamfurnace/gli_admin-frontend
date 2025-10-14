import { ref, onMounted, computed } from 'vue';
import { useAlbumsStore } from '@/stores/e_itpr/albums';
import { formatDate } from '@/utils/format';
import AlbumHeaderSummary from './AlbumHeaderSummary.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BasePagination from '@/components/BasePagination.vue';
const store = useAlbumsStore();
const searchType = ref('all');
const searchQuery = ref('');
const sortBy = ref('created_desc');
onMounted(() => {
    store.fetchAlbums();
    store.fetchSummary();
});
const onPageChange = (page) => {
    store.setPage(page);
};
const totalPages = computed(() => Math.ceil(store.totalCount / store.pageSize));
const onSearch = () => {
    store.setSearch(searchQuery.value, searchType.value);
};
const refresh = () => {
    // 정렬 기준 변환
    switch (sortBy.value) {
        case 'name_asc':
            store.setOrdering('name');
            break;
        case 'name_desc':
            store.setOrdering('-name');
            break;
        case 'created_asc':
            store.setOrdering('created_at');
            break;
        case 'created_desc':
            store.setOrdering('-created_at');
            break;
        case 'updated_asc':
            store.setOrdering('updated_at');
            break;
        case 'updated_desc':
            store.setOrdering('-updated_at');
            break;
        default:
            store.setOrdering('-created_at');
    }
};
const goToPage = (page) => {
    store.setPage(page);
};
const goToAlbum = (id) => {
    window.open(`https://blnchk.com/albums/${id}`, '_blank');
};
const statusText = (status) => {
    switch (status) {
        case 'Temp':
            return '임시저장';
        case 'Submit':
            return '권리자 확인중';
        case 'WaitDistConfirm':
            return '발매일 확인중';
        case 'OkWait':
            return '발매 대기중';
        case 'Ok':
            return '유통중';
        case 'ServiceExpired':
            return '자동 연장 불가';
        case 'RevisionWait':
            return '수정 반영 대기중';
        case 'RevisionSubmit':
            return '권리자 수정 확인중';
        default:
            return status;
    }
};
const paginationArray = computed(() => {
    const total = store.totalPages;
    const current = store.currentPage;
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        range.push(i);
    }
    if (typeof range[0] === 'number' && range[0] > 1) {
        if (typeof range[0] === 'number' && range[0] > 2)
            range.unshift('...');
        range.unshift(1);
    }
    const last = range[range.length - 1];
    if (typeof last === 'number' && last < total) {
        if (last < total - 1)
            range.push('...');
        range.push(total);
    }
    return range;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold mb-6" },
});
if (__VLS_ctx.store.summary) {
    /** @type {[typeof AlbumHeaderSummary, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(AlbumHeaderSummary, new AlbumHeaderSummary({
        summary: (__VLS_ctx.store.summary),
    }));
    const __VLS_1 = __VLS_0({
        summary: (__VLS_ctx.store.summary),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
if (__VLS_ctx.store.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.store.error);
}
if (__VLS_ctx.store.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center h-32" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap justify-between gap-4 mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {[typeof BaseSelect, typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    modelValue: (__VLS_ctx.searchType),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.searchType),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "name",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "artist",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "song",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "isrc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "creator",
});
var __VLS_5;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "검색어 입력",
}));
const __VLS_7 = __VLS_6({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "검색어 입력",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onKeyup: (__VLS_ctx.onSearch)
};
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onSearch) },
    ...{ class: "bg-emerald-700 font-bold text-white px-4 py-1 whitespace-nowrap rounded" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "whitespace-nowrap" },
});
/** @type {[typeof BaseSelect, typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.sortBy),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.sortBy),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onChange: (__VLS_ctx.refresh)
};
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "name_asc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "name_desc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "created_desc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "created_asc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "updated_desc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "updated_asc",
});
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "whitespace-nowrap" },
});
/** @type {[typeof BaseSelect, typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.pageSize),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.pageSize),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onChange: (__VLS_ctx.refresh)
};
__VLS_22.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "20",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "50",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "100",
});
var __VLS_22;
if (!__VLS_ctx.store.error && !__VLS_ctx.store.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-auto mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "min-w-full divide-y text-sm divide-gray-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
        ...{ class: "bg-slate-200 dark:bg-slate-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        ...{ class: "table-cell-tight" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({
        ...{ class: "bg-white dark:bg-slate-900 divide-y divide-gray-200" },
    });
    for (const [album] of __VLS_getVForSourceType((__VLS_ctx.store.albums))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.store.error && !__VLS_ctx.store.loading))
                        return;
                    __VLS_ctx.goToAlbum(album.id);
                } },
            key: (album.id),
            ...{ class: "cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (album.id);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (__VLS_ctx.statusText(album.status));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight" },
        });
        (album.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight" },
        });
        (album.name_en);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (album.release_date);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (album.album_type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (album.register_type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (album.creator_name || album.created_by);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (__VLS_ctx.formatDate(album.created_at));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "table-cell-tight text-center" },
        });
        (__VLS_ctx.formatDate(album.updated_at));
    }
}
/** @type {[typeof BasePagination, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(BasePagination, new BasePagination({
    ...{ 'onPageChange': {} },
    currentPage: (__VLS_ctx.store.page),
    totalPages: (__VLS_ctx.totalPages),
}));
const __VLS_28 = __VLS_27({
    ...{ 'onPageChange': {} },
    currentPage: (__VLS_ctx.store.page),
    totalPages: (__VLS_ctx.totalPages),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_30;
let __VLS_31;
let __VLS_32;
const __VLS_33 = {
    onPageChange: (__VLS_ctx.onPageChange)
};
var __VLS_29;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-red-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-emerald-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-emerald-900']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['table-cell-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formatDate: formatDate,
            AlbumHeaderSummary: AlbumHeaderSummary,
            BaseInput: BaseInput,
            BaseSelect: BaseSelect,
            BasePagination: BasePagination,
            store: store,
            searchType: searchType,
            searchQuery: searchQuery,
            sortBy: sortBy,
            onPageChange: onPageChange,
            totalPages: totalPages,
            onSearch: onSearch,
            refresh: refresh,
            goToAlbum: goToAlbum,
            statusText: statusText,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AlbumsListView.vue.js.map