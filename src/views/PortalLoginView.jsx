import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import { Lock, User, ArrowRight, AlertCircle, Shield, ArrowLeft } from 'lucide-react';

export default function PortalLoginView() {
  const { currentUser, login, loginAsAdmin } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  // Si ya está logueado como admin, mostrar el panel
  if (currentUser && currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Usuario o clave no válidos.');
    }
  };

  const handleQuickAdmin = () => {
    loginAsAdmin();
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
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(28, 25, 23, 0.06)',
              padding: '4px 10px',
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
            <span>ACCESO EXCLUSIVO ADMINISTRADOR</span>
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
            Gestión Central Di Borde
          </h1>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-carbon-muted)',
              margin: 0
            }}
          >
            Panel operativo para Cristian: stock de insumos, compras, caja y vendedores.
          </p>
        </div>

        {/* Card Login */}
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
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} strokeWidth={1.5} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-carbon)',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Usuario Administrador:
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={15}
                  strokeWidth={1.5}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-carbon-subtle)'
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-carbon)',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Contraseña / PIN:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  strokeWidth={1.5}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-carbon-subtle)'
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>Ingresar al Panel de Cristian</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </form>

          <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--color-carbon-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              o acceso directo
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          </div>

          <button
            type="button"
            onClick={handleQuickAdmin}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-cream)',
              color: 'var(--color-carbon)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '9px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Shield size={14} strokeWidth={1.5} color="var(--color-primary)" />
            <span>Entrar como Administrador (Cristian)</span>
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href="#/"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-carbon-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span>Volver a la tienda web Di Borde</span>
          </a>
        </div>
      </div>
    </div>
  );
}
