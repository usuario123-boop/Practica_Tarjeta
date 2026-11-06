import { createRouter, createWebHashHistory } from 'vue-router'
import { APP } from '@/constants/app'

// Cada vista se carga solo cuando se visita (carga inicial más rápida)
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { titulo: 'Dashboard' }
  },
  {
    path: '/tarjeta/:id?',
    name: 'tarjeta',
    component: () => import('@/views/TarjetaView.vue'),
    props: true,
    meta: { titulo: 'Tarjeta Digital' }
  },
  {
    path: '/empleados',
    name: 'empleados',
    component: () => import('@/views/EmpleadosView.vue'),
    meta: { titulo: 'Empleados' }
  },
  {
    path: '/codigos',
    name: 'codigos',
    component: () => import('@/views/CodigosView.vue'),
    meta: { titulo: 'BarCode-QR' }
  },
  {
    path: '/graficas',
    name: 'graficas',
    component: () => import('@/views/GraficasView.vue'),
    meta: { titulo: 'Gráficas' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // Hash history (#/) para que funcione en GitHub Pages sin configuración extra
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = `${to.meta.titulo ?? 'Inicio'} · ${APP.titulo}`
})

export default router
