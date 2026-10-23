import React from 'react';
import { PRODUCTS } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  Flame,
  MessageCircle,
  Package,
  ShieldCheck,
  Clock,
  Heart,
  CheckCircle2
} from 'lucide-react';

export default function HomeView() {
  const handleOpenResellerWhatsApp = () => {
    const text = encodeURIComponent('¡Hola Di Borde! Me gustaría consultar por la lista de precios y condiciones para comercios y revendedores.');
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${text}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', paddingBottom: '6rem' }}>
      {/* ======================================================== */}
      {/* 1. HERO SECTION EDITORIAL ASIMÉTRICO (2 COLUMNAS)        */}
      {/* ======================================================== */}
      <section style={{ padding: '4rem 0 3.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Columna Izquierda: Propuesta de Valor */}
            <div>
              <span className="eyebrow-kicker">
                ELABORACIÓN CASERA · CHIMBAS, SAN JUAN
              </span>

              <h1
                className="font-serif"
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 3.6rem)',
                  fontWeight: 600,
                  color: 'var(--color-carbon)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.02em',
                  margin: '0 0 1.25rem 0'
                }}
              >
                Pizzetas y Pre-pizzas, <br />
                <span style={{ color: 'var(--color-primary)', fontStyle: 'italic', fontWeight: 500 }}>
                  doradas y de masa casera.
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--color-carbon-muted)',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  margin: '0 0 2rem 0'
                }}
              >
                Elaboración artesanal en casa con masa crocante, salsa de tomate y abundante queso cremoso fundido. Listas para disfrutar en familia o abastecer tu almacén, bar o negocio en San Juan.
              </p>

              {/* Botón de Acción Principal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a
                  href="#productos"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FAF8F5',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Package size={15} strokeWidth={1.5} />
                  <span>Ver Carta y Precios</span>
                </a>

                <a
                  href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Di Borde! Quisiera hacer una consulta o encargar un pedido.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-carbon)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    border: '1px solid var(--color-border)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <MessageCircle size={15} strokeWidth={1.5} color="#15803D" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              {/* Indicadores Clave de Calidad */}
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    Casero
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                    Amasado día a día
                  </div>
                </div>

                <div>
                  <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                    Queso cremoso fundido
                  </div>
                </div>

                <div>
                  <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    Chimbas
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                    San Juan, Argentina
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Composición Visual Gastronómica */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '5 / 4',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-cream-surface)'
                }}
              >
                <img
                  src="/assets/images/prod_pizzetas_clasicas.jpg"
                  alt="Pizzetas artesanales Di Borde recién horneadas"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Ficha Editorial Integrada */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Flame size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                    Piso crocante & queso fundido
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)' }}>
                    Receta original Di Borde · San Juan
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATÁLOGO EN GRILLA DE 3 COLUMNAS                       */}
      {/* ======================================================== */}
      <section id="productos" style={{ padding: '4rem 0 3.5rem 0', scrollMarginTop: '80px' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width)' }}>
          
          {/* Header de Sección Editorial */}
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="eyebrow-kicker">
              CARTA & ESPECIALIDADES
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.85rem, 3.5vw, 2.4rem)',
                    fontWeight: 600,
                    color: 'var(--color-carbon)',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Nuestros Productos
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-carbon-muted)', margin: '6px 0 0 0', maxWidth: '580px' }}>
                  Elaboradas con harina de primera, salsa de tomate seleccionada y queso cremoso. Descuento automático por cantidad directo en el carrito.
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} strokeWidth={1.5} />
                <span>Horneadas en el día en Chimbas</span>
              </div>
            </div>
          </div>

          {/* Grid de 3 Columnas en Desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              marginBottom: '3.5rem'
            }}
          >
            {PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECCIÓN REVENDEDORES & COMERCIOS (FULL-WIDTH CÁLIDO)    */}
      {/* ======================================================== */}
      <section id="revendedores" style={{ scrollMarginTop: '80px', padding: '1rem 0 3rem 0' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width)' }}>
          <div
            style={{
              backgroundColor: 'var(--color-carbon)',
              color: '#FAF8F5',
              borderRadius: '12px',
              padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.75rem, 4vw, 3rem)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '3rem',
                alignItems: 'center'
              }}
            >
              {/* Bloque Izquierdo: Propuesta Revendedores */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#E2725B',
                    marginBottom: '0.75rem'
                  }}
                >
                  VENTA DIRECTA & COMERCIOS
                </span>

                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.3rem)',
                    fontWeight: 600,
                    color: '#FAF8F5',
                    margin: '0 0 1rem 0',
                    lineHeight: 1.2
                  }}
                >
                  ¿Querés revender Di Borde o abastecer tu negocio?
                </h2>

                <p
                  style={{
                    fontSize: '0.94rem',
                    color: '#D6D3D1',
                    lineHeight: 1.6,
                    margin: '0 0 1.5rem 0'
                  }}
                >
                  Sumate a vender en tu barrio con nuestro esquema de rendición diaria o abastecé tu almacén, bar o cafetería con pre-pizzetas y pre-pizzas recién horneadas.
                </p>

                {/* Puntos Clave */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#FAF8F5' }}>
                    <CheckCircle2 size={16} strokeWidth={1.5} color="#4ADE80" />
                    <span>Pizzeta con Queso: Rendición $400 (PVP $800 → Ganás $400 c/u).</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#FAF8F5' }}>
                    <CheckCircle2 size={16} strokeWidth={1.5} color="#4ADE80" />
                    <span>Pre-pizzetas x10: Llevando 3 a $2.333 c/u o 10 a $2.000 c/u.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#FAF8F5' }}>
                    <CheckCircle2 size={16} strokeWidth={1.5} color="#4ADE80" />
                    <span>Pre-pizzas Grandes x2: Mayorista a $2.000 el paquete.</span>
                  </div>
                </div>
              </div>

              {/* Bloque Derecho: Panel de Contacto Sobrio */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '2rem 1.75rem'
                }}
              >
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A8A29E', fontWeight: 600, marginBottom: '0.75rem' }}>
                  ATENCIÓN DIRECTA
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: '#FAF8F5',
                    margin: '0 0 0.5rem 0'
                  }}
                >
                  Contacto comercial por WhatsApp
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#A8A29E', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                  Escribinos para coordinar tandas, retiro en el día o consultar precios para tu comercio.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleOpenResellerWhatsApp}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FAF8F5',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.85rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <MessageCircle size={16} strokeWidth={1.5} />
                    <span>Consultar por WhatsApp</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#A8A29E', marginTop: '1.25rem', textAlign: 'center' }}>
                  Atención directa: +54 9 264 526-1991 · Chimbas, San Juan
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PILARES DE CALIDAD CASERA (EDITORIAL PLANO)            */}
      {/* ======================================================== */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '1.5rem'
            }}
          >
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <Heart size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 4px 0' }}>
                Elaboración Casera
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', margin: 0, lineHeight: 1.5 }}>
                Masa suave por dentro y crocante por fuera, elaborada en casa día a día con dedicación.
              </p>
            </div>

            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <Flame size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 4px 0' }}>
                Salsa y Queso Cremoso
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', margin: 0, lineHeight: 1.5 }}>
                Salsa de tomate seleccionada y abundante queso cremoso que gratina y funde a la perfección.
              </p>
            </div>

            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 4px 0' }}>
                Frescura Garantizada
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', margin: 0, lineHeight: 1.5 }}>
                Horneadas en tandas para que lleguen con la máxima frescura a tu mesa o a tu comercio.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
