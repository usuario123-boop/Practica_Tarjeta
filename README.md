# Tarjeta Digital de Empleado (Vue 3 + PrimeVue)

Interfaz de usuario que genera la **tarjeta digital de un empleado** con **código QR** y código de barras.
El RFC se calcula automáticamente a partir del nombre, los apellidos y la fecha de nacimiento
(incluye homoclave y dígito verificador con el algoritmo del SAT).

**Alumno:** Ervin Almengor Cordero · 7° A
**Escuela:** Escuela de Tecnologías Digitales Aplicadas Campus IV – UNACH

## Funciones
- Dashboard con menú lateral y tarjetas de resumen
- Formulario: nombre(s), apellidos, fecha de nacimiento, puesto y foto opcional
- Cálculo automático del RFC (13 caracteres)
- Tarjeta digital con código QR (datos del empleado) y código de barras (RFC)
- Descarga de la tarjeta en PNG
- Lista de empleados con tarjeta (se guarda en el navegador)

## Tecnologías
Vue 3 · Vite · PrimeVue 4 (tema Aura) · PrimeIcons · Vue Router · qrcode.vue · JsBarcode · html-to-image

## Ejecutar en tu computadora
```bash
npm install
npm run dev
```
Abre http://localhost:5173

## Publicación
Cada `git push` a la rama `main` publica la app en GitHub Pages
(workflow en `.github/workflows/deploy.yml`).

URL: `https://<tu-usuario>.github.io/tarjeta-empleado/`
