<script setup>
// Tarjeta pequeña de estadística para el Dashboard
defineProps({
  titulo: { type: String, required: true },
  valor: { type: [Number, String], required: true },
  icono: { type: String, required: true },
  color: { type: String, default: '#2563eb' },
  fondo: { type: String, default: '#dbeafe' }
})
</script>

<template>
  <div class="panel stat">
    <div>
      <span class="titulo">{{ titulo }}</span>
      <div class="valor">{{ valor }}</div>
    </div>
    <div class="icono" :style="{ background: fondo, color }" aria-hidden="true">
      <i :class="icono"></i>
    </div>
  </div>
</template>

<style scoped>
.stat { display: flex; justify-content: space-between; align-items: center; }
.titulo { font-size: .85rem; font-weight: 500; color: var(--color-texto-suave); }
.valor { margin-top: .25rem; font-size: 1.8rem; font-weight: 700; color: #1e293b; }
.icono { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 10px; font-size: 1.3rem; }
</style>
