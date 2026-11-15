import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  Coffee, 
  Utensils, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  Package
} from 'lucide-react';

interface CentralDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({ onNavigateTab }) => {
  const { locations, tables, queue, inventory, wastageLogs, orders, cmsProjects } = useApp();

  // Aggregate stats across all locations
  const totalRevenue = locations.reduce((sum, l) => sum + l.todayRevenue, 0);
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const avgOccupancy = Math.round((occupiedTables / totalTables) * 100);
  const activeQueueCount = queue.filter(q => q.status === 'waiting' || q.status === 'called').length;
  const totalWastageCost = wastageLogs.reduce((sum, w) => sum + w.costImpact, 0);
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minThreshold).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cafe-900 via-cafe-950 to-cafe-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cafe-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>CENTRAL MULTI-LOCATION HQ OVERVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Enterprise Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-cafe-300 mt-1">
            Real-time telemetry across {locations.length} branches • Active sync with POS, KDS & Supply chain
          </p>
        </div>

        {/* Quick HQ CTA */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('cms')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-cafe-950 font-bold text-xs transition shadow-sm"
          >
            + New CMS Promotion
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition"
          >
            Financial Reports
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cafe-500 text-xs font-semibold">
            <span>Today's Total Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif font-bold text-2xl text-cafe-950">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs yesterday
            </div>
          </div>
        </div>

        {/* Chain Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cafe-500 text-xs font-semibold">
            <span>Table Occupancy</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif font-bold text-2xl text-cafe-950">
              {avgOccupancy}%
            </span>
            <div className="text-[11px] text-cafe-500 mt-1">
              {occupiedTables} of {totalTables} tables seated
            </div>
          </div>
        </div>

        {/* Active Queue */}
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cafe-500 text-xs font-semibold">
            <span>Live Waiting Queue</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif font-bold text-2xl text-cafe-950">
              {activeQueueCount} Parties
            </span>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Avg. wait ~10 mins
            </div>
          </div>
        </div>

        {/* Wastage Loss Impact */}
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cafe-500 text-xs font-semibold">
            <span>Logged Wastage Loss</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif font-bold text-2xl text-red-600 font-mono">
              ${totalWastageCost.toFixed(2)}
            </span>
            <div className="text-[11px] text-cafe-500 mt-1">
              {wastageLogs.length} incidents logged
            </div>
          </div>
        </div>

        {/* Supply Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cafe-500 text-xs font-semibold">
            <span>Inventory Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif font-bold text-2xl text-orange-600">
              {lowStockCount} Low
            </span>
            <div className="text-[11px] text-cafe-500 mt-1">
              Oat Milk & Roasted Beans
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Location Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-cafe-900">
            Branch Operations & Telemetry Matrix
          </h2>
          <span className="text-xs text-cafe-500">Live feed auto-synced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map(loc => {
            const locTables = tables.filter(t => t.locationId === loc.id);
            const locOccupied = locTables.filter(t => t.status === 'occupied').length;
            const locQueue = queue.filter(q => q.locationId === loc.id && (q.status === 'waiting' || q.status === 'called')).length;

            return (
              <div
                key={loc.id}
                className="bg-white rounded-3xl overflow-hidden border border-cafe-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 bg-cafe-100">
                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-cafe-900">
                      {loc.code}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm leading-tight">{loc.name}</h3>
                      <p className="text-[11px] text-white/80">{loc.city}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cafe-500">Today's Revenue:</span>
                      <span className="font-serif font-bold text-cafe-950 text-sm">
                        ${loc.todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cafe-500">Occupancy:</span>
                      <span className="font-semibold text-cafe-800">
                        {locOccupied} / {locTables.length} ({Math.round((locOccupied / Math.max(1, locTables.length)) * 100)}%)
                      </span>
                    </div>

                    {/* Occupancy bar */}
                    <div className="w-full h-2 rounded-full bg-cafe-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.round((locOccupied / Math.max(1, locTables.length)) * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-cafe-500">Waiting in Queue:</span>
                      <span className="font-mono font-bold text-amber-700">{locQueue} parties</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cafe-500">Store Manager:</span>
                      <span className="font-semibold text-cafe-700">{loc.manager}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cafe-50 border-t border-cafe-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Operational
                  </span>
                  <button
                    onClick={() => onNavigateTab('tables')}
                    className="text-amber-800 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    View Tables <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics & Performance Charts (SVG Visualizations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Sales Traffic Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-cafe-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-cafe-900">
                Peak Hourly Sales Traffic
              </h3>
              <p className="text-xs text-cafe-500">Hourly volume across all three cafe hubs</p>
            </div>
            <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
              Peak: 08:00 & 19:00
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-cafe-100 pb-2">
            {[
              { time: '7AM', orders: 25 },
              { time: '8AM', orders: 85 },
              { time: '9AM', orders: 72 },
              { time: '10AM', orders: 48 },
              { time: '11AM', orders: 38 },
              { time: '12PM', orders: 65 },
              { time: '1PM', orders: 78 },
              { time: '3PM', orders: 42 },
              { time: '5PM', orders: 55 },
              { time: '7PM', orders: 88 },
              { time: '8PM', orders: 60 },
              { time: '9PM', orders: 30 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div
                  className="w-full bg-cafe-200 group-hover:bg-amber-500 transition-colors rounded-t-md relative"
                  style={{ height: `${(bar.orders / 90) * 100}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-cafe-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none transition">
                    {bar.orders}
                  </span>
                </div>
                <span className="text-[9px] text-cafe-500 font-mono">{bar.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-cafe-500 pt-1">
            <span>Morning Espresso Rush: 7:30 - 9:30 AM</span>
            <span>Evening Dining & Dessert Peak: 6:30 - 8:30 PM</span>
          </div>
        </div>

        {/* Dietary Distribution & Order Mix */}
        <div className="bg-white p-6 rounded-3xl border border-cafe-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-cafe-900">
                Dietary Order Mix & Compliance
              </h3>
              <p className="text-xs text-cafe-500">Dietary breakdown of today's customer tickets</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              85% Plant/Veg/Jain
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: '🕊️ Strict Jain Orders (Zero Root Veg)', pct: 32, count: 18, color: 'bg-amber-500' },
              { label: '🌿 100% Vegan (Plant Milks & Vegan Mains)', pct: 24, count: 14, color: 'bg-teal-600' },
              { label: '🥗 Pure Vegetarian (Cheese, Dairy, Eggs)', pct: 28, count: 16, color: 'bg-emerald-600' },
              { label: '🥩 Standard / Non-Veg Orders', pct: 16, count: 9, color: 'bg-cafe-700' },
            ].map((diet, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-cafe-800">
                  <span>{diet.label}</span>
                  <span className="font-mono">{diet.pct}% ({diet.count} orders)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-cafe-100 overflow-hidden">
                  <div className={`h-full ${diet.color} rounded-full`} style={{ width: `${diet.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-cafe-500 pt-2 border-t border-cafe-100">
            Jain orders have increased by +42% since the launch of dedicated kitchen preparation protocols.
          </p>
        </div>
      </div>
    </div>
  );
};
