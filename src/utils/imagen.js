// Utilidades para imágenes

/**
 * Lee una imagen, la recorta en cuadrado (centro) y la reduce a `tamano` px.
 * Así la foto ocupa poco espacio en el navegador y se ve bien en el círculo.
 * @returns {Promise<string>} imagen en dataURL (JPEG)
 */
export function prepararFoto (archivo, tamano = 360) {
  return new Promise((resolve, reject) => {
    if (!archivo?.type?.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen'))
      return
    }
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      const lado = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = tamano
      canvas.getContext('2d').drawImage(
        img,
        (img.width - lado) / 2, (img.height - lado) / 2, lado, lado,
        0, 0, tamano, tamano
      )
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}
