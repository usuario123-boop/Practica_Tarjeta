// Estructura del menú lateral
export const MENU = Object.freeze([
  {
    titulo: 'Universidad Autónoma de Chiapas',
    items: [
      { label: 'Dashboard', icon: 'pi pi-home', to: '/' }
    ]
  },
  {
    titulo: 'Módulos',
    items: [
      { label: 'Tarjeta Digital', icon: 'pi pi-id-card', to: '/tarjeta' },
      { label: 'Empleados', icon: 'pi pi-users', to: '/empleados' },
      { label: 'BarCode-QR', icon: 'pi pi-qrcode', to: '/codigos' },
      { label: 'Gráficas', icon: 'pi pi-chart-bar', to: '/graficas' }
    ]
  }
])
