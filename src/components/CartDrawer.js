import { icons } from './icons.js';
import { cartStore } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';
import { router } from '../router.js';

export function renderCartDrawer(container) {
  function render() {
    const items = cartStore.getItems();
    const subtotal = cartStore.getSubtotal();
    const discount = cartStore.getDiscount();
    const shipping = cartStore.getShippingCost();
    const total = cartStore.getTotal();
    const threshold = cartStore.getFreeShippingThreshold();
    const amountUntilFree = cartStore.getAmountUntilFreeShipping();
    const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
    const isOpen = cartStore.isOpen;

    const itemsHtml = items.map(item => {
      const unitPrice = cartStore.getItemUnitPrice(item);
      const isTier = cartStore.hasTierDiscountApplied(item);
      return `
        <div class="cart-item" data-id="${item.product.id}">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
              <h4 class="cart-item-name">${item.product.name}</h4>
              <button class="btn-remove-item" data-action="remove" data-id="${item.product.id}" title="Eliminar ítem" aria-label="Eliminar ${item.product.name}">
                ${icons.trash('', 16)}
              </button>
            </div>
            <span class="cart-item-unit">${item.product.unit}</span>

            ${isTier ? `
              <div style="font-size: 0.72rem; color: var(--color-success); font-weight: 800; margin-bottom: 0.35rem;">
                ✓ Promo 3+ mayorista aplicada: $${unitPrice.toLocaleString('es-AR')} c/u
              </div>
            ` : ''}

            <div class="cart-item-row">
              <div class="qty-stepper">
                <button class="qty-btn" data-action="decrease" data-id="${item.product.id}" aria-label="Disminuir">${icons.minus('', 12)}</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.product.id}" aria-label="Aumentar">${icons.plus('', 12)}</button>
              </div>
              <span class="cart-item-price">$${(unitPrice * item.quantity).toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const emptyHtml = `
      <div class="cart-empty-view">
        <div class="cart-empty-icon">
          ${icons.pizza('', 36)}
        </div>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">TU CARRITO ESTÁ VACÍO</h3>
        <p style="margin-bottom: 2rem; max-width: 280px; font-size: 0.95rem;">
          Todavía no agregaste productos de Don Borde. ¡Pizzetas listas o para hornear te esperan!
        </p>
        <button class="btn btn-primary" id="btn-empty-shop">
          VER PRODUCTOS
        </button>
      </div>
    `;

    container.innerHTML = `
      <div class="drawer-backdrop ${isOpen ? 'active' : ''}" id="cart-backdrop"></div>
      <aside class="cart-drawer ${isOpen ? 'active' : ''}" id="cart-drawer-panel" aria-label="Carrito de compras">
        <!-- Header -->
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title">
            ${icons.cart('', 22)}
            TU PEDIDO (${cartStore.getItemCount()})
          </h2>
          <button class="action-btn" id="btn-close-cart" aria-label="Cerrar carrito">
            ${icons.close('', 20)}
          </button>
        </div>

        <!-- Free shipping bar -->
        ${items.length > 0 ? `
          <div class="free-shipping-bar">
            <div class="free-shipping-text">
              ${icons.truck('', 16)}
              ${amountUntilFree === 0
                ? '<strong style="color: var(--color-success);">¡Felicitaciones! Tenés ENVÍO GRATIS a CABA/GBA</strong>'
                : `Te faltan <strong>$${amountUntilFree.toLocaleString('es-AR')}</strong> para <strong>ENVÍO GRATIS</strong>`
              }
            </div>
            <div class="free-shipping-progress">
              <div class="free-shipping-progress-fill ${amountUntilFree === 0 ? 'complete' : ''}" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        ` : ''}

        <!-- Items or Empty -->
        <div class="cart-drawer-items">
          ${items.length > 0 ? itemsHtml : emptyHtml}
        </div>

        <!-- Footer / Actions -->
        ${items.length > 0 ? `
          <div class="cart-drawer-footer">
            <!-- Coupon input -->
            <div class="coupon-row">
              <input type="text" id="coupon-code-input" placeholder="Cupón (ej. DONBORDE10)" value="${cartStore.coupon ? cartStore.coupon.code : ''}" />
              <button class="btn btn-cream btn-sm" id="btn-apply-coupon">
                ${cartStore.coupon ? 'Quitar' : 'Aplicar'}
              </button>
            </div>
            ${cartStore.coupon ? `
              <div style="font-size: 0.8rem; color: var(--color-success); font-weight: 700;">
                ✓ ${cartStore.coupon.label} aplicado
              </div>
            ` : ''}

            <!-- Summary lines -->
            <div class="cart-summary-line">
              <span>Subtotal</span>
              <strong style="color: var(--color-carbon);">$${subtotal.toLocaleString('es-AR')}</strong>
            </div>

            ${discount > 0 ? `
              <div class="cart-summary-line" style="color: var(--color-primary);">
                <span>Descuento</span>
                <strong>-$${discount.toLocaleString('es-AR')}</strong>
              </div>
            ` : ''}

            <div class="cart-summary-line">
              <span>Envío</span>
              <span>${shipping === 0 ? '<strong style="color: var(--color-success);">GRATIS</strong>' : '$' + shipping.toLocaleString('es-AR')}</span>
            </div>

            <div class="cart-summary-line total-line">
              <span>TOTAL</span>
              <span style="color: var(--color-primary);">$${total.toLocaleString('es-AR')}</span>
            </div>

            <!-- WhatsApp Direct Buy CTA -->
            <a href="${cartStore.buildWhatsAppMessage()}" target="_blank" class="btn btn-primary btn-block btn-lg" id="btn-cart-wa-direct" style="background-color: #25D366; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
              ${icons.whatsapp('', 20)} PEDIR DIRECTO POR WHATSAPP
            </a>

            <!-- Traditional Checkout Button -->
            <button class="btn btn-secondary btn-block" id="btn-go-checkout">
              FINALIZAR POR WEB ${icons.arrowRight('', 18)}
            </button>
          </div>
        ` : ''}
      </aside>
    `;

    // Bind event handlers
    const backdrop = container.querySelector('#cart-backdrop');
    const closeBtn = container.querySelector('#btn-close-cart');
    const emptyShopBtn = container.querySelector('#btn-empty-shop');
    const checkoutBtn = container.querySelector('#btn-go-checkout');
    const couponInput = container.querySelector('#coupon-code-input');
    const couponBtn = container.querySelector('#btn-apply-coupon');

    if (backdrop) backdrop.addEventListener('click', () => cartStore.toggleDrawer(false));
    if (closeBtn) closeBtn.addEventListener('click', () => cartStore.toggleDrawer(false));
    
    if (emptyShopBtn) {
      emptyShopBtn.addEventListener('click', () => {
        cartStore.toggleDrawer(false);
        router.navigate('/productos');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        cartStore.toggleDrawer(false);
        router.navigate('/checkout');
      });
    }

    if (couponBtn && couponInput) {
      couponBtn.addEventListener('click', () => {
        if (cartStore.coupon) {
          cartStore.removeCoupon();
          toastStore.show('Cupón removido', 'info');
        } else {
          const res = cartStore.applyCoupon(couponInput.value);
          toastStore.show(res.message, res.success ? 'success' : 'info');
        }
      });
    }

    // Delegate items actions
    const drawerItems = container.querySelector('.cart-drawer-items');
    if (drawerItems) {
      drawerItems.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const action = target.getAttribute('data-action');
        const id = target.getAttribute('data-id');
        if (!id || !action) return;

        const currentItem = items.find(it => it.product.id === id);
        if (!currentItem) return;

        if (action === 'remove') {
          cartStore.removeItem(id);
          toastStore.show('Producto eliminado del pedido', 'info');
        } else if (action === 'increase') {
          cartStore.updateQuantity(id, currentItem.quantity + 1);
        } else if (action === 'decrease') {
          cartStore.updateQuantity(id, currentItem.quantity - 1);
        }
      });
    }
  }

  cartStore.subscribe(render);
  render();
}
