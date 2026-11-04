import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Store, Bike, ArrowRight, MessageSquare, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, ExternalLink } from 'lucide-react';

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

  const { createOrder } = useAuth();

  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' | 'delivery'
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  if (!isOpen) return null;

  const currentTotal = deliveryType === 'pickup' ? Math.max(0, subtotal - discount) : total;

  const handleSendOrder = (e) => {
    e.preventDefault();
    if (!customer.name.trim()) return;

    const orderId = `PED-${Date.now().toString().slice(-4)}`;
    const itemsSummary = items
      .map((it) => `${it.quantity}x ${it.product.name}`)
      .join(', ');

    // 1. Guardar formalmente en el sistema web y Supabase
    createOrder({
      id: orderId,
      customerName: customer.name.trim(),
      phone: customer.phone.trim(),
      address: deliveryType === 'pickup' ? 'Retiro en Obrador (Chimbas)' : (customer.address || '').trim(),
      itemsSummary,
      total: currentTotal,
      deliveryType,
      notes: (customer.notes || '').trim()
    });

    // 2. Generar y abrir WhatsApp oficial con código de pedido
    const waUrl = buildWhatsAppUrl(customer, deliveryType, activeChannel, orderId);
    window.open(waUrl, '_blank');

    // 3. Registrar estado de éxito en el modal y vaciar carrito
    setSubmittedOrder({
      id: orderId,
      total: currentTotal,
      customerName: customer.name.trim(),
      deliveryType,
      waUrl
    });

    clearCart();
  };

  const handleCloseModal = () => {
    setSubmittedOrder(null);
    onClose();
  };

  const handleClearAndClose = () => {
    if (window.confirm('¿Seguro que querés cancelar y vaciar el pedido actual?')) {
      clearCart();
      setSubmittedOrder(null);
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

        {/* Caso: Pedido ya enviado y registrado con éxito */}
        {submittedOrder ? (
          <div style={{ textAlign: 'center', padding: '1.75rem 0.5rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={30} strokeWidth={2} />
            </div>

            <span className="eyebrow-kicker" style={{ color: '#15803D' }}>REGISTRO EXITOSO</span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: 'var(--color-carbon)',
                margin: '0.2rem 0 0.5rem 0'
              }}
            >
              ¡Pedido Enviado a Di Borde!
            </h3>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-carbon)',
                marginBottom: '1rem',
                letterSpacing: '0.04em'
              }}
            >
              CÓDIGO: {submittedOrder.id}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Tu pedido para <strong>{submittedOrder.customerName}</strong> por un total de{' '}
              <strong>${submittedOrder.total.toLocaleString('es-AR')}</strong> ya quedó guardado en el sistema administrativo web de Di Borde y abierto en WhatsApp para coordinar la entrega.
            </p>

            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.76rem',
                color: '#166534',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              ✓ Pedido guardado en base de datos oficial<br />
              ✓ Notificación generada para WhatsApp de la Administración<br />
              ✓ Modalidad: {submittedOrder.deliveryType === 'pickup' ? 'Retiro en Obrador (Chimbas)' : 'Envío a Domicilio'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href={submittedOrder.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#15803D',
                  color: '#FAF8F5',
                  padding: '11px',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <MessageSquare size={16} strokeWidth={1.5} />
                <span>Volver a abrir WhatsApp</span>
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>

              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '11px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Listo, volver a la tienda
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
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
