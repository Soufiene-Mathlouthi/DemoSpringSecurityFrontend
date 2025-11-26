import { ref } from 'vue';

export const isLoggedIn = ref(!!localStorage.getItem('token'));

export function setLogin(token: string) {
  localStorage.setItem('token', token);
  isLoggedIn.value = true;
}

export function setLogout() {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
}
