import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import ResellerDashboard from './ResellerDashboard.jsx';
import { Lock, User, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function PortalLoginView() {
  const { currentUser, login, quickLoginAs } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Si ya está logueado, mostrar el panel correspondiente
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboard />;
    }
    return <ResellerDashboard />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Usuario o contraseña no válidos.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '85vh', padding: '3.5rem 1rem 6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="eyebrow-kicker" style={{ marginBottom: '0.5rem' }}>
            ACCESO PRIVADO
          </span>
          <h1 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 0.4rem 0' }}>
            Portal Di Borde
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-carbon-muted)', margin: 0 }}>
            Administración central y panel personal de revendedores
          </p>
        </div>

        {/* Card Login */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '2rem 1.75rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem'
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
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-carbon)', display: 'block', marginBottom: '6px' }}>
                Usuario:
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-carbon-subtle)' }} />
                <input
                  type="text"
                  required
                  placeholder="ej: lucas o admin"
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
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-carbon)', display: 'block', marginBottom: '6px' }}>
                Contraseña:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-carbon-subtle)' }} />
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
              <span>Ingresar al Panel</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        {/* Acceso Rápido Demo (Sin emojis, minimalista) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1.25rem',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', textAlign: 'center' }}>
            Accesos de Prueba Rápida
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-carbon)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', backgroundColor: 'var(--color-carbon)', color: '#fff', borderRadius: '4px' }}>ADM</span>
                <span>Panel Administrador (Julián)</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)' }}>Ingresar →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('reseller', 'rev-lucas')}
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-carbon)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '4px' }}>LG</span>
                <span>Revendedor: Lucas Gómez</span>
              </div>
              <span className="tabular-nums" style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 600 }}>Deuda: -$7.500 →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('reseller', 'rev-mateo')}
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-carbon)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: '4px' }}>MR</span>
                <span>Revendedor: Mateo Rivas</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#15803D' }}>Al día →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
