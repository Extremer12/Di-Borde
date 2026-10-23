// Di Borde Operations Store (Stock, Insumos, Compras, Ingresos/Egresos, Vendedores, Rendiciones y Sugerencias)
// Persistente en localStorage para gestión administrativa en tiempo real

const STORAGE_KEY = 'di_borde_admin_ops_v3';

const INITIAL_STATE = {
  // 1. Stock de Materias Primas / Insumos para elaborar y últimos precios de compra
  rawMaterials: [
    {
      id: 'mat-harina',
      name: 'Harina 000 Graciela',
      unit: 'kg',
      currentStock: 45,
      minStockAlert: 15,
      lastPurchasePrice: 803.38,
      lastPurchasePack: 'Pack x10 kg ($8.033,79)',
      lastPurchaseDate: '21/10/2026',
      supplier: 'Distribuidora Graciela'
    },
    {
      id: 'mat-queso',
      name: 'Queso Cremoso San Juan',
      unit: 'kg',
      currentStock: 14.5,
      minStockAlert: 5,
      lastPurchasePrice: 6200,
      lastPurchasePack: 'Horma 3,95 kg ($24.521)',
      lastPurchaseDate: '22/10/2026',
      supplier: 'Lácteos San Juan'
    },
    {
      id: 'mat-salsa',
      name: 'Salsa Realeza (Sachet)',
      unit: 'sachets',
      currentStock: 22,
      minStockAlert: 8,
      lastPurchasePrice: 1438,
      lastPurchasePack: 'Caja x12 sachets ($17.256)',
      lastPurchaseDate: '20/10/2026',
      supplier: 'Mayorista Alimentos'
    },
    {
      id: 'mat-bolsas',
      name: 'Bolsas Pre-pizzas',
      unit: 'bolsas',
      currentStock: 280,
      minStockAlert: 100,
      lastPurchasePrice: 91,
      lastPurchasePack: 'Pack x100 unidades ($9.100)',
      lastPurchaseDate: '19/10/2026',
      supplier: 'Papelera San Juan'
    },
    {
      id: 'mat-aceite',
      name: 'Aceite Girasol Legítimo',
      unit: 'botellas 900ml',
      currentStock: 6,
      minStockAlert: 2,
      lastPurchasePrice: 3300,
      lastPurchasePack: 'Caja x6 unidades ($19.800)',
      lastPurchaseDate: '18/10/2026',
      supplier: 'Distribuidora Centro'
    },
    {
      id: 'mat-levadura',
      name: 'Levadura',
      unit: 'paquetes 500g',
      currentStock: 5,
      minStockAlert: 2,
      lastPurchasePrice: 2850,
      lastPurchasePack: 'Pack x4 ($11.400)',
      lastPurchaseDate: '15/10/2026',
      supplier: 'Distribuidora Panadería'
    }
  ],

  // 2. Historial de compras de insumos
  purchases: [
    {
      id: 'PUR-101',
      date: '22/10/2026',
      materialId: 'mat-queso',
      materialName: 'Queso Cremoso San Juan',
      quantity: 11.85,
      unit: 'kg',
      unitPrice: 6200,
      totalAmount: 73470,
      supplier: 'Lácteos San Juan',
      notes: '3 hormas cerradas para producción de fin de semana'
    },
    {
      id: 'PUR-102',
      date: '21/10/2026',
      materialId: 'mat-harina',
      materialName: 'Harina 000 Graciela',
      quantity: 50,
      unit: 'kg',
      unitPrice: 803.38,
      totalAmount: 40169,
      supplier: 'Distribuidora Graciela',
      notes: '5 packs de 10kg'
    },
    {
      id: 'PUR-103',
      date: '19/10/2026',
      materialId: 'mat-bolsas',
      materialName: 'Bolsas Pre-pizzas',
      quantity: 200,
      unit: 'bolsas',
      unitPrice: 91,
      totalAmount: 18200,
      supplier: 'Papelera San Juan',
      notes: '2 packs de 100 bolsas'
    }
  ],

  // 3. Stock de productos terminados en obrador
  stock: {
    'pizzeta-con-queso': 120,            // 50g con queso cremoso
    'paquete-10-prepizzetas': 48,        // Paquetes x10 sin queso
    'paquete-2-prepizzas-grandes': 32    // Paquetes x2 grandes (400g c/u)
  },

  // 4. Registro de Ingresos y Egresos (Flujo de Caja del Negocio)
  cashflow: [
    {
      id: 'CF-001',
      date: '23/10/2026',
      type: 'ingreso',
      category: 'Rendición Vendedor',
      concept: 'Rendición Mateo Rivas (Turno Mañana)',
      amount: 12000,
      reference: 'Mateo Rivas'
    },
    {
      id: 'CF-002',
      date: '23/10/2026',
      type: 'ingreso',
      category: 'Venta Mayorista',
      concept: 'Cobro pedido Café San Juan (6x paq x10)',
      amount: 14000,
      reference: 'PED-201'
    },
    {
      id: 'CF-003',
      date: '22/10/2026',
      type: 'egreso',
      category: 'Compra Insumos',
      concept: 'Compra Queso Cremoso (3 hormas Lácteos San Juan)',
      amount: 73470,
      reference: 'PUR-101'
    },
    {
      id: 'CF-004',
      date: '22/10/2026',
      type: 'ingreso',
      category: 'Venta al Paso',
      concept: 'Venta directa en obrador (Pizzetas y packs familiares)',
      amount: 18500,
      reference: 'Venta Obrador'
    },
    {
      id: 'CF-005',
      date: '21/10/2026',
      type: 'egreso',
      category: 'Servicios / Gas',
      concept: 'Recarga garrafa gas obrador',
      amount: 16500,
      reference: 'Gas Chimbas'
    }
  ],

  // 5. Vendedores / Revendedores registrados
  resellers: [
    {
      id: 'rev-lucas',
      name: 'Lucas Gómez',
      phone: '264 512-3456',
      zone: 'Chimbas Centro / Plaza',
      initials: 'LG',
      status: 'activo',
      // Mercadería en calle hoy
      assigned: {
        pizzetasQueso: 15,       // PVP $800 ($12.000) · Rendición $400 ($6.000)
        paquetes10: 4,          // PVP $2.500 ($10.000) · Rendición $2.000 ($8.000)
        paquetesGrandes: 2,     // PVP $2.500 ($5.000) · Rendición $1.800 ($3.600)
        totalPvp: 27000,
        totalRendicion: 17600,
        gananciaVendedor: 9400,
        rendicionCobrada: 0,
        renditionStatus: 'debe_rendir', // 'debe_rendir' | 'al_dia' | 'parcial'
        assignedDate: 'Hoy 11:30 hs'
      },
      debtAmount: 7500,
      debtReason: 'Mercadería consumida en la jornada anterior sin rendir',
      debtDate: '21/10/2026'
    },
    {
      id: 'rev-mateo',
      name: 'Mateo Rivas',
      phone: '264 588-9911',
      zone: 'Chimbas Norte',
      initials: 'MR',
      status: 'activo',
      assigned: {
        pizzetasQueso: 15,
        paquetes10: 3,
        paquetesGrandes: 0,
        totalPvp: 19500,
        totalRendicion: 12000,
        gananciaVendedor: 7500,
        rendicionCobrada: 12000,
        renditionStatus: 'al_dia',
        assignedDate: 'Hoy 09:00 hs'
      },
      debtAmount: 0,
      debtReason: null,
      debtDate: null
    },
    {
      id: 'rev-joaquin',
      name: 'Joaquín Pereyra',
      phone: '264 577-4422',
      zone: 'Almacenes y Kioscos San Juan',
      initials: 'JP',
      status: 'activo',
      assigned: {
        pizzetasQueso: 8,
        paquetes10: 5,
        paquetesGrandes: 3,
        totalPvp: 26400,
        totalRendicion: 18600,
        gananciaVendedor: 7800,
        rendicionCobrada: 10000,
        renditionStatus: 'parcial',
        assignedDate: 'Hoy 14:00 hs'
      },
      debtAmount: 8600,
      debtReason: 'Rendición parcial de turno tarde',
      debtDate: '22/10/2026'
    }
  ],

  // 6. Reportes de Venta y Sugerencias de los Vendedores
  resellerNotes: [
    {
      id: 'NOTE-301',
      resellerId: 'rev-lucas',
      resellerName: 'Lucas Gómez',
      date: 'Hoy 15:20',
      type: 'sugerencia',
      content: 'Los clientes en la plaza me preguntan si podemos tener una variedad con orégano o aceitunas en las pizzetas individuales.',
      status: 'pendiente_accion'
    },
    {
      id: 'NOTE-302',
      resellerId: 'rev-mateo',
      resellerName: 'Mateo Rivas',
      date: 'Hoy 12:45',
      type: 'venta',
      content: 'En Chimbas Norte vendí las 15 pizzetas en menos de dos horas. Para mañana necesitaría salir con 25 pizzetas y 6 paquetes x10.',
      status: 'leido'
    },
    {
      id: 'NOTE-303',
      resellerId: 'rev-joaquin',
      resellerName: 'Joaquín Pereyra',
      date: 'Ayer 18:30',
      type: 'pedido_cliente',
      content: 'El almacén San Cayetano de calle Mendoza quiere coordinar 10 paquetes de pre-pizzetas x10 para todos los viernes por la mañana.',
      status: 'pendiente_accion'
    }
  ],

  // 7. Pedidos de clientes y comercios
  orders: [
    {
      id: 'PED-201',
      customerName: 'Café San Juan',
      phone: '264 544-3322',
      address: 'Rivadavia 142 Este',
      itemsSummary: '6x Paquete x10 Pre-pizzetas ($2.333 c/u)',
      total: 14000,
      status: 'entregado_cobrado', // 'pendiente' | 'en_elaboracion' | 'en_reparto' | 'entregado_cobrado'
      date: 'Hoy 16:45',
      deliveryType: 'delivery',
      paymentMethod: 'Transferencia bancaria'
    },
    {
      id: 'PED-202',
      customerName: 'Kiosco El Sol (Chimbas)',
      phone: '264 566-7788',
      address: 'Mendoza 840 Sur',
      itemsSummary: '3x Paquete x10 ($7.000) + 3x Paquete x2 Grandes ($6.000)',
      total: 13000,
      status: 'en_reparto',
      date: 'Hoy 19:15',
      deliveryType: 'delivery',
      paymentMethod: 'Efectivo al recibir'
    },
    {
      id: 'PED-203',
      customerName: 'Mariela Quiroga',
      phone: '264 533-1122',
      address: 'Retiro en Obrador (Chimbas)',
      itemsSummary: '2x Paquete x2 Pre-pizzas Grandes (400g c/u)',
      total: 5000,
      status: 'en_elaboracion',
      date: 'Hoy 20:30',
      deliveryType: 'pickup',
      paymentMethod: 'Efectivo en mano'
    },
    {
      id: 'PED-204',
      customerName: 'Bar Las Palmeras',
      phone: '264 599-0011',
      address: 'Salta 310 Norte, Chimbas',
      itemsSummary: '10x Paquete x10 Pre-pizzetas (Super Mayorista $20.000)',
      total: 20000,
      status: 'pendiente',
      date: 'Hoy 21:00',
      deliveryType: 'delivery',
      paymentMethod: 'A convenir'
    }
  ]
};

// Cargar o inicializar estado desde localStorage
export function loadAdminOpsState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.rawMaterials && parsed.resellers && parsed.cashflow) {
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
