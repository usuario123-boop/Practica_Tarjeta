// Acceso a localStorage con manejo de errores.
// Si el navegador bloquea el almacenamiento o se llena, la app sigue funcionando.

export function leer (clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave)
    return texto ? JSON.parse(texto) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

/** @returns {boolean} true si se pudo guardar */
export function escribir (clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}
