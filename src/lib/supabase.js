import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jccpwmyzxkontsbomgef.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY3B3bXl6eGtvbnRzYm9tZ2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzI3MjgsImV4cCI6MjA4OTM0ODcyOH0.kmt14GR1EI0UkXSxbBCSRAGReBIO87iyejXg6CXerCY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Google Sign-In con Supabase Auth
export async function signInWithGoogle(redirectToRoute = '/admin') {
  try {
    if (redirectToRoute) {
      sessionStorage.setItem('di_borde_auth_redirect', redirectToRoute);
      localStorage.setItem('di_borde_auth_redirect_backup', redirectToRoute);
    }
  } catch (e) {
    console.warn('[Supabase Auth] Storage access warning:', e);
  }

  // Google OAuth y Supabase URL Configuration requieren un origen limpio sin hash '#'
  const targetUrl = window.location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: targetUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// Cierre de sesión
export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// Sincronización completa con Supabase
export async function fetchAllDataFromSupabase() {
  try {
    const [
      materialsRes,
      finishedStockRes,
      resellersRes,
      assignmentsRes,
      notesRes,
      cashflowRes,
      ordersRes
    ] = await Promise.all([
      supabase.from('di_borde_raw_materials').select('*').order('created_at', { ascending: true }),
      supabase.from('di_borde_finished_stock').select('*'),
      supabase.from('di_borde_resellers').select('*').order('name', { ascending: true }),
      supabase.from('di_borde_reseller_assignments').select('*').order('created_at', { ascending: false }),
      supabase.from('di_borde_reseller_notes').select('*').order('created_at', { ascending: false }),
      supabase.from('di_borde_cashflow').select('*').order('created_at', { ascending: false }),
      supabase.from('di_borde_orders').select('*').order('created_at', { ascending: false })
    ]);

    if (materialsRes.error || resellersRes.error || cashflowRes.error) {
      console.warn('Error fetching Supabase data, will use fallback', materialsRes.error || resellersRes.error);
      return null;
    }

    // Adaptar formato a estado de Di Borde
    const rawMaterials = (materialsRes.data || []).map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category || 'Insumo',
      unit: m.unit,
      currentStock: parseFloat(m.current_stock) || 0,
      minStockAlert: parseFloat(m.min_stock_alert) || 0,
      lastPurchasePrice: parseFloat(m.last_purchase_price) || 0,
      lastPurchasePack: m.last_purchase_pack || '',
      lastPurchaseDate: m.last_purchase_date || '',
      supplier: m.supplier || ''
    }));

    const stock = {};
    (finishedStockRes.data || []).forEach((fs) => {
      stock[fs.id] = fs.current_stock;
    });

    // Mapear vendedores con su asignación activa
    const assignmentsByReseller = {};
    (assignmentsRes.data || []).forEach((asg) => {
      if (!assignmentsByReseller[asg.reseller_id]) {
        assignmentsByReseller[asg.reseller_id] = {
          pizzetasQueso: asg.pizzetas_queso,
          paquetes10: asg.paquetes_10,
          paquetesGrandes: asg.paquetes_grandes,
          totalPvp: parseFloat(asg.total_pvp),
          totalRendicion: parseFloat(asg.total_rendicion),
          gananciaVendedor: parseFloat(asg.ganancia_vendedor),
          rendicionCobrada: parseFloat(asg.rendicion_cobrada),
          renditionStatus: asg.rendition_status,
          assignedDate: asg.date
        };
      }
    });

    const resellers = (resellersRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      email: (r.email || '').toLowerCase().trim(),
      phone: r.phone || '',
      zone: r.zone || '',
      initials: r.initials || r.name.slice(0, 2).toUpperCase(),
      status: r.status || 'activo',
      dni: r.dni || '',
      address: r.address || '',
      termsAccepted: !!r.terms_accepted,
      termsAcceptedAt: r.terms_accepted_at || null,
      interestAcknowledged: !!r.interest_acknowledged,
      emergencyContact: r.emergency_contact || '',
      debtAmount: parseFloat(r.debt_amount) || 0,
      debtReason: r.debt_reason || null,
      debtDate: r.debt_date || null,
      assigned: assignmentsByReseller[r.id] || null
    }));

    const resellerNotes = (notesRes.data || []).map((n) => ({
      id: n.id,
      resellerId: n.reseller_id,
      resellerName: n.reseller_name,
      date: n.date,
      type: n.type,
      content: n.content,
      status: n.status
    }));

    const cashflow = (cashflowRes.data || []).map((cf) => ({
      id: cf.id,
      date: cf.date,
      type: cf.type,
      category: cf.category,
      concept: cf.concept,
      amount: parseFloat(cf.amount) || 0,
      reference: cf.reference || ''
    }));

    const orders = (ordersRes.data || []).map((o) => ({
      id: o.id,
      date: o.date,
      customerName: o.customer_name,
      phone: o.phone || '',
      address: o.address || '',
      itemsSummary: o.items_summary,
      total: parseFloat(o.total) || 0,
      deliveryType: o.delivery_type || 'delivery',
      status: o.status
    }));

    return {
      rawMaterials,
      stock: Object.keys(stock).length > 0 ? stock : {
        'pizzeta-con-queso': 120,
        'paquete-10-prepizzetas': 48,
        'paquete-2-prepizzas-grandes': 32
      },
      resellers,
      resellerNotes,
      cashflow,
      orders,
      purchases: []
    };
  } catch (err) {
    console.error('Error al consultar Supabase:', err);
    return null;
  }
}

// Helpers para sincronizar cambios hacia Supabase en segundo plano
export async function dbUpsertRawMaterial(mat) {
  try {
    await supabase.from('di_borde_raw_materials').upsert({
      id: mat.id,
      name: mat.name,
      category: mat.category || 'Insumo',
      unit: mat.unit,
      current_stock: mat.currentStock,
      min_stock_alert: mat.minStockAlert,
      last_purchase_price: mat.lastPurchasePrice,
      last_purchase_pack: mat.lastPurchasePack || null,
      last_purchase_date: mat.lastPurchaseDate || null,
      supplier: mat.supplier || null,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Sync raw material error', e);
  }
}

export async function dbInsertCashflow(tx) {
  try {
    await supabase.from('di_borde_cashflow').insert({
      id: tx.id,
      date: tx.date,
      type: tx.type,
      category: tx.category,
      concept: tx.concept,
      amount: tx.amount,
      reference: tx.reference || null
    });
  } catch (e) {
    console.warn('Sync cashflow error', e);
  }
}

export async function dbInsertResellerNote(note) {
  try {
    await supabase.from('di_borde_reseller_notes').insert({
      id: note.id,
      reseller_id: note.resellerId || null,
      reseller_name: note.resellerName,
      date: note.date,
      type: note.type || 'sugerencia',
      content: note.content,
      status: note.status || 'pendiente_accion'
    });
  } catch (e) {
    console.warn('Sync reseller note error', e);
  }
}

export async function dbUpdateResellerNoteStatus(noteId, status) {
  try {
    await supabase
      .from('di_borde_reseller_notes')
      .update({ status })
      .eq('id', noteId);
  } catch (e) {
    console.warn('Sync note status error', e);
  }
}

export async function dbUpsertReseller(reseller) {
  try {
    await supabase.from('di_borde_resellers').upsert({
      id: reseller.id,
      name: reseller.name,
      email: reseller.email ? reseller.email.toLowerCase().trim() : null,
      phone: reseller.phone || null,
      zone: reseller.zone || null,
      initials: reseller.initials || reseller.name.slice(0, 2).toUpperCase(),
      status: reseller.status || 'activo',
      dni: reseller.dni || null,
      address: reseller.address || null,
      terms_accepted: !!reseller.termsAccepted,
      terms_accepted_at: reseller.termsAcceptedAt || null,
      interest_acknowledged: !!reseller.interestAcknowledged,
      emergency_contact: reseller.emergencyContact || null,
      debt_amount: reseller.debtAmount || 0,
      debt_reason: reseller.debtReason || null,
      debt_date: reseller.debtDate || null,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Sync reseller error', e);
  }
}

export async function dbDeleteReseller(resellerId) {
  try {
    await supabase.from('di_borde_resellers').delete().eq('id', resellerId);
  } catch (e) {
    console.warn('Delete reseller error', e);
  }
}


export async function dbInsertOrder(order) {
  try {
    await supabase.from('di_borde_orders').insert({
      id: order.id,
      date: order.date,
      customer_name: order.customerName,
      phone: order.phone || null,
      address: order.address || null,
      items_summary: order.itemsSummary,
      total: order.total || 0,
      delivery_type: order.deliveryType || 'delivery',
      status: order.status || 'pendiente'
    });
  } catch (e) {
    console.warn('Sync order error', e);
  }
}

export async function dbUpdateOrderStatus(orderId, status) {
  try {
    await supabase
      .from('di_borde_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
  } catch (e) {
    console.warn('Sync order status error', e);
  }
}
