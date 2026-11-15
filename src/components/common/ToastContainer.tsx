import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-top-3 fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-white border-emerald-600/50 shadow-emerald-900/30'
              : toast.type === 'error'
              ? 'bg-red-950/90 text-white border-red-600/50 shadow-red-900/30'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 text-white border-amber-600/50 shadow-amber-900/30'
              : 'bg-cafe-950/90 text-white border-cafe-700/50 shadow-cafe-900/30'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold tracking-wide uppercase text-white/90">
              {toast.title}
            </h4>
            <p className="text-xs text-white/80 mt-0.5 leading-snug break-words">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/60 hover:text-white shrink-0 p-1 -mr-1 -mt-1 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
