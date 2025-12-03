import { ref } from 'vue';
import { reactive } from "vue";

const state = reactive({
  token: null as string | null,
  role: null as string | null
});

export const isLoggedIn = ref(!!localStorage.getItem('token'));

export function setLogin(token: string, role: string) {
  state.token = token;
  state.role = role;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  isLoggedIn.value = true;
}

export function setLogout() {
  state.token = null;
  state.role = null;
  localStorage.removeItem('token');
  localStorage.removeItem("role");
  isLoggedIn.value = false;
}

export function useAuthStore() {
  return state;
}
