import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import axios from 'axios'
import 'quasar/dist/quasar.css'
import router from './router/index';



createApp(App)
  .use(router)
  .use(Quasar)
  .mount('#app')

axios.defaults.baseURL = "http://localhost:8080";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
