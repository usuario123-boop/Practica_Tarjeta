<script setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import IftaLabel from 'primevue/iftalabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import Message from 'primevue/message'
import { DEPARTAMENTOS } from '@/constants/demo'

// FloatLabel: la etiqueta vive dentro del campo y se mueve al escribir.
// Tiene tres variantes (over, in, on) y además existe IftaLabel.
const nombre = ref('')
const puesto = ref('')
const correo = ref('')
const sueldo = ref(null)
const clave = ref('')
const notas = ref('')
const departamento = ref(null)
const areas = ref([])
const ingreso = ref(null)
</script>

<template>
  <Message severity="info" class="mb">
    Haz clic en cualquier campo: la etiqueta se desplaza para dejar ver lo que escribes.
  </Message>

  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-titulo">Variante «over» (la predeterminada)</h2>
      <p class="texto-suave intro">La etiqueta sube por encima del borde del campo.</p>

      <div class="campo">
        <FloatLabel>
          <InputText id="fl-nombre" v-model="nombre" class="ancho" />
          <label for="fl-nombre">Nombre(s)</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel>
          <Select inputId="fl-depto" v-model="departamento" :options="DEPARTAMENTOS" class="ancho" />
          <label for="fl-depto">Departamento</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel>
          <DatePicker inputId="fl-fecha" v-model="ingreso" dateFormat="dd/mm/yy" class="ancho" />
          <label for="fl-fecha">Fecha de ingreso</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel>
          <MultiSelect inputId="fl-areas" v-model="areas" :options="DEPARTAMENTOS"
                       display="chip" class="ancho" />
          <label for="fl-areas">Áreas asignadas</label>
        </FloatLabel>
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Variantes «in» y «on»</h2>
      <p class="texto-suave intro">
        Con <b>in</b> la etiqueta se queda dentro del campo; con <b>on</b> se coloca
        justo sobre el borde.
      </p>

      <div class="campo">
        <FloatLabel variant="in">
          <InputText id="fl-puesto" v-model="puesto" class="ancho" />
          <label for="fl-puesto">Puesto (variant="in")</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel variant="in">
          <InputNumber inputId="fl-sueldo" v-model="sueldo" mode="currency"
                       currency="MXN" locale="es-MX" class="ancho" />
          <label for="fl-sueldo">Sueldo mensual (variant="in")</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel variant="on">
          <InputText id="fl-correo" v-model="correo" class="ancho" />
          <label for="fl-correo">Correo electrónico (variant="on")</label>
        </FloatLabel>
      </div>

      <div class="campo">
        <FloatLabel variant="on">
          <Password inputId="fl-clave" v-model="clave" toggleMask :feedback="false"
                    class="ancho" />
          <label for="fl-clave">Contraseña (variant="on")</label>
        </FloatLabel>
      </div>

      <h2 class="panel-titulo separador">IftaLabel</h2>
      <p class="texto-suave intro">
        La etiqueta permanece siempre visible, en pequeño, dentro del campo.
      </p>

      <div class="campo">
        <IftaLabel>
          <Textarea id="fl-notas" v-model="notas" rows="3" autoResize class="ancho" />
          <label for="fl-notas">Observaciones</label>
        </IftaLabel>
      </div>
    </section>
  </div>
</template>

<style scoped>
.intro { margin: -.5rem 0 1.25rem; line-height: 1.6; }
.separador { margin-top: 2rem; }
/* Los campos de PrimeVue deben ocupar todo el ancho del contenedor */
.ancho { width: 100%; }
.ancho :deep(input) { width: 100%; }
</style>
