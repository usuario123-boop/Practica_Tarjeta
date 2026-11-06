import { ref } from 'vue'

const PUNTO_MOVIL = '(max-width: 760px)'

// Estado del menú lateral (compartido entre Topbar y Sidebar)
const menuColapsado = ref(false)
const menuMovilAbierto = ref(false)

export function useLayout () {
  const esMovil = () => window.matchMedia(PUNTO_MOVIL).matches

  function alternarMenu () {
    if (esMovil()) menuMovilAbierto.value = !menuMovilAbierto.value
    else menuColapsado.value = !menuColapsado.value
  }

  function cerrarMenuMovil () {
    menuMovilAbierto.value = false
  }

  return { menuColapsado, menuMovilAbierto, alternarMenu, cerrarMenuMovil }
}
