import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingCartBar from './components/FloatingCartBar.jsx';
import OrderModal from './components/OrderModal.jsx';
import Toast from './components/Toast.jsx';

// Public Views
import HomeView from './views/HomeView.jsx';
import CatalogView from './views/CatalogView.jsx';
import B2BComerciosView from './views/B2BComerciosView.jsx';
import ObradorView from './views/ObradorView.jsx';

// Admin Views
import AdminDashboard from './views/AdminDashboard.jsx';
import PortalLoginView from './views/PortalLoginView.jsx';

function MainLayout() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { setActiveChannel, setIsDrawerOpen, isDrawerOpen } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '') || '/';

      // Redirigir accesos legacy al panel administrativo
      if (hash === '/vendedores' || hash === '/preventistas') {
        window.location.hash = '/admin';
        hash = '/admin';
      }

      setCurrentRoute(hash);

      // Context auto-adjustment based on route
      if (hash === '/admin' || hash === '/portal' || hash === '/gestion') {
        document.title = 'Gestión Central Admin | Di Borde';
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

  const isAdminRoute = currentRoute === '/admin' || currentRoute === '/portal' || currentRoute === '/gestion';

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/admin':
      case '/portal':
      case '/gestion':
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
      {!isAdminRoute && (
        <Header
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
        />
      )}

      <main className="main-content" role="main" style={{ flex: '1 0 auto' }}>
        {renderCurrentView()}
      </main>

      {!isAdminRoute && (
        <Footer setCurrentRoute={setCurrentRoute} />
      )}

      {/* Floating Bottom Bar only on client shop */}
      {!isAdminRoute && (
        <FloatingCartBar onOpenOrderModal={() => setIsOrderModalOpen(true)} />
      )}

      {/* Order Modal with Cart Management */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Global Toast */}
      <Toast />
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
