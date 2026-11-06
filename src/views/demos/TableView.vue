<script setup>
import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Avatar from 'primevue/avatar'
import { CLIENTES, DEPARTAMENTOS, aPesos, severidadEstado } from '@/constants/demo'

// DataTable: búsqueda, filtros por columna, orden, paginación,
// selección múltiple, filas expandibles y pie con totales.
const ESTADOS = ['Activo', 'Vacaciones', 'Baja']

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  departamento: { value: null, matchMode: FilterMatchMode.EQUALS },
  estado: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const seleccion = ref([])
const expandidas = ref([])

const filas = computed(() => CLIENTES.map(c => ({
  ...c,
  iniciales: c.nombre.split(' ').slice(0, 2).map(p => p[0]).join('')
})))

const totalSaldo = computed(() => filas.value.reduce((s, c) => s + c.saldo, 0))

function limpiarFiltros () {
  filtros.value.global.value = null
  filtros.value.departamento.value = null
  filtros.value.estado.value = null
}
</script>

<template>
  <section class="panel">
    <div class="panel-encabezado">
      <h2 class="panel-titulo">DataTable</h2>
      <div class="acciones">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filtros.global.value" placeholder="Buscar en toda la tabla" />
        </IconField>
        <Button label="Limpiar filtros" icon="pi pi-filter-slash" severity="secondary"
                outlined @click="limpiarFiltros" />
      </div>
    </div>

    <p v-if="seleccion.length" class="aviso">
      <i class="pi pi-check-circle"></i>
      {{ seleccion.length }} registro(s) seleccionado(s).
    </p>

    <DataTable
      v-model:filters="filtros"
      v-model:selection="seleccion"
      v-model:expandedRows="expandidas"
      :value="filas"
      :globalFilterFields="['nombre', 'rfc', 'departamento', 'ciudad']"
      filterDisplay="menu"
      dataKey="id"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      stripedRows
      removableSort
      showGridlines
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      responsiveLayout="scroll"
    >
      <template #empty>
        <div class="vacio"><i class="pi pi-inbox"></i><p>Ningún registro coincide con el filtro.</p></div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column expander headerStyle="width: 3rem" />

      <Column field="nombre" header="Empleado" sortable>
        <template #body="{ data }">
          <div class="empleado">
            <Avatar :label="data.iniciales" shape="circle" class="avatar" />
            <span>{{ data.nombre }}</span>
          </div>
        </template>
      </Column>

      <Column field="rfc" header="RFC" sortable>
        <template #body="{ data }"><span class="monoespaciado">{{ data.rfc }}</span></template>
      </Column>

      <Column field="departamento" header="Departamento" sortable
              :showFilterMatchModes="false" filterField="departamento">
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" :options="DEPARTAMENTOS" placeholder="Todos"
                  showClear @change="filterCallback()" />
        </template>
      </Column>

      <Column field="antiguedad" header="Antigüedad" sortable>
        <template #body="{ data }">
          <div class="barra">
            <ProgressBar :value="Math.min(data.antiguedad * 100 / 15, 100)" :showValue="false" />
            <span>{{ data.antiguedad }} años</span>
          </div>
        </template>
      </Column>

      <Column field="estado" header="Estado" sortable :showFilterMatchModes="false">
        <template #body="{ data }">
          <Tag :value="data.estado" :severity="severidadEstado(data.estado)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" :options="ESTADOS" placeholder="Todos"
                  showClear @change="filterCallback()" />
        </template>
      </Column>

      <Column field="saldo" header="Saldo" sortable class="derecha">
        <template #body="{ data }">{{ aPesos(data.saldo) }}</template>
      </Column>

      <template #expansion="{ data }">
        <div class="detalle">
          <h4>Detalle de {{ data.nombre }}</h4>
          <ul>
            <li><b>RFC:</b> <span class="monoespaciado">{{ data.rfc }}</span></li>
            <li><b>Departamento:</b> {{ data.departamento }}</li>
            <li><b>Ciudad:</b> {{ data.ciudad }}</li>
            <li><b>Antigüedad:</b> {{ data.antiguedad }} años</li>
            <li><b>Saldo acumulado:</b> {{ aPesos(data.saldo) }}</li>
          </ul>
        </div>
      </template>

      <ColumnGroup type="footer">
        <Row>
          <Column footer="Total:" :colspan="7" footerStyle="text-align: right" />
          <Column :footer="aPesos(totalSaldo)" footerStyle="text-align: right" />
        </Row>
      </ColumnGroup>
    </DataTable>
  </section>
</template>

<style scoped>
.empleado { display: flex; align-items: center; gap: .65rem; font-weight: 500; }
.avatar { background: #dbeafe; color: #1d4ed8; font-weight: 600; font-size: .8rem; }
.barra { display: flex; align-items: center; gap: .6rem; min-width: 140px; }
.barra :deep(.p-progressbar) { flex: 1; height: 7px; }
.barra span { font-size: .8rem; color: var(--color-texto-suave); white-space: nowrap; }
:deep(.derecha) { text-align: right; }
.aviso { display: flex; align-items: center; gap: .5rem; margin: 0 0 1rem; color: #16a34a; font-weight: 500; }
.vacio { padding: 2rem; text-align: center; color: var(--color-texto-suave); }
.vacio i { font-size: 2rem; }
.detalle { padding: .5rem 1rem 1rem 3.5rem; background: #f8fafc; }
.detalle h4 { margin: .5rem 0; color: #1e293b; }
.detalle ul { margin: 0; padding-left: 1.1rem; line-height: 1.9; color: #475569; }
</style>
