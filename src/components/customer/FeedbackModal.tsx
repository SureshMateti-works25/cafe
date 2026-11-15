import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { activeLocation, submitFeedback } = useApp();

  const [name, setName] = useState('');
  const [dietaryPref, setDietaryPref] = useState<'veg' | 'vegan' | 'jain' | 'regular'>('jain');
  const [overallRating, setOverallRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [ambienceRating, setAmbienceRating] = useState(5);
  const [dietaryCareRating, setDietaryCareRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    submitFeedback({
      locationId: activeLocation.id,
      customerName: name,
      rating: overallRating,
      foodRating,
      serviceRating,
      ambienceRating,
      dietaryHandlingRating: dietaryCareRating,
      dietaryPreference: dietaryPref,
      comment,
    });

    setSubmitted(true);
    confetti({ particleCount: 80, spread: 60 });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const StarPicker = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-cafe-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'fill-amber-400 text-amber-500' : 'text-cafe-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
          <div>
            <h3 className="font-serif font-bold text-lg text-cafe-900">Guest Review & Dietary Feedback</h3>
            <p className="text-xs text-cafe-500">{activeLocation.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-cafe-400 hover:text-cafe-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-xl text-cafe-900">Thank You for Your Feedback!</h4>
            <p className="text-xs text-cafe-600">
              Your ratings help our culinary and operations team maintain the highest standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Guest Name & Dietary Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavin Shah"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Primary Dining Preference
                </label>
                <select
                  value={dietaryPref}
                  onChange={e => setDietaryPref(e.target.value as any)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden font-semibold"
                >
                  <option value="jain">🕊️ Jain (Zero root veg / no onion-garlic)</option>
                  <option value="vegan">🌿 Vegan (100% Plant-Based)</option>
                  <option value="veg">Pure Vegetarian</option>
                  <option value="regular">Standard / Non-Veg</option>
                </select>
              </div>
            </div>

            {/* Ratings Breakdown */}
            <div className="bg-cafe-50/80 rounded-2xl p-4 border border-cafe-200 space-y-1">
              <span className="text-[11px] font-bold text-cafe-900 uppercase tracking-wider block mb-1">
                Rate Specific Aspects
              </span>
              <StarPicker value={foodRating} onChange={setFoodRating} label="Taste & Food Quality" />
              <StarPicker value={serviceRating} onChange={setServiceRating} label="Hospitality & Speed" />
              <StarPicker value={ambienceRating} onChange={setAmbienceRating} label="Ambience & Music" />
              <StarPicker 
                value={dietaryCareRating} 
                onChange={setDietaryCareRating} 
                label="Dietary Care & Cross-Contamination Caution" 
              />
            </div>

            {/* Written Comments */}
            <div>
              <label className="text-xs font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                Your Review & Suggestions *
              </label>
              <textarea
                required
                rows={3}
                placeholder="How was your meal? Tell us about the flavors, Jain/Vegan compliance, or barista care..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full p-3 bg-cafe-50 rounded-2xl border border-cafe-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition"
            >
              Submit Public Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
