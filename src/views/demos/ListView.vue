<script setup>
import { ref } from 'vue'
import Listbox from 'primevue/listbox'
import DataView from 'primevue/dataview'
import OrderList from 'primevue/orderlist'
import PickList from 'primevue/picklist'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { CLIENTES, PRESTACIONES, aPesos, severidadEstado } from '@/constants/demo'

// Componentes de PrimeVue para mostrar colecciones
const empleado = ref(null)
const disposicion = ref('grid')

// OrderList y PickList modifican el arreglo: se usa una copia
const prestaciones = ref([...PRESTACIONES])
const asignacion = ref([[...PRESTACIONES.slice(0, 3)], [...PRESTACIONES.slice(3)]])

const iniciales = (nombre) => nombre.split(' ').slice(0, 2).map(p => p[0]).join('')
</script>

<template>
  <div class="grid">
    <div class="grid grid-2">
      <section class="panel">
        <h2 class="panel-titulo">Listbox</h2>
        <Listbox
          v-model="empleado"
          :options="CLIENTES"
          optionLabel="nombre"
          filter
          filterPlaceholder="Buscar empleado"
          listStyle="max-height: 260px"
          class="ancho"
        >
          <template #option="{ option }">
            <div class="opcion">
              <Avatar :label="iniciales(option.nombre)" shape="circle" class="avatar" />
              <div class="datos">
                <strong>{{ option.nombre }}</strong>
                <span class="texto-suave">{{ option.departamento }}</span>
              </div>
              <Tag :value="option.estado" :severity="severidadEstado(option.estado)" />
            </div>
          </template>
        </Listbox>
        <p class="nota texto-suave">
          Seleccionado: <b>{{ empleado ? empleado.nombre : 'ninguno' }}</b>
        </p>
      </section>

      <section class="panel">
        <h2 class="panel-titulo">OrderList</h2>
        <p class="texto-suave intro">
          Arrastra las prestaciones o usa los botones laterales para cambiar su prioridad.
        </p>
        <OrderList v-model="prestaciones" dataKey="valor" listStyle="height: 260px"
                   :striped="true" class="ancho">
          <template #option="{ option, index }">
            <div class="prestacion">
              <span class="indice">{{ index + 1 }}</span>
              {{ option }}
            </div>
          </template>
        </OrderList>
      </section>
    </div>

    <section class="panel">
      <div class="panel-encabezado">
        <h2 class="panel-titulo">DataView</h2>
        <div class="acciones">
          <Button icon="pi pi-th-large" :outlined="disposicion !== 'grid'"
                  aria-label="Ver en cuadrícula" v-tooltip.top="'Cuadrícula'"
                  @click="disposicion = 'grid'" />
          <Button icon="pi pi-bars" :outlined="disposicion !== 'list'"
                  aria-label="Ver en lista" v-tooltip.top="'Lista'"
                  @click="disposicion = 'list'" />
        </div>
      </div>

      <DataView :value="CLIENTES" :layout="disposicion" paginator :rows="4" dataKey="id">
        <template #list="{ items }">
          <ul class="lista-dv">
            <li v-for="item in items" :key="item.id">
              <Avatar :label="iniciales(item.nombre)" shape="circle" size="large" class="avatar" />
              <div class="datos">
                <strong>{{ item.nombre }}</strong>
                <span class="texto-suave">{{ item.departamento }} · {{ item.ciudad }}</span>
                <span class="monoespaciado rfc">{{ item.rfc }}</span>
              </div>
              <div class="derecha">
                <Tag :value="item.estado" :severity="severidadEstado(item.estado)" />
                <span class="saldo">{{ aPesos(item.saldo) }}</span>
              </div>
            </li>
          </ul>
        </template>

        <template #grid="{ items }">
          <div class="rejilla">
            <article v-for="item in items" :key="item.id" class="tarjeta-dv">
              <Avatar :label="iniciales(item.nombre)" shape="circle" size="large" class="avatar" />
              <strong>{{ item.nombre }}</strong>
              <span class="texto-suave">{{ item.departamento }}</span>
              <span class="monoespaciado rfc">{{ item.rfc }}</span>
              <Tag :value="item.estado" :severity="severidadEstado(item.estado)" />
              <span class="saldo">{{ aPesos(item.saldo) }}</span>
            </article>
          </div>
        </template>
      </DataView>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">PickList</h2>
      <p class="texto-suave intro">
        Mueve las prestaciones entre «Disponibles» y «Asignadas» con los botones centrales.
      </p>
      <PickList v-model="asignacion" dataKey="valor" listStyle="height: 240px"
                breakpoint="900px" class="ancho">
        <template #sourceheader>Disponibles</template>
        <template #targetheader>Asignadas</template>
        <template #option="{ option }">
          <div class="prestacion"><i class="pi pi-gift"></i> {{ option }}</div>
        </template>
      </PickList>
    </section>
  </div>
</template>

<style scoped>
.ancho { width: 100%; }
.intro { margin: -.5rem 0 1.25rem; line-height: 1.6; }
.nota { margin: .9rem 0 0; }
.avatar { background: #dbeafe; color: #1d4ed8; font-weight: 600; font-size: .8rem; }

.opcion { display: flex; align-items: center; gap: .75rem; width: 100%; }
.datos { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.datos strong { font-weight: 600; }
.datos span { font-size: .8rem; }
.rfc { font-size: .75rem !important; color: var(--color-texto-suave); }

.prestacion { display: flex; align-items: center; gap: .6rem; }
.indice {
  display: grid; place-items: center; width: 22px; height: 22px; flex-shrink: 0;
  background: #dbeafe; color: #1d4ed8; border-radius: 50%; font-size: .75rem; font-weight: 700;
}

.lista-dv { list-style: none; margin: 0; padding: 0; }
.lista-dv li {
  display: flex; align-items: center; gap: 1rem;
  padding: .9rem .5rem; border-bottom: 1px solid var(--color-borde);
}
.lista-dv li:last-child { border-bottom: 0; }
.derecha { display: flex; flex-direction: column; align-items: flex-end; gap: .35rem; }
.saldo { font-weight: 700; color: #1e293b; }

.rejilla { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.tarjeta-dv {
  display: flex; flex-direction: column; align-items: center; gap: .4rem;
  padding: 1.25rem 1rem; text-align: center;
  border: 1px solid var(--color-borde); border-radius: 10px;
}
.tarjeta-dv strong { font-size: .92rem; line-height: 1.3; }

@media (max-width: 1100px) { .rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) {
  .rejilla { grid-template-columns: 1fr; }
  .lista-dv li { flex-wrap: wrap; }
}
</style>
