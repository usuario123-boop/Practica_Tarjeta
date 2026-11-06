// Constantes del dominio "empleado"

export const EMPRESA = Object.freeze({
  nombre: 'TECH SOLUTIONS',
  lema: 'Innovación que conecta'
})

export const PUESTOS = Object.freeze([
  'Empleado',
  'Empleada',
  'Desarrollador(a)',
  'Analista',
  'Diseñador(a)',
  'Soporte Técnico',
  'Gerente'
])

export const EDAD_MINIMA = 15
export const EDAD_MAXIMA = 100

/** Crea un empleado con todos los campos vacíos. */
export function crearEmpleadoVacio () {
  return {
    id: null,
    nombre: '',
    paterno: '',
    materno: '',
    fechaNacimiento: null,
    puesto: PUESTOS[0],
    foto: ''
  }
}

/** Empleado que se muestra como ejemplo cuando aún no hay registros. */
export const EMPLEADO_EJEMPLO = Object.freeze({
  nombre: 'Susana',
  paterno: 'Rojas',
  materno: 'Merida',
  fechaNacimiento: '1992-08-22',
  puesto: 'Empleada',
  rfc: 'ROMS920822JK7',
  foto: ''
})
