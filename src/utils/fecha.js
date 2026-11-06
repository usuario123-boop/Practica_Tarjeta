// Utilidades de fechas.
// Las fechas de nacimiento se guardan como texto 'AAAA-MM-DD' para evitar
// errores de zona horaria (un Date en UTC puede "moverse" un día).

/** Convierte un Date a 'AAAA-MM-DD' (hora local). */
export function aFechaISO (fecha) {
  if (!(fecha instanceof Date) || isNaN(fecha)) return ''
  const aa = fecha.getFullYear()
  const mm = String(fecha.getMonth() + 1).padStart(2, '0')
  const dd = String(fecha.getDate()).padStart(2, '0')
  return `${aa}-${mm}-${dd}`
}

/** Convierte 'AAAA-MM-DD' (o un Date) a Date en hora local. */
export function deFechaISO (valor) {
  if (!valor) return null
  if (valor instanceof Date) return isNaN(valor) ? null : valor
  const m = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const d = new Date(valor)
  return isNaN(d) ? null : d
}

/** Formato dd/mm/aaaa para mostrar al usuario. */
export function formatearFecha (valor) {
  const d = deFechaISO(valor)
  return d ? d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
}

/** Edad cumplida en años a la fecha de referencia. */
export function calcularEdad (valor, hoy = new Date()) {
  const d = deFechaISO(valor)
  if (!d) return null
  let edad = hoy.getFullYear() - d.getFullYear()
  const aunNoCumple = hoy.getMonth() < d.getMonth() ||
    (hoy.getMonth() === d.getMonth() && hoy.getDate() < d.getDate())
  if (aunNoCumple) edad--
  return edad
}

/** true si ambas fechas caen en el mismo día. */
export function esMismoDia (a, b) {
  const x = new Date(a)
  const y = new Date(b)
  return x.toDateString() === y.toDateString()
}
