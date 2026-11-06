<script setup>
import { MENU } from '@/config/menu'
import { useLayout } from '@/composables/useLayout'

const { cerrarMenuMovil } = useLayout()
</script>

<template>
  <aside class="sidebar">
    <nav v-for="seccion in MENU" :key="seccion.titulo" :aria-label="seccion.titulo">
      <h6>{{ seccion.titulo }}</h6>
      <RouterLink
        v-for="item in seccion.items"
        :key="item.to"
        :to="item.to"
        class="item"
        active-class="activo"
        @click="cerrarMenuMovil"
      >
        <i :class="item.icon" aria-hidden="true"></i>
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed; top: calc(var(--alto-topbar) + 16px); left: 16px; bottom: 16px; z-index: 25;
  width: var(--ancho-sidebar); padding: 1rem .75rem; overflow-y: auto;
  background: var(--color-superficie); border-radius: var(--radio); box-shadow: var(--sombra);
  transition: transform .25s ease;
}
h6 {
  margin: .75rem .75rem .5rem; font-size: .7rem; font-weight: 700;
  letter-spacing: .04em; text-transform: uppercase; color: #334155;
}
.item {
  display: flex; align-items: center; gap: .75rem; margin-bottom: 2px;
  padding: .65rem .75rem; border-radius: 8px; font-weight: 500; color: #475569;
  transition: background .15s;
}
.item:hover { background: #f1f5f9; }
.item.activo { color: #2563eb; background: #eff6ff; }
</style>
