import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  AlertTriangle,
  Package,
  MessageCircle,
  LogOut,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Send,
  MapPin,
  HelpCircle,
  ExternalLink,
  UserCheck,
  Shield,
  ShieldAlert,
  FileText,
  Phone,
  AlertCircle
} from 'lucide-react';

export default function ResellerDashboard() {
  const {
    currentUser,
    opsState,
    logout,
    submitResellerReport,
    submitResellerCommitment,
    signInWithGoogle
  } = useAuth();

  // Estado para el formulario de compromiso inicial
  const [formDni, setFormDni] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmergency, setFormEmergency] = useState('');
  const [checkTruth, setCheckTruth] = useState(false);
  const [checkMora, setCheckMora] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [commitmentError, setCommitmentError] = useState('');
  const [commitmentSubmitting, setCommitmentSubmitting] = useState(false);

  // Vendedor activo según el usuario autenticado
  const [selectedAdminPreviewId, setSelectedAdminPreviewId] = useState(
    opsState.resellers[0]?.id || 'rev-lucas'
  );

  // CASO 1: NO INICIÓ SESIÓN
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '85vh', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '2rem 1.75rem', textAlign: 'center', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <Shield size={20} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-carbon)', margin: '0 0 0.5rem 0' }}>
            Portal de Vendedores Di Borde
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.45 }}>
            Debes iniciar sesión con tu cuenta de Google autorizada por Cristian para acceder a tu stock asignado, rendición y comisiones.
          </p>

          <button
            type="button"
            onClick={() => signInWithGoogle('/vendedor')}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-carbon)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '6px',
              padding: '11px 16px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Ingresar con Google</span>
          </button>

          <div style={{ marginTop: '1.25rem' }}>
            <a href="#/" style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', textDecoration: 'none' }}>
              ← Volver a la tienda pública
            </a>
          </div>
        </div>
      </div>
    );
  }

  // CASO 2: CUENTA DE GOOGLE NO AUTORIZADA
  if (currentUser.role === 'unauthorized') {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '85vh', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FECACA', padding: '2rem 1.75rem', textAlign: 'center' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <ShieldAlert size={22} color="#DC2626" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#991B1B', margin: '0 0 0.5rem 0' }}>
            Acceso no Autorizado
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#7F1D1D', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
            Iniciaste sesión con <strong>{currentUser.email}</strong>, pero este correo no se encuentra registrado como vendedor en la nómina oficial de Di Borde.
          </p>
          <div style={{ fontSize: '0.76rem', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', marginBottom: '1.5rem', border: '1px dashed #FCA5A5' }}>
            Quien no esté agregado en el panel administrativo no puede acceder al panel de vendedores.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a
              href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                `Hola Cristian, quiero registrarme como vendedor en Di Borde. Mi correo de Google es: ${currentUser.email}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#15803D',
                color: '#FAF8F5',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} strokeWidth={1.5} />
              <span>Solicitar alta a Cristian por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: 'transparent',
                color: 'var(--color-carbon)',
                border: '1px solid var(--color-border)',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span>Cerrar sesión e ingresar con otra cuenta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Identificar el vendedor según el rol
  let activeReseller = null;
  if (currentUser.role === 'admin') {
    activeReseller = opsState.resellers.find((r) => r.id === selectedAdminPreviewId) || opsState.resellers[0];
  } else if (currentUser.role === 'reseller') {
    activeReseller = opsState.resellers.find((r) => r.id === currentUser.resellerId);
  }

  if (!activeReseller) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: 'var(--color-cream)', minHeight: '80vh' }}>
        <p>No se encontró el perfil de vendedor asociado a tu cuenta.</p>
        <button onClick={logout} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
      </div>
    );
  }

  // CASO 3: VENDEDOR REGISTRADO QUE AÚN NO FIRMÓ EL COMPROMISO
  const needsCommitment = currentUser.role === 'reseller' && (!activeReseller.termsAccepted || !currentUser.termsAccepted);

  const handleCommitmentSubmit = async (e) => {
    e.preventDefault();
    setCommitmentError('');

    if (!checkTruth || !checkMora) {
      setCommitmentError('Debes aceptar y marcar ambas declaraciones obligatorias para continuar.');
      return;
    }

    if (!formDni.trim() || !formAddress.trim() || !formEmergency.trim()) {
      setCommitmentError('Por favor completa tu DNI, Domicilio real y Contacto de emergencia.');
      return;
    }

    if (!signatureText.trim()) {
      setCommitmentError('Por favor escribe tu Nombre y DNI en el campo de firma digital.');
      return;
    }

    setCommitmentSubmitting(true);
    try {
      await submitResellerCommitment({
        resellerId: activeReseller.id,
        dni: formDni,
        phone: formPhone || activeReseller.phone,
        address: formAddress,
        emergencyContact: formEmergency
      });
    } catch (err) {
      console.error(err);
      setCommitmentError('Error al guardar el compromiso. Intenta nuevamente.');
    } finally {
      setCommitmentSubmitting(false);
    }
  };

  if (needsCommitment) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '90vh', padding: '2.5rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '640px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '2rem 1.75rem', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <FileText size={13} strokeWidth={1.5} />
            <span>Declaración Jurada y Compromiso Comercial</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-carbon)', margin: '0 0 0.35rem 0' }}>
            Alta y Habilitación de Vendedor
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.45 }}>
            Bienvenido <strong>{activeReseller.name}</strong>. Para habilitar tu cuenta y comenzar a retirar mercadería, debes completar tus datos de identidad y suscribir el compromiso de rendición obligatoria en tiempo y forma.
          </p>

          {commitmentError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <AlertCircle size={15} strokeWidth={1.5} />
              <span>{commitmentError}</span>
            </div>
          )}

          <form onSubmit={handleCommitmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Datos Personales */}
            <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon)', margin: '0 0 0.85rem 0' }}>
                1. Datos Personales y de Contacto
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                    Correo Google (Habilitado):
                  </label>
                  <input
                    type="email"
                    disabled
                    value={activeReseller.email || currentUser.email}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#E7E5E4', color: '#57534E', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                    DNI / CUIL (* Obligatorio):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: 38.456.789"
                    value={formDni}
                    onChange={(e) => setFormDni(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                    Teléfono Personal / WhatsApp:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: 264 512-3456"
                    value={formPhone || activeReseller.phone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                    Contacto de Emergencia / Familiar (* Nombre y Teléfono):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Madre / Hermano: 264 411-2233"
                    value={formEmergency}
                    onChange={(e) => setFormEmergency(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                  Domicilio Real Completo (* Calle, N°, Barrio, Localidad):
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Mendoza 1250 Norte, Barrio Parque, Chimbas, San Juan"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* Cláusulas y Términos Formales */}
            <div style={{ backgroundColor: '#FAF8F5', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon)', margin: '0 0 0.65rem 0' }}>
                2. Cláusulas de Custodia, Rendición e Intereses por Mora
              </h3>

              <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '6px' }}>
                <p style={{ margin: 0 }}>
                  <strong>A. Mercadería Consignada:</strong> Toda la mercadería entregada (Pizzetas individuales de 50 gramos elaboradas con queso cremoso y pre-pizzas artesanales de 400 gramos) permanece bajo la exclusiva guarda y responsabilidad patrimonial del vendedor.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>B. Rendición en Tiempo y Forma:</strong> El dinero cobrado en concepto de venta al público pertenece legítimamente a Di Borde y debe rendirse en su totalidad al finalizar el turno o jornada acordada.
                </p>
                <p style={{ margin: 0, color: '#B91C1C' }}>
                  <strong>C. Aplicación de Intereses por Mora:</strong> Cualquier demora injustificada, retención indebida o saldo impago de mercadería retirada <u>generará el devengo inmediato de intereses punitorios y compensatorios diarios por mora</u> sobre el saldo insoluto hasta su cancelación definitiva.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>D. Responsabilidad Civil:</strong> En caso de pérdidas, extravíos o roturas negligentes, el vendedor se compromete a abonar el valor correspondiente estipulado en la lista de rendición oficial.
                </p>
              </div>
            </div>

            {/* Checkboxes de Aceptación */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--color-carbon)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={checkTruth}
                  onChange={(e) => setCheckTruth(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  Declaro bajo juramento que los datos personales, domicilio real y contactos suministrados son verídicos y exactos.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#991B1B', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={checkMora}
                  onChange={(e) => setCheckMora(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  Me comprometo expresamente a rendir siempre el dinero en tiempo y forma, asumiendo conocimiento de que cualquier retraso genera intereses por mora.
                </span>
              </label>
            </div>

            {/* Firma Digital */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted)', marginBottom: '4px' }}>
                Firma Digital de Conformidad (Escribe tu Nombre Completo y DNI):
              </label>
              <input
                type="text"
                required
                placeholder={`ej: ${activeReseller.name} - DNI ${formDni || '38456789'}`}
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.86rem', fontFamily: 'monospace' }}
              />
            </div>

            <button
              type="submit"
              disabled={commitmentSubmitting}
              style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: 'none',
                cursor: commitmentSubmitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} strokeWidth={1.5} color="#4ADE80" />
              <span>{commitmentSubmitting ? 'Firmando y habilitando cuenta...' : 'Firmar Compromiso y Acceder al Portal'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSubmitSalesReport = (e) => {
    e.preventDefault();
    const pz = parseInt(salesPizzetas) || 0;
    const p10 = parseInt(salesPaquetes10) || 0;
    const pG = parseInt(salesPaquetesGrandes) || 0;

    submitResellerReport({
      resellerId: activeReseller.id,
      resellerName: activeReseller.name,
      type: 'venta',
      salesDetails: {
        pizzetasSold: pz,
        paquetes10Sold: p10,
        paquetesGrandesSold: pG,
        location: salesLocation,
        notes: salesNotes
      }
    });

    setSalesReportSuccess(true);
    setSalesPizzetas('');
    setSalesPaquetes10('');
    setSalesPaquetesGrandes('');
    setSalesNotes('');
    setTimeout(() => setSalesReportSuccess(false), 5000);
  };

  const handleSubmitSuggestion = (e) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    submitResellerReport({
      resellerId: activeReseller.id,
      resellerName: activeReseller.name,
      type: suggestionType,
      content: suggestionText
    });

    setSuggestionSuccess(true);
    setSuggestionText('');
    setTimeout(() => setSuggestionSuccess(false), 5000);
  };

  const handleNotifyWhatsApp = () => {
    let msg = `REPORTE DE JORNADA - VENDEDOR DI BORDE\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Vendedor: ${activeReseller.name}\n`;
    msg += `Zona: ${activeReseller.zone}\n\n`;

    if (assignment) {
      msg += `Mercadería asignada:\n`;
      if (assignment.pizzetasQueso) msg += `• ${assignment.pizzetasQueso}x Pizzetas con Queso (PVP $800 · Rendición $400)\n`;
      if (assignment.paquetes10) msg += `• ${assignment.paquetes10}x Paquetes x10 Pre-pizzetas (PVP $2.400 · Rendición $2.000)\n`;
      if (assignment.paquetesGrandes) msg += `• ${assignment.paquetesGrandes}x Paquetes x2 Grandes 400g (PVP $2.600 · Rendición $1.800)\n`;
      msg += `\nTotal a rendir: $${totalRendicion.toLocaleString('es-AR')}\n`;
      msg += `Rendido hasta ahora: $${rendicionCobrada.toLocaleString('es-AR')}\n`;
      msg += `Saldo por rendir hoy: $${saldoPendienteRendicion.toLocaleString('es-AR')}\n`;
      msg += `Mi ganancia estimada: $${gananciaVendedor.toLocaleString('es-AR')}\n`;
    }

    if (hasDebt) {
      msg += `\nSaldo pendiente anterior registrado: $${activeReseller.debtAmount.toLocaleString('es-AR')}\n`;
    }

    msg += `\nHola Cristian, te paso mi reporte para coordinar en el obrador.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', padding: '1.75rem 1rem 6rem 1rem' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* ======================================================== */}
        {/* 1. HEADER DEL VENDEDOR                                   */}
        {/* ======================================================== */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon)',
            color: '#FAF8F5',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#FAF8F5',
                  letterSpacing: '0.04em'
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontSize: '0.66rem', color: '#E2725B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  PORTAL DE VENDEDOR · DI BORDE
                </div>
                <h1 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, margin: '2px 0 0 0', lineHeight: 1.2 }}>
                  {activeReseller.name}
                </h1>
                <div style={{ fontSize: '0.74rem', color: '#A8A29E', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} strokeWidth={1.5} color="#E2725B" />
                  <span>Zona: {activeReseller.zone}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <a
                href="#/"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FAF8F5',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Tienda</span>
                <ExternalLink size={11} strokeWidth={1.5} />
              </a>

              <button
                type="button"
                onClick={logout}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FAF8F5',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={12} strokeWidth={1.5} />
                <span>Salir</span>
              </button>
            </div>
          </div>

          {/* Selector de vendedor SOLO visible para el Administrador Cristian */}
          {currentUser.role === 'admin' ? (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#FCD34D', fontWeight: 600 }}>
                Modo Administrador (Cristian): Previsualizar vendedor:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={activeReseller.id}
                  onChange={(e) => setSelectedAdminPreviewId(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#FAF8F5',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.74rem',
                    cursor: 'pointer'
                  }}
                >
                  {opsState.resellers.map((r) => (
                    <option key={r.id} value={r.id} style={{ backgroundColor: 'var(--color-carbon)', color: '#fff' }}>
                      {r.name} ({r.zone})
                    </option>
                  ))}
                </select>
                <a href="#/admin" style={{ fontSize: '0.72rem', color: '#E2725B', textDecoration: 'none', fontWeight: 600 }}>
                  Volver al Panel Admin →
                </a>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#4ADE80' }}>
                <CheckCircle2 size={13} strokeWidth={1.5} />
                <span>Compromiso de rendición en término: <strong>Activo y Verificado</strong></span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#A8A29E' }}>
                DNI: {activeReseller.dni || 'Registrado'}
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. ALERTA DE DEUDA HISTÓRICA O CUENTA REGULARIZADA       */}
        {/* ======================================================== */}
        {hasDebt ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DC2626' }}>
                  Saldo Deudor Pendiente
                </span>
              </div>
              <AlertTriangle size={15} strokeWidth={1.5} color="#DC2626" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted)' }}>
                Total adeudado al obrador:
              </span>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.65rem', fontWeight: 600, color: '#DC2626' }}>
                -${activeReseller.debtAmount.toLocaleString('es-AR')}
              </span>
            </div>

            <div
              style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #FEE2E2',
                fontSize: '0.78rem',
                color: 'var(--color-carbon-muted)',
                lineHeight: 1.45
              }}
            >
              <strong style={{ color: 'var(--color-carbon)' }}>Motivo registrado por Cristian:</strong>{' '}
              {activeReseller.debtReason || 'Saldo pendiente de rendición'}.
              <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '6px', backgroundColor: '#FEF2F2', padding: '6px 10px', borderRadius: '4px', border: '1px solid #FECACA' }}>
                <strong>Aviso de Compromiso:</strong> Recuerda que según el compromiso comercial firmado, las demoras injustificadas en saldar la deuda generan intereses punitorios por mora. Coordina tu rendición a la brevedad.
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} strokeWidth={1.5} color="#15803D" />
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#15803D' }}>
              Cuenta al día. No tenés deudas registradas con el obrador.
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. MERCADERÍA ASIGNADA PARA HOY                          */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1.4rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span className="eyebrow-kicker">MERCADERÍA EN MANO</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0.1rem 0 0 0' }}>
                Stock Asignado para la Calle
              </h2>
            </div>
            <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted)', backgroundColor: 'var(--color-cream)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              {assignment?.assignedDate || 'Turno activo'}
            </span>
          </div>

          {assignment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Pizzetas */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Pizzetas con Queso Cremoso (50g)
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                    {assignment.pizzetasQueso || 0} unid.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP Calle: <strong>$800</strong></span>
                  <span>Rendís: <strong>$400</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Tu ganancia: +$400 c/u</span>
                </div>
              </div>

              {/* Paquetes x10 */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Paquetes x10 Pre-pizzetas
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                    {assignment.paquetes10 || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP Calle: <strong>$2.400</strong></span>
                  <span>Rendís: <strong>$2.000</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Tu ganancia: +$400/paq</span>
                </div>
              </div>

              {/* Paquetes x2 Grandes */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-carbon)' }}>
                    Paquetes x2 Pre-pizzas Grandes (400g c/u)
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon)' }}>
                    {assignment.paquetesGrandes || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-carbon-muted)' }}>
                  <span>PVP Calle: <strong>$2.600</strong></span>
                  <span>Rendís: <strong>$1.800</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Tu ganancia: +$800/paq</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted)', margin: '0.5rem 0' }}>
              No tenés mercadería asignada para esta jornada. Pedile a Cristian en el obrador que te cargue una tanda.
            </p>
          )}
        </section>

        {/* ======================================================== */}
        {/* 4. LIQUIDACIÓN & RENDICIÓN (¿CUÁNTO TENGO QUE RENDIR?)   */}
        {/* ======================================================== */}
        {assignment && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '1.4rem',
              border: '1px solid var(--color-border)',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="eyebrow-kicker">CUENTAS CLARAS</span>
              {saldoPendienteRendicion === 0 ? (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                  Rendición al día
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                  Debe rendir ${saldoPendienteRendicion.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 1rem 0' }}>
              Liquidación Estimada de la Jornada
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>Total recaudado en calle (PVP):</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>${assignment.totalPvp.toLocaleString('es-AR')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted)' }}>Total a rendir a Di Borde:</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>
                  ${totalRendicion.toLocaleString('es-AR')}
                </span>
              </div>

              {rendicionCobrada > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D' }}>
                  <span>Ya rendido en el obrador:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>-${rendicionCobrada.toLocaleString('es-AR')}</span>
                </div>
              )}

              <div
                style={{
                  marginTop: '0.4rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-carbon-muted)', letterSpacing: '0.04em' }}>
                    Por entregar hoy:
                  </div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: saldoPendienteRendicion > 0 ? 'var(--color-primary)' : '#15803D' }}>
                    ${saldoPendienteRendicion.toLocaleString('es-AR')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#15803D', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Tu Ganancia Neta:
                  </div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: '#15803D' }}>
                    +${gananciaVendedor.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. FORMULARIO: "¿CUÁNTO VENDISTE HOY?"                   */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1.4rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
            <TrendingUp size={15} strokeWidth={1.5} color="var(--color-primary)" />
            <span className="eyebrow-kicker" style={{ margin: 0 }}>REGISTRO DE VENTA</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 0.5rem 0' }}>
            Informar Ventas de la Jornada
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.25rem 0' }}>
            Cargá cuántas unidades vendiste y en qué lugar. Cristian lo recibe al instante en el panel central.
          </p>

          {salesReportSuccess && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={16} strokeWidth={1.5} />
              <span>¡Reporte de ventas enviado exitosamente a Cristian!</span>
            </div>
          )}

          <form onSubmit={handleSubmitSalesReport} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                  Pizzetas vendidas:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.pizzetasQueso || 99}
                  placeholder="ej: 15"
                  value={salesPizzetas}
                  onChange={(e) => setSalesPizzetas(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                  Paq. x10 vendidos:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.paquetes10 || 99}
                  placeholder="ej: 4"
                  value={salesPaquetes10}
                  onChange={(e) => setSalesPaquetes10(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                  Paq. x2 grandes:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.paquetesGrandes || 99}
                  placeholder="ej: 2"
                  value={salesPaquetesGrandes}
                  onChange={(e) => setSalesPaquetesGrandes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                Zona o plaza donde vendiste:
              </label>
              <input
                type="text"
                placeholder="ej: Plaza de Chimbas / Parque de Mayo / Almacenes calle Mendoza"
                value={salesLocation}
                onChange={(e) => setSalesLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                Observaciones (mercadería sobrante, horario, etc.):
              </label>
              <input
                type="text"
                placeholder="ej: Me sobraron 3 pizzetas que llevo al obrador"
                value={salesNotes}
                onChange={(e) => setSalesNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream)'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Send size={14} strokeWidth={1.5} />
              <span>Enviar Reporte de Ventas al Panel Central</span>
            </button>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 6. FORMULARIO: SUGERENCIAS & PEDIDOS DE CLIENTES         */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1.4rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
            <HelpCircle size={15} strokeWidth={1.5} color="var(--color-primary)" />
            <span className="eyebrow-kicker" style={{ margin: 0 }}>SUGERENCIAS & PEDIDOS</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 0.5rem 0' }}>
            ¿Tenés alguna sugerencia o pedido de un cliente?
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted)', margin: '0 0 1.25rem 0' }}>
            Anotá comentarios de clientes, pedidos de almacenes o ideas de mejora para el producto.
          </p>

          {suggestionSuccess && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={16} strokeWidth={1.5} />
              <span>¡Mensaje guardado para Cristian!</span>
            </div>
          )}

          <form onSubmit={handleSubmitSuggestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                Tipo de mensaje:
              </label>
              <select
                value={suggestionType}
                onChange={(e) => setSuggestionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream)'
                }}
              >
                <option value="sugerencia">Sugerencia (ej: agregar orégano, cambiar horario)</option>
                <option value="pedido_cliente">Pedido de un cliente o comercio (ej: 5 paquetes para el viernes)</option>
                <option value="consulta">Consulta o aviso sobre la zona de venta</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
                Detalle del mensaje:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Escribí acá tu sugerencia o el pedido del cliente con nombre y dirección..."
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream)',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Send size={14} strokeWidth={1.5} />
              <span>Enviar Nota a Cristian</span>
            </button>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 7. HISTORIAL DE MENSAJES Y NOTAS ENVIADAS                */}
        {/* ======================================================== */}
        {myNotes.length > 0 && (
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '1.4rem',
              border: '1px solid var(--color-border)',
              marginBottom: '1.25rem'
            }}
          >
            <span className="eyebrow-kicker">HISTORIAL RECIENTE</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon)', margin: '0 0 1rem 0' }}>
              Tus Reportes y Sugerencias Enviadas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {myNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: '6px',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-carbon-muted)' }}>
                      {note.type === 'venta' ? 'Reporte de Venta' : note.type === 'pedido_cliente' ? 'Pedido Cliente' : 'Sugerencia'}
                    </span>
                    {note.status === 'leido' ? (
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                        Visto por Cristian
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>
                        Enviado al panel central
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-carbon)', lineHeight: 1.45 }}>
                    {note.content}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-carbon-subtle)', marginTop: '4px' }}>
                    {note.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 8. BOTÓN WHATSAPP DIRECTO CON CRISTIAN                  */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleNotifyWhatsApp}
            style={{
              width: '100%',
              backgroundColor: '#15803D',
              color: '#FAF8F5',
              border: 'none',
              borderRadius: '6px',
              padding: '0.9rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <MessageCircle size={17} strokeWidth={1.5} color="#FFFFFF" />
            <span>Avisar Rendición por WhatsApp a Cristian</span>
          </button>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--color-carbon-subtle)', lineHeight: 1.5 }}>
          <div>Obrador Di Borde · Chimbas, San Juan</div>
          <div>Preparado para sincronización en Supabase y login con Google</div>
        </div>

      </div>
    </div>
  );
}
