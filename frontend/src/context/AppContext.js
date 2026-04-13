import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEMO_USERS, DEMO_WASTE_ENTRIES, DEMO_PROCESSING_LOGS,
  DEMO_INVESTMENTS, DEMO_NOTIFICATIONS, DEMO_PLANTS,
  CARBON_CREDIT_FACTORS, PAYMENT_RATES, CBG_CONVERSION, MANURE_CONVERSION
} from '../data/seedData';

const AppContext = createContext(null);

const STORAGE_KEY = 'neo_circular_ledger';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) { /* ignore */ }
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      wasteEntries: state.wasteEntries,
      processingLogs: state.processingLogs,
      investments: state.investments,
      notifications: state.notifications,
      plants: state.plants,
      users: state.users,
    }));
  } catch (e) { /* ignore */ }
}

export function AppProvider({ children }) {
  const stored = loadFromStorage();
  const [currentUser, setCurrentUser] = useState(null);
  const [users] = useState(stored?.users || DEMO_USERS);
  const [wasteEntries, setWasteEntries] = useState(stored?.wasteEntries || DEMO_WASTE_ENTRIES);
  const [processingLogs, setProcessingLogs] = useState(stored?.processingLogs || DEMO_PROCESSING_LOGS);
  const [investments, setInvestments] = useState(stored?.investments || DEMO_INVESTMENTS);
  const [notifications, setNotifications] = useState(stored?.notifications || DEMO_NOTIFICATIONS);
  const [plants] = useState(stored?.plants || DEMO_PLANTS);

  useEffect(() => {
    saveToStorage({ wasteEntries, processingLogs, investments, notifications, plants, users });
  }, [wasteEntries, processingLogs, investments, notifications, plants, users]);

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const addWasteEntry = useCallback((entry) => {
    const carbonCredits = parseFloat((entry.quantity * CARBON_CREDIT_FACTORS[entry.wasteType]).toFixed(4));
    const payment = parseFloat((entry.quantity * PAYMENT_RATES[entry.wasteType]).toFixed(2));
    const newEntry = {
      id: `we-${Date.now()}`,
      userId: currentUser?.id,
      wardName: currentUser?.ward || 'Unknown',
      wasteType: entry.wasteType,
      quantity: entry.quantity,
      payment,
      carbonCredits,
      timestamp: new Date().toISOString(),
      paymentStatus: 'pending',
    };
    setWasteEntries(prev => [newEntry, ...prev]);
    addNotification(currentUser?.id, `Waste entry recorded: ${entry.quantity}kg ${entry.wasteType.replace('_', ' ')}`, 'supply');
    return newEntry;
  }, [currentUser]);

  const addProcessingLog = useCallback((log) => {
    const cbgOutput = parseFloat((log.wasteProcessed * (CBG_CONVERSION[log.wasteType] || 0.05)).toFixed(2));
    const manureGenerated = parseFloat((log.wasteProcessed * (MANURE_CONVERSION[log.wasteType] || 0.35)).toFixed(2));
    const carbonCredits = parseFloat((log.wasteProcessed * (CARBON_CREDIT_FACTORS[log.wasteType] || 0.0015)).toFixed(4));
    const newLog = {
      id: `pl-${Date.now()}`,
      plantId: currentUser?.plantId || 'unknown',
      wardName: log.wardName,
      wasteType: log.wasteType,
      wasteReceived: log.wasteReceived,
      wasteProcessed: log.wasteProcessed,
      cbgOutput,
      manureGenerated,
      carbonCredits,
      timestamp: new Date().toISOString(),
    };
    setProcessingLogs(prev => [newLog, ...prev]);
    return newLog;
  }, [currentUser]);

  const addInvestment = useCallback((inv) => {
    const plant = plants.find(p => p.id === inv.plantId);
    const newInv = {
      id: `inv-${Date.now()}`,
      investorId: currentUser?.id,
      plantId: inv.plantId,
      plantName: plant?.name || 'Unknown Plant',
      amount: inv.amount,
      returns: 0,
      irr: plant?.roi || 0,
      timestamp: new Date().toISOString(),
    };
    setInvestments(prev => [newInv, ...prev]);
    addNotification(currentUser?.id, `Investment of Rs ${inv.amount.toLocaleString('en-IN')} in ${plant?.name} confirmed`, 'investment');
    return newInv;
  }, [currentUser, plants]);

  const addNotification = useCallback((userId, message, type) => {
    const n = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [n, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, []);

  const value = {
    currentUser,
    users,
    wasteEntries,
    processingLogs,
    investments,
    notifications,
    plants,
    login,
    logout,
    addWasteEntry,
    addProcessingLog,
    addInvestment,
    addNotification,
    markNotificationRead,
    CARBON_CREDIT_FACTORS,
    PAYMENT_RATES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
