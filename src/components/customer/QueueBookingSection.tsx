import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  CalendarDays, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  X,
  Sparkles,
  Calendar,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QueueBookingSectionProps {
  initialTab?: 'queue' | 'booking';
}

export const QueueBookingSection: React.FC<QueueBookingSectionProps> = ({ initialTab = 'queue' }) => {
  const { 
    activeLocation, 
    queue, 
    joinQueue, 
    updateQueueStatus, 
    bookings, 
    createBooking, 
    cancelBooking 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'booking'>(initialTab);

  // Queue Form State
  const [qName, setQName] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qPartySize, setQPartySize] = useState(2);
  const [qDietary, setQDietary] = useState<'all' | 'veg' | 'vegan' | 'jain'>('all');
  const [qNotes, setQNotes] = useState('');
  const [myTicketId, setMyTicketId] = useState<string | null>(null);

  // Booking Form State
  const [bName, setBName] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bPartySize, setBPartySize] = useState(2);
  const [bDate, setBDate] = useState('2026-11-16');
  const [bTimeSlot, setBTimeSlot] = useState('19:00');
  const [bSeating, setBSeating] = useState<'indoor' | 'outdoor_terrace' | 'quiet_corner' | 'bar_counter'>('indoor');
  const [bDietary, setBDietary] = useState('');
  const [bOccasion, setBOccasion] = useState<'none' | 'birthday' | 'anniversary' | 'business' | 'date'>('none');
  const [latestBookingRef, setLatestBookingRef] = useState<string | null>(null);

  // Active queue status for this location
  const branchQueue = queue.filter(q => q.locationId === activeLocation.id && (q.status === 'waiting' || q.status === 'called'));
  const myTicket = queue.find(q => q.id === myTicketId);

  const handleJoinQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qName || !qPhone) return;

    const ticket = joinQueue(qName, qPhone, qPartySize, qDietary, qNotes);
    setMyTicketId(ticket.id);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bPhone || !bEmail) return;

    const newBk = createBooking({
      locationId: activeLocation.id,
      customerName: bName,
      email: bEmail,
      phone: bPhone,
      partySize: bPartySize,
      date: bDate,
      timeSlot: bTimeSlot,
      seatingPreference: bSeating,
      dietaryNotes: bDietary.trim() ? bDietary : undefined,
      specialOccasion: bOccasion !== 'none' ? bOccasion : undefined,
    });

    setLatestBookingRef(newBk.bookingRef);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const timeSlots = [
    '08:30', '09:30', '10:30', '11:30', 
    '12:30', '13:30', '15:00', '16:30', 
    '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Tab Switcher */}
      <div className="flex bg-cafe-200/70 p-1.5 rounded-2xl border border-cafe-300/60 max-w-md mx-auto shadow-inner">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'queue'
              ? 'bg-white text-cafe-900 shadow-md'
              : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600" />
          <span>Virtual Queue (Walk-in)</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'booking'
              ? 'bg-white text-cafe-900 shadow-md'
              : 'text-cafe-600 hover:text-cafe-900'
          }`}
        >
          <CalendarDays className="w-4 h-4 text-amber-600" />
          <span>Advance Reservation</span>
        </button>
      </div>

      {/* SECTION 1: VIRTUAL QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Queue Pulse Card */}
          <div className="bg-gradient-to-br from-cafe-900 to-cafe-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cafe-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeLocation.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Live Virtual Queue
              </h2>
              <p className="text-xs sm:text-sm text-cafe-300 max-w-md">
                Don't wait in the rain or heat. Grab a digital queue ticket, stroll around, and we will ping your phone when your table is ready.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-cafe-300 block">Waiting Parties</span>
                <span className="text-2xl font-bold font-mono text-amber-300">{branchQueue.length}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-cafe-300 block">Est. Wait Time</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ~{branchQueue.length === 0 ? '5' : branchQueue.length * 8} mins
                </span>
              </div>
            </div>
          </div>

          {/* Active Ticket Banner (If User Joined) */}
          {myTicket && myTicket.status !== 'cancelled' && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-6 shadow-md animate-in zoom-in-95">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-cafe-950 text-xs font-bold uppercase tracking-wider">
                    {myTicket.status === 'called' ? '🔔 Your Table is Ready!' : '🎟️ Active Queue Ticket'}
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-cafe-950 mt-2">
                    Ticket #{myTicket.ticketNumber} • {myTicket.customerName}
                  </h3>
                  <p className="text-xs text-cafe-700 mt-1">
                    Party of {myTicket.partySize} guests • Joined at {myTicket.joinedAt}
                    {myTicket.dietaryPreference && myTicket.dietaryPreference !== 'all' && (
                      <span className="font-bold text-amber-900 ml-1">
                        ({myTicket.dietaryPreference.toUpperCase()} diet priority)
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => {
                    updateQueueStatus(myTicket.id, 'cancelled');
                    setMyTicketId(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                >
                  Leave Queue
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-cafe-500 block text-[11px]">Estimated Wait:</span>
                  <span className="font-bold text-cafe-900 font-mono">
                    {myTicket.status === 'called' ? 'Now seating!' : `~${myTicket.estimatedWaitMins} minutes`}
                  </span>
                </div>
                <div>
                  <span className="text-cafe-500 block text-[11px]">SMS Notifications:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active to {myTicket.phone}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-cafe-500 block text-[11px]">Dietary Cleanliness:</span>
                  <span className="font-semibold text-amber-900">Sanitized cookware flagged</span>
                </div>
              </div>
            </div>
          )}

          {/* Join Queue Form */}
          {(!myTicket || myTicket.status === 'cancelled') && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-cafe-900 mb-1">
                Join the Walk-in Waitlist
              </h3>
              <p className="text-xs text-cafe-600 mb-6">
                Fill in your party info to get your digital queue token instantly.
              </p>

              <form onSubmit={handleJoinQueue} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samir Doshi"
                      value={qName}
                      onChange={e => setQName(e.target.value)}
                      className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                      Mobile Number (For SMS updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={qPhone}
                      onChange={e => setQPhone(e.target.value)}
                      className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                      Number of Guests (Party Size)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5, 6, '7+'].map((num, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setQPartySize(typeof num === 'number' ? num : 8)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                            (typeof num === 'number' && qPartySize === num) || (num === '7+' && qPartySize >= 7)
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                              : 'bg-cafe-50 text-cafe-800 border-cafe-200 hover:bg-cafe-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                      Dietary Cleanliness Priority
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQDietary('all')}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          qDietary === 'all'
                            ? 'bg-cafe-900 text-white border-cafe-950'
                            : 'bg-cafe-50 border-cafe-200 text-cafe-700'
                        }`}
                      >
                        Standard Dining
                      </button>

                      <button
                        type="button"
                        onClick={() => setQDietary('jain')}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          qDietary === 'jain'
                            ? 'bg-amber-500 text-cafe-950 border-amber-600 ring-2 ring-amber-400/40'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        🕊️ Strictly Jain
                      </button>

                      <button
                        type="button"
                        onClick={() => setQDietary('vegan')}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          qDietary === 'vegan'
                            ? 'bg-teal-700 text-white border-teal-800'
                            : 'bg-teal-50 border-teal-200 text-teal-800'
                        }`}
                      >
                        🌿 Vegan Table
                      </button>

                      <button
                        type="button"
                        onClick={() => setQDietary('veg')}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          qDietary === 'veg'
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        Pure Vegetarian
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Special Seating Request (High chair, wheelchair, quiet corner, etc.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Quiet booth preferred, celebrating promotion..."
                    value={qNotes}
                    onChange={e => setQNotes(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Get Virtual Queue Ticket
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: ADVANCE RESERVATION SYSTEM */}
      {activeTab === 'booking' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Reservation Header Card */}
          <div className="bg-gradient-to-br from-cafe-900 to-cafe-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-cafe-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Ahead</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Book an Artisan Table
              </h2>
              <p className="text-xs sm:text-sm text-cafe-300 max-w-md">
                Guaranteed seating for business lunches, romantic dates, family gatherings, or Jain dining parties.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-xs text-cafe-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <ShieldCheck className="w-4 h-4" /> Instant SMS & Email Confirmation
              </div>
              <div>Free cancellation up to 1 hour prior</div>
            </div>
          </div>

          {/* Success Booking Card */}
          {latestBookingRef && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 shadow-md animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reservation Confirmed</span>
                </div>
                <button
                  onClick={() => setLatestBookingRef(null)}
                  className="text-cafe-500 hover:text-cafe-800 text-xs"
                >
                  Book Another Table
                </button>
              </div>

              <h3 className="font-serif font-bold text-2xl text-cafe-950 mt-2">
                Booking Reference: {latestBookingRef}
              </h3>
              <p className="text-xs text-cafe-700 mt-1">
                We look forward to hosting you at {activeLocation.name}. A confirmation has been logged in our host system.
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200 shadow-sm">
            <form onSubmit={handleCreateBooking} className="space-y-6">
              {/* Row 1: Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Kapoor"
                    value={bName}
                    onChange={e => setBName(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={bEmail}
                    onChange={e => setBEmail(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={bPhone}
                    onChange={e => setBPhone(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Date, Time Slot & Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bDate}
                    onChange={e => setBDate(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Select Time Slot *
                  </label>
                  <select
                    value={bTimeSlot}
                    onChange={e => setBTimeSlot(e.target.value)}
                    className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t} HRS</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 4, 6, 8, 12].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBPartySize(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                          bPartySize === num
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-cafe-50 text-cafe-800 border-cafe-200 hover:bg-cafe-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Seating Preference & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                    Preferred Seating Area
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'indoor', label: 'Main Indoor Hall', desc: 'Airy & lively' },
                      { key: 'outdoor_terrace', label: 'Outdoor Terrace', desc: 'Garden greenery' },
                      { key: 'quiet_corner', label: 'Window Lounge', desc: 'Great for work/reading' },
                      { key: 'bar_counter', label: 'Roastery View Bar', desc: 'Watch baristas brew' },
                    ].map(seat => (
                      <button
                        key={seat.key}
                        type="button"
                        onClick={() => setBSeating(seat.key as any)}
                        className={`p-3 rounded-2xl text-left border transition ${
                          bSeating === seat.key
                            ? 'bg-amber-100 border-amber-600 text-amber-950 ring-1 ring-amber-500'
                            : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                        }`}
                      >
                        <div className="font-semibold text-xs">{seat.label}</div>
                        <div className="text-[10px] text-cafe-500">{seat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-2">
                    Special Occasion
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: 'Casual Dining' },
                      { key: 'birthday', label: '🎂 Birthday' },
                      { key: 'anniversary', label: '🥂 Anniversary' },
                      { key: 'business', label: '💼 Business Meet' },
                      { key: 'date', label: '🌹 Romantic Date' },
                    ].map(occ => (
                      <button
                        key={occ.key}
                        type="button"
                        onClick={() => setBOccasion(occ.key as any)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                          bOccasion === occ.key
                            ? 'bg-cafe-900 border-cafe-950 text-white'
                            : 'bg-cafe-50 border-cafe-200 text-cafe-700 hover:bg-cafe-100'
                        }`}
                      >
                        {occ.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Dietary Notes (Jain, Vegan, Allergens) */}
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Dietary Preferences & Kitchen Advisories (Jain / Vegan / Nut Allergies)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2 guests require strictly 100% Jain food (no onions/garlic/potatoes). 1 guest has peanut allergy."
                  value={bDietary}
                  onChange={e => setBDietary(e.target.value)}
                  className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-amber-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <CalendarDays className="w-4 h-4" /> Confirm Table Reservation
              </button>
            </form>
          </div>

          {/* Existing Upcoming Bookings List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-cafe-900">
              Recent Table Reservations at this Location
            </h3>
            <div className="divide-y divide-cafe-100">
              {bookings.filter(b => b.locationId === activeLocation.id).map(bk => (
                <div key={bk.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-cafe-900">{bk.customerName}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cafe-100 text-cafe-700">
                        {bk.bookingRef}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                        {bk.status}
                      </span>
                    </div>
                    <div className="text-xs text-cafe-500 mt-0.5">
                      {bk.date} at {bk.timeSlot} • {bk.partySize} Guests • {bk.seatingPreference.replace('_', ' ')}
                      {bk.dietaryNotes && (
                        <span className="block text-amber-800 text-[11px] font-medium mt-0.5">
                          Note: {bk.dietaryNotes}
                        </span>
                      )}
                    </div>
                  </div>

                  {bk.status === 'confirmed' && (
                    <button
                      onClick={() => cancelBooking(bk.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-lg border border-red-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
