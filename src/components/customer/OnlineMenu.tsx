import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, DietaryType, OrderItem } from '../../types';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Flame, 
  Info, 
  Check, 
  Plus, 
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface OnlineMenuProps {
  onOpenCart: () => void;
}

export const OnlineMenu: React.FC<OnlineMenuProps> = ({ onOpenCart }) => {
  const { menuItems, addToCart, dietaryFilter, setDietaryFilter, cart } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Customization state
  const [selectedMilk, setSelectedMilk] = useState<NonNullable<OrderItem['customization']>['milk']>('Regular Whole');
  const [selectedSweetness, setSelectedSweetness] = useState<NonNullable<OrderItem['customization']>['sweetness']>('Standard (50%)');
  const [isJainPrepRequested, setIsJainPrepRequested] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>('');

  const categories = ['All', 'Espresso & Brews', 'Artisan Teas', 'Bakery & Pastry', 'Gourmet Mains', 'Healthy Bowls', 'Desserts'];

  // Filter logic
  const filteredItems = menuItems.filter(item => {
    // Category check
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIngr = item.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIngr) return false;
    }

    // Dietary filter
    if (dietaryFilter === 'jain') {
      return item.isJainFriendly;
    }
    if (dietaryFilter === 'vegan') {
      return item.isVegan;
    }
    if (dietaryFilter === 'veg') {
      return item.dietary.includes('veg');
    }
    if (dietaryFilter === 'gluten-free') {
      return item.isGlutenFree;
    }

    return true;
  });

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsJainPrepRequested(item.isJainFriendly);
    setSelectedMilk(item.isVegan ? 'Oat Milk' : 'Regular Whole');
    setSelectedSweetness('Standard (50%)');
    setCustomNotes('');
  };

  const handleAddCustomizedToCart = () => {
    if (!customizingItem) return;
    addToCart(customizingItem, {
      milk: selectedMilk,
      sweetness: selectedSweetness,
      jainPrep: isJainPrepRequested,
      notes: customNotes.trim() ? customNotes : undefined
    });
    setCustomizingItem(null);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8 pb-24">
      {/* Menu Header & Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900">
              Artisan Menu & Gastronomy
            </h1>
            <p className="text-xs sm:text-sm text-cafe-600 mt-1">
              Handcrafted in-house with certified dietary verification.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coffee, bowls, panini..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-cafe-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dietary Preferences Pill Filter (Special Highlights) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cafe-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Dietary Preference Filter
            </span>
            {dietaryFilter !== 'all' && (
              <button
                onClick={() => setDietaryFilter('all')}
                className="text-xs text-amber-700 hover:underline font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                dietaryFilter === 'all'
                  ? 'bg-cafe-900 text-white shadow-sm'
                  : 'bg-cafe-100 hover:bg-cafe-200 text-cafe-700 border border-cafe-200'
              }`}
            >
              All Items ({menuItems.length})
            </button>

            <button
              onClick={() => setDietaryFilter('veg')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Pure Vegetarian
            </button>

            <button
              onClick={() => setDietaryFilter('jain')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                dietaryFilter === 'jain'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
              }`}
            >
              🕊️ Jain Friendly (Zero Root Veg / No Garlic / No Onion)
            </button>

            <button
              onClick={() => setDietaryFilter('vegan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                dietaryFilter === 'vegan'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
              }`}
            >
              🌿 100% Vegan (Plant-Based)
            </button>

            <button
              onClick={() => setDietaryFilter('gluten-free')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                dietaryFilter === 'gluten-free'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              🌾 Gluten-Free
            </button>
          </div>

          {/* Active Jain Notice Callout */}
          {dietaryFilter === 'jain' && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Jain Kitchen Protocol:</strong> Prepared using dedicated sanitized pans, 
                without onions, garlic, potatoes, carrots, or root vegetables. Sauces made fresh with San Marzano tomatoes and spices.
              </div>
            </div>
          )}
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-cafe-100 pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-cafe-950 font-bold shadow-xs'
                  : 'text-cafe-600 hover:bg-cafe-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cafe-200">
          <AlertCircle className="w-10 h-10 text-cafe-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-cafe-800">No items match your criteria</h3>
          <p className="text-xs text-cafe-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset dietary filters to explore our full artisan collection.
          </p>
          <button
            onClick={() => {
              setDietaryFilter('all');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-medium"
          >
            Show All Menu Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-cafe-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-cafe-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-cafe-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-lg backdrop-blur-md">
                    {item.category}
                  </div>

                  {/* Dietary Badges on image */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    {item.isJainFriendly && (
                      <span className="bg-amber-500 text-cafe-950 font-bold px-2 py-0.5 rounded-md text-[10px] shadow-sm">
                        🕊️ Jain Available
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px] shadow-sm">
                        🌿 100% Vegan
                      </span>
                    )}
                    {item.isGlutenFree && (
                      <span className="bg-orange-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px] shadow-sm">
                        🌾 Gluten-Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-cafe-900 leading-snug group-hover:text-amber-800 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-cafe-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Meta stats */}
                  <div className="mt-4 flex items-center gap-3 text-[11px] text-cafe-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cafe-400" /> {item.prepTimeMins} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> {item.calories} kcal
                    </span>
                  </div>

                  {/* Ingredients list pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-cafe-100 text-cafe-700 px-2 py-0.5 rounded-md">
                        {ing}
                      </span>
                    ))}
                    {item.ingredients.length > 3 && (
                      <span className="text-[10px] text-cafe-400 self-center">
                        +{item.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 border-t border-cafe-100/60 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cafe-500 uppercase font-semibold">Price</span>
                  <div className="font-serif font-bold text-lg sm:text-xl text-cafe-950">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCustomize(item)}
                    className="px-3 py-2 rounded-xl border border-cafe-300 hover:bg-cafe-100 text-cafe-800 text-xs font-semibold transition"
                  >
                    Customize
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-2 rounded-xl bg-cafe-900 hover:bg-amber-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-36 bg-cafe-950 overflow-hidden">
              <img
                src={customizingItem.image}
                alt={customizingItem.name}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-950 via-cafe-950/60 to-transparent" />
              <button
                onClick={() => setCustomizingItem(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full bg-black/30 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">Customize Order</span>
                <h3 className="font-serif font-bold text-lg text-white leading-tight">
                  {customizingItem.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Jain Preparation Checkbox */}
              {customizingItem.isJainFriendly && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isJainPrepRequested}
                      onChange={e => setIsJainPrepRequested(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs text-amber-950 block">
                        🕊️ Strict Jain Preparation Guarantee
                      </span>
                      <span className="text-[11px] text-amber-800 block">
                        Directs kitchen to use dedicated sanitized cookware, zero onion, garlic, potatoes, carrots, or root vegetables.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* Milk Option (if beverage) */}
              {(customizingItem.category === 'Espresso & Brews' || customizingItem.category === 'Artisan Teas') && (
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                    Choice of Milk / Plant Milk
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Regular Whole', 'Oat Milk', 'Almond Milk', 'Soy Milk'] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMilk(m)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition ${
                          selectedMilk === m
                            ? 'bg-amber-100 border-amber-600 text-amber-900 ring-1 ring-amber-500'
                            : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sweetness Option */}
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                  Sweetness Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['None (0%)', 'Mild (25%)', 'Standard (50%)', 'Sweet (100%)'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSweetness(s)}
                      className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
                        selectedSweetness === s
                          ? 'bg-cafe-900 border-cafe-950 text-white'
                          : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                      }`}
                    >
                      {s.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Kitchen Notes / Allergen Alerts
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra hot, no ice, nut allergy alert..."
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cafe-50 border-t border-cafe-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-cafe-500 uppercase">Item Price</span>
                <div className="font-serif font-bold text-lg text-cafe-950">
                  ₹{customizingItem.price.toLocaleString()}
                </div>
              </div>
              <button
                onClick={handleAddCustomizedToCart}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-md active:scale-95"
              >
                Add Customized to Tray
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tray Bar for Mobile */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-30 md:hidden animate-in slide-in-from-bottom-4">
          <button
            onClick={onOpenCart}
            className="w-full bg-cafe-950 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-cafe-800 active:scale-98 transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-cafe-950 text-xs font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
              <span className="font-semibold text-xs text-white">View Current Tray</span>
            </div>
            <span className="text-amber-400 font-bold text-sm">Proceed to Checkout →</span>
          </button>
        </div>
      )}
    </div>
  );
};
