<script setup lang="ts">
import Logout from './components/Logout.vue';

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>My App</q-toolbar-title>
        <Logout/>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />   <!-- REQUIRED -->
    </q-page-container>
  </q-layout>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
