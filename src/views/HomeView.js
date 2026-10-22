import { icons } from '../components/icons.js';
import { PRODUCTS, calculateComercioMargin, calculatePreventistaEarnings } from '../data/products.js';
import { createProductCard } from '../components/ProductCard.js';
import { DON_BORDE_WHATSAPP_PHONE } from '../state/cartStore.js';
import { router } from '../router.js';

export function renderHomeView(container) {
  const featuredProducts = PRODUCTS.filter(p => p.featured);

  let calcComercioUnits = 100;
  let calcComercioPrice = 1200;

  let calcPreventistaTandas = 2;
  let calcPreventistaPrice = 2000;

  const html = `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-pill-badge">
            <span class="dot"></span>
            <span>Masa Madre 48hs · Horno de Piedra · Triple Canal</span>
          </div>

          <h1 class="hero-headline">
            PIZZETAS Y PRE-PIZZAS <br />
            <span class="highlight">ARTESANALES.</span>
          </h1>

          <p class="hero-subheadline">
            <strong>El sabor artesanal que tu día (o tu negocio) necesita.</strong><br/>
            Cocidas al piso sobre piedra volcánica, con auténtico borde aireado y crocante. Para comer al paso, abastecer tu cafetería o revender en tu zona.
          </p>

          <div class="hero-actions">
            <!-- CTA Direct WhatsApp Button -->
            <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Quisiera%20hacer%20un%20pedido%20artesanal" 
               target="_blank" 
               class="btn btn-primary btn-lg" 
               style="background-color: #25D366; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);">
              ${icons.whatsapp('', 20)} PEDIR POR WHATSAPP
            </a>

            <a href="#/productos" class="btn btn-secondary btn-lg">
              VER CATÁLOGO ${icons.arrowRight('', 18)}
            </a>
          </div>

          <!-- Triple Channel Quick Badges -->
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
            <a href="#/productos?channel=minorista" class="badge badge-subtle" style="text-decoration: none;">
              🍕 Al Paso: Pizzeta $850 / Combo x3 $2.000
            </a>
            <a href="#/comercios" class="badge badge-primary" style="text-decoration: none;">
              🏪 B2B: Pre-pizzetas x10 a $300 c/u (300% Margen)
            </a>
            <a href="#/preventistas" class="badge badge-carbon" style="text-decoration: none;">
              🚶‍♂️ Preventistas: Rendición $6.000 x tanda
            </a>
          </div>
        </div>

        <!-- Packaging Visual with sticker and kraft box -->
        <div class="hero-visual">
          <div class="hero-image-wrapper">
            <img src="/assets/images/version_packcaging.jpeg" alt="Packaging kraft Don Borde con sticker original" />
          </div>

          <div class="hero-floating-badge">
            <div class="symbol-icon">
              <img src="/assets/images/simbolo.jpeg" alt="Símbolo Don Borde" />
            </div>
            <div>
              <div class="badge-label">Packaging Kraft Ecológico</div>
              <div class="badge-title">DON BORDE OFICIAL</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRIPLE CANAL INTRO STRIP -->
    <section style="background: var(--color-white); padding: 3.5rem 0; border-bottom: 1px solid var(--color-border);">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem;">
          <!-- Canal A -->
          <div class="tier-card" style="border-top: 4px solid var(--color-primary);">
            <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 0.75rem;">CANAL A · CONSUMIDOR FINAL</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">AL PASO & HOGAR</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Pizzetas listas con muzzarella para comer caliente en la calle o pre-pizzas para hornear con la familia.
            </p>
            <div style="background: var(--color-cream); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; margin-bottom: 1.25rem;">
              • Unidad suelta lista: $850<br/>
              • Combo 3 pizzetas con queso: <strong>$2.000</strong>
            </div>
            <a href="#/productos?channel=minorista" class="btn btn-outline btn-block btn-sm" style="margin-top: auto;">
              Pedir Minorista
            </a>
          </div>

          <!-- Canal B -->
          <div class="tier-card" style="border-top: 4px solid var(--color-primary); box-shadow: var(--shadow-card);">
            <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 0.75rem;">CANAL B · MAYORISTA B2B</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">COMERCIOS & CAFETERÍAS</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Bolsas x10 pre-pizzetas para cocinar en el salón o revender. Escala automática desde 3 paquetes.
            </p>
            <div style="background: var(--color-cream); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; margin-bottom: 1.25rem;">
              • 1-2 paquetes: $3.500 ($350 c/u)<br/>
              • 3+ paquetes: <strong>$3.000 ($300 c/u)</strong>
            </div>
            <a href="#/comercios" class="btn btn-primary btn-block btn-sm" style="margin-top: auto;">
              Ver Condiciones B2B
            </a>
          </div>

          <!-- Canal C -->
          <div class="tier-card" style="border-top: 4px solid var(--color-carbon);">
            <span class="badge badge-carbon" style="align-self: flex-start; margin-bottom: 0.75rem;">CANAL C · VENTA AMBULANTE</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">ZONA VENDEDORES</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Retirá tandas de 15 pizzetas en combos de 3. Rendición fija para producción y ganancia en mano.
            </p>
            <div style="background: var(--color-cream); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; margin-bottom: 1.25rem;">
              • Rendición fija Don Borde: $6.000<br/>
              • Ganancia estimada x tanda: <strong>$4.000</strong>
            </div>
            <a href="#/preventistas" class="btn btn-secondary btn-block btn-sm" style="margin-top: auto;">
              Portal Vendedores
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- LO QUE SALE DEL HORNO (CATÁLOGO DESTACADO) -->
    <section style="padding: 5rem 0 3rem;">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">Directo de la producción</span>
          <h2 class="section-title">LO QUE SALE DEL HORNO</h2>
          <p class="section-subtitle">
            Elegí tus favoritos. Podés comprar por carrito o enviar tu pedido directo a nuestro WhatsApp.
          </p>
        </div>

        <div class="product-grid" id="featured-products-grid">
          <!-- Rendered via JS -->
        </div>

        <div style="text-align: center; margin-top: 3.5rem;">
          <a href="#/productos" class="btn btn-secondary btn-lg">
            VER TODOS LOS PRODUCTOS ${icons.arrowRight('', 18)}
          </a>
        </div>
      </div>
    </section>

    <!-- CALCULADORAS DINÁMICAS DUALES (COMERCIOS & PREVENTISTAS) -->
    <section style="background-color: var(--color-cream-light); padding: 5rem 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
      <div class="container" style="max-width: 1040px;">
        <div class="section-header text-center">
          <span class="section-tag">Simuladores de Rentabilidad Oficiales</span>
          <h2 class="section-title">CALCULÁ TU GANANCIA CON DON BORDE</h2>
          <p class="section-subtitle">Tanto si tenés una cafetería como si salís a vender a la calle, mirá exactamente tus números.</p>
        </div>

        <!-- Dual Selector Tabs -->
        <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2.5rem;">
          <button class="btn btn-primary" id="tab-btn-calc-comercio" style="padding: 0.75rem 1.75rem;">
            🏪 Calculadora Cafeterías & Comercios
          </button>
          <button class="btn btn-cream" id="tab-btn-calc-preventista" style="padding: 0.75rem 1.75rem;">
            🚶‍♂️ Calculadora Vendedores & Tandas
          </button>
        </div>

        <!-- Panel 1: Comercios -->
        <div id="panel-calc-comercio" class="b2b-calculator-card" style="margin-top: 0;">
          <div class="calc-grid">
            <div class="calc-slider-box">
              <span class="badge badge-primary" style="align-self: flex-start;">PRECIO MAYORISTA: $300 C/U (DESDE 3 BOLSAS X10)</span>
              
              <div>
                <label style="display: flex; justify-content: space-between; font-weight: 800; font-family: var(--font-headline); margin-bottom: 0.5rem;">
                  <span>Precio al que vendés la pizzeta servida en tu local:</span>
                  <span style="color: var(--color-primary); font-size: 1.25rem;" id="display-comercio-price">$1.200</span>
                </label>
                <input type="range" id="input-comercio-price" min="600" max="2500" step="50" value="${calcComercioPrice}" />
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted);">
                  <span>$600 (Económico)</span>
                  <span>$1.200 (Sugerido Carta)</span>
                  <span>$2.500 (Gourmet / Bar)</span>
                </div>
              </div>

              <div style="margin-top: 1rem;">
                <label style="display: flex; justify-content: space-between; font-weight: 800; font-family: var(--font-headline); margin-bottom: 0.5rem;">
                  <span>Unidades vendidas por semana:</span>
                  <span style="color: var(--color-carbon); font-size: 1.25rem;" id="display-comercio-units">100 pizzetas</span>
                </label>
                <input type="range" id="input-comercio-units" min="20" max="500" step="10" value="${calcComercioUnits}" />
              </div>
            </div>

            <div class="calc-result-box">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--color-carbon-muted);">
                Tu Margen Comercial Bruto:
              </span>
              <div class="calc-result-number" id="display-comercio-margin" style="font-size: 3rem;">
                300%
              </div>
              <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">
                Ganancia neta mensual estimada: <strong id="display-comercio-monthly" style="color: var(--color-carbon);">$360.000</strong>
              </p>
              <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Tengo%20un%20comercio%20y%20quiero%20hacer%20un%20pedido%20mayorista" target="_blank" class="btn btn-primary btn-block btn-sm">
                ${icons.whatsapp('', 16)} Pedir Lista Mayorista por WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Panel 2: Preventistas -->
        <div id="panel-calc-preventista" class="b2b-calculator-card" style="display: none; margin-top: 0;">
          <div class="calc-grid">
            <div class="calc-slider-box">
              <span class="badge badge-carbon" style="align-self: flex-start;">RENDICIÓN FIJA DON BORDE: $6.000 POR TANDA (15 UNIDADES)</span>

              <div>
                <label style="display: flex; justify-content: space-between; font-weight: 800; font-family: var(--font-headline); margin-bottom: 0.5rem;">
                  <span>Tandas que retirás para vender hoy:</span>
                  <span style="color: var(--color-primary); font-size: 1.25rem;" id="display-prev-tandas">2 tandas (30 pizzetas)</span>
                </label>
                <input type="range" id="input-prev-tandas" min="1" max="10" step="1" value="${calcPreventistaTandas}" />
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted);">
                  <span>1 tanda (15 un.)</span>
                  <span>5 tandas (75 un.)</span>
                  <span>10 tandas (150 un.)</span>
                </div>
              </div>

              <div style="margin-top: 1rem;">
                <label style="display: flex; justify-content: space-between; font-weight: 800; font-family: var(--font-headline); margin-bottom: 0.5rem;">
                  <span>Precio al que vendés el Combo de 3 en calle:</span>
                  <span style="color: var(--color-carbon); font-size: 1.25rem;" id="display-prev-combo-price">$2.000</span>
                </label>
                <input type="range" id="input-prev-combo-price" min="1500" max="3000" step="100" value="${calcPreventistaPrice}" />
              </div>
            </div>

            <div class="calc-result-box">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--color-carbon-muted);">
                Tu Ganancia Neta en Mano:
              </span>
              <div class="calc-result-number" id="display-prev-net-profit" style="font-size: 3rem;">
                $8.000
              </div>
              <p style="font-size: 0.85rem; color: var(--color-carbon-muted); margin-bottom: 0.75rem;">
                Rendición a entregar a Don Borde: <strong id="display-prev-rendition">$12.000</strong>
              </p>
              <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=Hola%20Don%20Borde!%20Soy%20vendedor%20de%20calle%20y%20quiero%20retirar%20tandas%20hoy" target="_blank" class="btn btn-secondary btn-block btn-sm">
                ${icons.whatsapp('', 16)} Reservar Tandas por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BRAND STORY & PACKAGING -->
    <section style="background-color: var(--color-white); padding: 5rem 0;">
      <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
        <div class="hero-image-wrapper">
          <img src="/assets/images/hero_pizzeta.jpg" alt="Pizzeta artesanal Don Borde" />
        </div>

        <div>
          <span class="section-tag">Tradición & Calidad</span>
          <h2 style="font-size: clamp(2rem, 3.5vw, 2.75rem); margin-bottom: 1rem;">
            EL SECRETO ESTÁ EN EL BORDE.
          </h2>
          <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.25rem;">
            En Don Borde no hacemos pizzas industriales. Cada masa se fermenta 48 horas en frío, se estira a mano y se hornea a fuego vivo sobre piedra volcánica.
          </p>
          <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem;">
            Tanto si las comés al paso como si las servís en tu negocio, te garantizamos muzzarella auténtica, salsa natural y ese crocante irresistible.
          </p>
          <a href="#/productos" class="btn btn-primary btn-lg">
            PROBAR DON BORDE HOY
          </a>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = html;

  // Insert featured products
  const grid = container.querySelector('#featured-products-grid');
  if (grid) {
    featuredProducts.forEach(p => grid.appendChild(createProductCard(p)));
  }

  // Interactive Calculators Logic
  const tabComercio = container.querySelector('#tab-btn-calc-comercio');
  const tabPrev = container.querySelector('#tab-btn-calc-preventista');
  const panelComercio = container.querySelector('#panel-calc-comercio');
  const panelPrev = container.querySelector('#panel-calc-preventista');

  if (tabComercio && tabPrev) {
    tabComercio.addEventListener('click', () => {
      tabComercio.className = 'btn btn-primary';
      tabPrev.className = 'btn btn-cream';
      panelComercio.style.display = 'block';
      panelPrev.style.display = 'none';
    });

    tabPrev.addEventListener('click', () => {
      tabPrev.className = 'btn btn-primary';
      tabComercio.className = 'btn btn-cream';
      panelPrev.style.display = 'block';
      panelComercio.style.display = 'none';
    });
  }

  // Comercio Calc listeners
  const inputComercioPrice = container.querySelector('#input-comercio-price');
  const inputComercioUnits = container.querySelector('#input-comercio-units');
  const displayComercioPrice = container.querySelector('#display-comercio-price');
  const displayComercioUnits = container.querySelector('#display-comercio-units');
  const displayComercioMargin = container.querySelector('#display-comercio-margin');
  const displayComercioMonthly = container.querySelector('#display-comercio-monthly');

  function updateComercioCalc() {
    const price = parseInt(inputComercioPrice.value, 10);
    const units = parseInt(inputComercioUnits.value, 10);
    displayComercioPrice.textContent = `$${price.toLocaleString('es-AR')}`;
    displayComercioUnits.textContent = `${units} pizzetas`;

    const res = calculateComercioMargin(300, price, units);
    displayComercioMargin.textContent = `${res.marginPercent}%`;
    displayComercioMonthly.textContent = `$${res.monthlyProfit.toLocaleString('es-AR')}`;
  }

  if (inputComercioPrice && inputComercioUnits) {
    inputComercioPrice.addEventListener('input', updateComercioCalc);
    inputComercioUnits.addEventListener('input', updateComercioCalc);
    updateComercioCalc();
  }

  // Preventista Calc listeners
  const inputPrevTandas = container.querySelector('#input-prev-tandas');
  const inputPrevComboPrice = container.querySelector('#input-prev-combo-price');
  const displayPrevTandas = container.querySelector('#display-prev-tandas');
  const displayPrevComboPrice = container.querySelector('#display-prev-combo-price');
  const displayPrevNetProfit = container.querySelector('#display-prev-net-profit');
  const displayPrevRendition = container.querySelector('#display-prev-rendition');

  function updatePrevCalc() {
    const tandas = parseInt(inputPrevTandas.value, 10);
    const comboPrice = parseInt(inputPrevComboPrice.value, 10);
    displayPrevTandas.textContent = `${tandas} tanda${tandas > 1 ? 's' : ''} (${tandas * 15} pizzetas)`;
    displayPrevComboPrice.textContent = `$${comboPrice.toLocaleString('es-AR')}`;

    const res = calculatePreventistaEarnings(tandas, comboPrice);
    displayPrevNetProfit.textContent = `$${res.netProfit.toLocaleString('es-AR')}`;
    displayPrevRendition.textContent = `$${res.fixedRendition.toLocaleString('es-AR')}`;
  }

  if (inputPrevTandas && inputPrevComboPrice) {
    inputPrevTandas.addEventListener('input', updatePrevCalc);
    inputPrevComboPrice.addEventListener('input', updatePrevCalc);
    updatePrevCalc();
  }
}
