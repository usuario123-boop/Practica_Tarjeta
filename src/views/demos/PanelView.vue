<script setup>
import { ref } from 'vue'
import Panel from 'primevue/panel'
import Fieldset from 'primevue/fieldset'
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'
import Toolbar from 'primevue/toolbar'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Fluid from 'primevue/fluid'
import ScrollPanel from 'primevue/scrollpanel'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import { CLIENTES, aPesos, severidadEstado } from '@/constants/demo'

// Contenedores de PrimeVue para organizar el contenido
const pestana = ref('0')
const menuPanel = ref([
  { label: 'Actualizar', icon: 'pi pi-refresh' },
  { label: 'Exportar', icon: 'pi pi-upload' },
  { separator: true },
  { label: 'Eliminar', icon: 'pi pi-trash' }
])
const iniciales = (nombre) => nombre.split(' ').slice(0, 2).map(p => p[0]).join('')
</script>

<template>
  <div class="grid">
    <section class="panel">
      <h2 class="panel-titulo">Toolbar</h2>
      <Toolbar>
        <template #start>
          <Button label="Nuevo" icon="pi pi-plus" class="boton-exito mr" />
          <Button label="Editar" icon="pi pi-pencil" severity="secondary" outlined class="mr" />
          <Button label="Eliminar" icon="pi pi-trash" severity="danger" outlined />
        </template>
        <template #center>
          <span class="texto-suave">8 registros</span>
        </template>
        <template #end>
          <Button label="Exportar" icon="pi pi-upload" severity="secondary" outlined />
        </template>
      </Toolbar>
    </section>

    <div class="grid grid-2">
      <Panel header="Panel plegable" toggleable>
        <template #icons>
          <Button icon="pi pi-cog" severity="secondary" text rounded aria-label="Opciones" />
        </template>
        <p class="parrafo">
          El componente <b>Panel</b> agrupa contenido bajo un encabezado y puede plegarse
          con la flecha de la derecha. Es útil para secciones que no siempre necesitan
          estar visibles.
        </p>
        <Divider />
        <p class="parrafo texto-suave">
          El <b>Divider</b> separa bloques de contenido; también funciona en vertical.
        </p>
      </Panel>

      <Fieldset legend="Fieldset plegable" :toggleable="true">
        <p class="parrafo">
          El <b>Fieldset</b> se parece al agrupador clásico de los formularios HTML:
          dibuja un marco con el título incrustado en el borde superior.
        </p>
        <ul class="lista">
          <li>Agrupa campos relacionados.</li>
          <li>Puede plegarse si se activa <code>toggleable</code>.</li>
          <li>Acepta cualquier contenido dentro.</li>
        </ul>
      </Fieldset>
    </div>

    <section class="panel">
      <h2 class="panel-titulo">Tabs</h2>
      <Tabs v-model:value="pestana">
        <TabList>
          <Tab value="0"><i class="pi pi-user mr-chico"></i> Datos generales</Tab>
          <Tab value="1"><i class="pi pi-briefcase mr-chico"></i> Puesto</Tab>
          <Tab value="2"><i class="pi pi-wallet mr-chico"></i> Nómina</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <p class="parrafo">
              Aquí irían el nombre, los apellidos, la fecha de nacimiento y el RFC del
              empleado: los mismos datos que usa el módulo <b>Demo Clientes</b> para
              generar la tarjeta digital.
            </p>
          </TabPanel>
          <TabPanel value="1">
            <p class="parrafo">
              Departamento, puesto, tipo de contrato y fecha de ingreso. El componente
              <b>Tabs</b> evita que el formulario se vuelva una sola pantalla muy larga.
            </p>
          </TabPanel>
          <TabPanel value="2">
            <p class="parrafo">
              Sueldo, prestaciones y deducciones. Cada pestaña mantiene su propio
              contenido sin recargar la página.
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Accordion</h2>
      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader>¿Cómo se calcula el RFC?</AccordionHeader>
          <AccordionContent>
            <p class="parrafo">
              Se toman cuatro letras del nombre y los apellidos, la fecha de nacimiento en
              formato AAMMDD, una homoclave de dos caracteres y un dígito verificador:
              trece caracteres en total, según el algoritmo del SAT.
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>¿Dónde se guardan los empleados?</AccordionHeader>
          <AccordionContent>
            <p class="parrafo">
              En el almacenamiento local del navegador (<code>localStorage</code>). No se
              necesita servidor ni base de datos, y los datos permanecen aunque cierres
              la pestaña.
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>¿Qué contiene el código QR de la tarjeta?</AccordionHeader>
          <AccordionContent>
            <p class="parrafo">
              Una <b>vCard</b>: al escanearlo con el celular aparece el contacto del
              empleado con su nombre, puesto, empresa, fecha de nacimiento y RFC.
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Card</h2>
      <div class="rejilla-cards">
        <Card v-for="c in CLIENTES.slice(0, 3)" :key="c.id" class="card">
          <template #header>
            <div class="card-cabecera">
              <Avatar :label="iniciales(c.nombre)" shape="circle" size="large" class="avatar" />
            </div>
          </template>
          <template #title>{{ c.nombre }}</template>
          <template #subtitle>{{ c.departamento }} · {{ c.ciudad }}</template>
          <template #content>
            <p class="monoespaciado rfc">{{ c.rfc }}</p>
            <Tag :value="c.estado" :severity="severidadEstado(c.estado)" />
          </template>
          <template #footer>
            <div class="card-pie">
              <span class="saldo">{{ aPesos(c.saldo) }}</span>
              <Button label="Ver" icon="pi pi-eye" size="small" outlined />
            </div>
          </template>
        </Card>
      </div>
    </section>

    <div class="grid grid-2">
      <section class="panel">
        <h2 class="panel-titulo">Splitter</h2>
        <Splitter class="splitter">
          <SplitterPanel :size="45" :minSize="25" class="splitter-panel">
            <h4>Panel izquierdo</h4>
            <p class="parrafo texto-suave">Arrastra la barra divisoria para cambiar el tamaño.</p>
          </SplitterPanel>
          <SplitterPanel :size="55" :minSize="25" class="splitter-panel">
            <h4>Panel derecho</h4>
            <p class="parrafo texto-suave">Cada panel respeta el tamaño mínimo configurado.</p>
          </SplitterPanel>
        </Splitter>
      </section>

      <section class="panel">
        <h2 class="panel-titulo">ScrollPanel y Fluid</h2>
        <ScrollPanel class="scroll">
          <p v-for="c in CLIENTES" :key="c.id" class="renglon">
            <b>{{ c.nombre }}</b> — {{ c.departamento }}
          </p>
        </ScrollPanel>
        <Fluid class="fluid">
          <Button label="Fluid hace que el contenido ocupe todo el ancho" icon="pi pi-arrows-h" outlined />
        </Fluid>
      </section>
    </div>
  </div>
</template>

<style scoped>
.parrafo { margin: 0 0 .75rem; line-height: 1.7; color: #475569; }
.parrafo:last-child { margin-bottom: 0; }
.lista { margin: 0; padding-left: 1.2rem; line-height: 1.9; color: #475569; }
.mr { margin-right: .5rem; }
.mr-chico { margin-right: .45rem; }
code { padding: .1rem .35rem; background: #f1f5f9; border-radius: 4px; font-size: .85em; }

.rejilla-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
.card { border: 1px solid var(--color-borde); box-shadow: none; }
.card-cabecera { display: grid; place-items: center; padding: 1.5rem 0 .25rem; background: #f8fafc; }
.avatar { background: #dbeafe; color: #1d4ed8; font-weight: 600; }
.rfc { margin: 0 0 .75rem; font-size: .8rem; color: var(--color-texto-suave); }
.card-pie { display: flex; align-items: center; justify-content: space-between; }
.saldo { font-weight: 700; color: #1e293b; }

.splitter { height: 180px; border: 1px solid var(--color-borde); }
.splitter-panel { padding: 1rem; }
.splitter-panel h4 { margin: 0 0 .5rem; color: #1e293b; }

.scroll { height: 180px; padding-right: .75rem; }
.renglon { margin: 0 0 .7rem; color: #475569; }
.fluid { margin-top: 1rem; }

@media (max-width: 1100px) { .rejilla-cards { grid-template-columns: 1fr; } }
</style>
