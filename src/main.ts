import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Notify } from 'quasar'
import 'quasar/dist/quasar.css'
import router from './router/index';
import quasarIconSet from 'quasar/icon-set/material-icons';

const app = createApp(App);

app
  .use(router)
  .use(Quasar, {
    plugins: {
      Notify
    },
      iconSet: quasarIconSet
  });

app.mount('#app')
