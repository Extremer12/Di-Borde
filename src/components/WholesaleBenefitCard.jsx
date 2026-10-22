import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { CheckCircle2, TrendingDown } from 'lucide-react';

export default function WholesaleBenefitCard() {
  const { items } = useCart();

  // Cuenta paquetes x10 o paquetes x2 grandes en el carrito
  const tierEligibleItems = items.filter(
    (i) => i.product.isTieredDiscount
  );
  const totalTierQuantity = tierEligibleItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const targetQty = 3;
  const isUnlocked = totalTierQuantity >= targetQty;
  const remaining = Math.max(0, targetQty - totalTierQuantity);
  const progressPercent = Math.min(100, Math.round((totalTierQuantity / targetQty) * 100));

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '1.1rem 1.25rem',
        border: isUnlocked ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
        marginBottom: '1.25rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow-kicker" style={{ color: isUnlocked ? 'var(--color-primary)' : 'var(--color-carbon-muted)' }}>
            {isUnlocked ? 'Tarifa por volumen activa' : 'Tarifa por volumen'}
          </span>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-carbon)', marginTop: '2px' }}>
            A partir de 3 paquetes
          </div>
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-carbon-muted)',
              marginTop: '0.2rem',
              marginBottom: 0,
              lineHeight: 1.45
            }}
          >
            Paquete x10 Pre-pizzetas baja a <strong className="tabular-nums">$2.333</strong> c/u (3 x $7.000) o <strong className="tabular-nums">$2.000</strong> c/u llevando 10 · Paquete x2 Grandes baja a <strong className="tabular-nums">$2.000</strong> c/u.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            className="tabular-nums"
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: isUnlocked ? 'var(--color-primary)' : 'var(--color-carbon)'
            }}
          >
            {totalTierQuantity}/{targetQty} paq
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--color-cream-dark)',
          borderRadius: '2px',
          overflow: 'hidden',
          margin: '0.75rem 0'
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: isUnlocked ? 'var(--color-primary)' : 'var(--color-carbon)',
            transition: 'width 0.25s ease',
            borderRadius: '2px'
          }}
        />
      </div>

      {/* Status Note */}
      <div style={{ fontSize: '0.78rem' }}>
        {isUnlocked ? (
          <span style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} strokeWidth={1.5} /> Tarifa mayorista aplicada automáticamente en tu pedido.
          </span>
        ) : (
          <span style={{ color: 'var(--color-carbon-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingDown size={14} strokeWidth={1.5} /> Sumá {remaining} paquete{remaining > 1 ? 's' : ''} más para activar el descuento por volumen.
          </span>
        )}
      </div>
    </div>
  );
}
