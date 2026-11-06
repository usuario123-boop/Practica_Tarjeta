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
    // Ruta del mockup: genera el RFC y la tarjeta digital
    path: '/formClientes/:id?',
    name: 'tarjeta',
    component: () => import('@/views/TarjetaView.vue'),
    props: true,
    meta: { titulo: 'Demo Clientes' }
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

  // Módulos de demostración de componentes de PrimeVue
  {
    path: '/input',
    name: 'input',
    component: () => import('@/views/demos/InputView.vue'),
    meta: { titulo: 'Input' }
  },
  {
    path: '/float-label',
    name: 'float-label',
    component: () => import('@/views/demos/FloatLabelView.vue'),
    meta: { titulo: 'Float Label' }
  },
  {
    path: '/invalid-state',
    name: 'invalid-state',
    component: () => import('@/views/demos/InvalidStateView.vue'),
    meta: { titulo: 'Invalid State' }
  },
  {
    path: '/button',
    name: 'button',
    component: () => import('@/views/demos/ButtonView.vue'),
    meta: { titulo: 'Button' }
  },
  {
    path: '/table',
    name: 'table',
    component: () => import('@/views/demos/TableView.vue'),
    meta: { titulo: 'Table' }
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/demos/ListView.vue'),
    meta: { titulo: 'List' }
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import('@/views/demos/TreeView.vue'),
    meta: { titulo: 'Tree' }
  },
  {
    path: '/panel',
    name: 'panel',
    component: () => import('@/views/demos/PanelView.vue'),
    meta: { titulo: 'Panel' }
  },

  // La ruta anterior del módulo sigue funcionando
  { path: '/tarjeta/:id?', redirect: to => ({ name: 'tarjeta', params: to.params }) },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // Hash history (#/) para que las rutas funcionen en cualquier hospedaje
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = `${to.meta.titulo ?? 'Inicio'} · ${APP.titulo}`
})

export default router
