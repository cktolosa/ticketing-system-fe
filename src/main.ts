import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import App from './App.vue';
import { router } from './router';
import './style.css';

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(VueDOMPurifyHTML).mount('#app');
