import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'
import './styles.css'

import App from './App.vue'
import router from './router'

// Tema Aura con color primario azul (como el mockup)
const Tema = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}', 100: '{blue.100}', 200: '{blue.200}', 300: '{blue.300}', 400: '{blue.400}',
      500: '{blue.500}', 600: '{blue.600}', 700: '{blue.700}', 800: '{blue.800}', 900: '{blue.900}', 950: '{blue.950}'
    }
  }
})

createApp(App)
  .use(PrimeVue, { theme: { preset: Tema, options: { darkModeSelector: '.app-dark' } } })
  .use(ToastService)
  .directive('tooltip', Tooltip)
  .use(router)
  .mount('#app')
