import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Notify } from 'quasar'
import axios from 'axios'
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

axios.defaults.baseURL = "http://localhost:8080";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
