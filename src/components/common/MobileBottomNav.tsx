import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, UtensilsCrossed, Users, CalendarDays, ShoppingBag, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, onOpenCart }) => {
  const { currentRole, setCurrentRole, cart, queue, activeLocationId } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const myQueueCount = queue.filter(q => q.locationId === activeLocationId && (q.status === 'waiting' || q.status === 'called')).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-cafe-200/90 py-1.5 px-2 md:hidden shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => {
            if (currentRole !== 'customer') setCurrentRole('customer');
            setActiveTab('home');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRole === 'customer' && activeTab === 'home'
              ? 'text-amber-700 font-semibold'
              : 'text-cafe-500 hover:text-cafe-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => {
            if (currentRole !== 'customer') setCurrentRole('customer');
            setActiveTab('menu');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRole === 'customer' && activeTab === 'menu'
              ? 'text-amber-700 font-semibold'
              : 'text-cafe-500 hover:text-cafe-900'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>

        <button
          onClick={() => {
            if (currentRole !== 'customer') setCurrentRole('customer');
            setActiveTab('queue');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRole === 'customer' && activeTab === 'queue'
              ? 'text-amber-700 font-semibold'
              : 'text-cafe-500 hover:text-cafe-900'
          }`}
        >
          <Users className="w-5 h-5" />
          {myQueueCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <span className="text-[10px] mt-0.5">Queue</span>
        </button>

        <button
          onClick={() => {
            if (currentRole !== 'customer') setCurrentRole('customer');
            setActiveTab('booking');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRole === 'customer' && activeTab === 'booking'
              ? 'text-amber-700 font-semibold'
              : 'text-cafe-500 hover:text-cafe-900'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Book</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-cafe-600 hover:text-cafe-900 transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Tray</span>
        </button>

        <button
          onClick={() => {
            if (currentRole === 'customer') {
              setCurrentRole('admin_hq');
            } else {
              setCurrentRole('customer');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentRole !== 'customer'
              ? 'text-amber-600 font-bold bg-amber-50'
              : 'text-cafe-400 hover:text-cafe-700'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">
            {currentRole !== 'customer' ? 'Staff Active' : 'Staff'}
          </span>
        </button>
      </div>
    </nav>
  );
};
