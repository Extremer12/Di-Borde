import React, { useState } from 'react';
import { PRODUCTS } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import WholesaleBenefitCard from '../components/WholesaleBenefitCard.jsx';
import { Search } from 'lucide-react';

export default function CatalogView() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesFilter = selectedFilter === 'all' || product.channel === selectedFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ maxWidth: 'var(--container-max, 1140px)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow-kicker">Catálogo Oficial</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              margin: '0.25rem 0 0.5rem 0',
              letterSpacing: '-0.025em'
            }}
          >
            Nuestras Variedades
          </h1>
          <p style={{ color: 'var(--color-carbon-muted)', fontSize: '0.96rem', margin: 0, maxWidth: '580px' }}>
            Elaboración casera con salsa de tomates seleccionados y abundante muzzarella de primera línea.
          </p>
        </div>

        {/* Wholesale notification card */}
        <div style={{ maxWidth: '640px', marginBottom: '2rem' }}>
          <WholesaleBenefitCard />
        </div>

        {/* Search & Filter Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Filter Tabs (Zero emojis, clean Linear style) */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                backgroundColor: selectedFilter === 'all' ? 'var(--color-carbon)' : '#FFFFFF',
                color: selectedFilter === 'all' ? '#FFFFFF' : 'var(--color-carbon-muted)',
                border: selectedFilter === 'all' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Todos <span className="tabular-nums" style={{ opacity: 0.7 }}>({PRODUCTS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('minorista')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                backgroundColor: selectedFilter === 'minorista' ? 'var(--color-carbon)' : '#FFFFFF',
                color: selectedFilter === 'minorista' ? '#FFFFFF' : 'var(--color-carbon-muted)',
                border: selectedFilter === 'minorista' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Al Paso & Familiar
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('mayorista')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                backgroundColor: selectedFilter === 'mayorista' ? 'var(--color-carbon)' : '#FFFFFF',
                color: selectedFilter === 'mayorista' ? '#FFFFFF' : 'var(--color-carbon-muted)',
                border: selectedFilter === 'mayorista' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Mayorista B2B
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('preventistas')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                backgroundColor: selectedFilter === 'preventistas' ? 'var(--color-carbon)' : '#FFFFFF',
                color: selectedFilter === 'preventistas' ? '#FFFFFF' : 'var(--color-carbon-muted)',
                border: selectedFilter === 'preventistas' ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Revendedores
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '360px' }}>
            <Search
              size={15}
              strokeWidth={1.5}
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-carbon-subtle)'
              }}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o variedad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '0.48rem 0.75rem 0.48rem 2.2rem',
                fontSize: '0.84rem',
                color: 'var(--color-carbon)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 3-Column Desktop Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-carbon-muted)', margin: 0, fontSize: '0.92rem' }}>No se encontraron variedades con los filtros aplicados.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                backgroundColor: 'var(--color-carbon)',
                color: '#fff',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
