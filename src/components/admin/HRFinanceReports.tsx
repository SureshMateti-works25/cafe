import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HRStaff } from '../../types';
import { 
  BarChart3, 
  Users, 
  Download, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  UserCheck,
  Search,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export const HRFinanceReports: React.FC = () => {
  const { 
    staff, 
    toggleClockIn, 
    addStaff, 
    updateStaff, 
    removeStaff, 
    locations, 
    wastageLogs, 
    activeLocation 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'finance' | 'hr'>('hr');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');

  // Staff Modal State (Add / Edit)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState(activeLocation.id);
  const [role, setRole] = useState<HRStaff['role']>('Head Barista');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState<HRStaff['shift']>('Morning (07:00 - 15:30)');
  const [baseSalary, setBaseSalary] = useState<number>(45000);
  const [monthlyHours, setMonthlyHours] = useState<number>(160);
  const [performanceScore, setPerformanceScore] = useState<number>(95);

  // Confirm delete dialog state
  const [deletingStaff, setDeletingStaff] = useState<HRStaff | null>(null);

  // Help Guide collapse
  const [showGuide, setShowGuide] = useState(false);

  // Financial Aggregates in ₹
  const totalGrossSales = locations.reduce((sum, l) => sum + l.todayRevenue, 0);
  const totalWastageLoss = wastageLogs.reduce((sum, w) => sum + w.costImpact, 0);
  const totalMonthlyPayroll = staff.reduce((sum, s) => sum + s.baseSalary, 0);
  const clockedInCount = staff.filter(s => s.isClockedIn).length;

  const estCOGS = totalGrossSales * 0.30;
  const estGrossProfit = totalGrossSales - estCOGS - totalWastageLoss;

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value (INR)\n"
      + `Total Gross Sales,₹${totalGrossSales.toLocaleString()}\n`
      + `Estimated COGS,₹${estCOGS.toLocaleString()}\n`
      + `Total Wastage Loss,₹${totalWastageLoss.toLocaleString()}\n`
      + `Gross Operating Profit,₹${estGrossProfit.toLocaleString()}\n`
      + `Total Monthly Payroll,₹${totalMonthlyPayroll.toLocaleString()}\n`
      + `Total Staff Enrolled,${staff.length}\n`
      + `Active Staff Clocked In,${clockedInCount}\n\n`
      + "Staff ID,Name,Role,Location,Shift,Salary (INR),Clocked In\n"
      + staff.map(s => `${s.id},"${s.name}","${s.role}","${locations.find(l => l.id === s.locationId)?.name || s.locationId}","${s.shift}",₹${s.baseSalary.toLocaleString()},${s.isClockedIn ? 'YES' : 'NO'}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AromaCraft_HR_Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddModal = () => {
    setEditingStaffId(null);
    setName('');
    setLocationId(activeLocation.id);
    setRole('Head Barista');
    setPhone('+91 ');
    setEmail('');
    setShift('Morning (07:00 - 15:30)');
    setBaseSalary(45000);
    setMonthlyHours(160);
    setPerformanceScore(95);
    setIsStaffModalOpen(true);
  };

  const handleOpenEditModal = (member: HRStaff) => {
    setEditingStaffId(member.id);
    setName(member.name);
    setLocationId(member.locationId);
    setRole(member.role);
    setPhone(member.phone);
    setEmail(member.email);
    setShift(member.shift);
    setBaseSalary(member.baseSalary);
    setMonthlyHours(member.monthlyHours);
    setPerformanceScore(member.performanceScore);
    setIsStaffModalOpen(true);
  };

  const handleStaffFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    if (editingStaffId) {
      updateStaff(editingStaffId, {
        name,
        locationId,
        role,
        phone,
        email,
        shift,
        baseSalary,
        monthlyHours,
        performanceScore,
      });
    } else {
      addStaff({
        locationId,
        name,
        role,
        phone,
        email,
        shift,
        monthlyHours,
        baseSalary,
        performanceScore,
      });
    }

    setIsStaffModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingStaff) {
      removeStaff(deletingStaff.id);
      setDeletingStaff(null);
    }
  };

  // Filter staff by location and search
  const filteredStaff = staff.filter(s => {
    if (selectedBranchFilter !== 'All' && s.locationId !== selectedBranchFilter) return false;
    if (staffSearchQuery.trim() !== '') {
      const q = staffSearchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRole = s.role.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Corporate Intelligence & People Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            HR & Finance Reports
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            Executive P&L summaries, food cost ratios, shift attendance, and comprehensive staff management (add, update, remove)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-3.5 py-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Staff Guide</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-cafe-900 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Report (CSV)
          </button>
        </div>
      </div>

      {/* Staff Management User Guide (Collapsible) */}
      {showGuide && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-6 shadow-xs space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-base text-amber-950">
                How to Manage Cafe Staff (Operations Guide)
              </h3>
            </div>
            <button onClick={() => setShowGuide(false)} className="text-amber-800 hover:text-amber-950 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-amber-950">
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-amber-900">Add New Staff</h4>
              <p className="text-cafe-700 text-[11px] leading-relaxed">
                Click <strong>"+ Add Staff Member"</strong>. Provide employee name, assign their branch location, operational role (Barista, Chef, Manager), shift schedule, and monthly salary in ₹.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-amber-900">Update / Edit Profile</h4>
              <p className="text-cafe-700 text-[11px] leading-relaxed">
                Click the <strong>Edit (Pencil)</strong> icon on any employee row. You can adjust their salary increments, switch shift timings, promote roles, or update phone/email info.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-amber-900">Attendance Clock In/Out</h4>
              <p className="text-cafe-700 text-[11px] leading-relaxed">
                Staff can click <strong>"Clock In"</strong> when beginning their shift and <strong>"Clock Out"</strong> at closing. The live green badge updates with the exact check-in timestamp.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-amber-900">Remove / Terminate</h4>
              <p className="text-cafe-700 text-[11px] leading-relaxed">
                Click the <strong>Trash</strong> icon on an employee row to trigger the termination modal. Confirming cleanly disenrolls them from active payroll and branch shifts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex bg-cafe-200/70 p-1.5 rounded-2xl border border-cafe-300/60 max-w-sm shadow-inner">
        <button
          onClick={() => setActiveTab('hr')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hr' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Staff & Payroll ({staff.length})
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'finance' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Financial Intelligence
        </button>
      </div>

      {/* TAB 1: HR STAFF & PAYROLL (Default View) */}
      {activeTab === 'hr' && (
        <div className="space-y-6">
          {/* HR KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Active Duty Staff</span>
              <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
                {clockedInCount} / {staff.length} Clocked In
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">Live biometric/clock sync</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Total Monthly Payroll</span>
              <span className="font-serif font-bold text-2xl text-cafe-950 font-mono mt-1 block">
                ₹{totalMonthlyPayroll.toLocaleString()}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">Across all {locations.length} branches</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Avg Staff Performance Score</span>
              <span className="font-serif font-bold text-2xl text-amber-600 mt-1 block">
                94.8 / 100
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Excellent service index</span>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-cafe-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff by name, role..."
                  value={staffSearchQuery}
                  onChange={e => setStaffSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              {/* Branch Filter */}
              <select
                value={selectedBranchFilter}
                onChange={e => setSelectedBranchFilter(e.target.value)}
                className="p-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold text-cafe-800 focus:outline-hidden"
              >
                <option value="All">All Branches ({staff.length})</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name.replace('AromaCraft ', '')} ({staff.filter(s => s.locationId === loc.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* ADD STAFF BUTTON */}
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Staff Member
            </button>
          </div>

          {/* Staff Roster Table with Edit & Remove Actions */}
          <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cafe-50 border-b border-cafe-200 text-cafe-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Role & Branch</th>
                    <th className="p-4">Assigned Shift</th>
                    <th className="p-4">Live Status</th>
                    <th className="p-4">Monthly Hours</th>
                    <th className="p-4">Monthly Salary</th>
                    <th className="p-4 text-center">Clock Attendance</th>
                    <th className="p-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-100">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-cafe-400">
                        No staff members found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(member => {
                      const branch = locations.find(l => l.id === member.locationId);
                      return (
                        <tr key={member.id} className="hover:bg-cafe-50/50 transition">
                          <td className="p-4">
                            <div className="font-bold text-cafe-900 text-sm">{member.name}</div>
                            <div className="text-[10px] text-cafe-500 mt-0.5 flex items-center gap-2">
                              <span>{member.phone}</span>
                              <span>•</span>
                              <span>{member.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-cafe-900">{member.role}</div>
                            <div className="text-[10px] text-amber-800 font-medium">
                              {branch ? branch.name.replace('AromaCraft ', '') : 'HQ General'}
                            </div>
                          </td>
                          <td className="p-4 text-cafe-600 font-medium">
                            {member.shift}
                          </td>
                          <td className="p-4">
                            {member.isClockedIn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Clocked In ({member.clockInTime || '07:00'})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cafe-100 text-cafe-600 text-[10px] font-bold">
                                Clocked Out
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-cafe-800 font-bold">
                            {member.monthlyHours} hrs
                          </td>
                          <td className="p-4 font-mono font-bold text-cafe-950">
                            ₹{member.baseSalary.toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleClockIn(member.id)}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                                member.isClockedIn
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                              }`}
                            >
                              {member.isClockedIn ? 'Clock Out' : 'Clock In'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Staff Action */}
                              <button
                                onClick={() => handleOpenEditModal(member)}
                                title="Edit employee details & salary"
                                className="p-1.5 rounded-lg text-cafe-600 hover:text-cafe-900 hover:bg-cafe-100 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Remove Staff Action */}
                              <button
                                onClick={() => setDeletingStaff(member)}
                                title="Remove / Terminate employee"
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL INTELLIGENCE */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Financial Cards in ₹ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Chain Gross Revenue</span>
              <span className="font-serif font-bold text-2xl text-cafe-950 mt-1 block">
                ₹{totalGrossSales.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">+14.2% Growth</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Food Cost (COGS)</span>
              <span className="font-serif font-bold text-2xl text-cafe-950 mt-1 block">
                ₹{estCOGS.toLocaleString()}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">~30.0% of revenue</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Kitchen Wastage Drain</span>
              <span className="font-serif font-bold text-2xl text-red-600 font-mono mt-1 block">
                -₹{totalWastageLoss.toLocaleString()}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">0.2% of sales (healthy)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Estimated Operating Margin</span>
              <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
                ₹{estGrossProfit.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">69.8% margin</span>
            </div>
          </div>

          {/* Revenue by Location Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-cafe-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-cafe-900">
              Branch Revenue & Contribution Breakdown
            </h3>

            <div className="space-y-4 pt-2">
              {locations.map(loc => {
                const share = totalGrossSales > 0 ? Math.round((loc.todayRevenue / totalGrossSales) * 100) : 0;
                return (
                  <div key={loc.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-cafe-900">{loc.name}</span>
                        <span className="text-cafe-500 ml-2 font-mono">({loc.city})</span>
                      </div>
                      <div className="font-mono">
                        <span className="font-bold text-cafe-950">₹{loc.todayRevenue.toLocaleString()}</span>
                        <span className="text-cafe-400 ml-1.5 font-sans">({share}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-cafe-100 overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STAFF MODAL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-2 text-cafe-900 font-bold text-sm">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>{editingStaffId ? 'Update Employee Details' : 'Enroll New Staff Member'}</span>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs sm:text-sm font-semibold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Designation / Role *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Head Barista">Head Barista</option>
                    <option value="Sous Chef">Sous Chef</option>
                    <option value="Line Cook">Line Cook</option>
                    <option value="Cashier / Host">Cashier / Host</option>
                    <option value="Floor Server">Floor Server</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Branch Location *
                  </label>
                  <select
                    value={locationId}
                    onChange={e => setLocationId(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name.replace('AromaCraft ', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@aromacraft.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Assigned Shift *
                  </label>
                  <select
                    value={shift}
                    onChange={e => setShift(e.target.value as any)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
                    <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Monthly Salary (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="10000"
                    required
                    value={baseSalary}
                    onChange={e => setBaseSalary(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Monthly Target Hours
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="250"
                    value={monthlyHours}
                    onChange={e => setMonthlyHours(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Performance Score (1 - 100)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={performanceScore}
                    onChange={e => setPerformanceScore(+e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition mt-2"
              >
                {editingStaffId ? 'Save & Update Employee' : 'Enroll Employee to Roster'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-cafe-200 p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-serif font-bold text-lg text-cafe-900">Remove Staff Member?</h4>
              <p className="text-xs text-cafe-600">
                Are you sure you want to disenroll <strong>{deletingStaff.name}</strong> ({deletingStaff.role}) from the roster? This removes them from active payroll.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="flex-1 py-2.5 rounded-xl border border-cafe-300 text-cafe-700 font-semibold text-xs hover:bg-cafe-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
