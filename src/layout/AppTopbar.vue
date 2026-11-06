<script setup>
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { APP } from '@/constants/app'
import { useLayout } from '@/composables/useLayout'

const { alternarMenu } = useLayout()
</script>

<template>
  <header class="topbar">
    <RouterLink to="/" class="marca">
      <i class="pi pi-building-columns" aria-hidden="true"></i>
      <div>
        <strong>{{ APP.titulo }}</strong>
        <span>{{ APP.subtitulo }}</span>
      </div>
    </RouterLink>

    <Button icon="pi pi-bars" text rounded severity="secondary" aria-label="Mostrar u ocultar menú" @click="alternarMenu" />

    <div class="espacio"></div>

    <div class="usuario">
      <span>{{ APP.autor }}</span>
      <Avatar icon="pi pi-user" shape="circle" class="avatar" />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: fixed; inset: 0 0 auto 0; height: var(--alto-topbar); z-index: 30;
  display: flex; align-items: center; gap: 1rem; padding: 0 1.5rem;
  background: var(--color-superficie); box-shadow: 0 2px 8px rgba(15, 23, 42, .06);
}
.marca { display: flex; align-items: center; gap: .75rem; width: calc(var(--ancho-sidebar) - 2px); }
.marca i { font-size: 1.9rem; color: #1e3a8a; }
.marca strong { display: block; font-size: 1.05rem; color: #1e293b; line-height: 1.1; }
.marca span { font-size: .8rem; color: var(--color-texto-suave); }
.espacio { flex: 1; }
.usuario { display: flex; align-items: center; gap: .6rem; color: #475569; font-weight: 500; }
.avatar { background: #dbeafe; color: #1d4ed8; }

@media (max-width: 760px) {
  .topbar { padding: 0 1rem; }
  .marca { width: auto; }
  .usuario span { display: none; }
}
</style>
