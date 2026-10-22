import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, calculateItemSubtotal } from '../data/products.js';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'di_borde_cart_v3';
const FREE_SHIPPING_THRESHOLD = 25000;
const BASE_SHIPPING_COST = 3000;
export const DI_BORDE_WHATSAPP_PHONE = '5492645261991';
export const DON_BORDE_WHATSAPP_PHONE = DI_BORDE_WHATSAPP_PHONE;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed.items) ? parsed.items : [];
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
    return [];
  });

  const [activeChannel, setActiveChannel] = useState('minorista');
  const [coupon, setCoupon] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items,
        activeChannel,
        coupon
      }));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }, [items, activeChannel, coupon]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
  };

  // Helper de cálculo de línea con descuento por volumen
  const getItemPricing = (item) => {
    return calculateItemSubtotal(item.product.id, item.quantity, item.product.price);
  };

  const getItemUnitPrice = (item) => {
    return getItemPricing(item).unitPrice;
  };

  const hasTierDiscountApplied = (item) => {
    return getItemPricing(item).isDiscounted;
  };

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((it) => it.product.id === product.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    showToast(`¡${product.name} sumado al pedido!`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'DIBORDE10' || clean === 'DONBORDE10') {
      const c = { code: 'DIBORDE10', discountPercent: 10, label: '10% OFF Especial' };
      setCoupon(c);
      showToast('¡Cupón aplicado! 10% de descuento');
      return { success: true };
    }
    if (clean === 'BIENVENIDA') {
      const c = { code: 'BIENVENIDA', discountPercent: 15, label: '15% OFF Bienvenida' };
      setCoupon(c);
      showToast('¡Cupón BIENVENIDA aplicado! 15% de descuento');
      return { success: true };
    }
    return { success: false, message: 'Cupón no válido o vencido.' };
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Cupón removido');
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Subtotal oficial con descuentos por volumen aplicados automáticamente
  const subtotal = items.reduce((sum, item) => {
    const pricing = getItemPricing(item);
    return sum + pricing.total;
  }, 0);

  // Total precio base sin descuento para calcular el ahorro
  const regularSubtotal = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const tieredSavings = Math.max(0, regularSubtotal - subtotal);

  const discount = coupon?.discountPercent
    ? Math.round((subtotal * coupon.discountPercent) / 100)
    : 0;

  const isShippingFree = Boolean(
    coupon?.freeShipping || (subtotal > 0 && subtotal >= FREE_SHIPPING_THRESHOLD)
  );

  const shippingCost = subtotal === 0 ? 0 : isShippingFree ? 0 : BASE_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Generador de mensaje de WhatsApp con formato prolijo
  const buildWhatsAppUrl = (customer = {}, deliveryType = 'delivery', channelOverride = null) => {
    const deliveryCost = deliveryType === 'pickup' ? 0 : shippingCost;
    const finalTotal = Math.max(0, subtotal - discount + deliveryCost);

    let lines = [];
    lines.push('*PEDIDO - DI BORDE*');
    lines.push('------------------------------------');
    if (customer.name) lines.push(`*Nombre:* ${customer.name}`);
    if (customer.phone) lines.push(`*Teléfono:* ${customer.phone}`);
    lines.push(`*Modalidad:* ${deliveryType === 'pickup' ? 'Retiro en Obrador' : 'Envío a Domicilio'}`);
    if (deliveryType !== 'pickup' && customer.address) {
      lines.push(`*Dirección:* ${customer.address}`);
    }
    lines.push('');
    lines.push('*DETALLE DEL PEDIDO:*');

    items.forEach((it) => {
      const pricing = getItemPricing(it);
      const tierTag = pricing.discountLabel ? ` (${pricing.discountLabel})` : '';
      lines.push(`• ${it.quantity}x ${it.product.name}: $${pricing.total.toLocaleString('es-AR')}${tierTag}`);
    });

    lines.push('');
    lines.push('------------------------------------');
    lines.push(`*Subtotal:* $${subtotal.toLocaleString('es-AR')}`);
    if (tieredSavings > 0) {
      lines.push(`*Ahorro por volumen aplicado:* -$${tieredSavings.toLocaleString('es-AR')}`);
    }
    if (discount > 0) {
      lines.push(`*Cupón (${coupon?.code}):* -$${discount.toLocaleString('es-AR')}`);
    }
    lines.push(`*Envío:* ${deliveryCost === 0 ? 'Sin cargo / Retiro' : '$' + deliveryCost.toLocaleString('es-AR')}`);
    lines.push(`*TOTAL:* $${finalTotal.toLocaleString('es-AR')}`);

    if (customer.notes) {
      lines.push('');
      lines.push(`*Notas:* ${customer.notes}`);
    }

    lines.push('');
    lines.push('Hola Di Borde, envío mi pedido para coordinar la entrega.');

    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`;
  };

  // WhatsApp directo para Revendedores
  const buildResellerWhatsAppUrl = (quantities = {}) => {
    let lines = [];
    lines.push('*CONSULTA REVENDEDOR - DI BORDE*');
    lines.push('------------------------------------');
    lines.push('Hola Di Borde, consulto por el esquema de rendición para venta directa.');
    lines.push('');
    lines.push('*Esquema Oficial de Rendición:*');
    lines.push('• Pizzeta con Queso: Rendición $400 (PVP $800 → Ganancia: $400)');
    lines.push('• Paquete x10 Pre-pizzetas: Rendición $2.000 (PVP $2.500 → Ganancia: $500)');
    lines.push('• Paquete x2 Pre-pizzas Grandes: Rendición $1.800 (PVP $2.500 → Ganancia: $700)');
    lines.push('');
    if (quantities.pizzetas || quantities.paquetes10 || quantities.paquetesGrandes) {
      lines.push('*Pedido estimado inicial:*');
      if (quantities.pizzetas) lines.push(`- Pizzetas con queso: ${quantities.pizzetas} unidades`);
      if (quantities.paquetes10) lines.push(`- Paquetes x10 Pre-pizzetas: ${quantities.paquetes10} paquetes`);
      if (quantities.paquetesGrandes) lines.push(`- Paquetes x2 Pre-pizzas Grandes: ${quantities.paquetesGrandes} paquetes`);
      lines.push('');
    }
    lines.push('¿Por dónde puedo retirar o coordinar entrega? Gracias.');

    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        activeChannel,
        setActiveChannel,
        coupon,
        isDrawerOpen,
        setIsDrawerOpen,
        toastMessage,
        setToastMessage,
        showToast,
        getItemPricing,
        getItemUnitPrice,
        hasTierDiscountApplied,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        tieredSavings,
        discount,
        shippingCost,
        total,
        isShippingFree,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
        freeShippingProgress,
        buildWhatsAppUrl,
        buildResellerWhatsAppUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
