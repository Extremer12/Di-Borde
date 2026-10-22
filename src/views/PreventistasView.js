import { icons } from '../components/icons.js';
import { calculatePreventistaEarnings } from '../data/products.js';
import { DON_BORDE_WHATSAPP_PHONE } from '../state/cartStore.js';
import { toastStore } from '../state/toastStore.js';

export function renderPreventistasView(container) {
  let vendorName = localStorage.getItem('don_borde_vendor_name') || 'Lucas';
  let vendorZone = localStorage.getItem('don_borde_vendor_zone') || 'Palermo / Belgrano';
  let isLoggedIn = Boolean(localStorage.getItem('don_borde_vendor_logged'));

  let selectedTandas = 2; // Default 2 tandas (30 pizzetas = 10 combos)
  let streetComboPrice = 2000; // $2.000 por combo de 3

  function render() {
    const earnings = calculatePreventistaEarnings(selectedTandas, streetComboPrice);

    const html = `
      <!-- PREVENTISTAS HEADER -->
      <section class="preventistas-header">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.5rem;">CANAL C · VENDEDORES AMBULANTES & PREVENTISTAS</span>
            <h1 style="color: #fff; font-size: clamp(1.85rem, 3.5vw, 2.5rem); margin: 0.25rem 0;">
              Portal de Vendedores de Calle
            </h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0;">
              ${isLoggedIn ? `Sesión Activa: <strong>${vendorName}</strong> (${vendorZone})` : 'Retirá tandas de 15 pizzetas en el obrador y ganá en mano todos los días.'}
            </p>
          </div>

          <div>
            ${isLoggedIn ? `
              <button class="btn btn-cream btn-sm" id="btn-vendor-logout">
                Cerrar Sesión (${vendorName})
              </button>
            ` : `
              <button class="btn btn-cream btn-sm" id="btn-vendor-login-trigger">
                ${icons.user('', 16)} Ingresar como Vendedor
              </button>
            `}
          </div>
        </div>
      </section>

      <div class="container" style="padding-top: 3rem; padding-bottom: 5rem; max-width: 1040px;">
        <!-- REGLA DE RENDICIÓN OFICIAL -->
        <div style="background: var(--color-white); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div>
              <span class="badge badge-primary">MODELO DE RENDICIÓN OFICIAL DON BORDE</span>
              <h2 style="font-size: 1.5rem; margin-top: 0.35rem;">TANDAS DE 15 PIZZETAS (5 COMBOS DE 3)</h2>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.8rem; color: var(--color-carbon-muted); text-transform: uppercase; font-weight: 800;">Rendición fija Don Borde:</span>
              <div style="font-family: var(--font-headline); font-size: 1.75rem; font-weight: 900; color: var(--color-carbon);">$6.000 / tanda</div>
              <span style="font-size: 0.75rem; color: var(--color-carbon-muted);">$400 de costo por pizzeta lista</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; font-size: 0.92rem;">
            <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm);">
              <strong>1. Retirás en el Obrador:</strong><br/>
              Llevás tandas de 15 pizzetas calientes o listas en combos de 3 con packaging Don Borde.
            </div>
            <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm);">
              <strong>2. Vendés en la Calle:</strong><br/>
              Precio sugerido: <strong>$2.000 el combo de 3</strong>. Recaudás $10.000 por cada tanda.
            </div>
            <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--color-success);">
              <strong style="color: var(--color-success);">3. Tu Ganancia en Mano:</strong><br/>
              Rendís $6.000 al obrador y te quedan <strong>$4.000 de ganancia neta</strong> por tanda.
            </div>
          </div>
        </div>

        <!-- CALCULADORA INTERACTIVA DE TANDAS -->
        <div class="b2b-calculator-card" style="margin-top: 0; margin-bottom: 3rem;">
          <div class="section-header">
            <span class="section-tag">Calculadora para Vendedores</span>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.35rem;">SIMULÁ TU GANANCIA DE HOY</h2>
            <p style="font-size: 0.95rem; color: var(--color-carbon-muted);">
              Elegí cuántas tandas querés retirar y el precio al que querés ofrecer el combo de 3:
            </p>
          </div>

          <div class="calc-grid">
            <div class="calc-slider-box">
              <!-- Tandas Slider -->
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                  <label style="font-family: var(--font-headline); font-weight: 800; font-size: 0.95rem;">
                    Cantidad de tandas a retirar:
                  </label>
                  <span style="font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--color-primary);" id="prev-tandas-display">
                    ${selectedTandas} tandas (${selectedTandas * 15} pizzetas)
                  </span>
                </div>
                <input type="range" id="prev-tandas-slider" min="1" max="10" step="1" value="${selectedTandas}" />
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted); margin-top: 0.25rem;">
                  <span>1 tanda (5 combos)</span>
                  <span>5 tandas (25 combos)</span>
                  <span>10 tandas (50 combos)</span>
                </div>
              </div>

              <!-- Street Price Slider -->
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                  <label style="font-family: var(--font-headline); font-weight: 800; font-size: 0.95rem;">
                    Precio del combo de 3 en la calle:
                  </label>
                  <span style="font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--color-carbon);" id="prev-price-display">
                    $${streetComboPrice.toLocaleString('es-AR')}
                  </span>
                </div>
                <input type="range" id="prev-price-slider" min="1500" max="3000" step="100" value="${streetComboPrice}" />
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-carbon-muted); margin-top: 0.25rem;">
                  <span>$1.500 (Promo barata)</span>
                  <span>$2.000 (Sugerido Don Borde)</span>
                  <span>$3.000 (Zonas premium/eventos)</span>
                </div>
              </div>

              <div style="background: var(--color-cream); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
                ℹ️ Rendición fija requerida para producción: <strong>$${(selectedTandas * 6000).toLocaleString('es-AR')}</strong> ($6.000 x ${selectedTandas} tandas).
              </div>
            </div>

            <!-- Result Box -->
            <div class="calc-result-box">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-carbon-muted);">
                Tu Ganancia Neta Estimada:
              </span>
              <div class="calc-result-number" id="prev-profit-display" style="font-size: 3.5rem;">
                $${earnings.netProfit.toLocaleString('es-AR')}
              </div>

              <div style="margin: 1.25rem 0; padding: 1rem 0; border-top: 1px dashed var(--color-border); border-bottom: 1px dashed var(--color-border); text-align: left; font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Recaudación en calle:</span>
                  <strong id="prev-revenue-display">$${earnings.totalRevenue.toLocaleString('es-AR')}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Rendición fija al Obrador:</span>
                  <strong style="color: var(--color-carbon);" id="prev-cost-display">-$${earnings.fixedRendition.toLocaleString('es-AR')}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 800; color: var(--color-success);">
                  <span>Ganancia neta por tanda:</span>
                  <span id="prev-profit-tanda-display">+$${earnings.profitPerTanda.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <!-- WhatsApp Direct Reservation Button -->
              <a href="#" id="btn-reserve-tandas-wa" target="_blank" class="btn btn-primary btn-block btn-lg" style="background-color: #25D366; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
                ${icons.whatsapp('', 20)} RESERVAR TANDAS POR WHATSAPP
              </a>
            </div>
          </div>
        </div>

        <!-- LOGIN / REGISTRO MODAL (IF NOT LOGGED IN) -->
        <div id="vendor-auth-box" style="background: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2.5rem; ${isLoggedIn ? 'display: none;' : ''}">
          <div class="section-header" style="margin-bottom: 1.5rem;">
            <span class="section-tag">Acceso Vendedores</span>
            <h3 style="font-size: 1.35rem;">REGISTRO RÁPIDO DE PREVENTISTA</h3>
            <p style="font-size: 0.9rem; color: var(--color-carbon-muted);">
              Ingresá tu nombre y zona de venta para guardar tus preferencias de retiro y tener contacto prioritario con el obrador.
            </p>
          </div>

          <form id="vendor-quick-login-form">
            <div class="form-row">
              <div class="form-group">
                <label for="v-name">Tu Nombre y Apellido *</label>
                <input type="text" id="v-name" required value="${vendorName}" placeholder="Ej. Lucas Gómez" />
              </div>
              <div class="form-group">
                <label for="v-zone">Zona donde vendés *</label>
                <input type="text" id="v-zone" required value="${vendorZone}" placeholder="Ej. Retiro, Once, Palermo, etc." />
              </div>
            </div>

            <button type="submit" class="btn btn-secondary">
              Guardar Perfil de Vendedor
            </button>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    const tandasSlider = container.querySelector('#prev-tandas-slider');
    const priceSlider = container.querySelector('#prev-price-slider');
    const tandasDisplay = container.querySelector('#prev-tandas-display');
    const priceDisplay = container.querySelector('#prev-price-display');
    const profitDisplay = container.querySelector('#prev-profit-display');
    const revenueDisplay = container.querySelector('#prev-revenue-display');
    const costDisplay = container.querySelector('#prev-cost-display');
    const profitTandaDisplay = container.querySelector('#prev-profit-tanda-display');
    const reserveWaBtn = container.querySelector('#btn-reserve-tandas-wa');

    function updateCalculations() {
      selectedTandas = parseInt(tandasSlider.value, 10);
      streetComboPrice = parseInt(priceSlider.value, 10);

      tandasDisplay.textContent = `${selectedTandas} tanda${selectedTandas > 1 ? 's' : ''} (${selectedTandas * 15} pizzetas / ${selectedTandas * 5} combos)`;
      priceDisplay.textContent = `$${streetComboPrice.toLocaleString('es-AR')}`;

      const res = calculatePreventistaEarnings(selectedTandas, streetComboPrice);
      profitDisplay.textContent = `$${res.netProfit.toLocaleString('es-AR')}`;
      revenueDisplay.textContent = `$${res.totalRevenue.toLocaleString('es-AR')}`;
      costDisplay.textContent = `-$${res.fixedRendition.toLocaleString('es-AR')}`;
      profitTandaDisplay.textContent = `+$${res.profitPerTanda.toLocaleString('es-AR')}`;

      // Build WhatsApp link
      const waText = encodeURIComponent(
        `🍕 *RESERVA DE TANDAS - VENDEDOR DON BORDE*\n\n` +
        `👤 *Vendedor:* ${vendorName} (${vendorZone})\n` +
        `📦 *Tandas solicitadas:* ${selectedTandas} tandas (${selectedTandas * 15} pizzetas / ${selectedTandas * 5} combos de 3)\n` +
        `💰 *Rendición fija al Obrador:* $${res.fixedRendition.toLocaleString('es-AR')}\n` +
        `💵 *Ganancia estimada en mano:* $${res.netProfit.toLocaleString('es-AR')}\n\n` +
        `Quiero retirar estas tandas hoy en el obrador. ¿A qué hora puedo pasar?`
      );

      reserveWaBtn.href = `https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=${waText}`;
    }

    if (tandasSlider && priceSlider) {
      tandasSlider.addEventListener('input', updateCalculations);
      priceSlider.addEventListener('input', updateCalculations);
      updateCalculations();
    }

    // Login logic
    const loginForm = container.querySelector('#vendor-quick-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        vendorName = container.querySelector('#v-name').value;
        vendorZone = container.querySelector('#v-zone').value;
        isLoggedIn = true;
        localStorage.setItem('don_borde_vendor_name', vendorName);
        localStorage.setItem('don_borde_vendor_zone', vendorZone);
        localStorage.setItem('don_borde_vendor_logged', '1');
        toastStore.show(`¡Bienvenido ${vendorName}! Perfil guardado.`, 'success');
        render();
      });
    }

    const logoutBtn = container.querySelector('#btn-vendor-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('don_borde_vendor_logged');
        isLoggedIn = false;
        toastStore.show('Sesión cerrada', 'info');
        render();
      });
    }

    const loginTrigger = container.querySelector('#btn-vendor-login-trigger');
    if (loginTrigger) {
      loginTrigger.addEventListener('click', () => {
        const authBox = container.querySelector('#vendor-auth-box');
        if (authBox) {
          authBox.style.display = 'block';
          authBox.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  render();
}
