<script setup>
import { ref, watch, onMounted } from 'vue'
import JsBarcode from 'jsbarcode'

// Componente reutilizable: dibuja un código de barras en SVG
const props = defineProps({
  valor: { type: String, required: true },
  formato: { type: String, default: 'CODE128' },
  alto: { type: Number, default: 34 },
  grosor: { type: Number, default: 1.3 },
  color: { type: String, default: '#0f172a' },
  mostrarTexto: { type: Boolean, default: true },
  tamanoTexto: { type: Number, default: 11 }
})

const emit = defineEmits(['valido'])
const svg = ref(null)

function dibujar () {
  if (!svg.value) return
  let esValido = Boolean(props.valor)
  if (esValido) {
    try {
      JsBarcode(svg.value, props.valor, {
        format: props.formato,
        height: props.alto,
        width: props.grosor,
        lineColor: props.color,
        displayValue: props.mostrarTexto,
        fontSize: props.tamanoTexto,
        font: 'Inter, sans-serif',
        textMargin: 2,
        margin: 0,
        background: 'transparent',
        valid: (ok) => { esValido = ok }
      })
    } catch {
      esValido = false
    }
  }
  if (!esValido) svg.value.innerHTML = ''
  emit('valido', esValido)
}

onMounted(dibujar)
watch(props, dibujar)
</script>

<template>
  <svg ref="svg" class="codigo-barras" role="img" :aria-label="`Código de barras ${valor}`"></svg>
</template>

<style scoped>
.codigo-barras { max-width: 100%; height: auto; display: block; }
</style>
