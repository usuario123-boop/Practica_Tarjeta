import { describe, it, expect } from 'vitest'
import { calcularRFC, obtenerLetras, normalizar } from '../src/utils/rfc'
import { validarEmpleado } from '../src/utils/validaciones'
import { calcularEdad, aFechaISO, deFechaISO } from '../src/utils/fecha'

describe('calcularRFC', () => {
  it('coincide con el ejemplo oficial del SAT', () => {
    expect(calcularRFC({ nombre: 'Juan', paterno: 'Barrios', materno: 'Fernández', fechaNacimiento: '1970-12-13' }))
      .toBe('BAFJ701213SBA')
  })

  it('calcula el RFC del mockup (Susana Rojas Merida)', () => {
    const rfc = calcularRFC({ nombre: 'Susana', paterno: 'Rojas', materno: 'Merida', fechaNacimiento: '1992-08-22' })
    expect(rfc.slice(0, 10)).toBe('ROMS920822')
    expect(rfc).toHaveLength(13)
  })

  it('acepta un objeto Date', () => {
    expect(calcularRFC({ nombre: 'Juan', paterno: 'Barrios', materno: 'Fernandez', fechaNacimiento: new Date(1970, 11, 13) }))
      .toBe('BAFJ701213SBA')
  })

  it('regresa vacío si faltan datos', () => {
    expect(calcularRFC({ nombre: '', paterno: 'Rojas', materno: '', fechaNacimiento: '1992-08-22' })).toBe('')
    expect(calcularRFC({ nombre: 'Ana', paterno: 'Rojas', materno: '', fechaNacimiento: null })).toBe('')
  })
})

describe('obtenerLetras', () => {
  it('omite JOSE o MARIA cuando hay un segundo nombre', () => {
    expect(obtenerLetras('José Antonio', 'López', 'Ayala')).toBe('LOAA')
    expect(obtenerLetras('María Fernanda', 'Pérez', 'Gómez')).toBe('PEGF')
  })

  it('sin apellido materno usa 2 letras del paterno y 2 del nombre', () => {
    expect(obtenerLetras('Juan', 'Pérez', '')).toBe('PEJU')
  })

  it('quita partículas como DE LA', () => {
    expect(obtenerLetras('Ana', 'de la Cruz', 'Ruiz')).toBe('CURA')
  })

  it('reemplaza palabras inconvenientes', () => {
    expect(obtenerLetras('Oscar', 'Pérez', 'Domínguez')).toBe('PEDX')
  })
})

describe('normalizar', () => {
  it('quita acentos y conserva la Ñ', () => {
    expect(normalizar('  Peña   Ávila ')).toBe('PEÑA AVILA')
  })
})

describe('validarEmpleado', () => {
  it('no marca errores con datos correctos', () => {
    expect(validarEmpleado({ nombre: 'Ana', paterno: 'Ruiz', materno: '', fechaNacimiento: '1995-01-01', puesto: 'Analista' })).toEqual({})
  })

  it('marca campos obligatorios y fechas inválidas', () => {
    const errores = validarEmpleado({ nombre: '', paterno: 'R0jas', materno: '', fechaNacimiento: '2030-01-01', puesto: '' })
    expect(Object.keys(errores).sort()).toEqual(['fechaNacimiento', 'nombre', 'paterno', 'puesto'])
  })
})

describe('fechas', () => {
  it('convierte entre Date y texto sin moverse de día', () => {
    expect(aFechaISO(deFechaISO('1992-08-22'))).toBe('1992-08-22')
  })

  it('calcula la edad cumplida', () => {
    expect(calcularEdad('2000-06-15', new Date(2026, 5, 14))).toBe(25)
    expect(calcularEdad('2000-06-15', new Date(2026, 5, 15))).toBe(26)
  })
})
