import { icons } from '../components/icons.js';
import { PRODUCTS, calculateComercioMargin } from '../data/products.js';
import { cartStore, DON_BORDE_WHATSAPP_PHONE } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';

export function renderB2BComerciosView(container) {
  let costPerUnit = 300;      // $300 mayorista desde 3 bolsas x10
  let salePriceInTable = 1200; // $1.200 precio carta sugerido
  let weeklyUnits = 120;       // 120 pizzetas semanales

  const mayoristaProducts = PRODUCTS.filter(p => p.channel === 'mayorista');

  const html = `
    <!-- B2B HERO -->
    <section class="b2b-hero">
      <div class="container">
        <div class="b2b-hero-content">
          <span class="badge badge-primary" style="margin-bottom: 1rem;">CANAL B2B · CAFETERÍAS, ALMACENES & BARES</span>
          <h1>¿TENÉS UN COMERCIO?</h1>
          <p>
            Sumá Don Borde a tu negocio. Nuestras bolsas x10 pre-pizzetas con salsa están pensadas para resolver comidas en minutos con un <strong>margen bruto de hasta el 300%</strong> para tu local.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Tengo%20un%20comercio%20y%20quiero%20hacer%20un%20pedido%20mayorista" 
               target="_blank" 
               class="btn btn-primary btn-lg" 
               style="background-color: #25D366; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);">
              ${icons.whatsapp('', 20)} PEDIR PRECIOS POR WHATSAPP
            </a>
            <a href="#calculadora-comercio" class="btn btn-outline btn-lg" style="color: #fff; border-color: rgba(255,255,255,0.4);">
              Calcular Mi Margen
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CALCULADORA DE MARGEN PARA EL COMERCIO -->
    <div class="container" id="calculadora-comercio">
      <div class="b2b-calculator-card">
        <div class="section-header">
          <span class="section-tag">Simulador Dinámico de Rentabilidad</span>
          <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">CALCULADORA DE MARGEN PARA TU LOCAL</h2>
          <p style="font-size: 0.95rem; color: var(--color-carbon-muted);">
            Comprando bolsas x10 con la promo mayorista a <strong>$300 c/u</strong>, simulá tu rentabilidad según el precio de carta de tu salón:
          </p>
        </div>

        <div class="calc-grid">
          <div class="calc-slider-box">
            <!-- Cost info -->
            <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block; font-size: 0.95rem;">Costo de Compra Mayorista Don Borde:</strong>
                <span style="font-size: 0.8rem; color: var(--color-carbon-muted);">Llevando 3 o más bolsas x10 ($3.000 la bolsa)</span>
              </div>
              <span style="font-family: var(--font-headline); font-size: 1.35rem; font-weight: 900; color: var(--color-primary);">$300 c/u</span>
            </div>

            <!-- Price in table slider -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <label style="font-family: var(--font-headline); font-weight: 800; font-size: 0.95rem;">
                  Precio al que vendés la pizzeta servida en mesa:
                </label>
                <span style="font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--color-primary);" id="calc-b2b-price-display">
                  $1.200
                </span>
              </div>
              <input type="range" id="calc-b2b-price-range" min="600" max="2500" step="50" value="${salePriceInTable}" />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted); margin-top: 0.25rem;">
                <span>$600 (Económico)</span>
                <span>$1.200 (Sugerido Cafetería)</span>
                <span>$2.500 (Bar Gourmet)</span>
              </div>
            </div>

            <!-- Units per week slider -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <label style="font-family: var(--font-headline); font-weight: 800; font-size: 0.95rem;">
                  Pizzetas despachadas por semana:
                </label>
                <span style="font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--color-carbon);" id="calc-b2b-units-display">
                  120 pizzetas (12 bolsas)
                </span>
              </div>
              <input type="range" id="calc-b2b-units-range" min="30" max="600" step="10" value="${weeklyUnits}" />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted); margin-top: 0.25rem;">
                <span>30 un. (Kiosco / Almacén)</span>
                <span>120 un. (Cafetería)</span>
                <span>600 un. (Bar / Cervecería)</span>
              </div>
            </div>
          </div>

          <!-- Dynamic Result Box -->
          <div class="calc-result-box">
            <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-carbon-muted);">
              Tu Margen Comercial Bruto:
            </span>
            <div class="calc-result-number" id="calc-b2b-margin-percent" style="font-size: 3.25rem;">
              300%
            </div>

            <div style="margin: 1.25rem 0; padding: 1rem 0; border-top: 1px dashed var(--color-border); border-bottom: 1px dashed var(--color-border); text-align: left; font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <div style="display: flex; justify-content: space-between;">
                <span>Ganancia limpia por pizzeta:</span>
                <strong style="color: var(--color-success);" id="calc-b2b-unit-profit">+$900 c/u</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Ganancia neta semanal:</span>
                <strong id="calc-b2b-weekly-profit">$108.000</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-family: var(--font-headline); font-weight: 900;">
                <span>Ganancia neta mensual:</span>
                <span style="color: var(--color-primary);" id="calc-b2b-monthly-profit">$432.000</span>
              </div>
            </div>

            <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Quiero%20hacer%20un%20pedido%20mayorista%20para%20mi%20local" 
               target="_blank" 
               class="btn btn-primary btn-block">
              ${icons.whatsapp('', 18)} Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- CATÁLOGO EXCLUSIVO MAYORISTA -->
    <section style="padding: 5rem 0 3rem;">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">Lista Mayorista B2B</span>
          <h2 class="section-title">PRODUCTOS PARA TU NEGOCIO</h2>
          <p class="section-subtitle">
            Precios directos de fábrica con bonificaciones automáticas por volumen.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
          ${mayoristaProducts.map(p => `
            <div class="tier-card" style="box-shadow: var(--shadow-card);">
              <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 0.75rem;">${p.badge}</span>
              <h3 style="font-size: 1.35rem; margin-bottom: 0.35rem;">${p.name}</h3>
              <div style="font-size: 0.8rem; color: var(--color-carbon-muted); margin-bottom: 0.75rem;">${p.unit}</div>
              <p style="font-size: 0.9rem; margin-bottom: 1rem; flex: 1;">${p.shortDescription}</p>

              <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
                <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 800; color: var(--color-carbon-muted);">Precio Mayorista:</div>
                <div style="font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--color-carbon);">
                  $${p.price.toLocaleString('es-AR')}
                </div>
                ${p.isTieredDiscount ? `
                  <div style="font-size: 0.82rem; font-weight: 800; color: var(--color-primary); margin-top: 0.25rem;">
                    🔥 Promo 3+ bolsas: $${p.tierPromoPrice.toLocaleString('es-AR')} c/u ($300 por pizzeta)
                  </div>
                ` : ''}
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-block btn-add-b2b" data-id="${p.id}">
                  Agregar al Pedido
                </button>
                <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Me%20interesa%20el%20producto%20mayorista%20${encodeURIComponent(p.name)}" target="_blank" class="action-btn" title="Consultar por WhatsApp">
                  ${icons.whatsapp('', 18)}
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FORMULARIO DIRECTO ALTA DE COMERCIO -->
    <section id="solicitud-comercial" style="background-color: var(--color-white); padding: 5rem 0; border-top: 1px solid var(--color-border);">
      <div class="container" style="max-width: 800px;">
        <div class="checkout-form-card" style="padding: 3rem;">
          <div class="section-header text-center" style="margin-bottom: 2rem;">
            <span class="section-tag">Atención Comercial B2B</span>
            <h2 class="section-title">ALTA DE COMERCIO O CAFETERÍA</h2>
            <p class="section-subtitle">Completá tus datos y te contactaremos por WhatsApp con la lista mayorista completa y muestras de degustación.</p>
          </div>

          <form id="b2b-merchant-form">
            <div class="form-row">
              <div class="form-group">
                <label for="b2b-m-name">Nombre del Local / Razón Social *</label>
                <input type="text" id="b2b-m-name" required placeholder="Ej. Café Martínez Palermo" />
              </div>
              <div class="form-group">
                <label for="b2b-m-rubro">Rubro *</label>
                <select id="b2b-m-rubro">
                  <option value="Cafetería / Bar">Cafetería / Bar</option>
                  <option value="Almacén / Kiosco">Almacén / Kiosco</option>
                  <option value="Rotisería / Casa de Comidas">Rotisería / Casa de Comidas</option>
                  <option value="Supermercado / Autoservicio">Supermercado / Autoservicio</option>
                  <option value="Cervecería">Cervecería</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="b2b-m-contact">Persona de Contacto *</label>
                <input type="text" id="b2b-m-contact" required placeholder="Ej. Lucas Fernández" />
              </div>
              <div class="form-group">
                <label for="b2b-m-phone">WhatsApp de Contacto *</label>
                <input type="tel" id="b2b-m-phone" required placeholder="11 5566-7788" />
              </div>
            </div>

            <div class="form-group">
              <label for="b2b-m-address">Dirección y Localidad *</label>
              <input type="text" id="b2b-m-address" required placeholder="Ej. Thames 1420, Palermo, CABA" />
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1.5rem; background-color: #25D366;">
              ${icons.whatsapp('', 20)} ENVIAR Y SOLICITAR MUESTRAS POR WHATSAPP
            </button>
          </form>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = html;

  // Calculadora logic
  const priceRange = container.querySelector('#calc-b2b-price-range');
  const unitsRange = container.querySelector('#calc-b2b-units-range');
  const priceDisplay = container.querySelector('#calc-b2b-price-display');
  const unitsDisplay = container.querySelector('#calc-b2b-units-display');
  const marginDisplay = container.querySelector('#calc-b2b-margin-percent');
  const unitProfitDisplay = container.querySelector('#calc-b2b-unit-profit');
  const weeklyProfitDisplay = container.querySelector('#calc-b2b-weekly-profit');
  const monthlyProfitDisplay = container.querySelector('#calc-b2b-monthly-profit');

  function updateCalc() {
    salePriceInTable = parseInt(priceRange.value, 10);
    weeklyUnits = parseInt(unitsRange.value, 10);

    priceDisplay.textContent = `$${salePriceInTable.toLocaleString('es-AR')}`;
    unitsDisplay.textContent = `${weeklyUnits} pizzetas (${Math.round(weeklyUnits / 10)} bolsas)`;

    const res = calculateComercioMargin(costPerUnit, salePriceInTable, weeklyUnits);
    marginDisplay.textContent = `${res.marginPercent}%`;
    unitProfitDisplay.textContent = `+$${res.profitPerUnit.toLocaleString('es-AR')} c/u`;
    weeklyProfitDisplay.textContent = `$${res.weeklyProfit.toLocaleString('es-AR')}`;
    monthlyProfitDisplay.textContent = `$${res.monthlyProfit.toLocaleString('es-AR')}`;
  }

  priceRange.addEventListener('input', updateCalc);
  unitsRange.addEventListener('input', updateCalc);
  updateCalc();

  // Add B2B Product to cart
  container.querySelectorAll('.btn-add-b2b').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) {
        cartStore.addItem(prod, prod.tierPromoQty || 1);
        toastStore.show(`¡Agregado al pedido mayorista!`, 'success');
        cartStore.toggleDrawer(true);
      }
    });
  });

  // Form submit -> WhatsApp redirect
  const form = container.querySelector('#b2b-merchant-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const localName = container.querySelector('#b2b-m-name').value;
      const rubro = container.querySelector('#b2b-m-rubro').value;
      const contact = container.querySelector('#b2b-m-contact').value;
      const phone = container.querySelector('#b2b-m-phone').value;
      const address = container.querySelector('#b2b-m-address').value;

      const waMsg = encodeURIComponent(
        `🍕 *ALTA DE COMERCIO - DON BORDE*\n\n` +
        `• *Local:* ${localName}\n` +
        `• *Rubro:* ${rubro}\n` +
        `• *Contacto:* ${contact}\n` +
        `• *WhatsApp:* ${phone}\n` +
        `• *Dirección:* ${address}\n\n` +
        `Quiero solicitar la lista de precios mayorista y coordinar una muestra de pre-pizzetas para mi local.`
      );

      window.open(`https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=${waMsg}`, '_blank');
      toastStore.show('¡Solicitud iniciada por WhatsApp!', 'success');
    });
  }
}
