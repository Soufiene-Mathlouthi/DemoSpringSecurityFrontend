<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px">
      <q-card-section>
        <div class="text-h4 text-italic text-center q-mb-md">Login</div>

        <q-form @submit.prevent="login" ref="formRef">
          <q-input
            v-model="username"
            label="Username"
            outlined
            dense
            :rules="[(val) => !!val || 'Username is required']"
            lazy-rules
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            dense
            :rules="[(val) => !!val || 'Password is required']"
            lazy-rules
            class="q-mt-md"
          />
          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width q-mt-lg"
            :loading="loading"
            :disable="loading"
          />
          <q-btn
            flat
            label="Don't have an account? Sign up"
            color="primary"
            class="full-width q-mt-sm"
            @click="$router.push('/signup')"
          />
        </q-form>

        <q-banner
          v-if="error"
          class="q-mt-md text-center text-italic"
          dense
          color="secondary"
          icon="error"
        >
          {{ error }}
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../services/auth";
import type { LoginRequest } from "../services/types";
import { QForm } from "quasar";
import { notifyError } from "../utils/Notify";
import { setLogin } from "../stores/authStore";

export default defineComponent({
  setup() {
    const username = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);
    const router = useRouter();
    const formRef = ref<QForm | null>(null);

    const login = async () => {
      if (!formRef.value?.validate()) return;

      loading.value = true;
      error.value = "";

      const credentials: LoginRequest = {
        username: username.value,
        password: password.value,
      };

      try {
        const response = await loginUser(credentials);
        setLogin(response.token, response.role);
        router.push("/employees-list");
      } catch (err) {
        notifyError("Login failed: Invalid username or password");
        error.value = "Invalid username or password";
      } finally {
        loading.value = false;
      }
    };

    return { username, password, error, loading, login, formRef };
  },
});
</script>

<style scoped>
.q-page {
  height: 100vh;
}
</style>
