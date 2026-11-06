import { ref } from 'vue'
import { descargarURL } from '@/utils/archivos'

// Tamaño estándar de una credencial (CR80): 54 x 85.6 mm
const ANCHO_CREDENCIAL_MM = 54

/**
 * Convierte un elemento HTML en imagen PNG de alta resolución.
 * - Espera a que carguen las fuentes para que el texto salga igual que en pantalla.
 * - Se captura dos veces: la primera "calienta" las imágenes embebidas
 *   (evita que la foto o el QR salgan en blanco en algunos navegadores).
 */
async function capturarPNG (elemento, escala = 4) {
  const { toPng } = await import('html-to-image')
  await document.fonts.ready
  const opciones = {
    pixelRatio: escala,
    cacheBust: true,
    // La sombra se recorta en la imagen, así que se quita solo al exportar
    style: { boxShadow: 'none', margin: '0' }
  }
  await toPng(elemento, opciones)
  return toPng(elemento, opciones)
}

export function useDescarga () {
  const descargando = ref(false)
  const error = ref('')

  async function ejecutar (tarea) {
    descargando.value = true
    error.value = ''
    try {
      await tarea()
      return true
    } catch (e) {
      console.error(e)
      error.value = 'No se pudo generar el archivo. Intenta de nuevo.'
      return false
    } finally {
      descargando.value = false
    }
  }

  /** Descarga el elemento como imagen PNG. */
  const descargarPNG = (elemento, nombre) => ejecutar(async () => {
    const png = await capturarPNG(elemento)
    descargarURL(png, `${nombre}.png`)
  })

  /** Descarga el elemento como PDF del tamaño de una credencial. */
  const descargarPDF = (elemento, nombre) => ejecutar(async () => {
    const [{ jsPDF }, png] = await Promise.all([import('jspdf'), capturarPNG(elemento)])
    const ancho = ANCHO_CREDENCIAL_MM
    const alto = ancho * (elemento.offsetHeight / elemento.offsetWidth)
    const pdf = new jsPDF({ unit: 'mm', format: [ancho, alto], orientation: 'portrait' })
    pdf.addImage(png, 'PNG', 0, 0, ancho, alto, undefined, 'FAST')
    pdf.setProperties({ title: `Tarjeta digital - ${nombre}` })
    pdf.save(`${nombre}.pdf`)
  })

  return { descargando, error, descargarPNG, descargarPDF }
}
