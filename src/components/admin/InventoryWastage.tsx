import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, WastageLog } from '../../types';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  TrendingDown, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  Clock,
  X,
  RefreshCw
} from 'lucide-react';

export const InventoryWastage: React.FC = () => {
  const { 
    inventory, 
    wastageLogs, 
    logWastage, 
    restockInventory, 
    activeLocation, 
    suppliers 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'wastage'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Log Wastage Modal state
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [wasteQty, setWasteQty] = useState<number>(1);
  const [wasteReason, setWasteReason] = useState<WastageLog['reason']>('burnt_prep_error');
  const [wasteLoggedBy, setWasteLoggedBy] = useState('Head Chef Liam');
  const [wasteNotes, setWasteNotes] = useState('');

  // Restock Modal state
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  const locationInventory = inventory.filter(i => i.locationId === activeLocation.id);
  const locationWastage = wastageLogs.filter(w => w.locationId === activeLocation.id);

  const categories = ['All', 'Coffee Beans', 'Dairy & Plant Milks', 'Flour & Bakery', 'Fresh Produce', 'Syrups & Spices', 'Packaging'];

  const filteredInventory = locationInventory.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.supplierName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const lowStockCount = locationInventory.filter(i => i.currentStock <= i.minThreshold).length;
  const totalWastageCost = locationWastage.reduce((sum, w) => sum + w.costImpact, 0);

  const handleLogWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || wasteQty <= 0) return;

    logWastage(selectedItemId, wasteQty, wasteReason, wasteLoggedBy, wasteNotes);
    setIsWastageModalOpen(false);
    setWasteQty(1);
    setWasteNotes('');
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem || restockQty <= 0) return;

    restockInventory(restockItem.id, restockQty);
    setIsRestockModalOpen(false);
    setRestockItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Kitchen Supply Chain & Wastage Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            Inventory & Wastage Tracking
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            {activeLocation.name} • Real-time stock levels & cost-impact telemetry
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWastageModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Log Kitchen Wastage
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-cafe-500 font-semibold block">Tracked Inventory Lines</span>
            <span className="font-serif font-bold text-2xl text-cafe-950 mt-1 block">
              {locationInventory.length} Ingredients
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cafe-100 text-cafe-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-cafe-500 font-semibold block">Low Stock Alerts</span>
            <span className="font-serif font-bold text-2xl text-orange-600 mt-1 block">
              {lowStockCount} Items Below Par
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-cafe-500 font-semibold block">Total Wastage Cost (This Week)</span>
            <span className="font-serif font-bold text-2xl text-red-600 font-mono mt-1 block">
              ${totalWastageCost.toFixed(2)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-cafe-200/70 p-1.5 rounded-2xl border border-cafe-300/60 max-w-sm shadow-inner">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inventory' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Stock Inventory ({locationInventory.length})
        </button>

        <button
          onClick={() => setActiveTab('wastage')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wastage' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Wastage Audit Log ({locationWastage.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search & Categories */}
          <div className="bg-white p-4 rounded-2xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-cafe-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ingredients, beans, dairy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-cafe-600 hover:bg-cafe-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table of Inventory Items */}
          <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cafe-50 border-b border-cafe-200 text-cafe-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Ingredient / Supply</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Par Threshold</th>
                    <th className="p-4">Unit Cost</th>
                    <th className="p-4">Primary Supplier</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-100">
                  {filteredInventory.map(item => {
                    const isLow = item.currentStock <= item.minThreshold;
                    const isCritical = item.currentStock <= item.minThreshold * 0.5;

                    return (
                      <tr key={item.id} className="hover:bg-cafe-50/60 transition">
                        <td className="p-4">
                          <div className="font-bold text-cafe-900 text-sm">{item.name}</div>
                          <div className="text-[10px] text-cafe-500 font-mono">Restocked: {item.lastRestocked}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-cafe-100 text-cafe-800 text-[10px] font-semibold">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold text-sm ${
                              isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-cafe-900'
                            }`}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isCritical ? (
                              <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold uppercase">
                                Critical
                              </span>
                            ) : isLow ? (
                              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold uppercase">
                                Low
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4 text-cafe-600 font-mono">
                          {item.minThreshold} {item.unit}
                        </td>
                        <td className="p-4 font-mono text-cafe-900 font-semibold">
                          ${item.unitCost.toFixed(2)}
                        </td>
                        <td className="p-4 text-cafe-700 font-medium">
                          {item.supplierName}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setRestockItem(item);
                              setIsRestockModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition"
                          >
                            + Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WASTAGE AUDIT LOG */}
      {activeTab === 'wastage' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div>
                <h3 className="font-serif font-bold text-base text-cafe-900">
                  Kitchen Wastage & Spoilage Incidents
                </h3>
                <p className="text-xs text-cafe-500">Every incident is logged with cost-impact metrics for finance</p>
              </div>
              <button
                onClick={() => setIsWastageModalOpen(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
              >
                + Log Incident
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cafe-50/50 border-b border-cafe-200 text-cafe-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Item & Reason</th>
                    <th className="p-4">Quantity Wasted</th>
                    <th className="p-4">Financial Cost</th>
                    <th className="p-4">Logged By</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Operational Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-100">
                  {locationWastage.map(log => (
                    <tr key={log.id} className="hover:bg-cafe-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-cafe-900">{log.itemName}</div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded bg-red-50 text-red-700 font-bold">
                          {log.reason.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-cafe-800">
                        {log.quantity} {log.unit}
                      </td>
                      <td className="p-4 font-mono font-bold text-red-600 text-sm">
                        ${log.costImpact.toFixed(2)}
                      </td>
                      <td className="p-4 text-cafe-700 font-medium">
                        {log.loggedBy}
                      </td>
                      <td className="p-4 text-cafe-500 font-mono text-[11px]">
                        {log.loggedAt}
                      </td>
                      <td className="p-4 text-cafe-600 italic">
                        {log.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LOG WASTAGE MODAL */}
      {isWastageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Log Kitchen Wastage Incident</span>
              </div>
              <button onClick={() => setIsWastageModalOpen(false)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogWastageSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Select Inventory Item *
                </label>
                <select
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                >
                  {locationInventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (${item.unitCost.toFixed(2)} / {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Quantity Lost *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={wasteQty}
                    onChange={e => setWasteQty(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Reason *
                  </label>
                  <select
                    value={wasteReason}
                    onChange={e => setWasteReason(e.target.value as any)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="burnt_prep_error">Burnt / Prep Error</option>
                    <option value="spoilage">Produce Spoilage</option>
                    <option value="expired">Expired Stock</option>
                    <option value="trimming_waste">Trimming Waste</option>
                    <option value="damaged">Dropped / Damaged</option>
                    <option value="customer_return">Customer Return</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Logged By *
                </label>
                <input
                  type="text"
                  required
                  value={wasteLoggedBy}
                  onChange={e => setWasteLoggedBy(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Operational Cause / Prevention Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Steamer overshoot, milk overheated during lunch peak..."
                  value={wasteNotes}
                  onChange={e => setWasteNotes(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition"
              >
                Confirm & Deduct from Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {isRestockModalOpen && restockItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-emerald-50">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Restock Inventory</span>
              </div>
              <button onClick={() => setIsRestockModalOpen(false)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-cafe-900">{restockItem.name}</h4>
                <p className="text-xs text-cafe-500">Current Stock: {restockItem.currentStock} {restockItem.unit}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Quantity Received ({restockItem.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={e => setRestockQty(+e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono font-bold focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Add {restockQty} {restockItem.unit} to Inventory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
