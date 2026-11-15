import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Receipt, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Clock, 
  X, 
  Percent,
  Sparkles,
  Coffee,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BillingPOS: React.FC = () => {
  const { orders, processPayment, activeLocation } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find(o => o.locationId === activeLocation.id && o.status !== 'completed')?.id || ''
  );
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI / Card');
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const locationOrders = orders.filter(o => o.locationId === activeLocation.id);
  const pendingOrders = locationOrders.filter(o => o.status !== 'completed');
  const completedOrders = locationOrders.filter(o => o.status === 'completed');

  const activeOrder = orders.find(o => o.id === selectedOrderId);

  const handleSettleBill = () => {
    if (!activeOrder) return;

    processPayment(activeOrder.id, paymentMethod, discountAmount);
    confetti({ particleCount: 70, spread: 60 });
    setInvoiceModalOrder({ ...activeOrder, paymentStatus: 'paid', status: 'completed', discount: discountAmount });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Point of Sale (POS) & Tax Invoicing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            Billing & Fiscal Terminal
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            {activeLocation.name} • Dual tax split (CGST + SGST), discount ledger, and printable receipts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200">
            {pendingOrders.length} Bills Pending
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            {completedOrders.length} Settled Today
          </span>
        </div>
      </div>

      {/* POS Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders Queue for Billing (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-cafe-200 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-cafe-900">
              Select Table or Order to Bill
            </h3>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 text-xs text-cafe-400">
                  All active orders are settled!
                </div>
              ) : (
                pendingOrders.map(ord => {
                  const isSelected = ord.id === selectedOrderId;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                          : 'bg-cafe-50/50 border-cafe-200 hover:bg-cafe-100/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-cafe-900">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cafe-200 text-cafe-800 uppercase">
                            {ord.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-cafe-700 mt-0.5">
                          {ord.tableNumber ? `Table ${ord.tableNumber}` : 'Counter'} • {ord.customerName}
                        </p>
                        <span className="text-[11px] text-cafe-500">
                          {ord.items.length} items • Ordered at {ord.createdAt}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-base text-cafe-950 block">
                          ${ord.total.toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          ord.status === 'billed' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Bill Breakdown & Payment (7 cols) */}
        <div className="lg:col-span-7">
          {activeOrder ? (
            <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-6 border-b border-cafe-200 bg-cafe-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Terminal Active
                  </span>
                  <h3 className="font-serif font-bold text-xl text-cafe-900 mt-1">
                    Invoice Settlement: #{activeOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-cafe-500">
                    {activeOrder.tableNumber ? `Table ${activeOrder.tableNumber}` : 'Takeaway'} • Guest: {activeOrder.customerName}
                  </p>
                </div>

                <button
                  onClick={() => setInvoiceModalOrder(activeOrder)}
                  className="px-3 py-1.5 rounded-xl border border-cafe-300 hover:bg-white text-cafe-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Preview Tax Invoice
                </button>
              </div>

              {/* Order Items Table */}
              <div className="p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-cafe-200 text-cafe-500 font-bold uppercase text-[10px]">
                        <th className="pb-2">Qty</th>
                        <th className="pb-2">Item Description</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cafe-100">
                      {activeOrder.items.map((it, idx) => (
                        <tr key={idx} className="py-2">
                          <td className="py-2.5 font-mono font-bold text-amber-800">{it.quantity}x</td>
                          <td className="py-2.5 font-semibold text-cafe-900">
                            {it.name}
                            {it.customization?.jainPrep && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold ml-1.5">
                                🕊️ Strict Jain
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-right font-mono text-cafe-600">${it.price.toFixed(2)}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-cafe-950">
                            ${(it.price * it.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals & Taxes breakdown */}
                <div className="p-4 bg-cafe-50 rounded-2xl border border-cafe-200 space-y-2 text-xs">
                  <div className="flex justify-between text-cafe-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cafe-600">
                    <span>CGST (2.5%):</span>
                    <span className="font-mono">${(activeOrder.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cafe-600">
                    <span>SGST (2.5%):</span>
                    <span className="font-mono">${(activeOrder.tax / 2).toFixed(2)}</span>
                  </div>
                  {activeOrder.serviceCharge > 0 && (
                    <div className="flex justify-between text-cafe-600">
                      <span>Service Hospitality (5%):</span>
                      <span className="font-mono">${activeOrder.serviceCharge.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Apply Discount */}
                  <div className="pt-2 border-t border-cafe-200 flex items-center justify-between">
                    <span className="font-semibold text-cafe-700">Loyalty / Manager Discount:</span>
                    <div className="flex items-center gap-1.5">
                      {[0, 2, 5, 10].map(disc => (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => setDiscountAmount(disc)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            discountAmount === disc
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-white text-cafe-700 border-cafe-300'
                          }`}
                        >
                          ${disc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cafe-200 flex justify-between font-bold text-sm text-cafe-950">
                    <span>Final Amount Due:</span>
                    <span className="font-serif text-lg text-amber-900 font-bold">
                      ${Math.max(0, +(activeOrder.total - discountAmount)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'UPI / Card', label: 'UPI QR / Digital', icon: QrCode },
                      { key: 'Cash', label: 'Cash Drawer', icon: Banknote },
                      { key: 'Corporate Account', label: 'Card Swipe', icon: CreditCard },
                      { key: 'Split', label: 'Split Bill', icon: Receipt },
                    ].map(pm => {
                      const Icon = pm.icon;
                      return (
                        <button
                          key={pm.key}
                          type="button"
                          onClick={() => setPaymentMethod(pm.key as any)}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition ${
                            paymentMethod === pm.key
                              ? 'bg-cafe-900 text-white border-cafe-950 shadow-xs'
                              : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px] font-semibold">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Settle Action */}
              <div className="p-6 border-t border-cafe-200 bg-white">
                <button
                  onClick={handleSettleBill}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-700/25 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Settle & Print Receipt (${Math.max(0, +(activeOrder.total - discountAmount)).toFixed(2)})
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-cafe-200 text-cafe-400">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h4 className="font-semibold text-cafe-700">No Order Selected</h4>
              <p className="text-xs mt-1">Select an active order on the left to process billing and invoice printing.</p>
            </div>
          )}
        </div>
      </div>

      {/* OFFICIAL PRINTABLE TAX INVOICE MODAL */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-300 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-cafe-200 flex items-center justify-between bg-cafe-50 no-print">
              <span className="font-bold text-xs uppercase tracking-wider text-cafe-800">
                Printable Tax Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button onClick={() => setInvoiceModalOrder(null)} className="p-1 text-cafe-400 hover:text-cafe-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area with Paper Aesthetic */}
            <div id="printable-receipt" className="p-6 overflow-y-auto space-y-4 text-xs font-mono text-neutral-900 bg-white">
              {/* Receipt Header */}
              <div className="text-center space-y-1 border-b-2 border-dashed border-neutral-300 pb-4">
                <div className="font-serif font-bold text-xl text-neutral-950 uppercase tracking-widest">
                  AromaCraft Bistro
                </div>
                <div className="text-[11px] font-sans text-neutral-600">
                  {activeLocation.name}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {activeLocation.address}
                </div>
                <div className="text-[10px] text-neutral-500">
                  Phone: {activeLocation.phone} • GSTIN: 27AABCA1234F1Z8
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="flex justify-between text-[11px] border-b border-neutral-200 pb-2">
                <div>
                  <div>INV #: INV-{invoiceModalOrder.orderNumber}</div>
                  <div>Table: {invoiceModalOrder.tableNumber || 'Takeaway'}</div>
                  <div>Guest: {invoiceModalOrder.customerName}</div>
                </div>
                <div className="text-right">
                  <div>Date: {new Date().toISOString().split('T')[0]}</div>
                  <div>Time: {invoiceModalOrder.createdAt}</div>
                  <div className="font-bold text-emerald-800 uppercase">PAID</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 border-b-2 border-dashed border-neutral-300 pb-3">
                <div className="flex justify-between font-bold text-[10px] uppercase text-neutral-500">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                {invoiceModalOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-neutral-900">
                    <span>
                      {it.quantity}x {it.name}
                      {it.customization?.jainPrep && ' [JAIN]'}
                    </span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>${invoiceModalOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>CGST (2.5%):</span>
                  <span>${(invoiceModalOrder.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>SGST (2.5%):</span>
                  <span>${(invoiceModalOrder.tax / 2).toFixed(2)}</span>
                </div>
                {invoiceModalOrder.serviceCharge > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Service Hospitality (5%):</span>
                    <span>${invoiceModalOrder.serviceCharge.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Applied:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-neutral-900 pt-2 text-neutral-950">
                  <span>Total Settled:</span>
                  <span>${Math.max(0, invoiceModalOrder.total - discountAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 pt-1">
                  <span>Payment Mode:</span>
                  <span className="font-bold uppercase">{paymentMethod}</span>
                </div>
              </div>

              {/* QR Code and Footer message */}
              <div className="pt-4 border-t-2 border-dashed border-neutral-300 text-center space-y-2">
                <div className="w-20 h-20 bg-neutral-100 border border-neutral-300 mx-auto flex items-center justify-center rounded-lg">
                  <QrCode className="w-14 h-14 text-neutral-700" />
                </div>
                <div className="text-[10px] text-neutral-500">
                  Scan to download digital invoice or earn loyalty stars.
                </div>
                <div className="text-[10px] font-sans font-semibold text-neutral-700">
                  Thank you for dining at AromaCraft! Have an aromatic day. ☕
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
