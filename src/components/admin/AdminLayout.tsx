import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  TableProperties, 
  ChefHat, 
  Package, 
  Truck, 
  Receipt, 
  BarChart3, 
  Globe2, 
  UserCheck, 
  ArrowLeft,
  Menu,
  X,
  Building2,
  ShieldAlert,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { CentralDashboard } from './CentralDashboard';
import { CentralMenuManager } from './CentralMenuManager';
import { TableManagement } from './TableManagement';
import { KitchenDisplay } from './KitchenDisplay';
import { InventoryWastage } from './InventoryWastage';
import { VendorManagement } from './VendorManagement';
import { BillingPOS } from './BillingPOS';
import { HRFinanceReports } from './HRFinanceReports';
import { CMSManager } from './CMSManager';

interface AdminLayoutProps {
  onReturnToCustomer: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToCustomer }) => {
  const { currentRole, setCurrentRole, activeLocation, activeLocationId, setActiveLocationId, locations } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // RBAC Permission Map
  const rolePermissions: Record<string, string[]> = {
    admin_hq: ['dashboard', 'menu', 'tables', 'kds', 'inventory', 'vendors', 'billing', 'reports', 'cms'],
    store_manager: ['dashboard', 'menu', 'tables', 'kds', 'inventory', 'billing', 'cms'],
    kitchen_chef: ['kds', 'inventory', 'menu'],
    cashier: ['billing', 'tables'],
    inventory_mgr: ['inventory', 'vendors'],
    finance_hr: ['reports', 'billing', 'dashboard'],
    customer: ['dashboard']
  };

  const allowedTabs = rolePermissions[currentRole] || ['dashboard'];

  // If current tab is not allowed for the role, auto-redirect to first allowed tab
  const currentAllowedTab = allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0];

  const navMenuItems = [
    { key: 'dashboard', label: 'Central Dashboard', icon: LayoutDashboard, badge: 'HQ' },
    { key: 'menu', label: 'Menu & Recipes', icon: UtensilsCrossed, badge: 'Catalog' },
    { key: 'tables', label: 'Table Management', icon: TableProperties, badge: 'Floor' },
    { key: 'kds', label: 'Kitchen KDS', icon: ChefHat, badge: 'Kitchen' },
    { key: 'inventory', label: 'Inventory & Wastage', icon: Package, badge: 'Stock' },
    { key: 'vendors', label: 'Vendor Management', icon: Truck, badge: 'Supply' },
    { key: 'billing', label: 'Billing POS & Invoicing', icon: Receipt, badge: 'POS' },
    { key: 'reports', label: 'HR & Finance Reports', icon: BarChart3, badge: 'Audit' },
    { key: 'cms', label: 'No-Code CMS Projects', icon: Globe2, badge: 'Marketing' },
  ];

  const renderActiveView = () => {
    switch (currentAllowedTab) {
      case 'dashboard':
        return <CentralDashboard onNavigateTab={setActiveTab} />;
      case 'menu':
        return <CentralMenuManager />;
      case 'tables':
        return <TableManagement onNavigateTab={setActiveTab} />;
      case 'kds':
        return <KitchenDisplay />;
      case 'inventory':
        return <InventoryWastage />;
      case 'vendors':
        return <VendorManagement />;
      case 'billing':
        return <BillingPOS />;
      case 'reports':
        return <HRFinanceReports />;
      case 'cms':
        return <CMSManager />;
      default:
        return <CentralDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cafe-100 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-cafe-950 text-white p-4 flex items-center justify-between border-b border-cafe-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-cafe-900 text-cafe-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-base text-amber-400">AromaCraft Back-Office</span>
        </div>

        <button
          onClick={onReturnToCustomer}
          className="text-xs font-semibold text-cafe-300 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Client View
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-cafe-950 text-white flex flex-col justify-between border-r border-cafe-900 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen sticky top-0
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo & Close on mobile */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-white tracking-tight">
                  Aroma<span className="text-amber-400">Craft</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Suite
                </span>
              </div>
              <p className="text-[10px] text-cafe-400 mt-0.5">Enterprise Portal & RBAC</p>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-cafe-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location Selector Pill */}
          <div className="p-3 rounded-2xl bg-cafe-900/90 border border-cafe-800 space-y-1">
            <span className="text-[10px] font-mono text-cafe-400 uppercase tracking-wider block">
              Active Branch Focus:
            </span>
            <select
              value={activeLocationId}
              onChange={e => setActiveLocationId(e.target.value)}
              className="w-full bg-cafe-950 text-amber-300 rounded-lg p-1.5 text-xs font-semibold border border-cafe-700 focus:outline-hidden"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name.replace('AromaCraft ', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cafe-500 block px-3 mb-1">
              Modules & Terminals
            </span>
            {navMenuItems.map(item => {
              const Icon = item.icon;
              const isAllowed = allowedTabs.includes(item.key);
              const isActive = currentAllowedTab === item.key;

              return (
                <button
                  key={item.key}
                  disabled={!isAllowed}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20'
                      : isAllowed
                      ? 'text-cafe-300 hover:bg-cafe-900 hover:text-white'
                      : 'text-cafe-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-amber-700 text-white' : 'bg-cafe-900 text-cafe-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Role & Back button */}
        <div className="p-4 border-t border-cafe-900 bg-cafe-950/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cafe-400">Current Role:</span>
            <span className="font-bold text-amber-300 uppercase font-mono text-[11px]">
              {currentRole.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={onReturnToCustomer}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Exit to Customer View
          </button>
        </div>
      </aside>

      {/* Main Back-Office Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};
