import { icons } from '../components/icons.js';
import { toastStore } from '../state/toastStore.js';

export function renderAccountView(container) {
  const profile = {
    name: "Julián Albarracín",
    email: "julian@ejemplo.com",
    phone: "+54 11 4920-1122",
    tier: "Socio Fundador",
    points: 840,
    addresses: [
      { id: "1", tag: "Casa (Habitual)", address: "Av. Corrientes 3420, Piso 4 B", zone: "CABA (Almagro)" },
      { id: "2", tag: "Oficina / Estudio", address: "Humboldt 1940, Piso 2", zone: "CABA (Palermo)" }
    ]
  };

  const html = `
    <div class="container" style="padding: 3rem 1.5rem 5rem; max-width: 840px;">
      <div class="section-header">
        <span class="section-tag">Perfil del Cliente</span>
        <h1 class="section-title">MI CUENTA</h1>
        <p class="section-subtitle">
          Administrá tus datos personales, direcciones de envío y beneficios del Club Don Borde.
        </p>
      </div>

      <!-- Profile Header Card -->
      <div style="background-color: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900;">
            JA
          </div>
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.2rem;">${profile.name}</h2>
            <p style="margin: 0; font-size: 0.9rem; color: var(--color-carbon-muted);">${profile.email} · ${profile.phone}</p>
          </div>
        </div>

        <div style="text-align: right;">
          <span class="badge badge-primary" style="margin-bottom: 0.35rem;">CLUB DON BORDE</span>
          <div style="font-size: 0.85rem; color: var(--color-carbon-muted);">
            <strong>${profile.points} puntos</strong> acumulados
          </div>
        </div>
      </div>

      <!-- Saved Addresses -->
      <div style="background-color: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.25rem;">Direcciones de Entrega</h3>
          <button class="btn btn-cream btn-sm" id="btn-add-address">
            ${icons.plus('', 14)} Agregar Dirección
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${profile.addresses.map(addr => `
            <div style="background-color: var(--color-cream); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.2rem;">${addr.tag}</strong>
                <span style="font-size: 0.88rem; color: var(--color-carbon-muted);">${addr.address} (${addr.zone})</span>
              </div>
              <span class="badge badge-subtle">Predeterminada</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Shortcuts -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <a href="#/pedidos" class="tier-card" style="text-decoration: none; padding: 1.5rem;">
          <div style="color: var(--color-primary); margin-bottom: 0.5rem;">${icons.box('', 24)}</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Mis Pedidos Anteriores</h4>
          <p style="font-size: 0.85rem; margin: 0;">Repetir pedidos o ver facturación digital.</p>
        </a>

        <a href="#/comercios" class="tier-card" style="text-decoration: none; padding: 1.5rem;">
          <div style="color: var(--color-primary); margin-bottom: 0.5rem;">${icons.building('', 24)}</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Solicitud Mayorista B2B</h4>
          <p style="font-size: 0.85rem; margin: 0;">Condiciones para reventa en comercios y bares.</p>
        </a>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const addAddrBtn = container.querySelector('#btn-add-address');
  if (addAddrBtn) {
    addAddrBtn.addEventListener('click', () => {
      toastStore.show('Podés ingresar una nueva dirección directamente en el Checkout al comprar', 'info');
    });
  }
}
