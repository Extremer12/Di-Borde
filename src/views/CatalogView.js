import { icons } from '../components/icons.js';
import { PRODUCTS, CHANNELS } from '../data/products.js';
import { createProductCard } from '../components/ProductCard.js';

export function renderCatalogView(container, params, queryParams) {
  let activeChannel = queryParams.get('channel') || 'todos';
  let searchQuery = queryParams.get('q') || '';
  let activeSort = 'destacados';

  const html = `
    <div class="container" style="padding-top: 3rem; padding-bottom: 5rem;">
      <!-- Title & Triple-Channel Switcher -->
      <div class="section-header">
        <span class="section-tag">Catálogo Oficial Don Borde</span>
        <h1 class="section-title">PRODUCTOS & PRECIOS</h1>
        <p class="section-subtitle">
          Elegí según tu perfil: consumo al paso o familiar, abastecimiento mayorista para tu comercio, o tandas para vendedores.
        </p>
      </div>

      <!-- Channel Tabs Switcher -->
      <div class="catalog-toolbar">
        <div class="category-tabs" id="catalog-channel-tabs">
          <button class="category-tab-btn ${activeChannel === 'todos' ? 'active' : ''}" data-channel="todos">
            Todos (${PRODUCTS.length})
          </button>
          <button class="category-tab-btn ${activeChannel === 'minorista' ? 'active' : ''}" data-channel="minorista">
            🍕 Al Paso (Minorista)
          </button>
          <button class="category-tab-btn ${activeChannel === 'mayorista' ? 'active' : ''}" data-channel="mayorista">
            🏪 Comercios & Cafeterías (B2B)
          </button>
          <button class="category-tab-btn ${activeChannel === 'preventistas' ? 'active' : ''}" data-channel="preventistas">
            🚶‍♂️ Zona Vendedores (Tandas)
          </button>
        </div>

        <div class="search-and-sort">
          <div class="search-input-wrapper">
            <span class="search-icon">${icons.search('', 16)}</span>
            <input type="text" id="catalog-search-input" placeholder="Buscar pizzeta, pack..." value="${searchQuery}" />
          </div>

          <select class="sort-select" id="catalog-sort-select">
            <option value="destacados">Más elegidos</option>
            <option value="precio-menor">Menor precio</option>
            <option value="precio-mayor">Mayor precio</option>
            <option value="alfabetico">Nombre A-Z</option>
          </select>
        </div>
      </div>

      <!-- Channel Description Banner -->
      <div id="channel-banner-notice" style="background: var(--color-white); border: 1px solid var(--color-border); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md); padding: 1rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap: 1rem;">
        <div>
          <strong id="channel-notice-title" style="font-family: var(--font-headline); font-size: 1rem;">
            Mostrando todos los productos disponibles
          </strong>
          <p id="channel-notice-desc" style="font-size: 0.85rem; margin: 0; color: var(--color-carbon-muted);">
            Precios vigentes para retiro en obrador o envío a domicilio en CABA y GBA.
          </p>
        </div>

        <span id="results-count-text" style="font-size: 0.85rem; font-weight: 800; color: var(--color-primary);">
          ${PRODUCTS.length} productos
        </span>
      </div>

      <!-- Product Grid -->
      <div class="product-grid" id="catalog-products-grid">
        <!-- Injected via JS -->
      </div>

      <!-- Empty state when no search matches -->
      <div id="catalog-empty-state" style="display: none; text-align: center; padding: 4rem 1rem; background-color: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-top: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🍕🔍</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No encontramos productos</h3>
        <p style="color: var(--color-carbon-muted); max-width: 400px; margin: 0 auto 1.5rem;">
          No hay productos que coincidan con los filtros seleccionados.
        </p>
        <button class="btn btn-primary" id="btn-clear-filters">Ver Todos</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const grid = container.querySelector('#catalog-products-grid');
  const emptyState = container.querySelector('#catalog-empty-state');
  const countText = container.querySelector('#results-count-text');
  const searchInput = container.querySelector('#catalog-search-input');
  const sortSelect = container.querySelector('#catalog-sort-select');
  const tabsContainer = container.querySelector('#catalog-channel-tabs');
  const noticeTitle = container.querySelector('#channel-notice-title');
  const noticeDesc = container.querySelector('#channel-notice-desc');

  function updateNotice() {
    if (activeChannel === 'minorista') {
      noticeTitle.textContent = 'Canal Minorista / Al Paso';
      noticeDesc.textContent = 'Pizzetas listas para comer caliente ($850 o Combo x3 a $2.000) y pre-pizzas para hornear.';
    } else if (activeChannel === 'mayorista') {
      noticeTitle.textContent = 'Canal Mayorista para Cafeterías & Almacenes';
      noticeDesc.textContent = 'Bolsas x10 pre-pizzetas con descuento automático desde 3 paquetes ($3.000 c/u) y packs familiares.';
    } else if (activeChannel === 'preventistas') {
      noticeTitle.textContent = 'Portal de Vendedores de Calle';
      noticeDesc.textContent = 'Tandas de 15 pizzetas con rendición fija de $6.000 para el obrador y ganancia directa en mano.';
    } else {
      noticeTitle.textContent = 'Mostrando catálogo completo Don Borde';
      noticeDesc.textContent = 'Productos minoristas, mayoristas para comercios y tandas de producción.';
    }
  }

  function filterAndSortProducts() {
    let filtered = [...PRODUCTS];

    // Channel filter
    if (activeChannel !== 'todos') {
      filtered = filtered.filter(p => p.channel === activeChannel);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort === 'precio-menor') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'precio-mayor') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'alfabetico') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Destacados
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Render
    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      grid.style.display = 'grid';
      emptyState.style.display = 'none';
      filtered.forEach(p => {
        grid.appendChild(createProductCard(p));
      });
    }

    countText.textContent = `${filtered.length} productos`;
    updateNotice();
  }

  // Bind Tabs Click
  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-tab-btn');
    if (!btn) return;
    activeChannel = btn.getAttribute('data-channel');
    tabsContainer.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterAndSortProducts();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterAndSortProducts();
  });

  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    filterAndSortProducts();
  });

  const clearBtn = container.querySelector('#btn-clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activeChannel = 'todos';
      searchQuery = '';
      searchInput.value = '';
      tabsContainer.querySelectorAll('.category-tab-btn').forEach(b => {
        if (b.getAttribute('data-channel') === 'todos') b.classList.add('active');
        else b.classList.remove('active');
      });
      filterAndSortProducts();
    });
  }

  filterAndSortProducts();
}
