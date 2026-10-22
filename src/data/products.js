// Di Borde Official Catalog & Pricing Logic
// Actualizado con valores definitivos y escalas automáticas por volumen

export const PRODUCTS = [
  // 1. PIZZETAS CON QUESO (Individuales - Venta Directa / Al Paso)
  {
    id: "pizzeta-con-queso",
    slug: "pizzeta-con-queso-individual",
    name: "Pizzeta con Queso (Individual)",
    channel: "minorista",
    category: "pizzetas",
    badge: "CALIENTE AL PASO",
    price: 800,
    unit: "Individual lista para hornear o comer",
    weight: "70g aprox.",
    specs: "Masa casera crocante + salsa casera + muzzarella gratinada",
    shortDescription: "Pizzeta casera individual con abundante muzzarella fundida. Masa crocante, dorada y sabrosa.",
    image: "/assets/images/prod_pizzetas_clasicas.jpg",
    featured: true,
    stock: 200,
    hasVolumeDiscount: false,
    resellerRendition: 400,
    resellerProfit: 400
  },

  // 2. PAQUETE X10 PRE-PIZZETAS (Sin Queso)
  {
    id: "paquete-10-prepizzetas",
    slug: "paquete-10-prepizzetas-sin-queso",
    name: "Paquete x10 Pre-pizzetas (Sin Queso)",
    channel: "minorista",
    category: "prepizzetas",
    badge: "MÁS ELEGIDO",
    price: 2500,               // 1 a 2 paquetes: $2.500 por paquete
    tierPromoPrice: 2333,      // Promo 3 Paquetes: $7.000 total ($2.333 por paquete)
    tierPromoTotal: 7000,
    tierSuperPromoPrice: 2000, // Escalón Súper Mayorista (10+ paquetes): $20.000 ($2.000 c/u)
    tierSuperPromoTotal: 20000,
    hasVolumeDiscount: true,
    promoBadge: "Llevando 3 paq a $2.333 c/u (3 x $7.000) o 10 paq a $2.000 c/u",
    unit: "Paquete cerrado x 10 unidades",
    weight: "450g aprox.",
    specs: "1 a 2 paq: $2.500 | 3 paq: $7.000 ($2.333 c/u) | 10+ paq: $2.000 c/u",
    shortDescription: "10 bases artesanales precocidas con salsa casera. Listas para freezar o cocinar en minutos.",
    image: "/assets/images/prod_paquete_10_prepizzetas.jpg",
    featured: true,
    stock: 300,
    resellerRendition: 2000,
    resellerProfit: 500
  },

  // 3. PAQUETE X2 PRE-PIZZAS GRANDES
  {
    id: "paquete-2-prepizzas-grandes",
    slug: "paquete-2-prepizzas-grandes",
    name: "Paquete x2 Pre-pizzas Grandes",
    channel: "minorista",
    category: "prepizzas",
    badge: "DÚO TRADICIONAL",
    price: 2500,               // Minorista (1 a 2 paquetes): $2.500 por paquete
    tierPromoPrice: 2000,      // Negocio / Mayorista (A partir de 3 paquetes): $2.000 por paquete
    tierPromoQty: 3,
    hasVolumeDiscount: true,
    promoBadge: "Llevando 3 paquetes o más a $2.000 por paquete",
    unit: "Paquete x 2 pre-pizzas grandes de molde",
    weight: "700g total (350g c/u)",
    specs: "1 a 2 paq: $2.500 c/u | A partir de 3 paq: $2.000 c/u",
    shortDescription: "Dos pre-pizzas tradicionales de molde con masa suave, piso crocante y salsa casera.",
    image: "/assets/images/prod_prepizzas_tradicionales.jpg",
    featured: true,
    stock: 150,
    resellerRendition: 1800,
    resellerProfit: 700
  }
];

// Cálculo oficial de precios por volumen
export function calculateItemSubtotal(productId, quantity, basePrice = 2500) {
  if (quantity <= 0) {
    return {
      total: 0,
      unitPrice: basePrice,
      discountLabel: null,
      isDiscounted: false,
      savings: 0
    };
  }

  // A) Pizzeta individual con queso
  if (productId === 'pizzeta-con-queso') {
    const total = quantity * 800;
    return {
      total,
      unitPrice: 800,
      discountLabel: null,
      isDiscounted: false,
      savings: 0
    };
  }

  // B) Paquete x10 Pre-pizzetas
  if (productId === 'paquete-10-prepizzetas') {
    const regularTotal = quantity * 2500;
    if (quantity >= 10) {
      // Escalón Súper Mayorista: $20.000 cada 10 ($2.000 c/u)
      const total = quantity * 2000;
      return {
        total,
        unitPrice: 2000,
        discountLabel: 'Súper Mayorista ($2.000 c/u)',
        isDiscounted: true,
        savings: regularTotal - total
      };
    }
    if (quantity >= 3) {
      // Promo 3 Paquetes: $7.000 total ($2.333 por paquete)
      const trios = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      const total = (trios * 7000) + (remainder * 2333);
      const effectiveUnit = Math.round(total / quantity);
      return {
        total,
        unitPrice: effectiveUnit,
        discountLabel: quantity === 3 ? 'Pack 3 Paquetes ($7.000)' : 'Promo x3 ($2.333 c/u)',
        isDiscounted: true,
        savings: regularTotal - total
      };
    }
    return {
      total: regularTotal,
      unitPrice: 2500,
      discountLabel: null,
      isDiscounted: false,
      savings: 0
    };
  }

  // C) Paquete x2 Pre-pizzas Grandes
  if (productId === 'paquete-2-prepizzas-grandes') {
    const regularTotal = quantity * 2500;
    if (quantity >= 3) {
      // Precio Negocio / Mayorista: $2.000 por paquete
      const total = quantity * 2000;
      return {
        total,
        unitPrice: 2000,
        discountLabel: 'Precio Mayorista ($2.000 c/u)',
        isDiscounted: true,
        savings: regularTotal - total
      };
    }
    return {
      total: regularTotal,
      unitPrice: 2500,
      discountLabel: null,
      isDiscounted: false,
      savings: 0
    };
  }

  // Fallback
  const total = quantity * basePrice;
  return {
    total,
    unitPrice: basePrice,
    discountLabel: null,
    isDiscounted: false,
    savings: 0
  };
}

// Esquema de rendición para Revendedores Registrados (Vendedores de calle)
export const RESELLER_TIERS = [
  {
    id: "revendedor-pizzeta-queso",
    name: "Pizzeta con Queso",
    badge: "VENTA DIRECTA",
    unit: "por unidad",
    pvp: 800,
    rendition: 400,
    profit: 400,
    profitPercent: "50%",
    image: "/assets/images/prod_pizzetas_clasicas.jpg",
    description: "Salís a vender a $800 y te quedan $400 limpios por cada pizzeta entregada."
  },
  {
    id: "revendedor-paquete-10",
    name: "Paquete x10 Pre-pizzetas",
    badge: "MÁS VENDIDO",
    unit: "por paquete",
    pvp: 2500,
    rendition: 2000,
    profit: 500,
    profitPercent: "25%",
    image: "/assets/images/prod_paquete_10_prepizzetas.jpg",
    description: "Vendés a $2.500 a comercios o vecinos. Rendís $2.000 y ganás $500 por bolsa."
  },
  {
    id: "revendedor-paquete-2-grandes",
    name: "Paquete x2 Pre-pizzas Grandes",
    badge: "DÚO FAMILIAR",
    unit: "por paquete",
    pvp: 2500,
    rendition: 1800,
    profit: 700,
    profitPercent: "28%",
    image: "/assets/images/prod_prepizzas_tradicionales.jpg",
    description: "Vendés a $2.500, rendís $1.800 y te quedan $700 limpios por paquete."
  }
];

// Cálculo de rendición de revendedores
export function calculateResellerTotal({ pizzetasQueso = 0, paquetes10 = 0, paquetesGrandes = 0 }) {
  const totalRecaudado = (pizzetasQueso * 800) + (paquetes10 * 2500) + (paquetesGrandes * 2500);
  const totalRendicion = (pizzetasQueso * 400) + (paquetes10 * 2000) + (paquetesGrandes * 1800);
  const totalGanancia = totalRecaudado - totalRendicion;

  return {
    totalRecaudado,
    totalRendicion,
    totalGanancia
  };
}
