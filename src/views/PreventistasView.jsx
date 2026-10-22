import React, { useState } from 'react';
import { RESELLER_TIERS, calculateResellerTotal } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import {
  TrendingUp,
  MessageSquare,
  ArrowRight,
  MapPin
} from 'lucide-react';

export default function PreventistasView() {
  const { buildResellerWhatsAppUrl } = useCart();

  // Estados del simulador
  const [pizzetas, setPizzetas] = useState(20);
  const [paquetes10, setPaquetes10] = useState(5);
  const [paquetesGrandes, setPaquetesGrandes] = useState(3);

  const results = calculateResellerTotal({
    pizzetasQueso: pizzetas,
    paquetes10: paquetes10,
    paquetesGrandes: paquetesGrandes
  });

  const handleSendWhatsApp = () => {
    const url = buildResellerWhatsAppUrl({
      pizzetas,
      paquetes10,
      paquetesGrandes
    });
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ maxWidth: 'var(--container-max, 1140px)', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', maxWidth: '640px' }}>
          <span className="eyebrow-kicker">Canal Venta Directa</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              lineHeight: 1.15,
              margin: '0.35rem 0 0.75rem 0',
              letterSpacing: '-0.025em'
            }}
          >
            Esquema Oficial de Rendición
          </h1>
          <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.98rem', lineHeight: 1.55, margin: 0 }}>
            Retirá lotes en nuestro obrador de Chimbas, vendé en tu zona o comercios y obtené tu margen de ganancia diaria en mano.
          </p>
        </div>

        {/* Tarjetas de Productos y Rendición en grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {RESELLER_TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                      {tier.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                      PVP sugerido: <strong className="tabular-nums" style={{ color: 'var(--color-carbon)' }}>${tier.pvp.toLocaleString('es-AR')}</strong>
                    </div>
                  </div>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    +{tier.profitPercent}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: 'var(--color-cream-light)',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    marginBottom: '0.85rem'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--color-carbon-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Rendición fábrica
                    </span>
                    <strong className="tabular-nums" style={{ fontSize: '1.05rem', color: 'var(--color-carbon)', fontWeight: 600 }}>
                      ${tier.rendition.toLocaleString('es-AR')}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}> {tier.unit}</span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      Margen limpio
                    </span>
                    <strong className="tabular-nums" style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      +${tier.profit.toLocaleString('es-AR')}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)' }}> {tier.unit}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', margin: 0, lineHeight: 1.45 }}>
                  {tier.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Simulador Interactivo (Warm carbon card) */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '2rem',
            marginBottom: '2.5rem',
            maxWidth: '720px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} strokeWidth={1.5} color="#D65A42" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
              Calculá tu ganancia estimada del día
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'rgba(250, 248, 245, 0.7)', display: 'block', marginBottom: '6px' }}>
                Pizzetas con queso ($800 c/u):
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={pizzetas}
                onChange={(e) => setPizzetas(Math.max(0, parseInt(e.target.value) || 0))}
                className="tabular-nums"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '6px',
                  color: '#FAF8F5',
                  padding: '8px 10px',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'rgba(250, 248, 245, 0.7)', display: 'block', marginBottom: '6px' }}>
                Paquetes x10 Pre-pizzetas:
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={paquetes10}
                onChange={(e) => setPaquetes10(Math.max(0, parseInt(e.target.value) || 0))}
                className="tabular-nums"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '6px',
                  color: '#FAF8F5',
                  padding: '8px 10px',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'rgba(250, 248, 245, 0.7)', display: 'block', marginBottom: '6px' }}>
                Paquetes x2 Grandes:
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={paquetesGrandes}
                onChange={(e) => setPaquetesGrandes(Math.max(0, parseInt(e.target.value) || 0))}
                className="tabular-nums"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '6px',
                  color: '#FAF8F5',
                  padding: '8px 10px',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(250, 248, 245, 0.6)' }}>
                Rendición a Di Borde
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>
                ${results.totalRendicion.toLocaleString('es-AR')}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86EFAC', fontWeight: 600 }}>
                Ganancia neta estimada
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#86EFAC', marginTop: '2px' }}>
                +${results.totalGanancia.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
        </div>

        {/* Botón WhatsApp directo */}
        <div style={{ maxWidth: '720px' }}>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-carbon)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.85rem 1.25rem',
              fontSize: '0.94rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <MessageSquare size={16} strokeWidth={1.5} />
            <span>Solicitar lote como revendedor por WhatsApp</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>

          {/* Punto de Retiro / Obrador Info */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--color-carbon-muted)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
              <MapPin size={13} strokeWidth={1.5} color="var(--color-primary)" />
              <strong>Obrador: Chimbas, San Juan</strong>
            </div>
            <div>Retiros diarios previa confirmación de lote.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
