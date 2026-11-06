// Datos de ejemplo para los módulos de demostración de PrimeVue.
// Son fijos (no se guardan) y sirven para mostrar cómo funciona cada componente.

export const DEPARTAMENTOS = Object.freeze([
  'Recursos Humanos',
  'Sistemas',
  'Contabilidad',
  'Ventas',
  'Logística'
])

export const CIUDADES = Object.freeze([
  { nombre: 'Tuxtla Gutiérrez', clave: 'TGZ' },
  { nombre: 'Tapachula', clave: 'TAP' },
  { nombre: 'San Cristóbal de las Casas', clave: 'SCC' },
  { nombre: 'Comitán', clave: 'CMT' },
  { nombre: 'Palenque', clave: 'PLQ' }
])

export const CLIENTES = Object.freeze([
  { id: 1, nombre: 'Susana Rojas Mérida', rfc: 'ROMS920822JK7', departamento: 'Recursos Humanos', ciudad: 'Tapachula', antiguedad: 4, estado: 'Activo', saldo: 18450 },
  { id: 2, nombre: 'Carlos Hernández López', rfc: 'HELC880314939', departamento: 'Sistemas', ciudad: 'Tuxtla Gutiérrez', antiguedad: 9, estado: 'Activo', saldo: 32100 },
  { id: 3, nombre: 'Ana Luisa Gómez Pérez', rfc: 'GOPA951102NH5', departamento: 'Contabilidad', ciudad: 'Comitán', antiguedad: 6, estado: 'Baja', saldo: 0 },
  { id: 4, nombre: 'Miguel Santiago Cruz', rfc: 'SACM830630KS8', departamento: 'Ventas', ciudad: 'Tapachula', antiguedad: 14, estado: 'Activo', saldo: 54780 },
  { id: 5, nombre: 'Fernanda Vázquez Domínguez', rfc: 'VADF000119GC9', departamento: 'Logística', ciudad: 'Palenque', antiguedad: 2, estado: 'Vacaciones', saldo: 9320 },
  { id: 6, nombre: 'Roberto Jiménez Alfaro', rfc: 'JIAR910505TM2', departamento: 'Sistemas', ciudad: 'San Cristóbal de las Casas', antiguedad: 7, estado: 'Activo', saldo: 27600 },
  { id: 7, nombre: 'Patricia Morales Ruiz', rfc: 'MORP870218PD4', departamento: 'Recursos Humanos', ciudad: 'Tuxtla Gutiérrez', antiguedad: 11, estado: 'Activo', saldo: 41200 },
  { id: 8, nombre: 'Jorge Castellanos Nava', rfc: 'CANJ940927XR1', departamento: 'Ventas', ciudad: 'Comitán', antiguedad: 3, estado: 'Baja', saldo: 0 }
])

/** Color de la etiqueta (Tag) según el estado del cliente. */
export function severidadEstado (estado) {
  if (estado === 'Activo') return 'success'
  if (estado === 'Vacaciones') return 'warn'
  return 'danger'
}

/** Estructura jerárquica para el componente Tree. */
export const ORGANIGRAMA = Object.freeze([
  {
    key: '0',
    label: 'Dirección General',
    icon: 'pi pi-building',
    children: [
      {
        key: '0-0',
        label: 'Recursos Humanos',
        icon: 'pi pi-users',
        children: [
          { key: '0-0-0', label: 'Susana Rojas Mérida', icon: 'pi pi-user', data: 'Reclutamiento' },
          { key: '0-0-1', label: 'Patricia Morales Ruiz', icon: 'pi pi-user', data: 'Nóminas' }
        ]
      },
      {
        key: '0-1',
        label: 'Sistemas',
        icon: 'pi pi-desktop',
        children: [
          { key: '0-1-0', label: 'Carlos Hernández López', icon: 'pi pi-user', data: 'Desarrollo' },
          { key: '0-1-1', label: 'Roberto Jiménez Alfaro', icon: 'pi pi-user', data: 'Soporte técnico' }
        ]
      },
      {
        key: '0-2',
        label: 'Administración',
        icon: 'pi pi-briefcase',
        children: [
          { key: '0-2-0', label: 'Ana Luisa Gómez Pérez', icon: 'pi pi-user', data: 'Contabilidad' },
          { key: '0-2-1', label: 'Miguel Santiago Cruz', icon: 'pi pi-user', data: 'Ventas' },
          { key: '0-2-2', label: 'Fernanda Vázquez Domínguez', icon: 'pi pi-user', data: 'Logística' }
        ]
      }
    ]
  }
])

/** Las mismas áreas en el formato que necesita TreeTable. */
export const ORGANIGRAMA_TABLA = Object.freeze([
  {
    key: '0',
    data: { area: 'Dirección General', responsable: 'Dirección', personas: 7 },
    children: [
      {
        key: '0-0',
        data: { area: 'Recursos Humanos', responsable: 'Patricia Morales', personas: 2 },
        children: [
          { key: '0-0-0', data: { area: 'Reclutamiento', responsable: 'Susana Rojas', personas: 1 } },
          { key: '0-0-1', data: { area: 'Nóminas', responsable: 'Patricia Morales', personas: 1 } }
        ]
      },
      {
        key: '0-1',
        data: { area: 'Sistemas', responsable: 'Carlos Hernández', personas: 2 },
        children: [
          { key: '0-1-0', data: { area: 'Desarrollo', responsable: 'Carlos Hernández', personas: 1 } },
          { key: '0-1-1', data: { area: 'Soporte técnico', responsable: 'Roberto Jiménez', personas: 1 } }
        ]
      },
      {
        key: '0-2',
        data: { area: 'Administración', responsable: 'Ana Luisa Gómez', personas: 3 },
        children: [
          { key: '0-2-0', data: { area: 'Contabilidad', responsable: 'Ana Luisa Gómez', personas: 1 } },
          { key: '0-2-1', data: { area: 'Ventas', responsable: 'Miguel Santiago', personas: 1 } },
          { key: '0-2-2', data: { area: 'Logística', responsable: 'Fernanda Vázquez', personas: 1 } }
        ]
      }
    ]
  }
])

/** Prestaciones para las listas que se pueden ordenar o mover. */
export const PRESTACIONES = Object.freeze([
  'Seguro de gastos médicos',
  'Vales de despensa',
  'Fondo de ahorro',
  'Días de vacaciones adicionales',
  'Apoyo para transporte',
  'Capacitación continua'
])

/** Formato de moneda mexicana. */
export function aPesos (valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(valor ?? 0)
}
