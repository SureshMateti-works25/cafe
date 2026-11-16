export type UserRole = 
  | 'customer'
  | 'admin_hq'
  | 'store_manager'
  | 'kitchen_chef'
  | 'cashier'
  | 'inventory_mgr'
  | 'finance_hr';

export type DietaryType = 'veg' | 'vegan' | 'jain' | 'gluten-free' | 'egg' | 'non-veg';

export interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  operatingHours: string;
  tablesCount: number;
  activeStaffCount: number;
  manager: string;
  todayRevenue: number;
  occupancyRate: number; // percentage
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Espresso & Brews' | 'Artisan Teas' | 'Bakery & Pastry' | 'Gourmet Mains' | 'Healthy Bowls' | 'Desserts' | string;
  description: string;
  price: number;
  dietary: DietaryType[];
  isJainFriendly: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  calories: number;
  prepTimeMins: number;
  image: string;
  isAvailable: boolean;
  availableLocationIds?: string[];
  ingredients: string[];
  featured?: boolean;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billed' | 'cleaning';

export interface Table {
  id: string;
  locationId: string;
  tableNumber: string;
  capacity: number;
  section: string;
  status: TableStatus;
  currentOrderId?: string;
  seatedPartyName?: string;
  partySize?: number;
  seatedAt?: string;
}

export interface QueueTicket {
  id: string;
  locationId: string;
  ticketNumber: string;
  customerName: string;
  phone: string;
  partySize: number;
  dietaryPreference?: 'all' | 'veg' | 'vegan' | 'jain';
  status: 'waiting' | 'called' | 'seated' | 'cancelled';
  joinedAt: string;
  estimatedWaitMins: number;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  locationId: string;
  customerName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  seatingPreference: 'indoor' | 'outdoor_terrace' | 'quiet_corner' | 'bar_counter';
  dietaryNotes?: string;
  specialOccasion?: 'none' | 'birthday' | 'anniversary' | 'business' | 'date';
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    milk?: 'Regular Whole' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk';
    sweetness?: 'None (0%)' | 'Mild (25%)' | 'Standard (50%)' | 'Sweet (100%)';
    jainPrep?: boolean;
    notes?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  locationId: string;
  tableId?: string;
  tableNumber?: string;
  type: 'dine_in' | 'takeaway' | 'delivery' | 'online_pickup';
  items: OrderItem[];
  status: 'new' | 'in_prep' | 'ready' | 'served' | 'billed' | 'completed';
  customerName?: string;
  customerPhone?: string;
  specialInstructions?: string;
  subtotal: number;
  tax: number; // 5% GST
  serviceCharge: number; // 5%
  discount: number;
  total: number;
  paymentMethod?: 'UPI / Card' | 'Cash' | 'Corporate Account' | 'Split';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  prepStartedAt?: string;
  readyAt?: string;
}

export interface InventoryItem {
  id: string;
  locationId: string;
  name: string;
  category: 'Coffee Beans' | 'Dairy & Plant Milks' | 'Flour & Bakery' | 'Fresh Produce' | 'Syrups & Spices' | 'Packaging';
  currentStock: number;
  minThreshold: number;
  unit: 'kg' | 'liters' | 'units' | 'bags' | 'boxes';
  unitCost: number;
  supplierId: string;
  supplierName: string;
  lastRestocked: string;
  expiryDate: string;
}

export interface WastageLog {
  id: string;
  locationId: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: 'spoilage' | 'burnt_prep_error' | 'expired' | 'damaged' | 'customer_return' | 'trimming_waste';
  costImpact: number;
  loggedBy: string;
  loggedAt: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number; // 1-5
  paymentTerms: string;
  activeOrdersCount: number;
  address: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  locationId: string;
  supplierId: string;
  supplierName: string;
  items: {
    itemName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'paid';
  orderDate: string;
  expectedDelivery: string;
}

export interface Feedback {
  id: string;
  locationId: string;
  customerName: string;
  rating: number; // 1-5
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  dietaryHandlingRating: number; // specific for vegan / jain safety
  dietaryPreference: 'veg' | 'vegan' | 'jain' | 'regular';
  comment: string;
  date: string;
  verifiedVisit: boolean;
}

export interface HRStaff {
  id: string;
  locationId: string;
  name: string;
  role: 'Store Manager' | 'Head Barista' | 'Sous Chef' | 'Line Cook' | 'Cashier / Host' | 'Floor Server';
  phone: string;
  email: string;
  shift: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Full Day';
  isClockedIn: boolean;
  clockInTime?: string;
  monthlyHours: number;
  baseSalary: number;
  performanceScore: number; // 1-100
}

export interface CMSProject {
  id: string;
  title: string;
  category: 'Promotion' | 'Seasonal Roasts' | 'Cafe Workshop' | 'Community Event' | 'Menu Launch';
  summary: string;
  content: string;
  bannerImage: string;
  status: 'published' | 'draft';
  targetLocations: string[]; // ['all'] or specific location IDs
  startDate: string;
  endDate?: string;
  author: string;
  tags: string[];
}
