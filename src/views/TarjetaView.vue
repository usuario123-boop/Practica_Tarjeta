<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import EmpleadoForm from '@/components/empleado/EmpleadoForm.vue'
import TarjetaDigital from '@/components/tarjeta/TarjetaDigital.vue'
import { useEmpleados } from '@/composables/useEmpleados'
import { useDescarga } from '@/composables/useDescarga'
import { nombreSeguro } from '@/utils/archivos'

const props = defineProps({
  id: { type: String, default: '' }
})

const router = useRouter()
const toast = useToast()
const { guardarEmpleado, buscarEmpleado } = useEmpleados()
const { descargando, descargarPNG, descargarPDF } = useDescarga()

const tarjeta = ref(null)
const empleado = ref(null)

// Si la URL trae un id (/tarjeta/abc123) se carga ese empleado
watch(() => props.id, (id) => {
  empleado.value = id ? buscarEmpleado(id) : null
  if (id && !empleado.value) {
    toast.add({ severity: 'warn', summary: 'No encontrado', detail: 'El empleado ya no existe', life: 3000 })
    router.replace({ name: 'tarjeta' })
  }
}, { immediate: true })

const titulo = computed(() => (empleado.value ? 'Editar empleado' : 'Generar el RFC de una persona'))
const nombreArchivo = computed(() =>
  empleado.value ? `tarjeta-${nombreSeguro(`${empleado.value.nombre} ${empleado.value.paterno}`)}-${empleado.value.rfc}` : 'tarjeta'
)

function guardar (datos) {
  const resultado = guardarEmpleado(datos)
  if (!resultado.ok) {
    toast.add({ severity: 'error', summary: 'No se guardó', detail: resultado.mensaje, life: 4000 })
    return
  }
  empleado.value = resultado.empleado
  toast.add({
    severity: 'success',
    summary: resultado.nuevo ? 'Tarjeta generada' : 'Cambios guardados',
    detail: `RFC: ${resultado.empleado.rfc}`,
    life: 3000
  })
  if (props.id !== resultado.empleado.id) {
    router.replace({ name: 'tarjeta', params: { id: resultado.empleado.id } })
  }
}

function nuevo () {
  empleado.value = null
  if (props.id) router.push({ name: 'tarjeta' })
}

async function descargar (tipo) {
  const elemento = tarjeta.value?.elemento
  if (!elemento) return
  const ok = tipo === 'pdf'
    ? await descargarPDF(elemento, nombreArchivo.value)
    : await descargarPNG(elemento, nombreArchivo.value)
  toast.add(ok
    ? { severity: 'success', summary: 'Descarga lista', detail: `Se descargó la tarjeta en ${tipo.toUpperCase()}`, life: 2500 }
    : { severity: 'error', summary: 'Error', detail: 'No se pudo descargar la tarjeta', life: 3500 })
}
</script>

<template>
  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-titulo">{{ titulo }}</h2>
      <EmpleadoForm :inicial="empleado" @guardar="guardar" @nuevo="nuevo" />
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Tarjeta digital</h2>
      <TarjetaDigital ref="tarjeta" :empleado="empleado || {}" />

      <div class="descargas">
        <template v-if="empleado">
          <Button label="Descargar PNG" icon="pi pi-image" :loading="descargando" @click="descargar('png')" />
          <Button label="Descargar PDF" icon="pi pi-file-pdf" severity="secondary" outlined :loading="descargando" @click="descargar('pdf')" />
        </template>
        <p v-else class="texto-suave">Llena el formulario y presiona <b>GENERAR</b>.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.descargas { display: flex; justify-content: center; gap: .75rem; flex-wrap: wrap; margin-top: 1.25rem; }
.descargas p { margin: 0; }
</style>
