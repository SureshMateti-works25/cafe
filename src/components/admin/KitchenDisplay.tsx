import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChefHat, 
  ShieldAlert, 
  BellRing,
  Utensils,
  RotateCcw
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, revertOrderStatus, activeLocation } = useApp();

  const [dietaryOnlyFilter, setDietaryOnlyFilter] = useState<boolean>(false);

  // Filter orders for active location
  const locationOrders = orders.filter(o => o.locationId === activeLocation.id && o.status !== 'completed');

  const displayedOrders = dietaryOnlyFilter 
    ? locationOrders.filter(o => o.items.some(i => i.customization?.jainPrep || i.name.toLowerCase().includes('vegan') || i.name.toLowerCase().includes('jain')))
    : locationOrders;

  const newOrders = displayedOrders.filter(o => o.status === 'new');
  const inPrepOrders = displayedOrders.filter(o => o.status === 'in_prep');
  const readyOrders = displayedOrders.filter(o => o.status === 'ready');
  const servedOrders = displayedOrders.filter(o => o.status === 'served' || o.status === 'billed');

  const OrderTicketCard = ({ order }: { order: Order }) => {
    // Check if order has Jain or Vegan items
    const hasJain = order.items.some(i => i.customization?.jainPrep || i.name.toLowerCase().includes('jain')) || order.specialInstructions?.toLowerCase().includes('jain');
    const hasVegan = order.items.some(i => i.name.toLowerCase().includes('vegan') || i.customization?.milk === 'Oat Milk' || i.customization?.milk === 'Almond Milk');

    return (
      <div className={`rounded-2xl border-2 p-4 transition-all shadow-md bg-white flex flex-col justify-between space-y-4 ${
        hasJain 
          ? 'border-amber-500 ring-2 ring-amber-400/30' 
          : hasVegan
          ? 'border-teal-500 ring-2 ring-teal-400/20'
          : 'border-cafe-200'
      }`}>
        <div>
          {/* CRITICAL DIETARY HIGHLIGHT BANNER */}
          {hasJain && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-500 text-cafe-950 font-bold text-xs flex items-center gap-2 animate-pulse shadow-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>STRICT JAIN ALERT: Dedicated Pans • Zero Root Veg/Onion/Garlic</span>
            </div>
          )}

          {hasVegan && !hasJain && (
            <div className="mb-3 p-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>VEGAN ORDER: Plant-Based Only • No Dairy/Butter</span>
            </div>
          )}

          {/* Ticket Header */}
          <div className="flex items-start justify-between gap-2 border-b border-cafe-100 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-cafe-900">
                  #{order.orderNumber}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cafe-100 text-cafe-800">
                  {order.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs font-semibold text-cafe-600 mt-0.5">
                {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway Counter'} • {order.customerName}
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs text-cafe-500 block">{order.createdAt}</span>
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 justify-end mt-0.5">
                <Clock className="w-3 h-3" /> Live
              </span>
            </div>
          </div>

          {/* Ordered Dishes List */}
          <div className="mt-3 space-y-2.5">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-baseline justify-between font-bold text-cafe-900">
                  <span>
                    <span className="text-amber-700 font-mono text-sm mr-1.5">{item.quantity}x</span>
                    {item.name}
                  </span>
                </div>

                {/* Customization Details */}
                {item.customization && (
                  <div className="pl-5 mt-1 space-y-0.5 text-[11px]">
                    {item.customization.jainPrep && (
                      <span className="inline-block font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded mr-1">
                        🕊️ Jain Certified
                      </span>
                    )}
                    {item.customization.milk && (
                      <span className="inline-block bg-cafe-100 text-cafe-800 px-1.5 py-0.2 rounded mr-1">
                        Milk: {item.customization.milk}
                      </span>
                    )}
                    {item.customization.sweetness && (
                      <span className="inline-block bg-cafe-100 text-cafe-800 px-1.5 py-0.2 rounded mr-1">
                        Sweet: {item.customization.sweetness}
                      </span>
                    )}
                    {item.customization.notes && (
                      <div className="text-red-700 font-medium italic mt-0.5">
                        Alert: "{item.customization.notes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Special Kitchen Instructions */}
          {order.specialInstructions && (
            <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium">
              <strong>Host Note:</strong> {order.specialInstructions}
            </div>
          )}
        </div>

        {/* Action Button to Advance Order */}
        <div className="pt-3 border-t border-cafe-100">
          {order.status === 'new' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'in_prep')}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Flame className="w-4 h-4" /> Start Cooking
            </button>
          )}

          {order.status === 'in_prep' && (
            <div className="space-y-1.5">
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Ready to Serve
              </button>
              <button
                onClick={() => revertOrderStatus(order.id)}
                className="w-full py-1.5 bg-cafe-100 hover:bg-cafe-200 text-cafe-700 hover:text-cafe-900 font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 border border-cafe-200"
                title="Send back to Inbound (New) if clicked by mistake"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>↩ Undo • Send back to Inbound</span>
              </button>
            </div>
          )}

          {order.status === 'ready' && (
            <div className="space-y-1.5">
              <button
                onClick={() => updateOrderStatus(order.id, 'served')}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Utensils className="w-4 h-4" /> Dispatch / Served to Table
              </button>
              <button
                onClick={() => revertOrderStatus(order.id)}
                className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 border border-amber-200"
                title="Send back to Cooking (In Prep) if clicked by mistake"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>↩ Undo • Send back to Cooking</span>
              </button>
            </div>
          )}

          {order.status === 'served' && (
            <div className="space-y-1.5">
              <div className="text-center py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
                ✓ Served to Guest (Awaiting Bill Settlement)
              </div>
              <button
                onClick={() => revertOrderStatus(order.id)}
                className="w-full py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 border border-teal-200"
                title="Send back to Ready / Plated if clicked by mistake"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
                <span>↩ Undo • Send back to Pass</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* KDS Header Banner */}
      <div className="bg-cafe-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cafe-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 mb-2">
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>KITCHEN DISPLAY SYSTEM (KDS) • LIVE TICKETS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Line Cook & Barista Order Terminal
          </h1>
          <p className="text-xs sm:text-sm text-cafe-300 mt-1">
            {activeLocation.name} • {displayedOrders.length} active tickets on line
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={dietaryOnlyFilter}
              onChange={e => setDietaryOnlyFilter(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span>🕊️ Jain & Vegan Tickets Only</span>
          </label>
        </div>
      </div>

      {/* 4 Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Column 1: New Inbound */}
        <div className="bg-cafe-100/70 rounded-3xl p-4 border border-cafe-200/90 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-cafe-200 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-bold text-sm text-cafe-900">1. Inbound Orders</h3>
            </div>
            <span className="font-mono text-xs font-bold bg-white text-cafe-800 px-2 py-0.5 rounded-full border border-cafe-200">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {newOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-cafe-400">
                No new orders waiting
              </div>
            ) : (
              newOrders.map(order => <OrderTicketCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="bg-amber-50/50 rounded-3xl p-4 border border-amber-200/90 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
              <h3 className="font-bold text-sm text-amber-950">2. In Preparation</h3>
            </div>
            <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              {inPrepOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {inPrepOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-cafe-400">
                Line is clear
              </div>
            ) : (
              inPrepOrders.map(order => <OrderTicketCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve */}
        <div className="bg-teal-50/50 rounded-3xl p-4 border border-teal-200/90 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-teal-200 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-teal-950">3. At Pass / Plated</h3>
            </div>
            <span className="font-mono text-xs font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full border border-teal-300">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-cafe-400">
                No orders waiting at the pass
              </div>
            ) : (
              readyOrders.map(order => <OrderTicketCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Column 4: Delivered / Served */}
        <div className="bg-emerald-50/40 rounded-3xl p-4 border border-emerald-200/90 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-emerald-950">4. Served to Guest</h3>
            </div>
            <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
              {servedOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {servedOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-cafe-400">
                No served orders in buffer
              </div>
            ) : (
              servedOrders.map(order => <OrderTicketCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
