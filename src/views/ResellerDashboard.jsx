import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  AlertTriangle,
  Package,
  MessageCircle,
  LogOut,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ResellerDashboard() {
  const { currentUser, opsState, logout } = useAuth();

  const currentReseller = opsState.resellers.find(
    (r) => r.id === currentUser?.resellerId || r.username === currentUser?.username
  ) || opsState.resellers[0];

  const assignment = currentReseller.activeAssignment;
  const hasDebt = (currentReseller.debtAmount || 0) > 0;
  const initials = currentReseller.initials || currentReseller.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleNotifyWhatsApp = () => {
    let msg = `REPORTE DE JORNADA - REVENDEDOR DI BORDE\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Revendedor: ${currentReseller.name}\n`;
    msg += `Zona: ${currentReseller.zone}\n\n`;

    if (assignment) {
      msg += `Mercadería asignada:\n`;
      if (assignment.pizzetasQueso) msg += `• ${assignment.pizzetasQueso}x Pizzetas con Queso (PVP $800 · Rendición $400 c/u)\n`;
      if (assignment.paquetes10) msg += `• ${assignment.paquetes10}x Paquetes x10 Pre-pizzetas (PVP $2.500 · Rendición $2.000 c/u)\n`;
      if (assignment.paquetesGrandes) msg += `• ${assignment.paquetesGrandes}x Paquetes x2 Grandes (PVP $2.500 · Rendición $1.800 c/u)\n`;
      msg += `\nTotal Rendición: $${assignment.totalRendicion.toLocaleString('es-AR')}\n`;
      msg += `Ganancia estimada: $${assignment.gananciaChico.toLocaleString('es-AR')}\n`;
    }

    if (hasDebt) {
      msg += `\nSaldo pendiente registrado: $${currentReseller.debtAmount.toLocaleString('es-AR')}\n`;
    }

    msg += `\nHola Julián, confirmo para pasar por el obrador a rendir. Gracias.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', padding: '2rem 1rem 6rem 1rem' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Mobile Header Linear Style */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon)',
            color: '#FAF8F5',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#FAF8F5',
                letterSpacing: '0.04em'
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#E2725B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                PANEL DE REVENDEDOR
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, margin: '2px 0 0 0', lineHeight: 1.2 }}>
                {currentReseller.name}
              </h2>
              <div style={{ fontSize: '0.74rem', color: '#A8A29E', marginTop: '2px' }}>
                Zona asignada: {currentReseller.zone}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FAF8F5',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.74rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={12} strokeWidth={1.5} />
            <span>Salir</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* AVISO DE SALDO EN ROJO (Sobrio, sin alertas estridentes)   */}
        {/* ======================================================== */}
        {hasDebt ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#DC2626' }}>
                  Saldo Deudor Pendiente
                </span>
              </div>
              <AlertTriangle size={15} strokeWidth={1.5} color="#DC2626" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)' }}>
                Total adeudado al obrador:
              </span>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.65rem', fontWeight: 600, color: '#DC2626' }}>
                -${currentReseller.debtAmount.toLocaleString('es-AR')}
              </span>
            </div>

            <div
              style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #FEE2E2',
                fontSize: '0.78rem',
                color: 'var(--color-carbon-muted)',
                lineHeight: 1.45
              }}
            >
              <strong style={{ color: 'var(--color-carbon)' }}>Motivo anotado:</strong> {currentReseller.debtReason || 'Saldo pendiente registrado'}.
              <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                Regularizá este monto en el obrador con Julián al finalizar tu jornada.
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} strokeWidth={1.5} color="#15803D" />
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#15803D' }}>
              Estado regularizado. No tenés deudas registradas con el obrador.
            </span>
          </div>
        )}

        {/* Mercadería Asignada */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1.4rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="eyebrow-muted" style={{ margin: 0 }}>
              Mercadería en Calle
            </span>
            <span className="tabular-nums" style={{ fontSize: '0.74rem', color: 'var(--color-carbon-muted)' }}>
              {assignment?.date || 'Turno activo'}
            </span>
          </div>

          {assignment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Pizzetas */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Pizzetas con Queso
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    {assignment.pizzetasQueso || 0} unid.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP: $800 c/u</span>
                  <span>Rendís: $400 c/u</span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganancia: +$400 c/u</span>
                </div>
              </div>

              {/* Paquetes x10 */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Paquetes x10 Pre-pizzetas
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    {assignment.paquetes10 || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP: $2.500</span>
                  <span>Rendís: $2.000</span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganancia: +$500/paq</span>
                </div>
              </div>

              {/* Paquetes x2 Grandes */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Paquetes x2 Pre-pizzas Grandes
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    {assignment.paquetesGrandes || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP: $2.500</span>
                  <span>Rendís: $1.800</span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganancia: +$700/paq</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0.5rem 0' }}>
              No tenés lotes de mercadería asignados en este momento.
            </p>
          )}
        </section>

        {/* Resumen Financiero */}
        {assignment && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '1.4rem',
              border: '1px solid var(--color-border)',
              marginBottom: '1.25rem'
            }}
          >
            <span className="eyebrow-muted" style={{ margin: '0 0 0.75rem 0', display: 'block' }}>
              Liquidación Estimada de la Jornada
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>Total recaudado en calle (PVP):</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>${assignment.totalPvp.toLocaleString('es-AR')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>Rendición a Di Borde:</span>
                <span className="tabular-nums font-serif" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  ${assignment.totalRendicion.toLocaleString('es-AR')}
                </span>
              </div>

              <div
                style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ color: 'var(--color-carbon)', fontWeight: 600 }}>
                  Tu Ganancia en Mano:
                </span>
                <span className="tabular-nums font-serif" style={{ fontSize: '1.35rem', fontWeight: 600, color: '#15803D' }}>
                  +${assignment.gananciaChico.toLocaleString('es-AR')}
                </span>
              </div>

              {assignment.rendicionPagada > 0 && (
                <div className="tabular-nums" style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 600, textAlign: 'right' }}>
                  Monto rendido registrado: ${assignment.rendicionPagada.toLocaleString('es-AR')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón WhatsApp de Aviso */}
        <button
          type="button"
          onClick={handleNotifyWhatsApp}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-carbon)',
            color: '#FAF8F5',
            border: 'none',
            borderRadius: '6px',
            padding: '0.85rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <MessageCircle size={16} strokeWidth={1.5} color="#4ADE80" />
          <span>Avisar Rendición por WhatsApp</span>
        </button>

        <p style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)', textAlign: 'center', marginTop: '0.75rem' }}>
          Contacto directo con Julián: +54 9 264 526-1991 · Chimbas, San Juan
        </p>

      </div>
    </div>
  );
}
