// Cálculo del RFC para personas físicas (algoritmo del SAT).
// Estructura: 4 letras + fecha AAMMDD + homoclave (2) + dígito verificador (1)

import { deFechaISO } from './fecha'

const PARTICULAS = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'MC', 'MAC', 'VON', 'VAN', 'MI', 'DA', 'DAS', 'DER', 'DI', 'DIE', 'DD', 'EL', 'LE', 'LES']
const NOMBRES_COMUNES = ['JOSE', 'J', 'MARIA', 'MA', 'M']
const PALABRAS_INCONVENIENTES = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN']

const TABLA_HOMOCLAVE = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'
const TABLA_VERIFICADOR = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ'

/** Mayúsculas, sin acentos (conserva la Ñ) y solo letras, & y espacios. */
export function normalizar (texto = '') {
  return String(texto)
    .toUpperCase()
    .replace(/Ñ/g, '#')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/#/g, 'Ñ')
    .replace(/[^A-ZÑ& ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const palabras = (texto) => normalizar(texto).split(' ').filter(p => p && !PARTICULAS.includes(p))

function primeraVocalInterna (palabra) {
  const vocal = palabra.slice(1).match(/[AEIOU]/)
  return vocal ? vocal[0] : 'X'
}

function nombreParaRFC (nombre) {
  const partes = palabras(nombre)
  return partes.length > 1 && NOMBRES_COMUNES.includes(partes[0]) ? partes[1] : (partes[0] || '')
}

/** Primeras 4 letras del RFC. */
export function obtenerLetras (nombre, paterno, materno) {
  const pat = palabras(paterno)[0] || ''
  const mat = palabras(materno)[0] || ''
  const nom = nombreParaRFC(nombre)

  let clave
  if (!mat) clave = pat.slice(0, 2) + nom.slice(0, 2)
  else if (pat.length <= 2) clave = pat[0] + mat[0] + nom.slice(0, 2)
  else clave = pat[0] + primeraVocalInterna(pat) + mat[0] + nom[0]

  clave = clave.replace(/Ñ/g, 'X').padEnd(4, 'X')
  return PALABRAS_INCONVENIENTES.includes(clave) ? clave.slice(0, 3) + 'X' : clave
}

/** Fecha en formato AAMMDD. */
export function obtenerFecha (fechaNacimiento) {
  const d = deFechaISO(fechaNacimiento)
  if (!d) return ''
  return String(d.getFullYear()).slice(-2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
}

function valorHomoclave (c) {
  if (c === ' ') return '00'
  if (c >= '0' && c <= '9') return '0' + c
  if (c === '&') return '10'
  if (c === 'Ñ') return '40'
  const code = c.charCodeAt(0)
  if (c >= 'A' && c <= 'I') return String(code - 65 + 11)
  if (c >= 'J' && c <= 'R') return String(code - 74 + 21)
  if (c >= 'S' && c <= 'Z') return String(code - 83 + 32)
  return '00'
}

/** Homoclave de 2 caracteres calculada sobre el nombre completo. */
export function obtenerHomoclave (nombre, paterno, materno) {
  const completo = [paterno, materno, nombre].map(normalizar).filter(Boolean).join(' ')
  const cadena = '0' + [...completo].map(valorHomoclave).join('')

  let suma = 0
  for (let i = 0; i < cadena.length - 1; i++) {
    suma += Number(cadena.substr(i, 2)) * Number(cadena[i + 1])
  }
  const ultimos3 = suma % 1000
  return TABLA_HOMOCLAVE[Math.floor(ultimos3 / 34)] + TABLA_HOMOCLAVE[ultimos3 % 34]
}

/** Dígito verificador calculado sobre los primeros 12 caracteres. */
export function obtenerDigitoVerificador (rfc12) {
  let suma = 0
  for (let i = 0; i < 12; i++) {
    suma += TABLA_VERIFICADOR.indexOf(rfc12[i]) * (13 - i)
  }
  const residuo = suma % 11
  if (residuo === 0) return '0'
  const digito = 11 - residuo
  return digito === 10 ? 'A' : String(digito)
}

/**
 * Calcula el RFC completo (13 caracteres).
 * Regresa '' si faltan datos obligatorios.
 */
export function calcularRFC ({ nombre, paterno, materno, fechaNacimiento }) {
  if (!normalizar(nombre) || !normalizar(paterno) || !deFechaISO(fechaNacimiento)) return ''
  const rfc12 = obtenerLetras(nombre, paterno, materno) +
    obtenerFecha(fechaNacimiento) +
    obtenerHomoclave(nombre, paterno, materno)
  return rfc12 + obtenerDigitoVerificador(rfc12)
}
