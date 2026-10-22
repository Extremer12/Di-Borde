import React from 'react';
import { useCart, DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import { MessageCircle, ShoppingBag } from 'lucide-react';

export default function Header({ currentRoute, setCurrentRoute, onOpenOrderModal }) {
  const { itemCount, subtotal, setActiveChannel } = useCart();

  const navigate = (path, channel = null) => {
    if (channel) {
      setActiveChannel(channel);
    }
    setCurrentRoute(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        className="container"
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand Logo Di Borde */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
          title="Di Borde - Pizzetas y Pre-pizzas Artesanales"
        >
          <img
            src="/assets/images/Logotipo rojo y negro DI BORDE.png"
            alt="Di Borde"
            style={{ height: '36px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/brand/horizontal-color.svg';
            }}
          />
        </a>

        {/* Clean Center Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: currentRoute === '/' ? 600 : 500,
              backgroundColor: currentRoute === '/' ? 'rgba(28, 25, 23, 0.05)' : 'transparent',
              color: currentRoute === '/' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('productos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              color: 'var(--color-carbon-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Productos
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('revendedores');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              color: 'var(--color-carbon-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Revendedores & Comercios
          </button>
        </nav>

        {/* Right Action: WhatsApp & Cart Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <a
            href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Di Borde! Quisiera hacer una consulta o encargar un pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-carbon)',
              fontSize: '0.8rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <MessageCircle size={14} strokeWidth={1.5} color="#15803D" />
            <span>WhatsApp</span>
          </a>

          {itemCount > 0 && (
            <button
              type="button"
              onClick={onOpenOrderModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              <span>{itemCount}</span>
              <span className="tabular-nums" style={{ color: '#E7E5E4', borderLeft: '1px solid rgba(255,255,255,0.18)', paddingLeft: '0.45rem' }}>
                ${subtotal.toLocaleString('es-AR')}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
