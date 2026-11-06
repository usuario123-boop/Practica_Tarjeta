<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import TarjetaDigital from '../components/TarjetaDigital.vue'
import { empleados } from '../store'

const ultimo = computed(() => empleados.value[0])
const hoy = computed(() => {
  const d = new Date().toDateString()
  return empleados.value.filter(e => new Date(e.creado).toDateString() === d).length
})

const tarjetas = computed(() => [
  { titulo: 'Tarjetas generadas', valor: empleados.value.length, icono: 'pi pi-id-card', color: '#2563eb', fondo: '#dbeafe' },
  { titulo: 'Generadas hoy', valor: hoy.value, icono: 'pi pi-calendar', color: '#16a34a', fondo: '#dcfce7' },
  { titulo: 'Códigos QR', valor: empleados.value.length, icono: 'pi pi-qrcode', color: '#9333ea', fondo: '#f3e8ff' },
  { titulo: 'Con fotografía', valor: empleados.value.filter(e => e.foto).length, icono: 'pi pi-camera', color: '#ea580c', fondo: '#ffedd5' }
])
</script>

<template>
  <div class="grid grid-4" style="margin-bottom:1.25rem">
    <div v-for="t in tarjetas" :key="t.titulo" class="panel stat">
      <div>
        <span class="stat-titulo">{{ t.titulo }}</span>
        <div class="stat-valor">{{ t.valor }}</div>
      </div>
      <div class="stat-icono" :style="{ background: t.fondo, color: t.color }"><i :class="t.icono"></i></div>
    </div>
  </div>

  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-title">Bienvenido</h2>
      <p style="line-height:1.6; color:#475569; margin-top:0">
        Este sistema genera la <b>tarjeta digital de un empleado</b>: calcula su RFC a partir del nombre y la fecha
        de nacimiento, y crea una credencial con <b>código QR</b> y código de barras que se puede descargar como imagen.
      </p>
      <ol style="line-height:1.9; color:#475569; padding-left:1.2rem">
        <li>Entra al módulo <b>Tarjeta Digital</b>.</li>
        <li>Captura nombre, apellidos y fecha de nacimiento.</li>
        <li>Presiona <b>GENERAR</b> y descarga la tarjeta.</li>
      </ol>
      <div style="display:flex; gap:.75rem; flex-wrap:wrap; margin-top:1rem">
        <RouterLink to="/tarjeta"><Button label="Generar tarjeta" icon="pi pi-plus" class="btn-generar" /></RouterLink>
        <RouterLink to="/empleados"><Button label="Ver empleados" icon="pi pi-users" outlined /></RouterLink>
      </div>
      <div class="tech">
        <span><i class="pi pi-code"></i> Vue 3</span>
        <span><i class="pi pi-prime"></i> PrimeVue 4</span>
        <span><i class="pi pi-qrcode"></i> qrcode.vue</span>
        <span><i class="pi pi-barcode"></i> JsBarcode</span>
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-title">{{ ultimo ? 'Última tarjeta generada' : 'Tarjeta de ejemplo' }}</h2>
      <TarjetaDigital :empleado="ultimo || { nombre: 'Susana', paterno: 'Rojas', materno: 'Merida', puesto: 'Empleada', rfc: 'ROMS920822JK7', fechaNacimiento: '1992-08-22T12:00:00' }" />
    </section>
  </div>
</template>

<style scoped>
.stat { display: flex; justify-content: space-between; align-items: center; }
.stat-titulo { color: #64748b; font-size: .85rem; font-weight: 500; }
.stat-valor { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-top: .25rem; }
.stat-icono { width: 48px; height: 48px; border-radius: 10px; display: grid; place-items: center; font-size: 1.3rem; }
.tech { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.5rem; }
.tech span { background: #f1f5f9; padding: .35rem .7rem; border-radius: 999px; font-size: .8rem; color: #475569; }
</style>
