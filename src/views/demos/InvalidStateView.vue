<script setup>
import { reactive, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'
import Password from 'primevue/password'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { DEPARTAMENTOS } from '@/constants/demo'

// Estado inválido: todos los componentes aceptan la propiedad :invalid,
// que los pinta de rojo cuando el dato capturado no es correcto.
const toast = useToast()
const enviado = ref(false)

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  sueldo: null,
  clave: '',
  departamento: null,
  areas: [],
  ingreso: null,
  motivo: '',
  acepta: false
})

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const errores = computed(() => {
  const e = {}
  if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
  else if (form.nombre.trim().length < 3) e.nombre = 'Debe tener al menos 3 letras'

  if (!form.correo.trim()) e.correo = 'El correo es obligatorio'
  else if (!CORREO.test(form.correo.trim())) e.correo = 'El formato del correo no es válido'

  if (!form.telefono || form.telefono.includes('_')) e.telefono = 'Captura los 10 dígitos'
  if (form.sueldo === null || form.sueldo === undefined) e.sueldo = 'Indica el sueldo mensual'
  else if (form.sueldo < 1000) e.sueldo = 'El sueldo debe ser mayor a $1,000'

  if (!form.clave) e.clave = 'La contraseña es obligatoria'
  else if (form.clave.length < 8) e.clave = 'Debe tener al menos 8 caracteres'

  if (!form.departamento) e.departamento = 'Selecciona un departamento'
  if (!form.areas.length) e.areas = 'Selecciona al menos un área'
  if (!form.ingreso) e.ingreso = 'Indica la fecha de ingreso'
  if (!form.motivo.trim()) e.motivo = 'Describe el motivo de la contratación'
  if (!form.acepta) e.acepta = 'Debes aceptar el aviso de privacidad'
  return e
})

const esValido = computed(() => Object.keys(errores.value).length === 0)
const errorDe = (campo) => (enviado.value ? errores.value[campo] : '')
const invalido = (campo) => Boolean(errorDe(campo))

function enviar () {
  enviado.value = true
  if (!esValido.value) {
    toast.add({
      severity: 'error',
      summary: 'Formulario incompleto',
      detail: `Faltan ${Object.keys(errores.value).length} campo(s) por corregir`,
      life: 3500
    })
    return
  }
  toast.add({ severity: 'success', summary: 'Validación correcta', detail: 'Todos los campos son válidos', life: 3000 })
}

function limpiar () {
  Object.assign(form, {
    nombre: '', correo: '', telefono: '', sueldo: null, clave: '',
    departamento: null, areas: [], ingreso: null, motivo: '', acepta: false
  })
  enviado.value = false
}
</script>

<template>
  <Message severity="warn" class="mb">
    Presiona <b>VALIDAR</b> con los campos vacíos: todos los componentes se marcarán en rojo
    mediante la propiedad <code>:invalid</code>.
  </Message>

  <form class="grid grid-2" novalidate @submit.prevent="enviar">
    <section class="panel">
      <h2 class="panel-titulo">Datos del empleado</h2>

      <div class="campo">
        <label for="iv-nombre">Nombre completo *</label>
        <InputText id="iv-nombre" v-model="form.nombre" :invalid="invalido('nombre')"
                   placeholder="Ej. Susana Rojas Mérida" />
        <small v-if="errorDe('nombre')" class="error">{{ errorDe('nombre') }}</small>
      </div>

      <div class="campo">
        <label for="iv-correo">Correo electrónico *</label>
        <InputText id="iv-correo" v-model="form.correo" :invalid="invalido('correo')"
                   placeholder="correo@unach.mx" />
        <small v-if="errorDe('correo')" class="error">{{ errorDe('correo') }}</small>
      </div>

      <div class="campo">
        <label for="iv-tel">Teléfono *</label>
        <InputMask id="iv-tel" v-model="form.telefono" mask="(999) 999-9999"
                   placeholder="(962) 123-4567" :invalid="invalido('telefono')" />
        <small v-if="errorDe('telefono')" class="error">{{ errorDe('telefono') }}</small>
      </div>

      <div class="campo">
        <label for="iv-sueldo">Sueldo mensual *</label>
        <InputNumber inputId="iv-sueldo" v-model="form.sueldo" mode="currency"
                     currency="MXN" locale="es-MX" :maxFractionDigits="0"
                     :invalid="invalido('sueldo')" />
        <small v-if="errorDe('sueldo')" class="error">{{ errorDe('sueldo') }}</small>
      </div>

      <div class="campo">
        <label for="iv-clave">Contraseña *</label>
        <Password inputId="iv-clave" v-model="form.clave" toggleMask :feedback="false"
                  :invalid="invalido('clave')" />
        <small v-if="errorDe('clave')" class="error">{{ errorDe('clave') }}</small>
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Asignación</h2>

      <div class="campo">
        <label for="iv-depto">Departamento *</label>
        <Select inputId="iv-depto" v-model="form.departamento" :options="DEPARTAMENTOS"
                placeholder="Selecciona" :invalid="invalido('departamento')" />
        <small v-if="errorDe('departamento')" class="error">{{ errorDe('departamento') }}</small>
      </div>

      <div class="campo">
        <label for="iv-areas">Áreas asignadas *</label>
        <MultiSelect inputId="iv-areas" v-model="form.areas" :options="DEPARTAMENTOS"
                     display="chip" placeholder="Selecciona una o varias"
                     :invalid="invalido('areas')" />
        <small v-if="errorDe('areas')" class="error">{{ errorDe('areas') }}</small>
      </div>

      <div class="campo">
        <label for="iv-fecha">Fecha de ingreso *</label>
        <DatePicker inputId="iv-fecha" v-model="form.ingreso" dateFormat="dd/mm/yy"
                    showIcon iconDisplay="input" placeholder="dd/mm/aaaa"
                    :invalid="invalido('ingreso')" />
        <small v-if="errorDe('ingreso')" class="error">{{ errorDe('ingreso') }}</small>
      </div>

      <div class="campo">
        <label for="iv-motivo">Motivo de la contratación *</label>
        <Textarea id="iv-motivo" v-model="form.motivo" rows="3" autoResize
                  :invalid="invalido('motivo')" placeholder="Describe brevemente..." />
        <small v-if="errorDe('motivo')" class="error">{{ errorDe('motivo') }}</small>
      </div>

      <div class="campo">
        <div class="opcion">
          <Checkbox v-model="form.acepta" inputId="iv-acepta" binary
                    :invalid="invalido('acepta')" />
          <label for="iv-acepta">Acepto el aviso de privacidad *</label>
        </div>
        <small v-if="errorDe('acepta')" class="error">{{ errorDe('acepta') }}</small>
      </div>

      <Message v-if="enviado && !esValido" severity="error" size="small" class="mb">
        Revisa los {{ Object.keys(errores).length }} campo(s) marcados en rojo.
      </Message>
      <Message v-else-if="enviado" severity="success" size="small" class="mb">
        Todos los campos son válidos.
      </Message>

      <div class="acciones">
        <Button type="submit" label="VALIDAR" icon="pi pi-check" class="boton-exito" />
        <Button type="button" label="Limpiar" icon="pi pi-refresh" severity="secondary"
                outlined @click="limpiar" />
      </div>
    </section>
  </form>
</template>

<style scoped>
.opcion { display: flex; align-items: center; gap: .5rem; }
.opcion label { font-weight: 400; color: #475569; cursor: pointer; }
code { padding: .1rem .35rem; background: #f1f5f9; border-radius: 4px; font-size: .85em; }
</style>
