<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Employee {
  id: number;
  name: string;
  email: string;
}

const employees = ref<Employee[]>([]);
const loading = ref(true);
const error = ref("");
const router = useRouter();

async function fetchEmployees() {
  loading.value = true;
  error.value = "";

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await axios.get<Employee[]>("/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    employees.value = res.data;
  } catch (err: any) {
    console.error("Error fetching employees:", err);
    error.value = "Failed to fetch employees";

    if (err.response && err.response.status === 401) {
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchEmployees);
</script>

<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-md column items-center">
      <q-card class="q-pa-lg" style="max-width: 900px; width: 100%">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5 text-weight-bold">Employees List</div>

            <q-btn
              label="Refresh"
              color="primary"
              icon="refresh"
              flat
              @click="fetchEmployees"
            />
          </div>
        </q-card-section>

        <!-- Loading -->
        <div v-if="loading" class="column items-center q-pa-md">
          <q-spinner color="primary" size="50px" />
          <div class="q-mt-sm text-grey-8">Loading employees...</div>
        </div>

        <!-- Error -->
        <q-banner
          v-else-if="error"
          dense
          rounded
          class="bg-red-2 text-red-9 q-pa-sm q-mb-md"
          icon="error"
        >
          {{ error }}
        </q-banner>

        <!-- Table -->
        <q-table
          :rows="employees"
          :columns="[
            { name: 'id', label: 'ID', field: 'id', align: 'left' },

            {
              name: 'fullName',
              label: 'Name',
              field: (row) => row.firstName + ' ' + row.lastName,
              align: 'left',
            },

            { name: 'email', label: 'Email', field: 'email', align: 'left' },
          ]"
          row-key="id"
          flat
          bordered
          separator="horizontal"
          class="shadow-1"
        />
      </q-card>
    </div>
  </q-page>
</template>
<style scoped></style>
