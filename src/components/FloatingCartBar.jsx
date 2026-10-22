import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { ChevronUp, ShoppingBag } from 'lucide-react';

export default function FloatingCartBar({ onOpenOrderModal }) {
  const { itemCount, subtotal, isShippingFree, amountUntilFreeShipping, tieredSavings } = useCart();

  if (itemCount === 0) return null;

  let statusText = 'Toca para coordinar entrega o retiro';
  if (tieredSavings > 0) {
    statusText = `Ahorro de $${tieredSavings.toLocaleString('es-AR')} aplicado por volumen`;
  } else if (!isShippingFree && amountUntilFreeShipping > 0) {
    statusText = `Faltan $${amountUntilFreeShipping.toLocaleString('es-AR')} para envío bonificado`;
  }

  return (
    <div
      onClick={onOpenOrderModal}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        backgroundColor: 'var(--color-carbon)',
        color: '#FAF8F5',
        borderRadius: '8px',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-floating)',
        zIndex: 1000,
        cursor: 'pointer',
        animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      {/* Left: Item Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          className="tabular-nums"
          style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            color: '#FAF8F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}
        >
          {itemCount}
        </div>

        <div>
          <div
            className="tabular-nums font-serif"
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.02em'
            }}
          >
            ${subtotal.toLocaleString('es-AR')}
          </div>
          <div style={{ fontSize: '0.72rem', color: tieredSavings > 0 ? '#4ADE80' : 'rgba(255, 255, 255, 0.7)', marginTop: '2px', fontWeight: tieredSavings > 0 ? 600 : 400 }}>
            {statusText}
          </div>
        </div>
      </div>

      {/* Right: Open Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#FAF8F5'
        }}
      >
        <span>Ver Pedido</span>
        <ChevronUp size={15} strokeWidth={1.5} />
      </div>
    </div>
  );
}
