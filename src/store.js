import { ref, watch } from 'vue'

// Lista de empleados con tarjeta generada (se guarda en el navegador)
const CLAVE = 'tarjetas-empleados'

function cargar () {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || [] } catch { return [] }
}

export const empleados = ref(cargar())

watch(empleados, (v) => {
  try { localStorage.setItem(CLAVE, JSON.stringify(v)) } catch { /* sin almacenamiento */ }
}, { deep: true })

export function guardarEmpleado (emp) {
  const i = empleados.value.findIndex(e => e.rfc === emp.rfc)
  if (i >= 0) empleados.value[i] = emp
  else empleados.value.unshift(emp)
}

export function eliminarEmpleado (rfc) {
  empleados.value = empleados.value.filter(e => e.rfc !== rfc)
}
