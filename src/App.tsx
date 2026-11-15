import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CustomerHome } from './components/customer/CustomerHome';
import { OnlineMenu } from './components/customer/OnlineMenu';
import { QueueBookingSection } from './components/customer/QueueBookingSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { FeedbackModal } from './components/customer/FeedbackModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { Coffee, ShieldCheck, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentRole, setCurrentRole, activeLocation } = useApp();

  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // If role is an enterprise staff role, render the enterprise Admin Back-Office
  if (currentRole !== 'customer') {
    return (
      <div className="min-h-screen bg-cafe-100 font-sans selection:bg-amber-200 selection:text-cafe-900">
        <ToastContainer />
        <AdminLayout onReturnToCustomer={() => setCurrentRole('customer')} />
      </div>
    );
  }

  // Otherwise render the Customer Experience
  return (
    <div className="min-h-screen bg-cafe-50 font-sans flex flex-col selection:bg-amber-200 selection:text-cafe-900">
      <ToastContainer />

      {/* Global Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onNavigateSection={tab => setActiveCustomerTab(tab)}
      />

      {/* Navigation Sub-Tabs on Desktop */}
      <div className="hidden md:block bg-white/80 border-b border-cafe-200/60 sticky top-16 sm:top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-12">
          <div className="flex items-center gap-1">
            {[
              { key: 'home', label: 'Discover & Offers' },
              { key: 'menu', label: 'Artisan Menu (Dietary Filters)' },
              { key: 'queue', label: 'Virtual Queue' },
              { key: 'booking', label: 'Table Booking' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCustomerTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCustomerTab === tab.key
                    ? 'bg-cafe-900 text-white shadow-xs'
                    : 'text-cafe-600 hover:text-cafe-950 hover:bg-cafe-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentRole('admin_hq')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Staff Portal (Floor & Kitchen)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 w-full">
        {activeCustomerTab === 'home' && (
          <CustomerHome
            onNavigateTab={tab => setActiveCustomerTab(tab)}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        )}

        {activeCustomerTab === 'menu' && (
          <OnlineMenu onOpenCart={() => setIsCartOpen(true)} />
        )}

        {activeCustomerTab === 'queue' && (
          <QueueBookingSection initialTab="queue" />
        )}

        {activeCustomerTab === 'booking' && (
          <QueueBookingSection initialTab="booking" />
        )}
      </main>

      {/* Customer Modals */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeCustomerTab}
        setActiveTab={setActiveCustomerTab}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-cafe-950 text-white border-t border-cafe-900 mt-auto py-12 px-6 pb-24 md:pb-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-cafe-950 flex items-center justify-center font-bold">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-white">
                Aroma<span className="text-amber-400">Craft</span>
              </span>
            </div>
            <p className="text-cafe-400 leading-relaxed text-[11px]">
              Artisanal Roastery, Clean Gastronomy & Enterprise Cafe Intelligence. Serving single-origins and certified dietary pure dining.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-[11px] mb-3">
              Locations & Hubs
            </h4>
            <ul className="space-y-2 text-cafe-300">
              <li>Downtown Flagship Roastery (Metro Central)</li>
              <li>Uptown Artisan Bistro (Galleria Promenade)</li>
              <li>Westside Garden Terrace (Green Park)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-[11px] mb-3">
              Dietary Standards
            </h4>
            <ul className="space-y-2 text-cafe-300">
              <li>🕊️ Strict Jain Dedicated Cookware (Zero root veg)</li>
              <li>🌿 100% Certified Vegan (Plant milks & cashew creams)</li>
              <li>🥗 Pure Vegetarian Guarantee</li>
              <li>🌾 Gluten-Free Kitchen Protocols</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-[11px] mb-3">
              Enterprise Systems
            </h4>
            <div className="space-y-2 text-cafe-400 text-[11px]">
              <p>Table Management • Virtual Queue • POS & Billing</p>
              <p>Kitchen KDS • Wastage Tracking • Vendor POs</p>
              <p>HR Attendance & P&L Reports • No-Code CMS</p>
              <button
                onClick={() => setCurrentRole('admin_hq')}
                className="mt-2 text-amber-400 hover:underline font-bold block"
              >
                Access HQ Enterprise Dashboard →
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-cafe-500 text-[11px] gap-2">
          <span>© 2026 AromaCraft Artisanal Cafe Group. All rights reserved.</span>
          <span>Designed for modern mobile & multi-location hospitality operations.</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
