import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import ResellerDashboard from './ResellerDashboard.jsx';
import {
  Shield,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  Lock,
  MessageCircle,
  AlertTriangle,
  Users,
  KeyRound,
  ArrowRight,
  Phone,
  UserCheck
} from 'lucide-react';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';

export default function PortalLoginView() {
  const {
    currentUser,
    logout,
    signInWithGoogle,
    loginWithIdentifier,
    loginAdminWithPin
  } = useAuth();

  // Tab seleccionada: 'revendedor' o 'admin'
  const [activeTab, setActiveTab] = useState('revendedor');

  // Estados para formulario de revendedor
  const [resellerIdentifier, setResellerIdentifier] = useState('');
  const [resellerError, setResellerError] = useState('');
  const [resellerLoading, setResellerLoading] = useState(false);

  // Estados para formulario admin
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Loading para Google OAuth
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Si ya es admin verificado, mostrar dashboard de administración
  if (currentUser && currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  // Si ya es vendedor activo, mostrar dashboard de vendedor
  if (currentUser && currentUser.role === 'reseller') {
    return <ResellerDashboard />;
  }

  // Ingreso directo con Identificador (DNI, Teléfono o Correo)
  const handleResellerQuickLogin = (e) => {
    e.preventDefault();
    setResellerError('');
    if (!resellerIdentifier.trim()) {
      setResellerError('Por favor ingresa tu DNI, teléfono o correo registrado.');
      return;
    }

    setResellerLoading(true);
    const result = loginWithIdentifier(resellerIdentifier.trim());
    setResellerLoading(false);

    if (!result.success) {
      setResellerError(result.message);
    } else {
      window.location.hash = '#/vendedor';
    }
  };

  // Ingreso con PIN de Administrador
  const handleAdminPinLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (!adminPin.trim()) {
      setAdminError('Ingresa la clave de administración.');
      return;
    }

    setAdminLoading(true);
    const result = loginAdminWithPin(adminPin.trim());
    setAdminLoading(false);

    if (!result.success) {
      setAdminError(result.message);
    } else {
      window.location.hash = '#/admin';
    }
  };

  // Ingreso con Google (redirección dinámica según pestaña)
  const handleGoogleLogin = async (targetRoute = '/vendedor') => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle(targetRoute);
    } catch (e) {
      console.error('Google Sign-in exception', e);
      setLoadingGoogle(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-cream, #FAF8F5)',
        minHeight: '85vh',
        padding: '2.5rem 1rem 5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src="/assets/images/Logotipo rojo y negro DI BORDE.png"
            alt="Di Borde"
            style={{ height: '38px', width: 'auto', margin: '0 auto 0.75rem auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/brand/horizontal-color.svg';
            }}
          />
          <h1
            className="font-serif"
            style={{
              fontSize: '1.65rem',
              fontWeight: 600,
              color: 'var(--color-carbon, #1C1917)',
              margin: '0 0 0.35rem 0'
            }}
          >
            Portal Comercial Di Borde
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-carbon-muted, #78716C)',
              margin: 0,
              lineHeight: 1.45
            }}
          >
            Acceso seguro para revendedores de calle y administración central.
          </p>
        </div>

        {/* Tab Switcher: Revendedores vs Administración */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'rgba(28, 25, 23, 0.06)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '1rem',
            gap: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('revendedor');
              setResellerError('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'revendedor' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'revendedor' ? 'var(--color-carbon, #1C1917)' : 'var(--color-carbon-muted, #78716C)',
              fontWeight: activeTab === 'revendedor' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'revendedor' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={15} strokeWidth={activeTab === 'revendedor' ? 2 : 1.5} />
            <span>Revendedores</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminError('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'admin' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'admin' ? 'var(--color-carbon, #1C1917)' : 'var(--color-carbon-muted, #78716C)',
              fontWeight: activeTab === 'admin' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'admin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={14} strokeWidth={activeTab === 'admin' ? 2 : 1.5} />
            <span>Administración</span>
          </button>
        </div>

        {/* Card Principal */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '1.75rem 1.5rem',
            border: '1px solid var(--color-border, #E7E5E4)',
            boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
            marginBottom: '1.25rem'
          }}
        >
          {/* CASO ESPECIAL: CUENTA DE GOOGLE NO AUTORIZADA */}
          {currentUser && currentUser.role === 'unauthorized' && (
            <div>
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
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
                  Cuenta no registrada
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#7F1D1D',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.45
                  }}
                >
                  El usuario <strong>{currentUser.email}</strong> no figura en la nómina de revendedores autorizados de Di Borde.
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
                  Por control de stock y fondos, solicita tu alta a la administración.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Hola DiBorde, quiero registrarme como revendedor en el sistema. Mi correo o número es: ${currentUser.email}`
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
                  <span>Pedir alta a DiBorde por WhatsApp</span>
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
                    color: 'var(--color-carbon, #1C1917)',
                    border: '1px solid var(--color-border, #E7E5E4)',
                    padding: '9px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  <span>Intentar con otra cuenta</span>
                </button>
              </div>
            </div>
          )}

          {/* CASO ESPECIAL: CUENTA SUSPENDIDA */}
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
                  Tu usuario (<strong>{currentUser.name}</strong>) figura como pausado en el sistema. Contacta a Cristian para coordinar tus próximas salidas.
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
                  backgroundColor: 'var(--color-carbon, #1C1917)',
                  color: '#FAF8F5',
                  padding: '10px',
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

          {/* ======================================================== */}
          {/* PESTAÑA 1: INICIO DE SESIÓN REVENDEDORES                   */}
          {/* ======================================================== */}
          {(!currentUser || (currentUser.role !== 'unauthorized' && currentUser.role !== 'suspended')) && activeTab === 'revendedor' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow-kicker" style={{ color: 'var(--color-primary, #C83820)' }}>ACCESO REVENDEDOR</span>
                <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0.2rem 0 0.4rem 0' }}>
                  Ingreso para Vendedores de Calle
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                  Ingresá con tu número de teléfono, DNI o correo registrado en Di Borde.
                </p>
              </div>

              {resellerError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}
                >
                  <AlertTriangle size={15} strokeWidth={1.5} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{resellerError}</span>
                </div>
              )}

              {/* Formulario de acceso directo rápido */}
              <form onSubmit={handleResellerQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label
                    htmlFor="reseller-ident"
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--color-carbon, #1C1917)',
                      marginBottom: '5px'
                    }}
                  >
                    DNI, Teléfono o Correo registrado:
                  </label>
                  <input
                    id="reseller-ident"
                    type="text"
                    required
                    placeholder="ej: 38456789 o 2645123456"
                    value={resellerIdentifier}
                    onChange={(e) => setResellerIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border, #E7E5E4)',
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--color-cream-light, #FAF8F5)',
                      color: 'var(--color-carbon, #1C1917)',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-carbon, #1C1917)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border, #E7E5E4)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={resellerLoading}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-carbon, #1C1917)',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: resellerLoading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'opacity 0.15s ease'
                  }}
                >
                  <UserCheck size={16} strokeWidth={1.5} />
                  <span>{resellerLoading ? 'Verificando nómina...' : 'Ingresar a mi Portal'}</span>
                  <ArrowRight size={15} strokeWidth={1.5} />
                </button>
              </form>

              {/* Separador */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1.25rem 0',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border, #E7E5E4)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle, #A8A29E)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  o continuar con
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border, #E7E5E4)' }} />
              </div>

              {/* Botón de Google OAuth para revendedor */}
              <button
                type="button"
                onClick={() => handleGoogleLogin('/vendedor')}
                disabled={loadingGoogle}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-carbon, #1C1917)',
                  border: '1.5px solid var(--color-border, #E7E5E4)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: loadingGoogle ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loadingGoogle ? 'Conectando...' : 'Cuenta de Google (Gmail)'}</span>
              </button>

              {/* Registro comercial por WhatsApp */}
              <div
                style={{
                  marginTop: '1.35rem',
                  paddingTop: '1.15rem',
                  borderTop: '1px solid var(--color-border, #E7E5E4)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted, #78716C)', marginBottom: '0.5rem' }}>
                  ¿Querés revender Di Borde en tu barrio o plaza?
                </div>
                <a
                  href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    '¡Hola Di Borde! Me gustaría sumarme como revendedor y salir a vender en San Juan. ¿Cómo puedo registrarme?'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: '#15803D',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  <span>Solicitar alta por WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 2: INICIO DE SESIÓN ADMINISTRACIÓN CENTRAL        */}
          {/* ======================================================== */}
          {(!currentUser || (currentUser.role !== 'unauthorized' && currentUser.role !== 'suspended')) && activeTab === 'admin' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow-kicker" style={{ color: 'var(--color-carbon, #1C1917)' }}>GESTIÓN CENTRAL</span>
                <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0.2rem 0 0.4rem 0' }}>
                  Acceso Administración
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                  Panel para control de insumos, producción, pedidos y flujo de fondos.
                </p>
              </div>

              {adminError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertTriangle size={15} strokeWidth={1.5} />
                  <span>{adminError}</span>
                </div>
              )}

              {/* Botón principal de Google para Admin */}
              <button
                type="button"
                onClick={() => handleGoogleLogin('/admin')}
                disabled={loadingGoogle}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-carbon, #1C1917)',
                  border: '1.5px solid var(--color-border, #E7E5E4)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: loadingGoogle ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  marginBottom: '1rem'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loadingGoogle ? 'Conectando con Google...' : 'Ingresar con Google Admin'}</span>
              </button>

              {/* Separador de acceso alternativo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1.25rem 0',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border, #E7E5E4)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle, #A8A29E)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  o acceso directo con clave
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border, #E7E5E4)' }} />
              </div>

              {/* Formulario PIN de Administración */}
              <form onSubmit={handleAdminPinLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label
                    htmlFor="admin-pin"
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--color-carbon, #1C1917)',
                      marginBottom: '5px'
                    }}
                  >
                    Clave de Seguridad Administrativa:
                  </label>
                  <input
                    id="admin-pin"
                    type="password"
                    placeholder="Clave maestra de Di Borde"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border, #E7E5E4)',
                      fontSize: '0.88rem',
                      backgroundColor: 'var(--color-cream-light, #FAF8F5)',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-carbon, #1C1917)',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '11px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: adminLoading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <KeyRound size={15} strokeWidth={1.5} />
                  <span>{adminLoading ? 'Validando clave...' : 'Entrar a Gestión Central'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Links de pie */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="#/"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-carbon-muted, #78716C)',
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
