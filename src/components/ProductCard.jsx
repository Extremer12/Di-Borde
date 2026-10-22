import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Plus, Minus, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { items, addItem, updateQuantity, getItemPricing } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;
  const pricing = cartItem ? getItemPricing(cartItem) : { unitPrice: product.price, total: product.price, isDiscounted: false, discountLabel: null };

  const handleIncrement = () => {
    if (currentQty === 0) {
      addItem(product, 1);
    } else {
      updateQuantity(product.id, currentQty + 1);
    }
  };

  const handleDecrement = () => {
    if (currentQty > 0) {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Editorial Food Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-cream-surface)'
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform var(--transition-smooth)'
          }}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/prod_pizzetas_clasicas.jpg';
          }}
        />

        {/* In-Cart Sutil Indicator */}
        {currentQty > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'var(--color-carbon)',
              color: '#FAF8F5',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Check size={12} strokeWidth={2} />
            <span className="tabular-nums">{currentQty} en pedido</span>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Eyebrow Kicker */}
        {product.badge && (
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '0.35rem'
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Title */}
        <h3
          className="font-serif"
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.25
          }}
        >
          {product.name}
        </h3>

        {/* Unit / Weight specification */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-carbon-muted)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.4
          }}
        >
          {product.unit} {product.weight ? `· ${product.weight}` : ''}
        </p>

        {/* Short description */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--color-carbon-muted)',
            lineHeight: 1.5,
            margin: 0
          }}
        >
          {product.shortDescription}
        </p>

        {/* Clean Typographic Wholesale Notice (No sparkles, no yellow card) */}
        {product.hasVolumeDiscount && (
          <div
            style={{
              marginTop: '0.75rem',
              paddingLeft: '0.65rem',
              borderLeft: '2px solid var(--color-border)',
              fontSize: '0.76rem',
              color: 'var(--color-carbon-muted)',
              lineHeight: 1.45
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>Escala comercial: </span>
            {product.specs || 'Descuento por volumen a partir de 3 paquetes.'}
          </div>
        )}

        {/* Price & Action Row */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Price display with Tabular Numerals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                className="tabular-nums font-serif"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: pricing.isDiscounted ? 'var(--color-success)' : 'var(--color-carbon)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1
                }}
              >
                ${(pricing.isDiscounted ? pricing.unitPrice : product.price).toLocaleString('es-AR')}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--color-carbon-subtle)', fontWeight: 500 }}>
                {product.id === 'pizzeta-con-queso' ? '/ unid.' : '/ paq.'}
              </span>
            </div>

            {/* Sub-label */}
            {pricing.isDiscounted ? (
              <div className="tabular-nums" style={{ marginTop: '2px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-success)' }}>
                {pricing.discountLabel}
              </div>
            ) : (
              <div style={{ marginTop: '2px', fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}>
                {product.id === 'pizzeta-con-queso' ? 'Al paso u horneada' : 'Elaboración artesanal'}
              </div>
            )}
          </div>

          {/* Stepper / Add button */}
          {currentQty === 0 ? (
            <button
              type="button"
              onClick={handleIncrement}
              style={{
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Plus size={14} strokeWidth={1.5} />
              <span>Agregar</span>
            </button>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                padding: '2px'
              }}
            >
              <button
                type="button"
                onClick={handleDecrement}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-carbon)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Restar 1"
              >
                <Minus size={13} strokeWidth={1.5} />
              </button>

              <span
                className="tabular-nums"
                style={{
                  minWidth: '30px',
                  textAlign: 'center',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--color-carbon)'
                }}
              >
                {currentQty}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Sumar 1"
              >
                <Plus size={13} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
