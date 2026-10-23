import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { X, Store, Bike, ArrowRight, MessageSquare, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function OrderModal({ isOpen, onClose }) {
  const {
    items,
    getItemPricing,
    getItemUnitPrice,
    hasTierDiscountApplied,
    subtotal,
    discount,
    shippingCost,
    total,
    isShippingFree,
    buildWhatsAppUrl,
    activeChannel,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' | 'delivery'
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (!isOpen) return null;

  const currentTotal = deliveryType === 'pickup' ? Math.max(0, subtotal - discount) : total;

  const handleSendOrder = (e) => {
    e.preventDefault();
    const waUrl = buildWhatsAppUrl(customer, deliveryType, activeChannel);
    window.open(waUrl, '_blank');
  };

  const handleClearAndClose = () => {
    if (window.confirm('¿Seguro que querés cancelar y vaciar el pedido actual?')) {
      clearCart();
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          padding: 'clamp(1.1rem, 3.5vw, 1.75rem)',
          boxShadow: '0 20px 48px rgba(28, 25, 23, 0.16)',
          overflowY: 'auto',
          position: 'relative',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <span className="eyebrow-kicker">Revisión de Pedido</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--color-carbon)',
                margin: 0,
                letterSpacing: '-0.02em'
              }}
            >
              Tu Carrito
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--color-carbon-muted)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            aria-label="Cerrar"
            title="Cerrar carrito"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-cream-surface)',
                color: 'var(--color-carbon-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 0.4rem 0' }}>
              Tu carrito está vacío
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.5rem 0' }}>
              Todavía no sumaste variedades a tu pedido.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Ver Carta y Productos
            </button>
          </div>
        ) : (
          <>
            {/* Order Items Box with Quantity Modification and Removal */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid var(--color-border)',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '0.85rem' }}>
                {items.map((item) => {
                  const pricing = getItemPricing ? getItemPricing(item) : { total: item.product.price * item.quantity, isDiscounted: false, discountLabel: null };
                  return (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px dashed var(--color-border)'
                      }}
                    >
                      {/* Left: Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: pricing.isDiscounted ? 'var(--color-primary)' : 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                          {pricing.discountLabel ? pricing.discountLabel : item.product.unit}
                        </div>
                      </div>

                      {/* Middle: Stepper controls (- / qty / +) */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-carbon)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          aria-label="Disminuir cantidad"
                          title="Disminuir"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span
                          className="tabular-nums"
                          style={{
                            minWidth: '24px',
                            textAlign: 'center',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--color-carbon)'
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-carbon)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          aria-label="Aumentar cantidad"
                          title="Aumentar"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right', minWidth: '70px' }}>
                        <span className="tabular-nums" style={{ fontWeight: 600, fontSize: '0.88rem', color: pricing.isDiscounted ? 'var(--color-primary)' : 'var(--color-carbon)' }}>
                          ${pricing.total.toLocaleString('es-AR')}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#A8A29E',
                          background: 'none',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'color 0.15s ease'
                        }}
                        aria-label="Eliminar del pedido"
                        title="Quitar producto"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal and actions row */}
              <div
                style={{
                  paddingTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={handleClearAndClose}
                  style={{
                    fontSize: '0.74rem',
                    color: '#991B1B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 0',
                    fontWeight: 500
                  }}
                  title="Vaciar todo el carrito"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  <span>Vaciar carrito</span>
                </button>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-muted)', fontWeight: 600, marginRight: '0.5rem' }}>
                    Subtotal:
                  </span>
                  <span className="tabular-nums" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                    ${subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.82rem', color: 'var(--color-carbon-muted)', paddingTop: '0.45rem', borderTop: '1px solid var(--color-border)' }}>
                  <span>Costo de Envío:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>
                    {isShippingFree ? 'Sin cargo' : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Options */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.5rem' }}>
                Modalidad de entrega
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: deliveryType === 'pickup' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                    backgroundColor: deliveryType === 'pickup' ? 'var(--color-carbon)' : '#FFFFFF',
                    color: deliveryType === 'pickup' ? '#FFFFFF' : 'var(--color-carbon)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Store size={18} strokeWidth={1.5} color={deliveryType === 'pickup' ? '#FAF8F5' : 'var(--color-carbon-muted)'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Retiro</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>En obrador Chimbas</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: deliveryType === 'delivery' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                    backgroundColor: deliveryType === 'delivery' ? 'var(--color-carbon)' : '#FFFFFF',
                    color: deliveryType === 'delivery' ? '#FFFFFF' : 'var(--color-carbon)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Bike size={18} strokeWidth={1.5} color={deliveryType === 'delivery' ? '#FAF8F5' : 'var(--color-carbon-muted)'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Envío</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>A domicilio</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Info Form */}
            <form onSubmit={handleSendOrder}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.5rem' }}>
                  Datos de contacto
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y apellido"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '0.7rem 0.85rem',
                      fontSize: '0.88rem',
                      color: 'var(--color-carbon)',
                      outline: 'none'
                    }}
                  />

                  {deliveryType === 'delivery' && (
                    <input
                      type="text"
                      required
                      placeholder="Dirección exacta (Calle, número, barrio o referencia)"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        padding: '0.7rem 0.85rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-carbon)',
                        outline: 'none'
                      }}
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Notas o indicaciones (opcional)"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '0.7rem 0.85rem',
                      fontSize: '0.88rem',
                      color: 'var(--color-carbon)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons: Confirm & Cancel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <MessageSquare size={16} strokeWidth={1.5} />
                  <span>Confirmar por WhatsApp</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span className="tabular-nums">${currentTotal.toLocaleString('es-AR')}</span>
                  <ArrowRight size={15} strokeWidth={1.5} style={{ marginLeft: '4px' }} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-carbon-muted)',
                    border: '1px solid var(--color-border)',
                    fontWeight: 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Seguir viendo productos
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
