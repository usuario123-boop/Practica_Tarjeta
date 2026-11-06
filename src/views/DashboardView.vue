<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import StatCard from '@/components/dashboard/StatCard.vue'
import TarjetaDigital from '@/components/tarjeta/TarjetaDigital.vue'
import EmpleadoAvatar from '@/components/empleado/EmpleadoAvatar.vue'
import { useEmpleados } from '@/composables/useEmpleados'
import { EMPLEADO_EJEMPLO } from '@/constants/empleado'

const { empleados, estadisticas } = useEmpleados()

const recientes = computed(() => empleados.value.slice(0, 5))
const ultimo = computed(() => empleados.value[0] || null)

const indicadores = computed(() => [
  { titulo: 'Tarjetas generadas', valor: estadisticas.value.total, icono: 'pi pi-id-card', color: '#2563eb', fondo: '#dbeafe' },
  { titulo: 'Generadas hoy', valor: estadisticas.value.hoy, icono: 'pi pi-calendar', color: '#16a34a', fondo: '#dcfce7' },
  { titulo: 'Puestos distintos', valor: estadisticas.value.puestos, icono: 'pi pi-briefcase', color: '#9333ea', fondo: '#f3e8ff' },
  { titulo: 'Con fotografía', valor: estadisticas.value.conFoto, icono: 'pi pi-camera', color: '#ea580c', fondo: '#ffedd5' }
])
</script>

<template>
  <div class="grid grid-4 mb">
    <StatCard v-for="i in indicadores" :key="i.titulo" v-bind="i" />
  </div>

  <div class="grid grid-2">
    <div class="grid">
      <section class="panel">
        <h2 class="panel-titulo">Bienvenido</h2>
        <p class="intro">
          Este sistema genera la <b>tarjeta digital de un empleado</b>: calcula su RFC a partir del nombre y la
          fecha de nacimiento y crea una credencial con <b>código QR</b> y código de barras, que se puede
          descargar en PNG o PDF.
        </p>
        <ol class="pasos">
          <li>Entra al módulo <b>Tarjeta Digital</b>.</li>
          <li>Captura nombre, apellidos, fecha de nacimiento y puesto.</li>
          <li>Presiona <b>GENERAR</b> y descarga la tarjeta.</li>
        </ol>
        <div class="acciones">
          <RouterLink :to="{ name: 'tarjeta' }"><Button label="Generar tarjeta" icon="pi pi-plus" class="boton-exito" /></RouterLink>
          <RouterLink :to="{ name: 'empleados' }"><Button label="Ver empleados" icon="pi pi-users" outlined /></RouterLink>
        </div>
      </section>

      <section class="panel">
        <div class="panel-encabezado">
          <h2 class="panel-titulo">Registros recientes</h2>
          <RouterLink v-if="empleados.length" :to="{ name: 'empleados' }" class="enlace">Ver todos</RouterLink>
        </div>
        <ul v-if="recientes.length" class="lista">
          <li v-for="e in recientes" :key="e.id">
            <RouterLink :to="{ name: 'tarjeta', params: { id: e.id } }" class="fila">
              <EmpleadoAvatar :empleado="e" />
              <div class="info">
                <strong>{{ e.nombre }} {{ e.paterno }} {{ e.materno }}</strong>
                <span class="monoespaciado">{{ e.rfc }}</span>
              </div>
              <i class="pi pi-angle-right texto-suave"></i>
            </RouterLink>
          </li>
        </ul>
        <p v-else class="texto-suave">Todavía no hay tarjetas. ¡Genera la primera!</p>
      </section>
    </div>

    <section class="panel">
      <h2 class="panel-titulo">{{ ultimo ? 'Última tarjeta generada' : 'Tarjeta de ejemplo' }}</h2>
      <TarjetaDigital :empleado="ultimo || EMPLEADO_EJEMPLO" />
    </section>
  </div>
</template>

<style scoped>
.intro { margin-top: 0; line-height: 1.6; color: #475569; }
.pasos { padding-left: 1.2rem; line-height: 1.9; color: #475569; }
.enlace { color: #2563eb; font-weight: 500; }
.lista { list-style: none; margin: 0; padding: 0; }
.fila { display: flex; align-items: center; gap: .75rem; padding: .6rem .5rem; border-radius: 8px; }
.fila:hover { background: #f8fafc; }
.info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.info strong { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.info span { font-size: .8rem; color: var(--color-texto-suave); }
</style>
