import { EDAD_MINIMA, EDAD_MAXIMA } from '@/constants/empleado'
import { calcularEdad, deFechaISO } from './fecha'

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/

function validarTexto (valor, etiqueta, obligatorio) {
  const texto = (valor || '').trim()
  if (!texto) return obligatorio ? `${etiqueta} es obligatorio` : ''
  if (!SOLO_LETRAS.test(texto)) return `${etiqueta} solo puede contener letras`
  if (texto.length > 40) return `${etiqueta} es demasiado largo`
  return ''
}

function validarFecha (valor) {
  const fecha = deFechaISO(valor)
  if (!fecha) return 'Selecciona la fecha de nacimiento'
  if (fecha > new Date()) return 'La fecha no puede ser futura'
  const edad = calcularEdad(fecha)
  if (edad < EDAD_MINIMA) return `El empleado debe tener al menos ${EDAD_MINIMA} años`
  if (edad > EDAD_MAXIMA) return 'Revisa la fecha de nacimiento'
  return ''
}

/**
 * Valida los datos de un empleado.
 * Regresa un objeto { campo: mensaje } solo con los campos que tienen error.
 */
export function validarEmpleado (empleado) {
  const errores = {
    nombre: validarTexto(empleado.nombre, 'El nombre', true),
    paterno: validarTexto(empleado.paterno, 'El apellido paterno', true),
    materno: validarTexto(empleado.materno, 'El apellido materno', false),
    fechaNacimiento: validarFecha(empleado.fechaNacimiento),
    puesto: (empleado.puesto || '').trim() ? '' : 'Indica el puesto'
  }
  return Object.fromEntries(Object.entries(errores).filter(([, msg]) => msg))
}
