"""
Genera la evidencia de la práctica (PDF y Word) a partir de las capturas
que están en docs/evidencia/.

Uso:
    pip install reportlab python-docx pillow
    python docs/generar-evidencia.py

Si vuelves a tomar las capturas (por ejemplo, ya con la URL de Vercel visible
en la barra del navegador), solo reemplaza el PNG correspondiente en
docs/evidencia/ y vuelve a ejecutar este script.
"""

import os
from PIL import Image

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (BaseDocTemplate, Frame, Image as RLImage,
                                NextPageTemplate, PageBreak, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

import docx
from docx.enum.section import WD_ORIENT, WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Pt, RGBColor

# --------------------------------------------------------------------------
# Datos de la entrega  (edita aquí lo que necesites)
# --------------------------------------------------------------------------
DATOS = {
    'universidad': 'UNIVERSIDAD AUTÓNOMA DE CHIAPAS',
    'escuela': 'Escuela de Tecnologías Digitales Aplicadas, Campus IV',
    'asignatura': 'Desarrollo de Aplicaciones Web',
    'actividad': 'Interfaz de usuario para generar la tarjeta digital '
                 'de una persona empleada',
    'tecnologia': 'Vue 3 + PrimeVue',
    'alumno': 'Ervin Almengor Cordero',
    'grado': '7.° semestre, grupo A',
    'docente': '____________________________',
    'lugar': 'Tapachula, Chiapas',
    'fecha': '6 de noviembre de 2026',
    'repo': 'https://github.com/usuario123-boop/Practica_Tarjeta',
    'url': 'https://practica-tarjeta.vercel.app',
}

CAPTURAS = [
    ('01-dashboard.png', 'Dashboard',
     'Pantalla principal. Muestra los indicadores (tarjetas generadas, generadas '
     'hoy, puestos distintos y tarjetas con fotografía), los registros recientes '
     'y la última tarjeta digital generada.'),
    ('02-demo-clientes.png', 'Demo Clientes',
     'Formulario para capturar nombre(s), apellidos, fecha de nacimiento y puesto. '
     'El RFC se calcula automáticamente con el algoritmo del SAT (13 caracteres, '
     'con homoclave y dígito verificador) y la tarjeta digital se genera en tiempo '
     'real con código QR y código de barras; puede descargarse en PNG o PDF.'),
    ('03-barcode-qr.png', 'BarCode-QR',
     'Generador independiente de códigos QR y de barras (CODE128, CODE39, EAN-13 y '
     'UPC) con color y tamaño configurables, descargable en PNG.'),
    ('04-empleados.png', 'Empleados',
     'Tabla con los empleados registrados: búsqueda global, ordenamiento, '
     'paginación, edición, eliminación con confirmación y exportación a CSV.'),
    ('05-graficas.png', 'Gráficas',
     'Gráficas de barras generadas con Chart.js: empleados por puesto, por rango de '
     'edad y tarjetas generadas durante los últimos siete días.'),
    ('06-input.png', 'Input',
     'Componentes de captura de PrimeVue: InputText, InputNumber, InputMask, '
     'Password, Textarea, InputGroup, Select, MultiSelect, AutoComplete, DatePicker, '
     'Checkbox, RadioButton, ToggleSwitch, Slider, Rating y Knob.'),
    ('07-float-label.png', 'Float Label',
     'Etiquetas flotantes en sus tres variantes (over, in y on) y el componente '
     'IftaLabel: la etiqueta vive dentro del campo y se desplaza al escribir.'),
    ('08-invalid-state.png', 'Invalid State',
     'Formulario con validación en vivo. Al enviarlo incompleto, cada componente se '
     'marca en rojo con la propiedad :invalid y muestra su mensaje de error.'),
    ('09-button.png', 'Button',
     'Variantes del componente Button: colores (severity), estilos, tamaños, estado '
     'deshabilitado y de carga, iconos, ButtonGroup, SplitButton, ToggleButton, '
     'SelectButton y SpeedDial.'),
    ('10-table.png', 'Table',
     'DataTable con búsqueda global, filtros por columna, ordenamiento, paginación, '
     'selección múltiple, filas expandibles y pie con el total acumulado.'),
    ('11-list.png', 'List',
     'Componentes de listas: Listbox con filtro, OrderList para reordenar, DataView '
     'con vista de cuadrícula y de lista, y PickList para mover elementos.'),
    ('12-tree.png', 'Tree',
     'Datos jerárquicos: Tree con casillas y filtro, Tree de selección simple, '
     'TreeSelect desplegable y TreeTable, que combina el árbol con columnas.'),
    ('13-panel.png', 'Panel',
     'Contenedores de PrimeVue: Toolbar, Panel plegable, Fieldset, Tabs, Accordion, '
     'Card, Divider, Splitter, ScrollPanel y Fluid.'),
]

AZUL = colors.HexColor('#0f2a5c')
AZUL_CLARO = colors.HexColor('#2563eb')
GRIS = colors.HexColor('#475569')
BORDE = colors.HexColor('#cbd5e1')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RAIZ, 'docs')
EVID = os.path.join(DOCS, 'evidencia')
BASE_NOMBRE = 'Evidencia-Tarjeta-Digital-Empleado'


def ruta_captura(archivo):
    return os.path.join(EVID, archivo)


def medidas(archivo, ancho_max):
    """Alto proporcional de una imagen para un ancho dado."""
    with Image.open(ruta_captura(archivo)) as im:
        w, h = im.size
    return ancho_max, ancho_max * h / w


# ==========================================================================
#  PDF
# ==========================================================================
def construir_pdf(destino):
    ANCHO, ALTO = letter
    MARGEN = 2.2 * cm
    util = ANCHO - 2 * MARGEN

    base = getSampleStyleSheet()
    st = {
        'uni': ParagraphStyle('uni', parent=base['Normal'], fontName='Helvetica-Bold',
                              fontSize=15, leading=20, alignment=TA_CENTER,
                              textColor=AZUL, spaceAfter=4),
        'esc': ParagraphStyle('esc', parent=base['Normal'], fontName='Helvetica',
                              fontSize=11.5, leading=16, alignment=TA_CENTER,
                              textColor=GRIS),
        'etiqueta': ParagraphStyle('etiqueta', parent=base['Normal'],
                                   fontName='Helvetica', fontSize=10.5, leading=15,
                                   alignment=TA_CENTER, textColor=GRIS),
        'titulo': ParagraphStyle('titulo', parent=base['Normal'],
                                 fontName='Helvetica-Bold', fontSize=19, leading=25,
                                 alignment=TA_CENTER, textColor=AZUL),
        'tec': ParagraphStyle('tec', parent=base['Normal'], fontName='Helvetica-Bold',
                              fontSize=13, leading=18, alignment=TA_CENTER,
                              textColor=AZUL_CLARO),
        'dato': ParagraphStyle('dato', parent=base['Normal'], fontName='Helvetica',
                               fontSize=11.5, leading=19, alignment=TA_CENTER),
        'h2': ParagraphStyle('h2', parent=base['Normal'], fontName='Helvetica-Bold',
                             fontSize=14, leading=19, textColor=AZUL,
                             spaceBefore=4, spaceAfter=8),
        'cuerpo': ParagraphStyle('cuerpo', parent=base['Normal'],
                                 fontName='Helvetica', fontSize=10.5, leading=16,
                                 alignment=TA_JUSTIFY, textColor=colors.HexColor('#1f2937')),
        'pie_img': ParagraphStyle('pie_img', parent=base['Normal'],
                                  fontName='Helvetica-Oblique', fontSize=9,
                                  leading=13, alignment=TA_CENTER, textColor=GRIS,
                                  spaceBefore=6),
        'celda': ParagraphStyle('celda', parent=base['Normal'], fontName='Helvetica',
                                fontSize=10.5, leading=15),
        'celda_b': ParagraphStyle('celda_b', parent=base['Normal'],
                                  fontName='Helvetica-Bold', fontSize=10.5,
                                  leading=15, textColor=AZUL),
    }

    def linea(ancho=util, color=BORDE, grosor=0.8):
        t = Table([['']], colWidths=[ancho], rowHeights=[grosor])
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), color)]))
        return t

    def numero_pagina(canvas, doc, ancho=ANCHO):
        """Pie de página con numeración (no se dibuja en la portada)."""
        if doc.page == 1:
            return
        margen = MARGEN if ancho == ANCHO else 1.6 * cm
        canvas.saveState()
        canvas.setFont('Helvetica', 8.5)
        canvas.setFillColor(GRIS)
        canvas.drawCentredString(ancho / 2, 1.1 * cm, str(doc.page))
        titulo_pie = DATOS['actividad']
        if ancho == ANCHO:
            titulo_pie = 'Tarjeta digital de empleado · Vue + PrimeVue'
        canvas.drawString(margen, 1.1 * cm, titulo_pie)
        canvas.drawRightString(ancho - margen, 1.1 * cm, DATOS['alumno'])
        canvas.setStrokeColor(BORDE)
        canvas.setLineWidth(0.6)
        canvas.line(margen, 1.55 * cm, ancho - margen, 1.55 * cm)
        canvas.restoreState()

    doc = BaseDocTemplate(destino, pagesize=letter,
                          leftMargin=MARGEN, rightMargin=MARGEN,
                          topMargin=MARGEN, bottomMargin=2.4 * cm,
                          title='Evidencia · Tarjeta digital de empleado',
                          author=DATOS['alumno'],
                          subject=DATOS['actividad'])

    # Las capturas van en páginas horizontales para que se lean mejor
    MARGEN_H = 1.6 * cm
    util_h = ALTO - 2 * MARGEN_H
    marco = Frame(MARGEN, 2.4 * cm, util, ALTO - MARGEN - 2.4 * cm, id='cuerpo')
    marco_h = Frame(MARGEN_H, 2.0 * cm, util_h, ANCHO - MARGEN_H - 2.0 * cm,
                    id='cuerpo-h')
    doc.addPageTemplates([
        PageTemplate(id='normal', frames=[marco], onPage=numero_pagina),
        PageTemplate(id='captura', pagesize=(ALTO, ANCHO), frames=[marco_h],
                     onPage=lambda c, d: numero_pagina(c, d, ancho=ALTO)),
    ])

    f = []

    # ---------------- Portada ----------------
    f += [Spacer(1, 0.6 * cm),
          Paragraph(DATOS['universidad'], st['uni']),
          Paragraph(DATOS['escuela'], st['esc']),
          Spacer(1, 0.45 * cm), linea(util * 0.45, AZUL, 1.4), Spacer(1, 2.6 * cm),
          Paragraph('Actividad', st['etiqueta']), Spacer(1, 0.25 * cm),
          Paragraph(DATOS['actividad'], st['titulo']), Spacer(1, 0.7 * cm),
          Paragraph('Tecnología: %s' % DATOS['tecnologia'], st['tec']),
          Spacer(1, 2.6 * cm), linea(util * 0.3), Spacer(1, 1.0 * cm),
          Paragraph('Asignatura', st['etiqueta']),
          Paragraph('<b>%s</b>' % DATOS['asignatura'], st['dato']),
          Spacer(1, 0.6 * cm),
          Paragraph('Alumno', st['etiqueta']),
          Paragraph('<b>%s</b>' % DATOS['alumno'], st['dato']),
          Paragraph(DATOS['grado'], st['etiqueta']),
          Spacer(1, 0.6 * cm),
          Paragraph('Docente', st['etiqueta']),
          Paragraph('<b>%s</b>' % DATOS['docente'], st['dato']),
          Spacer(1, 1.8 * cm),
          Paragraph('%s · %s' % (DATOS['lugar'], DATOS['fecha']), st['etiqueta']),
          PageBreak()]

    # ---------------- Datos de publicación ----------------
    f += [Paragraph('1. Datos de la práctica', st['h2'])]

    filas = [
        ('Actividad', DATOS['actividad']),
        ('Tecnología', 'Vue 3 · Vite · PrimeVue 4 (tema Aura) · PrimeIcons · Vue Router · '
                       'Chart.js · qrcode.vue · JsBarcode · html-to-image · jsPDF'),
        ('Repositorio de GitHub',
         '<link href="%s" color="#2563eb">%s</link>' % (DATOS['repo'], DATOS['repo'])),
        ('Dominio gratuito (URL)',
         '<link href="%s" color="#2563eb"><b>%s</b></link>' % (DATOS['url'], DATOS['url'])),
        ('Hospedaje', 'Vercel (despliegue automático en cada push a la rama main)'),
        ('Alumno', '%s — %s' % (DATOS['alumno'], DATOS['grado'])),
    ]
    tabla = Table([[Paragraph(k, st['celda_b']), Paragraph(v, st['celda'])]
                   for k, v in filas],
                  colWidths=[util * 0.3, util * 0.7])
    tabla.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.6, BORDE),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f1f5f9')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    f += [tabla, Spacer(1, 0.55 * cm)]

    f += [Paragraph('2. Descripción de la solución', st['h2']),
          Paragraph(
              'Se construyó una interfaz de usuario de una sola página (SPA) con '
              '<b>Vue 3</b> y la biblioteca de componentes <b>PrimeVue 4</b>. La '
              'aplicación genera la <b>tarjeta digital de una persona empleada</b>: '
              'a partir del nombre, los apellidos y la fecha de nacimiento calcula el '
              '<b>RFC</b> de trece caracteres con el algoritmo del SAT (cuatro letras, '
              'la fecha AAMMDD, la homoclave y el dígito verificador) y arma la '
              'credencial con la fotografía, el puesto, un <b>código QR</b> en formato '
              'vCard y un <b>código de barras</b> CODE128.', st['cuerpo']),
          Spacer(1, 0.25 * cm),
          Paragraph(
              'La credencial puede descargarse como imagen PNG en alta resolución o '
              'como PDF con el tamaño estándar de una credencial CR80 (54 × 85.6 mm). '
              'Los registros se guardan en el navegador mediante <i>localStorage</i>, '
              'por lo que no se requiere servidor ni base de datos. El proyecto está '
              'publicado en <b>Vercel</b>, que entrega el dominio gratuito indicado '
              'arriba y vuelve a desplegarlo con cada actualización del repositorio.',
              st['cuerpo']),
          PageBreak()]
    modulos = [('Dashboard', 'Indicadores, registros recientes y última tarjeta generada.'),
               ('Demo Clientes', 'Captura de datos, cálculo del RFC y descarga en PNG o PDF.'),
               ('BarCode-QR', 'Generador de códigos QR y de barras configurables.'),
               ('Empleados', 'Tabla con búsqueda, orden, edición, baja y exportación a CSV.'),
               ('Gráficas', 'Estadísticas por puesto, por rango de edad y por día.'),
               ('Input', 'Componentes de captura de datos de PrimeVue.'),
               ('Float Label', 'Etiquetas flotantes (variantes over, in y on) e IftaLabel.'),
               ('Invalid State', 'Validación en vivo con la propiedad :invalid.'),
               ('Button', 'Variantes, tamaños, grupos y menús de botones.'),
               ('Table', 'DataTable con filtros, orden, selección y filas expandibles.'),
               ('List', 'Listbox, OrderList, DataView y PickList.'),
               ('Tree', 'Tree, TreeSelect y TreeTable con el organigrama.'),
               ('Panel', 'Toolbar, Panel, Fieldset, Tabs, Accordion, Card y Splitter.')]
    t2_tabla = Table([[Paragraph('<b>Módulo</b>', st['celda']),
                       Paragraph('<b>Función</b>', st['celda'])]] +
                     [[Paragraph(a, st['celda_b']), Paragraph(b, st['celda'])]
                      for a, b in modulos],
                     colWidths=[util * 0.3, util * 0.7])
    t2_tabla.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.6, BORDE),
        ('BACKGROUND', (0, 0), (-1, 0), AZUL),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    f += [Paragraph('3. Módulos de la aplicación', st['h2']), t2_tabla,
          NextPageTemplate('captura'), PageBreak()]


    # ---------------- Capturas ----------------
    cap = ParagraphStyle('cap', parent=st['pie_img'], fontSize=9.5, leading=14)
    for i, (archivo, titulo, descripcion) in enumerate(CAPTURAS):
        if not os.path.exists(ruta_captura(archivo)):
            continue
        if i:
            f.append(PageBreak())
        bloque = []
        if i == 0:
            bloque += [Paragraph('4. Impresiones de pantalla del navegador web',
                                 st['h2']),
                       Paragraph('Aplicación publicada en: '
                                 '<link href="%s" color="#2563eb"><b>%s</b></link>'
                                 % (DATOS['url'], DATOS['url']), st['cuerpo']),
                       Spacer(1, 0.3 * cm)]
        alto_disp = 13.0 * cm if i == 0 else 14.4 * cm
        ancho, alto = medidas(archivo, util_h)
        if alto > alto_disp:
            ancho, alto = ancho * alto_disp / alto, alto_disp
        img = RLImage(ruta_captura(archivo), width=ancho, height=alto)
        marco_img = Table([[img]], colWidths=[ancho])
        marco_img.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.8, BORDE),
                                       ('LEFTPADDING', (0, 0), (-1, -1), 0),
                                       ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                                       ('TOPPADDING', (0, 0), (-1, -1), 0),
                                       ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
        marco_img.hAlign = 'CENTER'
        bloque += [Paragraph('4.%d  %s' % (i + 1, titulo), st['h2']),
                   marco_img,
                   Paragraph('<b>Figura %d.</b> %s' % (i + 1, descripcion), cap)]
        f += bloque

    doc.build(f)
    print('PDF  generado:', destino)


# ==========================================================================
#  Word
# ==========================================================================
def construir_docx(destino):
    d = docx.Document()

    seccion = d.sections[0]
    seccion.top_margin = seccion.bottom_margin = Cm(2.2)
    seccion.left_margin = seccion.right_margin = Cm(2.2)
    ancho_util = Cm(21.59 - 4.4)

    normal = d.styles['Normal']
    normal.font.name = 'Calibri'
    normal.font.size = Pt(11)

    def p(texto='', *, tam=11, negrita=False, color=None, centrado=False,
          cursiva=False, antes=0, despues=6):
        par = d.add_paragraph()
        par.paragraph_format.space_before = Pt(antes)
        par.paragraph_format.space_after = Pt(despues)
        if centrado:
            par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if texto:
            r = par.add_run(texto)
            r.font.size = Pt(tam)
            r.bold = negrita
            r.italic = cursiva
            if color:
                r.font.color.rgb = RGBColor.from_string(color)
        return par

    def justificado(texto, despues=8):
        par = d.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        par.paragraph_format.space_after = Pt(despues)
        par.add_run(texto)
        return par

    def h2(texto):
        par = d.add_paragraph()
        par.paragraph_format.space_before = Pt(14)
        par.paragraph_format.space_after = Pt(8)
        r = par.add_run(texto)
        r.bold = True
        r.font.size = Pt(14)
        r.font.color.rgb = RGBColor.from_string('0F2A5C')
        return par

    def tabla(filas, encabezado=False):
        t = d.add_table(rows=0, cols=2)
        t.style = 'Table Grid'
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        for i, (a, b) in enumerate(filas):
            fila = t.add_row().cells
            fila[0].width = Cm(5.2)
            fila[1].width = Cm(11.9)
            ra = fila[0].paragraphs[0].add_run(a)
            ra.bold = True
            ra.font.size = Pt(10.5)
            ra.font.color.rgb = RGBColor.from_string(
                'FFFFFF' if (encabezado and i == 0) else '0F2A5C')
            rb = fila[1].paragraphs[0].add_run(b)
            rb.font.size = Pt(10.5)
            rb.bold = encabezado and i == 0
        return t

    # ---------------- Portada ----------------
    p()
    p(DATOS['universidad'], tam=16, negrita=True, color='0F2A5C', centrado=True, despues=2)
    p(DATOS['escuela'], tam=12, color='475569', centrado=True, despues=30)
    p('Actividad', tam=10.5, color='475569', centrado=True, despues=4)
    p(DATOS['actividad'], tam=19, negrita=True, color='0F2A5C', centrado=True, despues=14)
    p('Tecnología: %s' % DATOS['tecnologia'], tam=13, negrita=True,
      color='2563EB', centrado=True, despues=60)
    p('Asignatura', tam=10.5, color='475569', centrado=True, despues=2)
    p(DATOS['asignatura'], tam=12, negrita=True, centrado=True, despues=16)
    p('Alumno', tam=10.5, color='475569', centrado=True, despues=2)
    p(DATOS['alumno'], tam=12, negrita=True, centrado=True, despues=2)
    p(DATOS['grado'], tam=10.5, color='475569', centrado=True, despues=16)
    p('Docente', tam=10.5, color='475569', centrado=True, despues=2)
    p(DATOS['docente'], tam=12, negrita=True, centrado=True, despues=40)
    p('%s · %s' % (DATOS['lugar'], DATOS['fecha']), tam=10.5,
      color='475569', centrado=True)
    d.add_page_break()

    # ---------------- Datos ----------------
    h2('1. Datos de la práctica')
    tabla([
        ('Actividad', DATOS['actividad']),
        ('Tecnología', 'Vue 3 · Vite · PrimeVue 4 (tema Aura) · PrimeIcons · '
                       'Vue Router · Chart.js · qrcode.vue · JsBarcode · '
                       'html-to-image · jsPDF'),
        ('Repositorio de GitHub', DATOS['repo']),
        ('Dominio gratuito (URL)', DATOS['url']),
        ('Hospedaje', 'Vercel (despliegue automático en cada push a la rama main)'),
        ('Alumno', '%s — %s' % (DATOS['alumno'], DATOS['grado'])),
    ])

    h2('2. Descripción de la solución')
    justificado(
        'Se construyó una interfaz de usuario de una sola página (SPA) con Vue 3 y la '
        'biblioteca de componentes PrimeVue 4. La aplicación genera la tarjeta digital '
        'de una persona empleada: a partir del nombre, los apellidos y la fecha de '
        'nacimiento calcula el RFC de trece caracteres con el algoritmo del SAT '
        '(cuatro letras, la fecha AAMMDD, la homoclave y el dígito verificador) y arma '
        'la credencial con la fotografía, el puesto, un código QR en formato vCard y '
        'un código de barras CODE128.')
    justificado(
        'La credencial puede descargarse como imagen PNG en alta resolución o como PDF '
        'con el tamaño estándar de una credencial CR80 (54 × 85.6 mm). Los registros se '
        'guardan en el navegador mediante localStorage, por lo que no se requiere '
        'servidor ni base de datos. El proyecto está publicado en Vercel, que entrega '
        'el dominio gratuito indicado arriba y vuelve a desplegarlo con cada '
        'actualización del repositorio.')

    h2('3. Módulos de la aplicación')
    tabla([
        ('Módulo', 'Función'),
        ('Dashboard', 'Indicadores, registros recientes y última tarjeta generada.'),
        ('Demo Clientes', 'Captura de datos, cálculo del RFC y descarga en PNG o PDF.'),
        ('BarCode-QR', 'Generador de códigos QR y de barras configurables.'),
        ('Empleados', 'Tabla con búsqueda, orden, edición, baja y exportación a CSV.'),
        ('Gráficas', 'Estadísticas por puesto, por rango de edad y por día.'),
        ('Input', 'Componentes de captura de datos de PrimeVue.'),
        ('Float Label', 'Etiquetas flotantes (variantes over, in y on) e IftaLabel.'),
        ('Invalid State', 'Validación en vivo con la propiedad :invalid.'),
        ('Button', 'Variantes, tamaños, grupos y menús de botones.'),
        ('Table', 'DataTable con filtros, orden, selección y filas expandibles.'),
        ('List', 'Listbox, OrderList, DataView y PickList.'),
        ('Tree', 'Tree, TreeSelect y TreeTable con el organigrama.'),
        ('Panel', 'Toolbar, Panel, Fieldset, Tabs, Accordion, Card y Splitter.'),
    ], encabezado=True)

    # ---------------- Capturas (páginas horizontales) ----------------
    hor = d.add_section(WD_SECTION.NEW_PAGE)
    hor.orientation = WD_ORIENT.LANDSCAPE
    hor.page_width, hor.page_height = seccion.page_height, seccion.page_width
    hor.top_margin = hor.bottom_margin = Cm(1.6)
    hor.left_margin = hor.right_margin = Cm(1.6)
    ancho_util = hor.page_width - hor.left_margin - hor.right_margin

    h2('4. Impresiones de pantalla del navegador web')
    par = d.add_paragraph()
    par.add_run('URL de la aplicación publicada: ')
    r = par.add_run(DATOS['url'])
    r.bold = True
    r.font.color.rgb = RGBColor.from_string('2563EB')

    for i, (archivo, titulo, descripcion) in enumerate(CAPTURAS):
        if not os.path.exists(ruta_captura(archivo)):
            continue
        if i:
            d.add_page_break()
        h2('4.%d  %s' % (i + 1, titulo))
        alto_disp = Cm(13.0 if i == 0 else 14.4)
        with Image.open(ruta_captura(archivo)) as im:
            prop = im.size[1] / im.size[0]
        ancho = ancho_util
        if ancho * prop > alto_disp:
            ancho = Cm(alto_disp / prop / 360000)
        par = d.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        par.add_run().add_picture(ruta_captura(archivo), width=ancho)
        p('Figura %d. %s' % (i + 1, descripcion), tam=9.5, cursiva=True,
          color='475569', centrado=True, despues=10)

    d.save(destino)
    print('Word generado:', destino)


if __name__ == '__main__':
    construir_pdf(os.path.join(DOCS, BASE_NOMBRE + '.pdf'))
    construir_docx(os.path.join(DOCS, BASE_NOMBRE + '.docx'))
