import api from "../boot/axios";

export function getEmployees() {
  return api.get("/employees");
}

export function deleteEmployee(id: number) {
  return api.delete(`/employees/${id}`);
}

export function updateEmployee(data: any) {
  return api.put("/employees", data);
}

export function createEmployee(data: any) {
  return api.post("/employees", data);
}
