import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier, PurchaseOrder } from '../../types';
import { 
  Building2, 
  Truck, 
  Plus, 
  Star, 
  FileText, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  X,
  PackageCheck
} from 'lucide-react';

export const VendorManagement: React.FC = () => {
  const { 
    suppliers, 
    purchaseOrders, 
    createPurchaseOrder, 
    updatePOStatus, 
    restockInventory, 
    inventory, 
    activeLocation 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders'>('suppliers');
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);

  // New PO State
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItemName, setPoItemName] = useState('Barista Organic Oat Milk');
  const [poQuantity, setPoQuantity] = useState(24);
  const [poUnit, setPoUnit] = useState('liters');
  const [poUnitPrice, setPoUnitPrice] = useState(3.20);
  const [poDeliveryDate, setPoDeliveryDate] = useState('2026-11-20');

  const locationPOs = purchaseOrders.filter(p => p.locationId === activeLocation.id);

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !poItemName || poQuantity <= 0) return;

    createPurchaseOrder(
      selectedSupplierId,
      [{ itemName: poItemName, quantity: poQuantity, unit: poUnit, unitPrice: poUnitPrice }],
      poDeliveryDate
    );

    setIsNewPOModalOpen(false);
  };

  const handleReceivePO = (po: PurchaseOrder) => {
    updatePOStatus(po.id, 'received');

    // Auto restock inventory if item matches
    po.items.forEach(poItem => {
      const matchInv = inventory.find(inv => inv.name.toLowerCase().includes(poItem.itemName.toLowerCase()) || poItem.itemName.toLowerCase().includes(inv.name.toLowerCase()));
      if (matchInv) {
        restockInventory(matchInv.id, poItem.quantity);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Procurement & Supplier Relations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            Vendor & Supplier Management
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            {suppliers.length} active verified supply partners • Direct farm roasters & Jain-certified dairy
          </p>
        </div>

        <button
          onClick={() => setIsNewPOModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Purchase Order (PO)
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-cafe-200/70 p-1.5 rounded-2xl border border-cafe-300/60 max-w-sm shadow-inner">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'suppliers' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Approved Suppliers ({suppliers.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Purchase Orders ({locationPOs.length})
        </button>
      </div>

      {/* TAB 1: SUPPLIERS DIRECTORY */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suppliers.map(sup => (
            <div
              key={sup.id}
              className="bg-white rounded-3xl p-5 border border-cafe-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {sup.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-cafe-900 mt-2">
                      {sup.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-xs text-amber-900">{sup.rating}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-cafe-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-cafe-400 shrink-0" />
                    <span className="font-semibold text-cafe-800">{sup.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-cafe-400 shrink-0" />
                    <span>{sup.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cafe-400 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-cafe-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-cafe-500">Terms: {sup.paymentTerms}</span>
                <button
                  onClick={() => {
                    setSelectedSupplierId(sup.id);
                    setIsNewPOModalOpen(true);
                  }}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Order Supplies →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cafe-50 border-b border-cafe-200 text-cafe-600 font-bold uppercase tracking-wider">
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Expected Delivery</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cafe-100">
                {locationPOs.map(po => (
                  <tr key={po.id} className="hover:bg-cafe-50/50 transition">
                    <td className="p-4 font-mono font-bold text-cafe-900">
                      {po.poNumber}
                      <span className="block text-[10px] text-cafe-400 font-normal">Date: {po.orderDate}</span>
                    </td>
                    <td className="p-4 font-semibold text-cafe-800">
                      {po.supplierName}
                    </td>
                    <td className="p-4">
                      {po.items.map((it, i) => (
                        <div key={i} className="text-cafe-700">
                          {it.quantity} {it.unit} • {it.itemName}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-mono font-bold text-cafe-950 text-sm">
                      ${po.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-cafe-600">
                      {po.expectedDelivery}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        po.status === 'received'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : po.status === 'ordered'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-cafe-100 text-cafe-800 border border-cafe-200'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {po.status === 'ordered' && (
                        <button
                          onClick={() => handleReceivePO(po)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 ml-auto"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Receive Stock
                        </button>
                      )}
                      {po.status === 'received' && (
                        <span className="text-emerald-700 font-semibold text-xs">
                          Stock Integrated ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PO MODAL */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-2 text-cafe-900 font-bold text-sm">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Create Purchase Order (PO)</span>
              </div>
              <button onClick={() => setIsNewPOModalOpen(false)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePOSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Select Supplier *
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={poItemName}
                  onChange={e => setPoItemName(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Qty *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poQuantity}
                    onChange={e => setPoQuantity(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={poUnit}
                    onChange={e => setPoUnit(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={poUnitPrice}
                    onChange={e => setPoUnitPrice(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={poDeliveryDate}
                  onChange={e => setPoDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-cafe-100 rounded-xl flex justify-between items-center text-xs">
                <span className="text-cafe-600 font-semibold">Total PO Valuation:</span>
                <span className="font-serif font-bold text-sm text-cafe-950">
                  ${(poQuantity * poUnitPrice).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Dispatch Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
