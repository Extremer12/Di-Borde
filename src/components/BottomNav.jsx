import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Home, UtensilsCrossed, Building2, Briefcase, ShoppingBag } from 'lucide-react';

export default function BottomNav({ currentRoute, setCurrentRoute }) {
  const { itemCount, setIsDrawerOpen, setActiveChannel } = useCart();

  const navigate = (path, channel = null) => {
    if (channel) {
      setActiveChannel(channel);
    }
    setCurrentRoute(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={`bottom-nav-item ${currentRoute === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Home size={20} />
        <span>Inicio</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-item ${currentRoute === '/catalogo' ? 'active' : ''}`}
        onClick={() => navigate('/catalogo', 'minorista')}
      >
        <UtensilsCrossed size={20} />
        <span>Catálogo</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-item ${currentRoute === '/comercios' ? 'active' : ''}`}
        onClick={() => navigate('/comercios', 'mayorista')}
      >
        <Building2 size={20} />
        <span>B2B</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-item ${currentRoute === '/preventistas' ? 'active' : ''}`}
        onClick={() => navigate('/preventistas', 'preventistas')}
      >
        <Briefcase size={20} />
        <span>Vendedores</span>
      </button>

      <button
        type="button"
        className="bottom-nav-item"
        onClick={() => setIsDrawerOpen(true)}
        style={{ position: 'relative' }}
      >
        <ShoppingBag size={20} />
        <span>Pedido</span>
        {itemCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '22%',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderRadius: '999px',
              padding: '1px 6px',
              fontSize: '0.65rem',
              fontWeight: 800
            }}
          >
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
