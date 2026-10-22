import { icons } from './icons.js';
import { cartStore, DON_BORDE_WHATSAPP_PHONE } from '../state/cartStore.js';
import { router } from '../router.js';

export function renderHeader(container) {
  let isMobileMenuOpen = false;

  const html = `
    <!-- Top Announcement Bar -->
    <div class="top-announcement">
      🍕 <strong>DON BORDE</strong> <span>·</span> Pizzetas y Pre-pizzas Artesanales <span>·</span> <em>El sabor artesanal que tu día (o tu negocio) necesita</em>
    </div>

    <!-- Main Site Header -->
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <!-- Logo -->
        <a href="#/" class="header-logo" title="Don Borde - Sabor Artesanal">
          <img src="/assets/images/logo_principal.jpeg" alt="Don Borde" />
        </a>

        <!-- Triple-Channel Navigation Direct Switcher -->
        <nav class="header-nav" aria-label="Canales de Venta">
          <a href="#/productos?channel=minorista" class="nav-link channel-tab" data-channel="minorista" data-route="/productos">
            <span class="channel-indicator"></span>
            Al Paso (Minorista)
          </a>

          <a href="#/comercios" class="nav-link channel-tab badge-link" data-channel="mayorista" data-route="/comercios">
            Comercios (B2B) <span class="nav-tag">300% MARGEN</span>
          </a>

          <a href="#/preventistas" class="nav-link channel-tab badge-link" data-channel="preventistas" data-route="/preventistas">
            Zona Vendedores <span class="nav-tag" style="background: var(--color-carbon);">TANDAS</span>
          </a>
        </nav>

        <!-- Right Quick Actions -->
        <div class="header-actions">
          <!-- WhatsApp Quick Contact CTA -->
          <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Quisiera%20hacer%20un%20pedido%20artesanal" 
             target="_blank" 
             class="btn btn-primary btn-sm btn-header-wa" 
             title="Pedir directo por WhatsApp">
            ${icons.whatsapp('', 16)} <span>WhatsApp</span>
          </a>

          <!-- Cart Trigger -->
          <button class="action-btn btn-cart-toggle" id="btn-cart-toggle" title="Tu Carrito" aria-label="Abrir carrito de compras">
            ${icons.cart('', 20)}
            <span class="cart-count-badge" id="cart-count-badge">0</span>
          </button>

          <!-- Mobile Hamburger -->
          <button class="action-btn mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Abrir menú">
            ${icons.menu('', 22)}
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Drawer Menu -->
    <div class="drawer-backdrop mobile-menu-backdrop" id="mobile-menu-backdrop"></div>
    <div class="cart-drawer mobile-nav-drawer" id="mobile-nav-drawer" style="max-width: 320px; right: auto; left: 0; transform: translateX(-100%);">
      <div class="cart-drawer-header">
        <a href="#/" class="header-logo" style="margin: 0;">
          <img src="/assets/images/logo_principal.jpeg" alt="Don Borde" style="height: 36px;" />
        </a>
        <button class="action-btn" id="btn-close-mobile-menu" aria-label="Cerrar menú">
          ${icons.close('', 18)}
        </button>
      </div>

      <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--color-carbon-muted); letter-spacing: 0.08em;">
          Seleccioná tu Canal:
        </span>

        <a href="#/productos?channel=minorista" class="nav-link" style="font-size: 1.05rem; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
          <span>🍕 Al Paso (Minorista)</span>
          <span class="badge badge-subtle">B2C</span>
        </a>

        <a href="#/comercios" class="nav-link" style="font-size: 1.05rem; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
          <span>🏪 Comercios & Cafeterías</span>
          <span class="badge badge-primary">B2B</span>
        </a>

        <a href="#/preventistas" class="nav-link" style="font-size: 1.05rem; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
          <span>🚶‍♂️ Zona Vendedores</span>
          <span class="badge badge-carbon">CALLE</span>
        </a>

        <a href="#/pedidos" class="nav-link" style="font-size: 1.05rem; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border);">
          📦 Mis Pedidos & Estado
        </a>

        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
          <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Quisiera%20hacer%20un%20pedido%20artesanal" target="_blank" class="btn btn-primary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            ${icons.whatsapp('', 18)} Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Bind Events
  const cartToggleBtn = container.querySelector('#btn-cart-toggle');
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
      cartStore.toggleDrawer(true);
    });
  }

  const mobileToggle = container.querySelector('#mobile-menu-toggle');
  const mobileDrawer = container.querySelector('#mobile-nav-drawer');
  const mobileBackdrop = container.querySelector('#mobile-menu-backdrop');
  const closeMobileBtn = container.querySelector('#btn-close-mobile-menu');

  function toggleMobile(open) {
    isMobileMenuOpen = typeof open === 'boolean' ? open : !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      mobileDrawer.style.transform = 'translateX(0)';
      mobileBackdrop.classList.add('active');
    } else {
      mobileDrawer.style.transform = 'translateX(-100%)';
      mobileBackdrop.classList.remove('active');
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMobile(true));
  if (closeMobileBtn) closeMobileBtn.addEventListener('click', () => toggleMobile(false));
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => toggleMobile(false));

  mobileDrawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMobile(false));
  });

  // Cart Badge updater
  const countBadge = container.querySelector('#cart-count-badge');
  function updateBadge() {
    const totalCount = cartStore.getItemCount();
    if (countBadge) {
      countBadge.textContent = totalCount;
      countBadge.style.display = totalCount > 0 ? 'flex' : 'none';
      countBadge.classList.add('bump');
      setTimeout(() => countBadge.classList.remove('bump'), 300);
    }
  }
  updateBadge();
  cartStore.subscribe(updateBadge);

  // Active channel updater
  function updateActiveNav(path) {
    container.querySelectorAll('.nav-link[data-route]').forEach(link => {
      const route = link.getAttribute('data-route');
      if (path === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  router.onChange((path) => updateActiveNav(path));
}
