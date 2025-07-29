import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/main.css';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
// 더 간단하게 수정
const init = async () => {
    const authStore = useAuthStore();
    await authStore.initializeAuth();
    app.mount('#app');
};
init();
//# sourceMappingURL=main.js.map