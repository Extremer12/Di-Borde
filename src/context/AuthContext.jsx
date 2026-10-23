import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadAdminOpsState,
  saveAdminOpsState,
  calculateResellerAssignment
} from '../state/bordeOpsStore.js';
import {
  supabase,
  signInWithGoogle,
  signOutSupabase,
  fetchAllDataFromSupabase,
  dbUpsertRawMaterial,
  dbInsertCashflow,
  dbInsertResellerNote,
  dbUpdateResellerNoteStatus,
  dbUpsertReseller,
  dbDeleteReseller,
  dbInsertOrder,
  dbUpdateOrderStatus
} from '../lib/supabase.js';

export const ADMIN_EMAIL = 'cristianbordon186@gmail.com';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'di_borde_auth_user_v3';

// Función para determinar el rol y permisos según el correo de Google
export function resolveUserRole(email, resellers = []) {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  // 1. Administrador Central Único
  if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
    return {
      role: 'admin',
      email: cleanEmail,
      name: 'Cristian Bordón (Administrador Central)',
      isAdmin: true
    };
  }

  // 2. Vendedor Registrado por el Administrador
  const foundReseller = resellers.find(
    (r) => (r.email || '').toLowerCase().trim() === cleanEmail
  );

  if (foundReseller) {
    if (foundReseller.status === 'inactivo' || foundReseller.status === 'suspendido') {
      return {
        role: 'suspended',
        email: cleanEmail,
        name: foundReseller.name,
        resellerId: foundReseller.id,
        message: 'Tu cuenta de vendedor ha sido pausada temporalmente por la administración.'
      };
    }

    return {
      role: 'reseller',
      email: cleanEmail,
      name: foundReseller.name,
      resellerId: foundReseller.id,
      termsAccepted: !!foundReseller.termsAccepted,
      termsAcceptedAt: foundReseller.termsAcceptedAt || null,
      reseller: foundReseller
    };
  }

  // 3. Cuenta de Google no registrada en la nómina
  return {
    role: 'unauthorized',
    email: cleanEmail,
    message: 'Este correo de Google no figura en la nómina de vendedores autorizados de Di Borde.'
  };
}

export function AuthProvider({ children }) {
  const [opsState, setOpsState] = useState(() => loadAdminOpsState());
  const [googleUser, setGoogleUser] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load user', e);
    }
    return null;
  });

  // Guardar usuario en localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Sincronizar datos iniciales desde Supabase y escuchar Google Auth
  useEffect(() => {
    let isMounted = true;

    // 1. Cargar datos remotos
    fetchAllDataFromSupabase().then((remoteData) => {
      if (isMounted && remoteData) {
        setOpsState((prev) => {
          const merged = {
            ...prev,
            rawMaterials: remoteData.rawMaterials?.length ? remoteData.rawMaterials : prev.rawMaterials,
            stock: remoteData.stock || prev.stock,
            resellers: remoteData.resellers?.length ? remoteData.resellers : prev.resellers,
            resellerNotes: remoteData.resellerNotes?.length ? remoteData.resellerNotes : prev.resellerNotes,
            cashflow: remoteData.cashflow?.length ? remoteData.cashflow : prev.cashflow,
            orders: remoteData.orders?.length ? remoteData.orders : prev.orders
          };
          saveAdminOpsState(merged);
          return merged;
        });
      }
    });

    // 2. Obtener sesión activa existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted && session?.user) {
        setGoogleUser(session.user);
      }
    });

    // 3. Escuchar cambios de autenticación con Google
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (session?.user) {
          setGoogleUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setGoogleUser(null);
          setCurrentUser(null);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Evaluar rol del usuario cada vez que cambia googleUser o la nómina de vendedores
  useEffect(() => {
    if (!googleUser) {
      return;
    }

    const email = (googleUser.email || '').toLowerCase().trim();
    const resolved = resolveUserRole(email, opsState.resellers);

    if (resolved) {
      setCurrentUser((prev) => ({
        ...resolved,
        avatarUrl: googleUser.user_metadata?.avatar_url || prev?.avatarUrl || null,
        googleName: googleUser.user_metadata?.full_name || prev?.googleName || null
      }));
    }
  }, [googleUser, opsState.resellers]);

  // Actualizar opsState y persistir
  const updateOpsState = (updater) => {
    setOpsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAdminOpsState(next);
      return next;
    });
  };

  const login = () => ({ success: false, message: 'Acceso exclusivo mediante Google Auth.' });

  const loginAsAdmin = () => {
    setCurrentUser({
      role: 'admin',
      email: ADMIN_EMAIL,
      name: 'Cristian Bordón (Administrador Central)',
      isAdmin: true
    });
  };

  const loginAsReseller = (resellerId) => {
    const foundReseller = opsState.resellers.find((r) => r.id === resellerId);
    if (foundReseller) {
      setCurrentUser({
        role: 'reseller',
        email: foundReseller.email || `${foundReseller.id}@diborde.com`,
        name: foundReseller.name,
        resellerId: foundReseller.id,
        termsAccepted: !!foundReseller.termsAccepted,
        termsAcceptedAt: foundReseller.termsAcceptedAt,
        reseller: foundReseller
      });
    }
  };

  // Cierre de sesión completo (Supabase + local)
  const logout = async () => {
    try {
      await signOutSupabase();
    } catch (e) {
      console.warn('SignOut error', e);
    }
    setGoogleUser(null);
    setCurrentUser(null);
  };


  // --------------------------------------------------------------------------
  // MÓDULO 1: COMPRA DE INSUMOS Y GESTIÓN DE MATERIAS PRIMAS
  // --------------------------------------------------------------------------
  const addRawMaterialPurchase = ({ materialId, quantity, unitPrice, supplier = '', notes = '' }) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    if (qty <= 0) return { success: false, message: 'Cantidad no válida' };

    const totalAmount = Math.round(qty * price);
    const dateStr = new Date().toLocaleDateString('es-AR');

    updateOpsState((prev) => {
      // 1. Buscar insumo y actualizar stock y precio
      const targetMat = prev.rawMaterials.find((m) => m.id === materialId);
      const matName = targetMat ? targetMat.name : 'Insumo';
      const matUnit = targetMat ? targetMat.unit : 'unid.';

      const updatedRawMaterials = prev.rawMaterials.map((mat) => {
        if (mat.id !== materialId) return mat;
        return {
          ...mat,
          currentStock: Math.round((mat.currentStock + qty) * 100) / 100,
          lastPurchasePrice: price,
          lastPurchaseDate: dateStr,
          supplier: supplier || mat.supplier
        };
      });

      // 2. Crear registro de compra
      const newPurchase = {
        id: `PUR-${Date.now().toString().slice(-4)}`,
        date: dateStr,
        materialId,
        materialName: matName,
        quantity: qty,
        unit: matUnit,
        unitPrice: price,
        totalAmount,
        supplier: supplier || (targetMat ? targetMat.supplier : 'Proveedor'),
        notes
      };

      // 3. Crear egreso automático en caja
      const newCashflow = {
        id: `CF-${Date.now().toString().slice(-5)}`,
        date: dateStr,
        type: 'egreso',
        category: 'Compra Insumos',
        concept: `Compra ${qty} ${matUnit} de ${matName}`,
        amount: totalAmount,
        reference: newPurchase.id
      };

      return {
        ...prev,
        rawMaterials: updatedRawMaterials,
        purchases: [newPurchase, ...prev.purchases],
        cashflow: [newCashflow, ...prev.cashflow]
      };
    });

    return { success: true };
  };

  const updateRawMaterialStock = (materialId, newStock) => {
    const val = parseFloat(newStock) || 0;
    updateOpsState((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((m) =>
        m.id === materialId ? { ...m, currentStock: Math.max(0, val) } : m
      )
    }));
  };

  const addRawMaterial = ({ name, category = 'Insumo', unit = 'unid.', currentStock = 0, minStockAlert = 5, lastPurchasePrice = 0, supplier = '' }) => {
    if (!name?.trim()) return { success: false, message: 'El nombre del insumo es obligatorio' };
    const cleanId = `mat-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}-${Date.now().toString().slice(-4)}`;
    const newMaterial = {
      id: cleanId,
      name: name.trim(),
      category: category.trim() || 'Insumo',
      unit: unit.trim() || 'unid.',
      currentStock: parseFloat(currentStock) || 0,
      minStockAlert: parseFloat(minStockAlert) || 0,
      lastPurchasePrice: parseFloat(lastPurchasePrice) || 0,
      lastPurchaseDate: new Date().toLocaleDateString('es-AR'),
      supplier: supplier.trim() || 'Proveedor'
    };

    updateOpsState((prev) => ({
      ...prev,
      rawMaterials: [...prev.rawMaterials, newMaterial]
    }));

    return { success: true };
  };

  const deleteRawMaterial = (materialId) => {
    updateOpsState((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((m) => m.id !== materialId)
    }));
  };

  // --------------------------------------------------------------------------
  // MÓDULO 2: INGRESOS Y EGRESOS (CAJA / FINANZAS)
  // --------------------------------------------------------------------------
  const addCashflowTransaction = ({ type = 'ingreso', category = 'Venta', concept = '', amount = 0, reference = '' }) => {
    const amt = Math.max(0, parseInt(amount) || 0);
    if (amt <= 0) return { success: false, message: 'El monto debe ser mayor a 0' };

    const dateStr = new Date().toLocaleDateString('es-AR');
    const newTx = {
      id: `CF-${Date.now().toString().slice(-5)}`,
      date: dateStr,
      type,
      category,
      concept: concept || (type === 'ingreso' ? 'Ingreso registrado' : 'Egreso operativo'),
      amount: amt,
      reference
    };

    updateOpsState((prev) => ({
      ...prev,
      cashflow: [newTx, ...prev.cashflow]
    }));

    return { success: true };
  };

  const deleteCashflowTransaction = (txId) => {
    updateOpsState((prev) => ({
      ...prev,
      cashflow: prev.cashflow.filter((tx) => tx.id !== txId)
    }));
  };

  // --------------------------------------------------------------------------
  // MÓDULO 3: VENDEDORES, MERCADERÍA Y RENDICIÓN
  // --------------------------------------------------------------------------
  const assignMercaderia = (resellerId, { pizzetasQueso = 0, paquetes10 = 0, paquetesGrandes = 0, note = '' }) => {
    const pQ = Math.max(0, parseInt(pizzetasQueso) || 0);
    const p10 = Math.max(0, parseInt(paquetes10) || 0);
    const pG = Math.max(0, parseInt(paquetesGrandes) || 0);

    const totals = calculateResellerAssignment(pQ, p10, pG);

    updateOpsState((prev) => {
      // 1. Descontar del stock de producto terminado en el obrador
      const newStock = {
        'pizzeta-con-queso': Math.max(0, prev.stock['pizzeta-con-queso'] - pQ),
        'paquete-10-prepizzetas': Math.max(0, prev.stock['paquete-10-prepizzetas'] - p10),
        'paquete-2-prepizzas-grandes': Math.max(0, prev.stock['paquete-2-prepizzas-grandes'] - pG)
      };

      // 2. Asignar al vendedor
      const updatedResellers = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        return {
          ...r,
          assigned: {
            pizzetasQueso: pQ,
            paquetes10: p10,
            paquetesGrandes: pG,
            totalPvp: totals.totalPvp,
            totalRendicion: totals.totalRendicion,
            gananciaVendedor: totals.gananciaVendedor,
            rendicionCobrada: 0,
            renditionStatus: 'debe_rendir',
            assignedDate: note || `Hoy ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`
          }
        };
      });

      return {
        ...prev,
        stock: newStock,
        resellers: updatedResellers
      };
    });

    return { success: true };
  };

  const registerPayment = (resellerId, amount) => {
    const pay = Math.max(0, parseInt(amount) || 0);
    if (pay <= 0) return;

    const dateStr = new Date().toLocaleDateString('es-AR');

    updateOpsState((prev) => {
      let resellerName = 'Vendedor';

      const updatedResellers = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        resellerName = r.name;

        const currentPaid = r.assigned ? r.assigned.rendicionCobrada || 0 : 0;
        const newPaid = currentPaid + pay;
        const target = r.assigned ? r.assigned.totalRendicion : 0;

        let status = 'parcial';
        if (newPaid >= target) status = 'al_dia';

        return {
          ...r,
          assigned: r.assigned
            ? {
                ...r.assigned,
                rendicionCobrada: newPaid,
                renditionStatus: status
              }
            : null
        };
      });

      // Registrar ingreso automático en Caja
      const newIncome = {
        id: `CF-${Date.now().toString().slice(-5)}`,
        date: dateStr,
        type: 'ingreso',
        category: 'Rendición Vendedor',
        concept: `Cobro rendición de ${resellerName}`,
        amount: pay,
        reference: resellerId
      };

      return {
        ...prev,
        resellers: updatedResellers,
        cashflow: [newIncome, ...prev.cashflow]
      };
    });
  };

  const updateResellerDebt = (resellerId, debtAmount, debtReason) => {
    const debt = Math.max(0, parseInt(debtAmount) || 0);

    updateOpsState((prev) => ({
      ...prev,
      resellers: prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        return {
          ...r,
          debtAmount: debt,
          debtReason: debtReason || (debt > 0 ? 'Saldo pendiente de rendición' : null),
          debtDate: debt > 0 ? new Date().toLocaleDateString('es-AR') : null
        };
      })
    }));
  };

  const addReseller = async ({ name, email, phone = '', zone = '', dni = '', address = '' }) => {
    if (!name?.trim()) return { success: false, message: 'El nombre es obligatorio' };
    const cleanEmail = (email || '').trim().toLowerCase();
    const id = `rev-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15)}-${Date.now().toString().slice(-3)}`;
    const initials = name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    const newReseller = {
      id,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      zone: zone.trim() || 'Chimbas',
      dni: dni.trim(),
      address: address.trim(),
      initials,
      status: 'activo',
      termsAccepted: false,
      termsAcceptedAt: null,
      interestAcknowledged: false,
      emergencyContact: '',
      assigned: null,
      debtAmount: 0,
      debtReason: null,
      debtDate: null
    };

    updateOpsState((prev) => ({
      ...prev,
      resellers: [...prev.resellers, newReseller]
    }));

    dbUpsertReseller(newReseller);
    return { success: true, reseller: newReseller };
  };

  const updateReseller = async (resellerId, updates) => {
    let updatedTarget = null;
    updateOpsState((prev) => {
      const updated = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        updatedTarget = {
          ...r,
          ...updates,
          email: updates.email !== undefined ? updates.email.trim().toLowerCase() : r.email
        };
        return updatedTarget;
      });
      return { ...prev, resellers: updated };
    });

    if (updatedTarget) {
      dbUpsertReseller(updatedTarget);
    }
    return { success: true };
  };

  const deleteReseller = async (resellerId) => {
    updateOpsState((prev) => ({
      ...prev,
      resellers: prev.resellers.filter((r) => r.id !== resellerId)
    }));
    dbDeleteReseller(resellerId);
  };

  const submitResellerCommitment = async ({ resellerId, dni, phone, address, emergencyContact }) => {
    const nowIso = new Date().toISOString();
    let updatedResellerObj = null;

    updateOpsState((prev) => {
      const updated = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        updatedResellerObj = {
          ...r,
          dni: dni ? dni.trim() : r.dni,
          phone: phone ? phone.trim() : r.phone,
          address: address ? address.trim() : r.address,
          emergencyContact: emergencyContact ? emergencyContact.trim() : r.emergencyContact,
          termsAccepted: true,
          termsAcceptedAt: nowIso,
          interestAcknowledged: true
        };
        return updatedResellerObj;
      });
      return { ...prev, resellers: updated };
    });

    if (updatedResellerObj) {
      await dbUpsertReseller(updatedResellerObj);
    }

    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        termsAccepted: true,
        termsAcceptedAt: nowIso
      };
    });

    return { success: true };
  };


  // --------------------------------------------------------------------------
  // MÓDULO 4: REPORTES DE VENTAS Y SUGERENCIAS DE VENDEDORES
  // --------------------------------------------------------------------------
  const addResellerNote = ({ resellerId, resellerName, type = 'sugerencia', content = '' }) => {
    if (!content.trim()) return { success: false, message: 'El contenido no puede estar vacío' };

    const newNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      resellerId: resellerId || 'general',
      resellerName: resellerName || 'Vendedor',
      date: `Hoy ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
      type,
      content,
      status: 'pendiente_accion'
    };

    updateOpsState((prev) => ({
      ...prev,
      resellerNotes: [newNote, ...prev.resellerNotes]
    }));

    return { success: true };
  };

  const submitResellerReport = ({ resellerId, resellerName, type = 'venta', content = '', salesDetails = null }) => {
    let formattedContent = (content || '').trim();
    if (salesDetails) {
      const { pizzetasSold = 0, paquetes10Sold = 0, paquetesGrandesSold = 0, location = '', notes = '' } = salesDetails;
      const parts = [];
      if (pizzetasSold > 0) parts.push(`${pizzetasSold} pizzetas con queso`);
      if (paquetes10Sold > 0) parts.push(`${paquetes10Sold} paq. x10`);
      if (paquetesGrandesSold > 0) parts.push(`${paquetesGrandesSold} paq. grandes x2`);

      const soldText = parts.length > 0 ? parts.join(', ') : 'Venta del turno';
      formattedContent = `Reporte de ventas: vendió ${soldText}. Zona: ${location || 'calle'}.${notes ? ` Nota: ${notes}` : ''} ${formattedContent ? `| ${formattedContent}` : ''}`.trim();
    }

    if (!formattedContent) {
      return { success: false, message: 'El contenido del reporte no puede estar vacío' };
    }

    const newNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      resellerId: resellerId || 'general',
      resellerName: resellerName || 'Vendedor',
      date: `Hoy ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
      type,
      content: formattedContent,
      status: 'pendiente_accion'
    };

    updateOpsState((prev) => ({
      ...prev,
      resellerNotes: [newNote, ...prev.resellerNotes]
    }));

    return { success: true };
  };

  const toggleResellerNoteStatus = (noteId) => {
    updateOpsState((prev) => ({
      ...prev,
      resellerNotes: prev.resellerNotes.map((n) => {
        if (n.id !== noteId) return n;
        return {
          ...n,
          status: n.status === 'leido' ? 'pendiente_accion' : 'leido'
        };
      })
    }));
  };

  // --------------------------------------------------------------------------
  // MÓDULO 5: PEDIDOS DE CLIENTES Y COMERCIOS
  // --------------------------------------------------------------------------
  const createOrder = (orderData) => {
    const newOrder = {
      id: `PED-${Math.floor(100 + Math.random() * 900)}`,
      date: `Hoy ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'pendiente',
      ...orderData
    };

    updateOpsState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));

    return { success: true };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    updateOpsState((prev) => {
      const target = prev.orders.find((o) => o.id === orderId);

      // Si pasa a entregado y cobrado, y no estaba ya cobrado, sumar ingreso a Caja
      let newCashflow = prev.cashflow;
      if (newStatus === 'entregado_cobrado' && target && target.status !== 'entregado_cobrado') {
        newCashflow = [
          {
            id: `CF-${Date.now().toString().slice(-5)}`,
            date: new Date().toLocaleDateString('es-AR'),
            type: 'ingreso',
            category: 'Venta Pedido',
            concept: `Cobro ${target.id} (${target.customerName})`,
            amount: target.total || 0,
            reference: target.id
          },
          ...prev.cashflow
        ];
      }

      return {
        ...prev,
        orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        cashflow: newCashflow
      };
    });
  };

  const addProductionStock = (productId, qty) => {
    const add = parseInt(qty) || 0;
    if (add <= 0) return;

    updateOpsState((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [productId]: (prev.stock[productId] || 0) + add
      }
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        opsState,
        login,
        loginAsAdmin,
        loginAsReseller,
        logout,
        addRawMaterial,
        deleteRawMaterial,
        addRawMaterialPurchase,
        updateRawMaterialStock,
        addCashflowTransaction,
        deleteCashflowTransaction,
        addReseller,
        updateReseller,
        deleteReseller,
        submitResellerCommitment,
        assignMercaderia,
        registerPayment,
        updateResellerDebt,
        addResellerNote,
        submitResellerReport,
        toggleResellerNoteStatus,
        createOrder,
        updateOrderStatus,
        addProductionStock,
        signInWithGoogle,
        ADMIN_EMAIL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
