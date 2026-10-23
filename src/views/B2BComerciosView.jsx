import React, { useState } from 'react';
import { PRODUCTS } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { DI_BORDE_WHATSAPP_PHONE } from '../context/CartContext.jsx';
import {
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  FileText
} from 'lucide-react';

export default function B2BComerciosView() {
  const [businessName, setBusinessName] = useState('');
  const [rubro, setRubro] = useState('Cafetería / Bar');
  const [zone, setZone] = useState('Chimbas / Capital');
  const [phone, setPhone] = useState('');

  const handleSendB2BWhatsApp = (e) => {
    e.preventDefault();
    let text = `CONSULTA COMERCIAL B2B - DI BORDE\n`;
    text += `------------------------------------\n`;
    text += `Comercio: ${businessName || 'No especificado'}\n`;
    text += `Rubro: ${rubro}\n`;
    text += `Zona: ${zone}\n`;
    if (phone) text += `Contacto: ${phone}\n`;
    text += `\nQuisiera consultar por lista de precios mayorista y coordinación de entregas programadas.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${DI_BORDE_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ maxWidth: 'var(--container-max, 1140px)', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', maxWidth: '640px' }}>
          <span className="eyebrow-kicker">Canal Mayorista & Gastronomía</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              lineHeight: 1.15,
              margin: '0.35rem 0 0.75rem 0',
              letterSpacing: '-0.025em'
            }}
          >
            Abastecimiento para Comercios y Bares
          </h1>
          <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.98rem', lineHeight: 1.55, margin: 0 }}>
            Precios directos por volumen a partir de 3 paquetes en la web, o acuerdos de entrega programada semanal para cafeterías, cervecerías y almacenes en San Juan.
          </p>
        </div>

        {/* Benefits bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
            padding: '1.25rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Truck size={18} strokeWidth={1.5} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Reparto programado</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>Horneado a primera hora y entregas puntuales.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <FileText size={18} strokeWidth={1.5} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Facturación comercial</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>Emisión de comprobantes fiscales para tu negocio.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={18} strokeWidth={1.5} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-carbon)' }}>Estandarización 100%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-carbon-muted)', marginTop: '2px' }}>Mismo gramaje, altura y cocción en cada lote.</div>
            </div>
          </div>
        </div>

        {/* Productos disponibles con descuento de escala en grid */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="eyebrow-kicker">Catálogo B2B</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 600,
                color: 'var(--color-carbon)',
                margin: '0.2rem 0 0 0'
              }}
            >
              Variedades con Tarifa por Volumen
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.75rem'
            }}
          >
            {PRODUCTS.filter((p) => p.hasVolumeDiscount).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

        {/* Formulario / Contacto directo B2B */}
        <div
          style={{
            maxWidth: '640px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '2rem',
            border: '1px solid var(--color-border)'
          }}
        >
          <span className="eyebrow-kicker">Atención Personalizada</span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              margin: '0.25rem 0 0.5rem 0'
            }}
          >
            Coordinar cuenta comercial o entregas semanales
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-carbon-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Completá los datos básicos para que el responsable comercial te responda directamente por WhatsApp con lista mayorista y cupos de reparto.
          </p>

          <form onSubmit={handleSendB2BWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.35rem' }}>
                Nombre del Comercio o Bar
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Café Moreno / Almacén Central"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-carbon)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.35rem' }}>
                  Rubro
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cafetería, Bar, Kiosco"
                  value={rubro}
                  onChange={(e) => setRubro(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.88rem',
                    color: 'var(--color-carbon)',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.35rem' }}>
                  Zona / Localidad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Chimbas, Capital, Rivadavia"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.88rem',
                    color: 'var(--color-carbon)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-carbon-subtle)', marginBottom: '0.35rem' }}>
                Teléfono o WhatsApp
              </label>
              <input
                type="tel"
                placeholder="Ej: 264 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-carbon)',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-carbon)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                height: '44px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
                transition: 'background-color 0.15s ease'
              }}
            >
              <MessageSquare size={16} strokeWidth={1.5} />
              <span>Enviar consulta mayorista por WhatsApp</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
