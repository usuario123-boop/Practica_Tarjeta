import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import TarjetaView from './views/TarjetaView.vue'
import EmpleadosView from './views/EmpleadosView.vue'

// Hash history (#/) para que funcione en GitHub Pages sin configuración extra
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/tarjeta', name: 'tarjeta', component: TarjetaView },
    { path: '/empleados', name: 'empleados', component: EmpleadosView }
  ]
})
