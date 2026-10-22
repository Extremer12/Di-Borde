import { icons } from './icons.js';
import { cartStore } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';
import { router } from '../router.js';

export function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);

  let currentQty = 1;
  const isOutOfStock = product.stock <= 0;

  function calculateActiveUnitPrice(qty) {
    if (product.isTieredDiscount && product.tierPromoQty && qty >= product.tierPromoQty) {
      return product.tierPromoPrice;
    }
    return product.price;
  }

  const badgeHtml = product.badge ? `
    <span class="badge ${product.badge.includes('PROMO') || product.badge.includes('ESCALONADO') ? 'badge-primary' : 'badge-carbon'} product-card-badge">
      ${product.badge}
    </span>
  ` : '';

  const oldPriceHtml = product.oldPrice ? `
    <span class="product-card-old-price">$${product.oldPrice.toLocaleString('es-AR')}</span>
  ` : '';

  card.innerHTML = `
    <div class="product-card-image-box" title="Ver detalle de ${product.name}">
      ${badgeHtml}
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="product-card-unit">${product.unit}</span>
    </div>

    <div class="product-card-body">
      <h3 class="product-card-title">${product.name}</h3>
      ${product.specs ? `<div style="font-size: 0.78rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.4rem;">${product.specs}</div>` : ''}
      <p class="product-card-desc">${product.shortDescription}</p>

      <!-- Tier Discount Notice for B2B items -->
      ${product.isTieredDiscount ? `
        <div class="tier-promo-badge" style="background: var(--color-primary-subtle); border: 1px dashed var(--color-primary); border-radius: var(--radius-sm); padding: 0.4rem 0.6rem; font-size: 0.78rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.75rem;">
          🔥 Llevando 3 o más bolsas: <strong>$${product.tierPromoPrice.toLocaleString('es-AR')} c/u</strong>
        </div>
      ` : ''}

      <div class="product-card-price-row">
        <span class="product-card-price" id="card-price-display">$${product.price.toLocaleString('es-AR')}</span>
        ${oldPriceHtml}
      </div>

      <div class="product-card-actions">
        ${isOutOfStock ? `
          <button class="btn btn-secondary btn-block" disabled style="opacity: 0.6;">
            Agotado
          </button>
        ` : `
          <div class="qty-stepper" aria-label="Cantidad">
            <button class="qty-btn btn-qty-minus" aria-label="Disminuir">${icons.minus('', 14)}</button>
            <span class="qty-value">${currentQty}</span>
            <button class="qty-btn btn-qty-plus" aria-label="Aumentar">${icons.plus('', 14)}</button>
          </div>

          <button class="btn-add-card" aria-label="Agregar al carrito">
            ${icons.plus('', 15)}
            <span>Agregar</span>
          </button>
        `}
      </div>
    </div>
  `;

  // Navigate to product detail when clicking on image or title
  const imageBox = card.querySelector('.product-card-image-box');
  const titleEl = card.querySelector('.product-card-title');
  const openDetail = () => router.navigate(`/productos/${product.id}`);

  if (imageBox) imageBox.addEventListener('click', openDetail);
  if (titleEl) titleEl.addEventListener('click', openDetail);

  if (!isOutOfStock) {
    const qtyValueEl = card.querySelector('.qty-value');
    const priceDisplay = card.querySelector('#card-price-display');
    const minusBtn = card.querySelector('.btn-qty-minus');
    const plusBtn = card.querySelector('.btn-qty-plus');
    const addBtn = card.querySelector('.btn-add-card');

    function updatePrice() {
      const activeUnit = calculateActiveUnitPrice(currentQty);
      priceDisplay.textContent = `$${activeUnit.toLocaleString('es-AR')}`;
    }

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentQty > 1) {
        currentQty--;
        qtyValueEl.textContent = currentQty;
        updatePrice();
      }
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentQty < product.stock) {
        currentQty++;
        qtyValueEl.textContent = currentQty;
        updatePrice();
      }
    });

    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartStore.addItem(product, currentQty);
      toastStore.show(`¡${currentQty}x ${product.name} agregado al carrito!`, 'success');

      // Visual feedback state
      addBtn.classList.add('added');
      addBtn.innerHTML = `${icons.check('', 16)} <span>Agregado ✓</span>`;
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = `${icons.plus('', 15)} <span>Agregar</span>`;
      }, 1600);
    });
  }

  return card;
}
