<template>
  <button 
    v-if="isLoggedIn" 
    class="logout-btn"
    @click="handleLogout"
  >
    Logout
  </button>
</template>

<script setup lang="ts">
import { isLoggedIn } from '../stores/authStore';
import { logout } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<style>
.logout-btn {
  padding: 8px 14px;
  background: #e53935;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.logout-btn:hover {
  background: #c62828;
}
</style>
