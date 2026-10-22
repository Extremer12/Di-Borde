import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';

import { router } from './router.js';
import { cartStore } from './state/cartStore.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderCartDrawer } from './components/CartDrawer.js';
import { renderFooter } from './components/Footer.js';
import { renderToastContainer } from './components/Toast.js';

// Views
import { renderHomeView } from './views/HomeView.js';
import { renderCatalogView } from './views/CatalogView.js';
import { renderProductDetailView } from './views/ProductDetailView.js';
import { renderCheckoutView } from './views/CheckoutView.js';
import { renderB2BComerciosView } from './views/B2BComerciosView.js';
import { renderPreventistasView } from './views/PreventistasView.js';
import { renderOrdersView } from './views/OrdersView.js';
import { renderAccountView } from './views/AccountView.js';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  appContainer.innerHTML = `
    <!-- Header Container -->
    <div id="header-root"></div>

    <!-- Main View Outlet -->
    <main class="main-content" id="router-view-outlet" role="main"></main>

    <!-- Footer Container -->
    <div id="footer-root"></div>

    <!-- Cart Drawer Container -->
    <div id="cart-drawer-root"></div>

    <!-- Toast Notifications Container -->
    <div id="toast-root"></div>

    <!-- Mobile Bottom Navigation -->
    <div id="bottom-nav-root"></div>
  `;

  // Mount Global Shell Components
  const headerRoot = document.getElementById('header-root');
  const bottomNavRoot = document.getElementById('bottom-nav-root');
  const cartDrawerRoot = document.getElementById('cart-drawer-root');
  const footerRoot = document.getElementById('footer-root');
  const toastRoot = document.getElementById('toast-root');
  const viewOutlet = document.getElementById('router-view-outlet');

  renderHeader(headerRoot);
  renderBottomNav(bottomNavRoot);
  renderCartDrawer(cartDrawerRoot);
  renderFooter(footerRoot);
  renderToastContainer(toastRoot);

  // Register Client Routes
  router
    .on('/', () => {
      document.title = 'Don Borde | Sabor Artesanal · Masa Madre & Horno a Piedra';
      renderHomeView(viewOutlet);
    })
    .on('/productos', (params, queryParams) => {
      document.title = 'Catálogo de Productos | Don Borde Tienda Online';
      renderCatalogView(viewOutlet, params, queryParams);
    })
    .on('/productos/:id', (params) => {
      document.title = 'Detalle de Producto | Don Borde';
      renderProductDetailView(viewOutlet, params);
    })
    .on('/carrito', () => {
      cartStore.toggleDrawer(true);
      // If navigating directly to /carrito, display catalog in background
      renderCatalogView(viewOutlet, {}, new URLSearchParams());
    })
    .on('/checkout', () => {
      document.title = 'Finalizar Compra | Don Borde';
      renderCheckoutView(viewOutlet);
    })
    .on('/comercios', () => {
      document.title = '¿Tenés un comercio? Ventas Mayoristas B2B | Don Borde';
      renderB2BComerciosView(viewOutlet);
    })
    .on('/preventistas', () => {
      document.title = 'Portal de Preventistas & Distribuidores | Don Borde';
      renderPreventistasView(viewOutlet);
    })
    .on('/pedidos', () => {
      document.title = 'Mis Pedidos & Seguimiento en Vivo | Don Borde';
      renderOrdersView(viewOutlet);
    })
    .on('/cuenta', () => {
      document.title = 'Mi Cuenta | Don Borde';
      renderAccountView(viewOutlet);
    });

  // Start Router
  router.start();
});
