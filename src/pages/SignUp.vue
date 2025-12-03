<script setup lang="ts">
import { ref } from "vue";
import { QForm } from "quasar";
import axios from "axios";
import router from "../router";

const formRef = ref<QForm | null>(null);
const loading = ref(false);
const error = ref("");

const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

// ENV variable or fallback
const AUTH_URL = import.meta.env.VITE_AUTH_URL

async function register() {
  error.value = "";
  loading.value = true;

  try {
    await axios.post(`${AUTH_URL}/signup`, user.value, {
      headers: { "Content-Type": "application/json" }
    });

    // After successful sign up → redirect to login
    router.push("/login");
  } catch (err: any) {
    error.value =
      err?.response?.data?.message || "Failed to create account. Try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg" style="max-width: 500px; margin: auto">
      <q-card-section>
        <div class="text-h5 q-mb-md text-center">Create an Account</div>

        <q-form ref="formRef" @submit.prevent="register">
          <q-input
            v-model="user.firstName"
            label="Username"
            dense
            outlined
            :rules="[val => !!val || 'Required']"
            class="q-mb-md"
          />

          <q-input
            v-model="user.email"
            label="Email"
            type="email"
            dense
            outlined
            :rules="[
              val => !!val || 'Required',
              val => /.+@.+\..+/.test(val) || 'Invalid email'
            ]"
            class="q-mb-md"
          />

          <q-input
            v-model="user.password"
            label="Password"
            type="password"
            dense
            outlined
            :rules="[val => val.length >= 6 || 'Minimum 6 characters']"
            class="q-mb-lg"
          />

          <q-btn
            type="submit"
            label="Create Account"
            color="primary"
            class="full-width q-mt-md"
            :loading="loading"
          />

          <q-btn
            flat
            label="Already have an account? Log in"
            color="primary"
            class="full-width q-mt-sm"
            @click="router.push('/login')"
          />
        </q-form>

        <q-banner
          v-if="error"
          class="q-mt-md text-center"
          dense
          color="negative"
          icon="error"
        >
          {{ error }}
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>
