<script setup>
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import CodigoBarras from '@/components/codigos/CodigoBarras.vue'
import { EMPRESA } from '@/constants/empleado'
import { crearVCard } from '@/utils/vcard'

// Tarjeta (credencial) del empleado.
// Los íconos son SVG dentro del componente para que se vean igual al descargarla.
const props = defineProps({
  empleado: { type: Object, required: true },
  empresa: { type: Object, default: () => EMPRESA }
})

const elemento = ref(null)
defineExpose({ elemento })

const nombre = computed(() => (props.empleado.nombre || 'Nombre').toUpperCase())
const apellidos = computed(() =>
  [props.empleado.paterno, props.empleado.materno].filter(Boolean).join(' ').toUpperCase() || 'APELLIDOS'
)
const puesto = computed(() => props.empleado.puesto || 'Empleado')
const rfc = computed(() => props.empleado.rfc || 'XXXX000000XXX')
const contenidoQR = computed(() => crearVCard({ ...props.empleado, rfc: rfc.value }, props.empresa))
</script>

<template>
  <article ref="elemento" class="tarjeta" aria-label="Tarjeta digital del empleado">
    <!-- Fondo superior con ondas -->
    <svg class="ondas-arriba" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
      <rect width="300" height="200" fill="#0f2a5c" />
      <path d="M0,120 C80,180 200,60 300,140 L300,200 L0,200 Z" fill="#1d4ed8" />
      <path d="M0,150 C90,200 210,95 300,165 L300,200 L0,200 Z" fill="#3b82f6" />
      <path d="M0,175 C100,215 220,130 300,185 L300,200 L0,200 Z" fill="#ffffff" />
    </svg>

    <header class="empresa">
      <div class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="#1d4ed8" />
        </svg>
      </div>
      <div>
        <strong>{{ empresa.nombre }}</strong>
        <span>{{ empresa.lema }}</span>
      </div>
    </header>

    <div class="foto">
      <img v-if="empleado.foto" :src="empleado.foto" alt="" />
      <svg v-else viewBox="0 0 64 64" width="70" height="70" aria-hidden="true">
        <circle cx="32" cy="22" r="12" fill="#0f2a5c" />
        <path d="M8 60c0-14 10.7-22 24-22s24 8 24 22Z" fill="#0f2a5c" />
      </svg>
    </div>

    <section class="datos">
      <h2>{{ nombre }}</h2>
      <h3>{{ apellidos }}</h3>
      <p class="puesto">{{ puesto }}</p>
      <p class="id">ID : <b>{{ rfc }}</b></p>
    </section>

    <section class="codigos">
      <div class="qr">
        <QrcodeVue :value="contenidoQR" :size="100" level="M" render-as="svg" :margin="0" foreground="#0f172a" />
      </div>
      <CodigoBarras class="barras" :valor="rfc" />
    </section>

    <!-- Fondo inferior con ondas -->
    <svg class="ondas-abajo" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,25 C90,-5 200,55 300,15 L300,60 L0,60 Z" fill="#3b82f6" />
      <path d="M0,40 C100,15 210,65 300,32 L300,60 L0,60 Z" fill="#0f2a5c" />
    </svg>
  </article>
</template>

<style scoped>
.tarjeta {
  position: relative; width: 300px; margin: 0 auto; padding-bottom: 50px;
  overflow: hidden; background: #fff; border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 42, 92, .25);
  font-family: 'Inter', sans-serif; color: #0f172a;
}
.ondas-arriba { position: absolute; top: 0; left: 0; width: 100%; height: 190px; }
.ondas-abajo { position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; }

.empresa { position: relative; display: flex; align-items: center; gap: .65rem; padding: 1.1rem 1.25rem 0; color: #fff; }
.empresa strong { display: block; font-size: .9rem; letter-spacing: .04em; }
.empresa span { font-size: .7rem; opacity: .85; }
.logo {
  display: grid; place-items: center; width: 32px; height: 32px;
  background: #fff; border-radius: 8px; transform: rotate(45deg);
}
.logo svg { transform: rotate(-45deg); }

.foto {
  position: relative; display: grid; place-items: center; overflow: hidden;
  width: 120px; height: 120px; margin: 1.6rem auto 0;
  background: #e2e8f0; border: 6px solid #fff; border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, .2);
}
.foto img { width: 100%; height: 100%; object-fit: cover; }
.foto svg { margin-top: 14px; }

.datos { position: relative; padding: .9rem 1rem 0; text-align: center; }
.datos h2 { margin: 0; font-size: 1.3rem; font-weight: 800; line-height: 1.2; color: #0f2a5c; word-break: break-word; }
.datos h3 { margin: 0; font-size: 1.02rem; font-weight: 800; line-height: 1.25; color: #0f2a5c; word-break: break-word; }
.puesto { margin: .3rem 0 .55rem; font-size: .95rem; color: #64748b; }
.id { margin: 0; font-size: .95rem; letter-spacing: .02em; }

.codigos { position: relative; display: flex; align-items: center; justify-content: center; gap: .8rem; padding: .9rem 1rem .4rem; }
.qr { flex-shrink: 0; padding: 5px; line-height: 0; background: #fff; border: 2px solid #dbeafe; border-radius: 8px; }
.barras { width: 140px; }
</style>
