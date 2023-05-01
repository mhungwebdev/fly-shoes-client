import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './firebase';
import 'devextreme/dist/css/dx.light.css';
import "@/common/css/index.css";
import '@/common/scss/index.scss';
import 'vue-loading-overlay/dist/css/index.css';

const app = createApp(App)
app.use(createPinia());
app.use(router);

app
  .use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  })

app.mount('#app')
