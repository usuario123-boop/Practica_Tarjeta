<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'
import Password from 'primevue/password'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import AutoComplete from 'primevue/autocomplete'
import DatePicker from 'primevue/datepicker'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import ToggleSwitch from 'primevue/toggleswitch'
import Slider from 'primevue/slider'
import Rating from 'primevue/rating'
import Knob from 'primevue/knob'
import { CIUDADES, DEPARTAMENTOS } from '@/constants/demo'

// Muestra los componentes de captura de datos de PrimeVue
const texto = ref('Susana Rojas')
const numero = ref(18450)
const telefono = ref('')
const contrasena = ref('')
const comentario = ref('')
const departamento = ref(DEPARTAMENTOS[0])
const departamentosElegidos = ref([DEPARTAMENTOS[0], DEPARTAMENTOS[1]])
const ciudad = ref('')
const sugerencias = ref([])
const fecha = ref(null)
const turnos = ref(['Matutino'])
const contrato = ref('Indefinido')
const activo = ref(true)
const porcentaje = ref(60)
const calificacion = ref(4)
const avance = ref(75)

function buscarCiudad (evento) {
  const texto = evento.query.toLowerCase()
  sugerencias.value = CIUDADES
    .map(c => c.nombre)
    .filter(n => n.toLowerCase().includes(texto))
}
</script>

<template>
  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-titulo">Campos de texto</h2>

      <div class="campo">
        <label for="d-texto">InputText</label>
        <InputText id="d-texto" v-model="texto" placeholder="Nombre completo" />
        <small class="texto-suave">Valor: {{ texto || '(vacío)' }}</small>
      </div>

      <div class="campo">
        <label for="d-numero">InputNumber (moneda)</label>
        <InputNumber
          id="d-numero"
          v-model="numero"
          mode="currency"
          currency="MXN"
          locale="es-MX"
          :maxFractionDigits="0"
        />
      </div>

      <div class="campo">
        <label for="d-tel">InputMask (teléfono)</label>
        <InputMask id="d-tel" v-model="telefono" mask="(999) 999-9999" placeholder="(962) 123-4567" />
      </div>

      <div class="campo">
        <label for="d-pass">Password (con medidor)</label>
        <Password id="d-pass" v-model="contrasena" toggleMask :feedback="true"
                  promptLabel="Escribe una contraseña" weakLabel="Débil"
                  mediumLabel="Media" strongLabel="Fuerte" />
      </div>

      <div class="campo">
        <label for="d-area">Textarea</label>
        <Textarea id="d-area" v-model="comentario" rows="3" autoResize
                  placeholder="Observaciones del empleado..." />
      </div>

      <div class="campo">
        <label>InputGroup</label>
        <InputGroup>
          <InputGroupAddon><i class="pi pi-at"></i></InputGroupAddon>
          <InputText placeholder="correo@unach.mx" />
          <InputGroupAddon>.mx</InputGroupAddon>
        </InputGroup>
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Selección y rangos</h2>

      <div class="campo">
        <label for="d-select">Select</label>
        <Select id="d-select" v-model="departamento" :options="DEPARTAMENTOS"
                placeholder="Elige un departamento" />
      </div>

      <div class="campo">
        <label for="d-multi">MultiSelect</label>
        <MultiSelect id="d-multi" v-model="departamentosElegidos" :options="DEPARTAMENTOS"
                     display="chip" placeholder="Elige uno o varios" />
      </div>

      <div class="campo">
        <label for="d-auto">AutoComplete</label>
        <AutoComplete id="d-auto" v-model="ciudad" :suggestions="sugerencias"
                      placeholder="Escribe una ciudad" dropdown
                      @complete="buscarCiudad" />
      </div>

      <div class="campo">
        <label for="d-fecha">DatePicker</label>
        <DatePicker inputId="d-fecha" v-model="fecha" dateFormat="dd/mm/yy"
                    showIcon iconDisplay="input" placeholder="dd/mm/aaaa" />
      </div>

      <div class="campo">
        <label>Checkbox</label>
        <div class="opciones">
          <div v-for="t in ['Matutino', 'Vespertino', 'Nocturno']" :key="t" class="opcion">
            <Checkbox v-model="turnos" :inputId="`t-${t}`" :value="t" />
            <label :for="`t-${t}`">{{ t }}</label>
          </div>
        </div>
      </div>

      <div class="campo">
        <label>RadioButton</label>
        <div class="opciones">
          <div v-for="c in ['Indefinido', 'Temporal', 'Por obra']" :key="c" class="opcion">
            <RadioButton v-model="contrato" :inputId="`c-${c}`" :value="c" />
            <label :for="`c-${c}`">{{ c }}</label>
          </div>
        </div>
      </div>

      <div class="campo">
        <label>ToggleSwitch</label>
        <div class="opcion">
          <ToggleSwitch v-model="activo" inputId="d-activo" />
          <label for="d-activo">{{ activo ? 'Empleado activo' : 'Empleado dado de baja' }}</label>
        </div>
      </div>

      <div class="campo">
        <label>Slider — {{ porcentaje }} %</label>
        <Slider v-model="porcentaje" class="slider" />
      </div>

      <div class="fila-campos">
        <div class="campo">
          <label>Rating</label>
          <Rating v-model="calificacion" />
        </div>
        <div class="campo">
          <label>Knob</label>
          <Knob v-model="avance" :size="90" valueTemplate="{value}%" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.opciones { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.opcion { display: flex; align-items: center; gap: .5rem; }
.opcion label { font-weight: 400; color: #475569; cursor: pointer; }
.slider { margin: .9rem .25rem 0; }
</style>
