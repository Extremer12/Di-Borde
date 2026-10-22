import { icons } from './icons.js';
import { cartStore } from '../state/cartStore.js';
import { router } from '../router.js';

export function renderBottomNav(container) {
  const html = `
    <nav class="bottom-nav" id="bottom-nav" aria-label="Navegación móvil">
      <a href="#/" class="bottom-nav-item" data-route="/">
        ${icons.home('', 19)}
        <span>Inicio</span>
      </a>

      <a href="#/productos?channel=minorista" class="bottom-nav-item" data-route="/productos">
        ${icons.pizza('', 19)}
        <span>Al Paso</span>
      </a>

      <a href="#/comercios" class="bottom-nav-item" data-route="/comercios">
        ${icons.building('', 19)}
        <span>Comercios</span>
      </a>

      <a href="#/preventistas" class="bottom-nav-item" data-route="/preventistas">
        ${icons.briefcase('', 19)}
        <span>Vendedores</span>
      </a>

      <button class="bottom-nav-item" id="btn-bottom-cart" style="background: none; border: none; cursor: pointer;">
        ${icons.cart('', 19)}
        <span>Carrito</span>
        <span class="nav-badge" id="bottom-cart-badge" style="display: none;">0</span>
      </button>
    </nav>
  `;

  container.innerHTML = html;

  const btnBottomCart = container.querySelector('#btn-bottom-cart');
  if (btnBottomCart) {
    btnBottomCart.addEventListener('click', () => {
      cartStore.toggleDrawer(true);
    });
  }

  const badge = container.querySelector('#bottom-cart-badge');
  function updateBadge() {
    const totalCount = cartStore.getItemCount();
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
  }
  updateBadge();
  cartStore.subscribe(updateBadge);

  function updateActiveNav(path) {
    container.querySelectorAll('.bottom-nav-item[data-route]').forEach(item => {
      if (item.getAttribute('data-route') === path) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  router.onChange((path) => updateActiveNav(path));
}
