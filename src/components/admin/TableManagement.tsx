import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  DollarSign, 
  Sparkles, 
  X, 
  Receipt,
  UserCheck
} from 'lucide-react';

interface TableManagementProps {
  onNavigateTab: (tab: string) => void;
}

export const TableManagement: React.FC<TableManagementProps> = ({ onNavigateTab }) => {
  const { 
    tables, 
    updateTableStatus, 
    seatQueueTicketAtTable, 
    activeLocation, 
    queue, 
    orders 
  } = useApp();

  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  // Seat Party Form inside Drawer
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedQueueTicketId, setSelectedQueueTicketId] = useState<string>('');

  const locationTables = tables.filter(t => t.locationId === activeLocation.id);
  const locationQueueWaiting = queue.filter(q => q.locationId === activeLocation.id && (q.status === 'waiting' || q.status === 'called'));

  const sections = ['All', 'Main Hall', 'Window Lounge', 'Outdoor Terrace', 'Private Roastery Room'];
  const statuses: { key: string; label: string; color: string }[] = [
    { key: 'All', label: 'All Tables', color: 'bg-cafe-900 text-white' },
    { key: 'available', label: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { key: 'occupied', label: 'Occupied', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { key: 'reserved', label: 'Reserved', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { key: 'billed', label: 'Billed', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { key: 'cleaning', label: 'Cleaning', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  ];

  const filteredTables = locationTables.filter(t => {
    if (selectedSection !== 'All' && t.section !== selectedSection) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Available</span>;
      case 'occupied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Occupied</span>;
      case 'reserved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">Reserved</span>;
      case 'billed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">Billed</span>;
      case 'cleaning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">Cleaning</span>;
    }
  };

  const handleSeatWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTable) return;

    if (selectedQueueTicketId) {
      seatQueueTicketAtTable(selectedQueueTicketId, activeTable.id);
    } else {
      updateTableStatus(activeTable.id, 'occupied', guestName || 'Walk-in Guest', guestCount);
    }

    setActiveTable(null);
    setGuestName('');
    setSelectedQueueTicketId('');
  };

  // Find active order for this table if any
  const tableOrder = activeTable ? orders.find(o => o.tableNumber === activeTable.tableNumber && o.status !== 'completed') : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Floor Plan & Real-time Table Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            Table Management: {activeLocation.name}
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            {locationTables.length} total tables • {locationTables.filter(t => t.status === 'occupied').length} currently seated • {locationTables.filter(t => t.status === 'available').length} free
          </p>
        </div>

        {/* Quick seating from Queue notice */}
        {locationQueueWaiting.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-cafe-950 font-bold flex items-center justify-center shrink-0">
              {locationQueueWaiting.length}
            </div>
            <div className="text-xs">
              <span className="font-bold text-amber-950 block">Waiting in Queue</span>
              <span className="text-amber-800 text-[11px]">
                Click an available table to assign ticket #{locationQueueWaiting[0].ticketNumber} ({locationQueueWaiting[0].customerName})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters: Sections & Status */}
      <div className="bg-white p-4 rounded-2xl border border-cafe-200 shadow-xs space-y-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map(s => {
            const count = s.key === 'All' ? locationTables.length : locationTables.filter(t => t.status === s.key).length;
            const isSelected = selectedStatus === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSelectedStatus(s.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isSelected ? 'bg-cafe-900 text-white border-cafe-950 shadow-xs' : 'bg-cafe-50 text-cafe-700 border-cafe-200 hover:bg-cafe-100'
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-cafe-100 text-xs">
          <span className="text-cafe-500 font-semibold uppercase text-[10px] shrink-0">Section:</span>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedSection === sec
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-cafe-600 hover:bg-cafe-100'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTables.map(tbl => (
          <div
            key={tbl.id}
            onClick={() => setActiveTable(tbl)}
            className={`cursor-pointer rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] ${
              tbl.status === 'occupied'
                ? 'bg-amber-50/70 border-amber-300'
                : tbl.status === 'available'
                ? 'bg-emerald-50/70 border-emerald-300'
                : tbl.status === 'reserved'
                ? 'bg-blue-50/70 border-blue-300'
                : tbl.status === 'billed'
                ? 'bg-purple-50/70 border-purple-300'
                : 'bg-rose-50/70 border-rose-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-cafe-900">
                  {tbl.tableNumber}
                </span>
                {getStatusBadge(tbl.status)}
              </div>

              <div className="mt-2 text-[11px] text-cafe-600">
                <span className="font-semibold">{tbl.section}</span> • {tbl.capacity} Seats
              </div>

              {/* Seated Info if occupied or reserved */}
              {tbl.seatedPartyName && (
                <div className="mt-3 p-2 bg-white/80 rounded-xl border border-black/5 text-xs">
                  <div className="font-bold text-cafe-900 truncate">
                    {tbl.seatedPartyName}
                  </div>
                  <div className="text-[10px] text-cafe-500 flex items-center justify-between mt-0.5">
                    <span>{tbl.partySize || tbl.capacity} Guests</span>
                    {tbl.seatedAt && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {tbl.seatedAt}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px]">
              <span className="text-cafe-500 font-medium">Click to manage</span>
              <span className="font-bold text-amber-800">Actions →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Control Drawer / Modal */}
      {activeTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cafe-900 text-white font-serif font-bold text-lg flex items-center justify-center">
                  {activeTable.tableNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-cafe-900">
                      Table {activeTable.tableNumber}
                    </h3>
                    {getStatusBadge(activeTable.status)}
                  </div>
                  <p className="text-xs text-cafe-500">
                    {activeTable.section} • Capacity {activeTable.capacity} guests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTable(null)}
                className="p-1 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick Status Override Buttons */}
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                  Update Table State
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['available', 'occupied', 'reserved', 'billed', 'cleaning'] as TableStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTableStatus(activeTable.id, st);
                        setActiveTable(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold capitalize border transition ${
                        activeTable.status === st
                          ? 'bg-cafe-900 text-white border-cafe-950 shadow-xs'
                          : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Form (if Table is Available or Cleaning) */}
              {(activeTable.status === 'available' || activeTable.status === 'cleaning') && (
                <div className="p-5 bg-cafe-50 rounded-2xl border border-cafe-200 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-cafe-900">
                    Seat Party at Table {activeTable.tableNumber}
                  </h4>

                  {/* Option 1: Seat from Live Queue */}
                  {locationQueueWaiting.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-cafe-700 block mb-1">
                        Option A: Seat Next from Virtual Queue
                      </label>
                      <select
                        value={selectedQueueTicketId}
                        onChange={e => setSelectedQueueTicketId(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-cafe-300 text-xs font-semibold text-cafe-900 focus:outline-hidden"
                      >
                        <option value="">-- Choose Queue Ticket to Seat --</option>
                        {locationQueueWaiting.map(q => (
                          <option key={q.id} value={q.id}>
                            #{q.ticketNumber} • {q.customerName} ({q.partySize} guests) • {q.dietaryPreference?.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Option 2: Walk-In details */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-cafe-700 block">
                      Option B: Walk-In Guest Details
                    </label>
                    <input
                      type="text"
                      placeholder="Guest Name (e.g. David Chen)"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-cafe-300 text-xs focus:outline-hidden"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cafe-600">Party Size:</span>
                      {[1, 2, 4, 6, 8].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setGuestCount(cnt)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            guestCount === cnt ? 'bg-amber-600 text-white' : 'bg-white border-cafe-200 text-cafe-800'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSeatWalkIn}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs"
                  >
                    Confirm & Seat Guests
                  </button>
                </div>
              )}

              {/* Active Order Details if Occupied or Billed */}
              {tableOrder && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                        Live Order #{tableOrder.orderNumber}
                      </span>
                      <h5 className="font-semibold text-xs text-cafe-900 mt-1">
                        {tableOrder.items.length} items ordered
                      </h5>
                    </div>
                    <span className="font-serif font-bold text-base text-amber-950">
                      ₹{tableOrder.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="divide-y divide-amber-200/60 text-xs">
                    {tableOrder.items.map((it, i) => (
                      <div key={i} className="py-1.5 flex justify-between">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-mono">₹{(it.price * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTable(null);
                        onNavigateTab('billing');
                      }}
                      className="flex-1 py-2 bg-cafe-900 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Open in Billing POS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cafe-50 border-t border-cafe-200 flex items-center justify-between">
              <button
                onClick={() => {
                  updateTableStatus(activeTable.id, 'available');
                  setActiveTable(null);
                }}
                className="text-xs font-semibold text-cafe-600 hover:text-cafe-900"
              >
                Clear / Reset Table
              </button>
              <button
                onClick={() => setActiveTable(null)}
                className="px-4 py-2 bg-cafe-900 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
