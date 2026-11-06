<script setup>
import { ref, computed } from 'vue'
import Tree from 'primevue/tree'
import TreeTable from 'primevue/treetable'
import TreeSelect from 'primevue/treeselect'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ORGANIGRAMA, ORGANIGRAMA_TABLA } from '@/constants/demo'

// Tree, TreeTable y TreeSelect muestran datos jerárquicos (el organigrama)
const expandidos = ref({ 0: true, '0-0': true })
const seleccionados = ref({})
const seleccionSimple = ref(null)
const areaElegida = ref(null)
const filtro = ref('')

const nombresSeleccionados = computed(() =>
  Object.keys(seleccionados.value).filter(k => seleccionados.value[k].checked)
)

function expandirTodo () {
  const estado = {}
  const recorrer = (nodos) => nodos.forEach(n => {
    if (n.children?.length) {
      estado[n.key] = true
      recorrer(n.children)
    }
  })
  recorrer(ORGANIGRAMA)
  expandidos.value = estado
}

const contraerTodo = () => { expandidos.value = {} }
</script>

<template>
  <div class="grid">
    <div class="grid grid-2">
      <section class="panel">
        <div class="panel-encabezado">
          <h2 class="panel-titulo">Tree</h2>
          <div class="acciones">
            <Button label="Expandir" icon="pi pi-plus" size="small" severity="secondary"
                    outlined @click="expandirTodo" />
            <Button label="Contraer" icon="pi pi-minus" size="small" severity="secondary"
                    outlined @click="contraerTodo" />
          </div>
        </div>

        <Tree
          v-model:expandedKeys="expandidos"
          v-model:selectionKeys="seleccionados"
          :value="ORGANIGRAMA"
          selectionMode="checkbox"
          filter
          filterMode="lenient"
          filterPlaceholder="Buscar en el organigrama"
          class="ancho"
        />

        <Message v-if="nombresSeleccionados.length" severity="success" size="small" class="nota">
          {{ nombresSeleccionados.length }} nodo(s) seleccionado(s).
        </Message>
        <p v-else class="nota texto-suave">Marca las casillas para seleccionar áreas o personas.</p>
      </section>

      <section class="panel">
        <h2 class="panel-titulo">Tree con selección simple</h2>
        <Tree
          v-model:selectionKeys="seleccionSimple"
          :value="ORGANIGRAMA"
          selectionMode="single"
          class="ancho"
        />

        <h2 class="panel-titulo separador">TreeSelect</h2>
        <p class="texto-suave intro">Un desplegable que contiene el mismo árbol.</p>
        <TreeSelect
          v-model="areaElegida"
          :options="ORGANIGRAMA"
          placeholder="Selecciona un área"
          class="ancho"
        />
      </section>
    </div>

    <section class="panel">
      <h2 class="panel-titulo">TreeTable</h2>
      <p class="texto-suave intro">
        Combina la jerarquía del árbol con las columnas de una tabla.
      </p>
      <TreeTable
        :value="ORGANIGRAMA_TABLA"
        :filters="filtro ? { area: filtro } : undefined"
        filterMode="lenient"
        showGridlines
        responsiveLayout="scroll"
      >
        <Column field="area" header="Área" expander sortable />
        <Column field="responsable" header="Responsable" sortable />
        <Column field="personas" header="Personas" sortable class="centro" />
      </TreeTable>
    </section>
  </div>
</template>

<style scoped>
.ancho { width: 100%; }
.intro { margin: -.5rem 0 1.25rem; line-height: 1.6; }
.nota { margin: 1rem 0 0; }
.separador { margin-top: 2rem; }
:deep(.centro) { text-align: center; }
</style>
