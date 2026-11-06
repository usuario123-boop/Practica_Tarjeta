import { deFechaISO, aFechaISO } from './fecha'

// Escapa caracteres especiales del formato vCard
const escapar = (texto = '') => String(texto).replace(/([,;\\])/g, '\\$1')

/**
 * Genera el contenido del código QR en formato vCard 3.0.
 * Al escanearlo con el celular se muestra el contacto del empleado.
 */
export function crearVCard (empleado, empresa) {
  const apellidos = [empleado.paterno, empleado.materno].filter(Boolean).join(' ')
  const nacimiento = aFechaISO(deFechaISO(empleado.fechaNacimiento))

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapar(apellidos)};${escapar(empleado.nombre)};;;`,
    `FN:${escapar(`${empleado.nombre || ''} ${apellidos}`.trim())}`,
    `ORG:${escapar(empresa.nombre)}`,
    `TITLE:${escapar(empleado.puesto)}`,
    nacimiento && `BDAY:${nacimiento}`,
    `NOTE:RFC ${escapar(empleado.rfc)}`,
    'END:VCARD'
  ].filter(Boolean).join('\n')
}
