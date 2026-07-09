/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Footprints, 
  Droplet, 
  Activity, 
  Plus, 
  Minus, 
  Clock, 
  Video, 
  Compass, 
  ChevronRight, 
  Smartphone,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import { UserProfile, DailyActivity, Booking } from '../types';

interface DashboardProps {
  user: UserProfile;
  activityToday: DailyActivity;
  updateActivity: (updates: Partial<DailyActivity>) => void;
  upcomingBookings: Booking[];
  setActiveTab: (tab: string) => void;
  onJoinVideoCall: (booking: Booking) => void;
}

export default function Dashboard({ 
  user, 
  activityToday, 
  updateActivity, 
  upcomingBookings, 
  setActiveTab,
  onJoinVideoCall
}: DashboardProps) {

  // Filter today's bookings
  const todayStr = new Date().toISOString().split('T')[0];
  const bookingsToday = upcomingBookings.filter(b => b.date === todayStr && b.status === 'upcoming');

  const stepPercentage = Math.min(100, (activityToday.steps / user.dailyStepGoal) * 100);
  const caloriePercentage = Math.min(100, (activityToday.caloriesConsumed / user.dailyCalorieGoal) * 100);
  const waterPercentage = Math.min(100, (activityToday.waterConsumed / user.waterGoal) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl overflow-hidden border border-slate-800/60 shadow-lg shadow-black/15"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <span className="text-indigo-400 font-mono text-xs uppercase tracking-wider font-semibold">Welcome Back</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">Hello, {user.name}!</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-md">Your trainer-assigned regimes are synced and offline-cached. Ready to crush your targets?</p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950/40 border border-slate-800 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-inner">
            <div className="bg-amber-500/15 p-2 rounded-xl">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500/30 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Daily Streak</span>
              <span className="text-lg font-bold text-white leading-none">{user.streak} Days Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Cards - Grid */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {/* Step Tracker Card */}
        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl shadow-md flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded-full">
              Steps
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-slate-100 font-display">
                {activityToday.steps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {user.dailyStepGoal.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${stepPercentage}%` }} 
              />
            </div>
            <span className="text-xs text-slate-400 font-medium block pt-1">
              {Math.round(stepPercentage)}% of daily goal completed
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/60">
            <button 
              onClick={() => updateActivity({ steps: Math.max(0, activityToday.steps - 1000) })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold text-slate-300 flex-1 text-center">1k steps</span>
            <button 
              onClick={() => updateActivity({ steps: activityToday.steps + 1000 })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Calorie Tracker Card */}
        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl shadow-md flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-500/10 p-2.5 rounded-xl text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400/80 bg-rose-500/5 px-2 py-0.5 rounded-full">
              Nutrition
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-slate-100 font-display">
                {activityToday.caloriesConsumed.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {user.dailyCalorieGoal.toLocaleString()} kcal</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                style={{ width: `${caloriePercentage}%` }} 
              />
            </div>
            <span className="text-xs text-slate-400 font-medium block pt-1">
              {Math.round(caloriePercentage)}% of intake limit reached
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/60">
            <button 
              onClick={() => updateActivity({ caloriesConsumed: Math.max(0, activityToday.caloriesConsumed - 150) })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold text-slate-300 flex-1 text-center">150 kcal</span>
            <button 
              onClick={() => updateActivity({ caloriesConsumed: activityToday.caloriesConsumed + 150 })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Water Tracker Card */}
        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl shadow-md flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-400/80 bg-blue-500/5 px-2 py-0.5 rounded-full">
              Hydration
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-slate-100 font-display">
                {activityToday.waterConsumed.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {user.waterGoal.toLocaleString()} ml</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${waterPercentage}%` }} 
              />
            </div>
            <span className="text-xs text-slate-400 font-medium block pt-1">
              {Math.round(waterPercentage)}% of hydration target
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/60">
            <button 
              onClick={() => updateActivity({ waterConsumed: Math.max(0, activityToday.waterConsumed - 250) })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold text-slate-300 flex-1 text-center">250 ml</span>
            <button 
              onClick={() => updateActivity({ waterConsumed: activityToday.waterConsumed + 250 })}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of consultations and secondary dashboard modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Today */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/60">
              <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Today's Consultations</span>
              </h3>
              <button 
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookingsToday.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-500 border border-slate-800">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No appointments scheduled today</p>
                  <p className="text-xs text-slate-500 mt-1">Book a consultation with our industry experts to optimize your fitness journey.</p>
                </div>
                <button
                  onClick={() => setActiveTab('trainers')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors mt-2"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Discover Trainers</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {bookingsToday.map((booking) => (
                  <div 
                    key={booking.id}
                    className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={booking.trainerAvatar} 
                        alt={booking.trainerName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{booking.trainerName}</h4>
                        <p className="text-xs text-indigo-400 font-medium">{booking.specialty}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1 font-mono">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{booking.time} ({booking.duration}m)</span>
                          </span>
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded font-semibold text-[10px] text-slate-300">
                            {booking.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {booking.type === 'Video' ? (
                        <button
                          onClick={() => onJoinVideoCall(booking)}
                          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-500/25 transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Portal</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/10">
                          <span>In-Gym session</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Mini Achievements & Goals */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold font-display text-white mb-4 pb-2 border-b border-slate-800/60 flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Goal Tracking</span>
            </h3>

            <div className="space-y-4">
              {/* Steps milestone */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Daily Steps Progress</span>
                  <span className="font-mono font-bold text-slate-400">{activityToday.steps} / {user.dailyStepGoal}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stepPercentage}%` }} />
                </div>
              </div>

              {/* Water goals */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Hydration</span>
                  <span className="font-mono font-bold text-slate-400">{activityToday.waterConsumed}ml / {user.waterGoal}ml</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${waterPercentage}%` }} />
                </div>
              </div>

              {/* Calorie goals */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Active Energy Limit</span>
                  <span className="font-mono font-bold text-slate-400">{activityToday.caloriesConsumed} kcal / {user.dailyCalorieGoal} kcal</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${caloriePercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl p-3 flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-300">Keep it up, Alex!</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">You are currently keeping a 5-day streak! Consistency is the number one driver of hypertrophy and metabolic conditioning.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
