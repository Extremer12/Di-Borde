import React, { useState } from 'react';
import { useCart, DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  MessageCircle,
  ShoppingBag,
  Shield,
  Menu,
  X,
  Package,
  Home,
  Building2,
  Store,
  Download
} from 'lucide-react';

export default function Header({ currentRoute, setCurrentRoute, onOpenOrderModal }) {
  const { itemCount, subtotal, setActiveChannel } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (path, channel = null) => {
    if (channel) {
      setActiveChannel(channel);
    }
    setCurrentRoute(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleTriggerPwaInstall = () => {
    setMobileMenuOpen(false);
    // Disparar evento para que InstallPwaPrompt abra el prompt o muestre instrucciones
    const installBtn = document.querySelector('aside[aria-label="Aviso de instalación de app"] button');
    if (installBtn) {
      installBtn.click();
    } else {
      // Fallback para dispositivos que no soportan el evento nativo directamente
      const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
      if (isIOS) {
        alert('En Safari: toca el botón Compartir (cuadrado con flecha) y selecciona "Agregar a pantalla de inicio".');
      } else {
        alert('Para instalar la App: abre el menú de tu navegador (tres puntos) y presiona "Instalar aplicación" o "Agregar a inicio".');
      }
    }
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
        zIndex: 100,
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <div
        className="container"
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'relative'
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

        {/* Clean Center Navigation (Desktop Only) */}
        <nav className="header-desktop-nav">
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

        {/* Right Actions: Admin, WhatsApp, Cart & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Admin shortcut (desktop only or subtle) */}
          <a
            href="#/admin"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            className="header-desktop-nav"
            style={{
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-carbon-muted)',
              fontSize: '0.78rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
            title="Panel de Gestión Administrativa"
          >
            <Shield size={13} strokeWidth={1.5} color="var(--color-carbon)" />
            <span>Admin</span>
          </a>

          {/* WhatsApp Direct (Desktop only) */}
          <a
            href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Di Borde! Quisiera hacer una consulta o encargar un pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="header-desktop-nav"
            style={{
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

          {/* Cart Trigger Badge */}
          {itemCount > 0 && (
            <button
              type="button"
              onClick={onOpenOrderModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                minHeight: '38px'
              }}
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              <span>{itemCount}</span>
              <span className="tabular-nums" style={{ color: '#E7E5E4', borderLeft: '1px solid rgba(255,255,255,0.18)', paddingLeft: '0.45rem' }}>
                ${subtotal.toLocaleString('es-AR')}
              </span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: mobileMenuOpen ? 'var(--color-carbon)' : 'transparent',
              color: mobileMenuOpen ? '#FAF8F5' : 'var(--color-carbon)'
            }}
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: '0 12px 24px -4px rgba(28, 25, 23, 0.08)',
            padding: '1rem',
            animation: 'slideUp 180ms ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: currentRoute === '/' ? 'var(--color-cream-surface)' : 'transparent',
              color: 'var(--color-carbon)',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Home size={16} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            <span>Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('productos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--color-carbon)',
              fontWeight: 500,
              fontSize: '0.9rem',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Package size={16} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            <span>Productos & Precios</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: currentRoute === '/catalogo' ? 'var(--color-cream-surface)' : 'transparent',
              color: 'var(--color-carbon)',
              fontWeight: 500,
              fontSize: '0.9rem',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Store size={16} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            <span>Catálogo Completo</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/comercios')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: currentRoute === '/comercios' ? 'var(--color-cream-surface)' : 'transparent',
              color: 'var(--color-carbon)',
              fontWeight: 500,
              fontSize: '0.9rem',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Building2 size={16} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            <span>Revendedores & Comercios B2B</span>
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.35rem 0' }} />

          {/* Acciones de WhatsApp, Instalación PWA y Portal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <a
              href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Di Borde! Quisiera hacer una consulta o encargar un pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 12px',
                borderRadius: '6px',
                backgroundColor: '#F0FDF4',
                color: '#166534',
                border: '1px solid #BBF7D0',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} strokeWidth={1.5} color="#15803D" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleTriggerPwaInstall}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-primary-subtle, #FDF2EE)',
                color: 'var(--color-primary, #C83820)',
                border: '1px solid rgba(200, 56, 32, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={15} strokeWidth={1.5} />
              <span>Instalar App</span>
            </button>
          </div>

          <div style={{ marginTop: '0.35rem' }}>
            <a
              href="#/portal"
              onClick={(e) => {
                e.preventDefault();
                navigate('/portal');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Shield size={14} strokeWidth={1.5} />
              <span>Acceso Comercial & Administración</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
