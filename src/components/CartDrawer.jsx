import React, { useState } from 'react';
import { useCart, DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Truck,
  MapPin,
  Tag,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Lock
} from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    activeChannel,
    getItemPricing,
    getItemUnitPrice,
    hasTierDiscountApplied,
    updateQuantity,
    removeItem,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shippingCost,
    total,
    isShippingFree,
    amountUntilFreeShipping,
    freeShippingProgress,
    buildWhatsAppUrl
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' | 'pickup'
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    zone: 'CABA',
    rubro: '',
    notes: ''
  });
  const [showCheckoutFields, setShowCheckoutFields] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handleCheckoutWhatsApp = () => {
    const waUrl = buildWhatsAppUrl(customer, deliveryType, activeChannel);
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isDrawerOpen ? 'active' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        className={`cart-drawer ${isDrawerOpen ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1.1 }}>Tu Pedido Don Borde</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)' }}>
                {items.length === 0 ? 'Sin artículos' : `${items.reduce((s, i) => s + i.quantity, 0)} unidades en lista`}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Cerrar pedido"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: isShippingFree ? 'var(--color-success-bg)' : '#FFF8E1',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700, color: isShippingFree ? 'var(--color-success)' : '#B78103', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Truck size={14} />
              {isShippingFree
                ? '¡Envío bonificado al 100% en CABA!'
                : `Faltan $${amountUntilFreeShipping.toLocaleString('es-AR')} para envío gratis`}
            </span>
            <span style={{ fontWeight: 800 }}>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: isShippingFree ? 'var(--color-success)' : 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Items Container */}
        <div className="drawer-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  color: 'var(--color-carbon-subtle)'
                }}
              >
                <ShoppingBag size={34} />
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>Tu carrito está vacío</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Tentate con nuestras pizzetas de masa madre o elegí combos para hornear en casa.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => {
                const pricing = getItemPricing ? getItemPricing(item) : { total: item.product.price * item.quantity, isDiscounted: false, discountLabel: null };
                const lineTotal = pricing.total;

                return (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      padding: '0.85rem',
                      backgroundColor: 'var(--color-white)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/prod_pizzetas_clasicas.jpg';
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.92rem', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            style={{ color: 'var(--color-carbon-subtle)', padding: '2px', marginLeft: '6px' }}
                            title="Quitar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                          {item.product.unit}
                        </div>
                        {pricing.isDiscounted && (
                          <div
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#E8F5E9',
                              color: '#2E7D32',
                              fontSize: '0.7rem',
                              fontWeight: 800
                            }}
                          >
                            ⭐ {pricing.discountLabel}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        {/* Quantity Stepper */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1.5px solid var(--color-border)',
                            borderRadius: 'var(--radius-pill)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-cream-light)'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={{ padding: '4px 8px', color: 'var(--color-carbon)' }}
                            aria-label="Restar 1"
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 800 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            style={{ padding: '4px 8px', color: 'var(--color-carbon)' }}
                            aria-label="Sumar 1"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                            ${lineTotal.toLocaleString('es-AR')}
                          </span>
                          {item.quantity > 1 && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-carbon-subtle)' }}>
                              (${unitPrice.toLocaleString('es-AR')} c/u)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery Method Picker */}
          {items.length > 0 && (
            <div style={{ marginTop: '1.25rem', padding: '0.85rem', backgroundColor: 'var(--color-cream-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-carbon-muted)', marginBottom: '0.5rem' }}>
                Modalidad de Entrega:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${deliveryType === 'delivery' ? 'btn-primary' : 'btn-cream'}`}
                  onClick={() => setDeliveryType('delivery')}
                  style={{ fontSize: '0.76rem', padding: '0.5rem 0.25rem' }}
                >
                  <Truck size={14} /> Envío ({isShippingFree ? 'GRATIS' : `$${shippingCost.toLocaleString('es-AR')}`})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${deliveryType === 'pickup' ? 'btn-primary' : 'btn-cream'}`}
                  onClick={() => setDeliveryType('pickup')}
                  style={{ fontSize: '0.76rem', padding: '0.5rem 0.25rem' }}
                >
                  <MapPin size={14} /> Retiro Obrador (Gratis)
                </button>
              </div>
            </div>
          )}

          {/* Customer Fast Details Toggle */}
          {items.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowCheckoutFields(!showCheckoutFields)}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'underline'
                }}
              >
                {showCheckoutFields ? '− Ocultar datos de entrega' : '+ Agregar nombre y dirección al mensaje'}
              </button>

              {showCheckoutFields && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--color-white)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <input
                    type="text"
                    placeholder="Tu nombre o Nombre del local *"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                  />
                  {deliveryType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="Dirección de entrega (Calle y Altura, CABA/GBA) *"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  )}
                  {activeChannel === 'mayorista' && (
                    <input
                      type="text"
                      placeholder="Rubro (ej: Bar, Cafetería, Almacén)"
                      value={customer.rubro}
                      onChange={(e) => setCustomer({ ...customer, rubro: e.target.value })}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Notas para la cocina o entrega (opcional)"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Coupon Input */}
          {items.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              {coupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#E8F5E9',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #A5D6A7',
                    fontSize: '0.82rem'
                  }}
                >
                  <span style={{ color: '#2E7D32', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Tag size={13} strokeWidth={1.5} /> {coupon.code}: {coupon.label}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{ color: '#C62828', fontSize: '0.75rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="CUPÓN (EJ: PROMO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, fontSize: '0.82rem', padding: '0.45rem 0.65rem', textTransform: 'uppercase', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                  <button type="submit" className="btn btn-cream btn-sm" style={{ fontSize: '0.78rem', borderRadius: '6px' }}>
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <div style={{ color: 'var(--color-primary)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {couponError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer with Totals and WhatsApp Action */}
        {items.length > 0 && (
          <div className="drawer-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '1.25rem', backgroundColor: 'var(--color-cream-light)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>Subtotal:</span>
                <span className="tabular-nums" style={{ fontWeight: 600 }}>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                  <span>Descuento aplicado:</span>
                  <span className="tabular-nums" style={{ fontWeight: 700 }}>-${discount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>
                  {deliveryType === 'pickup' ? 'Retiro en Obrador:' : 'Costo de Envío:'}
                </span>
                <span className="tabular-nums" style={{ fontWeight: 600 }}>
                  {deliveryType === 'pickup' || isShippingFree ? 'Sin cargo' : `$${shippingCost.toLocaleString('es-AR')}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '0.65rem',
                  marginTop: '0.35rem'
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-carbon)' }}>Total Final:</span>
                <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                  ${(deliveryType === 'pickup' ? Math.max(0, subtotal - discount) : total).toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
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
                cursor: 'pointer'
              }}
            >
              <span>Pedir por WhatsApp</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.65rem', fontSize: '0.74rem', color: 'var(--color-carbon-muted)' }}>
              <Lock size={12} strokeWidth={1.5} />
              <span>Coordinación directa y pago al recibir (Efectivo o Transferencia)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
