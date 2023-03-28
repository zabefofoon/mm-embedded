import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {vfmPlugin} from "vue-final-modal";

import App from './App.vue'
import router from './router'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(vfmPlugin())
    .mount('#app')
