import React from 'react';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import { MessageCircle, MapPin } from 'lucide-react';

export default function Footer({ setCurrentRoute }) {
  const navigate = (path) => {
    setCurrentRoute(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--color-carbon)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <div className="container" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <img
          src="/assets/images/Logotipo rojo y negro DI BORDE.png"
          alt="Di Borde"
          style={{ height: '40px', width: 'auto', margin: '0 auto 1.25rem auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/brand/horizontal-color.svg';
          }}
        />

        <p style={{ fontSize: '0.88rem', color: 'var(--color-carbon-muted)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          Elaboración casera de pre-pizzas y pizzetas en Chimbas, San Juan. Masa crocante, salsa de tomate y queso cremoso fundido.
        </p>

        {/* Quick Links (No portal link) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.84rem' }}>
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={{ color: 'var(--color-carbon)', textDecoration: 'none', fontWeight: 500 }}
          >
            Inicio
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a
            href="#productos"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('productos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{ color: 'var(--color-carbon)', textDecoration: 'none', fontWeight: 500 }}
          >
            Productos & Precios
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a
            href="#revendedores"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('revendedores');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{ color: 'var(--color-carbon)', textDecoration: 'none', fontWeight: 500 }}
          >
            Revendedores & Comercios
          </a>
        </div>

        {/* Contact line */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--color-carbon-muted)', marginBottom: '1.5rem' }}>
          <a
            href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Di Borde! Quisiera hacer una consulta o encargar un pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-carbon)', textDecoration: 'none', fontWeight: 500 }}
          >
            <MessageCircle size={14} strokeWidth={1.5} color="#15803D" />
            <span>WhatsApp: +54 9 264 526-1991</span>
          </a>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={13} strokeWidth={1.5} color="var(--color-primary)" />
            <span>Chimbas, San Juan</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>© {new Date().getFullYear()} Di Borde Alimentos Artesanales. Chimbas, San Juan.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#/vendedor"
              onClick={(e) => {
                e.preventDefault();
                navigate('/vendedor');
              }}
              style={{ color: 'var(--color-carbon-subtle)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: 0.75 }}
              title="Panel Personal para Vendedores de Calle"
            >
              <span>Portal Vendedores</span>
            </a>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <a
              href="#/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
              }}
              style={{ color: 'var(--color-carbon-subtle)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: 0.75 }}
              title="Panel de Gestión Exclusivo para Administración"
            >
              <span>Gestión Admin</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
