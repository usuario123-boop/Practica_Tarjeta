<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import QrcodeVue from 'qrcode.vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  empleado: { type: Object, required: true }
})

const barcode = ref(null)
const tarjeta = ref(null)
defineExpose({ tarjeta })

const nombreCompleto = computed(() =>
  `${props.empleado.nombre || ''} ${props.empleado.paterno || ''} ${props.empleado.materno || ''}`.trim()
)
const apellidos = computed(() => `${props.empleado.paterno || ''} ${props.empleado.materno || ''}`.trim())
const rfc = computed(() => props.empleado.rfc || 'XXXX000000XXX')

// Información que guarda el código QR
const datosQR = computed(() => [
  'TARJETA DIGITAL DE EMPLEADO',
  `Nombre: ${nombreCompleto.value || '-'}`,
  `RFC: ${rfc.value}`,
  `Puesto: ${props.empleado.puesto || 'Empleado'}`,
  `Empresa: ${props.empleado.empresa || 'Tech Solutions'}`,
  props.empleado.fechaNacimiento ? `Nacimiento: ${new Date(props.empleado.fechaNacimiento).toLocaleDateString('es-MX')}` : ''
].filter(Boolean).join('\n'))

const dibujarBarras = async () => {
  await nextTick()
  if (!barcode.value) return
  JsBarcode(barcode.value, rfc.value, {
    format: 'CODE128', height: 34, width: 1.3, displayValue: true,
    fontSize: 11, margin: 0, background: 'transparent', lineColor: '#0f172a'
  })
}
onMounted(dibujarBarras)
watch(rfc, dibujarBarras)
</script>

<template>
  <div ref="tarjeta" class="id-card">
    <!-- Cabecera azul con ondas -->
    <svg class="ondas-top" viewBox="0 0 300 200" preserveAspectRatio="none">
      <rect width="300" height="200" fill="#0f2a5c" />
      <path d="M0,120 C80,180 200,60 300,140 L300,200 L0,200 Z" fill="#1d4ed8" />
      <path d="M0,150 C90,200 210,95 300,165 L300,200 L0,200 Z" fill="#3b82f6" />
      <path d="M0,175 C100,215 220,130 300,185 L300,200 L0,200 Z" fill="#ffffff" />
    </svg>

    <div class="empresa">
      <div class="logo"><i class="pi pi-bolt"></i></div>
      <div>
        <strong>{{ empleado.empresa || 'TECH SOLUTIONS' }}</strong>
        <span>Innovación que conecta</span>
      </div>
    </div>

    <div class="foto">
      <img v-if="empleado.foto" :src="empleado.foto" alt="Foto del empleado" />
      <i v-else class="pi pi-user"></i>
    </div>

    <div class="datos">
      <h2>{{ (empleado.nombre || 'NOMBRE').toUpperCase() }}</h2>
      <h3>{{ (apellidos || 'APELLIDOS').toUpperCase() }}</h3>
      <p class="puesto">{{ empleado.puesto || 'Empleado' }}</p>
      <p class="id">ID : <b>{{ rfc }}</b></p>
    </div>

    <div class="codigos">
      <div class="qr">
        <QrcodeVue :value="datosQR" :size="92" level="M" render-as="svg" :margin="0" foreground="#0f172a" />
      </div>
      <svg ref="barcode" class="barras"></svg>
    </div>

    <svg class="ondas-bottom" viewBox="0 0 300 60" preserveAspectRatio="none">
      <path d="M0,25 C90,-5 200,55 300,15 L300,60 L0,60 Z" fill="#3b82f6" />
      <path d="M0,40 C100,15 210,65 300,32 L300,60 L0,60 Z" fill="#0f2a5c" />
    </svg>
  </div>
</template>

<style scoped>
.id-card {
  position: relative; width: 300px; margin: 0 auto; overflow: hidden;
  background: #fff; border-radius: 16px; padding-bottom: 46px;
  box-shadow: 0 12px 30px rgba(15, 42, 92, .25); font-family: 'Inter', sans-serif;
}
.ondas-top { position: absolute; top: 0; left: 0; width: 100%; height: 190px; }
.ondas-bottom { position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; }

.empresa {
  position: relative; display: flex; align-items: center; gap: .6rem;
  padding: 1.1rem 1.25rem 0; color: #fff;
}
.empresa strong { display: block; font-size: .9rem; letter-spacing: .04em; }
.empresa span { font-size: .7rem; opacity: .8; }
.logo {
  width: 34px; height: 34px; background: #fff; color: #1d4ed8; border-radius: 8px;
  display: grid; place-items: center; transform: rotate(45deg);
}
.logo i { transform: rotate(-45deg); font-size: 1rem; }

.foto {
  position: relative; width: 120px; height: 120px; margin: 1.6rem auto 0;
  border-radius: 50%; background: #e2e8f0; border: 6px solid #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, .2); display: grid; place-items: center; overflow: hidden;
}
.foto i { font-size: 3.6rem; color: #0f2a5c; }
.foto img { width: 100%; height: 100%; object-fit: cover; }

.datos { position: relative; text-align: center; padding: .9rem 1rem 0; }
.datos h2 { margin: 0; font-size: 1.3rem; font-weight: 800; color: #0f2a5c; line-height: 1.2; }
.datos h3 { margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f2a5c; }
.puesto { margin: .3rem 0 .6rem; color: #64748b; font-size: .95rem; }
.id { margin: 0; font-size: .95rem; color: #0f172a; letter-spacing: .02em; }

.codigos {
  position: relative; display: flex; align-items: center; justify-content: center;
  gap: .9rem; padding: .9rem 1rem .4rem;
}
.qr { padding: 5px; border: 2px solid #dbeafe; border-radius: 8px; line-height: 0; background: #fff; }
.barras { max-width: 150px; height: auto; }
</style>
