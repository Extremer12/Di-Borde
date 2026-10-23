import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadAdminOpsState,
  saveAdminOpsState,
  calculateResellerAssignment
} from '../state/bordeOpsStore.js';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'di_borde_auth_user_v2';

export function AuthProvider({ children }) {
  const [opsState, setOpsState] = useState(() => loadAdminOpsState());

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load user', e);
    }
    // Por defecto, usuario null (requiere login)
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

  // Actualizar opsState y persistir
  const updateOpsState = (updater) => {
    setOpsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAdminOpsState(next);
      return next;
    });
  };

  // Login (administrador exclusivo o vendedores)
  const login = (username = '', password = '') => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Admin (PIN 1234, admin, diborde, etc.)
    if (
      (cleanUser === 'admin' || cleanUser === 'cristian' || cleanUser === 'diborde') &&
      (cleanPass === '1234' || cleanPass === 'admin' || cleanPass === '123' || cleanPass === 'diborde')
    ) {
      const user = {
        role: 'admin',
        username: 'admin',
        name: 'Cristian (Administrador Di Borde)'
      };
      setCurrentUser(user);
      return { success: true, role: 'admin' };
    }

    // 2. Check Resellers
    const foundReseller = opsState.resellers.find(
      (r) => r.id.toLowerCase() === cleanUser || r.name.toLowerCase().includes(cleanUser)
    );

    if (foundReseller && (cleanPass === '1234' || cleanPass === '123')) {
      const user = {
        role: 'reseller',
        resellerId: foundReseller.id,
        username: foundReseller.id,
        name: foundReseller.name
      };
      setCurrentUser(user);
      return { success: true, role: 'reseller', reseller: foundReseller };
    }

    return { success: false, message: 'Usuario o clave no válidos (Ejemplo: admin / 1234)' };
  };

  const loginAsAdmin = () => {
    const user = {
      role: 'admin',
      username: 'admin',
      name: 'Cristian (Administrador Di Borde)'
    };
    setCurrentUser(user);
    return { success: true };
  };

  const loginAsReseller = (resellerId) => {
    const foundReseller = opsState.resellers.find((r) => r.id === resellerId) || opsState.resellers[0];
    if (foundReseller) {
      const user = {
        role: 'reseller',
        resellerId: foundReseller.id,
        username: foundReseller.id,
        name: foundReseller.name
      };
      setCurrentUser(user);
      return { success: true, role: 'reseller', reseller: foundReseller };
    }
    return { success: false, message: 'Vendedor no encontrado' };
  };

  const logout = () => {
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

  const addReseller = ({ name, phone = '', zone = '' }) => {
    if (!name?.trim()) return { success: false, message: 'El nombre es obligatorio' };
    const id = `rev-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15)}-${Date.now().toString().slice(-3)}`;
    const newReseller = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      zone: zone.trim() || 'Chimbas',
      assigned: null,
      debtAmount: 0,
      debtReason: null,
      debtDate: null
    };

    updateOpsState((prev) => ({
      ...prev,
      resellers: [...prev.resellers, newReseller]
    }));

    return { success: true };
  };

  const deleteReseller = (resellerId) => {
    updateOpsState((prev) => ({
      ...prev,
      resellers: prev.resellers.filter((r) => r.id !== resellerId)
    }));
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
        deleteReseller,
        assignMercaderia,
        registerPayment,
        updateResellerDebt,
        addResellerNote,
        submitResellerReport,
        toggleResellerNoteStatus,
        createOrder,
        updateOrderStatus,
        addProductionStock
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
