<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import QrcodeVue from 'qrcode.vue'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'
import Slider from 'primevue/slider'
import ColorPicker from 'primevue/colorpicker'
import Button from 'primevue/button'
import Message from 'primevue/message'
import CodigoBarras from '@/components/codigos/CodigoBarras.vue'
import { useDescarga } from '@/composables/useDescarga'

// Generador libre de códigos QR y de barras
const TIPOS = [
  { label: 'Código QR', value: 'qr', icon: 'pi pi-qrcode' },
  { label: 'Código de barras', value: 'barras', icon: 'pi pi-barcode' }
]
const FORMATOS = [
  { label: 'CODE128 (letras sin acentos y números)', value: 'CODE128' },
  { label: 'CODE39 (mayúsculas y números)', value: 'CODE39' },
  { label: 'EAN-13 (12 o 13 dígitos)', value: 'EAN13' },
  { label: 'UPC (11 o 12 dígitos)', value: 'UPC' }
]

const toast = useToast()
const { descargando, descargarPNG } = useDescarga()

const texto = ref('UNACH-CAMPUS-IV-2026')
const tipo = ref('qr')
const formato = ref('CODE128')
const color = ref('0f172a')
const tamano = ref(220)
const barrasValidas = ref(true)
const lienzo = ref(null)

const colorHex = computed(() => `#${color.value}`)
const esValido = computed(() => texto.value.trim() && (tipo.value === 'qr' || barrasValidas.value))

async function descargar () {
  const ok = await descargarPNG(lienzo.value, tipo.value === 'qr' ? 'codigo-qr' : 'codigo-barras')
  if (!ok) toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar', life: 3000 })
}
</script>

<template>
  <div class="grid grid-2">
    <section class="panel">
      <h2 class="panel-titulo">Generador BarCode-QR</h2>

      <div class="campo">
        <label>Tipo de código:</label>
        <SelectButton v-model="tipo" :options="TIPOS" optionLabel="label" optionValue="value" :allowEmpty="false">
          <template #option="{ option }"><i :class="option.icon"></i> {{ option.label }}</template>
        </SelectButton>
      </div>

      <div class="campo">
        <label for="texto">Contenido:</label>
        <Textarea id="texto" v-model="texto" rows="3" autoResize maxlength="300" placeholder="Texto, URL, número..." />
        <small class="texto-suave">{{ texto.length }}/300 caracteres</small>
      </div>

      <div v-if="tipo === 'barras'" class="campo">
        <label for="formato">Formato:</label>
        <Select v-model="formato" inputId="formato" :options="FORMATOS" optionLabel="label" optionValue="value" />
      </div>

      <div class="fila-campos">
        <div class="campo">
          <label>Color:</label>
          <div class="color">
            <ColorPicker v-model="color" />
            <span class="monoespaciado">{{ colorHex }}</span>
          </div>
        </div>
        <div class="campo">
          <label>Tamaño: {{ tamano }} px</label>
          <Slider v-model="tamano" :min="120" :max="320" :step="10" class="slider" />
        </div>
      </div>

      <Message v-if="tipo === 'barras' && !barrasValidas && texto" severity="warn" size="small">
        El contenido no es válido para el formato seleccionado.
      </Message>
    </section>

    <section class="panel">
      <h2 class="panel-titulo">Vista previa</h2>
      <div class="vista">
        <div ref="lienzo" class="lienzo">
          <QrcodeVue v-if="tipo === 'qr' && texto" :value="texto" :size="tamano" level="M" render-as="svg" :margin="0" :foreground="colorHex" />
          <CodigoBarras
            v-else-if="tipo === 'barras'"
            :valor="texto"
            :formato="formato"
            :color="colorHex"
            :alto="tamano / 3"
            :grosor="2"
            :tamanoTexto="16"
            :style="{ width: `${tamano + 80}px` }"
            @valido="barrasValidas = $event"
          />
        </div>
        <p v-if="!texto" class="texto-suave">Escribe un contenido para generar el código.</p>
      </div>
      <div class="acciones centro">
        <Button label="Descargar PNG" icon="pi pi-download" :disabled="!esValido" :loading="descargando" @click="descargar" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.color { display: flex; align-items: center; gap: .75rem; }
.slider { margin-top: .9rem; }
.vista { display: grid; place-items: center; min-height: 340px; padding: 1rem; background: #f8fafc; border-radius: 10px; }
.lienzo { padding: 18px; background: #fff; border-radius: 8px; line-height: 0; max-width: 100%; }
.centro { justify-content: center; margin-top: 1.25rem; }
</style>
