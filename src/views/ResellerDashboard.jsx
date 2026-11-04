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
  AlertCircle,
  Store,
  DollarSign
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

  // --------------------------------------------------------------------------
  // REGLA DE REACT: TODOS LOS HOOKS ARRIBA SIN CONDICIONES PREVIAS
  // --------------------------------------------------------------------------

  // Selector de previsualización para el Administrador
  const [selectedAdminPreviewId, setSelectedAdminPreviewId] = useState(
    opsState.resellers?.[0]?.id || ''
  );

  // Estados para reporte de ventas
  const [salesPizzetas, setSalesPizzetas] = useState('');
  const [salesPaquetes10, setSalesPaquetes10] = useState('');
  const [salesPaquetesGrandes, setSalesPaquetesGrandes] = useState('');
  const [salesLocation, setSalesLocation] = useState('');
  const [salesNotes, setSalesNotes] = useState('');
  const [salesReportSuccess, setSalesReportSuccess] = useState(false);

  // Estados para sugerencias y pedidos de clientes
  const [suggestionType, setSuggestionType] = useState('sugerencia');
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);

  // Estados para compromiso / firma digital inicial
  const [formDni, setFormDni] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmergency, setFormEmergency] = useState('');
  const [checkTruth, setCheckTruth] = useState(false);
  const [checkMora, setCheckMora] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [commitmentError, setCommitmentError] = useState('');
  const [commitmentSubmitting, setCommitmentSubmitting] = useState(false);

  // --------------------------------------------------------------------------
  // CASO 1: NO INICIÓ SESIÓN
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '85vh', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid var(--color-border, #E7E5E4)', padding: '2rem 1.75rem', textAlign: 'center', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-cream-light, #FAF8F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', border: '1px solid var(--color-border, #E7E5E4)' }}>
            <Shield size={20} color="var(--color-primary, #C83820)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.35rem', color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.5rem 0' }}>
            Portal de Vendedores Di Borde
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1.5rem 0', lineHeight: 1.45 }}>
            Debes iniciar sesión con tu cuenta registrada o de Google para acceder a tu stock asignado, rendición y ganancias.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a
              href="#/portal"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon, #1C1917)',
                color: '#FAF8F5',
                borderRadius: '6px',
                padding: '11px 16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <UserCheck size={16} strokeWidth={1.5} />
              <span>Ir al Inicio de Sesión</span>
            </a>

            <button
              type="button"
              onClick={() => signInWithGoogle('/vendedor')}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-carbon, #1C1917)',
                border: '1.5px solid var(--color-border, #E7E5E4)',
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
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Ingresar con Google</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <a href="#/" style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', textDecoration: 'none' }}>
              ← Volver a la tienda pública
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // CASO 2: CUENTA NO AUTORIZADA
  // --------------------------------------------------------------------------
  if (currentUser.role === 'unauthorized') {
    return (
      <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '85vh', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #FECACA', padding: '2rem 1.75rem', textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <ShieldAlert size={22} color="#DC2626" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.35rem', color: '#991B1B', margin: '0 0 0.5rem 0' }}>
            Acceso no Registrado
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#7F1D1D', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
            Iniciaste sesión como <strong>{currentUser.email}</strong>, pero esta cuenta no está dada de alta en la nómina oficial de Di Borde.
          </p>
          <div style={{ fontSize: '0.76rem', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', marginBottom: '1.5rem', border: '1px dashed #FCA5A5' }}>
            Comunícate con la administración para que habiliten tu perfil de vendedor.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a
              href={`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                `Hola DiBorde, quiero registrarme como vendedor oficial. Mi usuario/correo es: ${currentUser.email}`
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
              <span>Solicitar alta a DiBorde por WhatsApp</span>
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
                color: 'var(--color-carbon, #1C1917)',
                border: '1px solid var(--color-border, #E7E5E4)',
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

  // --------------------------------------------------------------------------
  // IDENTIFICAR EL VENDEDOR ACTIVO
  // --------------------------------------------------------------------------
  let activeReseller = null;
  if (currentUser.role === 'admin') {
    activeReseller =
      opsState.resellers.find((r) => r.id === selectedAdminPreviewId) ||
      opsState.resellers[0] ||
      null;
  } else if (currentUser.role === 'reseller') {
    activeReseller =
      opsState.resellers.find((r) => r.id === currentUser.resellerId) ||
      opsState.resellers.find(
        (r) =>
          r.email &&
          currentUser.email &&
          r.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
      ) ||
      currentUser.reseller ||
      null;
  }

  // Si no hay ningún vendedor registrado en el sistema
  if (!activeReseller) {
    return (
      <div style={{ padding: '3.5rem 1rem', textAlign: 'center', backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '10px', border: '1px solid var(--color-border, #E7E5E4)' }}>
          <Package size={36} color="var(--color-carbon-muted, #78716C)" style={{ margin: '0 auto 0.75rem auto' }} strokeWidth={1.5} />
          <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.5rem 0' }}>
            Sin vendedores registrados
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1.25rem 0' }}>
            Aún no hay vendedores cargados en la nómina. Si eres el administrador, puedes crear uno desde el panel central.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentUser.role === 'admin' && (
              <a href="#/admin" style={{ backgroundColor: 'var(--color-carbon, #1C1917)', color: '#FAF8F5', padding: '9px', borderRadius: '6px', fontSize: '0.84rem', textDecoration: 'none', fontWeight: 600 }}>
                Ir a Gestión Admin →
              </a>
            )}
            <button onClick={logout} style={{ color: 'var(--color-primary, #C83820)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', padding: '6px' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // CÁLCULOS Y PROPIEDADES DEL VENDEDOR ACTIVO
  // --------------------------------------------------------------------------
  const initials = activeReseller.initials || activeReseller.name?.slice(0, 2).toUpperCase() || 'VR';
  const assignment = activeReseller.assigned || null;
  const totalRendicion = assignment?.totalRendicion || 0;
  const rendicionCobrada = assignment?.rendicionCobrada || 0;
  const saldoPendienteRendicion = Math.max(0, totalRendicion - rendicionCobrada);
  const gananciaVendedor = assignment?.gananciaVendedor || 0;
  const hasDebt = (activeReseller.debtAmount || 0) > 0;
  const myNotes = (opsState.resellerNotes || []).filter(
    (n) => n.resellerId === activeReseller.id || n.resellerName === activeReseller.name
  );

  // --------------------------------------------------------------------------
  // CASO 3: COMPROMISO INICIAL DE RENDICIÓN PENDIENTE DE FIRMA
  // --------------------------------------------------------------------------
  const needsCommitment =
    currentUser.role === 'reseller' &&
    (!activeReseller.termsAccepted || !currentUser.termsAccepted);

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
      <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '90vh', padding: '2.5rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '640px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid var(--color-border, #E7E5E4)', padding: '2rem 1.75rem', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <FileText size={13} strokeWidth={1.5} />
            <span>Declaración Jurada y Compromiso Comercial</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.6rem', color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.35rem 0' }}>
            Alta y Habilitación de Vendedor
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1.5rem 0', lineHeight: 1.45 }}>
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
            <div style={{ backgroundColor: 'var(--color-cream-light, #FAF8F5)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border, #E7E5E4)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.85rem 0' }}>
                1. Datos Personales y de Contacto
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                    Correo / Usuario Habilitado:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeReseller.email || currentUser.email || activeReseller.name}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#E7E5E4', color: '#57534E', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                    DNI / CUIL (* Obligatorio):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: 38.456.789"
                    value={formDni}
                    onChange={(e) => setFormDni(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                    Teléfono Personal / WhatsApp:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: 264 512-3456"
                    value={formPhone || activeReseller.phone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                    Contacto de Emergencia (* Nombre y Teléfono):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Madre / Hermano: 264 411-2233"
                    value={formEmergency}
                    onChange={(e) => setFormEmergency(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                  Domicilio Real Completo (* Calle, N°, Barrio, Localidad):
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Mendoza 1250 Norte, Barrio Parque, Chimbas, San Juan"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* Cláusulas y Términos */}
            <div style={{ backgroundColor: '#FAF8F5', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border, #E7E5E4)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.65rem 0' }}>
                2. Cláusulas de Custodia y Rendición en Término
              </h3>

              <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon, #1C1917)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '6px' }}>
                <p style={{ margin: 0 }}>
                  <strong>A. Mercadería Consignada:</strong> Toda la mercadería entregada (Pizzetas individuales de 50g elaboradas con queso cremoso y pre-pizzas artesanales de 400g) permanece bajo la exclusiva guarda y responsabilidad del vendedor.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>B. Rendición en Tiempo y Forma:</strong> El dinero cobrado en concepto de venta al público pertenece legítimamente a Di Borde y debe rendirse al finalizar el turno acordado.
                </p>
                <p style={{ margin: 0, color: '#B91C1C' }}>
                  <strong>C. Rendición en Término:</strong> Las demoras injustificadas o retenciones indebidas de fondos de mercadería retirada impiden nuevas entregas y deben regularizarse de inmediato con la administración.
                </p>
              </div>
            </div>

            {/* Checkboxes de Aceptación */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--color-carbon, #1C1917)', cursor: 'pointer' }}>
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
                  Me comprometo expresamente a rendir siempre el dinero en tiempo y forma al finalizar mi jornada.
                </span>
              </label>
            </div>

            {/* Firma Digital */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', marginBottom: '4px' }}>
                Firma Digital de Conformidad (Escribe tu Nombre Completo y DNI):
              </label>
              <input
                type="text"
                required
                placeholder={`ej: ${activeReseller.name} - DNI ${formDni || '38456789'}`}
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.86rem', fontFamily: 'monospace' }}
              />
            </div>

            <button
              type="submit"
              disabled={commitmentSubmitting}
              style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--color-carbon, #1C1917)',
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

  // --------------------------------------------------------------------------
  // HANDLERS PARA REPORTE DE VENTAS Y SUGERENCIAS
  // --------------------------------------------------------------------------
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
    msg += `Zona: ${activeReseller.zone || 'Chimbas'}\n\n`;

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
      msg += `\nSaldo pendiente anterior: $${activeReseller.debtAmount.toLocaleString('es-AR')}\n`;
    }

    msg += `\nHola DiBorde, les paso mi reporte para coordinar en el obrador.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  // --------------------------------------------------------------------------
  // VISTA PRINCIPAL DEL DASHBOARD DE VENDEDOR
  // --------------------------------------------------------------------------
  return (
    <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '100vh', padding: '1.5rem 1rem 6rem 1rem' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* ======================================================== */}
        {/* 1. HEADER DEL VENDEDOR                                   */}
        {/* ======================================================== */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon, #1C1917)',
            color: '#FAF8F5',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 16px rgba(28, 25, 23, 0.08)'
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
                  <span>Zona: {activeReseller.zone || 'Chimbas, San Juan'}</span>
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

          {/* Selector de vendedor SOLO visible si el Administrador está previsualizando */}
          {currentUser.role === 'admin' ? (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#FCD34D', fontWeight: 600 }}>
                Modo Administrador: Previsualizar vendedor:
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
                    <option key={r.id} value={r.id} style={{ backgroundColor: 'var(--color-carbon, #1C1917)', color: '#fff' }}>
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
                <span>Vendedor Oficial: <strong>Habilitado</strong></span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#A8A29E' }}>
                DNI: {activeReseller.dni || 'Registrado'}
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. ALERTA DE DEUDA O CUENTA AL DÍA                       */}
        {/* ======================================================== */}
        {hasDebt ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DC2626' }}>
                  Saldo Deudor Pendiente
                </span>
              </div>
              <AlertTriangle size={15} strokeWidth={1.5} color="#DC2626" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                Total adeudado al obrador:
              </span>
              <span className="tabular-nums font-serif" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#DC2626' }}>
                -${activeReseller.debtAmount.toLocaleString('es-AR')}
              </span>
            </div>

            <div
              style={{
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px solid #FEE2E2',
                fontSize: '0.76rem',
                color: 'var(--color-carbon-muted, #78716C)',
                lineHeight: 1.45
              }}
            >
              <strong style={{ color: 'var(--color-carbon, #1C1917)' }}>Motivo:</strong>{' '}
              {activeReseller.debtReason || 'Saldo pendiente de rendición'}.
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} strokeWidth={1.5} color="#15803D" />
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#15803D' }}>
              Cuenta al día. No registrás deudas pendientes con el obrador.
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. RESUMEN DE GANANCIAS Y RENDICIÓN (LIQUIDACIÓN)         */}
        {/* ======================================================== */}
        {assignment && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '1.25rem 1.4rem',
              border: '1px solid var(--color-border, #E7E5E4)',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span className="eyebrow-kicker">CUENTAS CLARAS</span>
              {saldoPendienteRendicion === 0 ? (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                  Rendición al día ✓
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                  Por rendir hoy: ${saldoPendienteRendicion.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.85rem 0' }}>
              Liquidación de la Jornada
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted, #78716C)' }}>Total venta en calle (PVP):</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon, #1C1917)' }}>
                  ${(assignment.totalPvp || 0).toLocaleString('es-AR')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-carbon-muted, #78716C)' }}>Rendición a Di Borde:</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon, #1C1917)' }}>
                  ${totalRendicion.toLocaleString('es-AR')}
                </span>
              </div>

              {rendicionCobrada > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D' }}>
                  <span>Ya entregado en fábrica:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>-${rendicionCobrada.toLocaleString('es-AR')}</span>
                </div>
              )}

              <div
                style={{
                  marginTop: '0.35rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border, #E7E5E4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-carbon-muted, #78716C)', letterSpacing: '0.04em' }}>
                    Por entregar hoy:
                  </div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: saldoPendienteRendicion > 0 ? 'var(--color-primary, #C83820)' : '#15803D' }}>
                    ${saldoPendienteRendicion.toLocaleString('es-AR')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#15803D', letterSpacing: '0.04em', fontWeight: 700 }}>
                    Tu Ganancia Neta:
                  </div>
                  <div className="tabular-nums font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#15803D' }}>
                    +${gananciaVendedor.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. MERCADERÍA ASIGNADA PARA HOY                          */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            border: '1px solid var(--color-border, #E7E5E4)',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div>
              <span className="eyebrow-kicker">MERCADERÍA EN MANO</span>
              <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0.1rem 0 0 0' }}>
                Stock Asignado para la Calle
              </h2>
            </div>
            <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted, #78716C)', backgroundColor: 'var(--color-cream, #FAF8F5)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)' }}>
              {assignment?.assignedDate || 'Turno Activo'}
            </span>
          </div>

          {assignment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Pizzetas */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream, #FAF8F5)',
                  borderRadius: '6px',
                  padding: '0.75rem 0.9rem',
                  border: '1px solid var(--color-border, #E7E5E4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                    Pizzetas con Queso (50g)
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                    {assignment.pizzetasQueso || 0} unid.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                  <span>PVP: <strong>$800</strong></span>
                  <span>Rendís: <strong>$400</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$400 c/u</span>
                </div>
              </div>

              {/* Paquetes x10 */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream, #FAF8F5)',
                  borderRadius: '6px',
                  padding: '0.75rem 0.9rem',
                  border: '1px solid var(--color-border, #E7E5E4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                    Paquetes x10 Pre-pizzetas
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                    {assignment.paquetes10 || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                  <span>PVP: <strong>$2.400 / $2.500</strong></span>
                  <span>Rendís: <strong>$2.000</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$400/+$500</span>
                </div>
              </div>

              {/* Paquetes x2 Grandes */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream, #FAF8F5)',
                  borderRadius: '6px',
                  padding: '0.75rem 0.9rem',
                  border: '1px solid var(--color-border, #E7E5E4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                    Paquetes x2 Grandes (400g c/u)
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                    {assignment.paquetesGrandes || 0} paq.
                  </span>
                </div>
                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                  <span>PVP: <strong>$2.600</strong></span>
                  <span>Rendís: <strong>$1.800</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$800/paq</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0.5rem 0' }}>
              No tenés mercadería asignada en este momento. Coordina con el obrador de Di Borde para retirar tu tanda.
            </p>
          )}
        </section>

        {/* ======================================================== */}
        {/* 5. FORMULARIO: "¿CUÁNTO VENDISTE HOY?"                   */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            border: '1px solid var(--color-border, #E7E5E4)',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
            <TrendingUp size={15} strokeWidth={1.5} color="var(--color-primary, #C83820)" />
            <span className="eyebrow-kicker" style={{ margin: 0 }}>REGISTRO DE VENTA</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.4rem 0' }}>
            Informar Ventas de la Jornada
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1rem 0' }}>
            Anotá cuántas unidades vendiste hoy. Quedan registradas de inmediato en el panel administrativo central.
          </p>

          {salesReportSuccess && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                padding: '9px 12px',
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
              <span>¡Reporte de ventas enviado exitosamente a DiBorde!</span>
            </div>
          )}

          <form onSubmit={handleSubmitSalesReport} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                  Pizzetas:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.pizzetasQueso || 999}
                  placeholder="ej: 15"
                  value={salesPizzetas}
                  onChange={(e) => setSalesPizzetas(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #E7E5E4)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream, #FAF8F5)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                  Paq. x10:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.paquetes10 || 999}
                  placeholder="ej: 4"
                  value={salesPaquetes10}
                  onChange={(e) => setSalesPaquetes10(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #E7E5E4)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream, #FAF8F5)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                  Paq. x2:
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.paquetesGrandes || 999}
                  placeholder="ej: 2"
                  value={salesPaquetesGrandes}
                  onChange={(e) => setSalesPaquetesGrandes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #E7E5E4)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--color-cream, #FAF8F5)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                Zona o plaza recorrida:
              </label>
              <input
                type="text"
                placeholder="ej: Plaza Chimbas / Parque de Mayo / Comercios calle Mendoza"
                value={salesLocation}
                onChange={(e) => setSalesLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream, #FAF8F5)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                Observaciones (sobrante que devuelves, etc.):
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
                  border: '1px solid var(--color-border, #E7E5E4)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream, #FAF8F5)'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon, #1C1917)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '11px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={14} strokeWidth={1.5} />
              <span>Registrar Venta en el Panel</span>
            </button>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 6. SUGERENCIAS & PEDIDOS DE CLIENTES                     */}
        {/* ======================================================== */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            border: '1px solid var(--color-border, #E7E5E4)',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
            <HelpCircle size={15} strokeWidth={1.5} color="var(--color-primary, #C83820)" />
            <span className="eyebrow-kicker" style={{ margin: 0 }}>SUGERENCIAS & PEDIDOS</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.4rem 0' }}>
            ¿Tenés alguna sugerencia o pedido de cliente?
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1rem 0' }}>
            Anotá comentarios de clientes, pedidos de almacenes o ideas de mejora para la fábrica.
          </p>

          {suggestionSuccess && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                padding: '9px 12px',
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
              <span>¡Nota guardada en el panel central de DiBorde!</span>
            </div>
          )}

          <form onSubmit={handleSubmitSuggestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                Tipo de nota:
              </label>
              <select
                value={suggestionType}
                onChange={(e) => setSuggestionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream, #FAF8F5)'
                }}
              >
                <option value="sugerencia">Sugerencia (ej: agregar condimento, tamaño, etc.)</option>
                <option value="pedido_cliente">Pedido especial de un cliente o comercio</option>
                <option value="consulta">Consulta o aviso sobre la zona de venta</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                Detalle del mensaje:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Escribí acá tu sugerencia o el pedido del cliente con cantidad y contacto..."
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-cream, #FAF8F5)',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-carbon, #1C1917)',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                padding: '11px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={14} strokeWidth={1.5} />
              <span>Enviar Nota a la Administración</span>
            </button>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 7. HISTORIAL DE MENSAJES Y REPORTES                      */}
        {/* ======================================================== */}
        {myNotes.length > 0 && (
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '1.25rem 1.4rem',
              border: '1px solid var(--color-border, #E7E5E4)',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <span className="eyebrow-kicker">HISTORIAL RECIENTE</span>
            <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.85rem 0' }}>
              Tus Reportes y Sugerencias Enviadas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {myNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: 'var(--color-cream, #FAF8F5)',
                    borderRadius: '6px',
                    padding: '0.75rem 0.9rem',
                    border: '1px solid var(--color-border, #E7E5E4)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-carbon-muted, #78716C)' }}>
                      {note.type === 'venta' ? 'Reporte de Venta' : note.type === 'pedido_cliente' ? 'Pedido Cliente' : 'Sugerencia'}
                    </span>
                    {note.status === 'leido' ? (
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                        Visto por DiBorde
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>
                        Enviado al panel central
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-carbon, #1C1917)', lineHeight: 1.45 }}>
                    {note.content}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-carbon-subtle, #A8A29E)', marginTop: '4px' }}>
                    {note.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 8. BOTÓN WHATSAPP DIRECTO CON DIBORDE                    */}
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
              borderRadius: '8px',
              padding: '0.95rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(21, 128, 61, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageCircle size={18} strokeWidth={1.5} color="#FFFFFF" />
            <span>Avisar Rendición por WhatsApp a DiBorde</span>
          </button>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--color-carbon-subtle, #A8A29E)', lineHeight: 1.5 }}>
          <div>Obrador Di Borde · Chimbas, San Juan</div>
          <div>Sincronizado con base de datos oficial y WhatsApp</div>
        </div>

      </div>
    </div>
  );
}
