// Estructura del menú lateral (mismo orden que el mockup de la práctica)
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
      { label: 'Demo Clientes', icon: 'pi pi-id-card', to: '/formClientes' },
      { label: 'BarCode-QR', icon: 'pi pi-qrcode', to: '/codigos' },
      { label: 'Empleados', icon: 'pi pi-users', to: '/empleados' },
      { label: 'Gráficas', icon: 'pi pi-chart-bar', to: '/graficas' },
      { label: 'Input', icon: 'pi pi-pencil', to: '/input' },
      { label: 'Float Label', icon: 'pi pi-tag', to: '/float-label' },
      { label: 'Invalid State', icon: 'pi pi-exclamation-circle', to: '/invalid-state' },
      { label: 'Button', icon: 'pi pi-stop', to: '/button' },
      { label: 'Table', icon: 'pi pi-table', to: '/table' },
      { label: 'List', icon: 'pi pi-list', to: '/list' },
      { label: 'Tree', icon: 'pi pi-sitemap', to: '/tree' },
      { label: 'Panel', icon: 'pi pi-window-maximize', to: '/panel' }
    ]
  }
])
