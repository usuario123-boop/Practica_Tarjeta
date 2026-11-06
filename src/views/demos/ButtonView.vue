<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import SplitButton from 'primevue/splitbutton'
import ToggleButton from 'primevue/togglebutton'
import SelectButton from 'primevue/selectbutton'
import SpeedDial from 'primevue/speeddial'

// Variantes del componente Button de PrimeVue
const SEVERIDADES = ['primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger']

const toast = useToast()
const cargando = ref(false)
const favorito = ref(false)
const vista = ref('tabla')

const VISTAS = [
  { label: 'Tabla', value: 'tabla', icon: 'pi pi-table' },
  { label: 'Tarjetas', value: 'tarjetas', icon: 'pi pi-th-large' },
  { label: 'Lista', value: 'lista', icon: 'pi pi-list' }
]

const opcionesGuardar = [
  { label: 'Guardar como borrador', icon: 'pi pi-file-edit', command: () => avisar('Borrador guardado') },
  { label: 'Guardar y cerrar', icon: 'pi pi-check-square', command: () => avisar('Guardado y cerrado') },
  { separator: true },
  { label: 'Descartar cambios', icon: 'pi pi-times', command: () => avisar('Cambios descartados') }
]

const accionesRapidas = [
  { label: 'Nuevo', icon: 'pi pi-plus', command: () => avisar('Nuevo registro') },
  { label: 'Buscar', icon: 'pi pi-search', command: () => avisar('Buscar') },
  { label: 'Exportar', icon: 'pi pi-upload', command: () => avisar('Exportar') },
  { label: 'Eliminar', icon: 'pi pi-trash', command: () => avisar('Eliminar') }
]

const avisar = (detalle) => toast.add({ severity: 'info', summary: 'Acción', detail: detalle, life: 2000 })

function simularCarga () {
  cargando.value = true
  setTimeout(() => {
    cargando.value = false
    toast.add({ severity: 'success', summary: 'Listo', detail: 'Proceso terminado', life: 2000 })
  }, 1600)
}
</script>

<template>
  <div class="grid">
    <section class="panel">
      <h2 class="panel-titulo">Colores (severity)</h2>
      <div class="fila">
        <Button v-for="s in SEVERIDADES" :key="s" :label="s" :severity="s === 'primary' ? undefined : s" />
      </div>
    </section>

    <div class="grid grid-2">
      <section class="panel">
        <h2 class="panel-titulo">Estilos</h2>
        <div class="fila">
          <Button label="Normal" />
          <Button label="Outlined" outlined />
          <Button label="Text" text />
          <Button label="Raised" raised />
          <Button label="Rounded" rounded />
          <Button label="Link" link />
        </div>

        <h2 class="panel-titulo separador">Tamaños</h2>
        <div class="fila alineada">
          <Button label="Pequeño" size="small" icon="pi pi-check" />
          <Button label="Normal" icon="pi pi-check" />
          <Button label="Grande" size="large" icon="pi pi-check" />
        </div>

        <h2 class="panel-titulo separador">Deshabilitado y carga</h2>
        <div class="fila">
          <Button label="Deshabilitado" disabled />
          <Button :label="cargando ? 'Procesando...' : 'Simular proceso'"
                  icon="pi pi-sync" :loading="cargando" @click="simularCarga" />
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-titulo">Con icono</h2>
        <div class="fila">
          <Button label="Izquierda" icon="pi pi-user" />
          <Button label="Derecha" icon="pi pi-user" iconPos="right" />
          <Button label="Arriba" icon="pi pi-user" iconPos="top" />
        </div>

        <h2 class="panel-titulo separador">Solo icono</h2>
        <div class="fila">
          <Button icon="pi pi-check" aria-label="Aceptar" v-tooltip.top="'Aceptar'" />
          <Button icon="pi pi-pencil" severity="secondary" rounded aria-label="Editar" v-tooltip.top="'Editar'" />
          <Button icon="pi pi-trash" severity="danger" rounded outlined aria-label="Eliminar" v-tooltip.top="'Eliminar'" />
          <Button icon="pi pi-search" severity="info" rounded text aria-label="Buscar" v-tooltip.top="'Buscar'" />
          <Button icon="pi pi-bell" badge="3" severity="help" aria-label="Avisos" />
        </div>

        <h2 class="panel-titulo separador">ToggleButton</h2>
        <div class="fila">
          <ToggleButton v-model="favorito" onLabel="En favoritos" offLabel="Agregar a favoritos"
                        onIcon="pi pi-star-fill" offIcon="pi pi-star" />
        </div>
      </section>
    </div>

    <div class="grid grid-2">
      <section class="panel">
        <h2 class="panel-titulo">ButtonGroup y SplitButton</h2>
        <div class="fila">
          <ButtonGroup>
            <Button label="Anterior" icon="pi pi-chevron-left" outlined />
            <Button label="Guardar" icon="pi pi-save" outlined />
            <Button label="Siguiente" icon="pi pi-chevron-right" iconPos="right" outlined />
          </ButtonGroup>
        </div>
        <div class="fila separador-chico">
          <SplitButton label="Guardar" icon="pi pi-save" :model="opcionesGuardar"
                       @click="avisar('Guardado')" />
        </div>

        <h2 class="panel-titulo separador">SelectButton</h2>
        <SelectButton v-model="vista" :options="VISTAS" optionLabel="label"
                      optionValue="value" :allowEmpty="false">
          <template #option="{ option }">
            <i :class="option.icon"></i> {{ option.label }}
          </template>
        </SelectButton>
        <p class="texto-suave nota">Vista seleccionada: <b>{{ vista }}</b></p>
      </section>

      <section class="panel">
        <h2 class="panel-titulo">SpeedDial</h2>
        <p class="texto-suave nota">Pasa el cursor sobre el botón azul para ver las acciones.</p>
        <div class="zona-speeddial">
          <SpeedDial :model="accionesRapidas" direction="up" :transitionDelay="80"
                     showIcon="pi pi-bars" hideIcon="pi pi-times" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.fila { display: flex; flex-wrap: wrap; gap: .6rem; }
.fila.alineada { align-items: center; }
.separador { margin-top: 2rem; }
.separador-chico { margin-top: .9rem; }
.nota { margin: .9rem 0 0; }
.zona-speeddial {
  position: relative; display: grid; place-items: center; min-height: 190px;
  margin-top: .5rem; background: #f8fafc; border-radius: 10px;
}
/* SpeedDial se posiciona de forma absoluta: necesita un contenedor con altura */
.zona-speeddial :deep(.p-speeddial) { position: static; }
</style>
