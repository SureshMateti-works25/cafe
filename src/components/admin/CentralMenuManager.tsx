import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, DietaryType } from '../../types';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  X, 
  Check, 
  Building2, 
  Clock, 
  Flame, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  MapPin, 
  Star,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

export const CentralMenuManager: React.FC = () => {
  const { 
    menuItems, 
    locations, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleItemLocationAvailability 
  } = useApp();

  // Filters
  const [selectedLocationScope, setSelectedLocationScope] = useState<string>('all'); // 'all' or locationId
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Espresso & Brews');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formPrice, setFormPrice] = useState<number>(250);
  const [formDescription, setFormDescription] = useState('');
  const [formCalories, setFormCalories] = useState<number>(150);
  const [formPrepTime, setFormPrepTime] = useState<number>(5);
  const [formImage, setFormImage] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  
  // Dietary Flags
  const [formIsJain, setFormIsJain] = useState(false);
  const [formIsVegan, setFormIsVegan] = useState(false);
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsGlutenFree, setFormIsGlutenFree] = useState(false);

  // Per-Location Availability Checkboxes
  const [formLocationIds, setFormLocationIds] = useState<string[]>([]);

  const standardCategories = [
    'Espresso & Brews',
    'Artisan Teas',
    'Bakery & Pastry',
    'Gourmet Mains',
    'Healthy Bowls',
    'Desserts',
    'Other / Custom'
  ];

  const imagePresets = [
    { label: 'Coffee Pour-over', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Velvet Flat White', url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80' },
    { label: 'Rose Latte', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sourdough Tartine', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
    { label: 'Jain Panini', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80' },
    { label: 'Jain Penne Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Quinoa Bowl', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
    { label: 'Matcha Coconut', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Croissant Pastry', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Chocolate Tart', url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80' },
  ];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory('Espresso & Brews');
    setFormCustomCategory('');
    setFormPrice(240);
    setFormDescription('');
    setFormCalories(120);
    setFormPrepTime(5);
    setFormImage(imagePresets[0].url);
    setFormIngredients('Specialty Beans, Filtered Water');
    setFormIsAvailable(true);
    setFormFeatured(false);
    setFormIsJain(true);
    setFormIsVegan(true);
    setFormIsVeg(true);
    setFormIsGlutenFree(false);
    // If a specific location is filtered, pre-select that location, otherwise select all
    if (selectedLocationScope !== 'all') {
      setFormLocationIds([selectedLocationScope]);
    } else {
      setFormLocationIds(locations.map(l => l.id));
    }
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    if (standardCategories.includes(item.category)) {
      setFormCategory(item.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('Other / Custom');
      setFormCustomCategory(item.category);
    }
    setFormPrice(item.price);
    setFormDescription(item.description);
    setFormCalories(item.calories);
    setFormPrepTime(item.prepTimeMins);
    setFormImage(item.image);
    setFormIngredients(item.ingredients.join(', '));
    setFormIsAvailable(item.isAvailable);
    setFormFeatured(!!item.featured);
    setFormIsJain(item.isJainFriendly);
    setFormIsVegan(item.isVegan);
    setFormIsVeg(item.dietary.includes('veg'));
    setFormIsGlutenFree(item.isGlutenFree);
    setFormLocationIds(item.availableLocationIds || locations.map(l => l.id));
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = formCategory === 'Other / Custom' ? (formCustomCategory.trim() || 'Specialty') : formCategory;
    const dietaryList: DietaryType[] = [];
    if (formIsVeg) dietaryList.push('veg');
    if (formIsVegan) dietaryList.push('vegan');
    if (formIsJain) dietaryList.push('jain');
    if (formIsGlutenFree) dietaryList.push('gluten-free');

    const ingredientsList = formIngredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    addMenuItem({
      name: formName.trim(),
      category: finalCategory,
      description: formDescription.trim(),
      price: Number(formPrice),
      dietary: dietaryList,
      isJainFriendly: formIsJain,
      isVegan: formIsVegan,
      isGlutenFree: formIsGlutenFree,
      calories: Number(formCalories),
      prepTimeMins: Number(formPrepTime),
      image: formImage.trim() || imagePresets[0].url,
      isAvailable: formIsAvailable,
      availableLocationIds: formLocationIds.length > 0 ? formLocationIds : locations.map(l => l.id),
      ingredients: ingredientsList,
      featured: formFeatured,
    });

    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const finalCategory = formCategory === 'Other / Custom' ? (formCustomCategory.trim() || 'Specialty') : formCategory;
    const dietaryList: DietaryType[] = [];
    if (formIsVeg) dietaryList.push('veg');
    if (formIsVegan) dietaryList.push('vegan');
    if (formIsJain) dietaryList.push('jain');
    if (formIsGlutenFree) dietaryList.push('gluten-free');

    const ingredientsList = formIngredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    updateMenuItem(editingItem.id, {
      name: formName.trim(),
      category: finalCategory,
      description: formDescription.trim(),
      price: Number(formPrice),
      dietary: dietaryList,
      isJainFriendly: formIsJain,
      isVegan: formIsVegan,
      isGlutenFree: formIsGlutenFree,
      calories: Number(formCalories),
      prepTimeMins: Number(formPrepTime),
      image: formImage.trim() || editingItem.image,
      isAvailable: formIsAvailable,
      availableLocationIds: formLocationIds,
      ingredients: ingredientsList,
      featured: formFeatured,
    });

    setEditingItem(null);
  };

  // Filter Items
  const filteredMenuItems = menuItems.filter(item => {
    // Location filter
    if (selectedLocationScope !== 'all') {
      const isAvailableAtLoc = item.availableLocationIds?.includes(selectedLocationScope);
      if (!isAvailableAtLoc) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Dietary filter
    if (selectedDietary === 'jain' && !item.isJainFriendly) return false;
    if (selectedDietary === 'vegan' && !item.isVegan) return false;
    if (selectedDietary === 'veg' && !item.dietary.includes('veg')) return false;
    if (selectedDietary === 'gluten-free' && !item.isGlutenFree) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIngr = item.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIngr) return false;
    }

    return true;
  });

  // Calculate statistics
  const currentScopeItems = selectedLocationScope === 'all' 
    ? menuItems 
    : menuItems.filter(m => m.availableLocationIds?.includes(selectedLocationScope));

  const totalDishes = currentScopeItems.length;
  const jainFriendlyCount = currentScopeItems.filter(m => m.isJainFriendly).length;
  const veganCount = currentScopeItems.filter(m => m.isVegan).length;
  const pureVegCount = currentScopeItems.filter(m => m.dietary.includes('veg')).length;
  const avgPrice = totalDishes > 0 ? Math.round(currentScopeItems.reduce((acc, i) => acc + i.price, 0) / totalDishes) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="bg-cafe-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cafe-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>CENTRAL MENU & RECIPE MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Menu Catalog & Multi-Branch Availability
          </h1>
          <p className="text-xs sm:text-sm text-cafe-300 mt-1">
            Centrally curate dishes, set Indian Rupee (₹) prices, manage strict Jain 🕊️ & Vegan 🌿 certifications, and toggle offerings per branch.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-cafe-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Menu Item</span>
        </button>
      </div>

      {/* Location Filter & HQ Telemetry Pills */}
      <div className="bg-white p-5 rounded-3xl border border-cafe-200 shadow-xs space-y-4">
        {/* Branch Scope Selector */}
        <div>
          <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Manage Menu Scope (Branch Filter):</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedLocationScope('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                selectedLocationScope === 'all'
                  ? 'bg-cafe-900 text-white border-cafe-950 shadow-xs'
                  : 'bg-cafe-50 text-cafe-700 border-cafe-200 hover:bg-cafe-100'
              }`}
            >
              <span>🌐 All Locations (Central HQ Catalog)</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">
                {menuItems.length}
              </span>
            </button>

            {locations.map(loc => {
              const count = menuItems.filter(m => m.availableLocationIds?.includes(loc.id)).length;
              const isSelected = selectedLocationScope === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocationScope(loc.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-cafe-50 text-cafe-700 border-cafe-200 hover:bg-cafe-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{loc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-cafe-200 text-cafe-800'
                  }`}>
                    {count} dishes
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Scope KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-cafe-100">
          <div className="p-3 bg-cafe-50 rounded-2xl border border-cafe-100">
            <span className="text-[10px] font-bold text-cafe-500 uppercase block">Active Dishes</span>
            <span className="font-serif font-bold text-lg text-cafe-900">{totalDishes} items</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Strict Jain 🕊️</span>
            <span className="font-serif font-bold text-lg text-amber-950">{jainFriendlyCount} recipes</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
            <span className="text-[10px] font-bold text-teal-800 uppercase block">100% Vegan 🌿</span>
            <span className="font-serif font-bold text-lg text-teal-950">{veganCount} recipes</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pure Veg 🥗</span>
            <span className="font-serif font-bold text-lg text-emerald-950">{pureVegCount} recipes</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-bold text-purple-800 uppercase block">Average Price</span>
            <span className="font-serif font-bold text-lg text-purple-950">₹{avgPrice}</span>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="pt-2 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or dish titles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold text-cafe-900 placeholder:text-cafe-400 focus:outline-hidden focus:border-amber-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            {['All', 'Espresso & Brews', 'Artisan Teas', 'Bakery & Pastry', 'Gourmet Mains', 'Healthy Bowls', 'Desserts'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-cafe-900 text-white border-cafe-950'
                    : 'bg-cafe-50 text-cafe-700 border-cafe-200 hover:bg-cafe-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2 text-xs pt-2 border-t border-cafe-100 overflow-x-auto">
          <span className="text-cafe-500 font-semibold uppercase text-[10px] shrink-0">Dietary Certified:</span>
          {[
            { key: 'all', label: 'All Diets' },
            { key: 'jain', label: '🕊️ Strict Jain Friendly' },
            { key: 'vegan', label: '🌿 100% Vegan' },
            { key: 'veg', label: '🥗 Pure Vegetarian' },
            { key: 'gluten-free', label: '🌾 Gluten-Free' }
          ].map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDietary(d.key)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedDietary === d.key
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                  : 'text-cafe-600 hover:bg-cafe-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMenuItems.map(item => {
          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border-2 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                !item.isAvailable ? 'opacity-60 border-cafe-300' : 'border-cafe-200'
              }`}
            >
              <div>
                {/* Image & Price Header */}
                <div className="relative h-44 overflow-hidden bg-cafe-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-amber-500 text-cafe-950 text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Price & Stock State */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-serif font-bold text-xl drop-shadow-md">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                        item.isAvailable 
                          ? 'bg-emerald-600/90 text-white' 
                          : 'bg-rose-700/90 text-white'
                      }`}
                      title="Click to toggle in-stock / out-of-stock globally"
                    >
                      {item.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-cafe-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-cafe-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Dietary Certifications */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.isJainFriendly && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        🕊️ Strict Jain
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
                        🌿 100% Vegan
                      </span>
                    )}
                    {item.dietary.includes('veg') && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        🥗 Pure Veg
                      </span>
                    )}
                    {item.isGlutenFree && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        Gluten-Free
                      </span>
                    )}
                  </div>

                  {/* Recipe Specs */}
                  <div className="flex items-center justify-between text-[11px] text-cafe-500 pt-1 border-t border-cafe-100">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" /> {item.calories} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cafe-500" /> {item.prepTimeMins} mins prep
                    </span>
                  </div>

                  {/* Ingredients */}
                  {item.ingredients.length > 0 && (
                    <div className="text-[11px] text-cafe-500">
                      <span className="font-semibold text-cafe-700">Ingredients:</span> {item.ingredients.join(', ')}
                    </div>
                  )}

                  {/* PER-LOCATION AVAILABILITY MATRIX */}
                  <div className="pt-2 border-t border-cafe-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cafe-700 uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-700" />
                        Branch Offerings:
                      </span>
                      <span className="text-[10px] text-cafe-400">Tap to toggle</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {locations.map(loc => {
                        const isOfferedHere = item.availableLocationIds?.includes(loc.id);
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => toggleItemLocationAvailability(item.id, loc.id)}
                            className={`p-1.5 rounded-xl text-[10px] font-semibold border transition text-center truncate ${
                              isOfferedHere
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-cafe-100/60 border-cafe-200 text-cafe-400 line-through'
                            }`}
                            title={`Click to ${isOfferedHere ? 'remove from' : 'enable at'} ${loc.name}`}
                          >
                            {isOfferedHere ? '✓ ' : '✕ '} {loc.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-cafe-50/70 border-t border-cafe-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-cafe-100 text-cafe-800 font-bold text-xs border border-cafe-300 transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Edit Recipe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(item)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 transition border border-rose-200"
                  title="Delete item from catalog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredMenuItems.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-cafe-200 p-8">
            <UtensilsCrossed className="w-10 h-10 text-cafe-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-cafe-900">No dishes match current criteria</h3>
            <p className="text-xs text-cafe-500 mt-1 max-w-sm mx-auto">
              Try resetting your category or search filters, or add a new recipe directly into this location.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => { setSelectedLocationScope('all'); setSelectedCategory('All'); setSelectedDietary('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-cafe-100 text-cafe-700 rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                + Add New Dish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD MENU ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cafe-900">Add New Recipe to Catalog</h3>
                  <p className="text-xs text-cafe-500">Central multi-location dish formulation</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 text-xs">
              {/* Dish Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saffron Cardamom Pistachio Croissant"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Menu Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900 focus:outline-hidden"
                  >
                    {standardCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formCategory === 'Other / Custom' && (
                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Custom Category Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cold Pressed Elixirs"
                    value={formCustomCategory}
                    onChange={e => setFormCustomCategory(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>
              )}

              {/* Price, Calories, Prep Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-bold text-cafe-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formCalories}
                    onChange={e => setFormCalories(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formPrepTime}
                    onChange={e => setFormPrepTime(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Menu Description & Tasting Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Artisanal description displayed to guests on mobile menu..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs text-cafe-900 focus:outline-hidden"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Ingredients (Comma-separated for allergen & dietary screening)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough, Hass Avocado, Lemon Zest, Maldon Salt"
                  value={formIngredients}
                  onChange={e => setFormIngredients(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs text-cafe-900"
                />
              </div>

              {/* Image URL & Quick Presets */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Dish Photography Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs font-mono text-cafe-900"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-cafe-500 font-semibold">Quick Presets:</span>
                  {imagePresets.slice(0, 5).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(p.url)}
                      className="px-2 py-0.5 rounded-lg bg-cafe-100 hover:bg-cafe-200 text-cafe-700 text-[10px] border border-cafe-200 font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIETARY CERTIFICATIONS */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold uppercase tracking-wider text-amber-950 text-[11px] block">
                  Dietary Protocol Certifications
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsJain}
                      onChange={e => setFormIsJain(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span className="font-bold text-amber-950">🕊️ Strict Jain</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-teal-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVegan}
                      onChange={e => setFormIsVegan(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-bold text-teal-950">🌿 100% Vegan</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVeg}
                      onChange={e => setFormIsVeg(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-bold text-emerald-950">🥗 Pure Veg</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-purple-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsGlutenFree}
                      onChange={e => setFormIsGlutenFree(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span className="font-bold text-purple-950">Gluten-Free</span>
                  </label>
                </div>
              </div>

              {/* BRANCH SELECTION CHECKBOXES */}
              <div className="p-4 bg-cafe-50 rounded-2xl border border-cafe-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-cafe-900 text-[11px] block">
                    Available Branches (Offer this dish at:)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormLocationIds(locations.map(l => l.id))}
                      className="text-amber-800 hover:underline text-[10px] font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-cafe-300">•</span>
                    <button
                      type="button"
                      onClick={() => setFormLocationIds([])}
                      className="text-cafe-500 hover:underline text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {locations.map(loc => {
                    const checked = formLocationIds.includes(loc.id);
                    return (
                      <label
                        key={loc.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                          checked
                            ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-bold'
                            : 'bg-white border-cafe-200 text-cafe-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormLocationIds(prev => [...prev, loc.id]);
                            } else {
                              setFormLocationIds(prev => prev.filter(id => id !== loc.id));
                            }
                          }}
                          className="rounded text-amber-600"
                        />
                        <div className="truncate">
                          <span className="block truncate">{loc.name}</span>
                          <span className="text-[10px] font-normal text-cafe-400 block">{loc.city}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Additional Switches: Featured & Global Available */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={e => setFormFeatured(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span className="font-bold text-cafe-800">Featured Showcase on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={e => setFormIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-emerald-800">Global In-Stock Ready</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-cafe-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cafe-200 text-cafe-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MENU ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cafe-900 text-white flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cafe-900">Edit Recipe: {editingItem.name}</h3>
                  <p className="text-xs text-cafe-500">Update pricing, ingredients, or branch availability</p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-cafe-400 hover:text-cafe-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Menu Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  >
                    {standardCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Calories, Prep Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-bold text-cafe-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formCalories}
                    onChange={e => setFormCalories(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 block mb-1">
                    Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formPrepTime}
                    onChange={e => setFormPrepTime(Number(e.target.value))}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 font-semibold text-cafe-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Menu Description & Tasting Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs text-cafe-900"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Ingredients (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={e => setFormIngredients(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs text-cafe-900"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="font-bold text-cafe-800 block mb-1">
                  Dish Photography Image URL
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-300 text-xs font-mono text-cafe-900"
                />
              </div>

              {/* Dietary Certifications */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold uppercase tracking-wider text-amber-950 text-[11px] block">
                  Dietary Protocol Certifications
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsJain}
                      onChange={e => setFormIsJain(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span className="font-bold text-amber-950">🕊️ Strict Jain</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-teal-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVegan}
                      onChange={e => setFormIsVegan(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-bold text-teal-950">🌿 100% Vegan</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVeg}
                      onChange={e => setFormIsVeg(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-bold text-emerald-950">🥗 Pure Veg</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-purple-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsGlutenFree}
                      onChange={e => setFormIsGlutenFree(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span className="font-bold text-purple-950">Gluten-Free</span>
                  </label>
                </div>
              </div>

              {/* BRANCH SELECTION CHECKBOXES */}
              <div className="p-4 bg-cafe-50 rounded-2xl border border-cafe-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-cafe-900 text-[11px] block">
                    Available Branches (Offer this dish at:)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormLocationIds(locations.map(l => l.id))}
                      className="text-amber-800 hover:underline text-[10px] font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-cafe-300">•</span>
                    <button
                      type="button"
                      onClick={() => setFormLocationIds([])}
                      className="text-cafe-500 hover:underline text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {locations.map(loc => {
                    const checked = formLocationIds.includes(loc.id);
                    return (
                      <label
                        key={loc.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                          checked
                            ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-bold'
                            : 'bg-white border-cafe-200 text-cafe-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormLocationIds(prev => [...prev, loc.id]);
                            } else {
                              setFormLocationIds(prev => prev.filter(id => id !== loc.id));
                            }
                          }}
                          className="rounded text-amber-600"
                        />
                        <div className="truncate">
                          <span className="block truncate">{loc.name}</span>
                          <span className="text-[10px] font-normal text-cafe-400 block">{loc.city}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Additional Switches */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={e => setFormFeatured(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span className="font-bold text-cafe-800">Featured Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={e => setFormIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-emerald-800">Global In-Stock Ready</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-cafe-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-cafe-200 text-cafe-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cafe-900 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Recipe Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-base">Delete Recipe?</h3>
              </div>
              <button onClick={() => setDeletingItem(null)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-cafe-700">
                Are you sure you want to delete <strong className="text-cafe-900">"{deletingItem.name}"</strong>?
              </p>

              {selectedLocationScope !== 'all' ? (
                <div className="space-y-3">
                  <p className="text-cafe-600">
                    You currently have <strong>{locations.find(l => l.id === selectedLocationScope)?.name}</strong> selected.
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleItemLocationAvailability(deletingItem.id, selectedLocationScope);
                        setDeletingItem(null);
                      }}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl"
                    >
                      Remove from this Branch only
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteMenuItem(deletingItem.id);
                        setDeletingItem(null);
                      }}
                      className="w-full py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl"
                    >
                      Delete Permanently from Central Catalog
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingItem(null)}
                    className="px-4 py-2 border border-cafe-200 text-cafe-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteMenuItem(deletingItem.id);
                      setDeletingItem(null);
                    }}
                    className="px-5 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs"
                  >
                    Confirm Permanent Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
