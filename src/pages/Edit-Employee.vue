<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { QForm } from "quasar";
import { notifySuccess, notifyError } from "../utils/Notify";


interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const route = useRoute();
const router = useRouter();
const formRef = ref<QForm | null>(null);

const employee = ref<Employee>({
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
});

const loading = ref(false);
const error = ref("");

const employeeId = route.params.id ? Number(route.params.id) : null;
const isEdit = !!employeeId;

// Load employee data if editing
async function fetchEmployee() {
  if (!isEdit) return;

  loading.value = true;
  error.value = "";

  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    employee.value = res.data;
    employee.value.id = employeeId!;
  } catch (err: any) {
    notifyError("Failed to load employee data");
    if (err.response?.status === 401) router.push("/login");
  } finally {
    loading.value = false;
  }
}

// Combined handler for add or edit
async function submitEmployee() {
  loading.value = true;
  error.value = "";

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (isEdit) {
      // Update employee
      await axios.put("/api/employees", employee.value, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      // Add new employee
      await axios.post("/api/employees", employee.value, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
    notifySuccess(`Employee ${isEdit ? "updated" : "added"} successfully`);
    router.push("/employees-list");
  } catch (err: any) {
    notifyError("Failed to save employee data");
    if (err.response?.status === 401) router.push("/login");
  } finally {
    loading.value = false;
  }
}

onMounted(fetchEmployee);
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg" style="max-width: 500px; margin: auto;">
      <q-card-section>
        <div class="text-h5 q-mb-md text-center">
          {{ isEdit ? "Edit Employee" : "Add New Employee" }}
        </div>

        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner-dots color="primary" size="40px" />
          <div>{{ isEdit ? "Loading employee..." : "Preparing form..." }}</div>
        </div>

        <div v-else>
          <q-form ref="formRef" @submit.prevent="submitEmployee">
            <q-input
              v-model="employee.firstName"
              label="First Name"
              outlined
              dense
              :rules="[val => !!val || 'Required']"
              class="q-mb-md"
            />

            <q-input
              v-model="employee.lastName"
              label="Last Name"
              outlined
              dense
              :rules="[val => !!val || 'Required']"
              class="q-mb-md"
            />

            <q-input
              v-model="employee.email"
              label="Email"
              type="email"
              outlined
              dense
              :rules="[
                val => !!val || 'Required',
                val => /.+@.+\..+/.test(val) || 'Invalid email'
              ]"
              class="q-mb-lg"
            />

            <q-btn
              :label="isEdit ? 'Save Changes' : 'Add Employee'"
              type="submit"
              color="primary"
              unelevated
              class="full-width q-mt-md"
            />

            <q-btn
              label="Cancel"
              flat
              color="negative"
              class="full-width q-mt-sm"
              @click="router.push('/employees-list')"
            />
          </q-form>
        </div>

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
