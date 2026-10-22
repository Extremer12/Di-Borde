// Don Borde Order History Store
const ORDERS_STORAGE_KEY = 'don_borde_orders_v1';

const SEED_ORDERS = [
  {
    id: "DB-84920",
    date: "Ayer, 20:30 hs",
    status: "En camino",
    statusStep: 3, // 1: Recibido, 2: En el horno, 3: En camino, 4: Entregado
    items: [
      { name: "Pizzetas Clásicas Muzzarella (Pack x6)", quantity: 2, price: 6800 },
      { name: "Prepizza Tradicional de Masa Madre (Pack x2)", quantity: 1, price: 4900 }
    ],
    customer: {
      name: "Julián Albarracín",
      email: "julian@ejemplo.com",
      phone: "+54 11 4920-1122",
      address: "Av. Corrientes 3420, Piso 4 B",
      notes: "Tocar timbre 4B, dejar en portería si no atiende."
    },
    paymentMethod: "Mercado Pago",
    subtotal: 18500,
    shipping: 0,
    discount: 0,
    total: 18500,
    estimatedDelivery: "21:15 hs"
  },
  {
    id: "DB-81204",
    date: "04 Octubre, 19:15 hs",
    status: "Entregado",
    statusStep: 4,
    items: [
      { name: "Pack Familiar Don Borde", quantity: 1, price: 18500 },
      { name: "Pizzetas Fugazzeta Confitada", quantity: 1, price: 7400 }
    ],
    customer: {
      name: "Julián Albarracín",
      email: "julian@ejemplo.com",
      phone: "+54 11 4920-1122",
      address: "Av. Corrientes 3420, Piso 4 B",
      notes: ""
    },
    paymentMethod: "Transferencia Bancaria (10% OFF)",
    subtotal: 25900,
    shipping: 0,
    discount: 2590,
    total: 23310,
    estimatedDelivery: "Entregado a tiempo"
  }
];

class OrderStore {
  constructor() {
    this.listeners = new Set();
    this.orders = this.loadOrders();
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading orders', e);
    }
    return SEED_ORDERS;
  }

  saveOrders() {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch (e) {
      console.warn('Error saving orders', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.saveOrders();
    this.listeners.forEach(cb => cb(this.orders));
  }

  getOrders() {
    return this.orders;
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  createOrder(orderData) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: `DB-${randomNum}`,
      date: "Hoy, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " hs",
      status: "Recibido",
      statusStep: 1,
      ...orderData
    };

    this.orders.unshift(newOrder);
    this.notify();
    return newOrder;
  }
}

export const orderStore = new OrderStore();
