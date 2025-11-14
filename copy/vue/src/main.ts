import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Element Plus - 手動導入 JS API 使用的組件
import { ElMessage, ElMessageBox } from 'element-plus';
// 手動導入這些組件的樣式(因為它們通過 JS API 調用,不會被自動導入)
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';

// 自定義樣式放最後,確保可以覆蓋 Element Plus 的預設樣式
import './assets/main.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// 掛載到全局（保持現有代碼不需修改）
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$messageBox = ElMessageBox;

app.mount('#app');
