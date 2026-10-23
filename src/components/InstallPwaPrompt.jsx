import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Download, Smartphone, Share2, PlusSquare, X, Check } from 'lucide-react';

export default function InstallPwaPrompt() {
  const { itemCount } = useCart();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya se está ejecutando como PWA instalada
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Verificar si ya fue desestimado en esta sesión
    const dismissed = sessionStorage.getItem('di_borde_pwa_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // 3. Detectar iOS (Safari en iPhone / iPad no dispara beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      userAgent.includes('safari') &&
      !userAgent.includes('chrome') &&
      !userAgent.includes('crios') &&
      !userAgent.includes('fxios');

    if (isAppleDevice && isSafari && !isStandalone) {
      setIsIOS(true);
    }

    // 4. Capturar evento de instalación nativo (Android, Chrome, Edge, Brave)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[Di Borde PWA] Aplicación instalada exitosamente.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback si el navegador no soporta el evento directo
      alert('Para instalar la app: en tu navegador abre el menú de opciones (tres puntos o compartir) y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[Di Borde PWA] Respuesta del usuario a la instalación:', outcome);

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('di_borde_pwa_dismissed', 'true');
  };

  // Si ya está instalada o descartada, o no hay soporte ni es iOS y no hay prompt, no mostramos el banner flotante
  if (isInstalled || isDismissed) {
    return null;
  }

  // Si no tenemos prompt de Android/PC y no es iOS, ocultamos hasta que esté listo
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Banner flotante discreto en parte superior o inferior adaptativo */}
      <aside
        aria-label="Aviso de instalación de app"
        style={{
          position: 'fixed',
          bottom: itemCount > 0
            ? 'calc(env(safe-area-inset-bottom, 0px) + 88px)'
            : 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          right: '16px',
          left: '16px',
          maxWidth: '440px',
          margin: '0 auto',
          zIndex: 990,
          backgroundColor: '#1C1917',
          color: '#FAF8F5',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <img
            src="/icons/icon-192.png"
            alt="Di Borde"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FAF8F5', lineHeight: 1.2 }}>
              Instalar App Di Borde
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: '#A8A29E',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Acceso directo rápido y sin conexión
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              backgroundColor: 'var(--color-primary, #C83820)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B2301A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C83820')}
          >
            <Download size={14} strokeWidth={2} />
            <span>Instalar</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Cerrar aviso de instalación"
            style={{
              backgroundColor: 'transparent',
              color: '#A8A29E',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A8A29E')}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </aside>

      {/* Modal especial de instrucciones para iPhone / iPad */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cómo instalar Di Borde en iPhone"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--color-carbon, #1C1917)',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px 20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              animation: 'slideUp 250ms ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'none',
                color: 'var(--color-carbon-muted, #78716C)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} strokeWidth={2} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/icons/icon-192.png"
                alt="Di Borde"
                style={{ width: '48px', height: '48px', borderRadius: '10px' }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-carbon, #1C1917)' }}>
                  Instalar Di Borde en iOS
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0 }}>
                  Funciona como una app nativa en tu pantalla de inicio
                </p>
              </div>
            </div>

            <ol
              style={{
                margin: '0 0 20px 0',
                paddingLeft: '1.25rem',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--color-carbon, #1C1917)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <li>
                Toca el botón <strong>Compartir</strong> <Share2 size={15} style={{ verticalAlign: 'middle', display: 'inline', color: '#007AFF' }} /> en la barra inferior de Safari.
              </li>
              <li>
                Desliza hacia abajo y selecciona <strong>"Agregar al inicio"</strong> <PlusSquare size={15} style={{ verticalAlign: 'middle', display: 'inline', color: 'var(--color-carbon)' }} />.
              </li>
              <li>
                Presiona <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo!
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon, #1C1917)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
