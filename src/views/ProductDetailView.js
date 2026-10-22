import { icons } from '../components/icons.js';
import { PRODUCTS } from '../data/products.js';
import { createProductCard } from '../components/ProductCard.js';
import { cartStore } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';
import { router } from '../router.js';

export function renderProductDetailView(container, params) {
  const productId = params.id;
  const product = PRODUCTS.find(p => p.id === productId || p.slug === productId);

  if (!product) {
    container.innerHTML = `
      <div class="container" style="padding: 6rem 1rem; text-align: center;">
        <h2>Producto no encontrado</h2>
        <p style="margin: 1rem 0 2rem;">No pudimos encontrar el producto que estabas buscando.</p>
        <a href="#/productos" class="btn btn-primary">Volver al Catálogo</a>
      </div>
    `;
    return;
  }

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  let activeImage = galleryImages[0];
  let qty = 1;

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.featured)).slice(0, 4);

  const html = `
    <div class="container product-detail-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Ruta de navegación">
        <a href="#/">Inicio</a> <span>/</span>
        <a href="#/productos">Productos</a> <span>/</span>
        <a href="#/productos?cat=${product.category}">${product.category}</a> <span>/</span>
        <span style="color: var(--color-carbon);">${product.name}</span>
      </nav>

      <!-- Main Detail Grid -->
      <div class="product-detail-grid">
        <!-- Left: Gallery -->
        <div class="product-gallery">
          <div class="gallery-main-img-box">
            ${product.badge ? `<span class="badge badge-primary product-card-badge">${product.badge}</span>` : ''}
            <img id="main-product-img" src="${activeImage}" alt="${product.name}" />
          </div>

          ${galleryImages.length > 1 ? `
            <div class="gallery-thumbnails">
              ${galleryImages.map((img, idx) => `
                <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-src="${img}">
                  <img src="${img}" alt="${product.name} foto ${idx + 1}" />
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right: Info & Purchase Controls -->
        <div class="product-info-box">
          <div class="product-info-header">
            <span class="badge badge-subtle">${product.category.toUpperCase()} · ${product.unit}</span>
            <h1 class="product-info-title">${product.name}</h1>
            <div class="product-info-meta">
              <span class="rating-stars">
                ${icons.star('', 16)} <strong>${product.rating}</strong> (${product.reviewsCount} opiniones verificadas)
              </span>
              <span>·</span>
              <span style="color: var(--color-success); font-weight: 700;">En stock (${product.stock} disponibles)</span>
            </div>
          </div>

          <p style="font-size: 1.05rem; color: var(--color-carbon-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            ${product.description}
          </p>

          <!-- Price & Purchase Box -->
          <div class="product-price-box">
            <div class="product-price-large">
              <span>$${product.price.toLocaleString('es-AR')}</span>
              ${product.oldPrice ? `<span class="old">$${product.oldPrice.toLocaleString('es-AR')}</span>` : ''}
            </div>
            <div class="product-unit-note">
              Precio final con IVA incluido · ${product.weight}
            </div>

            <div class="purchase-controls">
              <div class="qty-stepper" style="padding: 0.35rem 0.5rem;">
                <button class="qty-btn" id="btn-detail-qty-minus" aria-label="Disminuir">${icons.minus('', 16)}</button>
                <span class="qty-value" id="detail-qty-val" style="min-width: 32px; font-size: 1.1rem;">${qty}</span>
                <button class="qty-btn" id="btn-detail-qty-plus" aria-label="Aumentar">${icons.plus('', 16)}</button>
              </div>

              <button class="btn btn-primary btn-lg" id="btn-detail-add-cart" style="flex: 1;">
                ${icons.cart('', 20)} AGREGAR AL CARRITO
              </button>

              <button class="btn btn-secondary btn-lg" id="btn-detail-buy-now">
                COMPRAR AHORA
              </button>
            </div>
          </div>

          <!-- Quality Highlights -->
          <div class="product-highlights-strip">
            <div class="highlight-box">
              <span class="icon">${icons.flame('', 20)}</span>
              <span class="text">Horno a 450°C</span>
            </div>
            <div class="highlight-box">
              <span class="icon">${icons.clock('', 20)}</span>
              <span class="text">48hs Masa Madre</span>
            </div>
            <div class="highlight-box">
              <span class="icon">${icons.truck('', 20)}</span>
              <span class="text">Cadena de frío</span>
            </div>
          </div>

          <!-- Accordion Information Tabs -->
          <div class="accordion-info">
            <!-- Ingredientes -->
            <div class="accordion-item">
              <button class="accordion-trigger" data-target="acc-ingredientes">
                <span>Ingredientes Nobles & Elaboración</span>
                <span>+</span>
              </button>
              <div class="accordion-content" id="acc-ingredientes">
                <ul>
                  ${product.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Modo de cocción -->
            <div class="accordion-item">
              <button class="accordion-trigger" data-target="acc-coccion">
                <span>Modo de Cocción Recomendado (8-10 min)</span>
                <span>+</span>
              </button>
              <div class="accordion-content" id="acc-coccion">
                <p>${product.bakingInstructions}</p>
              </div>
            </div>

            <!-- Conservación & Envíos -->
            <div class="accordion-item">
              <button class="accordion-trigger" data-target="acc-conservacion">
                <span>Conservación & Envíos</span>
                <span>+</span>
              </button>
              <div class="accordion-content" id="acc-conservacion">
                <p style="margin-bottom: 0.5rem;"><strong>Conservación:</strong> ${product.conservation}</p>
                <p><strong>Envíos:</strong> Despachos refrigerados en CABA y GBA en el día o programados. Envío bonificado a partir de $25.000.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products: "También te puede gustar" -->
      <section style="padding-top: 3rem; border-top: 1px solid var(--color-border);">
        <div class="section-header">
          <span class="section-tag">Recomendados para vos</span>
          <h2 class="section-title">TAMBIÉN TE PUEDE GUSTAR</h2>
        </div>

        <div class="product-grid" id="related-products-grid">
          <!-- Injected via JS -->
        </div>
      </section>
    </div>
  `;

  container.innerHTML = html;

  // Gallery Thumbnail Click
  const mainImg = container.querySelector('#main-product-img');
  const thumbs = container.querySelectorAll('.gallery-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-src');
      mainImg.src = src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Quantity Stepper
  const qtyValEl = container.querySelector('#detail-qty-val');
  const qtyMinus = container.querySelector('#btn-detail-qty-minus');
  const qtyPlus = container.querySelector('#btn-detail-qty-plus');

  qtyMinus.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      qtyValEl.textContent = qty;
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (qty < product.stock) {
      qty++;
      qtyValEl.textContent = qty;
    }
  });

  // Add to Cart
  const addCartBtn = container.querySelector('#btn-detail-add-cart');
  addCartBtn.addEventListener('click', () => {
    cartStore.addItem(product, qty);
    toastStore.show(`¡${qty}x ${product.name} agregado al pedido!`, 'success');
    addCartBtn.innerHTML = `${icons.check('', 20)} AGREGADO ✓`;
    setTimeout(() => {
      addCartBtn.innerHTML = `${icons.cart('', 20)} AGREGAR AL CARRITO`;
    }, 1500);
  });

  // Buy Now
  const buyNowBtn = container.querySelector('#btn-detail-buy-now');
  buyNowBtn.addEventListener('click', () => {
    cartStore.addItem(product, qty);
    router.navigate('/checkout');
  });

  // Accordion Toggle
  container.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const content = container.querySelector(`#${targetId}`);
      if (!content) return;
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      trigger.querySelector('span:last-child').textContent = isVisible ? '+' : '−';
    });
  });

  // Populate related products
  const relatedGrid = container.querySelector('#related-products-grid');
  if (relatedGrid) {
    relatedProducts.forEach(rel => {
      relatedGrid.appendChild(createProductCard(rel));
    });
  }
}
