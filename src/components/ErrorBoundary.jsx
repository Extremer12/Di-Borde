import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Di Borde ErrorBoundary] Error capturado:', error, errorInfo);
  }

  handleReload = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            backgroundColor: 'var(--color-cream, #FAF8F5)'
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--color-border, #E7E5E4)',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.08)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              <AlertTriangle size={24} strokeWidth={1.5} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: '1.35rem',
                color: 'var(--color-carbon, #1C1917)',
                margin: '0 0 0.5rem 0'
              }}
            >
              Algo no cargó como esperábamos
            </h2>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--color-carbon-muted, #78716C)',
                margin: '0 0 1.5rem 0',
                lineHeight: 1.5
              }}
            >
              Hemos prevenido que la pantalla quede en blanco. Puedes recargar la aplicación o volver a la tienda pública.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-carbon, #1C1917)',
                  color: '#FAF8F5',
                  padding: '11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} strokeWidth={1.5} />
                <span>Recargar Aplicación</span>
              </button>

              <a
                href="#/"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-carbon, #1C1917)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                <Home size={15} strokeWidth={1.5} />
                <span>Volver al Inicio</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

