import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Location,
  MenuItem,
  Table,
  QueueTicket,
  Booking,
  Order,
  OrderItem,
  InventoryItem,
  WastageLog,
  Supplier,
  PurchaseOrder,
  Feedback,
  HRStaff,
  CMSProject,
  UserRole,
  DietaryType
} from '../types';
import {
  initialLocations,
  initialMenuItems,
  initialTables,
  initialQueue,
  initialBookings,
  initialOrders,
  initialInventory,
  initialWastageLogs,
  initialSuppliers,
  initialPurchaseOrders,
  initialFeedback,
  initialHRStaff,
  initialCMSProjects
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeLocationId: string;
  setActiveLocationId: (id: string) => void;
  activeLocation: Location;
  locations: Location[];

  // Toast
  toasts: Toast[];
  showToast: (title: string, message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Menu & Catalog Management
  menuItems: MenuItem[];
  addMenuItem: (itemData: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemLocationAvailability: (itemId: string, locationId: string) => void;
  cart: OrderItem[];
  addToCart: (item: MenuItem, customization?: OrderItem['customization']) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  dietaryFilter: DietaryType | 'all';
  setDietaryFilter: (filter: DietaryType | 'all') => void;

  // Tables & Sections Management
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table['status'], partyName?: string, partySize?: number) => void;
  seatQueueTicketAtTable: (ticketId: string, tableId: string) => void;
  addTable: (tableData: Omit<Table, 'id'>) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  deleteTable: (tableId: string) => void;
  customSections: string[];
  addCustomSection: (sectionName: string) => void;
  deleteCustomSection: (sectionName: string) => void;

  // Queue
  queue: QueueTicket[];
  joinQueue: (name: string, phone: string, partySize: number, dietary: 'all' | 'veg' | 'vegan' | 'jain', notes?: string) => QueueTicket;
  updateQueueStatus: (ticketId: string, status: QueueTicket['status']) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'bookingRef' | 'createdAt' | 'status'>) => Booking;
  cancelBooking: (id: string) => void;

  // Orders & Kitchen Display System (KDS)
  orders: Order[];
  placeOrder: (type: Order['type'], tableNumber?: string, customerName?: string, customerPhone?: string, specialNotes?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  revertOrderStatus: (orderId: string) => void;
  processPayment: (orderId: string, method: Order['paymentMethod'], discount?: number) => void;

  // Kitchen Inventory & Wastage
  inventory: InventoryItem[];
  wastageLogs: WastageLog[];
  logWastage: (itemId: string, quantity: number, reason: WastageLog['reason'], loggedBy: string, notes?: string) => void;
  restockInventory: (itemId: string, quantity: number) => void;

  // Suppliers & POs
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  createPurchaseOrder: (supplierId: string, items: { itemName: string; quantity: number; unit: string; unitPrice: number }[], deliveryDate: string) => PurchaseOrder;
  updatePOStatus: (poId: string, status: PurchaseOrder['status']) => void;

  // Feedback
  feedbacks: Feedback[];
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'date' | 'verifiedVisit'>) => void;

  // HR Staff Management (Add, Update, Remove, Clock-in)
  staff: HRStaff[];
  toggleClockIn: (staffId: string) => void;
  addStaff: (staffData: Omit<HRStaff, 'id' | 'isClockedIn'>) => void;
  updateStaff: (id: string, updates: Partial<HRStaff>) => void;
  removeStaff: (id: string) => void;

  // CMS Projects & Content
  cmsProjects: CMSProject[];
  addCMSProject: (project: Omit<CMSProject, 'id'>) => void;
  updateCMSProject: (id: string, updates: Partial<CMSProject>) => void;
  deleteCMSProject: (id: string) => void;

  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`aromacraft_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const defaultSections = [
    'Main Hall', 
    'Window Lounge', 
    'Outdoor Terrace', 
    'Private Roastery Room'
  ];

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeLocationId, setActiveLocationId] = useState<string>('loc-1');
  const [locations, setLocations] = useState<Location[]>(() => loadStored('locations', initialLocations));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const loaded = loadStored<MenuItem[]>('menu', initialMenuItems);
    return loaded.map(item => ({
      ...item,
      availableLocationIds: item.availableLocationIds && item.availableLocationIds.length > 0
        ? item.availableLocationIds
        : ['loc-1', 'loc-2', 'loc-3']
    }));
  });
  const [tables, setTables] = useState<Table[]>(() => {
    const loaded = loadStored<Table[]>('tables', initialTables);
    return loaded.map(tbl => ({
      ...tbl,
      cctvCameraId: tbl.cctvCameraId || `CAM-${tbl.tableNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
      cctvStatus: tbl.cctvStatus || 'recording',
      cctvResolution: tbl.cctvResolution || '1080p 30fps'
    }));
  });
  const [customSections, setCustomSections] = useState<string[]>(() => loadStored('custom_sections', defaultSections));
  const [queue, setQueue] = useState<QueueTicket[]>(() => loadStored('queue', initialQueue));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStored('bookings', initialBookings));
  const [orders, setOrders] = useState<Order[]>(() => loadStored('orders', initialOrders));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadStored('inventory', initialInventory));
  const [wastageLogs, setWastageLogs] = useState<WastageLog[]>(() => loadStored('wastage', initialWastageLogs));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStored('suppliers', initialSuppliers));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadStored('pos', initialPurchaseOrders));
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => loadStored('feedback', initialFeedback));
  const [staff, setStaff] = useState<HRStaff[]>(() => loadStored('staff', initialHRStaff));
  const [cmsProjects, setCmsProjects] = useState<CMSProject[]>(() => loadStored('cms', initialCMSProjects));

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aromacraft_locations', JSON.stringify(locations));
    localStorage.setItem('aromacraft_menu', JSON.stringify(menuItems));
    localStorage.setItem('aromacraft_tables', JSON.stringify(tables));
    localStorage.setItem('aromacraft_custom_sections', JSON.stringify(customSections));
    localStorage.setItem('aromacraft_queue', JSON.stringify(queue));
    localStorage.setItem('aromacraft_bookings', JSON.stringify(bookings));
    localStorage.setItem('aromacraft_orders', JSON.stringify(orders));
    localStorage.setItem('aromacraft_inventory', JSON.stringify(inventory));
    localStorage.setItem('aromacraft_wastage', JSON.stringify(wastageLogs));
    localStorage.setItem('aromacraft_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('aromacraft_pos', JSON.stringify(purchaseOrders));
    localStorage.setItem('aromacraft_feedback', JSON.stringify(feedbacks));
    localStorage.setItem('aromacraft_staff', JSON.stringify(staff));
    localStorage.setItem('aromacraft_cms', JSON.stringify(cmsProjects));
  }, [locations, menuItems, tables, customSections, queue, bookings, orders, inventory, wastageLogs, suppliers, purchaseOrders, feedbacks, staff, cmsProjects]);

  const activeLocation = locations.find(l => l.id === activeLocationId) || locations[0];

  const showToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (item: MenuItem, customization?: OrderItem['customization']) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id && JSON.stringify(i.customization) === JSON.stringify(customization));
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, customization }];
    });
    showToast('Added to Order', `${item.name} added to your tray`, 'success');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...item, quantity: newQty };
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Central Menu Management Operations (Add, Edit, Delete, Location Availability)
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: 'menu-' + Date.now(),
      availableLocationIds: itemData.availableLocationIds && itemData.availableLocationIds.length > 0
        ? itemData.availableLocationIds
        : locations.map(l => l.id),
      dietary: itemData.dietary || ['veg'],
      ingredients: itemData.ingredients || [],
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
    };
    setMenuItems(prev => [newItem, ...prev]);
    showToast('Menu Item Created', `${newItem.name} added to central catalog`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showToast('Menu Item Updated', 'Changes saved to menu catalog', 'success');
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find(m => m.id === id);
    setMenuItems(prev => prev.filter(m => m.id !== id));
    showToast('Menu Item Removed', `${item?.name || 'Item'} deleted from catalog`, 'info');
  };

  const toggleItemLocationAvailability = (itemId: string, locationId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentLocs = item.availableLocationIds || locations.map(l => l.id);
        const isCurrentlyAvailable = currentLocs.includes(locationId);
        const newLocs = isCurrentlyAvailable 
          ? currentLocs.filter(id => id !== locationId)
          : [...currentLocs, locationId];
        
        const targetLoc = locations.find(l => l.id === locationId);
        showToast(
          isCurrentlyAvailable ? 'Disabled for Branch' : 'Enabled for Branch',
          `"${item.name}" is now ${isCurrentlyAvailable ? 'hidden at' : 'available at'} ${targetLoc?.name || 'selected branch'}`,
          isCurrentlyAvailable ? 'warning' : 'success'
        );
        return {
          ...item,
          availableLocationIds: newLocs
        };
      }
      return item;
    }));
  };

  // Table Management (Status, Seating, Add, Edit, Remove, Sections)
  const updateTableStatus = (tableId: string, status: Table['status'], partyName?: string, partySize?: number) => {
    setTables(prev => prev.map(tbl => {
      if (tbl.id === tableId) {
        return {
          ...tbl,
          status,
          seatedPartyName: status === 'available' || status === 'cleaning' ? undefined : (partyName || tbl.seatedPartyName),
          partySize: status === 'available' || status === 'cleaning' ? undefined : (partySize || tbl.partySize),
          seatedAt: status === 'occupied' ? (tbl.seatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : undefined,
          currentOrderId: status === 'available' ? undefined : tbl.currentOrderId
        };
      }
      return tbl;
    }));
    showToast('Floor Updated', `Table status updated to ${status.toUpperCase()}`, 'info');
  };

  const seatQueueTicketAtTable = (ticketId: string, tableId: string) => {
    const ticket = queue.find(q => q.id === ticketId);
    if (!ticket) return;

    updateTableStatus(tableId, 'occupied', ticket.customerName, ticket.partySize);
    setQueue(prev => prev.map(q => q.id === ticketId ? { ...q, status: 'seated' } : q));
    showToast('Party Seated', `${ticket.customerName} assigned to table`, 'success');
  };

  const addTable = (tableData: Omit<Table, 'id'>) => {
    const newTable: Table = {
      ...tableData,
      id: 'tbl-' + Date.now(),
    };
    setTables(prev => [...prev, newTable]);

    // Update location tables count
    setLocations(prev => prev.map(l => l.id === tableData.locationId ? { ...l, tablesCount: l.tablesCount + 1 } : l));

    showToast('Table Created', `Table ${newTable.tableNumber} added to ${newTable.section}`, 'success');
  };

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, ...updates } : t));
    showToast('Table Updated', 'Table configuration modified', 'success');
  };

  const deleteTable = (tableId: string) => {
    const tbl = tables.find(t => t.id === tableId);
    if (tbl) {
      setLocations(prev => prev.map(l => l.id === tbl.locationId ? { ...l, tablesCount: Math.max(0, l.tablesCount - 1) } : l));
    }
    setTables(prev => prev.filter(t => t.id !== tableId));
    showToast('Table Removed', `Table ${tbl?.tableNumber || ''} removed from floor plan`, 'info');
  };

  const addCustomSection = (sectionName: string) => {
    const trimmed = sectionName.trim();
    if (!trimmed) return;
    if (customSections.includes(trimmed)) {
      showToast('Section Exists', `"${trimmed}" is already an active section`, 'warning');
      return;
    }
    setCustomSections(prev => [...prev, trimmed]);
    showToast('Section Created', `"${trimmed}" section added to floor plan`, 'success');
  };

  const deleteCustomSection = (sectionName: string) => {
    setCustomSections(prev => prev.filter(s => s !== sectionName));
    showToast('Section Removed', `"${sectionName}" section deleted`, 'info');
  };

  // Queue
  const joinQueue = (name: string, phone: string, partySize: number, dietary: 'all' | 'veg' | 'vegan' | 'jain', notes?: string) => {
    const nextNum = 'Q-' + String(queue.length + 1).padStart(3, '0');
    const newTicket: QueueTicket = {
      id: 'q-' + Date.now(),
      locationId: activeLocationId,
      ticketNumber: nextNum,
      customerName: name,
      phone,
      partySize,
      dietaryPreference: dietary,
      status: 'waiting',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMins: Math.max(5, (queue.filter(q => q.locationId === activeLocationId && q.status === 'waiting').length + 1) * 7),
      notes,
    };
    setQueue(prev => [...prev, newTicket]);
    showToast('Virtual Queue Ticket Generated', `Ticket #${nextNum} created! Check your phone for SMS alerts.`, 'success');
    return newTicket;
  };

  const updateQueueStatus = (ticketId: string, status: QueueTicket['status']) => {
    setQueue(prev => prev.map(q => q.id === ticketId ? { ...q, status } : q));
    showToast('Queue Updated', `Ticket status set to ${status}`, 'info');
  };

  // Bookings
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingRef' | 'createdAt' | 'status'>) => {
    const newRef = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk-' + Date.now(),
      bookingRef: newRef,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    showToast('Reservation Confirmed', `Booking ${newRef} reserved successfully!`, 'success');
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    showToast('Booking Cancelled', 'The reservation was cancelled', 'warning');
  };

  // Orders & KDS (with Advance and Revert/Undo)
  const placeOrder = (type: Order['type'], tableNumber?: string, customerName?: string, customerPhone?: string, specialNotes?: string) => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const sub = cartTotal;
    const tax = Math.round(sub * 0.05);
    const svc = Math.round(sub * 0.05);
    const orderNum = 'ORD-' + Math.floor(5400 + Math.random() * 1000);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      locationId: activeLocationId,
      tableNumber,
      type,
      items: [...cart],
      status: 'new',
      customerName: customerName || (tableNumber ? `Guest at Table ${tableNumber}` : 'Customer'),
      customerPhone,
      specialInstructions: specialNotes,
      subtotal: sub,
      tax,
      serviceCharge: svc,
      discount: 0,
      total: sub + tax + svc,
      paymentStatus: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    if (tableNumber) {
      const tbl = tables.find(t => t.tableNumber === tableNumber && t.locationId === activeLocationId);
      if (tbl) {
        updateTableStatus(tbl.id, 'occupied', newOrder.customerName);
      }
    }

    showToast('Order Placed!', `Order #${orderNum} dispatched to kitchen KDS`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...ord,
          status,
          prepStartedAt: status === 'in_prep' && !ord.prepStartedAt ? now : ord.prepStartedAt,
          readyAt: status === 'ready' && !ord.readyAt ? now : ord.readyAt
        };
      }
      return ord;
    }));
    showToast('Kitchen Status Updated', `Order ${status.toUpperCase().replace('_', ' ')}`, 'info');
  };

  // Revert order backward if clicked by mistake
  const revertOrderStatus = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;

    let prevStatus: Order['status'] = 'new';
    let message = '';

    if (ord.status === 'in_prep') {
      prevStatus = 'new';
      message = `Order #${ord.orderNumber} sent back to Inbound (New)`;
    } else if (ord.status === 'ready') {
      prevStatus = 'in_prep';
      message = `Order #${ord.orderNumber} sent back to Cooking (In Prep)`;
    } else if (ord.status === 'served') {
      prevStatus = 'ready';
      message = `Order #${ord.orderNumber} sent back to Pass (Plated / Ready)`;
    } else if (ord.status === 'billed') {
      prevStatus = 'served';
      message = `Order #${ord.orderNumber} reverted to Served`;
    } else {
      return;
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: prevStatus } : o));
    showToast('Status Reverted', message, 'warning');
  };

  const processPayment = (orderId: string, method: Order['paymentMethod'] = 'UPI / Card', discount = 0) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const finalTot = Math.max(0, ord.total - discount);
        return {
          ...ord,
          discount,
          total: finalTot,
          paymentMethod: method,
          paymentStatus: 'paid',
          status: 'completed'
        };
      }
      return ord;
    }));

    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      setLocations(prev => prev.map(loc => {
        if (loc.id === ord.locationId) {
          return { ...loc, todayRevenue: loc.todayRevenue + ord.total };
        }
        return loc;
      }));
    }

    showToast('Payment Settled', `Invoice paid via ${method}`, 'success');
  };

  // Kitchen Inventory & Wastage
  const logWastage = (itemId: string, quantity: number, reason: WastageLog['reason'], loggedBy: string, notes?: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const costImpact = Math.round(quantity * item.unitCost);
    const newLog: WastageLog = {
      id: 'wst-' + Date.now(),
      locationId: activeLocationId,
      inventoryItemId: itemId,
      itemName: item.name,
      quantity,
      unit: item.unit,
      reason,
      costImpact,
      loggedBy,
      loggedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes,
    };

    setWastageLogs(prev => [newLog, ...prev]);

    setInventory(prev => prev.map(inv => {
      if (inv.id === itemId) {
        return { ...inv, currentStock: Math.max(0, +(inv.currentStock - quantity).toFixed(1)) };
      }
      return inv;
    }));

    showToast('Wastage Recorded', `Logged ${quantity} ${item.unit} loss (₹${costImpact.toLocaleString()})`, 'warning');
  };

  const restockInventory = (itemId: string, quantity: number) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === itemId) {
        return {
          ...inv,
          currentStock: +(inv.currentStock + quantity).toFixed(1),
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));
    showToast('Inventory Restocked', `Added ${quantity} units to inventory`, 'success');
  };

  // Suppliers & POs
  const createPurchaseOrder = (supplierId: string, items: { itemName: string; quantity: number; unit: string; unitPrice: number }[], deliveryDate: string) => {
    const sup = suppliers.find(s => s.id === supplierId);
    const poNum = 'PO-2026-' + String(purchaseOrders.length + 91).padStart(3, '0');
    const itemsCalculated = items.map(i => ({ ...i, total: Math.round(i.quantity * i.unitPrice) }));
    const totalAmount = itemsCalculated.reduce((sum, i) => sum + i.total, 0);

    const newPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      poNumber: poNum,
      locationId: activeLocationId,
      supplierId,
      supplierName: sup ? sup.name : 'Vendor',
      items: itemsCalculated,
      totalAmount,
      status: 'ordered',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: deliveryDate,
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    showToast('Purchase Order Sent', `${poNum} sent to ${newPO.supplierName}`, 'success');
    return newPO;
  };

  const updatePOStatus = (poId: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders(prev => prev.map(po => po.id === poId ? { ...po, status } : po));
    showToast('Purchase Order Updated', `PO status changed to ${status.toUpperCase()}`, 'info');
  };

  // Feedback
  const submitFeedback = (fbData: Omit<Feedback, 'id' | 'date' | 'verifiedVisit'>) => {
    const newFeedback: Feedback = {
      ...fbData,
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      verifiedVisit: true,
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    showToast('Thank You!', 'Your review and dietary feedback helps us improve', 'success');
  };

  // Staff & Attendance Full CRUD
  const toggleClockIn = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextState = !s.isClockedIn;
        return {
          ...s,
          isClockedIn: nextState,
          clockInTime: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return s;
    }));
    showToast('Attendance Logged', 'Staff clock status updated', 'info');
  };

  const addStaff = (staffData: Omit<HRStaff, 'id' | 'isClockedIn'>) => {
    const newMember: HRStaff = {
      ...staffData,
      id: 'st-' + Date.now(),
      isClockedIn: false,
    };
    setStaff(prev => [newMember, ...prev]);
    showToast('Staff Member Added', `${newMember.name} has been enrolled in the roster`, 'success');
  };

  const updateStaff = (id: string, updates: Partial<HRStaff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Staff Details Updated', 'Profile modifications saved successfully', 'success');
  };

  const removeStaff = (id: string) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    showToast('Staff Member Removed', `${member?.name || 'Employee'} removed from roster`, 'info');
  };

  // CMS Projects
  const addCMSProject = (projectData: Omit<CMSProject, 'id'>) => {
    const newProj: CMSProject = {
      ...projectData,
      id: 'cms-' + Date.now(),
    };
    setCmsProjects(prev => [newProj, ...prev]);
    showToast('CMS Project Published', `"${newProj.title}" is now live!`, 'success');
  };

  const updateCMSProject = (id: string, updates: Partial<CMSProject>) => {
    setCmsProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('CMS Updated', 'Project modifications saved', 'success');
  };

  const deleteCMSProject = (id: string) => {
    setCmsProjects(prev => prev.filter(p => p.id !== id));
    showToast('CMS Project Removed', 'Project deleted from content manager', 'info');
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setLocations(initialLocations);
    setMenuItems(initialMenuItems);
    setTables(initialTables);
    setCustomSections(defaultSections);
    setQueue(initialQueue);
    setBookings(initialBookings);
    setOrders(initialOrders);
    setInventory(initialInventory);
    setWastageLogs(initialWastageLogs);
    setSuppliers(initialSuppliers);
    setPurchaseOrders(initialPurchaseOrders);
    setFeedbacks(initialFeedback);
    setStaff(initialHRStaff);
    setCmsProjects(initialCMSProjects);
    showToast('Reset Complete', 'Enterprise demo dataset restored to Indian Rupees (₹) defaults', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeLocationId,
        setActiveLocationId,
        activeLocation,
        locations,
        toasts,
        showToast,
        dismissToast,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemLocationAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        dietaryFilter,
        setDietaryFilter,
        tables,
        updateTableStatus,
        seatQueueTicketAtTable,
        addTable,
        updateTable,
        deleteTable,
        customSections,
        addCustomSection,
        deleteCustomSection,
        queue,
        joinQueue,
        updateQueueStatus,
        bookings,
        createBooking,
        cancelBooking,
        orders,
        placeOrder,
        updateOrderStatus,
        revertOrderStatus,
        processPayment,
        inventory,
        wastageLogs,
        logWastage,
        restockInventory,
        suppliers,
        purchaseOrders,
        createPurchaseOrder,
        updatePOStatus,
        feedbacks,
        submitFeedback,
        staff,
        toggleClockIn,
        addStaff,
        updateStaff,
        removeStaff,
        cmsProjects,
        addCMSProject,
        updateCMSProject,
        deleteCMSProject,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
