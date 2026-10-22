// Don Borde Reactive Cart Store with B2B Tiered Pricing & WhatsApp Integration
const CART_STORAGE_KEY = 'don_borde_cart_v2';
const FREE_SHIPPING_THRESHOLD = 25000;
const BASE_SHIPPING_COST = 3200;
export const DON_BORDE_WHATSAPP_PHONE = '5492645261991';

class CartStore {
  constructor() {
    this.listeners = new Set();
    this.isOpen = false;
    this.activeChannel = 'minorista'; // 'minorista', 'mayorista', 'preventistas'
    this.coupon = null;
    this.items = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.coupon) this.coupon = parsed.coupon;
        if (parsed.activeChannel) this.activeChannel = parsed.activeChannel;
        return Array.isArray(parsed.items) ? parsed.items : [];
      }
    } catch (e) {
      console.warn('Error loading cart from storage', e);
    }
    return [];
  }

  saveToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: this.items,
        coupon: this.coupon,
        activeChannel: this.activeChannel
      }));
    } catch (e) {
      console.warn('Error saving cart to storage', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(cb => {
      try {
        cb(this);
      } catch (e) {
        console.error(e);
      }
    });
  }

  setChannel(channel) {
    this.activeChannel = channel;
    this.notify();
  }

  getItems() {
    return this.items;
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate actual unit price for an item, factoring in B2B tier rules
  getItemUnitPrice(item) {
    const p = item.product;
    if (p.isTieredDiscount && p.tierPromoQty && item.quantity >= p.tierPromoQty) {
      return p.tierPromoPrice;
    }
    return p.price;
  }

  hasTierDiscountApplied(item) {
    const p = item.product;
    return Boolean(p.isTieredDiscount && p.tierPromoQty && item.quantity >= p.tierPromoQty);
  }

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        product: { ...product },
        quantity: quantity
      });
    }
    this.notify();
    return true;
  }

  updateQuantity(productId, quantity) {
    const targetIndex = this.items.findIndex(item => item.product.id === productId);
    if (targetIndex > -1) {
      if (quantity <= 0) {
        this.items.splice(targetIndex, 1);
      } else {
        this.items[targetIndex].quantity = quantity;
      }
      this.notify();
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.notify();
  }

  clearCart() {
    this.items = [];
    this.coupon = null;
    this.notify();
  }

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'DONBORDE10') {
      this.coupon = { code: 'DONBORDE10', discountPercent: 10, label: '10% OFF Especial' };
      this.notify();
      return { success: true, message: '¡Cupón DONBORDE10 aplicado! 10% de descuento.' };
    }
    if (cleanCode === 'BIENVENIDA') {
      this.coupon = { code: 'BIENVENIDA', discountPercent: 15, label: '15% OFF Bienvenida' };
      this.notify();
      return { success: true, message: '¡Cupón BIENVENIDA aplicado! 15% de descuento.' };
    }
    if (cleanCode === 'BORDEGRATIS') {
      this.coupon = { code: 'BORDEGRATIS', freeShipping: true, label: 'Envío Bonificado' };
      this.notify();
      return { success: true, message: '¡Envío bonificado al 100%!' };
    }
    return { success: false, message: 'Cupón no válido o vencido.' };
  }

  removeCoupon() {
    this.coupon = null;
    this.notify();
  }

  getSubtotal() {
    return this.items.reduce((total, item) => {
      const unitPrice = this.getItemUnitPrice(item);
      return total + (unitPrice * item.quantity);
    }, 0);
  }

  getDiscount() {
    const subtotal = this.getSubtotal();
    if (!this.coupon) return 0;
    if (this.coupon.discountPercent) {
      return Math.round((subtotal * this.coupon.discountPercent) / 100);
    }
    return 0;
  }

  getShippingCost() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    if (this.coupon && this.coupon.freeShipping) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return BASE_SHIPPING_COST;
  }

  getFreeShippingThreshold() {
    return FREE_SHIPPING_THRESHOLD;
  }

  getAmountUntilFreeShipping() {
    const subtotal = this.getSubtotal();
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    return remaining > 0 ? remaining : 0;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = this.getShippingCost();
    return Math.max(0, subtotal - discount + shipping);
  }

  toggleDrawer(state) {
    if (typeof state === 'boolean') {
      this.isOpen = state;
    } else {
      this.isOpen = !this.isOpen;
    }
    this.notify();
  }

  // Generate structured, professional WhatsApp order link
  buildWhatsAppMessage(customer = {}, deliveryType = 'delivery', channel = null) {
    const activeCh = channel || this.activeChannel || 'minorista';
    let channelLabel = 'Consumidor Final / Al Paso';
    if (activeCh === 'mayorista') channelLabel = 'Comercio / Cafetería (B2B)';
    if (activeCh === 'preventistas') channelLabel = 'Preventista / Vendedor de Calle';

    const items = this.getItems();
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = deliveryType === 'pickup' ? 0 : this.getShippingCost();
    const total = Math.max(0, subtotal - discount + shipping);

    let lines = [];
    lines.push('🍕 *NUEVO PEDIDO - DON BORDE*');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`🏢 *Canal:* ${channelLabel}`);
    if (customer.name) lines.push(`👤 *Cliente / Razón Social:* ${customer.name}`);
    if (customer.phone) lines.push(`📱 *Teléfono:* ${customer.phone}`);
    if (customer.rubro) lines.push(`🏷️ *Rubro:* ${customer.rubro}`);
    lines.push(`🚚 *Entrega:* ${deliveryType === 'pickup' ? 'Retiro en Obrador (Palermo)' : 'Envío a Domicilio'}`);
    if (deliveryType !== 'pickup' && customer.address) {
      lines.push(`📍 *Dirección:* ${customer.address} (${customer.zone || 'CABA'})`);
    }
    lines.push('');
    lines.push('📦 *DETALLE DE PRODUCTOS:*');

    items.forEach(it => {
      const unitPrice = this.getItemUnitPrice(it);
      const isTier = this.hasTierDiscountApplied(it);
      const tierNote = isTier ? ' *(Promo 3+ mayorista aplicada)*' : '';
      lines.push(`• *${it.quantity}x* ${it.product.name} - $${(unitPrice * it.quantity).toLocaleString('es-AR')}${tierNote}`);
    });

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`💰 *Subtotal:* $${subtotal.toLocaleString('es-AR')}`);
    if (discount > 0) {
      lines.push(`🏷️ *Descuento:* -$${discount.toLocaleString('es-AR')} (${this.coupon ? this.coupon.label : ''})`);
    }
    lines.push(`🚚 *Envío:* ${shipping === 0 ? 'GRATIS' : '$' + shipping.toLocaleString('es-AR')}`);
    lines.push(`🔥 *TOTAL:* $${total.toLocaleString('es-AR')}`);

    if (customer.notes) {
      lines.push('');
      lines.push(`📝 *Notas:* ${customer.notes}`);
    }

    lines.push('');
    lines.push('¡Aguardo confirmación para coordinar entrega/retiro! 🙌');

    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=${encoded}`;
  }
}

export const cartStore = new CartStore();
