<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import { useEmpleados } from '@/composables/useEmpleados'
import { calcularEdad, esMismoDia } from '@/utils/fecha'

// Cada gráfica tiene una sola serie, por eso usa un solo color y no lleva leyenda
const COLOR = '#2a78d6'
const COLOR_TEXTO = '#64748b'
const COLOR_REJILLA = '#eef2f7'
const RANGOS_EDAD = [
  { etiqueta: '15-25', min: 15, max: 25 },
  { etiqueta: '26-35', min: 26, max: 35 },
  { etiqueta: '36-45', min: 36, max: 45 },
  { etiqueta: '46-60', min: 46, max: 60 },
  { etiqueta: '60+', min: 61, max: 200 }
]

const { empleados } = useEmpleados()

const conjunto = (etiquetas, valores, nombre) => ({
  labels: etiquetas,
  datasets: [{
    label: nombre,
    data: valores,
    backgroundColor: COLOR,
    borderRadius: 4,
    borderSkipped: 'start',
    maxBarThickness: 36
  }]
})

const porPuesto = computed(() => {
  const conteo = {}
  empleados.value.forEach(e => { conteo[e.puesto] = (conteo[e.puesto] || 0) + 1 })
  const orden = Object.entries(conteo).sort((a, b) => b[1] - a[1])
  return conjunto(orden.map(o => o[0]), orden.map(o => o[1]), 'Empleados')
})

const porEdad = computed(() => {
  const edades = empleados.value.map(e => calcularEdad(e.fechaNacimiento))
  const valores = RANGOS_EDAD.map(r => edades.filter(x => x >= r.min && x <= r.max).length)
  return conjunto(RANGOS_EDAD.map(r => r.etiqueta), valores, 'Empleados')
})

const ultimos7Dias = computed(() => {
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const etiquetas = dias.map(d => d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }))
  const valores = dias.map(d => empleados.value.filter(e => esMismoDia(e.creado, d)).length)
  return conjunto(etiquetas, valores, 'Tarjetas')
})

const opciones = (horizontal = false) => ({
  indexAxis: horizontal ? 'y' : 'x',
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: COLOR_TEXTO, precision: 0 },
      grid: { display: horizontal, color: COLOR_REJILLA },
      border: { display: false },
      beginAtZero: true
    },
    y: {
      ticks: { color: COLOR_TEXTO, precision: 0 },
      grid: { display: !horizontal, color: COLOR_REJILLA },
      border: { display: false },
      beginAtZero: true
    }
  }
})
</script>

<template>
  <section v-if="!empleados.length" class="panel vacio">
    <i class="pi pi-chart-bar"></i>
    <h2>Aún no hay datos para graficar</h2>
    <p class="texto-suave">Las gráficas se generan con los empleados registrados.</p>
    <RouterLink :to="{ name: 'tarjeta' }"><Button label="Generar una tarjeta" icon="pi pi-plus" class="boton-exito" /></RouterLink>
  </section>

  <div v-else class="grid grid-graficas">
    <section class="panel">
      <h2 class="panel-titulo">Empleados por puesto</h2>
      <Chart type="bar" :data="porPuesto" :options="opciones(true)" class="grafica" />
    </section>
    <section class="panel">
      <h2 class="panel-titulo">Empleados por rango de edad</h2>
      <Chart type="bar" :data="porEdad" :options="opciones()" class="grafica" />
    </section>
    <section class="panel ancho">
      <h2 class="panel-titulo">Tarjetas generadas · últimos 7 días</h2>
      <Chart type="bar" :data="ultimos7Dias" :options="opciones()" class="grafica" />
    </section>
  </div>
</template>

<style scoped>
.grid-graficas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ancho { grid-column: 1 / -1; }
.grafica { height: 280px; }
.vacio { padding: 3rem 1.5rem; text-align: center; }
.vacio i { font-size: 2.5rem; color: #94a3b8; }
.vacio h2 { margin: .75rem 0 .25rem; font-size: 1.15rem; }
@media (max-width: 1100px) { .grid-graficas { grid-template-columns: 1fr; } }
</style>
