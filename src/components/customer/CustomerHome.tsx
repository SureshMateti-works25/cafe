import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  UtensilsCrossed, 
  Users, 
  CalendarDays, 
  ShieldCheck, 
  Coffee, 
  Clock, 
  ChevronRight,
  Star,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

interface CustomerHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenFeedback: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigateTab, onOpenFeedback }) => {
  const { activeLocation, menuItems, cmsProjects, feedbacks, queue, addToCart } = useApp();

  const featuredItems = menuItems.filter(m => m.featured).slice(0, 4);
  const publishedProjects = cmsProjects.filter(p => p.status === 'published');
  const recentReviews = feedbacks.slice(0, 3);

  const waitingCount = queue.filter(q => q.locationId === activeLocation.id && q.status === 'waiting').length;

  return (
    <div className="space-y-10 sm:space-y-14 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-cafe-950 text-white shadow-2xl border border-cafe-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1800&q=80"
            alt="Artisanal Cafe Interior"
            className="w-full h-full object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cafe-950 via-cafe-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to {activeLocation.name}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Exceptional Coffee. <br />
            <span className="text-amber-400 italic">Conscious Gastronomy.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-cafe-200 leading-relaxed max-w-xl">
            Single-origin pour-overs, artisanal sourdoughs, and meticulously prepared gourmet meals with 
            <strong className="text-amber-300"> 100% certified Jain 🕊️, Vegan 🌿, and Vegetarian</strong> culinary purity.
          </p>

          {/* Quick Action Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigateTab('menu')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-cafe-950 font-semibold text-sm transition-all transform active:scale-98 shadow-lg shadow-amber-500/25"
            >
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Browse Menu
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('queue')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all transform active:scale-98 backdrop-blur-md"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Virtual Queue
              </span>
              <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-mono">
                {waitingCount} in line
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('booking')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all transform active:scale-98 backdrop-blur-md"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-400" /> Book a Table
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Branch Pulse strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-cafe-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open today until {activeLocation.operatingHours.split('-')[1]}</span>
            </div>
            <span>•</span>
            <div>{activeLocation.tablesCount} Tables Total</div>
            <span>•</span>
            <div className="text-amber-300 font-medium">Free High-Speed Wi-Fi & Workspaces</div>
          </div>
        </div>
      </section>

      {/* Dietary Commitment Callout */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Certified Dietary Purity Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-cafe-900">
              Dedicated Cookware & Allergen Protocols
            </h3>
            <p className="text-xs sm:text-sm text-cafe-700 leading-relaxed">
              We honor every lifestyle. Our kitchen operates isolated preparation stations for 
              <strong> 100% Jain orders</strong> (strictly zero onion, garlic, potatoes, carrots, or underground root vegetables) 
              and <strong>certified Vegan dishes</strong> (strictly dairy-free Swedish oat & almond milks, cashew cheeses).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 100% Pure Veg Available
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-amber-900 border border-amber-300 shadow-xs">
              🕊️ Strict Jain Stations
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-teal-800 border border-teal-200 shadow-xs">
              🌿 Vegan Plant-Based
            </span>
          </div>
        </div>
      </section>

      {/* Dynamic CMS Projects & Promotions Carousel */}
      {publishedProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Happenings & Seasonal Offers
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900">
                News, Workshops & Special Menus
              </h2>
            </div>
            <span className="text-xs text-cafe-500 hidden sm:block">
              Curated by our Cafe Operations Team
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedProjects.map(proj => (
              <div 
                key={proj.id}
                className="bg-white rounded-2xl overflow-hidden border border-cafe-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-cafe-100">
                  <img
                    src={proj.bannerImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-cafe-950/80 text-amber-300 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {proj.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-cafe-900 group-hover:text-amber-800 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="mt-2 text-xs text-cafe-600 line-clamp-3 leading-relaxed">
                      {proj.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-cafe-100 flex items-center justify-between text-xs text-cafe-500">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {proj.startDate}
                    </span>
                    <button
                      onClick={() => onNavigateTab('booking')}
                      className="text-amber-700 font-semibold hover:text-amber-900 inline-flex items-center gap-1 text-xs"
                    >
                      Book Event <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Menu Items Showcase */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Chef & Barista Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900">
              Signature Creations
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('menu')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            Full Menu <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-cafe-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden bg-cafe-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                  {item.isJainFriendly && (
                    <span className="bg-amber-500/90 text-cafe-950 font-bold px-1.5 py-0.5 rounded text-[10px] shadow">
                      🕊️ Jain
                    </span>
                  )}
                  {item.isVegan && (
                    <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] shadow">
                      🌿 Vegan
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-sm text-cafe-900 group-hover:text-amber-800 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-cafe-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cafe-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-cafe-950">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1.5 rounded-xl bg-cafe-900 hover:bg-amber-600 text-white text-xs font-medium transition-colors active:scale-95 shadow-sm"
                  >
                    + Add to Tray
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Feedback Highlights */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cafe-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Community Love & Transparency
            </span>
            <h2 className="text-2xl font-serif font-bold text-cafe-900">
              Dietary Care & Experience Reviews
            </h2>
          </div>
          <button
            onClick={onOpenFeedback}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs hover:bg-amber-100 transition"
          >
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReviews.map(rev => (
            <div key={rev.id} className="bg-cafe-50/70 rounded-2xl p-5 border border-cafe-200/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-cafe-300'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white border border-cafe-200 font-semibold text-cafe-700">
                    {rev.dietaryPreference === 'jain' ? '🕊️ Jain Order' : rev.dietaryPreference === 'vegan' ? '🌿 Vegan Order' : 'Pure Veg'}
                  </span>
                </div>

                <p className="mt-3 text-xs text-cafe-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-cafe-200/50 flex items-center justify-between text-xs text-cafe-500">
                <span className="font-semibold text-cafe-800">{rev.customerName}</span>
                <span className="text-[10px] flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Verified Guest
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
