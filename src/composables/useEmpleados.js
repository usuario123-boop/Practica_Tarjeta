import { ref, computed, readonly } from 'vue'
import { leer, escribir } from '@/services/storage'
import { esMismoDia } from '@/utils/fecha'

const CLAVE = 'tarjeta-digital:empleados'

// Estado compartido por toda la app (un solo arreglo para todas las vistas)
const empleados = ref(leer(CLAVE, []))

const crearId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/** Guarda la nueva lista; si el navegador no tiene espacio, no cambia nada. */
function persistir (lista) {
  if (!escribir(CLAVE, lista)) return false
  empleados.value = lista
  return true
}

/**
 * Crea o actualiza un empleado.
 * @returns {{ ok: boolean, empleado?: object, nuevo?: boolean, mensaje?: string }}
 */
function guardarEmpleado (datos) {
  const duplicado = empleados.value.find(e => e.rfc === datos.rfc && e.id !== datos.id)
  if (duplicado) {
    return { ok: false, mensaje: `Ya existe un empleado con el RFC ${datos.rfc}` }
  }

  const ahora = new Date().toISOString()
  const existente = datos.id && empleados.value.find(e => e.id === datos.id)

  const empleado = existente
    ? { ...existente, ...datos, actualizado: ahora }
    : { ...datos, id: crearId(), creado: ahora, actualizado: ahora }

  const lista = existente
    ? empleados.value.map(e => (e.id === empleado.id ? empleado : e))
    : [empleado, ...empleados.value]

  if (!persistir(lista)) {
    return { ok: false, mensaje: 'No hay espacio en el navegador. Usa una foto más pequeña o elimina empleados.' }
  }
  return { ok: true, empleado, nuevo: !existente }
}

function eliminarEmpleado (id) {
  return persistir(empleados.value.filter(e => e.id !== id))
}

function buscarEmpleado (id) {
  return empleados.value.find(e => e.id === id) || null
}

const estadisticas = computed(() => {
  const lista = empleados.value
  return {
    total: lista.length,
    hoy: lista.filter(e => esMismoDia(e.creado, new Date())).length,
    conFoto: lista.filter(e => e.foto).length,
    puestos: new Set(lista.map(e => e.puesto)).size
  }
})

export function useEmpleados () {
  return {
    empleados: readonly(empleados),
    estadisticas,
    guardarEmpleado,
    eliminarEmpleado,
    buscarEmpleado
  }
}
