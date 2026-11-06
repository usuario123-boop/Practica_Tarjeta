<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { toPng } from 'html-to-image'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import TarjetaDigital from '../components/TarjetaDigital.vue'
import { calcularRFC } from '../utils/rfc'
import { empleados, guardarEmpleado } from '../store'

const toast = useToast()
const route = useRoute()

const puestos = ['Empleado', 'Empleada', 'Desarrollador(a)', 'Analista', 'Diseñador(a)', 'Gerente', 'Soporte Técnico']

const form = reactive({
  nombre: '', paterno: '', materno: '', fechaNacimiento: null, puesto: 'Empleado', foto: '', empresa: 'TECH SOLUTIONS'
})

// Si viene desde la lista de empleados (?rfc=...), se carga el registro
if (route.query.rfc) {
  const e = empleados.value.find(x => x.rfc === route.query.rfc)
  if (e) Object.assign(form, { ...e, fechaNacimiento: new Date(e.fechaNacimiento) })
}

const enviado = ref(false)
const generado = ref(route.query.rfc ? { ...form, rfc: route.query.rfc } : null)
const tarjetaRef = ref(null)

// El RFC se calcula automáticamente mientras se escribe
const rfc = computed(() => calcularRFC(form))

const errores = computed(() => ({
  nombre: !form.nombre.trim() ? 'El nombre es obligatorio' : '',
  paterno: !form.paterno.trim() ? 'El apellido paterno es obligatorio' : '',
  fechaNacimiento: !form.fechaNacimiento ? 'Selecciona la fecha de nacimiento' : ''
}))
const valido = computed(() => !Object.values(errores.value).some(Boolean))

const cargarFoto = (ev) => {
  const archivo = ev.target.files?.[0]
  if (!archivo) return
  const lector = new FileReader()
  lector.onload = () => { form.foto = lector.result }
  lector.readAsDataURL(archivo)
}

const generar = () => {
  enviado.value = true
  if (!valido.value) {
    toast.add({ severity: 'warn', summary: 'Datos incompletos', detail: 'Revisa los campos marcados', life: 3000 })
    return
  }
  generado.value = { ...form, rfc: rfc.value, fechaNacimiento: form.fechaNacimiento.toISOString() }
  guardarEmpleado({ ...generado.value, creado: new Date().toISOString() })
  toast.add({ severity: 'success', summary: 'Tarjeta generada', detail: `RFC: ${rfc.value}`, life: 3000 })
}

const limpiar = () => {
  Object.assign(form, { nombre: '', paterno: '', materno: '', fechaNacimiento: null, puesto: 'Empleado', foto: '' })
  enviado.value = false
  generado.value = null
}

const descargar = async () => {
  try {
    const url = await toPng(tarjetaRef.value.tarjeta, { pixelRatio: 3 })
    const a = document.createElement('a')
    a.href = url
    a.download = `tarjeta-${generado.value.rfc}.png`
    a.click()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar la imagen', life: 3000 })
  }
}
</script>

<template>
  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-title">Generar el RFC de una persona</h2>

      <div class="field">
        <label for="nombre">Nombre(s):</label>
        <InputText id="nombre" v-model="form.nombre" placeholder="Ej. Susana" :invalid="enviado && !!errores.nombre" />
        <small v-if="enviado && errores.nombre" class="error">{{ errores.nombre }}</small>
      </div>

      <div class="fila">
        <div class="field">
          <label for="paterno">Apellido Paterno:</label>
          <InputText id="paterno" v-model="form.paterno" placeholder="Ej. Rojas" :invalid="enviado && !!errores.paterno" />
          <small v-if="enviado && errores.paterno" class="error">{{ errores.paterno }}</small>
        </div>
        <div class="field">
          <label for="materno">Apellido Materno:</label>
          <InputText id="materno" v-model="form.materno" placeholder="Ej. Mérida" />
        </div>
      </div>

      <div class="fila">
        <div class="field">
          <label for="fecha">Fecha Nacimiento:</label>
          <DatePicker id="fecha" v-model="form.fechaNacimiento" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
            :maxDate="new Date()" placeholder="dd/mm/aaaa" :invalid="enviado && !!errores.fechaNacimiento" />
          <small v-if="enviado && errores.fechaNacimiento" class="error">{{ errores.fechaNacimiento }}</small>
        </div>
        <div class="field">
          <label for="puesto">Puesto:</label>
          <Select id="puesto" v-model="form.puesto" :options="puestos" editable placeholder="Selecciona" />
        </div>
      </div>

      <div class="field">
        <label for="foto">Fotografía (opcional):</label>
        <input id="foto" type="file" accept="image/*" @change="cargarFoto" />
      </div>

      <div class="field">
        <label for="rfc">RFC:</label>
        <InputText id="rfc" :modelValue="rfc" readonly class="rfc-input" placeholder="Se calcula automáticamente" />
      </div>

      <Message severity="info" size="small" variant="simple" style="margin-bottom:1rem">
        El RFC incluye homoclave y dígito verificador calculados con el algoritmo del SAT.
      </Message>

      <div style="display:flex; gap:.75rem; flex-wrap:wrap">
        <Button label="GENERAR" icon="pi pi-id-card" class="btn-generar" style="min-width:180px" @click="generar" />
        <Button label="Limpiar" icon="pi pi-eraser" severity="secondary" outlined @click="limpiar" />
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-title">Tarjeta digital</h2>
      <TarjetaDigital ref="tarjetaRef" :empleado="generado || { puesto: 'Empleado' }" />
      <div style="text-align:center; margin-top:1.25rem">
        <Button v-if="generado" label="Descargar PNG" icon="pi pi-download" text @click="descargar" />
        <p v-else style="color:#94a3b8; margin:0">Llena el formulario y presiona <b>GENERAR</b>.</p>
      </div>
    </section>
  </div>
</template>
