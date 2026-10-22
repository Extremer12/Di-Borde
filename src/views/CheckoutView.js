import { icons } from '../components/icons.js';
import { cartStore, DON_BORDE_WHATSAPP_PHONE } from '../state/cartStore.js';
import { orderStore } from '../state/orderStore.js';
import { toastStore } from '../state/toastStore.js';
import { router } from '../router.js';

export function renderCheckoutView(container) {
  const items = cartStore.getItems();
  let currentStep = 1; // 1: Datos, 2: Entrega, 3: Pago, 4: Confirmación
  let createdOrder = null;

  // Form State
  const formData = {
    channel: cartStore.activeChannel || 'minorista',
    name: "Julián Albarracín",
    email: "julian@ejemplo.com",
    phone: "11 4920-1122",
    rubro: "",
    deliveryType: "delivery", // 'delivery' or 'pickup'
    address: "Av. Corrientes 3420",
    floorDept: "Piso 4 B",
    zone: "CABA",
    deliveryNotes: "Tocar timbre 4B",
    paymentMethod: "Mercado Pago"
  };

  function render() {
    if (items.length === 0 && currentStep !== 4) {
      container.innerHTML = `
        <div class="container" style="padding: 6rem 1rem; text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p style="margin: 1rem 0 2rem; color: var(--color-carbon-muted);">
            Para realizar el checkout, primero debés seleccionar tus productos.
          </p>
          <a href="#/productos" class="btn btn-primary btn-lg">Ver Catálogo de Productos</a>
        </div>
      `;
      return;
    }

    const subtotal = cartStore.getSubtotal();
    let discount = cartStore.getDiscount();
    let shipping = formData.deliveryType === 'pickup' ? 0 : cartStore.getShippingCost();

    // 10% extra discount for transfer
    if (formData.paymentMethod === 'Transferencia Bancaria') {
      discount += Math.round((subtotal * 0.1));
    }

    const total = Math.max(0, subtotal - discount + shipping);

    const html = `
      <div class="container checkout-page">
        <!-- Steps Header -->
        <div class="checkout-steps-bar">
          <div class="step-indicator ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}">
            <span class="step-number">${currentStep > 1 ? '✓' : '1'}</span>
            <span>1. Datos</span>
          </div>
          <div style="width: 30px; height: 2px; background: var(--color-border);"></div>

          <div class="step-indicator ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}">
            <span class="step-number">${currentStep > 2 ? '✓' : '2'}</span>
            <span>2. Entrega</span>
          </div>
          <div style="width: 30px; height: 2px; background: var(--color-border);"></div>

          <div class="step-indicator ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}">
            <span class="step-number">${currentStep > 3 ? '✓' : '3'}</span>
            <span>3. Pago / WhatsApp</span>
          </div>
          <div style="width: 30px; height: 2px; background: var(--color-border);"></div>

          <div class="step-indicator ${currentStep === 4 ? 'active' : ''}">
            <span class="step-number">4</span>
            <span>4. Confirmación</span>
          </div>
        </div>

        <!-- Checkout Layout Grid -->
        <div class="checkout-grid">
          <!-- Left Column: Step Form / Confirmation -->
          <div>
            ${currentStep === 1 ? renderStep1() : ''}
            ${currentStep === 2 ? renderStep2() : ''}
            ${currentStep === 3 ? renderStep3() : ''}
            ${currentStep === 4 ? renderStep4(createdOrder) : ''}
          </div>

          <!-- Right Column: Permanent Order Summary in Desktop -->
          ${currentStep !== 4 ? `
            <aside class="checkout-sidebar">
              <h3 style="font-size: 1.15rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1.25rem;">
                Resumen de tu Pedido (${cartStore.getItemCount()})
              </h3>

              <div class="checkout-order-items">
                ${items.map(item => {
                  const unitPrice = cartStore.getItemUnitPrice(item);
                  const isTier = cartStore.hasTierDiscountApplied(item);
                  return `
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                      <img src="${item.product.image}" alt="${item.product.name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--color-border);" />
                      <div style="flex: 1;">
                        <div style="font-size: 0.9rem; font-weight: 800; font-family: var(--font-headline);">${item.product.name}</div>
                        <div style="font-size: 0.78rem; color: var(--color-carbon-muted);">
                          ${item.quantity} x $${unitPrice.toLocaleString('es-AR')}
                          ${isTier ? '<span style="color: var(--color-success); font-weight: 700;">(Promo 3+)</span>' : ''}
                        </div>
                      </div>
                      <div style="font-weight: 800; font-family: var(--font-headline); font-size: 0.95rem;">
                        $${(unitPrice * item.quantity).toLocaleString('es-AR')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.92rem;">
                <div style="display: flex; justify-content: space-between; color: var(--color-carbon-muted);">
                  <span>Subtotal</span>
                  <strong>$${subtotal.toLocaleString('es-AR')}</strong>
                </div>

                ${discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; color: var(--color-primary); font-weight: 700;">
                    <span>Descuento aplicado</span>
                    <strong>-$${discount.toLocaleString('es-AR')}</strong>
                  </div>
                ` : ''}

                <div style="display: flex; justify-content: space-between; color: var(--color-carbon-muted);">
                  <span>Envío (${formData.deliveryType === 'pickup' ? 'Retiro en Obrador' : 'Domicilio'})</span>
                  <span>${shipping === 0 ? '<strong style="color: var(--color-success);">GRATIS</strong>' : '$' + shipping.toLocaleString('es-AR')}</span>
                </div>

                <div style="display: flex; justify-content: space-between; font-family: var(--font-headline); font-size: 1.35rem; font-weight: 900; color: var(--color-carbon); padding-top: 0.75rem; border-top: 1px dashed var(--color-border);">
                  <span>TOTAL FINAL</span>
                  <span style="color: var(--color-primary);">$${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <!-- Quick WhatsApp Checkout shortcut -->
              <div style="margin-top: 1.5rem;">
                <a href="${cartStore.buildWhatsAppMessage(formData, formData.deliveryType, formData.channel)}" target="_blank" class="btn btn-primary btn-block btn-sm" style="background-color: #25D366; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  ${icons.whatsapp('', 16)} Enviar este pedido por WhatsApp
                </a>
              </div>
            </aside>
          ` : ''}
        </div>
      </div>
    `;

    container.innerHTML = html;
    bindStepEvents();
  }

  function renderStep1() {
    return `
      <div class="checkout-form-card">
        <h2 class="form-section-title">
          ${icons.user('', 22)} 1. Perfil y Datos de Contacto
        </h2>
        <p style="font-size: 0.9rem; color: var(--color-carbon-muted); margin-bottom: 1.5rem;">
          Indicá tu perfil de compra y tus datos de contacto para coordinar la entrega.
        </p>

        <form id="step-1-form">
          <!-- Profile / Channel Selector -->
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label for="input-channel">Perfil de Compra *</label>
            <select id="input-channel" style="font-weight: 700;">
              <option value="minorista" ${formData.channel === 'minorista' ? 'selected' : ''}>🍕 Consumidor Final / Al Paso (Minorista)</option>
              <option value="mayorista" ${formData.channel === 'mayorista' ? 'selected' : ''}>🏪 Comercio / Cafetería (B2B Mayorista)</option>
              <option value="preventistas" ${formData.channel === 'preventistas' ? 'selected' : ''}>🚶‍♂️ Vendedor Ambulante / Preventista (Tandas)</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="input-name">Nombre y Apellido / Razón Social *</label>
              <input type="text" id="input-name" required value="${formData.name}" placeholder="Ej. Juan Pérez / Café Central" />
            </div>
            <div class="form-group" id="group-rubro" style="${formData.channel === 'mayorista' ? '' : 'display: none;'}">
              <label for="input-rubro">Rubro del Negocio</label>
              <input type="text" id="input-rubro" value="${formData.rubro}" placeholder="Ej. Cafetería, Fiambrería, Bar" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="input-email">Correo Electrónico *</label>
              <input type="email" id="input-email" required value="${formData.email}" placeholder="tu@correo.com" />
            </div>
            <div class="form-group">
              <label for="input-phone">WhatsApp / Celular *</label>
              <input type="tel" id="input-phone" required value="${formData.phone}" placeholder="11 2345-6789" />
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
            <button type="submit" class="btn btn-primary btn-lg">
              Continuar a Entrega ${icons.arrowRight('', 18)}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function renderStep2() {
    return `
      <div class="checkout-form-card">
        <h2 class="form-section-title">
          ${icons.truck('', 22)} 2. Forma de Entrega
        </h2>

        <!-- Delivery Type Radio -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem; border: 1.5px solid ${formData.deliveryType === 'delivery' ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: var(--radius-md); background: ${formData.deliveryType === 'delivery' ? 'var(--color-white)' : 'var(--color-cream-light)'}; cursor: pointer;">
            <input type="radio" name="delivery-type" value="delivery" ${formData.deliveryType === 'delivery' ? 'checked' : ''} />
            <div>
              <strong style="display: block; font-family: var(--font-headline); font-size: 0.95rem;">Envío a Domicilio</strong>
              <span style="font-size: 0.78rem; color: var(--color-carbon-muted);">CABA y Gran Buenos Aires</span>
            </div>
          </label>

          <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem; border: 1.5px solid ${formData.deliveryType === 'pickup' ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: var(--radius-md); background: ${formData.deliveryType === 'pickup' ? 'var(--color-white)' : 'var(--color-cream-light)'}; cursor: pointer;">
            <input type="radio" name="delivery-type" value="pickup" ${formData.deliveryType === 'pickup' ? 'checked' : ''} />
            <div>
              <strong style="display: block; font-family: var(--font-headline); font-size: 0.95rem;">Retiro en Obrador</strong>
              <span style="font-size: 0.78rem; color: var(--color-success); font-weight: 700;">Gratis · Palermo, CABA</span>
            </div>
          </label>
        </div>

        <form id="step-2-form">
          ${formData.deliveryType === 'delivery' ? `
            <div class="form-row">
              <div class="form-group" style="grid-column: span 2;">
                <label for="input-address">Calle y Altura *</label>
                <input type="text" id="input-address" required value="${formData.address}" placeholder="Ej. Av. Corrientes 3420" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="input-floor">Piso / Departamento</label>
                <input type="text" id="input-floor" value="${formData.floorDept}" placeholder="Ej. 4to B" />
              </div>
              <div class="form-group">
                <label for="input-zone">Zona / Localidad *</label>
                <select id="input-zone">
                  <option value="CABA" ${formData.zone === 'CABA' ? 'selected' : ''}>Ciudad Autónoma de Buenos Aires (CABA)</option>
                  <option value="Zona Norte" ${formData.zone === 'Zona Norte' ? 'selected' : ''}>GBA Zona Norte</option>
                  <option value="Zona Oeste" ${formData.zone === 'Zona Oeste' ? 'selected' : ''}>GBA Zona Oeste</option>
                  <option value="Zona Sur" ${formData.zone === 'Zona Sur' ? 'selected' : ''}>GBA Zona Sur</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="input-notes">Notas para el repartidor (opcional)</label>
              <textarea id="input-notes" rows="2" placeholder="Ej. Tocar timbre, dejar en recepción...">${formData.deliveryNotes}</textarea>
            </div>
          ` : `
            <div style="background: var(--color-cream); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Punto de Retiro Oficial</h4>
              <p style="margin: 0; font-size: 0.9rem;">
                <strong>Obrador Don Borde:</strong> Gorriti 4920, Palermo Soho, CABA.<br/>
                <strong>Horario de retiro:</strong> Lunes a Sábados de 08:00 a 20:30 hs.<br/>
                ¡Tu pedido se prepara con la masa fresca del día!
              </p>
            </div>
          `}

          <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button type="button" class="btn btn-outline" id="btn-back-step-1">
              Volver a Datos
            </button>
            <button type="submit" class="btn btn-primary btn-lg">
              Continuar al Pago ${icons.arrowRight('', 18)}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function renderStep3() {
    const waUrl = cartStore.buildWhatsAppMessage(formData, formData.deliveryType, formData.channel);

    return `
      <div class="checkout-form-card">
        <h2 class="form-section-title">
          ${icons.shield('', 22)} 3. Método de Pago & Envío
        </h2>
        <p style="font-size: 0.9rem; color: var(--color-carbon-muted); margin-bottom: 1.5rem;">
          Podés confirmar tu pedido directamente por WhatsApp para coordinar en el acto, o elegir un medio de pago en línea.
        </p>

        <!-- Direct WhatsApp Option (Top Highlight) -->
        <div style="background: var(--color-success-bg); border: 2px solid var(--color-success); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <span class="badge badge-success" style="margin-bottom: 0.35rem;">OPCIÓN MÁS RÁPIDA</span>
              <h3 style="font-size: 1.25rem; margin: 0; color: #1B5E20;">Confirmar Pedido Directo por WhatsApp</h3>
            </div>
            <a href="${waUrl}" target="_blank" class="btn btn-primary" style="background-color: #25D366; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4); font-size: 0.95rem;">
              ${icons.whatsapp('', 20)} ENVIAR PEDIDO AHORA
            </a>
          </div>
          <p style="margin: 0; font-size: 0.88rem; color: #2E7D32;">
            Genera un mensaje con el detalle de tu perfil (${formData.channel}), los productos, cantidades y tu dirección de entrega. ¡Te responde un maestro pizzero del obrador al instante!
          </p>
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; text-transform: uppercase;">O abonar mediante:</h3>

        <div class="payment-options-grid">
          <div class="payment-option-card ${formData.paymentMethod === 'Mercado Pago' ? 'active' : ''}" data-pay="Mercado Pago">
            <div class="title">Mercado Pago</div>
            <div class="desc">Dinero en cuenta, tarjetas o débito inmediato.</div>
          </div>

          <div class="payment-option-card ${formData.paymentMethod === 'Transferencia Bancaria' ? 'active' : ''}" data-pay="Transferencia Bancaria">
            <div class="title" style="color: var(--color-primary);">Transferencia (10% OFF)</div>
            <div class="desc">Descuento extra automático con CBU/Alias.</div>
          </div>

          <div class="payment-option-card ${formData.paymentMethod === 'Efectivo contra Entrega' ? 'active' : ''}" data-pay="Efectivo contra Entrega">
            <div class="title">Efectivo contra Entrega</div>
            <div class="desc">Abonás en mano al recibir el pedido.</div>
          </div>
        </div>

        ${formData.paymentMethod === 'Transferencia Bancaria' ? `
          <div style="background-color: var(--color-cream); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 1.5rem; font-size: 0.9rem;">
            <strong style="color: var(--color-carbon); display: block; margin-bottom: 0.5rem;">Datos para Transferencia Inmediata:</strong>
            <p style="margin: 0.2rem 0;"><strong>Alias:</strong> DON.BORDE.PIZZA</p>
            <p style="margin: 0.2rem 0;"><strong>CVU:</strong> 0000003100049201122003</p>
            <p style="margin: 0.2rem 0;"><strong>Titular:</strong> Don Borde Alimentos Artesanales</p>
            <p style="margin: 0.5rem 0 0; color: var(--color-success); font-weight: 700;">✓ 10% de descuento aplicado en el total</p>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
          <button type="button" class="btn btn-outline" id="btn-back-step-2">
            Volver a Entrega
          </button>
          <button type="button" class="btn btn-secondary btn-lg" id="btn-submit-order">
            CONFIRMAR POR WEB ${icons.check('', 18)}
          </button>
        </div>
      </div>
    `;
  }

  function renderStep4(order) {
    if (!order) return '';
    const whatsappMsg = encodeURIComponent(
      `¡Hola Don Borde! Acabo de hacer el pedido #${order.id} por $${order.total.toLocaleString('es-AR')} a nombre de ${order.customer.name} (Canal: ${order.channel}). ¿Me confirman horario de entrega?`
    );

    return `
      <div class="checkout-form-card" style="text-align: center; padding: 4rem 2.5rem;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-success-bg); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          ${icons.check('', 44)}
        </div>

        <span class="badge badge-primary" style="margin-bottom: 0.75rem;">¡PEDIDO RECIBIDO CON ÉXITO!</span>
        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">ORDEN #${order.id}</h1>
        <p style="font-size: 1.15rem; color: var(--color-carbon-muted); max-width: 500px; margin: 0 auto 2rem;">
          Muchas gracias, <strong>${order.customer.name}</strong>. Tu pedido ya está en cola de producción.
        </p>

        <div style="background-color: var(--color-cream); border-radius: var(--radius-lg); padding: 2rem; max-width: 540px; margin: 0 auto 2.5rem; text-align: left; border: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <strong>Canal:</strong>
            <span style="color: var(--color-primary); font-weight: 800; text-transform: uppercase;">${order.channel}</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
            <span>Destino:</span>
            <span>${order.customer.address} (${order.customer.zone})</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
            <span>Método de Pago:</span>
            <span>${order.paymentMethod}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 900; font-family: var(--font-headline); margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border);">
            <span>TOTAL ABONADO:</span>
            <span style="color: var(--color-primary);">$${order.total.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="https://wa.me/${DON_BORDE_WHATSAPP_PHONE}?text=${whatsappMsg}" target="_blank" class="btn btn-primary btn-lg" style="background-color: #25D366; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
            ${icons.whatsapp('', 20)} Notificar por WhatsApp
          </a>

          <a href="#/pedidos" class="btn btn-secondary btn-lg">
            ${icons.box('', 18)} Ver en Mis Pedidos
          </a>

          <a href="#/" class="btn btn-outline btn-lg">
            Volver al Inicio
          </a>
        </div>
      </div>
    `;
  }

  function bindStepEvents() {
    if (currentStep === 1) {
      const channelSelect = container.querySelector('#input-channel');
      const groupRubro = container.querySelector('#group-rubro');
      if (channelSelect) {
        channelSelect.addEventListener('change', (e) => {
          formData.channel = e.target.value;
          cartStore.setChannel(formData.channel);
          if (groupRubro) {
            groupRubro.style.display = formData.channel === 'mayorista' ? 'flex' : 'none';
          }
        });
      }

      const form1 = container.querySelector('#step-1-form');
      if (form1) {
        form1.addEventListener('submit', (e) => {
          e.preventDefault();
          formData.name = container.querySelector('#input-name').value;
          formData.email = container.querySelector('#input-email').value;
          formData.phone = container.querySelector('#input-phone').value;
          const rubroEl = container.querySelector('#input-rubro');
          if (rubroEl) formData.rubro = rubroEl.value;
          currentStep = 2;
          render();
        });
      }
    } else if (currentStep === 2) {
      const form2 = container.querySelector('#step-2-form');
      const back1 = container.querySelector('#btn-back-step-1');
      const deliveryRadios = container.querySelectorAll('input[name="delivery-type"]');

      deliveryRadios.forEach(r => {
        r.addEventListener('change', (e) => {
          formData.deliveryType = e.target.value;
          render();
        });
      });

      if (back1) {
        back1.addEventListener('click', () => {
          currentStep = 1;
          render();
        });
      }

      if (form2) {
        form2.addEventListener('submit', (e) => {
          e.preventDefault();
          if (formData.deliveryType === 'delivery') {
            formData.address = container.querySelector('#input-address').value;
            formData.floorDept = container.querySelector('#input-floor').value;
            formData.zone = container.querySelector('#input-zone').value;
            formData.deliveryNotes = container.querySelector('#input-notes').value;
          }
          currentStep = 3;
          render();
        });
      }
    } else if (currentStep === 3) {
      const back2 = container.querySelector('#btn-back-step-2');
      const payCards = container.querySelectorAll('.payment-option-card');
      const submitBtn = container.querySelector('#btn-submit-order');

      payCards.forEach(card => {
        card.addEventListener('click', () => {
          formData.paymentMethod = card.getAttribute('data-pay');
          render();
        });
      });

      if (back2) {
        back2.addEventListener('click', () => {
          currentStep = 2;
          render();
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Procesando pedido...</span>`;

          setTimeout(() => {
            const subtotal = cartStore.getSubtotal();
            let discount = cartStore.getDiscount();
            let shipping = formData.deliveryType === 'pickup' ? 0 : cartStore.getShippingCost();

            if (formData.paymentMethod === 'Transferencia Bancaria') {
              discount += Math.round((subtotal * 0.1));
            }
            const total = Math.max(0, subtotal - discount + shipping);

            const orderToCreate = {
              channel: formData.channel,
              items: items.map(it => ({
                name: `${it.product.name} (${it.product.unit})`,
                quantity: it.quantity,
                price: cartStore.getItemUnitPrice(it)
              })),
              customer: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                rubro: formData.rubro,
                address: formData.deliveryType === 'pickup' ? 'Retiro en Obrador Don Borde (Gorriti 4920)' : `${formData.address} ${formData.floorDept}`,
                zone: formData.deliveryType === 'pickup' ? 'Palermo' : formData.zone,
                notes: formData.deliveryNotes
              },
              paymentMethod: formData.paymentMethod,
              subtotal,
              discount,
              shipping,
              total,
              estimatedDelivery: "45 a 60 minutos"
            };

            createdOrder = orderStore.createOrder(orderToCreate);
            cartStore.clearCart();
            toastStore.show('¡Pedido confirmado exitosamente!', 'success');
            currentStep = 4;
            render();
          }, 600);
        });
      }
    }
  }

  render();
}
