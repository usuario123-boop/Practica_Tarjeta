<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar'

// Muestra la foto del empleado o sus iniciales
const props = defineProps({
  empleado: { type: Object, required: true },
  size: { type: String, default: 'normal' }
})

const iniciales = computed(() =>
  ((props.empleado.nombre?.[0] || '') + (props.empleado.paterno?.[0] || '')).toUpperCase()
)
</script>

<template>
  <Avatar v-if="empleado.foto" :image="empleado.foto" shape="circle" :size="size" class="avatar-foto" />
  <Avatar v-else :label="iniciales" shape="circle" :size="size" class="avatar-iniciales" />
</template>

<style scoped>
.avatar-foto :deep(img) { object-fit: cover; }
.avatar-iniciales { background: #dbeafe; color: #1d4ed8; font-weight: 600; }
</style>
