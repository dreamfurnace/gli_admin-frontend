import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './stores/auth';
import { setupAxiosInterceptors } from './utils/axios';
import './assets/main.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
});
// 앱 먼저 mount → 이후 인증 초기화
app.mount('#app');
// 인증 초기화는 App 내부에서 라우팅 처리가 가능하도록 후행
const authStore = useAuthStore();
setupAxiosInterceptors(authStore);
authStore.initializeAuth(); // 여기서 router.push는 호출하지 않아야 함!
//# sourceMappingURL=main.js.map