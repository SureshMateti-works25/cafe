import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coffee, 
  MapPin, 
  UserCheck, 
  ShoppingBag, 
  LayoutDashboard, 
  ChevronDown, 
  Sparkles,
  PhoneCall,
  Clock,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenFeedback: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenFeedback, onNavigateSection }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    locations, 
    activeLocationId, 
    setActiveLocationId, 
    activeLocation, 
    cart,
    resetToDemoData 
  } = useApp();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const roles: { key: UserRole; label: string; badge: string; desc: string }[] = [
    { key: 'customer', label: 'Customer (Mobile View)', badge: 'Public', desc: 'Menu, Online Queue, Booking, Tray' },
    { key: 'admin_hq', label: 'HQ Super Admin', badge: 'Full Access', desc: 'Multi-location, Analytics, CMS, Reports' },
    { key: 'store_manager', label: 'Store Manager', badge: 'Branch Ops', desc: 'Tables, Floor Plan, Staff, Orders' },
    { key: 'kitchen_chef', label: 'Kitchen Chef (KDS)', badge: 'Kitchen', desc: 'KDS display, Jain/Vegan alerts, Wastage' },
    { key: 'cashier', label: 'Cashier / Billing POS', badge: 'POS', desc: 'Order billing, Invoicing, Tables' },
    { key: 'inventory_mgr', label: 'Inventory & Procurement', badge: 'Supply', desc: 'Stock levels, Wastage, Vendors, POs' },
    { key: 'finance_hr', label: 'HR & Finance Officer', badge: 'Corporate', desc: 'P&L, Payroll, Attendance, Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cafe-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-cafe-900 text-cafe-100 text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            JAIN & VEGAN AUDITED
          </span>
          <span className="hidden sm:inline text-cafe-300">|</span>
          <span className="text-cafe-200 text-[11px] truncate">
            Dedicated sterile cookware stations for 100% pure Jain (no root veggies) & Vegan options.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="hidden md:flex items-center gap-1 text-cafe-300">
            <Clock className="w-3 h-3 text-amber-400" /> {activeLocation.operatingHours}
          </span>
          <button 
            onClick={resetToDemoData}
            title="Reset to factory demo data"
            className="flex items-center gap-1 hover:text-white transition-colors text-cafe-400 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateSection?.('home')}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cafe-800 to-cafe-950 flex items-center justify-center text-amber-400 shadow-md shadow-cafe-900/20 ring-2 ring-amber-500/20">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-cafe-900">
                Aroma<span className="text-amber-700">Craft</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-cafe-100 text-cafe-800 px-1.5 py-0.5 rounded font-semibold border border-cafe-200">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-cafe-600 hidden sm:block">
              Artisan Roastery, Kitchen & Multi-Branch Suite
            </p>
          </div>
        </div>

        {/* Center: Multi-Location Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setLocationDropdownOpen(!locationDropdownOpen);
              setRoleDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-cafe-100/80 hover:bg-cafe-200/70 border border-cafe-200 transition-all text-left text-xs sm:text-sm"
          >
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="max-w-[120px] sm:max-w-[180px] truncate">
              <div className="font-semibold text-cafe-900 truncate leading-tight">
                {activeLocation.name.replace('AromaCraft ', '')}
              </div>
              <div className="text-[10px] text-cafe-600 hidden sm:block">
                {activeLocation.tablesCount} Tables • {activeLocation.occupancyRate}% full
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-cafe-500 shrink-0 ml-1" />
          </button>

          {/* Location Dropdown Modal */}
          {locationDropdownOpen && (
            <div 
              className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-cafe-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setLocationDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-cafe-100 flex items-center justify-between text-xs text-cafe-500 font-medium">
                <span>Select Active Location</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                  {locations.length} Locations
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {locations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setActiveLocationId(loc.id);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-cafe-50 transition-colors flex items-start gap-2.5 ${
                      loc.id === activeLocationId ? 'bg-amber-50/70 border-l-4 border-amber-600' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-cafe-200 mt-0.5">
                      <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-cafe-900 text-xs sm:text-sm truncate">
                        {loc.name}
                      </div>
                      <div className="text-[11px] text-cafe-500 truncate">{loc.address}</div>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className="text-emerald-700 font-medium font-mono">
                          Today: ${loc.todayRevenue.toLocaleString()}
                        </span>
                        <span className="text-cafe-400">•</span>
                        <span className="text-cafe-600">
                          {loc.occupancyRate}% Seated
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: RBAC Role Switcher & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Review Feedback trigger */}
          <button
            onClick={onOpenFeedback}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-cafe-700 hover:text-cafe-900 hover:bg-cafe-100 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Reviews</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setLocationDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                currentRole === 'customer' 
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm shadow-amber-600/30' 
                  : 'bg-cafe-900 text-amber-300 border-cafe-950 shadow-sm'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="max-w-[85px] sm:max-w-none truncate font-semibold">
                {roles.find(r => r.key === currentRole)?.label.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {/* Role Dropdown */}
            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-cafe-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-cafe-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-cafe-900">Switch Role & View</span>
                  <span className="text-[10px] text-cafe-500">Enterprise RBAC</span>
                </div>
                <div className="py-1">
                  {roles.map(r => (
                    <button
                      key={r.key}
                      onClick={() => {
                        setCurrentRole(r.key);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-cafe-50 flex items-start gap-2.5 transition-colors ${
                        currentRole === r.key ? 'bg-amber-50 border-l-4 border-amber-600' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cafe-900 text-xs sm:text-sm">
                            {r.label}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cafe-100 text-cafe-700">
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-cafe-500 mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Cart / Tray Button */}
          <button
            onClick={onOpenCart}
            aria-label="View Tray"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-900 border border-cafe-200 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 text-cafe-800" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
