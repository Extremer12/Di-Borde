import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  Lock,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';

export default function PortalLoginView() {
  const { currentUser, logout, signInWithGoogle, ADMIN_EMAIL } = useAuth();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Si ya es admin verificado, mostrar dashboard de administración
  if (currentUser && currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle('/portal');
    } catch (e) {
      console.error('Google Sign-in exception', e);
      setLoadingGoogle(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-cream)',
        minHeight: '85vh',
        padding: '3.5rem 1rem 6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(28, 25, 23, 0.06)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-carbon)',
              marginBottom: '0.75rem'
            }}
          >
            <Shield size={13} strokeWidth={1.5} color="var(--color-primary)" />
            <span>ACCESO EXCLUSIVO CON GOOGLE</span>
          </div>
          <h1
            className="font-serif"
            style={{
              fontSize: '1.85rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              margin: '0 0 0.4rem 0'
            }}
          >
            Portal Di Borde
          </h1>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-carbon-muted)',
              margin: 0
            }}
          >
            Acceso seguro para Administración Central y Vendedores Autorizados.
          </p>
        </div>

        {/* Card Principal */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '2rem 1.75rem',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
            marginBottom: '1.25rem'
          }}
        >
          {/* CASO 1: CUENTA DE GOOGLE NO AUTORIZADA */}
          {currentUser && currentUser.role === 'unauthorized' && (
            <div>
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto'
                  }}
                >
                  <ShieldAlert size={22} color="#DC2626" strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#991B1B',
                    margin: '0 0 0.35rem 0'
                  }}
                >
                  Acceso Restringido
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#7F1D1D',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.45
                  }}
                >
                  Iniciaste sesión con <strong>{currentUser.email}</strong>, pero esta cuenta de Google no figura en la nómina de vendedores autorizados de Di Borde.
                </p>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#991B1B',
                    backgroundColor: '#FFFFFF',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px dashed #FCA5A5'
                  }}
                >
                  Por control de stock y fondos, solo las cuentas habilitadas por Cristian Bordón tienen acceso a los paneles.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Hola Cristian, acabo de intentar ingresar al portal de Di Borde con mi correo de Google: ${currentUser.email}. ¿Podrías darme de alta como vendedor?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#15803D',
                    color: '#FAF8F5',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={15} strokeWidth={1.5} />
                  <span>Pedir autorización a Cristian por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-carbon)',
                    border: '1px solid var(--color-border)',
                    padding: '9px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  <span>Cerrar sesión e ingresar con otra cuenta</span>
                </button>
              </div>
            </div>
          )}

          {/* CASO 2: VENDEDOR SUSPENDIDO O EN PAUSA */}
          {currentUser && currentUser.role === 'suspended' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertTriangle size={24} color="#D97706" style={{ margin: '0 auto 0.5rem auto' }} strokeWidth={1.5} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400E', margin: '0 0 0.35rem 0' }}>
                  Cuenta en pausa
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#B45309', margin: 0 }}>
                  Tu usuario (<strong>{currentUser.name}</strong>) figura como inactivo en la administración. Contacta a Cristian para coordinar tus próximas salidas.
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  padding: '9px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}

          {/* CASO 3: VENDEDOR ACTIVO Y VERIFICADO */}
          {currentUser && currentUser.role === 'reseller' && (
            <div>
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#15803D" strokeWidth={1.5} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                    Vendedor Autorizado
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)' }}>
                  {currentUser.email}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href="#/vendedor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FAF8F5',
                    padding: '11px 16px',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <span>Entrar a mi Portal de Vendedor</span>
                  <ArrowRight size={15} strokeWidth={1.5} />
                </a>

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-carbon-muted)',
                    border: '1px solid var(--color-border)',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={13} strokeWidth={1.5} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}

          {/* CASO 4: NO HAY SESIÓN ACTIVA (PANTALLA DE LOGIN CON GOOGLE) */}
          {!currentUser && (
            <div>
              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-carbon)',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                  Políticas de Acceso Di Borde:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--color-carbon-muted)' }}>
                  <li>
                    <strong>Administrador Central:</strong> Acceso exclusivo para <code>{ADMIN_EMAIL}</code> (control total de caja, compras, pedidos y vendedores).
                  </li>
                  <li style={{ marginTop: '4px' }}>
                    <strong>Vendedores de Calle:</strong> Solo podrán acceder con el correo de Google que Cristian haya registrado en la nómina.
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-carbon)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: loadingGoogle ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-carbon)';
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loadingGoogle ? 'Conectando con Google...' : 'Continuar con Google'}</span>
              </button>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  color: 'var(--color-carbon-muted)'
                }}
              >
                <Lock size={12} strokeWidth={1.5} />
                <span>Autenticación oficial respaldada por Supabase Auth</span>
              </div>
            </div>
          )}
        </div>

        {/* Links de pie */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <a
            href="#/"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-carbon-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            <span>Volver a la tienda pública Di Borde</span>
          </a>
        </div>
      </div>
    </div>
  );
}
