// Cálculo del RFC para personas físicas (algoritmo del SAT)
// Incluye: 4 letras + fecha (AAMMDD) + homoclave (2) + dígito verificador (1)

const PARTICULAS = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'MC', 'MAC', 'VON', 'VAN', 'MI', 'DA', 'DAS', 'DER', 'DI', 'DIE', 'DD', 'EL', 'LE', 'LES']
const NOMBRES_COMUNES = ['JOSE', 'J', 'J.', 'MARIA', 'MA', 'MA.', 'M', 'M.']
const INCONVENIENTES = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN']

// Quita acentos (conserva la Ñ) y pasa a mayúsculas
export function normalizar (texto = '') {
  return texto
    .toUpperCase()
    .replace(/Ñ/g, '#')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/#/g, 'Ñ')
    .replace(/[^A-ZÑ& ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function sinParticulas (texto) {
  return normalizar(texto).split(' ').filter(p => p && !PARTICULAS.includes(p)).join(' ')
}

function primeraVocalInterna (palabra) {
  const m = palabra.slice(1).match(/[AEIOU]/)
  return m ? m[0] : 'X'
}

function nombreAUsar (nombre) {
  const partes = sinParticulas(nombre).split(' ').filter(Boolean)
  if (partes.length > 1 && NOMBRES_COMUNES.includes(partes[0])) return partes[1]
  return partes[0] || ''
}

function letras (nombre, paterno, materno) {
  const pat = sinParticulas(paterno).split(' ')[0] || ''
  const mat = sinParticulas(materno).split(' ')[0] || ''
  const nom = nombreAUsar(nombre)
  let clave
  if (!mat) {
    clave = pat.slice(0, 2) + nom.slice(0, 2)
  } else if (pat.length <= 2) {
    clave = pat[0] + mat[0] + nom.slice(0, 2)
  } else {
    clave = pat[0] + primeraVocalInterna(pat) + mat[0] + nom[0]
  }
  clave = clave.replace(/Ñ/g, 'X').padEnd(4, 'X')
  if (INCONVENIENTES.includes(clave)) clave = clave.slice(0, 3) + 'X'
  return clave
}

function fechaAAMMDD (fecha) {
  const d = new Date(fecha)
  const aa = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return aa + mm + dd
}

// Homoclave (2 caracteres) a partir del nombre completo
function homoclave (nombre, paterno, materno) {
  const completo = [normalizar(paterno), normalizar(materno), normalizar(nombre)].filter(Boolean).join(' ')
  const valor = (c) => {
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
  const cadena = '0' + [...completo].map(valor).join('')
  let suma = 0
  for (let i = 0; i < cadena.length - 1; i++) {
    suma += parseInt(cadena.substr(i, 2), 10) * parseInt(cadena[i + 1], 10)
  }
  const ultimos3 = suma % 1000
  const tabla = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'
  return tabla[Math.floor(ultimos3 / 34)] + tabla[ultimos3 % 34]
}

// Dígito verificador sobre los primeros 12 caracteres
function digitoVerificador (rfc12) {
  const tabla = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ'
  let suma = 0
  for (let i = 0; i < 12; i++) {
    suma += tabla.indexOf(rfc12[i]) * (13 - i)
  }
  const r = suma % 11
  if (r === 0) return '0'
  const d = 11 - r
  return d === 10 ? 'A' : String(d)
}

export function calcularRFC ({ nombre, paterno, materno, fechaNacimiento }) {
  if (!nombre || !paterno || !fechaNacimiento) return ''
  const base = letras(nombre, paterno, materno) + fechaAAMMDD(fechaNacimiento)
  const rfc12 = base + homoclave(nombre, paterno, materno)
  return rfc12 + digitoVerificador(rfc12)
}
