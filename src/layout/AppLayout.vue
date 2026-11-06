<script setup>
import AppTopbar from './AppTopbar.vue'
import AppSidebar from './AppSidebar.vue'
import { APP } from '@/constants/app'
import { useLayout } from '@/composables/useLayout'

const { menuColapsado, menuMovilAbierto, cerrarMenuMovil } = useLayout()
</script>

<template>
  <div class="layout" :class="{ colapsado: menuColapsado, 'movil-abierto': menuMovilAbierto }">
    <AppTopbar />
    <AppSidebar />
    <div class="mascara" @click="cerrarMenuMovil"></div>

    <main class="contenido">
      <slot />
      <footer class="pie">{{ APP.escuela }} · UNACH · {{ APP.anio }}</footer>
    </main>
  </div>
</template>

<style scoped>
.contenido {
  min-height: 100vh;
  margin-left: calc(var(--ancho-sidebar) + 32px);
  padding: calc(var(--alto-topbar) + 16px) 1.5rem 1.5rem 0;
  transition: margin .25s ease;
}
.pie { margin-top: 1.5rem; text-align: center; font-size: .8rem; color: #94a3b8; }
.mascara { display: none; }

/* Escritorio: menú oculto */
.colapsado :deep(.sidebar) { transform: translateX(calc(-100% - 32px)); }
.colapsado .contenido { margin-left: 1.5rem; }

/* Móvil: menú flotante con fondo oscuro */
@media (max-width: 760px) {
  .contenido { margin-left: 0; padding: calc(var(--alto-topbar) + 12px) 1rem 1rem; }
  .colapsado .contenido { margin-left: 0; }
  .layout :deep(.sidebar) { transform: translateX(calc(-100% - 32px)); }
  .movil-abierto :deep(.sidebar) { transform: none; }
  .movil-abierto .mascara {
    display: block; position: fixed; inset: 0; z-index: 20; background: rgba(15, 23, 42, .4);
  }
}
</style>
