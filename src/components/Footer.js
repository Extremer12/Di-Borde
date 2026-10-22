import { icons } from './icons.js';

export function renderFooter(container) {
  const html = `
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Slogan -->
          <div class="footer-brand">
            <a href="#/" class="header-logo" style="margin-bottom: 1rem; display: inline-flex;">
              <img src="/assets/images/logo_principal.jpeg" alt="Don Borde" style="height: 48px; filter: brightness(1.05);" />
            </a>
            <p>
              <strong>ARTESANAL · ARGENTINA · HECHO PARA COMERLO CON GANAS.</strong><br/>
              Masa madre con 48hs de fermentación en frío, horno de piedra y las mejores materias primas del país.
            </p>
            <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
              <a href="https://wa.me/5491149201122" target="_blank" class="action-btn" style="background: rgba(255,255,255,0.08); border-color: transparent; color: #fff;" title="WhatsApp Don Borde">
                ${icons.whatsapp('', 20)}
              </a>
              <a href="#/comercios" class="action-btn" style="background: rgba(255,255,255,0.08); border-color: transparent; color: #fff;" title="Venta Mayorista">
                ${icons.building('', 18)}
              </a>
              <a href="#/pedidos" class="action-btn" style="background: rgba(255,255,255,0.08); border-color: transparent; color: #fff;" title="Seguimiento de pedidos">
                ${icons.truck('', 18)}
              </a>
            </div>
          </div>

          <!-- Col 2: Productos -->
          <div>
            <h4 class="footer-col-title">Productos</h4>
            <ul class="footer-links">
              <li><a href="#/productos?cat=pizzetas">Pizzetas Clásicas & Muzzarella</a></li>
              <li><a href="#/productos?cat=prepizzas">Prepizzas de Masa Madre</a></li>
              <li><a href="#/productos?cat=especiales">Especiales: Fugazzeta & Jamón</a></li>
              <li><a href="#/productos?cat=packs">Packs Familiares & Promos</a></li>
              <li><a href="#/productos?cat=prepizzas">Prepizzas Integrales Multicereal</a></li>
            </ul>
          </div>

          <!-- Col 3: Canales B2B & Negocio -->
          <div>
            <h4 class="footer-col-title">Canal Comercial</h4>
            <ul class="footer-links">
              <li><a href="#/comercios">¿Tenés un comercio? Venta Mayorista</a></li>
              <li><a href="#/preventistas">Portal Oficial de Preventistas</a></li>
              <li><a href="#/comercios">Precios por Bulto Cerrado</a></li>
              <li><a href="#/comercios">Capacitación de Regeneración Gastronómica</a></li>
              <li><a href="#/cuenta">Acceso a Cuenta Comercial</a></li>
            </ul>
          </div>

          <!-- Col 4: Ayuda & Obrador -->
          <div>
            <h4 class="footer-col-title">Atención & Ayuda</h4>
            <ul class="footer-links">
              <li><a href="#/pedidos">Estado de tu Pedido en Vivo</a></li>
              <li><a href="#/checkout">Zonas de Entrega (CABA y GBA)</a></li>
              <li><a href="https://wa.me/5491149201122" target="_blank">Atención Directa por WhatsApp</a></li>
              <li><a href="#/">Obrador Central: Palermo, CABA</a></li>
              <li><a href="mailto:hola@donborde.com.ar">hola@donborde.com.ar</a></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div>
            © 2026 DON BORDE. Todos los derechos reservados. Industria Argentina.
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <a href="#/">Términos del Servicio</a>
            <a href="#/">Política de Privacidad</a>
            <a href="#/">Defensa del Consumidor</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  container.innerHTML = html;
}
