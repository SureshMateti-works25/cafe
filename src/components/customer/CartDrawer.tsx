import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Utensils, 
  Bike, 
  Store, 
  ShieldCheck, 
  CheckCircle2,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartTotal, 
    placeOrder, 
    tables, 
    activeLocation 
  } = useApp();

  const [orderType, setOrderType] = useState<Order['type']>('dine_in');
  const [selectedTableNum, setSelectedTableNum] = useState<string>('T-01');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartTotal;
  const tax = +(subtotal * 0.05).toFixed(2);
  const serviceCharge = orderType === 'dine_in' ? +(subtotal * 0.05).toFixed(2) : 0;
  const grandTotal = +(subtotal + tax + serviceCharge).toFixed(2);

  const availableTables = tables.filter(t => t.locationId === activeLocation.id);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const ord = placeOrder(
      orderType,
      orderType === 'dine_in' ? selectedTableNum : undefined,
      custName || undefined,
      custPhone || undefined,
      specialNotes || undefined
    );

    setPlacedOrder(ord);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-cafe-900">Your Order Tray</h3>
              <p className="text-[11px] text-cafe-500">{activeLocation.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cafe-400 hover:text-cafe-700 hover:bg-cafe-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {placedOrder ? (
            /* Order Placed Success Confirmation */
            <div className="space-y-6 text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                  Order Dispatched to Kitchen KDS
                </span>
                <h3 className="font-serif font-bold text-2xl text-cafe-900 mt-3">
                  #{placedOrder.orderNumber}
                </h3>
                <p className="text-xs text-cafe-600 mt-1">
                  Estimated prep time: ~12-15 minutes
                </p>
              </div>

              <div className="bg-cafe-50 rounded-2xl p-4 border border-cafe-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-cafe-500">Service Type:</span>
                  <span className="font-semibold text-cafe-900 uppercase">
                    {placedOrder.type.replace('_', ' ')} {placedOrder.tableNumber ? `(${placedOrder.tableNumber})` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-500">Items:</span>
                  <span className="font-semibold text-cafe-900">
                    {placedOrder.items.reduce((s, i) => s + i.quantity, 0)} total
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cafe-200 font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="text-amber-700">₹{placedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-cafe-500">
                You can settle the bill directly at your table via cash/card/UPI or at the POS counter.
              </p>

              <button
                onClick={() => {
                  setPlacedOrder(null);
                  onClose();
                }}
                className="w-full py-3 bg-cafe-900 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition"
              >
                Back to Cafe Menu
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Tray State */
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-cafe-300 mx-auto" />
              <h4 className="font-semibold text-cafe-800">Your Tray is Empty</h4>
              <p className="text-xs text-cafe-500 max-w-xs mx-auto">
                Explore our single-origin coffees, Jain-certified paninis, and artisan desserts to add items.
              </p>
            </div>
          ) : (
            /* Items in Tray */
            <div className="space-y-6">
              {/* Order Type Selection */}
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                  Dining Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'dine_in', label: 'Dine In', icon: Utensils },
                    { key: 'takeaway', label: 'Takeaway', icon: Store },
                    { key: 'delivery', label: 'Delivery', icon: Bike },
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setOrderType(t.key as any)}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border transition ${
                          orderType === t.key
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table Selector (If Dine In) */}
              {orderType === 'dine_in' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <label className="text-xs font-bold text-amber-950 uppercase tracking-wider block mb-1.5">
                    Select Your Table Number
                  </label>
                  <select
                    value={selectedTableNum}
                    onChange={e => setSelectedTableNum(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-amber-300 text-xs font-semibold text-cafe-900 focus:outline-hidden"
                  >
                    {availableTables.map(tbl => (
                      <option key={tbl.id} value={tbl.tableNumber}>
                        Table {tbl.tableNumber} ({tbl.section} • {tbl.capacity} Seats) {tbl.status === 'occupied' ? '• Currently Occupied' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-cafe-500 font-semibold border-b border-cafe-100 pb-2">
                  <span>Selected Dishes & Beverages</span>
                  <button onClick={clearCart} className="text-red-600 hover:underline text-[11px]">
                    Clear Tray
                  </button>
                </div>

                {cart.map((item, idx) => (
                  <div key={idx} className="bg-cafe-50 rounded-2xl p-3.5 border border-cafe-200/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-xs text-cafe-900 leading-tight">
                          {item.name}
                        </div>
                        <div className="font-serif font-bold text-xs text-amber-900 mt-0.5">
                          ₹{item.price.toLocaleString()}
                        </div>

                        {/* Customizations tags */}
                        {item.customization && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.customization.jainPrep && (
                              <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                                🕊️ Strict Jain Prep
                              </span>
                            )}
                            {item.customization.milk && (
                              <span className="text-[9px] bg-cafe-200 text-cafe-800 px-1.5 py-0.2 rounded">
                                {item.customization.milk}
                              </span>
                            )}
                            {item.customization.sweetness && (
                              <span className="text-[9px] bg-cafe-200 text-cafe-800 px-1.5 py-0.2 rounded">
                                {item.customization.sweetness}
                              </span>
                            )}
                            {item.customization.notes && (
                              <span className="text-[9px] text-cafe-600 italic block">
                                Note: {item.customization.notes}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-cafe-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(idx, -1)}
                          className="p-1 text-cafe-500 hover:text-cafe-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1.5 font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(idx, 1)}
                          className="p-1 text-cafe-500 hover:text-cafe-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number (For order status alerts)"
                  value={custPhone}
                  onChange={e => setCustPhone(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
                <textarea
                  rows={2}
                  placeholder="Special instructions for kitchen / host..."
                  value={specialNotes}
                  onChange={e => setSpecialNotes(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              {/* Bill Summary */}
              <div className="bg-cafe-100/70 rounded-2xl p-4 border border-cafe-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-cafe-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-cafe-600">
                  <span>GST (5%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {orderType === 'dine_in' && (
                  <div className="flex justify-between text-cafe-600">
                    <span>Service Charge (5%):</span>
                    <span>₹{serviceCharge.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-cafe-950 font-bold text-sm pt-2 border-t border-cafe-200">
                  <span>Total Payable:</span>
                  <span className="font-serif text-base text-amber-900">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {!placedOrder && cart.length > 0 && (
          <div className="p-4 border-t border-cafe-200 bg-white">
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-amber-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Dispatch Order (₹{grandTotal.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
