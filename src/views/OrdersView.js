import { icons } from '../components/icons.js';
import { orderStore } from '../state/orderStore.js';
import { cartStore } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';
import { PRODUCTS } from '../data/products.js';
import { router } from '../router.js';

export function renderOrdersView(container) {
  const orders = orderStore.getOrders();

  const html = `
    <div class="container" style="padding: 3rem 1.5rem 5rem; max-width: 900px;">
      <div class="section-header">
        <span class="section-tag">Historial & Seguimiento</span>
        <h1 class="section-title">MIS PEDIDOS</h1>
        <p class="section-subtitle">
          Consultá el estado en tiempo real de tus pedidos de Don Borde y repetí tus favoritos con un clic.
        </p>
      </div>

      ${orders.length === 0 ? `
        <div style="text-align: center; padding: 4rem 1.5rem; background: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <h3>Aún no tenés pedidos registrados</h3>
          <p style="margin: 0.5rem 0 1.5rem; color: var(--color-carbon-muted);">
            Cuando hagas tu primera compra, podrás seguir el estado de la cocción y el envío acá mismo.
          </p>
          <a href="#/productos" class="btn btn-primary">Ir a la Tienda</a>
        </div>
      ` : `
        <div class="orders-list">
          ${orders.map(order => `
            <article class="order-card" data-order-id="${order.id}">
              <div class="order-card-header">
                <div>
                  <span style="font-family: var(--font-headline); font-weight: 900; font-size: 1.25rem;">
                    ORDEN #${order.id}
                  </span>
                  <span style="font-size: 0.85rem; color: var(--color-carbon-muted); margin-left: 0.75rem;">
                    ${order.date}
                  </span>
                </div>

                <div>
                  <span class="badge ${order.status === 'Entregado' ? 'badge-success' : 'badge-primary'}">
                    ● ${order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <!-- Tracking Timeline -->
              <div class="order-timeline">
                <div class="timeline-step ${order.statusStep >= 1 ? (order.statusStep === 1 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot">${order.statusStep > 1 ? '✓' : '1'}</div>
                  <span class="timeline-step-label">Recibido</span>
                </div>

                <div class="timeline-step ${order.statusStep >= 2 ? (order.statusStep === 2 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot">${order.statusStep > 2 ? '✓' : '2'}</div>
                  <span class="timeline-step-label">En el Horno</span>
                </div>

                <div class="timeline-step ${order.statusStep >= 3 ? (order.statusStep === 3 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot">${order.statusStep > 3 ? '✓' : '3'}</div>
                  <span class="timeline-step-label">En Camino</span>
                </div>

                <div class="timeline-step ${order.statusStep >= 4 ? 'completed' : ''}">
                  <div class="timeline-step-dot">${order.statusStep === 4 ? '✓' : '4'}</div>
                  <span class="timeline-step-label">Entregado</span>
                </div>
              </div>

              <!-- Items list -->
              <div style="background-color: var(--color-cream); border-radius: var(--radius-md); padding: 1.25rem; margin: 1.25rem 0; border: 1px solid var(--color-border);">
                <strong style="display: block; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.75rem; color: var(--color-carbon-muted);">
                  Detalle de productos:
                </strong>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.92rem;">
                  ${order.items.map(item => `
                    <li style="display: flex; justify-content: space-between;">
                      <span><strong>${item.quantity}x</strong> ${item.name}</span>
                      <span style="font-weight: 700;">$${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                    </li>
                  `).join('')}
                </ul>

                <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border); font-family: var(--font-headline); font-size: 1.15rem; font-weight: 900;">
                  <span>TOTAL:</span>
                  <span style="color: var(--color-primary);">$${order.total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <!-- Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div style="font-size: 0.85rem; color: var(--color-carbon-muted);">
                  Entrega: <strong>${order.customer.address}</strong>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                  <button class="btn btn-cream btn-sm btn-repeat-order" data-order-id="${order.id}">
                    ${icons.pizza('', 16)} Repetir este Pedido
                  </button>
                  <a href="https://wa.me/5491149201122?text=Hola%20Don%20Borde!%20Consulto%20por%20mi%20pedido%20${order.id}" target="_blank" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                    ${icons.whatsapp('', 15)} Ayuda
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      `}
    </div>
  `;

  container.innerHTML = html;

  // Bind Repeat Order
  container.querySelectorAll('.btn-repeat-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-id');
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Add default match products to cart
      order.items.forEach(it => {
        const foundProd = PRODUCTS.find(p => it.name.includes(p.name)) || PRODUCTS[0];
        cartStore.addItem(foundProd, it.quantity);
      });

      toastStore.show('¡Productos cargados en el carrito!', 'success');
      cartStore.toggleDrawer(true);
    });
  });
}
