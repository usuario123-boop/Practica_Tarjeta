<script setup>
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { empleados, eliminarEmpleado } from '../store'

const router = useRouter()
const ver = (e) => router.push({ path: '/tarjeta', query: { rfc: e.rfc } })
const fecha = (f) => new Date(f).toLocaleDateString('es-MX')
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">Empleados con tarjeta</h2>
    <DataTable :value="empleados" paginator :rows="8" stripedRows dataKey="rfc">
      <template #empty>Aún no hay tarjetas generadas.</template>
      <Column header="Nombre">
        <template #body="{ data }">{{ data.nombre }} {{ data.paterno }} {{ data.materno }}</template>
      </Column>
      <Column field="rfc" header="RFC">
        <template #body="{ data }"><code>{{ data.rfc }}</code></template>
      </Column>
      <Column header="Nacimiento">
        <template #body="{ data }">{{ fecha(data.fechaNacimiento) }}</template>
      </Column>
      <Column header="Puesto">
        <template #body="{ data }"><Tag :value="data.puesto" /></template>
      </Column>
      <Column header="" style="width:120px">
        <template #body="{ data }">
          <Button icon="pi pi-eye" text rounded v-tooltip.top="'Ver tarjeta'" @click="ver(data)" />
          <Button icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Eliminar'" @click="eliminarEmpleado(data.rfc)" />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
