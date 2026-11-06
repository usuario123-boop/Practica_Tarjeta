# Tarjeta Digital de Empleado (Vue 3 + PrimeVue)

Interfaz de usuario que genera la **tarjeta digital de un empleado** con **código QR** y código de barras.
El RFC se calcula automáticamente a partir del nombre, los apellidos y la fecha de nacimiento
(incluye homoclave y dígito verificador con el algoritmo del SAT).

**Alumno:** Ervin Almengor Cordero · 7° A
**Escuela:** Escuela de Tecnologías Digitales Aplicadas Campus IV – UNACH

## Funciones

| Módulo | Qué hace |
|---|---|
| **Dashboard** | Indicadores, registros recientes y la última tarjeta generada |
| **Tarjeta Digital** | Formulario con validación, cálculo del RFC, foto opcional, tarjeta con QR y código de barras, descarga en **PNG** (alta resolución) y **PDF** (tamaño credencial 54 × 85.6 mm), edición de empleados |
| **Empleados** | Tabla con búsqueda, orden, edición, eliminación con confirmación y exportación a CSV (Excel) |
| **BarCode-QR** | Generador libre de códigos QR y de barras (CODE128, CODE39, EAN-13, UPC) con color y tamaño, descargable en PNG |
| **Gráficas** | Empleados por puesto, por rango de edad y tarjetas generadas en los últimos 7 días |

El código QR de la tarjeta usa el formato **vCard**: al escanearlo con el celular aparece el contacto
del empleado (nombre, puesto, empresa, fecha de nacimiento y RFC).

Los datos se guardan en el navegador (localStorage); no se necesita servidor ni base de datos.

## Tecnologías
Vue 3 · Vite · PrimeVue 4 (tema Aura) · PrimeIcons · Vue Router · Chart.js · qrcode.vue · JsBarcode ·
html-to-image · jsPDF · Vitest

## Estructura del proyecto

```
src/
├── main.js                  # Arranque: PrimeVue, servicios, router
├── App.vue                  # Raíz: layout + Toast + ConfirmDialog
├── assets/styles/main.css   # Estilos globales y clases reutilizables
├── config/                  # Tema de PrimeVue (en español) y menú lateral
├── constants/               # Datos fijos: app, empresa, puestos
├── layout/                  # AppLayout, AppTopbar, AppSidebar
├── router/                  # Rutas (carga diferida de cada vista)
├── views/                   # Una vista por módulo del menú
├── components/
│   ├── tarjeta/             # TarjetaDigital (la credencial)
│   ├── empleado/            # EmpleadoForm, EmpleadoAvatar
│   ├── codigos/             # CodigoBarras (reutilizable)
│   └── dashboard/           # StatCard
├── composables/             # Lógica reutilizable con estado
│   ├── useEmpleados.js      # Alta, edición, baja y estadísticas
│   ├── useDescarga.js       # Exportar a PNG / PDF
│   └── useLayout.js         # Estado del menú lateral
├── services/storage.js      # Acceso seguro a localStorage
└── utils/                   # Funciones puras (sin Vue)
    ├── rfc.js               # Algoritmo del RFC
    ├── validaciones.js      # Reglas del formulario
    ├── fecha.js, vcard.js, imagen.js, archivos.js
tests/rfc.test.js            # Pruebas unitarias (Vitest)
```

## Ejecutar en tu computadora

Requisito: [Node.js](https://nodejs.org) 20.19 o más reciente (no se usa XAMPP).

```bash
npm install     # solo la primera vez
npm run dev     # abre http://localhost:5173
npm test        # corre las pruebas del RFC y validaciones
npm run build   # genera la versión de producción en /dist
```

## Publicación (Vercel)

El proyecto está configurado para desplegarse en **Vercel** (`vercel.json`).
Cada `git push` a la rama `main` vuelve a publicar la app automáticamente.

| Dato | Valor |
|---|---|
| Repositorio | https://github.com/usuario123-boop/Practica_Tarjeta |
| Dominio gratuito (URL) | https://practica-tarjeta.vercel.app |

Pasos para vincularlo:

1. Entrar a [vercel.com](https://vercel.com) e iniciar sesión con la cuenta de GitHub.
2. **Add New → Project** y seleccionar el repositorio `Practica_Tarjeta`.
3. Dejar **Root Directory** en la raíz: `package.json` y `vercel.json` ya están ahí.
4. Vercel detecta Vite solo: *Build Command* `npm run build`, *Output Directory* `dist`.
5. **Deploy**. Al terminar entrega la URL pública gratuita.

## Evidencia de la práctica

En `docs/` está el documento de entrega con la hoja de presentación, los datos del
repositorio, la URL pública y las impresiones de pantalla del navegador:

| Archivo | Contenido |
|---|---|
| `docs/Evidencia-Tarjeta-Digital-Empleado.pdf` | Documento final para entregar |
| `docs/Evidencia-Tarjeta-Digital-Empleado.docx` | La misma evidencia en Word, por si hay que editarla |
| `docs/evidencia/*.png` | Capturas de cada módulo |
| `docs/generar-evidencia.py` | Script que arma el PDF y el Word a partir de las capturas |

Para regenerar los documentos (por ejemplo, después de reemplazar una captura):

```bash
pip install reportlab python-docx pillow
python docs/generar-evidencia.py
```
