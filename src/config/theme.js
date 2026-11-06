import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

// Tema Aura de PrimeVue con el azul como color primario (igual que el mockup)
const TemaPrincipal = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
})

// Opciones que recibe PrimeVue
export const opcionesPrimeVue = {
  theme: {
    preset: TemaPrincipal,
    options: { darkModeSelector: '.app-dark' }
  },
  locale: {
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    firstDayOfWeek: 1,
    dateFormat: 'dd/mm/yy',
    accept: 'Sí',
    reject: 'No',
    emptyMessage: 'Sin resultados',
    emptyFilterMessage: 'Sin resultados'
  }
}
