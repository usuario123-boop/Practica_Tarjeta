<script setup>
import { reactive, ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Avatar from 'primevue/avatar'
import { PUESTOS, crearEmpleadoVacio } from '@/constants/empleado'
import { calcularRFC } from '@/utils/rfc'
import { validarEmpleado } from '@/utils/validaciones'
import { aFechaISO, deFechaISO } from '@/utils/fecha'
import { prepararFoto } from '@/utils/imagen'

// Formulario para capturar los datos del empleado.
// No guarda nada: solo valida y emite 'guardar' con los datos listos.
const props = defineProps({
  inicial: { type: Object, default: null }
})
const emit = defineEmits(['guardar', 'nuevo'])

const form = reactive(crearEmpleadoVacio())
const enviado = ref(false)
const errorFoto = ref('')
const inputFoto = ref(null)
const hoy = new Date()

// Carga los datos cuando se edita un empleado existente
watch(() => props.inicial, (empleado) => {
  Object.assign(form, crearEmpleadoVacio(), empleado ?? {})
  form.fechaNacimiento = deFechaISO(empleado?.fechaNacimiento)
  enviado.value = false
  errorFoto.value = ''
}, { immediate: true })

const rfc = computed(() => calcularRFC(form))
const errores = computed(() => validarEmpleado(form))
const esValido = computed(() => Object.keys(errores.value).length === 0)
const errorDe = (campo) => (enviado.value ? errores.value[campo] : '')
const editando = computed(() => Boolean(form.id))

async function seleccionarFoto (evento) {
  const archivo = evento.target.files?.[0]
  evento.target.value = ''
  if (!archivo) return
  errorFoto.value = ''
  try {
    form.foto = await prepararFoto(archivo)
  } catch (e) {
    errorFoto.value = e.message
  }
}

function enviar () {
  enviado.value = true
  if (!esValido.value) return
  emit('guardar', {
    ...form,
    nombre: form.nombre.trim(),
    paterno: form.paterno.trim(),
    materno: form.materno.trim(),
    puesto: form.puesto.trim(),
    fechaNacimiento: aFechaISO(form.fechaNacimiento),
    rfc: rfc.value
  })
}

function limpiar () {
  Object.assign(form, crearEmpleadoVacio())
  enviado.value = false
  errorFoto.value = ''
  emit('nuevo')
}
</script>

<template>
  <form novalidate @submit.prevent="enviar">
    <div class="campo">
      <label for="nombre">Nombre(s):</label>
      <InputText id="nombre" v-model="form.nombre" placeholder="Ej. Susana" maxlength="40" autocomplete="off" :invalid="!!errorDe('nombre')" />
      <small v-if="errorDe('nombre')" class="error">{{ errorDe('nombre') }}</small>
    </div>

    <div class="fila-campos">
      <div class="campo">
        <label for="paterno">Apellido Paterno:</label>
        <InputText id="paterno" v-model="form.paterno" placeholder="Ej. Rojas" maxlength="40" autocomplete="off" :invalid="!!errorDe('paterno')" />
        <small v-if="errorDe('paterno')" class="error">{{ errorDe('paterno') }}</small>
      </div>
      <div class="campo">
        <label for="materno">Apellido Materno:</label>
        <InputText id="materno" v-model="form.materno" placeholder="Ej. Mérida" maxlength="40" autocomplete="off" :invalid="!!errorDe('materno')" />
        <small v-if="errorDe('materno')" class="error">{{ errorDe('materno') }}</small>
      </div>
    </div>

    <div class="fila-campos">
      <div class="campo">
        <label for="fecha">Fecha Nacimiento:</label>
        <DatePicker
          v-model="form.fechaNacimiento"
          inputId="fecha"
          dateFormat="dd/mm/yy"
          placeholder="dd/mm/aaaa"
          showIcon
          iconDisplay="input"
          :maxDate="hoy"
          :invalid="!!errorDe('fechaNacimiento')"
        />
        <small v-if="errorDe('fechaNacimiento')" class="error">{{ errorDe('fechaNacimiento') }}</small>
      </div>
      <div class="campo">
        <label for="puesto">Puesto:</label>
        <Select v-model="form.puesto" inputId="puesto" :options="PUESTOS" placeholder="Selecciona el puesto" :invalid="!!errorDe('puesto')" />
        <small v-if="errorDe('puesto')" class="error">{{ errorDe('puesto') }}</small>
      </div>
    </div>

    <div class="campo">
      <label>Fotografía (opcional):</label>
      <div class="foto">
        <Avatar :image="form.foto || undefined" :icon="form.foto ? undefined : 'pi pi-user'" shape="circle" size="large" class="foto-avatar" />
        <input ref="inputFoto" type="file" accept="image/*" hidden @change="seleccionarFoto" />
        <Button type="button" :label="form.foto ? 'Cambiar foto' : 'Subir foto'" icon="pi pi-camera" severity="secondary" outlined size="small" @click="inputFoto.click()" />
        <Button v-if="form.foto" type="button" icon="pi pi-times" severity="danger" text rounded size="small" aria-label="Quitar foto" @click="form.foto = ''" />
      </div>
      <small v-if="errorFoto" class="error">{{ errorFoto }}</small>
    </div>

    <div class="campo">
      <label for="rfc">RFC:</label>
      <InputText id="rfc" :modelValue="rfc" readonly placeholder="Se calcula automáticamente" class="monoespaciado" />
      <small class="texto-suave">Con homoclave y dígito verificador (algoritmo del SAT).</small>
    </div>

    <Message v-if="enviado && !esValido" severity="error" size="small" class="mb">
      Revisa los campos marcados en rojo.
    </Message>

    <div class="acciones">
      <Button type="submit" :label="editando ? 'GUARDAR CAMBIOS' : 'GENERAR'" icon="pi pi-id-card" class="boton-exito boton-principal" />
      <Button type="button" label="Nuevo" icon="pi pi-plus" severity="secondary" outlined @click="limpiar" />
    </div>
  </form>
</template>

<style scoped>
.foto { display: flex; align-items: center; gap: .75rem; }
.foto-avatar { background: #e2e8f0; color: #0f2a5c; }
.foto-avatar :deep(img) { object-fit: cover; }
.boton-principal { min-width: 190px; }
</style>
