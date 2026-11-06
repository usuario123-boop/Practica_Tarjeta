<script setup>
import { ref } from 'vue'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const menuOculto = ref(false)
const menuMovil = ref(false)

const alternarMenu = () => {
  if (window.innerWidth <= 760) menuMovil.value = !menuMovil.value
  else menuOculto.value = !menuOculto.value
}

const modulos = [
  { label: 'Tarjeta Digital', icon: 'pi pi-id-card', to: '/tarjeta' },
  { label: 'Empleados', icon: 'pi pi-users', to: '/empleados' }
]
const extras = [
  { label: 'BarCode-QR', icon: 'pi pi-qrcode' },
  { label: 'Gráficas', icon: 'pi pi-chart-bar' },
  { label: 'Input', icon: 'pi pi-check-square' },
  { label: 'Float Label', icon: 'pi pi-bookmark' },
  { label: 'Button', icon: 'pi pi-mobile' },
  { label: 'Table', icon: 'pi pi-table' },
  { label: 'List', icon: 'pi pi-list' },
  { label: 'Tree', icon: 'pi pi-share-alt' },
  { label: 'Panel', icon: 'pi pi-tablet' }
]
</script>

<template>
  <div class="layout" :class="{ oculto: menuOculto, 'visible-movil': menuMovil }">
    <header class="topbar">
      <div class="brand">
        <i class="pi pi-building-columns"></i>
        <div class="brand-text">
          <strong>Tecnologías Digitales</strong>
          <span>UNACH · Campus IV</span>
        </div>
      </div>
      <Button icon="pi pi-bars" text rounded severity="secondary" aria-label="Menú" @click="alternarMenu" />
      <div class="spacer"></div>
      <div class="user">
        <span>Ervin Almengor Cordero</span>
        <Avatar icon="pi pi-user" shape="circle" style="background:#dbeafe;color:#1d4ed8" />
      </div>
    </header>

    <aside class="sidebar" @click="menuMovil = false">
      <h6>Universidad Autónoma de Chiapas</h6>
      <RouterLink to="/" class="item"><i class="pi pi-home"></i> Dashboard</RouterLink>

      <h6>Módulos</h6>
      <RouterLink v-for="m in modulos" :key="m.label" :to="m.to" class="item">
        <i :class="m.icon"></i> {{ m.label }}
      </RouterLink>
      <a v-for="e in extras" :key="e.label" class="item disabled" v-tooltip.right="'Próximamente'">
        <i :class="e.icon"></i> {{ e.label }}
      </a>
    </aside>

    <main class="main">
      <RouterView />
      <div class="footer">Escuela de Tecnologías Digitales Aplicadas Campus IV · UNACH · 2026</div>
    </main>
    <Toast />
  </div>
</template>
