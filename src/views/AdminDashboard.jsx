import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MessageSquare,
  ShoppingBag,
  Truck,
  Phone,
  FileText,
  X,
  ExternalLink,
  ShieldAlert,
  Edit2,
  Mail,
  Shield
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser,
    opsState,
    logout,
    loginAsReseller,
    addRawMaterial,
    deleteRawMaterial,
    addRawMaterialPurchase,
    updateRawMaterialStock,
    addCashflowTransaction,
    deleteCashflowTransaction,
    addReseller,
    updateReseller,
    deleteReseller,
    assignMercaderia,
    registerPayment,
    updateResellerDebt,
    addResellerNote,
    toggleResellerNoteStatus,
    createOrder,
    updateOrderStatus,
    addProductionStock,
    signInWithGoogle,
    ADMIN_EMAIL
  } = useAuth();

  // Control estricto de acceso de Administrador por correo
  const isAuthorizedAdmin =
    currentUser &&
    currentUser.role === 'admin' &&
    currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL?.toLowerCase().trim();

  const [activeTab, setActiveTab] = useState('caja'); // 'caja' | 'insumos' | 'vendedores' | 'sugerencias' | 'pedidos'


  // Modales
  const [isCashflowModalOpen, setIsCashflowModalOpen] = useState(false);
  const [cashflowType, setCashflowType] = useState('ingreso');
  const [cashflowCategory, setCashflowCategory] = useState('Venta Directa');
  const [cashflowConcept, setCashflowConcept] = useState('');
  const [cashflowAmount, setCashflowAmount] = useState('');

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseMaterialId, setPurchaseMaterialId] = useState(opsState.rawMaterials[0]?.id || '');
  const [purchaseQuantity, setPurchaseQuantity] = useState('');
  const [purchaseUnitPrice, setPurchaseUnitPrice] = useState('');
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  const [isNewMaterialModalOpen, setIsNewMaterialModalOpen] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('Insumo Principal');
  const [newMatUnit, setNewMatUnit] = useState('kg');
  const [newMatStock, setNewMatStock] = useState('');
  const [newMatMinAlert, setNewMatMinAlert] = useState('5');
  const [newMatPrice, setNewMatPrice] = useState('');
  const [newMatSupplier, setNewMatSupplier] = useState('');

  const [isNewResellerModalOpen, setIsNewResellerModalOpen] = useState(false);
  const [newResellerName, setNewResellerName] = useState('');
  const [newResellerEmail, setNewResellerEmail] = useState('');
  const [newResellerPhone, setNewResellerPhone] = useState('');
  const [newResellerZone, setNewResellerZone] = useState('');
  const [newResellerDni, setNewResellerDni] = useState('');
  const [newResellerAddress, setNewResellerAddress] = useState('');

  const [editingReseller, setEditingReseller] = useState(null);
  const [editResellerName, setEditResellerName] = useState('');
  const [editResellerEmail, setEditResellerEmail] = useState('');
  const [editResellerPhone, setEditResellerPhone] = useState('');
  const [editResellerZone, setEditResellerZone] = useState('');
  const [editResellerStatus, setEditResellerStatus] = useState('activo');


  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteResellerId, setNoteResellerId] = useState(opsState.resellers[0]?.id || '');
  const [noteType, setNoteType] = useState('venta');
  const [noteContent, setNoteContent] = useState('');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderItems, setOrderItems] = useState('3x Paquete x10 Pre-pizzetas ($7.000)');
  const [orderTotal, setOrderTotal] = useState('7000');
  const [orderDeliveryType, setOrderDeliveryType] = useState('delivery');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetReseller, setAssignTargetReseller] = useState(opsState.resellers[0]?.id || '');
  const [assignPizzetas, setAssignPizzetas] = useState(15);
  const [assignPaquetes10, setAssignPaquetes10] = useState(4);
  const [assignPaquetesGrandes, setAssignPaquetesGrandes] = useState(2);
  const [assignNote, setAssignNote] = useState('Turno Tarde');

  const [paymentModal, setPaymentModal] = useState(null); // { resellerId, name, pending }
  const [paymentInputAmount, setPaymentInputAmount] = useState('');

  const [debtModal, setDebtModal] = useState(null); // { resellerId, name, currentDebt }
  const [debtInputAmount, setDebtInputAmount] = useState('');
  const [debtInputReason, setDebtInputReason] = useState('');

  const [adjustMaterialModal, setAdjustMaterialModal] = useState(null); // { id, name, currentStock, unit }
  const [adjustStockVal, setAdjustStockVal] = useState('');

  // --------------------------------------------------------------------------
  // CÁLCULOS KPI GENERALES
  // --------------------------------------------------------------------------
  const totalIngresos = opsState.cashflow
    .filter((tx) => tx.type === 'ingreso')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalEgresos = opsState.cashflow
    .filter((tx) => tx.type === 'egreso')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balanceNetoCaja = totalIngresos - totalEgresos;

  const totalDeudaCalle = opsState.resellers.reduce((sum, r) => sum + (r.debtAmount || 0), 0);

  const pendingStreetRendition = opsState.resellers.reduce((sum, r) => {
    if (!r.assigned) return sum;
    const diff = Math.max(0, r.assigned.totalRendicion - (r.assigned.rendicionCobrada || 0));
    return sum + diff;
  }, 0);

  const lowStockMaterials = opsState.rawMaterials.filter(
    (m) => m.currentStock <= m.minStockAlert
  );

  const pendingOrdersCount = opsState.orders.filter(
    (o) => o.status === 'pendiente' || o.status === 'en_elaboracion' || o.status === 'en_reparto'
  ).length;

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------
  const handleCreateCashflow = (e) => {
    e.preventDefault();
    addCashflowTransaction({
      type: cashflowType,
      category: cashflowCategory,
      concept: cashflowConcept,
      amount: cashflowAmount
    });
    setCashflowConcept('');
    setCashflowAmount('');
    setIsCashflowModalOpen(false);
  };

  const handleCreatePurchase = (e) => {
    e.preventDefault();
    addRawMaterialPurchase({
      materialId: purchaseMaterialId,
      quantity: purchaseQuantity,
      unitPrice: purchaseUnitPrice,
      supplier: purchaseSupplier,
      notes: purchaseNotes
    });
    setPurchaseQuantity('');
    setPurchaseUnitPrice('');
    setPurchaseSupplier('');
    setPurchaseNotes('');
    setIsPurchaseModalOpen(false);
  };

  const handleCreateNewMaterial = (e) => {
    e.preventDefault();
    addRawMaterial({
      name: newMatName,
      category: newMatCategory,
      unit: newMatUnit,
      currentStock: newMatStock,
      minStockAlert: newMatMinAlert,
      lastPurchasePrice: newMatPrice,
      supplier: newMatSupplier
    });
    setNewMatName('');
    setNewMatStock('');
    setNewMatPrice('');
    setNewMatSupplier('');
    setIsNewMaterialModalOpen(false);
  };

  const handleCreateNewReseller = (e) => {
    e.preventDefault();
    addReseller({
      name: newResellerName,
      email: newResellerEmail,
      phone: newResellerPhone,
      zone: newResellerZone,
      dni: newResellerDni,
      address: newResellerAddress
    });
    setNewResellerName('');
    setNewResellerEmail('');
    setNewResellerPhone('');
    setNewResellerZone('');
    setNewResellerDni('');
    setNewResellerAddress('');
    setIsNewResellerModalOpen(false);
  };

  const handleOpenEditReseller = (reseller) => {
    setEditingReseller(reseller);
    setEditResellerName(reseller.name || '');
    setEditResellerEmail(reseller.email || '');
    setEditResellerPhone(reseller.phone || '');
    setEditResellerZone(reseller.zone || '');
    setEditResellerStatus(reseller.status || 'activo');
  };

  const handleSaveEditReseller = (e) => {
    e.preventDefault();
    if (!editingReseller) return;
    updateReseller(editingReseller.id, {
      name: editResellerName,
      email: editResellerEmail,
      phone: editResellerPhone,
      zone: editResellerZone,
      status: editResellerStatus
    });
    setEditingReseller(null);
  };


  const handleCreateNote = (e) => {
    e.preventDefault();
    const target = opsState.resellers.find((r) => r.id === noteResellerId);
    addResellerNote({
      resellerId: noteResellerId,
      resellerName: target ? target.name : 'Vendedor',
      type: noteType,
      content: noteContent
    });
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    createOrder({
      customerName: orderCustomer,
      phone: orderPhone,
      address: orderAddress,
      itemsSummary: orderItems,
      total: parseInt(orderTotal) || 0,
      deliveryType: orderDeliveryType
    });
    setOrderCustomer('');
    setOrderPhone('');
    setOrderAddress('');
    setIsOrderModalOpen(false);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    assignMercaderia(assignTargetReseller, {
      pizzetasQueso: assignPizzetas,
      paquetes10: assignPaquetes10,
      paquetesGrandes: assignPaquetesGrandes,
      note: assignNote
    });
    setIsAssignModalOpen(false);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!paymentModal) return;
    registerPayment(paymentModal.resellerId, paymentInputAmount);
    setPaymentModal(null);
    setPaymentInputAmount('');
  };

  const handleConfirmDebt = (e) => {
    e.preventDefault();
    if (!debtModal) return;
    updateResellerDebt(debtModal.resellerId, debtInputAmount, debtInputReason);
    setDebtModal(null);
    setDebtInputAmount('');
    setDebtInputReason('');
  };

  const handleConfirmStockAdjust = (e) => {
    e.preventDefault();
    if (!adjustMaterialModal) return;
    updateRawMaterialStock(adjustMaterialModal.id, adjustStockVal);
    setAdjustMaterialModal(null);
  };

  // Si no es el administrador autorizado, denegar acceso
  if (!isAuthorizedAdmin) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '85vh', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '460px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FECACA', padding: '2.25rem 1.75rem', textAlign: 'center', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <ShieldAlert size={26} color="#DC2626" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#991B1B', margin: '0 0 0.5rem 0' }}>
            Acceso Administrativo Exclusivo
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#7F1D1D', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
            Este panel contiene compras de insumos, flujo de caja y control operativo de <strong>DiBorde</strong>. El acceso está reservado exclusivamente para la administración central autorizada.
          </p>

          {currentUser ? (
            <div style={{ fontSize: '0.78rem', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', marginBottom: '1.25rem', border: '1px dashed #FCA5A5' }}>
              Has iniciado sesión como: <strong>{currentUser.email}</strong> (Sin permisos de administración).
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginBottom: '1.25rem' }}>
              Debes iniciar sesión con una cuenta de Google autorizada por DiBorde.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => signInWithGoogle('/admin')}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                borderRadius: '6px',
                padding: '11px 16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Ingresar con Cuenta Administrador</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'var(--color-carbon)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cerrar Sesión Actual
              </button>
            )}

            <a href="#/" style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted)', textDecoration: 'none', marginTop: '6px' }}>
              ← Volver a la tienda web
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* ======================================================== */}
      {/* 1. HEADER ADMINISTRATIVO OSCURO DE ALTO CONTRASTE        */}
      {/* ======================================================== */}
      <header
        style={{
          backgroundColor: 'var(--color-carbon)',
          color: '#FAF8F5',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.25rem 0'
        }}
      >
        <div className="container" style={{ maxWidth: 'var(--container-max, 1140px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="/assets/images/Emblema Rojo Circular con D.png"
                alt="Di Borde"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#E2725B', fontWeight: 700 }}>
                  DI BORDE · CONTROL CENTRAL
                </span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
                  Gestión Operativa del Negocio
                </h1>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <a
                href="#/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FAF8F5',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <span>Ver Tienda Pública</span>
                <ExternalLink size={13} strokeWidth={1.5} />
              </a>

              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#FAF8F5',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={13} strokeWidth={1.5} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BARRA DE MÉTRICAS CLAVE (KPIs HORIZONTALES)           */}
      {/* ======================================================== */}
      <section style={{ padding: '1.75rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: 'var(--container-max, 1140px)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            {/* KPI 1: Balance Caja */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-muted)', fontWeight: 600 }}>
                  Balance Neto en Caja
                </span>
                <DollarSign size={15} strokeWidth={1.5} color="var(--color-success)" />
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, color: balanceNetoCaja >= 0 ? 'var(--color-success)' : '#DC2626' }}>
                ${balanceNetoCaja.toLocaleString('es-AR')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                Ingresos: ${totalIngresos.toLocaleString('es-AR')} · Egresos: ${totalEgresos.toLocaleString('es-AR')}
              </div>
            </div>

            {/* KPI 2: Rendición Pendiente de Vendedores */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-muted)', fontWeight: 600 }}>
                  Rendición en Calle
                </span>
                <Users size={15} strokeWidth={1.5} color="var(--color-primary)" />
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                ${pendingStreetRendition.toLocaleString('es-AR')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                Por cobrar hoy de los vendedores
              </div>
            </div>

            {/* KPI 3: Deuda Total en Calle */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-muted)', fontWeight: 600 }}>
                  Deuda Acumulada
                </span>
                {totalDeudaCalle > 0 && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626' }} title="Hay saldos deudores" />}
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, color: totalDeudaCalle > 0 ? '#DC2626' : 'var(--color-carbon)' }}>
                ${totalDeudaCalle.toLocaleString('es-AR')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                Mercadería o saldo pendiente de rendir
              </div>
            </div>

            {/* KPI 4: Insumos / Alertas */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-muted)', fontWeight: 600 }}>
                  Alertas Insumos / Pedidos
                </span>
                <AlertTriangle size={15} strokeWidth={1.5} color={lowStockMaterials.length > 0 ? '#D97706' : 'var(--color-carbon-subtle)'} />
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, color: lowStockMaterials.length > 0 ? '#D97706' : 'var(--color-carbon)' }}>
                {lowStockMaterials.length} alertas
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                {pendingOrdersCount} pedidos en proceso activo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PESTAÑAS DE NAVEGACIÓN ESTILO LINEAR                  */}
      {/* ======================================================== */}
      <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container" style={{ maxWidth: 'var(--container-max, 1140px)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
            
            <button
              type="button"
              onClick={() => setActiveTab('caja')}
              style={{
                padding: '0.9rem 0.2rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === 'caja' ? 600 : 500,
                color: activeTab === 'caja' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
                border: 'none',
                borderBottom: activeTab === 'caja' ? '2px solid var(--color-carbon)' : '2px solid transparent',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Caja & Finanzas (Ingresos / Egresos)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('insumos')}
              style={{
                padding: '0.9rem 0.2rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === 'insumos' ? 600 : 500,
                color: activeTab === 'insumos' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
                border: 'none',
                borderBottom: activeTab === 'insumos' ? '2px solid var(--color-carbon)' : '2px solid transparent',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Insumos & Compras Recientes
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vendedores')}
              style={{
                padding: '0.9rem 0.2rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === 'vendedores' ? 600 : 500,
                color: activeTab === 'vendedores' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
                border: 'none',
                borderBottom: activeTab === 'vendedores' ? '2px solid var(--color-carbon)' : '2px solid transparent',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Vendedores & Rendiciones
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sugerencias')}
              style={{
                padding: '0.9rem 0.2rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === 'sugerencias' ? 600 : 500,
                color: activeTab === 'sugerencias' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
                border: 'none',
                borderBottom: activeTab === 'sugerencias' ? '2px solid var(--color-carbon)' : '2px solid transparent',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Reportes & Sugerencias ({opsState.resellerNotes.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pedidos')}
              style={{
                padding: '0.9rem 0.2rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === 'pedidos' ? 600 : 500,
                color: activeTab === 'pedidos' ? 'var(--color-carbon)' : 'var(--color-carbon-muted)',
                border: 'none',
                borderBottom: activeTab === 'pedidos' ? '2px solid var(--color-carbon)' : '2px solid transparent',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Pedidos & Ventas ({opsState.orders.length})
            </button>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CONTENIDO PRINCIPAL POR PESTAÑAS                      */}
      {/* ======================================================== */}
      <main className="container" style={{ maxWidth: 'var(--container-max, 1140px)', paddingTop: '2.5rem' }}>
        
        {/* ---------------------------------------------------- */}
        {/* TAB 1: CAJA & FINANZAS                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'caja' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow-kicker">Flujo de Fondos</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                  Ingresos y Egresos de Di Borde
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCashflowModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} strokeWidth={1.5} />
                <span>Registrar Movimiento de Caja</span>
              </button>
            </div>

            {/* Listado de movimientos */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-cream-light)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-carbon-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Fecha</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Tipo</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Categoría</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Concepto / Detalle</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Monto</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '60px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opsState.cashflow.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-carbon-muted)' }}>{tx.date}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              backgroundColor: tx.type === 'ingreso' ? '#F0FDF4' : '#FEF2F2',
                              color: tx.type === 'ingreso' ? '#15803D' : '#DC2626'
                            }}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: 'var(--color-carbon)' }}>{tx.category}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-carbon)' }}>
                          <div>{tx.concept}</div>
                          {tx.reference && <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)' }}>Ref: {tx.reference}</div>}
                        </td>
                        <td className="tabular-nums" style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.92rem', color: tx.type === 'ingreso' ? '#15803D' : '#DC2626' }}>
                          {tx.type === 'ingreso' ? '+' : '-'}${tx.amount.toLocaleString('es-AR')}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => deleteCashflowTransaction(tx.id)}
                            style={{ color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            title="Eliminar movimiento"
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: INSUMOS & COMPRAS RECIENTES                   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'insumos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow-kicker">Materias Primas & Costos</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                  Stock de Insumos y Últimas Compras
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsNewMaterialModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-carbon)',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} strokeWidth={1.5} />
                  <span>+ Nuevo Insumo para Elaborar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FAF8F5',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={15} strokeWidth={1.5} />
                  <span>Cargar Nueva Compra</span>
                </button>
              </div>
            </div>

            {/* Grid de Insumos / Materias Primas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {opsState.rawMaterials.map((mat) => {
                const isLow = mat.currentStock <= mat.minStockAlert;
                return (
                  <div
                    key={mat.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: isLow ? '1px solid #F59E0B' : '1px solid var(--color-border)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                            {mat.name}
                          </h3>
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                            Proveedor: {mat.supplier || 'Proveedor regular'}
                          </div>
                        </div>
                        {isLow ? (
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>
                            Stock bajo
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D', backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: '4px' }}>
                            Disponible
                          </span>
                        )}
                      </div>

                      {/* Stock actual */}
                      <div style={{ margin: '0.85rem 0', padding: '0.75rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-carbon-muted)', letterSpacing: '0.04em' }}>
                          Stock disponible en obrador:
                        </div>
                        <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>
                          {mat.currentStock} <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-carbon-muted)' }}>{mat.unit}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                          Alerta si baja de: {mat.minStockAlert} {mat.unit}
                        </div>
                      </div>

                      {/* Último precio de compra */}
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-carbon)' }}>
                        <div>
                          <strong>Último precio pagado:</strong>{' '}
                          <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                            ${mat.lastPurchasePrice.toLocaleString('es-AR')}
                          </span>{' '}
                          / {mat.unit}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                          Presentación: {mat.lastPurchasePack}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                          Fecha de compra: {mat.lastPurchaseDate}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Seguro que deseas eliminar el insumo "${mat.name}"?`)) {
                            deleteRawMaterial(mat.id);
                          }
                        }}
                        style={{ fontSize: '0.74rem', color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 4px' }}
                        title="Eliminar insumo"
                      >
                        <Trash2 size={12} strokeWidth={1.5} />
                        <span>Eliminar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdjustMaterialModal(mat);
                          setAdjustStockVal(mat.currentStock);
                        }}
                        style={{ fontSize: '0.78rem', color: 'var(--color-carbon)', fontWeight: 500, background: 'none', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Ajustar stock físico
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stock de productos terminados listos */}
            <div style={{ marginBottom: '2.5rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <span className="eyebrow-kicker">Producción Horneada Lista</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0.2rem 0 1rem 0' }}>
                Stock de Pizzetas y Pre-pizzas Terminadas
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Pizzeta con Queso (50g)</div>
                  <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '4px' }}>
                    {opsState.stock['pizzeta-con-queso']} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>unidades</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const add = prompt('¿Cuántas pizzetas horneadas sumás al stock?', '20');
                      if (add) addProductionStock('pizzeta-con-queso', add);
                    }}
                    style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    + Sumar tanda horneada
                  </button>
                </div>

                <div style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Paquete x10 Pre-pizzetas</div>
                  <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '4px' }}>
                    {opsState.stock['paquete-10-prepizzetas']} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>paquetes</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const add = prompt('¿Cuántos paquetes x10 sumás al stock?', '10');
                      if (add) addProductionStock('paquete-10-prepizzetas', add);
                    }}
                    style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    + Sumar paquetes embolsados
                  </button>
                </div>

                <div style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Paquete x2 Grandes (400g c/u)</div>
                  <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '4px' }}>
                    {opsState.stock['paquete-2-prepizzas-grandes']} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>paquetes</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const add = prompt('¿Cuántos paquetes x2 grandes sumás al stock?', '6');
                      if (add) addProductionStock('paquete-2-prepizzas-grandes', add);
                    }}
                    style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    + Sumar paquetes embolsados
                  </button>
                </div>
              </div>
            </div>

            {/* Historial de compras de insumos */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: '0.92rem' }}>
                Historial de Compras de Materias Primas
              </div>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-cream-light)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-carbon-muted)' }}>
                      <th style={{ padding: '0.7rem 1rem' }}>Fecha</th>
                      <th style={{ padding: '0.7rem 1rem' }}>Insumo</th>
                      <th style={{ padding: '0.7rem 1rem' }}>Cantidad</th>
                      <th style={{ padding: '0.7rem 1rem' }}>Precio Unitario</th>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'right' }}>Total Pagado</th>
                      <th style={{ padding: '0.7rem 1rem' }}>Proveedor / Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opsState.purchases.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--color-carbon-muted)' }}>{p.date}</td>
                        <td style={{ padding: '0.7rem 1rem', fontWeight: 600 }}>{p.materialName}</td>
                        <td className="tabular-nums" style={{ padding: '0.7rem 1rem' }}>{p.quantity} {p.unit}</td>
                        <td className="tabular-nums" style={{ padding: '0.7rem 1rem' }}>${p.unitPrice.toLocaleString('es-AR')}</td>
                        <td className="tabular-nums" style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 600, color: '#DC2626' }}>
                          -${p.totalAmount.toLocaleString('es-AR')}
                        </td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--color-carbon-muted)' }}>
                          {p.supplier} {p.notes ? `(${p.notes})` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: VENDEDORES & RENDICIONES                      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'vendedores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow-kicker">Chicos de Calle & Vendedores</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                  Control de Mercadería y Rendición Diaria
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsNewResellerModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-carbon)',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} strokeWidth={1.5} />
                  <span>+ Nuevo Vendedor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--color-carbon)',
                    color: '#FAF8F5',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={15} strokeWidth={1.5} />
                  <span>Asignar Mercadería a Vendedor</span>
                </button>
              </div>
            </div>

            {/* Listado de Vendedores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {opsState.resellers.map((r) => {
                const assigned = r.assigned;
                const pendingRendition = assigned
                  ? Math.max(0, assigned.totalRendicion - (assigned.rendicionCobrada || 0))
                  : 0;
                const isPaid = assigned && assigned.rendicionCobrada >= assigned.totalRendicion;

                return (
                  <div
                    key={r.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      padding: '1.5rem'
                    }}
                  >
                    {/* Header Vendedor */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-carbon)',
                            color: '#FAF8F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.88rem'
                          }}
                        >
                          {r.initials}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                              {r.name}
                            </h3>
                            {/* Estado de Rendición */}
                            {assigned ? (
                              isPaid ? (
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803D', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '4px' }}>
                                  Rendición al día
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 8px', borderRadius: '4px' }}>
                                  Debe rendir (${pendingRendition.toLocaleString('es-AR')})
                                </span>
                              )
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-carbon-muted)', backgroundColor: 'var(--color-cream-light)', padding: '2px 8px', borderRadius: '4px' }}>
                                Sin mercadería activa
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                            Zona: {r.zone} · Tel: {r.phone || 'Sin tel'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '6px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--color-carbon)', backgroundColor: 'var(--color-cream)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                              <span><strong>Google:</strong> {r.email || <span style={{ color: '#DC2626', fontWeight: 600 }}>Sin correo asignado</span>}</span>
                            </div>
                            {r.termsAccepted ? (
                              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803D', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                                Compromiso de rendición: Firmado ({r.termsAcceptedAt ? new Date(r.termsAcceptedAt).toLocaleDateString('es-AR') : 'OK'})
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                                Compromiso: Pendiente de firma
                              </span>
                            )}
                            {r.dni && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)' }}>
                                DNI: {r.dni}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Deuda acumulada */}
                      {r.debtAmount > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#DC2626', fontWeight: 700, letterSpacing: '0.04em' }}>
                            Deuda Acumulada
                          </span>
                          <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#DC2626' }}>
                            ${r.debtAmount.toLocaleString('es-AR')}
                          </div>
                          {r.debtReason && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)' }}>
                              {r.debtReason}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Detalle de Mercadería asignada */}
                    {assigned && (
                      <div
                        style={{
                          backgroundColor: 'var(--color-cream-light)',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          padding: '1rem',
                          marginBottom: '1rem',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', textTransform: 'uppercase' }}>
                            Mercadería asignada ({assigned.assignedDate}):
                          </span>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-carbon)', fontWeight: 600, marginTop: '2px' }}>
                            {assigned.pizzetasQueso > 0 && `${assigned.pizzetasQueso}x Pizzetas (50g) `}
                            {assigned.paquetes10 > 0 && `· ${assigned.paquetes10}x Paq x10 `}
                            {assigned.paquetesGrandes > 0 && `· ${assigned.paquetesGrandes}x Paq x2 Grandes`}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                            PVP total a cobrar en calle: ${assigned.totalPvp.toLocaleString('es-AR')}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', textTransform: 'uppercase' }}>
                            Rendición a Di Borde:
                          </span>
                          <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                            ${assigned.totalRendicion.toLocaleString('es-AR')}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 500 }}>
                            Ganancia neta del chico: +${assigned.gananciaVendedor.toLocaleString('es-AR')}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', textTransform: 'uppercase' }}>
                            Cobrado en Fábrica:
                          </span>
                          <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#15803D' }}>
                            ${assigned.rendicionCobrada.toLocaleString('es-AR')}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: pendingRendition > 0 ? '#DC2626' : '#15803D', fontWeight: 600 }}>
                            {pendingRendition > 0 ? `Resta rendir: $${pendingRendition.toLocaleString('es-AR')}` : 'Rendición completa'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción para el vendedor */}
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {assigned && pendingRendition > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentModal({
                              resellerId: r.id,
                              name: r.name,
                              pending: pendingRendition
                            });
                            setPaymentInputAmount(pendingRendition.toString());
                          }}
                          style={{
                            backgroundColor: '#15803D',
                            color: '#FAF8F5',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Cobrar Rendición (${pendingRendition.toLocaleString('es-AR')})
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setAssignTargetReseller(r.id);
                          setIsAssignModalOpen(true);
                        }}
                        style={{
                          backgroundColor: 'var(--color-carbon)',
                          color: '#FAF8F5',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Asignar Nuevo Lote
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDebtModal({
                            resellerId: r.id,
                            name: r.name,
                            currentDebt: r.debtAmount
                          });
                          setDebtInputAmount(r.debtAmount.toString());
                          setDebtInputReason(r.debtReason || '');
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--color-carbon)',
                          border: '1px solid var(--color-border)',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Gestionar Deuda
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditReseller(r)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: 'var(--color-carbon)',
                          border: '1px solid var(--color-border)',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Edit2 size={12} strokeWidth={1.5} />
                        <span>Editar / Asignar Gmail</span>
                      </button>

                      <a
                        href="#/vendedor"
                        onClick={() => {
                          loginAsReseller(r.id);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--color-carbon-muted)',
                          border: '1px solid var(--color-border)',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title={`Abrir la vista de celular de ${r.name}`}
                      >
                        <span>Ver Portal Móvil</span>
                        <ExternalLink size={12} strokeWidth={1.5} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: SUGERENCIAS Y REPORTES DE VENDEDORES          */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'sugerencias' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow-kicker">Feedback de Calle</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                  Reportes de Venta y Sugerencias de los Vendedores
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} strokeWidth={1.5} />
                <span>Cargar Reporte o Sugerencia</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {opsState.resellerNotes.map((note) => {
                const isPending = note.status === 'pendiente_accion';
                return (
                  <div
                    key={note.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: isPending ? '1px solid #D97706' : '1px solid var(--color-border)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: note.type === 'venta' ? '#F0FDF4' : note.type === 'pedido_cliente' ? '#EFF6FF' : '#FEF3C7',
                            color: note.type === 'venta' ? '#15803D' : note.type === 'pedido_cliente' ? '#2563EB' : '#B45309'
                          }}
                        >
                          {note.type === 'venta' ? 'Reporte Venta' : note.type === 'pedido_cliente' ? 'Pedido Comercio' : 'Sugerencia'}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--color-carbon)' }}>{note.resellerName}</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--color-carbon-subtle)' }}>({note.date})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleResellerNoteStatus(note.id)}
                        style={{
                          fontSize: '0.74rem',
                          color: isPending ? '#B45309' : 'var(--color-carbon-muted)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {isPending ? 'Marcar como Revisado' : 'Reabrir'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--color-carbon)', lineHeight: 1.5, margin: 0 }}>
                      "{note.content}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: PEDIDOS & VENTAS                              */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'pedidos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow-kicker">Atención de Pedidos</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                  Pedidos Realizados y en Proceso
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-carbon)',
                  color: '#FAF8F5',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} strokeWidth={1.5} />
                <span>Cargar Nuevo Pedido</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {opsState.orders.map((order) => {
                const getStatusColor = (s) => {
                  if (s === 'entregado_cobrado') return { bg: '#F0FDF4', color: '#15803D', label: 'Entregado y Cobrado' };
                  if (s === 'en_reparto') return { bg: '#EFF6FF', color: '#2563EB', label: 'En Reparto' };
                  if (s === 'en_elaboracion') return { bg: '#FEF3C7', color: '#B45309', label: 'En Elaboración' };
                  return { bg: '#F3F4F6', color: '#4B5563', label: 'Pendiente' };
                };
                const st = getStatusColor(order.status);

                return (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-carbon-muted)' }}>{order.id}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-carbon-subtle)' }}>({order.date})</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-carbon)', margin: 0 }}>
                        {order.customerName}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                        {order.itemsSummary}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-carbon-subtle)', marginTop: '2px' }}>
                        {order.deliveryType === 'pickup' ? 'Retiro en obrador' : `Envío: ${order.address}`} · Tel: {order.phone}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                        ${order.total.toLocaleString('es-AR')}
                      </div>

                      {/* Selector rápido de estado */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          fontSize: '0.78rem',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                          color: 'var(--color-carbon)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_elaboracion">En Elaboración</option>
                        <option value="en_reparto">En Reparto</option>
                        <option value="entregado_cobrado">Entregado y Cobrado</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 5. MODALES DE GESTIÓN RÁPIDA                             */}
      {/* ======================================================== */}

      {/* Modal: Nuevo Movimiento de Caja */}
      {isCashflowModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Registrar Movimiento de Caja</h3>
              <button onClick={() => setIsCashflowModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateCashflow} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Tipo de movimiento:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setCashflowType('ingreso')} style={{ padding: '0.5rem', borderRadius: '4px', border: cashflowType === 'ingreso' ? '2px solid #15803D' : '1px solid var(--color-border)', backgroundColor: cashflowType === 'ingreso' ? '#F0FDF4' : '#FFF', color: cashflowType === 'ingreso' ? '#15803D' : '#57534E', fontWeight: 600, cursor: 'pointer' }}>Ingreso (+)</button>
                  <button type="button" onClick={() => setCashflowType('egreso')} style={{ padding: '0.5rem', borderRadius: '4px', border: cashflowType === 'egreso' ? '2px solid #DC2626' : '1px solid var(--color-border)', backgroundColor: cashflowType === 'egreso' ? '#FEF2F2' : '#FFF', color: cashflowType === 'egreso' ? '#DC2626' : '#57534E', fontWeight: 600, cursor: 'pointer' }}>Egreso (-)</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Categoría:</label>
                <input type="text" required placeholder="ej: Venta Mayorista, Compra Insumos, Gas, etc." value={cashflowCategory} onChange={(e) => setCashflowCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Concepto / Detalle:</label>
                <input type="text" required placeholder="ej: Cobro pedido almacén / Garrafa de gas" value={cashflowConcept} onChange={(e) => setCashflowConcept(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Monto ($ ARS):</label>
                <input type="number" required min="1" placeholder="ej: 14000" value={cashflowAmount} onChange={(e) => setCashflowAmount(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar en Caja</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cargar Nueva Compra de Insumos */}
      {isPurchaseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '460px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Cargar Compra de Insumos</h3>
              <button onClick={() => setIsPurchaseModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreatePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Materia Prima / Insumo:</label>
                <select value={purchaseMaterialId} onChange={(e) => setPurchaseMaterialId(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  {opsState.rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Cantidad Comprada:</label>
                  <input type="number" required step="0.01" min="0.1" placeholder="ej: 50" value={purchaseQuantity} onChange={(e) => setPurchaseQuantity(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Precio Unitario ($):</label>
                  <input type="number" required step="0.01" min="1" placeholder="ej: 803.38" value={purchaseUnitPrice} onChange={(e) => setPurchaseUnitPrice(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Proveedor:</label>
                <input type="text" placeholder="ej: Lácteos San Juan / Papelera" value={purchaseSupplier} onChange={(e) => setPurchaseSupplier(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Notas (opcional):</label>
                <input type="text" placeholder="ej: 3 hormas cerradas / pack x100" value={purchaseNotes} onChange={(e) => setPurchaseNotes(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-muted)', backgroundColor: 'var(--color-cream-light)', padding: '6px', borderRadius: '4px' }}>
                Nota: Esta compra sumará al stock del insumo y creará automáticamente un egreso en la Caja.
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Compra</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Asignar Mercadería */}
      {isAssignModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Asignar Mercadería a Vendedor</h3>
              <button onClick={() => setIsAssignModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleConfirmAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Vendedor:</label>
                <select value={assignTargetReseller} onChange={(e) => setAssignTargetReseller(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  {opsState.resellers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.zone})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Pizzetas 50g:</label>
                  <input type="number" min="0" value={assignPizzetas} onChange={(e) => setAssignPizzetas(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Paq x10:</label>
                  <input type="number" min="0" value={assignPaquetes10} onChange={(e) => setAssignPaquetes10(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Paq x2 Gdes:</label>
                  <input type="number" min="0" value={assignPaquetesGrandes} onChange={(e) => setAssignPaquetesGrandes(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Turno / Referencia:</label>
                <input type="text" value={assignNote} onChange={(e) => setAssignNote(e.target.value)} placeholder="ej: Turno Mañana / Tarde" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-carbon-muted)', backgroundColor: 'var(--color-cream-light)', padding: '6px', borderRadius: '4px' }}>
                Rendición esperada: ${(assignPizzetas * 400 + assignPaquetes10 * 2000 + assignPaquetesGrandes * 1800).toLocaleString('es-AR')}
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Confirmar Asignación</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cobrar Rendición */}
      {paymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '400px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Registrar Cobro Rendición</h3>
              <button onClick={() => setPaymentModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Vendedor: <strong>{paymentModal.name}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)' }}>
                Rendición pendiente: ${paymentModal.pending.toLocaleString('es-AR')}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Monto a cobrar ($):</label>
                <input type="number" required min="1" max={paymentModal.pending} value={paymentInputAmount} onChange={(e) => setPaymentInputAmount(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: '#15803D', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Confirmar Cobro en Caja</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestionar Deuda */}
      {debtModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '400px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Gestionar Deuda de Vendedor</h3>
              <button onClick={() => setDebtModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleConfirmDebt} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Vendedor: <strong>{debtModal.name}</strong>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Nuevo Saldo Deudor ($ 0 para saldar):</label>
                <input type="number" min="0" value={debtInputAmount} onChange={(e) => setDebtInputAmount(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Motivo / Detalle:</label>
                <input type="text" placeholder="ej: Mercadería consumida sin rendir" value={debtInputReason} onChange={(e) => setDebtInputReason(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Deuda</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajustar Stock Físico Insumo */}
      {adjustMaterialModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '380px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0 }}>Ajustar Stock Físico</h3>
              <button onClick={() => setAdjustMaterialModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleConfirmStockAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Insumo: <strong>{adjustMaterialModal.name}</strong>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Cantidad física real ({adjustMaterialModal.unit}):</label>
                <input type="number" required step="0.01" min="0" value={adjustStockVal} onChange={(e) => setAdjustStockVal(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Actualizar Stock</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cargar Nota / Sugerencia */}
      {isNoteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Nuevo Reporte o Sugerencia</h3>
              <button onClick={() => setIsNoteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Vendedor que reporta:</label>
                <select value={noteResellerId} onChange={(e) => setNoteResellerId(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  {opsState.resellers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Tipo de reporte:</label>
                <select value={noteType} onChange={(e) => setNoteType(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <option value="venta">Reporte de venta (ej: vendí todo en tal plaza)</option>
                  <option value="sugerencia">Sugerencia (ej: agregar orégano, cambiar horario)</option>
                  <option value="pedido_cliente">Pedido pedido por un comercio o cliente</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Detalle del mensaje:</label>
                <textarea required rows={3} placeholder="Escribí lo que informó el vendedor..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Nota</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cargar Pedido */}
      {isOrderModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Cargar Nuevo Pedido</h3>
              <button onClick={() => setIsOrderModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Cliente o Comercio:</label>
                <input type="text" required placeholder="ej: Almacén Moreno / Juan Pérez" value={orderCustomer} onChange={(e) => setOrderCustomer(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Teléfono:</label>
                  <input type="text" placeholder="ej: 264 123-4567" value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Total ($):</label>
                  <input type="number" required min="1" placeholder="ej: 7000" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Variedades / Detalle:</label>
                <input type="text" required placeholder="ej: 3x Paquete x10 Pre-pizzetas" value={orderItems} onChange={(e) => setOrderItems(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Dirección de Entrega:</label>
                <input type="text" placeholder="ej: Mendoza 840 Sur / Retiro en obrador" value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Pedido</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Insumo para Elaborar */}
      {isNewMaterialModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Nuevo Insumo para Elaborar</h3>
              <button onClick={() => setIsNewMaterialModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateNewMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Nombre del Insumo / Materia Prima:</label>
                <input type="text" required placeholder="ej: Orégano Seleccionado / Harina 000" value={newMatName} onChange={(e) => setNewMatName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Categoría:</label>
                  <input type="text" placeholder="ej: Condimento / Insumo" value={newMatCategory} onChange={(e) => setNewMatCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Unidad de Medida:</label>
                  <select value={newMatUnit} onChange={(e) => setNewMatUnit(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <option value="kg">kg (Kilogramos)</option>
                    <option value="sachet">sachet</option>
                    <option value="litro">litro</option>
                    <option value="unid.">unid. (Unidades)</option>
                    <option value="paquete">paquete</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Stock Físico Inicial:</label>
                  <input type="number" step="0.01" min="0" placeholder="ej: 10" value={newMatStock} onChange={(e) => setNewMatStock(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Alerta Stock Mínimo:</label>
                  <input type="number" step="0.01" min="0" placeholder="ej: 5" value={newMatMinAlert} onChange={(e) => setNewMatMinAlert(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Último Precio Unit. ($):</label>
                  <input type="number" step="0.01" min="0" placeholder="ej: 1200" value={newMatPrice} onChange={(e) => setNewMatPrice(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Proveedor:</label>
                  <input type="text" placeholder="ej: Distribuidora Central" value={newMatSupplier} onChange={(e) => setNewMatSupplier(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Insumo</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Vendedor */}
      {isNewResellerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Registrar Nuevo Vendedor</h3>
              <button onClick={() => setIsNewResellerModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateNewReseller} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Nombre y Apellido del Vendedor:</label>
                <input type="text" required placeholder="ej: Joaquín Pereyra" value={newResellerName} onChange={(e) => setNewResellerName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#B91C1C', marginBottom: '4px' }}>
                  Correo de Google (Gmail) para Acceso al Portal (*):
                </label>
                <input
                  type="email"
                  required
                  placeholder="ej: joaquin.vendedor@gmail.com"
                  value={newResellerEmail}
                  onChange={(e) => setNewResellerEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                  El vendedor ingresará a <code>/#/vendedor</code> con esta cuenta de Google.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Teléfono / WhatsApp:</label>
                  <input type="text" placeholder="ej: 264 555-0199" value={newResellerPhone} onChange={(e) => setNewResellerPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Zona Habitual:</label>
                  <input type="text" placeholder="ej: Plaza Chimbas" value={newResellerZone} onChange={(e) => setNewResellerZone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar y Habilitar Vendedor</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Vendedor / Asignar Correo de Google */}
      {editingReseller && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '440px', width: '100%', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>Editar Datos de Vendedor</h3>
              <button onClick={() => setEditingReseller(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveEditReseller} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Nombre y Apellido:</label>
                <input type="text" required value={editResellerName} onChange={(e) => setEditResellerName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                  Correo de Google (Gmail) para Acceso al Portal:
                </label>
                <input
                  type="email"
                  required
                  placeholder="ej: vendedor@gmail.com"
                  value={editResellerEmail}
                  onChange={(e) => setEditResellerEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FAF8F5' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>
                  Quien no tenga su correo registrado aquí no podrá ingresar al panel de vendedores.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Teléfono / WhatsApp:</label>
                  <input type="text" value={editResellerPhone} onChange={(e) => setEditResellerPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Zona de Venta:</label>
                  <input type="text" value={editResellerZone} onChange={(e) => setEditResellerZone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>Estado de la Cuenta:</label>
                <select value={editResellerStatus} onChange={(e) => setEditResellerStatus(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <option value="activo">Activo (Puede ingresar al portal)</option>
                  <option value="inactivo">Inactivo / Pausado (Acceso bloqueado)</option>
                </select>
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: '6px', backgroundColor: 'var(--color-carbon)', color: '#FAF8F5', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
