import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingCartBar from './components/FloatingCartBar.jsx';
import OrderModal from './components/OrderModal.jsx';
import Toast from './components/Toast.jsx';
import InstallPwaPrompt from './components/InstallPwaPrompt.jsx';

// Public Views
import HomeView from './views/HomeView.jsx';
import CatalogView from './views/CatalogView.jsx';
import B2BComerciosView from './views/B2BComerciosView.jsx';
import ObradorView from './views/ObradorView.jsx';

// Operations Views
import AdminDashboard from './views/AdminDashboard.jsx';
import ResellerDashboard from './views/ResellerDashboard.jsx';
import PortalLoginView from './views/PortalLoginView.jsx';

function MainLayout() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { setActiveChannel, setIsDrawerOpen, isDrawerOpen } = useCart();
  const { currentUser, authLoading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      let rawHash = window.location.hash.replace('#', '') || '/';

      // Si el hash contiene parámetros de OAuth (ej: access_token= o code=), descartar y recuperar ruta objetivo
      if (rawHash.includes('access_token=') || rawHash.includes('code=')) {
        const saved = sessionStorage.getItem('di_borde_auth_redirect') || '/admin';
        rawHash = saved;
      }

      // Quitar cualquier query string adherido al hash (ej: /admin?code=...)
      if (rawHash.includes('?')) {
        rawHash = rawHash.split('?')[0];
      }

      let hash = rawHash || '/';

      if (hash === '/preventistas') {
        window.location.hash = '/vendedor';
        hash = '/vendedor';
      }

      setCurrentRoute(hash);

      // Context auto-adjustment based on route
      if (hash === '/admin' || hash === '/gestion') {
        document.title = 'Gestión Central Admin | Di Borde';
      } else if (hash === '/vendedor' || hash === '/vendedores') {
        document.title = 'Portal de Vendedor | Di Borde';
      } else if (hash === '/comercios') {
        setActiveChannel('mayorista');
        document.title = 'Comercios & Cafeterías | Di Borde';
      } else if (hash === '/catalogo') {
        document.title = 'Catálogo Oficial | Di Borde';
      } else if (hash === '/obrador') {
        document.title = 'Obrador & Retiro | Di Borde';
      } else if (hash === '/carrito') {
        setIsOrderModalOpen(true);
      } else {
        document.title = 'Di Borde | Pizzetas y Pre-pizzas Artesanales';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveChannel]);

  // Synchronize drawer trigger with OrderModal
  useEffect(() => {
    if (isDrawerOpen) {
      setIsOrderModalOpen(true);
      setIsDrawerOpen(false);
    }
  }, [isDrawerOpen, setIsDrawerOpen]);

  const navigate = (path, channel = null) => {
    if (channel) {
      setActiveChannel(channel);
    }
    setCurrentRoute(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPortalRoute =
    currentRoute === '/admin' ||
    currentRoute === '/portal' ||
    currentRoute === '/gestion' ||
    currentRoute === '/vendedor' ||
    currentRoute === '/vendedores';

  const renderCurrentView = () => {
    // Si la autenticación se está verificando y el usuario intenta acceder a una ruta de gestión
    if (authLoading && isPortalRoute) {
      return (
        <div
          style={{
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            backgroundColor: 'var(--color-cream)',
            padding: '2rem'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-primary, #C83820)',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
              Verificando credenciales DiBorde...
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '4px' }}>
              Validando sesión administrativa con Supabase
            </div>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    switch (currentRoute) {
      case '/vendedor':
      case '/vendedores':
        if (currentUser?.role === 'admin') {
          return <AdminDashboard />;
        }
        return currentUser && currentUser.role === 'reseller' ? (
          <ResellerDashboard />
        ) : (
          <PortalLoginView />
        );
      case '/admin':
      case '/portal':
      case '/gestion':
        if (currentUser?.role === 'reseller') {
          return <ResellerDashboard />;
        }
        return currentUser && currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <PortalLoginView />
        );
      case '/catalogo':
        return <CatalogView />;
      case '/comercios':
        return <B2BComerciosView />;
      case '/obrador':
        return <ObradorView />;
      case '/':
      default:
        return <HomeView navigate={navigate} />;
    }
  };

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {!isPortalRoute && (
        <Header
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
        />
      )}

      <main className="main-content" role="main" style={{ flex: '1 0 auto' }}>
        {renderCurrentView()}
      </main>

      {!isPortalRoute && (
        <Footer setCurrentRoute={setCurrentRoute} />
      )}

      {/* Floating Bottom Bar only on client shop */}
      {!isPortalRoute && (
        <FloatingCartBar onOpenOrderModal={() => setIsOrderModalOpen(true)} />
      )}

      {/* Order Modal with Cart Management */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Global Toast */}
      <Toast />

      {/* PWA Native Installation Prompt */}
      <InstallPwaPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}
