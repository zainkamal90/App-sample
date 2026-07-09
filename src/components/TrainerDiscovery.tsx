/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  X, 
  Calendar, 
  Video, 
  User, 
  Award, 
  TrendingUp, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Trainer, Review, Booking } from '../types';

interface TrainerDiscoveryProps {
  trainers: Trainer[];
  favoriteTrainers: string[];
  toggleFavorite: (trainerId: string) => void;
  onBookSession: (trainer: Trainer, date: string, time: string, type: 'Video' | 'In-Person', duration: number) => void;
  gyms: any[];
}

export default function TrainerDiscovery({ 
  trainers, 
  favoriteTrainers, 
  toggleFavorite, 
  onBookSession,
  gyms
}: TrainerDiscoveryProps) {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [showFilters, setShowFilters] = useState(false);

  // Active trainer detail view
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Booking process states
  const [bookingStep, setBookingStep] = useState<'profile' | 'schedule' | 'payment'>('profile');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingType, setBookingType] = useState<'Video' | 'In-Person'>('Video');
  const [bookingDuration, setBookingDuration] = useState<number>(30); // 30 or 60 min

  // Payments states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // New review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localTrainerReviews, setLocalTrainerReviews] = useState<Record<string, Review[]>>({});

  const specialties = ['All', 'Strength', 'Yoga & Mindfulness', 'Cardio & HIIT', 'Rehab & Mobility'];
  const levels = ['All', 'Pro', 'Elite', 'Master'];

  // Handle specialty quick filtering
  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trainer.certs.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'All' || trainer.specialty === selectedSpecialty;
    const matchesLevel = selectedLevel === 'All' || trainer.level === selectedLevel;
    const matchesPrice = trainer.rate <= maxPrice;

    return matchesSearch && matchesSpecialty && matchesLevel && matchesPrice;
  });

  const getTrainerReviews = (trainerId: string, baseReviews: Review[]) => {
    return localTrainerReviews[trainerId] || baseReviews;
  };

  const getTrainerAverageRating = (trainerId: string, baseTrainer: Trainer) => {
    const reviews = getTrainerReviews(trainerId, baseTrainer.reviews);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev_local_${Date.now()}`,
      trainerId: selectedTrainer.id,
      userName: 'Alex Johnson (You)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...getTrainerReviews(selectedTrainer.id, selectedTrainer.reviews)];
    setLocalTrainerReviews(prev => ({
      ...prev,
      [selectedTrainer.id]: updatedReviews
    }));

    setReviewComment('');
    setReviewRating(5);
  };

  const handleOpenTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setBookingStep('profile');
    setPaymentSuccess(false);
    // Set default booking date as tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    setPaymentSuccess(true);
    setTimeout(() => {
      onBookSession(
        selectedTrainer,
        bookingDate,
        bookingTime,
        bookingType,
        bookingDuration
      );
      setSelectedTrainer(null);
    }, 1800);
  };

  const currentTrainerReviews = selectedTrainer ? getTrainerReviews(selectedTrainer.id, selectedTrainer.reviews) : [];
  const currentTrainerRating = selectedTrainer ? getTrainerAverageRating(selectedTrainer.id, selectedTrainer) : 0;
  const currentTrainerGym = selectedTrainer ? gyms.find(g => g.id === selectedTrainer.gymId) : null;

  const totalCost = selectedTrainer ? (bookingDuration === 30 ? Math.round(selectedTrainer.rate * 0.5) : selectedTrainer.rate) : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-6 relative">
      {/* Search and Filters Header */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="trainer-search"
              type="text"
              placeholder="Search by name, certification, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          {/* Quick Filter Specialty Selector */}
          <div className="flex items-center space-x-2">
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters || selectedLevel !== 'All' || maxPrice < 120
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="advanced-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-slate-800/60 pt-4 grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Level select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Trainer Tier</label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      id={`filter-level-${lvl}`}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedLevel === lvl
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Max Rate</label>
                  <span className="text-xs font-mono font-bold text-indigo-400">${maxPrice}/hr</span>
                </div>
                <input
                  id="filter-price-slider"
                  type="range"
                  min="50"
                  max="120"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Reset filter shortcuts */}
              <div className="flex items-end">
                <button
                  id="reset-filters-btn"
                  onClick={() => {
                    setSelectedLevel('All');
                    setMaxPrice(120);
                    setSelectedSpecialty('All');
                    setSearchQuery('');
                  }}
                  className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Specialty Pills Tab row */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {specialties.map((spec) => (
            <button
              key={spec}
              id={`filter-spec-${spec}`}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Trainers Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTrainers.length === 0 ? (
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl py-12 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-500 border border-slate-850">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">No trainers match your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try widening your price range or adjusting search keywords.</p>
            </div>
          </div>
        ) : (
          filteredTrainers.map((trainer) => {
            const isFav = favoriteTrainers.includes(trainer.id);
            const avgRating = getTrainerAverageRating(trainer.id, trainer);
            const totalReviews = getTrainerReviews(trainer.id, trainer.reviews).length;

            return (
              <motion.div
                key={trainer.id}
                id={`trainer-card-${trainer.id}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-indigo-500/20 hover:shadow-lg hover:shadow-black/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top card metadata */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={trainer.avatar} 
                        alt={trainer.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-100 font-display group-hover:text-indigo-400 transition-colors">
                            {trainer.name}
                          </h3>
                          <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono font-semibold px-2 py-0.5 rounded">
                            {trainer.level}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium">{trainer.specialty}</p>
                      </div>
                    </div>
                    
                    {/* Favorite shortcut */}
                    <button
                      id={`fav-btn-${trainer.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(trainer.id);
                      }}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors text-slate-400 hover:text-rose-500"
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Bio summary */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {trainer.bio}
                  </p>

                  {/* Certifications list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trainer.certs.slice(0, 2).map((cert, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-500 px-2 py-1 rounded-md font-mono line-clamp-1 max-w-[170px]">
                        {cert.split(' (')[0]}
                      </span>
                    ))}
                    {trainer.certs.length > 2 && (
                      <span className="text-[10px] text-slate-500 px-1.5 py-1">
                        +{trainer.certs.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Action row */}
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-200">{avgRating}</span>
                      <span className="text-[10px] text-slate-500">({totalReviews})</span>
                    </div>
                    <div className="flex items-center space-x-0.5 font-mono text-slate-300 text-xs">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-slate-200">{trainer.rate}</span>
                      <span className="text-slate-500 text-[10px]">/hr</span>
                    </div>
                  </div>

                  <button
                    id={`view-trainer-btn-${trainer.id}`}
                    onClick={() => handleOpenTrainer(trainer)}
                    className="inline-flex items-center space-x-1 px-3.5 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold rounded-xl transition-all"
                  >
                    <span>View & Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Trainer Detail Drawer overlay */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            id="trainer-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              id="trainer-detail-modal"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/20 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500/15 p-2 rounded-xl text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">Trainer Profile & Consultations</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Book offline-synchronized appointments</p>
                  </div>
                </div>
                <button
                  id="close-modal-btn"
                  onClick={() => setSelectedTrainer(null)}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors border border-slate-800/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Panels */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Panel: Profile and reviews */}
                <div className="md:col-span-7 space-y-6">
                  
                  {/* Bio block */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-950/20 border border-slate-800/60 rounded-2xl">
                    <img 
                      src={selectedTrainer.avatar} 
                      alt={selectedTrainer.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-bold text-white font-display">{selectedTrainer.name}</h4>
                        <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-semibold font-mono">
                          {selectedTrainer.level}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-medium">{selectedTrainer.specialty}</p>
                      <div className="flex items-center space-x-3.5 mt-1 text-xs">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-200">{currentTrainerRating}</span>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="flex items-center space-x-1 font-mono text-slate-300">
                          <DollarSign className="w-3 h-3 text-indigo-400" />
                          <span className="font-bold">{selectedTrainer.rate}</span>
                          <span className="text-[10px] text-slate-500">/hr</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">Expertise & Certifications</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedTrainer.bio}
                    </p>
                    <div className="flex flex-col gap-1.5 pt-2">
                      {selectedTrainer.certs.map((cert, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                          <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gym location association */}
                  {currentTrainerGym && (
                    <div className="p-3.5 bg-slate-950/30 border border-slate-800/80 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-slate-200">{currentTrainerGym.name}</h6>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{currentTrainerGym.address.split(',')[0]}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{currentTrainerGym.distance} away</span>
                    </div>
                  )}

                  {/* Submit review and reviews list */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/60">
                    <h5 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider flex items-center space-x-1.5">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Reviews & Feedback</span>
                    </h5>

                    {/* New review form */}
                    <form onSubmit={handleAddReview} className="p-4 bg-slate-950/45 border border-slate-800/60 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Rate this trainer</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-0.5 focus:outline-none"
                            >
                              <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Write constructive feedback for this trainer..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold shadow-md shadow-indigo-600/10 transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>

                    {/* Review List block */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {currentTrainerReviews.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2">No reviews logged yet. Be the first!</p>
                      ) : (
                        currentTrainerReviews.map((rev) => (
                          <div key={rev.id} className="p-3.5 bg-slate-950/20 border border-slate-850 rounded-xl space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center space-x-2">
                                <img src={rev.userAvatar} alt={rev.userName} className="w-5 h-5 rounded-full object-cover" />
                                <span className="font-bold text-slate-300">{rev.userName}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-800'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-slate-400 italic font-sans leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Panel: Calendar booking, scheduling, payment */}
                <div className="md:col-span-5 bg-slate-950/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    {/* Booking Navigation Tab headers */}
                    <div className="flex border-b border-slate-800/60 pb-3 mb-4 text-xs font-bold font-mono">
                      <span className={`flex-1 text-center pb-1 ${bookingStep === 'profile' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500'}`}>
                        1. Plan
                      </span>
                      <span className={`flex-1 text-center pb-1 ${bookingStep === 'schedule' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500'}`}>
                        2. Schedule
                      </span>
                      <span className={`flex-1 text-center pb-1 ${bookingStep === 'payment' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500'}`}>
                        3. Secure Pay
                      </span>
                    </div>

                    {/* Step Content */}
                    {bookingStep === 'profile' && (
                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-slate-200">Select consultation type</h5>
                        
                        {/* Session Type */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setBookingType('Video')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                              bookingType === 'Video'
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Video className="w-5 h-5" />
                            <span className="text-xs font-bold">Video call</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingType('In-Person')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                              bookingType === 'In-Person'
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <MapPin className="w-5 h-5" />
                            <span className="text-xs font-bold">In-Gym</span>
                          </button>
                        </div>

                        {/* Session duration */}
                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Duration</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setBookingDuration(30)}
                              className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                                bookingDuration === 30
                                  ? 'bg-indigo-600 text-white border-indigo-500'
                                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              30 Minutes
                            </button>
                            <button
                              type="button"
                              onClick={() => setBookingDuration(60)}
                              className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                                bookingDuration === 60
                                  ? 'bg-indigo-600 text-white border-indigo-500'
                                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              60 Minutes
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex justify-between items-center text-xs pt-4">
                          <span className="text-slate-400 font-medium">Platform Fee</span>
                          <span className="font-mono font-bold text-slate-200">Included</span>
                        </div>
                      </div>
                    )}

                    {bookingStep === 'schedule' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Select Date</label>
                          <input
                            id="booking-date-picker"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Available time slots</label>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedTrainer.availability.map((time) => (
                              <button
                                key={time}
                                type="button"
                                id={`time-slot-${time}`}
                                onClick={() => setBookingTime(time)}
                                className={`py-2 text-center rounded-lg text-xs font-mono font-semibold transition-all ${
                                  bookingTime === time
                                    ? 'bg-indigo-600 text-white border-indigo-500'
                                    : 'bg-slate-900 border border-slate-850 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl text-[11px] text-indigo-300 flex items-start space-x-2">
                          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Real-time availability confirmed. Slot is reserved for 5 minutes.</span>
                        </div>
                      </div>
                    )}

                    {bookingStep === 'payment' && (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        {paymentSuccess ? (
                          <div className="py-8 text-center space-y-3">
                            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center animate-bounce">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">Payment Confirmed!</p>
                              <p className="text-xs text-slate-400 mt-1">Booking synced with client-database.</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h5 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">Secure Card Checkout</h5>
                            <div className="space-y-2.5">
                              <input
                                id="payment-card-number"
                                type="text"
                                placeholder="4111 2222 3333 4444"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                                required
                                className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  id="payment-card-expiry"
                                  type="text"
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                                  required
                                  className="bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-center"
                                />
                                <input
                                  id="payment-card-cvc"
                                  type="password"
                                  placeholder="CVC"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                  required
                                  className="bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-center"
                                />
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-850 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400">Total Consultation Cost</span>
                                  <span className="font-mono font-bold text-slate-200">${totalCost} USD</span>
                                </div>
                                <p className="text-[9px] text-slate-500 leading-normal">Your card is processed under strict compliance. Secure encryption covers all transits.</p>
                              </div>
                            </div>
                          </>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Booking Drawer Footer / Navigation Buttons */}
                  {!paymentSuccess && (
                    <div className="pt-6 border-t border-slate-800/60 flex items-center space-x-3 bg-transparent shrink-0">
                      {bookingStep !== 'profile' && (
                        <button
                          type="button"
                          id="booking-prev-btn"
                          onClick={() => {
                            if (bookingStep === 'schedule') setBookingStep('profile');
                            else if (bookingStep === 'payment') setBookingStep('schedule');
                          }}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Back
                        </button>
                      )}
                      
                      {bookingStep === 'profile' && (
                        <button
                          type="button"
                          id="booking-to-schedule-btn"
                          onClick={() => setBookingStep('schedule')}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors text-center"
                        >
                          Continue to Schedule
                        </button>
                      )}

                      {bookingStep === 'schedule' && (
                        <button
                          type="button"
                          id="booking-to-payment-btn"
                          disabled={!bookingTime}
                          onClick={() => setBookingStep('payment')}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors text-center"
                        >
                          {bookingTime ? 'Confirm Slot & Pay' : 'Select a Slot to Continue'}
                        </button>
                      )}

                      {bookingStep === 'payment' && (
                        <button
                          type="button"
                          id="booking-pay-btn"
                          onClick={handleCheckout}
                          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/15 transition-all text-center"
                        >
                          Pay ${totalCost} & Sync Consultation
                        </button>
                      )}
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
