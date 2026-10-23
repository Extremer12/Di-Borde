import React from 'react';
import { MapPin, Clock, MessageSquare, ShieldCheck, Flame, Award, ArrowRight } from 'lucide-react';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';

export default function ObradorView() {
  return (
    <div style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ maxWidth: 'var(--container-max, 1140px)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem', maxWidth: '640px' }}>
          <span className="eyebrow-kicker">El Obrador</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              lineHeight: 1.15,
              margin: '0.35rem 0 0.75rem 0',
              letterSpacing: '-0.025em'
            }}
          >
            Punto de Producción y Retiro
          </h1>
          <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.98rem', lineHeight: 1.55, margin: 0 }}>
            Donde elaboramos nuestras tandas de pizzetas y pre-pizzas caseras horneadas en el día en Chimbas, San Juan.
          </p>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
          {/* Card 1: Dirección y Retiro */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '2rem',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                Obrador & Retiro
              </h3>
            </div>
            
            <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Nuestro centro de producción artesanal en Chimbas cuenta con punto de despacho directo sin costo adicional de envío.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                fontSize: '0.84rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: 'var(--color-carbon)'
              }}
            >
              <div><strong>Ubicación:</strong> Chimbas, San Juan, Argentina</div>
              <div><strong>Modalidad retiro:</strong> Despacho en puerta con horario programado</div>
              <div><strong>Envíos:</strong> Reparto diario en Chimbas, Capital, Rivadavia y alrededores</div>
            </div>
          </div>

          {/* Card 2: Horarios */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '2rem',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-carbon)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock size={18} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                Horarios de Despacho
              </h3>
            </div>

            <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Horneamos a primera hora para que los pedidos al paso y los paquetes salgan con frescura óptima.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                fontSize: '0.84rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: 'var(--color-carbon)'
              }}
            >
              <div><strong>Lunes a Viernes:</strong> 09:00 a 20:00 hs</div>
              <div><strong>Sábados y Domingos:</strong> 10:30 a 21:00 hs</div>
              <div><strong>Retiro revendedores:</strong> Turno mañana (10:30 hs) / Turno tarde (16:30 hs)</div>
            </div>
          </div>
        </div>

        {/* Quality Commitment Section (Full-width warm carbon block) */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          <div>
            <span className="eyebrow-kicker" style={{ color: '#D65A42' }}>
              Estándar de Producción
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#FAF8F5',
                fontSize: '1.9rem',
                fontWeight: 600,
                marginTop: '0.35rem',
                marginBottom: '0.85rem',
                letterSpacing: '-0.02em'
              }}
            >
              Elaboración Responsable & Trazable
            </h2>
            <p style={{ color: 'rgba(250, 248, 245, 0.75)', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Masa casera fresca, harina seleccionada y envasado prolijo para asegurar conservación y textura crocante.
            </p>
            <a
              href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Di Borde, quisiera coordinar un retiro en el obrador de Chimbas.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FAF8F5',
                color: 'var(--color-carbon)',
                padding: '0.65rem 1.15rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.15s ease'
              }}
            >
              <MessageSquare size={16} strokeWidth={1.5} />
              <span>Coordinar retiro por WhatsApp</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#D65A42', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flame size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h4 style={{ color: '#FAF8F5', fontSize: '0.94rem', fontWeight: 600, margin: '0 0 2px 0' }}>Horneado a alta temperatura</h4>
                <p style={{ color: 'rgba(250, 248, 245, 0.65)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>Sellado rápido que preserva humedad y alveolos en la miga.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h4 style={{ color: '#FAF8F5', fontSize: '0.94rem', fontWeight: 600, margin: '0 0 2px 0' }}>Bolsas micro-perforadas</h4>
                <p style={{ color: 'rgba(250, 248, 245, 0.65)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>Evita condensación de vapor manteniendo la masa crocante.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h4 style={{ color: '#FAF8F5', fontSize: '0.94rem', fontWeight: 600, margin: '0 0 2px 0' }}>Queso cremoso fundido</h4>
                <p style={{ color: 'rgba(250, 248, 245, 0.65)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>Queso cremoso seleccionado que gratina y funde a la perfección.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
