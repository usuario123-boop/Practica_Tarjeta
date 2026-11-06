// Utilidades para generar y descargar archivos

/** Convierte un texto en un nombre de archivo seguro: "Susana Rojas" -> "susana-rojas". */
export function nombreSeguro (texto = 'archivo') {
  return String(texto)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'archivo'
}

/** Descarga una URL (dataURL o blob URL) con el nombre indicado. */
export function descargarURL (url, nombre) {
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
}

/**
 * Exporta filas a CSV (compatible con Excel: UTF-8 con BOM).
 * @param {Array<Object>} filas
 * @param {Array<{campo: string, titulo: string}>} columnas
 */
export function exportarCSV (filas, columnas, nombre) {
  const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lineas = [
    columnas.map(c => celda(c.titulo)).join(','),
    ...filas.map(f => columnas.map(c => celda(f[c.campo])).join(','))
  ]
  const blob = new Blob(['﻿' + lineas.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  descargarURL(url, nombre)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
