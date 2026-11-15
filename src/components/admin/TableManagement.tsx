import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  Sparkles, 
  X, 
  Receipt,
  Plus,
  Trash2,
  Edit2,
  Layers,
  AlertTriangle,
  Check,
  FolderPlus
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
    orders,
    addTable,
    updateTable,
    deleteTable,
    customSections,
    addCustomSection,
    deleteCustomSection
  } = useApp();

  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  // Seat Party Form inside Drawer
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedQueueTicketId, setSelectedQueueTicketId] = useState<string>('');

  // Add Table Modal State
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableSection, setNewTableSection] = useState('');
  const [newSectionInline, setNewSectionInline] = useState('');

  // Manage Sections Modal State
  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // Edit Table State inside Active Table Drawer
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [editNumber, setEditNumber] = useState('');
  const [editCapacity, setEditCapacity] = useState(4);
  const [editSection, setEditSection] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const locationTables = tables.filter(t => t.locationId === activeLocation.id);
  const locationQueueWaiting = queue.filter(q => q.locationId === activeLocation.id && (q.status === 'waiting' || q.status === 'called'));

  // Merge customSections with existing table sections for complete list
  const allSections = Array.from(new Set([...customSections, ...locationTables.map(t => t.section)]));
  const sections = ['All', ...allSections];

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

  const handleOpenAddTable = () => {
    // Generate smart default table number
    const nextNum = `T-${locationTables.length + 1}`;
    setNewTableNumber(nextNum);
    setNewTableCapacity(4);
    setNewTableSection(allSections[0] || 'Main Hall');
    setNewSectionInline('');
    setIsAddTableOpen(true);
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = newSectionInline.trim() || newTableSection || 'Main Hall';
    if (newSectionInline.trim()) {
      addCustomSection(newSectionInline.trim());
    }

    addTable({
      locationId: activeLocation.id,
      tableNumber: newTableNumber.trim() || `T-${locationTables.length + 1}`,
      capacity: newTableCapacity,
      section: finalSection,
      status: 'available',
    });

    setIsAddTableOpen(false);
    setNewSectionInline('');
  };

  const handleOpenTableDetails = (table: Table) => {
    setActiveTable(table);
    setIsEditingTable(false);
    setShowDeleteConfirm(false);
    setEditNumber(table.tableNumber);
    setEditCapacity(table.capacity);
    setEditSection(table.section);
    setGuestName('');
    setSelectedQueueTicketId('');
  };

  const handleSaveTableEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTable) return;

    updateTable(activeTable.id, {
      tableNumber: editNumber.trim() || activeTable.tableNumber,
      capacity: editCapacity,
      section: editSection || activeTable.section,
    });

    setActiveTable(prev => prev ? {
      ...prev,
      tableNumber: editNumber.trim() || prev.tableNumber,
      capacity: editCapacity,
      section: editSection || prev.section,
    } : null);

    setIsEditingTable(false);
  };

  const handleDeleteTable = () => {
    if (!activeTable) return;
    deleteTable(activeTable.id);
    setActiveTable(null);
    setShowDeleteConfirm(false);
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    addCustomSection(newSectionName.trim());
    setNewSectionName('');
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
            {locationTables.length} total tables • {locationTables.filter(t => t.status === 'occupied').length} seated • {locationTables.filter(t => t.status === 'available').length} free • {allSections.length} sections
          </p>
        </div>

        {/* Action Controls: Add Table & Manage Sections */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsManageSectionsOpen(true)}
            className="px-4 py-2.5 bg-cafe-100 hover:bg-cafe-200 text-cafe-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-cafe-300"
          >
            <Layers className="w-4 h-4 text-amber-700" />
            <span>Manage Sections</span>
          </button>

          <button
            onClick={handleOpenAddTable}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Quick seating from Queue notice */}
      {locationQueueWaiting.length > 0 && (
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-cafe-950 font-bold flex items-center justify-center shrink-0">
            {locationQueueWaiting.length}
          </div>
          <div className="text-xs flex-1">
            <span className="font-bold text-amber-950 block">Live Virtual Queue Waiting</span>
            <span className="text-amber-800 text-[11px]">
              Click any available table to assign ticket #{locationQueueWaiting[0].ticketNumber} ({locationQueueWaiting[0].customerName}, {locationQueueWaiting[0].partySize} guests)
            </span>
          </div>
        </div>
      )}

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

        {/* Dynamic Section Tabs */}
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
              {sec} {sec !== 'All' && `(${locationTables.filter(t => t.section === sec).length})`}
            </button>
          ))}
          <button
            onClick={() => setIsManageSectionsOpen(true)}
            className="px-2 py-1 rounded-lg text-amber-700 hover:bg-amber-50 font-bold text-[11px] whitespace-nowrap flex items-center gap-1 ml-auto"
          >
            <Plus className="w-3 h-3" /> Add Section
          </button>
        </div>
      </div>

      {/* Interactive Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTables.map(tbl => (
          <div
            key={tbl.id}
            onClick={() => handleOpenTableDetails(tbl)}
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
                <span className="font-semibold text-cafe-800">{tbl.section}</span> • {tbl.capacity} Seats
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

        {filteredTables.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-cafe-200 p-6">
            <Utensils className="w-8 h-8 text-cafe-400 mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-sm text-cafe-800">No tables match current filters</h4>
            <p className="text-xs text-cafe-500 mt-1">
              Section: "{selectedSection}" • Status: "{selectedStatus}"
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => { setSelectedSection('All'); setSelectedStatus('All'); }}
                className="px-4 py-2 bg-cafe-100 hover:bg-cafe-200 text-cafe-800 rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
              <button
                onClick={handleOpenAddTable}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
              >
                + Add Table to {selectedSection !== 'All' ? selectedSection : 'Floor'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cafe-900">Add New Table</h3>
                  <p className="text-xs text-cafe-500">{activeLocation.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTableOpen(false)}
                className="p-1 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTableSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Table Number / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-11 or R-01"
                  value={newTableNumber}
                  onChange={e => setNewTableNumber(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Seating Capacity (Guests) *
                </label>
                <div className="flex items-center gap-2">
                  {[2, 4, 6, 8, 10, 12].map(cap => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setNewTableCapacity(cap)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        newTableCapacity === cap
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Select Floor Section *
                </label>
                <select
                  value={newTableSection}
                  onChange={e => setNewTableSection(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900 focus:outline-hidden"
                >
                  {allSections.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-cafe-200">
                <label className="font-semibold text-cafe-600 block mb-1">
                  Or Create a New Section for this Table:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rooftop Patio, VIP Cabana..."
                  value={newSectionInline}
                  onChange={e => setNewSectionInline(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-cafe-200 placeholder:text-cafe-400 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cafe-200 text-cafe-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Sections Modal */}
      {isManageSectionsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cafe-900 text-white flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cafe-900">Manage Sections</h3>
                  <p className="text-xs text-cafe-500">Add or clean up floor zones</p>
                </div>
              </div>
              <button
                onClick={() => setIsManageSectionsOpen(false)}
                className="p-1 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Add New Section Form */}
              <form onSubmit={handleAddSectionSubmit} className="space-y-2">
                <label className="font-bold text-cafe-800 block">
                  Add New Floor Section
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rooftop Terrace, VIP Suite"
                    value={newSectionName}
                    onChange={e => setNewSectionName(e.target.value)}
                    className="flex-1 p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-cafe-900 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Existing Sections List */}
              <div>
                <label className="font-bold text-cafe-800 block mb-2">
                  Current Active Sections ({allSections.length})
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {allSections.map(sec => {
                    const count = locationTables.filter(t => t.section === sec).length;
                    return (
                      <div
                        key={sec}
                        className="p-3 bg-cafe-50 rounded-2xl border border-cafe-200 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-cafe-900 block">{sec}</span>
                          <span className="text-[10px] text-cafe-500">
                            {count} table{count === 1 ? '' : 's'} assigned
                          </span>
                        </div>
                        {count === 0 ? (
                          <button
                            type="button"
                            onClick={() => deleteCustomSection(sec)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                            title="Remove unused section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-cafe-400 bg-white px-2 py-0.5 rounded border border-cafe-200">
                            In Use
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsManageSectionsOpen(false)}
                  className="px-5 py-2.5 bg-cafe-900 text-white font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditingTable(!isEditingTable)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    isEditingTable ? 'bg-amber-600 text-white' : 'text-cafe-600 hover:bg-cafe-200'
                  }`}
                  title="Edit table capacity or section"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setActiveTable(null)}
                  className="p-2 text-cafe-400 hover:text-cafe-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* EDIT TABLE FORM INLINE */}
              {isEditingTable && (
                <form onSubmit={handleSaveTableEdits} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold uppercase tracking-wider text-amber-950 text-[11px] flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                      Edit Table Details
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingTable(false)}
                      className="text-cafe-500 hover:text-cafe-800 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-cafe-700 block mb-1">
                        Table Number / Label
                      </label>
                      <input
                        type="text"
                        required
                        value={editNumber}
                        onChange={e => setEditNumber(e.target.value)}
                        className="w-full p-2 bg-white rounded-xl border border-cafe-300 font-bold text-cafe-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-cafe-700 block mb-1">
                        Seating Capacity
                      </label>
                      <select
                        value={editCapacity}
                        onChange={e => setEditCapacity(Number(e.target.value))}
                        className="w-full p-2 bg-white rounded-xl border border-cafe-300 font-bold text-cafe-900"
                      >
                        {[1, 2, 3, 4, 6, 8, 10, 12].map(c => (
                          <option key={c} value={c}>{c} Guests</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-cafe-700 block mb-1">
                      Floor Section
                    </label>
                    <select
                      value={editSection}
                      onChange={e => setEditSection(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-cafe-300 font-bold text-cafe-900"
                    >
                      {allSections.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs"
                    >
                      Save Table Changes
                    </button>
                  </div>
                </form>
              )}

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

              {/* Danger Zone: Delete / Remove Table */}
              <div className="pt-4 border-t border-cafe-200">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Table from Floor Plan
                  </button>
                ) : (
                  <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-300 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Delete Table {activeTable.tableNumber}?</span>
                    </div>
                    <p className="text-[11px] text-rose-700">
                      This will permanently remove this table and its configurations from {activeLocation.name}.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-1.5 bg-white border border-rose-200 text-cafe-700 rounded-xl font-semibold text-[11px]"
                      >
                        Keep Table
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteTable}
                        className="flex-1 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold text-[11px] shadow-xs"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                Clear / Reset State
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
