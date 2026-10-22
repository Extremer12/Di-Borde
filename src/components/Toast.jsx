import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, setToastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '84px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: toastMessage.type === 'error' ? '#991B1B' : '#1C1917',
        color: '#FFFFFF',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontSize: '0.86rem',
        fontWeight: 500,
        animation: 'slideUp 0.2s ease',
        maxWidth: '90vw'
      }}
    >
      {toastMessage.type === 'error' ? (
        <AlertCircle size={16} strokeWidth={1.5} color="#FECACA" />
      ) : (
        <CheckCircle2 size={16} strokeWidth={1.5} color="#86EFAC" />
      )}
      <span>{toastMessage.message}</span>
      <button
        type="button"
        onClick={() => setToastMessage(null)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          marginLeft: '4px',
          padding: '2px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Cerrar notificación"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
