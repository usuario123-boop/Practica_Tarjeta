import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

// Fuentes locales (no dependen de internet y se incluyen al descargar la tarjeta)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import 'primeicons/primeicons.css'
import '@/assets/styles/main.css'

import App from './App.vue'
import router from './router'
import { opcionesPrimeVue } from './config/theme'

createApp(App)
  .use(PrimeVue, opcionesPrimeVue)
  .use(ToastService)
  .use(ConfirmationService)
  .directive('tooltip', Tooltip)
  .use(router)
  .mount('#app')
