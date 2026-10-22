import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadOpsState, saveOpsState, calculateAssignmentTotals } from '../state/bordeOpsStore.js';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'di_borde_auth_user_v1';

export function AuthProvider({ children }) {
  const [opsState, setOpsState] = useState(() => loadOpsState());

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

  // Actualizar opsState y persistir
  const updateOpsState = (updater) => {
    setOpsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveOpsState(next);
      return next;
    });
  };

  // Login
  const login = (username = '', password = '') => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Admin
    if (cleanUser === 'admin' && (cleanPass === 'admin' || cleanPass === '123' || cleanPass === 'admin123' || cleanPass === 'diborde')) {
      const user = {
        role: 'admin',
        username: 'admin',
        name: 'Julián (Administrador Di Borde)'
      };
      setCurrentUser(user);
      return { success: true, role: 'admin' };
    }

    // 2. Check Resellers
    const foundReseller = opsState.resellers.find(
      (r) => r.username.toLowerCase() === cleanUser && (r.password === cleanPass || cleanPass === '123')
    );

    if (foundReseller) {
      const user = {
        role: 'reseller',
        resellerId: foundReseller.id,
        username: foundReseller.username,
        name: foundReseller.name
      };
      setCurrentUser(user);
      return { success: true, role: 'reseller', reseller: foundReseller };
    }

    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  };

  // Quick switch para pruebas sin escribir
  const quickLoginAs = (role, resellerId = null) => {
    if (role === 'admin') {
      const user = {
        role: 'admin',
        username: 'admin',
        name: 'Julián (Administrador Di Borde)'
      };
      setCurrentUser(user);
    } else if (role === 'reseller' && resellerId) {
      const r = opsState.resellers.find((item) => item.id === resellerId);
      if (r) {
        const user = {
          role: 'reseller',
          resellerId: r.id,
          username: r.username,
          name: r.name
        };
        setCurrentUser(user);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Acciones de Negocio / Obrador

  // 1. Asignar mercadería a un revendedor (descuenta stock)
  const assignMercaderia = (resellerId, { pizzetasQueso = 0, paquetes10 = 0, paquetesGrandes = 0, note = '' }) => {
    const pQ = Math.max(0, parseInt(pizzetasQueso) || 0);
    const p10 = Math.max(0, parseInt(paquetes10) || 0);
    const pG = Math.max(0, parseInt(paquetesGrandes) || 0);

    const totals = calculateAssignmentTotals(pQ, p10, pG);

    updateOpsState((prev) => {
      // Descontar stock
      const newStock = {
        'pizzeta-con-queso': Math.max(0, prev.stock['pizzeta-con-queso'] - pQ),
        'paquete-10-prepizzetas': Math.max(0, prev.stock['paquete-10-prepizzetas'] - p10),
        'paquete-2-prepizzas-grandes': Math.max(0, prev.stock['paquete-2-prepizzas-grandes'] - pG)
      };

      // Actualizar revendedor
      const updatedResellers = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        return {
          ...r,
          activeAssignment: {
            date: note || 'Hoy (Nuevo lote)',
            pizzetasQueso: pQ,
            paquetes10: p10,
            paquetesGrandes: pG,
            totalPvp: totals.totalPvp,
            totalRendicion: totals.totalRendicion,
            gananciaChico: totals.gananciaChico,
            rendicionPagada: 0,
            status: 'pending'
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

  // 2. Registrar cobro / rendición de un revendedor
  const registerPayment = (resellerId, amount) => {
    const pay = Math.max(0, parseInt(amount) || 0);

    updateOpsState((prev) => {
      const updatedResellers = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;

        const currentPaid = r.activeAssignment ? r.activeAssignment.rendicionPagada || 0 : 0;
        const newPaid = currentPaid + pay;
        const target = r.activeAssignment ? r.activeAssignment.totalRendicion : 0;

        let status = 'partial';
        if (newPaid >= target) status = 'paid';

        return {
          ...r,
          activeAssignment: r.activeAssignment
            ? {
                ...r.activeAssignment,
                rendicionPagada: newPaid,
                status
              }
            : null
        };
      });

      return {
        ...prev,
        resellers: updatedResellers
      };
    });
  };

  // 3. Registrar o actualizar Saldo en Rojo (Deuda)
  const updateResellerDebt = (resellerId, debtAmount, debtReason) => {
    const debt = Math.max(0, parseInt(debtAmount) || 0);

    updateOpsState((prev) => {
      const updatedResellers = prev.resellers.map((r) => {
        if (r.id !== resellerId) return r;
        return {
          ...r,
          debtAmount: debt,
          debtReason: debtReason || (debt > 0 ? 'Saldo deudor pendiente' : null),
          debtDate: debt > 0 ? new Date().toLocaleDateString('es-AR') : null
        };
      });

      return {
        ...prev,
        resellers: updatedResellers
      };
    });
  };

  // 4. Sumar stock de producción horneada
  const addProductionStock = (productId, qty) => {
    const add = parseInt(qty) || 0;
    if (add <= 0) return;

    updateOpsState((prev) => {
      const current = prev.stock[productId] || 0;
      return {
        ...prev,
        stock: {
          ...prev.stock,
          [productId]: current + add
        }
      };
    });
  };

  // 5. Crear pedido de cliente
  const createOrder = (orderData) => {
    const newOrder = {
      id: `PED-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Reciente',
      status: 'pendiente',
      ...orderData
    };

    updateOpsState((prev) => {
      return {
        ...prev,
        orders: [newOrder, ...prev.orders]
      };
    });
  };

  // 6. Cambiar estado de pedido
  const updateOrderStatus = (orderId, newStatus) => {
    updateOpsState((prev) => {
      return {
        ...prev,
        orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        opsState,
        login,
        quickLoginAs,
        logout,
        assignMercaderia,
        registerPayment,
        updateResellerDebt,
        addProductionStock,
        createOrder,
        updateOrderStatus
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
