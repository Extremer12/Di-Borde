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
  DollarSign,
  Calendar,
  Award,
  Sparkles,
  Calculator,
  Lightbulb,
  Coins,
  BarChart3,
  ChevronRight,
  Plus,
  Minus,
  Check
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

  // Pestaña activa: 'jornada' | 'ingresos' | 'simulador' | 'tips' | 'notas'
  const [activeTab, setActiveTab] = useState('jornada');

  // Selector de previsualización para el Administrador
  const [selectedAdminPreviewId, setSelectedAdminPreviewId] = useState(
    opsState.resellers?.[0]?.id || ''
  );

  // Estados del Simulador Interactivo de Ganancias
  const [simPizzetas, setSimPizzetas] = useState(25);
  const [simPaquetes10, setSimPaquetes10] = useState(6);
  const [simPaquetesGrandes, setSimPaquetesGrandes] = useState(2);

  // Estados para reporte de ventas de la jornada
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

  // Historial de Jornadas / Días salidos a vender
  const myShifts = (activeReseller.shifts && activeReseller.shifts.length > 0)
    ? activeReseller.shifts
    : (assignment ? [assignment] : []);

  // Métricas acumuladas del vendedor
  const totalEarnedHistorical = myShifts.reduce((acc, s) => acc + (parseFloat(s.gananciaVendedor) || 0), 0);
  const totalShiftsCount = myShifts.length;
  const avgEarnedPerShift = totalShiftsCount > 0 ? Math.round(totalEarnedHistorical / totalShiftsCount) : 0;
  const totalPizzetasSoldHistorical = myShifts.reduce((acc, s) => acc + (parseInt(s.pizzetasQueso) || 0), 0);
  const totalPaquetesSoldHistorical = myShifts.reduce(
    (acc, s) => acc + (parseInt(s.paquetes10) || 0) + (parseInt(s.paquetesGrandes) || 0),
    0
  );

  // Cálculos del simulador
  const simTotalPvp = (simPizzetas * 800) + (simPaquetes10 * 2500) + (simPaquetesGrandes * 2600);
  const simTotalRendicion = (simPizzetas * 400) + (simPaquetes10 * 2000) + (simPaquetesGrandes * 1800);
  const simGanancia = simTotalPvp - simTotalRendicion;

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
      <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '90vh', padding: '2.5rem 1rem 4rem 1rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--color-border, #E7E5E4)', padding: '2rem 1.75rem', boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <FileText size={24} color="#D97706" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.4rem', color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.35rem 0' }}>
              Compromiso de Venta Di Borde
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0 }}>
              Hola <strong>{activeReseller.name}</strong>, completa tus datos para habilitar tu portal de vendedor oficial.
            </p>
          </div>

          {commitmentError && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} strokeWidth={1.5} />
              <span>{commitmentError}</span>
            </div>
          )}

          <form onSubmit={handleCommitmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <strong>C. Rendición en Término:</strong> Las demoras injustificadas o retenciones indebidas de fondos impiden nuevas entregas y deben regularizarse de inmediato con la administración.
                </p>
              </div>
            </div>

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

  const handleRequestStockWhatsApp = () => {
    let msg = `PEDIDO DE MERCADERÍA - VENDEDOR DI BORDE\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Vendedor: ${activeReseller.name}\n`;
    msg += `Zona habitual: ${activeReseller.zone || 'Chimbas'}\n\n`;
    msg += `Quisiera retirar la siguiente mercadería para salir a vender:\n`;
    if (simPizzetas > 0) msg += `• ${simPizzetas}x Pizzetas con Queso Cremoso (50g)\n`;
    if (simPaquetes10 > 0) msg += `• ${simPaquetes10}x Paquetes x10 Pre-pizzetas\n`;
    if (simPaquetesGrandes > 0) msg += `• ${simPaquetesGrandes}x Paquetes x2 Grandes (400g)\n\n`;
    msg += `Rendición correspondiente a entregar: $${simTotalRendicion.toLocaleString('es-AR')}\n`;
    msg += `Mi ganancia calculada: $${simGanancia.toLocaleString('es-AR')}\n\n`;
    msg += `¿Tienen disponible para retirar en el obrador? ¡Gracias!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  // --------------------------------------------------------------------------
  // VISTA PRINCIPAL DEL DASHBOARD DE VENDEDOR
  // --------------------------------------------------------------------------
  return (
    <div style={{ backgroundColor: 'var(--color-cream, #FAF8F5)', minHeight: '100vh', padding: '1.25rem 0.85rem 6rem 0.85rem' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>

        {/* ======================================================== */}
        {/* 1. HEADER DEL VENDEDOR                                   */}
        {/* ======================================================== */}
        <div
          style={{
            backgroundColor: 'var(--color-carbon, #1C1917)',
            color: '#FAF8F5',
            borderRadius: '12px',
            padding: '1.25rem 1.4rem',
            marginBottom: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 16px rgba(28, 25, 23, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
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
        {/* 2. BARRA DE PESTAÑAS (TABS RESPONSIVAS MOBILE-FIRST)     */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '1rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('jornada')}
            style={{
              padding: '8px 14px',
              borderRadius: '24px',
              border: activeTab === 'jornada' ? '1px solid var(--color-carbon, #1C1917)' : '1px solid var(--color-border, #E7E5E4)',
              backgroundColor: activeTab === 'jornada' ? 'var(--color-carbon, #1C1917)' : '#FFFFFF',
              color: activeTab === 'jornada' ? '#FAF8F5' : 'var(--color-carbon, #1C1917)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'jornada' ? '0 2px 6px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <Store size={14} strokeWidth={1.8} />
            <span>Mi Turno Hoy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ingresos')}
            style={{
              padding: '8px 14px',
              borderRadius: '24px',
              border: activeTab === 'ingresos' ? '1px solid var(--color-carbon, #1C1917)' : '1px solid var(--color-border, #E7E5E4)',
              backgroundColor: activeTab === 'ingresos' ? 'var(--color-carbon, #1C1917)' : '#FFFFFF',
              color: activeTab === 'ingresos' ? '#FAF8F5' : 'var(--color-carbon, #1C1917)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'ingresos' ? '0 2px 6px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={14} strokeWidth={1.8} />
            <span>Mis Ingresos & Días</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulador')}
            style={{
              padding: '8px 14px',
              borderRadius: '24px',
              border: activeTab === 'simulador' ? '1px solid var(--color-carbon, #1C1917)' : '1px solid var(--color-border, #E7E5E4)',
              backgroundColor: activeTab === 'simulador' ? 'var(--color-carbon, #1C1917)' : '#FFFFFF',
              color: activeTab === 'simulador' ? '#FAF8F5' : 'var(--color-carbon, #1C1917)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'simulador' ? '0 2px 6px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <Calculator size={14} strokeWidth={1.8} />
            <span>Simulador</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            style={{
              padding: '8px 14px',
              borderRadius: '24px',
              border: activeTab === 'tips' ? '1px solid var(--color-carbon, #1C1917)' : '1px solid var(--color-border, #E7E5E4)',
              backgroundColor: activeTab === 'tips' ? 'var(--color-carbon, #1C1917)' : '#FFFFFF',
              color: activeTab === 'tips' ? '#FAF8F5' : 'var(--color-carbon, #1C1917)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'tips' ? '0 2px 6px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <Lightbulb size={14} strokeWidth={1.8} />
            <span>Tips de Venta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notas')}
            style={{
              padding: '8px 14px',
              borderRadius: '24px',
              border: activeTab === 'notas' ? '1px solid var(--color-carbon, #1C1917)' : '1px solid var(--color-border, #E7E5E4)',
              backgroundColor: activeTab === 'notas' ? 'var(--color-carbon, #1C1917)' : '#FFFFFF',
              color: activeTab === 'notas' ? '#FAF8F5' : 'var(--color-carbon, #1C1917)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'notas' ? '0 2px 6px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <HelpCircle size={14} strokeWidth={1.8} />
            <span>Notas</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* PESTAÑA 1: MI JORNADA HOY                                */}
        {/* ======================================================== */}
        {activeTab === 'jornada' && (
          <div>
            {/* Alerta de Deuda o Cuenta al Día */}
            {hasDebt ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  padding: '1.15rem 1.25rem',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)'
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
                  <span className="tabular-nums font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: '#DC2626' }}>
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
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.04)'
                }}
              >
                <CheckCircle2 size={16} strokeWidth={1.5} color="#15803D" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#15803D' }}>
                  Cuenta al día. No registrás deudas pendientes con el obrador.
                </span>
              </div>
            )}

            {/* Liquidación de la Jornada */}
            {assignment ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.25rem 1.4rem',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="eyebrow-kicker">CUENTAS DEL TURNO</span>
                  {saldoPendienteRendicion === 0 ? (
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                      Rendición al día ✓
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '4px' }}>
                      Por rendir: ${saldoPendienteRendicion.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0 0 0.85rem 0' }}>
                  Liquidación de la Jornada Activa
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
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
                      marginTop: '0.45rem',
                      paddingTop: '0.85rem',
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
                      <div className="tabular-nums font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: saldoPendienteRendicion > 0 ? 'var(--color-primary, #C83820)' : '#15803D' }}>
                        ${saldoPendienteRendicion.toLocaleString('es-AR')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#15803D', letterSpacing: '0.04em', fontWeight: 700 }}>
                        Tu Ganancia Neta:
                      </div>
                      <div className="tabular-nums font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: '#15803D' }}>
                        +${gananciaVendedor.toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Mercadería Asignada para Hoy */}
            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
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
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-border, #E7E5E4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                        Pizzetas con Queso (50g)
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        {assignment.pizzetasQueso || 0} unid.
                      </span>
                    </div>
                    <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                      <span>PVP: <strong>$800</strong></span>
                      <span>Rendís: <strong>$400</strong></span>
                      <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$400 c/u</span>
                    </div>
                  </div>

                  {/* Paquetes x10 */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream, #FAF8F5)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-border, #E7E5E4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                        Paquetes x10 Pre-pizzetas
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        {assignment.paquetes10 || 0} paq.
                      </span>
                    </div>
                    <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                      <span>PVP: <strong>$2.500</strong></span>
                      <span>Rendís: <strong>$2.000</strong></span>
                      <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$500/paq</span>
                    </div>
                  </div>

                  {/* Paquetes x2 Grandes */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream, #FAF8F5)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-border, #E7E5E4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon, #1C1917)' }}>
                        Paquetes x2 Grandes (400g c/u)
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        {assignment.paquetesGrandes || 0} paq.
                      </span>
                    </div>
                    <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                      <span>PVP: <strong>$2.600</strong></span>
                      <span>Rendís: <strong>$1.800</strong></span>
                      <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás: +$800/paq</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-cream, #FAF8F5)', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--color-border, #E7E5E4)' }}>
                  <Package size={28} color="var(--color-carbon-muted, #78716C)" style={{ margin: '0 auto 0.4rem auto' }} strokeWidth={1.5} />
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                    Sin mercadería asignada en este momento
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 0.85rem 0' }}>
                    Coordina con el obrador para retirar tu tanda o planifica tu turno en el simulador.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('simulador')}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: 'var(--color-carbon, #1C1917)',
                      color: '#FAF8F5',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Simular Ganancia y Pedir Stock →
                  </button>
                </div>
              )}
            </section>

            {/* Botón WhatsApp de Rendición */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={handleNotifyWhatsApp}
                style={{
                  width: '100%',
                  backgroundColor: '#15803D',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '10px',
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

            {/* Formulario: ¿Cuánto vendiste hoy? */}
            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
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
                    Observaciones (sobrante devuelto, etc.):
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
                    borderRadius: '8px',
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
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 2: MIS INGRESOS Y DÍAS DE VENTA (NUEVO APARTADO) */}
        {/* ======================================================== */}
        {activeTab === 'ingresos' && (
          <div>
            {/* Header del apartado */}
            <div style={{ marginBottom: '1rem' }}>
              <span className="eyebrow-kicker">CONTROL DE GANANCIAS</span>
              <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '2px 0 4px 0' }}>
                Mis Ingresos y Días de Venta
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                Seguimiento de tu rendimiento en calle, días trabajados y plata que te llevás al bolsillo con Di Borde.
              </p>
            </div>

            {/* Tarjetas de Métricas (2x2 Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
              {/* Tarjeta 1: Total Ganado */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', textTransform: 'uppercase' }}>
                    Total Ganado
                  </span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Coins size={14} color="#15803D" strokeWidth={2} />
                  </div>
                </div>
                <div className="tabular-nums font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#15803D' }}>
                  +${totalEarnedHistorical.toLocaleString('es-AR')}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#15803D', marginTop: '2px', fontWeight: 500 }}>
                  Tu ganancia neta cobrada
                </div>
              </div>

              {/* Tarjeta 2: Días Salidos */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', textTransform: 'uppercase' }}>
                    Días Salidos
                  </span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-cream-light, #FAF8F5)', border: '1px solid var(--color-border, #E7E5E4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={14} color="var(--color-carbon, #1C1917)" strokeWidth={2} />
                  </div>
                </div>
                <div className="tabular-nums font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                  {totalShiftsCount} {totalShiftsCount === 1 ? 'día' : 'días'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-carbon-muted, #78716C)', marginTop: '2px' }}>
                  Jornadas de venta
                </div>
              </div>

              {/* Tarjeta 3: Promedio por Día */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', textTransform: 'uppercase' }}>
                    Promedio / Día
                  </span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={14} color="#B45309" strokeWidth={2} />
                  </div>
                </div>
                <div className="tabular-nums font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#B45309' }}>
                  ${avgEarnedPerShift.toLocaleString('es-AR')}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-carbon-muted, #78716C)', marginTop: '2px' }}>
                  Ganancia por jornada
                </div>
              </div>

              {/* Tarjeta 4: Unidades Vendidas */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-carbon-muted, #78716C)', textTransform: 'uppercase' }}>
                    Total Vendido
                  </span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={14} color="var(--color-primary, #C83820)" strokeWidth={2} />
                  </div>
                </div>
                <div className="tabular-nums font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                  {totalPizzetasSoldHistorical} piz. · {totalPaquetesSoldHistorical} paq.
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-carbon-muted, #78716C)', marginTop: '2px' }}>
                  En calle y comercios
                </div>
              </div>
            </div>

            {/* Listado Cronológico de Jornadas / Días Salidos */}
            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem 1.4rem',
                border: '1px solid var(--color-border, #E7E5E4)',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div>
                  <span className="eyebrow-kicker">HISTORIAL DETALLADO</span>
                  <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '0.1rem 0 0 0' }}>
                    Registro de Salidas y Rendiciones
                  </h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted, #78716C)', backgroundColor: 'var(--color-cream, #FAF8F5)', padding: '3px 8px', borderRadius: '4px' }}>
                  {myShifts.length} {myShifts.length === 1 ? 'salida' : 'salidas'}
                </span>
              </div>

              {myShifts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myShifts.map((shift, idx) => {
                    const isFullyPaid = shift.renditionStatus === 'al_dia' || (shift.rendicionCobrada >= shift.totalRendicion && shift.totalRendicion > 0);
                    const isPartial = shift.renditionStatus === 'parcial';

                    return (
                      <div
                        key={shift.id || idx}
                        style={{
                          backgroundColor: 'var(--color-cream, #FAF8F5)',
                          borderRadius: '8px',
                          padding: '0.9rem 1rem',
                          border: '1px solid var(--color-border, #E7E5E4)'
                        }}
                      >
                        {/* Cabecera del día */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} strokeWidth={1.8} color="var(--color-primary, #C83820)" />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                              {shift.assignedDate || shift.date || `Jornada #${myShifts.length - idx}`}
                            </span>
                          </div>

                          {isFullyPaid ? (
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                              Completada y Rendida ✓
                            </span>
                          ) : isPartial ? (
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                              Rendición Parcial ⏱
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '4px' }}>
                              Turno Activo / En Curso
                            </span>
                          )}
                        </div>

                        {/* Desglose de mercadería llevada */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)', marginBottom: '8px', lineHeight: 1.45 }}>
                          Llevaste:{' '}
                          <strong style={{ color: 'var(--color-carbon, #1C1917)' }}>
                            {shift.pizzetasQueso || 0} pizzetas
                          </strong>
                          {shift.paquetes10 > 0 && (
                            <> · <strong style={{ color: 'var(--color-carbon, #1C1917)' }}>{shift.paquetes10} paq. x10</strong></>
                          )}
                          {shift.paquetesGrandes > 0 && (
                            <> · <strong style={{ color: 'var(--color-carbon, #1C1917)' }}>{shift.paquetesGrandes} paq. grandes</strong></>
                          )}
                        </div>

                        {/* Fila financiera de la jornada */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '6px',
                            borderTop: '1px solid var(--color-border, #E7E5E4)',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--color-carbon-muted, #78716C)' }}>Rendido: </span>
                            <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-carbon, #1C1917)' }}>
                              ${(shift.rendicionCobrada || shift.totalRendicion || 0).toLocaleString('es-AR')}
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#15803D', fontWeight: 600, marginRight: '4px' }}>Ganancia:</span>
                            <span className="tabular-nums font-serif" style={{ fontSize: '0.98rem', fontWeight: 700, color: '#15803D' }}>
                              +${(shift.gananciaVendedor || 0).toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>

                        {shift.notes && (
                          <div style={{ marginTop: '5px', fontSize: '0.7rem', color: '#78716C', fontStyle: 'italic' }}>
                            Nota: {shift.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 1rem', backgroundColor: 'var(--color-cream, #FAF8F5)', borderRadius: '8px', border: '1px dashed var(--color-border, #E7E5E4)' }}>
                  <Award size={32} color="#D97706" style={{ margin: '0 auto 0.5rem auto' }} strokeWidth={1.5} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', marginBottom: '4px' }}>
                    ¡Comenzá tu primera jornada de venta!
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted, #78716C)', margin: '0 0 1rem 0' }}>
                    Aún no registrás jornadas pasadas en el sistema. En cuanto retires mercadería en el obrador, acá tendrás todo tu historial de ingresos y días salidos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('simulador')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--color-carbon, #1C1917)',
                      color: '#FAF8F5',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Simular Ganancia de tu Primer Turno →
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 3: SIMULADOR DE GANANCIAS                        */}
        {/* ======================================================== */}
        {activeTab === 'simulador' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="eyebrow-kicker">CALCULADORA DE VENTA</span>
              <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '2px 0 4px 0' }}>
                Simulador de Ganancias Diarias
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                Ajustá cuántas unidades querés vender hoy y mirá al instante cuánta plata te queda limpia en mano.
              </p>
            </div>

            {/* Presets Rápidos de 1 toque */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '1rem', scrollbarWidth: 'none' }}>
              <button
                type="button"
                onClick={() => { setSimPizzetas(15); setSimPaquetes10(3); setSimPaquetesGrandes(0); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-carbon, #1C1917)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ⚡ Turno Rápido (+$7.500)
              </button>

              <button
                type="button"
                onClick={() => { setSimPizzetas(25); setSimPaquetes10(6); setSimPaquetesGrandes(2); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-carbon, #1C1917)',
                  backgroundColor: 'var(--color-cream-light, #FAF8F5)',
                  color: 'var(--color-carbon, #1C1917)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                💼 Media Jornada (+$14.600)
              </button>

              <button
                type="button"
                onClick={() => { setSimPizzetas(40); setSimPaquetes10(10); setSimPaquetesGrandes(5); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #E7E5E4)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-carbon, #1C1917)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🚀 Jornada Completa (+$25.000)
              </button>
            </div>

            {/* Panel Principal del Simulador */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem 1.4rem',
                border: '1px solid var(--color-border, #E7E5E4)',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {/* Resultado Destacado */}
              <div
                style={{
                  backgroundColor: 'var(--color-carbon, #1C1917)',
                  color: '#FAF8F5',
                  borderRadius: '10px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  TU GANANCIA LIMPIA HOY (AL BOLSILLO)
                </div>
                <div className="tabular-nums font-serif" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#4ADE80', margin: '4px 0' }}>
                  +${simGanancia.toLocaleString('es-AR')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.76rem', color: '#A8A29E', marginTop: '6px' }}>
                  <span>Cobrás en calle: <strong style={{ color: '#fff' }}>${simTotalPvp.toLocaleString('es-AR')}</strong></span>
                  <span>·</span>
                  <span>Rendís a Di Borde: <strong style={{ color: '#fff' }}>${simTotalRendicion.toLocaleString('es-AR')}</strong></span>
                </div>
              </div>

              {/* Controles de Selección */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Producto 1: Pizzetas */}
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-cream, #FAF8F5)', borderRadius: '8px', border: '1px solid var(--color-border, #E7E5E4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        Pizzetas con Queso (50g)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                        PVP $800 · Rendís $400 · <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás +$400 c/u</span>
                      </div>
                    </div>
                    <div className="tabular-nums font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803D' }}>
                      +${(simPizzetas * 400).toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPizzetas(Math.max(0, simPizzetas - 5))}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimPizzetas(Math.max(0, simPizzetas - 1))}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min="0"
                        value={simPizzetas}
                        onChange={(e) => setSimPizzetas(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ width: '60px', textAlign: 'center', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.95rem', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>unid.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPizzetas(simPizzetas + 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimPizzetas(simPizzetas + 5)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Producto 2: Paquetes x10 */}
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-cream, #FAF8F5)', borderRadius: '8px', border: '1px solid var(--color-border, #E7E5E4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        Paquetes x10 Pre-pizzetas
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                        PVP $2.500 · Rendís $2.000 · <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás +$500/paq</span>
                      </div>
                    </div>
                    <div className="tabular-nums font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803D' }}>
                      +${(simPaquetes10 * 500).toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPaquetes10(Math.max(0, simPaquetes10 - 1))}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min="0"
                        value={simPaquetes10}
                        onChange={(e) => setSimPaquetes10(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ width: '60px', textAlign: 'center', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.95rem', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>paq.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPaquetes10(simPaquetes10 + 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimPaquetes10(simPaquetes10 + 5)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Producto 3: Paquetes x2 Grandes */}
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-cream, #FAF8F5)', borderRadius: '8px', border: '1px solid var(--color-border, #E7E5E4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)' }}>
                        Paquetes x2 Grandes (400g)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-carbon-muted, #78716C)' }}>
                        PVP $2.600 · Rendís $1.800 · <span style={{ color: '#15803D', fontWeight: 600 }}>Ganás +$800/paq</span>
                      </div>
                    </div>
                    <div className="tabular-nums font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803D' }}>
                      +${(simPaquetesGrandes * 800).toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPaquetesGrandes(Math.max(0, simPaquetesGrandes - 1))}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min="0"
                        value={simPaquetesGrandes}
                        onChange={(e) => setSimPaquetesGrandes(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ width: '60px', textAlign: 'center', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', fontSize: '0.95rem', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-carbon-muted, #78716C)' }}>paq.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setSimPaquetesGrandes(simPaquetesGrandes + 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--color-border, #E7E5E4)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp para pedir este stock */}
              <button
                type="button"
                onClick={handleRequestStockWhatsApp}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  backgroundColor: '#15803D',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} color="#FFFFFF" />
                <span>Pedir esta tanda al Obrador por WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 4: TIPS Y GUÍA DE VENTA EN CALLE                 */}
        {/* ======================================================== */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="eyebrow-kicker">GUÍA PRÁCTICA</span>
              <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '2px 0 4px 0' }}>
                Tips de Éxito para Vender Más
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                Tácticas comprobadas para salir a la calle en San Juan y vaciar tu canasto en pocas horas.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Tip 1: Horarios */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1.15rem 1.25rem', border: '1px solid var(--color-border, #E7E5E4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={15} color="#B45309" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)', margin: 0 }}>
                    1. Los Dos Horarios Clave del Día
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-carbon, #1C1917)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <strong>• Mediodía (11:45 a 13:45 hs):</strong> Comercios, talleres mecánicos, obras y oficinas. La gente busca un almuerzo rápido y rico. Las pizzetas con queso calientes se venden en minutos.
                  </div>
                  <div>
                    <strong>• Tarde / Vuelta a Casa (17:30 a 20:30 hs):</strong> Familias y vecinos regresando del centro o comprando para la cena. El paquete x10 y los paquetes x2 grandes son los reyes de este turno.
                  </div>
                </div>
              </div>

              {/* Tip 2: Zonas */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1.15rem 1.25rem', border: '1px solid var(--color-border, #E7E5E4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={15} color="#15803D" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)', margin: 0 }}>
                    2. Zonas de Alta Rotación en Chimbas y Alrededores
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-carbon, #1C1917)', lineHeight: 1.5 }}>
                  <p style={{ margin: '0 0 4px 0' }}>
                    • Paradas concurridas de la RedTulum y avenidas principales (calle Mendoza, Benavídez, Salta).
                  </p>
                  <p style={{ margin: '0 0 4px 0' }}>
                    • Talleres, gomerías y corralones: son clientes fijos que compran de a 3 o 4 unidades para compartir.
                  </p>
                  <p style={{ margin: 0 }}>
                    • Almacenes, verdulerías y kioscos barriales que no tienen panadería propia.
                  </p>
                </div>
              </div>

              {/* Tip 3: Frases que Venden */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1.15rem 1.25rem', border: '1px solid var(--color-border, #E7E5E4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={15} color="var(--color-primary, #C83820)" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-carbon, #1C1917)', margin: 0 }}>
                    3. Frases y Argumentos que Conectan
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-carbon, #1C1917)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ margin: 0 }}>
                    💬 <em>"Son caseras, hechas hoy mismo en el obrador artesanal de Chimbas con abundante queso cremoso."</em>
                  </p>
                  <p style={{ margin: 0 }}>
                    💬 <em>"Con este paquete x10 resolvés la merienda y las cenas de toda la semana por solo $2.500."</em>
                  </p>
                  <p style={{ margin: 0 }}>
                    💬 <em>"Si no tenés efectivo, te acepto transferencia por Mercado Pago o Cuenta DNI al toque."</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 5: NOTAS Y SUGERENCIAS                           */}
        {/* ======================================================== */}
        {activeTab === 'notas' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="eyebrow-kicker">COMUNICACIÓN CON FÁBRICA</span>
              <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-carbon, #1C1917)', margin: '2px 0 4px 0' }}>
                Sugerencias y Pedidos de Clientes
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-carbon-muted, #78716C)', margin: 0, lineHeight: 1.45 }}>
                Anotá pedidos especiales de almacenes o sugerencias para mejorar los productos de Di Borde.
              </p>
            </div>

            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem 1.4rem',
                border: '1px solid var(--color-border, #E7E5E4)',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
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
                    <option value="sugerencia">Sugerencia (ej: condimento, empaque, etc.)</option>
                    <option value="pedido_cliente">Pedido especial de un comercio o cliente</option>
                    <option value="consulta">Consulta o aviso sobre tu zona de venta</option>
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
                    borderRadius: '8px',
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

            {/* Historial de reportes y sugerencias */}
            {myNotes.length > 0 && (
              <section
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
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
          </div>
        )}

        {/* Footer Info */}
        <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--color-carbon-subtle, #A8A29E)', lineHeight: 1.5, marginTop: '1.5rem' }}>
          <div>Obrador Di Borde · Chimbas, San Juan</div>
          <div>Sincronizado con base de datos oficial y WhatsApp</div>
        </div>

      </div>
    </div>
  );
}