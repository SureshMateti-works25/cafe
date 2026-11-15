import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Download, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const HRFinanceReports: React.FC = () => {
  const { staff, toggleClockIn, locations, wastageLogs, orders, activeLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'finance' | 'hr'>('finance');

  const totalGrossSales = locations.reduce((sum, l) => sum + l.todayRevenue, 0);
  const totalWastageLoss = wastageLogs.reduce((sum, w) => sum + w.costImpact, 0);
  const totalMonthlyPayroll = staff.reduce((sum, s) => sum + s.baseSalary, 0);
  const clockedInCount = staff.filter(s => s.isClockedIn).length;

  // Estimated COGS (30% of sales) and Labor (25% of sales)
  const estCOGS = totalGrossSales * 0.30;
  const estGrossProfit = totalGrossSales - estCOGS - totalWastageLoss;

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Gross Sales,${totalGrossSales}\n`
      + `Estimated COGS,${estCOGS.toFixed(2)}\n`
      + `Total Wastage Loss,${totalWastageLoss.toFixed(2)}\n`
      + `Gross Operating Profit,${estGrossProfit.toFixed(2)}\n`
      + `Total Monthly Payroll,${totalMonthlyPayroll}\n`
      + `Total Staff Count,${staff.length}\n`
      + `Active Staff Clocked In,${clockedInCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AromaCraft_Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Executive P&L summaries, food cost ratios, shift attendance and payroll telemetry
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-cafe-900 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-cafe-200/70 p-1.5 rounded-2xl border border-cafe-300/60 max-w-sm shadow-inner">
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'finance' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Financial Intelligence
        </button>

        <button
          onClick={() => setActiveTab('hr')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hr' ? 'bg-white text-cafe-900 shadow-sm' : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          Staff & Payroll ({staff.length})
        </button>
      </div>

      {/* TAB 1: FINANCIAL INTELLIGENCE */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Chain Gross Revenue</span>
              <span className="font-serif font-bold text-2xl text-cafe-950 mt-1 block">
                ${totalGrossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">+14.2% Growth</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Food Cost (COGS)</span>
              <span className="font-serif font-bold text-2xl text-cafe-950 mt-1 block">
                ${estCOGS.toFixed(2)}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">~30.0% of revenue</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Kitchen Wastage Drain</span>
              <span className="font-serif font-bold text-2xl text-red-600 font-mono mt-1 block">
                -${totalWastageLoss.toFixed(2)}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">0.2% of sales (healthy)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Estimated Operating Margin</span>
              <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
                ${estGrossProfit.toFixed(2)}
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
                        <span className="font-bold text-cafe-950">${loc.todayRevenue.toLocaleString()}</span>
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

      {/* TAB 2: HR STAFF & PAYROLL */}
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
                ${totalMonthlyPayroll.toLocaleString()}
              </span>
              <span className="text-[11px] text-cafe-500 block mt-1">Across all branches</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-cafe-200 shadow-xs">
              <span className="text-xs text-cafe-500 font-semibold block">Avg Staff Performance Score</span>
              <span className="font-serif font-bold text-2xl text-amber-600 mt-1 block">
                94.8 / 100
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Excellent service index</span>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-3xl border border-cafe-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cafe-50 border-b border-cafe-200 text-cafe-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Assigned Shift</th>
                    <th className="p-4">Clock-in Status</th>
                    <th className="p-4">Monthly Hours</th>
                    <th className="p-4">Base Salary</th>
                    <th className="p-4 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-100">
                  {staff.map(member => (
                    <tr key={member.id} className="hover:bg-cafe-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-cafe-900 text-sm">{member.name}</div>
                        <div className="text-[10px] text-cafe-500">{member.phone}</div>
                      </td>
                      <td className="p-4 font-semibold text-cafe-800">
                        {member.role}
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
                        ${member.baseSalary.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleClockIn(member.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            member.isClockedIn
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {member.isClockedIn ? 'Clock Out' : 'Clock In'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
