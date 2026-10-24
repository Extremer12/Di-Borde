// Di Borde Operations Store (Stock, Insumos, Compras, Ingresos/Egresos, Vendedores, Rendiciones y Pedidos)
// Persistente en localStorage para gestión operativa real y sincronizado con Supabase

const STORAGE_KEY = 'di_borde_admin_ops_v5';

const INITIAL_STATE = {
  // 1. Materias Primas / Insumos Oficiales de Di Borde (preparados para stock real)
  rawMaterials: [
    {
      id: 'mat-harina',
      name: 'Harina 000 Graciela',
      category: 'Materia Prima Base',
      unit: 'kg',
      currentStock: 0,
      minStockAlert: 15,
      lastPurchasePrice: 803.38,
      lastPurchasePack: 'Pack x10 kg ($8.033,79)',
      lastPurchaseDate: '',
      supplier: 'Distribuidora Graciela'
    },
    {
      id: 'mat-queso',
      name: 'Queso Cremoso',
      category: 'Materia Prima Base',
      unit: 'kg',
      currentStock: 0,
      minStockAlert: 5,
      lastPurchasePrice: 6200,
      lastPurchasePack: 'Horma (~4 kg)',
      lastPurchaseDate: '',
      supplier: 'Lácteos'
    },
    {
      id: 'mat-salsa',
      name: 'Salsa Realeza (Sachet)',
      category: 'Materia Prima Base',
      unit: 'sachets',
      currentStock: 0,
      minStockAlert: 8,
      lastPurchasePrice: 1438,
      lastPurchasePack: 'Caja x12 sachets ($17.256)',
      lastPurchaseDate: '',
      supplier: 'Mayorista'
    },
    {
      id: 'mat-bolsas',
      name: 'Bolsas Pre-pizzas',
      category: 'Empaque / Packaging',
      unit: 'bolsas',
      currentStock: 0,
      minStockAlert: 100,
      lastPurchasePrice: 91,
      lastPurchasePack: 'Pack x100 unidades ($9.100)',
      lastPurchaseDate: '',
      supplier: 'Papelera'
    },
    {
      id: 'mat-aceite',
      name: 'Aceite Girasol',
      category: 'Insumo',
      unit: 'botellas 900ml',
      currentStock: 0,
      minStockAlert: 2,
      lastPurchasePrice: 3300,
      lastPurchasePack: 'Botella 900ml',
      lastPurchaseDate: '',
      supplier: 'Distribuidora'
    },
    {
      id: 'mat-levadura',
      name: 'Levadura',
      category: 'Insumo',
      unit: 'paquetes 500g',
      currentStock: 0,
      minStockAlert: 2,
      lastPurchasePrice: 2850,
      lastPurchasePack: 'Pack x4 ($11.400)',
      lastPurchaseDate: '',
      supplier: 'Distribuidora Panadería'
    }
  ],

  // 2. Historial de compras de insumos (Vacío para registrar facturas y compras reales)
  purchases: [],

  // 3. Stock de productos terminados en obrador (Listo para registrar producción)
  stock: {
    'pizzeta-con-queso': 0,            // 50g con queso cremoso
    'paquete-10-prepizzetas': 0,        // Paquetes x10 sin queso
    'paquete-2-prepizzas-grandes': 0    // Paquetes x2 grandes (400g c/u)
  },

  // 4. Registro de Ingresos y Egresos (Flujo de Caja Real)
  cashflow: [],

  // 5. Nómina oficial de Vendedores autorizados (Limpio para agregar vendedores reales con correo de Google)
  resellers: [],

  // 6. Reportes de Venta y Sugerencias de los Vendedores
  resellerNotes: [],

  // 7. Pedidos de clientes y comercios
  orders: []
};

// Cargar o inicializar estado desde localStorage
export function loadAdminOpsState() {
  try {
    // Si existe la versión previa con datos ficticios (Lucas, Mateo, Joaquín), descartarla
    const oldV3 = localStorage.getItem('di_borde_admin_ops_v3');
    if (oldV3 && (oldV3.includes('Lucas Gómez') || oldV3.includes('rev-lucas'))) {
      localStorage.removeItem('di_borde_admin_ops_v3');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.rawMaterials && parsed.resellers && parsed.cashflow) {
        // Asegurar que no tenga residuos de vendedores ficticios anteriores
        if (parsed.resellers.some((r) => r.id === 'rev-lucas' || r.id === 'rev-mateo')) {
          saveAdminOpsState(INITIAL_STATE);
          return INITIAL_STATE;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Ops state load failed, initializing default', e);
  }
  saveAdminOpsState(INITIAL_STATE);
  return INITIAL_STATE;
}

export function saveAdminOpsState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Ops state save failed', e);
  }
}

export function resetAdminOpsStateToClean() {
  saveAdminOpsState(INITIAL_STATE);
  return INITIAL_STATE;
}

// Helper para calcular la rendición oficial de una asignación
export function calculateResellerAssignment(pizzetasQueso = 0, paquetes10 = 0, paquetesGrandes = 0) {
  const pvp = (pizzetasQueso * 800) + (paquetes10 * 2500) + (paquetesGrandes * 2500);
  const rendicion = (pizzetasQueso * 400) + (paquetes10 * 2000) + (paquetesGrandes * 1800);
  const ganancia = pvp - rendicion;

  return {
    totalPvp: pvp,
    totalRendicion: rendicion,
    gananciaVendedor: ganancia
  };
}
