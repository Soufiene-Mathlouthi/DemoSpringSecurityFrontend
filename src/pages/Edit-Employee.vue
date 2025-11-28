<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { QForm } from "quasar";

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

const loading = ref(true);
const error = ref("");

const employeeId = Number(route.params.id);

// Load employee data
async function fetchEmployee() {
  loading.value = true;
  error.value = "";

  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`/api/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    employee.value = res.data;
    employee.value.id = employeeId;
    console.log("Loaded employee:", employee.value);
  } catch (err: any) {
    console.error("Error loading employee:", err);
    error.value = "Failed to load employee data";

    if (err.response && err.response.status === 401) {
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchEmployee);

// Save updated employee
async function updateEmployee() {
  loading.value = true;
  error.value = "";

  try {
    const token = localStorage.getItem("token");

    // Send entire employee object, including ID, in body
    await axios.put(
      "http://localhost:8080/api/employees",
      employee.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    router.push("/employees-list");
  } catch (err: any) {
    console.error("Error updating employee:", err);
    error.value = "Failed to update employee";

    if (err.response && err.response.status === 401) {
      router.push("/login");
    }
  }
}
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg" style="max-width: 500px; margin: auto;">
      <q-card-section>
        <div class="text-h5 q-mb-md text-center">Edit Employee</div>

        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner-dots color="primary" size="40px" />
          <div>Loading employee...</div>
        </div>

        <div v-else>
          <q-form ref="formRef" @submit.prevent="updateEmployee">

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
              label="Save Changes"
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
