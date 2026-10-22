// Di Borde Operations Store (Stock, Revendedores, Asignaciones, Deudas y Pedidos)
// Persistente en localStorage para tiempo real - Sin emojis

const STORAGE_KEY = 'di_borde_ops_state_v2';

const INITIAL_STATE = {
  // 1. Stock total del Obrador en Chimbas - San Juan en tiempo real
  stock: {
    'pizzeta-con-queso': 140,            // Unidades individuales
    'paquete-10-prepizzetas': 52,        // Paquetes cerrados x10
    'paquete-2-prepizzas-grandes': 34    // Paquetes x2 pre-pizzas grandes
  },

  // 2. Revendedores registrados (Chicos de calle y vendedores independientes)
  resellers: [
    {
      id: 'rev-lucas',
      username: 'lucas',
      password: '123',
      name: 'Lucas Gómez',
      phone: '2645123456',
      zone: 'Chimbas / Centro',
      initials: 'LG',
      // Mercadería que se llevó hoy
      activeAssignment: {
        date: 'Hoy (Turno Tarde)',
        pizzetasQueso: 10,       // PVP $800 ($8.000) · Rendición $400 ($4.000)
        paquetes10: 4,          // PVP $2.500 ($10.000) · Rendición $2.000 ($8.000)
        paquetesGrandes: 2,     // PVP $2.500 ($5.000) · Rendición $1.800 ($3.600)
        totalPvp: 23000,
        totalRendicion: 15600,
        gananciaChico: 7400,
        rendicionPagada: 0,
        status: 'pending' // 'pending' | 'paid' | 'partial'
      },
      // Saldo en rojo / Deuda pendiente (Caso requerido: se comió la mercadería $7.500)
      debtAmount: 7500,
      debtReason: 'Mercadería consumida en la jornada anterior sin rendir',
      debtDate: '21/10/2026'
    },
    {
      id: 'rev-mateo',
      username: 'mateo',
      password: '123',
      name: 'Mateo Rivas',
      phone: '2645889911',
      zone: 'Chimbas Norte',
      initials: 'MR',
      activeAssignment: {
        date: 'Hoy (Turno Mañana)',
        pizzetasQueso: 15,
        paquetes10: 3,
        paquetesGrandes: 0,
        totalPvp: 19500,
        totalRendicion: 12000,
        gananciaChico: 7500,
        rendicionPagada: 12000,
        status: 'paid'
      },
      debtAmount: 0, // Al día, sin deuda
      debtReason: null,
      debtDate: null
    },
    {
      id: 'rev-joaquin',
      username: 'joaquin',
      password: '123',
      name: 'Joaquín Pereyra',
      phone: '2645774422',
      zone: 'Almacenes y Kioscos San Juan',
      initials: 'JP',
      activeAssignment: {
        date: 'Hoy (Turno Tarde)',
        pizzetasQueso: 6,
        paquetes10: 6,
        paquetesGrandes: 3,
        totalPvp: 27300,
        totalRendicion: 19800,
        gananciaChico: 7500,
        rendicionPagada: 10000,
        status: 'partial'
      },
      debtAmount: 9800,
      debtReason: 'Saldo restante de rendición de hoy',
      debtDate: '21/10/2026'
    }
  ],

  // 3. Pedidos del Obrador creados por el Administrador
  orders: [
    {
      id: 'PED-201',
      customerName: 'Café San Juan',
      phone: '2645443322',
      address: 'Rivadavia 142 Este',
      itemsSummary: '6x Paquete x10 Pre-pizzetas',
      total: 14000,
      status: 'entregado',
      date: 'Hoy 16:45',
      deliveryType: 'delivery'
    },
    {
      id: 'PED-202',
      customerName: 'Kiosco El Sol (Chimbas)',
      phone: '2645667788',
      address: 'Mendoza 840 Sur',
      itemsSummary: '4x Paquete x10 + 3x Paquete Grandes',
      total: 15333,
      status: 'en_camino',
      date: 'Hoy 19:15',
      deliveryType: 'delivery'
    },
    {
      id: 'PED-203',
      customerName: 'Mariela Quiroga',
      phone: '2645331122',
      address: 'Retira por Obrador (Chimbas)',
      itemsSummary: '2x Paquete x2 Pre-pizzas Grandes',
      total: 5000,
      status: 'pendiente',
      date: 'Hoy 20:30',
      deliveryType: 'pickup'
    }
  ]
};

// Cargar o inicializar estado desde localStorage
export function loadOpsState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.stock && parsed.resellers) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Ops state load failed, initializing default', e);
  }
  saveOpsState(INITIAL_STATE);
  return INITIAL_STATE;
}

export function saveOpsState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Ops state save failed', e);
  }
}

// Helper para calcular la rendición y el PVP de una asignación
export function calculateAssignmentTotals(pizzetasQueso = 0, paquetes10 = 0, paquetesGrandes = 0) {
  const pvp = (pizzetasQueso * 800) + (paquetes10 * 2500) + (paquetesGrandes * 2500);
  const rendicion = (pizzetasQueso * 400) + (paquetes10 * 2000) + (paquetesGrandes * 1800);
  const ganancia = pvp - rendicion;

  return {
    totalPvp: pvp,
    totalRendicion: rendicion,
    gananciaChico: ganancia
  };
}
