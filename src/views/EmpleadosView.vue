<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import EmpleadoAvatar from '@/components/empleado/EmpleadoAvatar.vue'
import { useEmpleados } from '@/composables/useEmpleados'
import { formatearFecha, calcularEdad } from '@/utils/fecha'
import { exportarCSV } from '@/utils/archivos'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { empleados, eliminarEmpleado } = useEmpleados()

const filtros = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })

// Filas con campos calculados para mostrar, ordenar y buscar
const filas = computed(() => empleados.value.map(e => ({
  ...e,
  nombreCompleto: `${e.nombre} ${e.paterno} ${e.materno || ''}`.trim(),
  edad: calcularEdad(e.fechaNacimiento),
  nacimiento: formatearFecha(e.fechaNacimiento),
  registro: formatearFecha(e.creado)
})))

const abrir = (empleado) => router.push({ name: 'tarjeta', params: { id: empleado.id } })

function confirmarEliminar (empleado) {
  confirm.require({
    header: 'Eliminar empleado',
    message: `¿Eliminar la tarjeta de ${empleado.nombreCompleto}?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Eliminar', severity: 'danger' },
    accept: () => {
      eliminarEmpleado(empleado.id)
      toast.add({ severity: 'info', summary: 'Eliminado', detail: empleado.nombreCompleto, life: 2500 })
    }
  })
}

function exportar () {
  exportarCSV(filas.value, [
    { campo: 'nombre', titulo: 'Nombre' },
    { campo: 'paterno', titulo: 'Apellido paterno' },
    { campo: 'materno', titulo: 'Apellido materno' },
    { campo: 'nacimiento', titulo: 'Fecha de nacimiento' },
    { campo: 'edad', titulo: 'Edad' },
    { campo: 'rfc', titulo: 'RFC' },
    { campo: 'puesto', titulo: 'Puesto' },
    { campo: 'registro', titulo: 'Fecha de registro' }
  ], 'empleados.csv')
}
</script>

<template>
  <section class="panel">
    <div class="panel-encabezado">
      <h2 class="panel-titulo">Empleados con tarjeta</h2>
      <div class="acciones">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filtros.global.value" placeholder="Buscar nombre, RFC o puesto" />
        </IconField>
        <Button label="Exportar CSV" icon="pi pi-file-excel" severity="secondary" outlined :disabled="!filas.length" @click="exportar" />
        <Button label="Nueva tarjeta" icon="pi pi-plus" class="boton-exito" @click="router.push({ name: 'tarjeta' })" />
      </div>
    </div>

    <DataTable
      v-model:filters="filtros"
      :value="filas"
      :globalFilterFields="['nombreCompleto', 'rfc', 'puesto']"
      dataKey="id"
      paginator
      :rows="8"
      stripedRows
      sortField="creado"
      :sortOrder="-1"
      responsiveLayout="scroll"
      @row-click="abrir($event.data)"
      class="tabla"
    >
      <template #empty>
        <div class="vacio">
          <i class="pi pi-id-card"></i>
          <p>No hay tarjetas que mostrar.</p>
        </div>
      </template>

      <Column header="Empleado" field="nombreCompleto" sortable>
        <template #body="{ data }">
          <div class="empleado">
            <EmpleadoAvatar :empleado="data" />
            <span>{{ data.nombreCompleto }}</span>
          </div>
        </template>
      </Column>
      <Column header="RFC" field="rfc" sortable>
        <template #body="{ data }"><span class="monoespaciado">{{ data.rfc }}</span></template>
      </Column>
      <Column header="Nacimiento" field="fechaNacimiento" sortable>
        <template #body="{ data }">{{ data.nacimiento }} <span class="texto-suave">({{ data.edad }} años)</span></template>
      </Column>
      <Column header="Puesto" field="puesto" sortable>
        <template #body="{ data }"><Tag :value="data.puesto" severity="info" /></template>
      </Column>
      <Column header="Registro" field="creado" sortable>
        <template #body="{ data }">{{ data.registro }}</template>
      </Column>
      <Column header="Acciones" class="col-acciones">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" text rounded aria-label="Ver y editar" v-tooltip.top="'Ver / editar'" @click.stop="abrir(data)" />
          <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click.stop="confirmarEliminar(data)" />
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<style scoped>
.tabla :deep(tbody tr) { cursor: pointer; }
.empleado { display: flex; align-items: center; gap: .65rem; font-weight: 500; }
.vacio { padding: 2rem; text-align: center; color: var(--color-texto-suave); }
.vacio i { font-size: 2rem; }
:deep(.col-acciones) { width: 120px; white-space: nowrap; }
</style>
