<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
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

// DELETE employee
async function deleteEmployee(id: number) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    employees.value = employees.value.filter(emp => emp.id !== id);
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
}

function editEmployee(id: number) {
  router.push(`/employees/edit/${id}`);
}
</script>

<template>
  <q-page padding>
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner-dots color="primary" size="50px" />
      <div>Loading employees...</div>
    </div>

    <div v-else-if="error" class="text-center q-pa-md text-negative">
      {{ error }}
    </div>

    <q-table
      v-else
      :rows="employees"
      class="text-center"
      :columns="[
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        { name: 'firstName', label: 'First Name', field: 'firstName', align: 'center' },
        { name: 'lastName', label: 'Last Name', field: 'lastName', align: 'center' },
        { name: 'email', label: 'Email', field: 'email', align: 'center' },
        { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' }
      ]"
      row-key="id"
      flat
      bordered
      separator="cell"
    >
      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn 
            dense 
            flat 
            color="primary" 
            icon="edit" 
            @click="editEmployee(props.row.id)"
          />

          <q-btn 
            dense 
            flat 
            color="negative" 
            icon="delete" 
            @click="deleteEmployee(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
