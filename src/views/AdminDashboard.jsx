import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  Truck,
  MessageCircle,
  LogOut,
  X,
  Edit2,
  MapPin,
  Phone,
  Flame
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser,
    opsState,
    logout,
    assignMercaderia,
    registerPayment,
    updateResellerDebt,
    addProductionStock,
    createOrder,
    updateOrderStatus
  } = useAuth();

  const [activeTab, setActiveTab] = useState('resellers'); // 'resellers' | 'assign' | 'orders' | 'stock'

  // Modales
  const [paymentModal, setPaymentModal] = useState(null); // { resellerId, name, pending }
  const [paymentAmount, setPaymentAmount] = useState('');

  const [debtModal, setDebtModal] = useState(null); // { resellerId, name, currentDebt, currentReason }
  const [debtInputAmount, setDebtInputAmount] = useState('');
  const [debtInputReason, setDebtInputReason] = useState('');

  // Formulario Asignación
  const [assignTargetReseller, setAssignTargetReseller] = useState(opsState.resellers[0]?.id || '');
  const [assignPizzetas, setAssignPizzetas] = useState(10);
  const [assignPaquetes10, setAssignPaquetes10] = useState(4);
  const [assignPaquetesGrandes, setAssignPaquetesGrandes] = useState(2);
  const [assignNote, setAssignNote] = useState('Lote Mañana');

  // Formulario Nuevo Pedido
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderAddress, setNewOrderAddress] = useState('');
  const [newOrderItems, setNewOrderItems] = useState('3x Paquete x10 Pre-pizzetas');
  const [newOrderTotal, setNewOrderTotal] = useState('7000');
  const [newOrderType, setNewOrderType] = useState('delivery');

  // Cálculos métricas
  const totalStock = opsState.stock['pizzeta-con-queso'] + opsState.stock['paquete-10-prepizzetas'] + opsState.stock['paquete-2-prepizzas-grandes'];
  const totalDebtAcrossResellers = opsState.resellers.reduce((sum, r) => sum + (r.debtAmount || 0), 0);

  const totalStreetRenditionPending = opsState.resellers.reduce((sum, r) => {
    if (!r.activeAssignment) return sum;
    const pending = Math.max(0, r.activeAssignment.totalRendicion - (r.activeAssignment.rendicionPagada || 0));
    return sum + pending;
  }, 0);

  const totalCollectedToday = opsState.resellers.reduce((sum, r) => {
    return sum + (r.activeAssignment?.rendicionPagada || 0);
  }, 0);

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!assignTargetReseller) return;

    assignMercaderia(assignTargetReseller, {
      pizzetasQueso: assignPizzetas,
      paquetes10: assignPaquetes10,
      paquetesGrandes: assignPaquetesGrandes,
      note: assignNote
    });

    alert('Mercadería asignada con éxito. Stock descontado del obrador.');
    setActiveTab('resellers');
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!paymentModal) return;
    registerPayment(paymentModal.resellerId, paymentAmount);
    setPaymentModal(null);
    setPaymentAmount('');
  };

  const handleConfirmDebt = (e) => {
    e.preventDefault();
    if (!debtModal) return;
    updateResellerDebt(debtModal.resellerId, debtInputAmount, debtInputReason);
    setDebtModal(null);
  };

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrderCustomer) return;

    createOrder({
      customerName: newOrderCustomer,
      phone: newOrderPhone,
      address: newOrderAddress,
      itemsSummary: newOrderItems,
      total: parseInt(newOrderTotal) || 0,
      deliveryType: newOrderType
    });

    setNewOrderCustomer('');
    setNewOrderPhone('');
    setNewOrderAddress('');
    alert('Pedido registrado en el sistema.');
  };

  const handleSendReminderWhatsApp = (reseller) => {
    let text = `Hola ${reseller.name}, te escribo de Di Borde.\n`;
    if (reseller.debtAmount > 0) {
      text += `Te recordamos que tenés un saldo pendiente registrado de *$${reseller.debtAmount.toLocaleString('es-AR')}* (${reseller.debtReason || 'mercadería'}).\n`;
    }
    if (reseller.activeAssignment) {
      const pending = reseller.activeAssignment.totalRendicion - (reseller.activeAssignment.rendicionPagada || 0);
      if (pending > 0) {
        text += `Además tenés la rendición de hoy por *$${pending.toLocaleString('es-AR')}*.\n`;
      }
    }
    text += `Por favor confirmanos horario para regularizar en el obrador. Gracias.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/549${reseller.phone}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', padding: '2.5rem 1rem 6rem 1rem' }}>
      <div className="container" style={{ maxWidth: 'var(--max-width)' }}>

        {/* ======================================================== */}
        {/* HEADER ADMIN (Corrección de contraste urgente)           */}
        {/* ======================================================== */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon)',
            borderRadius: '10px',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#E2725B',
                marginBottom: '4px'
              }}
            >
              PANEL DE GESTIÓN Y OPERACIONES
            </span>
            <h1
              className="font-serif"
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#FAF8F5',
                margin: '0 0 4px 0',
                lineHeight: 1.2
              }}
            >
              Administración Di Borde
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#A8A29E', margin: 0 }}>
              Obrador Artesanal · Stock en tiempo real, asignación de lotes y control de cobros.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FAF8F5' }}>
                Julián
              </div>
              <div style={{ fontSize: '0.72rem', color: '#A8A29E' }}>
                Administrador General
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FAF8F5',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MÉTRICAS TIPO DASHBOARD PROFESIONAL (Horizontal limpia) */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--color-border)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}
        >
          {/* 1. Stock Obrador */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="eyebrow-muted" style={{ margin: 0 }}>
                Stock en Obrador
              </span>
              <Package size={15} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                {totalStock}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-carbon-subtle)' }}>unidades</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px' }}>
              {opsState.stock['pizzeta-con-queso']} pizzetas · {opsState.stock['paquete-10-prepizzetas']} x10 · {opsState.stock['paquete-2-prepizzas-grandes']} x2
            </div>
          </div>

          {/* 2. Deuda Total en Rojo (Punto rojo sutil, sin fondo rosa) */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DC2626' }}>
                  Saldos en Rojo
                </span>
              </div>
              <AlertTriangle size={15} strokeWidth={1.5} color="#DC2626" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.6rem', fontWeight: 600, color: '#DC2626' }}>
                -${totalDebtAcrossResellers.toLocaleString('es-AR')}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px' }}>
              {opsState.resellers.filter((r) => (r.debtAmount || 0) > 0).length} revendedores con saldo adeudado
            </div>
          </div>

          {/* 3. En la calle por rendir */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="eyebrow-muted" style={{ margin: 0 }}>
                Por Rendir Hoy
              </span>
              <TrendingUp size={15} strokeWidth={1.5} color="var(--color-carbon-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                ${totalStreetRenditionPending.toLocaleString('es-AR')}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px' }}>
              Lotes activos entregados hoy
            </div>
          </div>

          {/* 4. Cobrado en caja */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="eyebrow-muted" style={{ margin: 0, color: '#15803D' }}>
                Cobrado en Caja Hoy
              </span>
              <CheckCircle2 size={15} strokeWidth={1.5} color="#15803D" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.6rem', fontWeight: 600, color: '#15803D' }}>
                +${totalCollectedToday.toLocaleString('es-AR')}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px' }}>
              Rendiciones liquidadas en el día
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NAVEGACIÓN POR PESTAÑAS (Underline Tabs Minimalistas)    */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            gap: '1.75rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('resellers')}
            style={{
              padding: '0.75rem 0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'resellers' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'resellers' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'resellers' ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Users size={15} strokeWidth={1.5} />
            <span>Revendedores & Deudas</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'var(--color-cream-surface)',
                padding: '1px 6px',
                borderRadius: '4px',
                color: 'var(--color-carbon-muted)'
              }}
            >
              {opsState.resellers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assign')}
            style={{
              padding: '0.75rem 0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'assign' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'assign' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'assign' ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Package size={15} strokeWidth={1.5} />
            <span>Asignar Mercadería</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'orders' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'orders' ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Truck size={15} strokeWidth={1.5} />
            <span>Pedidos</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'var(--color-cream-surface)',
                padding: '1px 6px',
                borderRadius: '4px',
                color: 'var(--color-carbon-muted)'
              }}
            >
              {opsState.orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            style={{
              padding: '0.75rem 0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'stock' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'stock' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'stock' ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Flame size={15} strokeWidth={1.5} />
            <span>Stock Obrador</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LISTA DE REVENDEDORES (Filas Limpias & Avatar LG) */}
        {/* ======================================================== */}
        {activeTab === 'resellers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="eyebrow-muted" style={{ margin: 0 }}>
                Control de Revendedores y Saldos en Calle
              </span>
              <span className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)' }}>
                {opsState.resellers.length} registrados
              </span>
            </div>

            {opsState.resellers.map((r) => {
              const hasDebt = (r.debtAmount || 0) > 0;
              const assign = r.activeAssignment;
              const pendingRendition = assign ? Math.max(0, assign.totalRendicion - (assign.rendicionPagada || 0)) : 0;
              const initials = r.initials || r.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '1.25rem 1.5rem',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  {/* Fila Principal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    
                    {/* Identidad con Avatar de Iniciales (Sin emoji caritas) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-cream-surface)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--color-carbon)',
                          letterSpacing: '0.04em',
                          flexShrink: 0
                        }}
                      >
                        {initials}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                            {r.name}
                          </h3>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}>
                            @{r.username}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} strokeWidth={1.5} />
                            {r.zone}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} strokeWidth={1.5} />
                            {r.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Estado de Deuda / Al día (Punto indicador sutil) */}
                    <div style={{ textAlign: 'right' }}>
                      {hasDebt ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626' }}>
                              Saldo en rojo
                            </span>
                          </div>
                          <span className="tabular-nums font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#DC2626', marginTop: '2px' }}>
                            -${r.debtAmount.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--color-success-bg)' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803D' }}>
                            Al día
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivo de deuda integrado como nota administrativa discreta */}
                  {hasDebt && (
                    <div
                      style={{
                        marginTop: '0.85rem',
                        backgroundColor: 'var(--color-cream)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        color: 'var(--color-carbon-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--color-carbon)', fontWeight: 600 }}>Nota administrativa:</strong>{' '}
                        {r.debtReason}
                      </div>
                      {r.debtDate && (
                        <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}>
                          Registrado: {r.debtDate}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Detalle de Mercadería asignada */}
                  {assign ? (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div className="tabular-nums" style={{ color: 'var(--color-carbon-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>Lote activo ({assign.date}):</span>{' '}
                        {assign.pizzetasQueso} pizzetas · {assign.paquetes10} paq x10 · {assign.paquetesGrandes} paq x2 · Total: ${assign.totalRendicion.toLocaleString('es-AR')}
                      </div>

                      <div className="tabular-nums" style={{ fontWeight: 600, color: pendingRendition === 0 ? '#15803D' : 'var(--color-primary)' }}>
                        {pendingRendition === 0 ? 'Rendición pagada completa' : `Pendiente a rendir: $${pendingRendition.toLocaleString('es-AR')}`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--color-border)', fontSize: '0.78rem', color: 'var(--color-carbon-subtle)' }}>
                      Sin mercadería asignada actualmente.
                    </div>
                  )}

                  {/* Botones de Acción sobre el Revendedor */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {assign && pendingRendition > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentModal({ resellerId: r.id, name: r.name, pending: pendingRendition });
                          setPaymentAmount(pendingRendition);
                        }}
                        style={{
                          backgroundColor: 'var(--color-carbon)',
                          color: '#FAF8F5',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <DollarSign size={13} strokeWidth={1.5} />
                        <span>Cobrar Rendición</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDebtModal({ resellerId: r.id, name: r.name, currentDebt: r.debtAmount || 0, currentReason: r.debtReason || '' });
                        setDebtInputAmount(r.debtAmount || 0);
                        setDebtInputReason(r.debtReason || '');
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: hasDebt ? '#DC2626' : 'var(--color-carbon)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Edit2 size={13} strokeWidth={1.5} />
                      <span>{hasDebt ? 'Ajustar Saldo Deudor' : 'Anotar Deuda'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendReminderWhatsApp(r)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#15803D',
                        border: '1px solid #BBF7D0',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <MessageCircle size={13} strokeWidth={1.5} />
                      <span>WhatsApp Recordatorio</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ASIGNAR MERCADERÍA                                */}
        {/* ======================================================== */}
        {activeTab === 'assign' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2rem', border: '1px solid var(--color-border)' }}>
            <span className="eyebrow-kicker">CONTROL DE LOTES</span>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 0.5rem 0' }}>
              Asignar Mercadería a Revendedor
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-carbon-muted)', marginBottom: '1.75rem' }}>
              Seleccioná al revendedor y las unidades a entregar. El stock se descuenta automáticamente del obrador en tiempo real.
            </p>

            <form onSubmit={handleConfirmAssignment}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-carbon)', display: 'block', marginBottom: '6px' }}>
                  Revendedor Destinatario:
                </label>
                <select
                  value={assignTargetReseller}
                  onChange={(e) => setAssignTargetReseller(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                >
                  {opsState.resellers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (@{r.username}) - {r.zone} {r.debtAmount > 0 ? `(Deuda: $${r.debtAmount.toLocaleString('es-AR')})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidades a entregar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-cream)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Pizzetas con queso ($800 PVP):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assignPizzetas}
                    onChange={(e) => setAssignPizzetas(Math.max(0, parseInt(e.target.value) || 0))}
                    className="tabular-nums"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '1.05rem', fontWeight: 600 }}
                  />
                  <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px', display: 'block' }}>
                    Disponible en obrador: {opsState.stock['pizzeta-con-queso']} unid.
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--color-cream)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Paquetes x10 Pre-pizzetas:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assignPaquetes10}
                    onChange={(e) => setAssignPaquetes10(Math.max(0, parseInt(e.target.value) || 0))}
                    className="tabular-nums"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '1.05rem', fontWeight: 600 }}
                  />
                  <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px', display: 'block' }}>
                    Disponible en obrador: {opsState.stock['paquete-10-prepizzetas']} paq.
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--color-cream)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Paquetes x2 Grandes:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assignPaquetesGrandes}
                    onChange={(e) => setAssignPaquetesGrandes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="tabular-nums"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '1.05rem', fontWeight: 600 }}
                  />
                  <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '4px', display: 'block' }}>
                    Disponible en obrador: {opsState.stock['paquete-2-prepizzas-grandes']} paq.
                  </span>
                </div>
              </div>

              {/* Vista previa cálculo tipo Stripe/Linear */}
              <div
                style={{
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#A8A29E' }}>Rendición a entregar a Di Borde:</div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.4rem', fontWeight: 600, color: '#4ADE80' }}>
                    ${((assignPizzetas * 400) + (assignPaquetes10 * 2000) + (assignPaquetesGrandes * 1800)).toLocaleString('es-AR')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#A8A29E' }}>Recaudación total en calle:</div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                    ${((assignPizzetas * 800) + (assignPaquetes10 * 2500) + (assignPaquetesGrandes * 2500)).toLocaleString('es-AR')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#A8A29E' }}>Ganancia estimada del revendedor:</div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FCD34D' }}>
                    +${(((assignPizzetas * 800) + (assignPaquetes10 * 2500) + (assignPaquetesGrandes * 2500)) - ((assignPizzetas * 400) + (assignPaquetes10 * 2000) + (assignPaquetesGrandes * 1800))).toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Confirmar y Descontar Mercadería
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PEDIDOS                                           */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Formulario nuevo pedido */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <span className="eyebrow-kicker">REGISTRO MANUAL</span>
              <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
                Crear Nuevo Pedido de Cliente o Comercio
              </h3>

              <form onSubmit={handleCreateOrderSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Cliente / Negocio:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Cafetería Central"
                      value={newOrderCustomer}
                      onChange={(e) => setNewOrderCustomer(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Teléfono WhatsApp:</label>
                    <input
                      type="text"
                      placeholder="Ej: 2645112233"
                      value={newOrderPhone}
                      onChange={(e) => setNewOrderPhone(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Dirección / Modalidad:</label>
                    <input
                      type="text"
                      placeholder="Ej: Mitre 450 (Delivery)"
                      value={newOrderAddress}
                      onChange={(e) => setNewOrderAddress(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Detalle Productos:</label>
                    <input
                      type="text"
                      value={newOrderItems}
                      onChange={(e) => setNewOrderItems(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total ($):</label>
                    <input
                      type="number"
                      value={newOrderTotal}
                      onChange={(e) => setNewOrderTotal(e.target.value)}
                      className="tabular-nums"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  + Agregar Pedido a la Lista
                </button>
              </form>
            </div>

            {/* Lista de pedidos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {opsState.orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--color-carbon)' }}>{ord.customerName}</span>
                      <span className="tabular-nums" style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-cream)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-carbon-muted)' }}>{ord.id}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}>{ord.date}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                      {ord.itemsSummary} · {ord.address}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="tabular-nums font-serif" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                        ${ord.total.toLocaleString('es-AR')}
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: ord.status === 'entregado' ? '#15803D' : ord.status === 'en_camino' ? '#D97706' : 'var(--color-carbon-muted)'
                        }}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.78rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_camino">En camino</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STOCK OBRADOR                                     */}
        {/* ======================================================== */}
        {activeTab === 'stock' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2rem', border: '1px solid var(--color-border)' }}>
            <span className="eyebrow-kicker">INVENTARIO EN VIVO</span>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 1rem 0' }}>
              Control y Suma de Producción
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 600, margin: '0 0 4px 0' }}>Pizzetas con Queso</h3>
                <div className="tabular-nums font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                  {opsState.stock['pizzeta-con-queso']} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-carbon-muted)' }}>unid.</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
                  <button onClick={() => addProductionStock('pizzeta-con-queso', 20)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+20</button>
                  <button onClick={() => addProductionStock('pizzeta-con-queso', 50)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+50</button>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 600, margin: '0 0 4px 0' }}>Paquetes x10 Pre-pizzetas</h3>
                <div className="tabular-nums font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                  {opsState.stock['paquete-10-prepizzetas']} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-carbon-muted)' }}>paq.</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
                  <button onClick={() => addProductionStock('paquete-10-prepizzetas', 10)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+10</button>
                  <button onClick={() => addProductionStock('paquete-10-prepizzetas', 25)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+25</button>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 600, margin: '0 0 4px 0' }}>Paquetes x2 Grandes</h3>
                <div className="tabular-nums font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-carbon)' }}>
                  {opsState.stock['paquete-2-prepizzas-grandes']} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-carbon-muted)' }}>paq.</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
                  <button onClick={() => addProductionStock('paquete-2-prepizzas-grandes', 10)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+10</button>
                  <button onClick={() => addProductionStock('paquete-2-prepizzas-grandes', 20)} style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>+20</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR COBRO DE RENDICIÓN                      */}
      {/* ======================================================== */}
      {paymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28, 25, 23, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.75rem', maxWidth: '380px', width: '100%', border: '1px solid var(--color-border)' }}>
            <h3 className="font-serif" style={{ margin: '0 0 6px 0', fontSize: '1.25rem' }}>Registrar Cobro de Rendición</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0 0 1rem 0' }}>
              Cobro a <strong>{paymentModal.name}</strong>. Pendiente hoy: ${paymentModal.pending.toLocaleString('es-AR')}.
            </p>

            <form onSubmit={handleConfirmPayment}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Monto cobrado ($):</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="tabular-nums"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem' }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setPaymentModal(null)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: '#fff', fontSize: '0.84rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-carbon)', color: '#fff', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}>Confirmar Cobro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: AJUSTAR DEUDA / SALDO ROJO                        */}
      {/* ======================================================== */}
      {debtModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28, 25, 23, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.75rem', maxWidth: '400px', width: '100%', border: '1px solid var(--color-border)' }}>
            <h3 className="font-serif" style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: 'var(--color-carbon)' }}>Ajustar Saldo Deudor</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0 0 1rem 0' }}>
              Revendedor: <strong>{debtModal.name}</strong>. Se reflejará en su panel personal.
            </p>

            <form onSubmit={handleConfirmDebt}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Monto de Deuda ($):</label>
              <input
                type="number"
                value={debtInputAmount}
                onChange={(e) => setDebtInputAmount(e.target.value)}
                className="tabular-nums"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '1.2rem', fontWeight: 600, color: '#DC2626', marginBottom: '1rem' }}
              />

              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Motivo anotado (visible en su panel):</label>
              <input
                type="text"
                placeholder="Ej: Mercadería consumida sin rendir"
                value={debtInputReason}
                onChange={(e) => setDebtInputReason(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.86rem', marginBottom: '1.25rem' }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setDebtModal(null)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: '#fff', fontSize: '0.84rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: '#fff', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}>Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
