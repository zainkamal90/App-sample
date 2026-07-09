/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  X, 
  AlertTriangle, 
  Edit, 
  CheckCircle, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Booking } from '../types';

interface BookingManagerProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string, newDate: string, newTime: string) => void;
  onJoinVideoCall: (booking: Booking) => void;
}

export default function BookingManager({ 
  bookings, 
  onCancelBooking, 
  onRescheduleBooking, 
  onJoinVideoCall 
}: BookingManagerProps) {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'history'>('upcoming');
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Confirm cancel dialog
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const upcomingList = bookings.filter(b => b.status === 'upcoming');
  const historyList = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !newDate || !newTime) return;

    onRescheduleBooking(reschedulingBooking.id, newDate, newTime);
    setReschedulingBooking(null);
    setNewDate('');
    setNewTime('');
  };

  const handleCancelConfirm = () => {
    if (!cancellingBooking) return;
    onCancelBooking(cancellingBooking.id);
    setCancellingBooking(null);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 relative">
      {/* Tab Filter header */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 flex shadow-md">
        <button
          id="upcoming-tab-btn"
          onClick={() => setActiveFilter('upcoming')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
            activeFilter === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Upcoming Consultations ({upcomingList.length})
        </button>
        <button
          id="history-tab-btn"
          onClick={() => setActiveFilter('history')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
            activeFilter === 'history'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Completed & Cancelled ({historyList.length})
        </button>
      </div>

      {/* Booking list */}
      <div className="space-y-4">
        {activeFilter === 'upcoming' ? (
          upcomingList.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl py-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-500 border border-slate-850 animate-pulse">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">No upcoming consultations</p>
                <p className="text-xs text-slate-500 mt-1">Book professional trainers in the Trainers tab to align your routines.</p>
              </div>
            </div>
          ) : (
            upcomingList.map((booking) => (
              <motion.div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-indigo-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                {/* Left block trainer info */}
                <div className="flex items-center space-x-4">
                  <img 
                    src={booking.trainerAvatar} 
                    alt={booking.trainerName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-display">{booking.trainerName}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{booking.specialty}</p>
                    
                    {/* Schedule timestamp log */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{booking.date}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{booking.time} ({booking.duration} mins)</span>
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 uppercase leading-none">
                        {booking.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right block action buttons */}
                <div className="flex sm:flex-col items-stretch sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                  {booking.type === 'Video' ? (
                    <button
                      id={`join-portal-${booking.id}`}
                      onClick={() => onJoinVideoCall(booking)}
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all flex-1 sm:flex-initial"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Portal</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3.5 py-2.5 rounded-xl border border-amber-500/10 justify-center">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>In-Gym session</span>
                    </span>
                  )}

                  {/* Reschedule and cancel controls */}
                  <div className="flex items-center space-x-1.5 justify-end">
                    <button
                      id={`reschedule-btn-${booking.id}`}
                      onClick={() => {
                        setReschedulingBooking(booking);
                        setNewDate(booking.date);
                        setNewTime(booking.time);
                      }}
                      title="Reschedule consultation"
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`cancel-btn-${booking.id}`}
                      onClick={() => setCancellingBooking(booking)}
                      title="Cancel consultation"
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )
        ) : (
          historyList.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl py-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-500 border border-slate-850">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No past consultation histories</p>
            </div>
          ) : (
            historyList.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm opacity-70 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={booking.trainerAvatar} 
                    alt={booking.trainerName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-800 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 font-display">{booking.trainerName}</h3>
                    <p className="text-xs text-slate-500">{booking.specialty}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1.5 font-mono">
                      <span>{booking.date}</span>
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {booking.status === 'completed' ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-semibold text-xs rounded-lg border border-emerald-500/10">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 font-semibold text-xs rounded-lg border border-rose-500/10">
                      <X className="w-3.5 h-3.5" />
                      <span>Cancelled</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Reschedule consultation overlay */}
      <AnimatePresence>
        {reschedulingBooking && (
          <motion.div
            id="reschedule-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              id="reschedule-modal"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <h3 className="text-lg font-bold font-display text-white">Reschedule Consultation</h3>
                <button
                  id="close-reschedule-btn"
                  onClick={() => setReschedulingBooking(null)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Trainer</label>
                  <p className="text-sm font-bold text-white">{reschedulingBooking.trainerName}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">New Date</label>
                  <input
                    id="new-booking-date"
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">New Time Slot</label>
                  <select
                    id="new-booking-time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Choose a time...</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center space-x-3 bg-transparent">
                  <button
                    type="button"
                    id="cancel-reschedule-btn"
                    onClick={() => setReschedulingBooking(null)}
                    className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Keep Existing
                  </button>
                  <button
                    type="submit"
                    id="confirm-reschedule-btn"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors"
                  >
                    Apply Reschedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm cancel overlay */}
      <AnimatePresence>
        {cancellingBooking && (
          <motion.div
            id="cancel-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              id="cancel-confirm-modal"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white font-display">Cancel Consultation?</h4>
                <p className="text-xs text-slate-400">Are you sure you want to cancel your session with {cancellingBooking.trainerName}? This action can be rescheduled later.</p>
              </div>

              <div className="pt-2 flex items-center space-x-3 bg-transparent">
                <button
                  type="button"
                  id="cancel-dismiss-btn"
                  onClick={() => setCancellingBooking(null)}
                  className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  No, Keep It
                </button>
                <button
                  type="button"
                  id="cancel-confirm-btn"
                  onClick={handleCancelConfirm}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
