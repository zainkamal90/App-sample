/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  User, 
  LogOut, 
  Flame, 
  Clock, 
  Menu, 
  X, 
  ShieldAlert, 
  Database,
  RefreshCw,
  Plus,
  Send,
  Sparkles,
  Info
} from 'lucide-react';

// Domain imports
import { 
  UserProfile, 
  Trainer, 
  Gym, 
  Booking, 
  WorkoutPlan, 
  NutritionPlan, 
  DailyActivity, 
  Message, 
  MeasurementLog,
  PushNotification,
  Exercise,
  Meal
} from './types';

// Mock seed data
import { 
  INITIAL_USER, 
  MOCK_TRAINERS, 
  MOCK_GYMS, 
  DEFAULT_WORKOUT_PLAN, 
  DEFAULT_NUTRITION_PLAN, 
  MOCK_ACTIVITY_HISTORY, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';

// Component imports
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TrainerDiscovery from './components/TrainerDiscovery';
import BookingManager from './components/BookingManager';
import WorkoutNutrition from './components/WorkoutNutrition';
import ProgressTracker from './components/ProgressTracker';
import GymFinder from './components/GymFinder';
import ChatClient from './components/ChatClient';
import VideoConsultationPortal from './components/VideoConsultationPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // --- PERSISTED STATES (Synced with localStorage) ---
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aurafit_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('aurafit_trainers');
    return saved ? JSON.parse(saved) : MOCK_TRAINERS;
  });

  const [gyms] = useState<Gym[]>(MOCK_GYMS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aurafit_bookings');
    if (saved) return JSON.parse(saved);
    // Initial bookings seed
    return [
      {
        id: 'booking_01',
        trainerId: 'trainer_01',
        trainerName: 'Marcus Vance',
        trainerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150',
        specialty: 'Strength',
        date: new Date().toISOString().split('T')[0], // Today
        time: '10:00',
        duration: 30,
        type: 'Video',
        status: 'upcoming',
      }
    ];
  });

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(() => {
    const saved = localStorage.getItem('aurafit_workout_plan');
    return saved ? JSON.parse(saved) : DEFAULT_WORKOUT_PLAN;
  });

  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>(() => {
    const saved = localStorage.getItem('aurafit_nutrition_plan');
    return saved ? JSON.parse(saved) : DEFAULT_NUTRITION_PLAN;
  });

  const [activityHistory, setActivityHistory] = useState<DailyActivity[]>(() => {
    const saved = localStorage.getItem('aurafit_activity_history');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITY_HISTORY;
  });

  const [measurementLogs, setMeasurementLogs] = useState<MeasurementLog[]>(() => {
    const saved = localStorage.getItem('aurafit_measurements');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'm_01', date: '2026-06-15', weight: 81.2 },
      { id: 'm_02', date: '2026-06-22', weight: 80.5 },
      { id: 'm_03', date: '2026-06-29', weight: 79.8 },
      { id: 'm_04', date: '2026-07-06', weight: 79.5 },
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aurafit_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg_01',
        trainerId: 'trainer_01',
        text: 'Hey Alex! How is the compound progressive loading feeling? Let me know if your lower back feels balanced.',
        sender: 'trainer',
        timestamp: '2026-07-06T14:10:00Z',
      },
      {
        id: 'msg_02',
        trainerId: 'trainer_01',
        text: 'Feels solid! Squats are strong but biceps are slightly fatigued.',
        sender: 'user',
        timestamp: '2026-07-06T14:15:00Z',
      },
    ];
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('aurafit_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // --- LOCAL TRANSITIONAL STATES ---
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [activeVideoCallBooking, setActiveVideoCallBooking] = useState<Booking | null>(null);

  // --- TRAINER ROLE CREATION / BUILDER STATES ---
  const [trainerExerciseName, setTrainerExerciseName] = useState('');
  const [trainerExerciseReps, setTrainerExerciseReps] = useState('');
  const [trainerMealName, setTrainerMealName] = useState('');
  const [trainerMealCals, setTrainerMealCals] = useState('');
  const [trainerMealProtein, setTrainerMealProtein] = useState('');
  const [trainerMealType, setTrainerMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');

  // Sync state mutations to localStorage
  useEffect(() => {
    localStorage.setItem('aurafit_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aurafit_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('aurafit_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aurafit_workout_plan', JSON.stringify(workoutPlan));
  }, [workoutPlan]);

  useEffect(() => {
    localStorage.setItem('aurafit_nutrition_plan', JSON.stringify(nutritionPlan));
  }, [nutritionPlan]);

  useEffect(() => {
    localStorage.setItem('aurafit_activity_history', JSON.stringify(activityHistory));
  }, [activityHistory]);

  useEffect(() => {
    localStorage.setItem('aurafit_measurements', JSON.stringify(measurementLogs));
  }, [measurementLogs]);

  useEffect(() => {
    localStorage.setItem('aurafit_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('aurafit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Retrieve today's activity metrics or initialize if missing
  const todayStr = new Date().toISOString().split('T')[0];
  const activityToday = activityHistory.find(h => h.date === todayStr) || {
    date: todayStr,
    steps: 0,
    activeMinutes: 0,
    waterConsumed: 0,
    caloriesConsumed: 0,
  };

  const handleUpdateActivity = (updates: Partial<DailyActivity>) => {
    const nextActivity = { ...activityToday, ...updates };
    const filteredHistory = activityHistory.filter(h => h.date !== todayStr);
    setActivityHistory([...filteredHistory, nextActivity]);
  };

  // --- LOGGING MEAL TOGGLE LINKED TO MAIN PROGRESS ---
  const handleLoggedMealToggle = (mealId: string, logged: boolean, calories: number) => {
    const multiplier = logged ? 1 : -1;
    handleUpdateActivity({
      caloriesConsumed: Math.max(0, activityToday.caloriesConsumed + (calories * multiplier))
    });
  };

  // --- ACTIONS ---
  const handleToggleFavoriteTrainer = (trainerId: string) => {
    const isFav = user.trainerFavorites.includes(trainerId);
    const updatedFavs = isFav 
      ? user.trainerFavorites.filter(id => id !== trainerId)
      : [...user.trainerFavorites, trainerId];
    setUser({ ...user, trainerFavorites: updatedFavs });
  };

  const handleToggleFavoriteGym = (gymId: string) => {
    const isFav = user.gymFavorites.includes(gymId);
    const updatedFavs = isFav 
      ? user.gymFavorites.filter(id => id !== gymId)
      : [...user.gymFavorites, gymId];
    setUser({ ...user, gymFavorites: updatedFavs });
  };

  const handleBookSession = (
    trainer: Trainer, 
    date: string, 
    time: string, 
    type: 'Video' | 'In-Person', 
    duration: number
  ) => {
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: trainer.avatar,
      specialty: trainer.specialty,
      date,
      time,
      duration,
      type,
      status: 'upcoming',
    };

    setBookings([newBooking, ...bookings]);

    // Send push notification
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title: 'Consultation Scheduled!',
      body: `Your consultation with ${trainer.name} on ${date} at ${time} is synced offline.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'booking',
    };
    setNotifications([newNotif, ...notifications]);

    // Redirect to bookings manager
    setActiveTab('bookings');
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    setBookings(updated);

    // Send cancel notification
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title: 'Consultation Cancelled',
      body: 'Your booking status has been successfully updated to cancelled.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'booking',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleRescheduleBooking = (bookingId: string, newDate: string, newTime: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, date: newDate, time: newTime };
      }
      return b;
    });
    setBookings(updated);

    // Send notification
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title: 'Reschedule Sync Done',
      body: `Appointment updated to ${newDate} at ${newTime} successfully.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'booking',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleSendMessage = (trainerId: string, text: string, sender: 'user' | 'trainer') => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      trainerId,
      text,
      sender,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleAddMeasurementLog = (newLog: Omit<MeasurementLog, 'id'>) => {
    const log: MeasurementLog = {
      id: `m_${Date.now()}`,
      ...newLog,
    };
    setMeasurementLogs([log, ...measurementLogs]);
    setUser({ ...user, weight: log.weight }); // Update profile current weight
  };

  // --- TRAINER ACTION BUILDERS ---
  const handleTrainerAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerExerciseName || !trainerExerciseReps) return;

    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      name: trainerExerciseName,
      reps: trainerExerciseReps,
      sets: 3,
      description: 'Custom exercise added directly by your expert coach Marcus Vance during video alignment.',
      completed: false,
    };

    setWorkoutPlan({
      ...workoutPlan,
      exercises: [...workoutPlan.exercises, newEx]
    });

    setTrainerExerciseName('');
    setTrainerExerciseReps('');

    // Send user notification
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title: 'Workout Prescribed!',
      body: `Marcus Vance updated your routines with: ${trainerExerciseName}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'goal',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleTrainerAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerMealName || !trainerMealCals) return;

    const newMeal: Meal = {
      id: `meal_${Date.now()}`,
      type: trainerMealType,
      name: trainerMealName,
      calories: parseInt(trainerMealCals),
      protein: trainerMealProtein ? parseInt(trainerMealProtein) : 25,
      carbs: 35,
      fats: 10,
      logged: false,
    };

    setNutritionPlan({
      ...nutritionPlan,
      meals: [...nutritionPlan.meals, newMeal]
    });

    setTrainerMealName('');
    setTrainerMealCals('');
    setTrainerMealProtein('');

    // Send user notification
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title: 'Meal Plan Prescribed!',
      body: `Marcus Vance added a macro alignment meal: ${trainerMealName}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'goal',
    };
    setNotifications([newNotif, ...notifications]);
  };

  return (
    <div id="applet-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Dynamic Nav bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user.role === 'admin'} />

      {/* Main Container */}
      <main id="main-content" className="flex-1 min-h-screen pb-24 md:pb-6 md:ml-64 flex flex-col">
        
        {/* Top Header / Context Panel */}
        <header id="applet-header" className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold tracking-wide text-slate-200 block md:hidden">AuraFit</span>
            <div className="hidden md:flex items-center space-x-2 bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-slate-850 shadow-inner">
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Client Sync: LocalDB Active</span>
            </div>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center space-x-4">
            
            {/* Multi-role Selector Shortcut */}
            <div className="flex items-center space-x-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-500 font-mono text-[9px] uppercase font-bold pr-1">Role:</span>
              <select
                id="role-swapper"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value as any })}
                className="bg-transparent border-none text-indigo-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="user">Trainee</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Sys Admin</option>
              </select>
            </div>

            {/* Offline Simulator Switch */}
            <button
              id="offline-sim-toggle"
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isOfflineSimulated
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                  : 'bg-slate-950 border-slate-850 text-emerald-400'
              }`}
              title="Toggle offline state simulator"
            >
              {isOfflineSimulated ? <WifiOff className="w-3.5 h-3.5 animate-bounce" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOfflineSimulated ? 'Offline mode' : 'Live Sync'}</span>
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                id="header-notif-bell"
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-850/80 text-slate-400 hover:text-indigo-400 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>

              {/* Notification Center Dropdown */}
              <AnimatePresence>
                {showNotificationCenter && (
                  <motion.div
                    id="notif-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">AuraFit Transits</h4>
                      <button 
                        onClick={() => {
                          const marked = notifications.map(n => ({ ...n, read: true }));
                          setNotifications(marked);
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-1 ${n.read ? 'bg-slate-950/20 opacity-70' : 'bg-slate-950/60 border border-indigo-500/10'}`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200">{n.title}</span>
                              <span className="text-[9px] text-slate-500 font-mono">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{n.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Trigger */}
            <button
              id="header-profile-avatar"
              onClick={() => setShowProfileDrawer(true)}
              className="flex items-center space-x-2 border-2 border-slate-800 hover:border-indigo-500 rounded-2xl p-0.5 transition-all"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Offline Warning Indicator */}
        {isOfflineSimulated && (
          <div id="offline-sim-warning" className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-500 font-mono font-bold flex items-center space-x-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span>Simulating Full Offline Capability: Data transits are securely queue-buffered in LocalDB cache. All metrics, workout logs, and maps sandbox are active.</span>
          </div>
        )}

        {/* Core Screen layouts */}
        <div id="applet-body-content" className="flex-1 p-6 max-w-7xl mx-auto w-full">
          
          {user.role === 'trainer' ? (
            /* --- SPECIAL EXPERT TRAINER MANAGER DASHBOARD --- */
            <div id="trainer-admin-dashboard" className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-indigo-500/10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-indigo-400">Expert Panel Access</span>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-white mt-1">Marcus Vance — Strength Coach Hub</h2>
                  <p className="text-xs text-slate-400 mt-1">Review active clients, prescribe workout exercises, update macro plans, and trigger coaching summaries.</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-2xl px-4 py-2.5 font-mono text-xs">
                  <span className="text-slate-500 block">Assigned Trainees</span>
                  <span className="text-lg font-bold text-slate-200">Alex Johnson (Active)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Exercise prescribing Form */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm lg:col-span-6 space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-slate-800/60">
                    Prescribe Exercise Routine (Alex Johnson)
                  </h3>

                  <form onSubmit={handleTrainerAddExercise} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Exercise Name</label>
                      <input
                        id="prescribe-ex-name"
                        type="text"
                        placeholder="Incline Dumbbell Flyes"
                        required
                        value={trainerExerciseName}
                        onChange={(e) => setTrainerExerciseName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Sets & Reps</label>
                      <input
                        id="prescribe-ex-reps"
                        type="text"
                        placeholder="3 sets x 12 reps"
                        required
                        value={trainerExerciseReps}
                        onChange={(e) => setTrainerExerciseReps(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      Prescribe & Sync Routine
                    </button>
                  </form>
                </div>

                {/* Meals prescribing Form */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm lg:col-span-6 space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-slate-800/60">
                    Prescribe Nutrition meal (Alex Johnson)
                  </h3>

                  <form onSubmit={handleTrainerAddMeal} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Meal Name</label>
                        <input
                          id="prescribe-meal-name"
                          type="text"
                          placeholder="Avocado Beef Toast"
                          required
                          value={trainerMealName}
                          onChange={(e) => setTrainerMealName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Meal Category</label>
                        <select
                          id="prescribe-meal-type"
                          value={trainerMealType}
                          onChange={(e) => setTrainerMealType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                          <option value="Snack">Snack</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Calories (kcal)</label>
                        <input
                          id="prescribe-meal-cals"
                          type="number"
                          placeholder="420"
                          required
                          value={trainerMealCals}
                          onChange={(e) => setTrainerMealCals(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Protein (g)</label>
                        <input
                          id="prescribe-meal-protein"
                          type="number"
                          placeholder="30"
                          value={trainerMealProtein}
                          onChange={(e) => setTrainerMealProtein(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      Prescribe & Sync Nutrition
                    </button>
                  </form>
                </div>

              </div>

              {/* Chat simulator inside trainer dashboard */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-slate-800/60 mb-4">
                  Ongoing alignment chat with Trainee
                </h3>
                <ChatClient 
                  trainers={trainers.filter(t => t.id === 'trainer_01')} 
                  messages={messages} 
                  onSendMessage={handleSendMessage} 
                />
              </div>
            </div>
          ) : user.role === 'admin' && activeTab === 'admin' ? (
            /* --- SYSTEM ADMIN PERFORMANCE METRICS OVERVIEW --- */
            <div id="admin-telemetry-dashboard" className="space-y-6">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
                <h2 className="text-xl font-bold font-display text-white">Sys Admin Metrics Telemetry</h2>
                <p className="text-xs text-slate-400">Observe secure data synchronizations and system storage rates</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Local storage Sync</span>
                  <span className="text-xl font-bold text-slate-200 block mt-1">99.8%</span>
                  <p className="text-[9px] text-slate-500 mt-2">Zero packet transmission drops simulated</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Database Operations</span>
                  <span className="text-xl font-bold text-slate-200 block mt-1">100% ACID</span>
                  <p className="text-[9px] text-slate-500 mt-2">Local state mirroring is safe and offline persistent</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Container latency</span>
                  <span className="text-xl font-bold text-slate-200 block mt-1">12 ms</span>
                  <p className="text-[9px] text-slate-500 mt-2">Highly responsive cloud container execution</p>
                </div>
              </div>
            </div>
          ) : (
            /* --- PRIMARY TRAINEE USER TAB VIEWS --- */
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  user={user} 
                  activityToday={activityToday} 
                  updateActivity={handleUpdateActivity}
                  upcomingBookings={bookings}
                  setActiveTab={setActiveTab}
                  onJoinVideoCall={(b) => setActiveVideoCallBooking(b)}
                />
              )}

              {activeTab === 'trainers' && (
                <TrainerDiscovery 
                  trainers={trainers}
                  favoriteTrainers={user.trainerFavorites}
                  toggleFavorite={handleToggleFavoriteTrainer}
                  onBookSession={handleBookSession}
                  gyms={gyms}
                />
              )}

              {activeTab === 'bookings' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Bookings Manager Column */}
                  <div className="lg:col-span-6 space-y-4">
                    <BookingManager 
                      bookings={bookings}
                      onCancelBooking={handleCancelBooking}
                      onRescheduleBooking={handleRescheduleBooking}
                      onJoinVideoCall={(b) => setActiveVideoCallBooking(b)}
                    />
                  </div>
                  
                  {/* In-App Chat Portal Column on the same page */}
                  <div className="lg:col-span-6 space-y-4">
                    <ChatClient 
                      trainers={trainers} 
                      messages={messages} 
                      onSendMessage={handleSendMessage} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <WorkoutNutrition 
                  workoutPlan={workoutPlan}
                  setWorkoutPlan={setWorkoutPlan}
                  nutritionPlan={nutritionPlan}
                  setNutritionPlan={setNutritionPlan}
                  onLogMeal={(cals) => handleUpdateActivity({ caloriesConsumed: activityToday.caloriesConsumed + cals })}
                  onLoggedMealToggle={handleLoggedMealToggle}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressTracker 
                  activityHistory={activityHistory}
                  measurementLogs={measurementLogs}
                  onAddMeasurement={handleAddMeasurementLog}
                />
              )}

              {activeTab === 'gyms' && (
                <GymFinder 
                  gyms={gyms}
                  trainers={trainers}
                  favoriteGyms={user.gymFavorites}
                  toggleFavoriteGym={handleToggleFavoriteGym}
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* Profile/Measurements Edit Drawer */}
      <AnimatePresence>
        {showProfileDrawer && (
          <motion.div
            id="profile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              id="profile-drawer-modal"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                  <h3 className="text-base font-bold font-display text-white">Trainee Profile Card</h3>
                  <button
                    id="close-profile-drawer"
                    onClick={() => setShowProfileDrawer(false)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-800" />
                  <div>
                    <h4 className="text-base font-bold text-slate-100 font-display">{user.name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[9px] bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold uppercase leading-none">
                      Active Trainee
                    </span>
                  </div>
                </div>

                {/* Profile detail values */}
                <div className="space-y-3.5 bg-slate-950/45 border border-slate-850 p-4 rounded-2xl">
                  <div className="flex justify-between items-baseline text-xs text-slate-400 font-mono">
                    <span>Height</span>
                    <span className="font-bold text-slate-200">{user.height} cm</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-400 font-mono">
                    <span>Current Weight</span>
                    <span className="font-bold text-indigo-400">{user.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-400 font-mono">
                    <span>Target Weight Goal</span>
                    <span className="font-bold text-emerald-400">{user.targetWeight} kg</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-400 font-mono">
                    <span>Daily Step Goal</span>
                    <span className="font-bold text-slate-200">{user.dailyStepGoal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-400 font-mono">
                    <span>Daily Calorie Target</span>
                    <span className="font-bold text-slate-200">{user.dailyCalorieGoal.toLocaleString()} kcal</span>
                  </div>
                </div>

                {/* Favorite trainers list */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">Bookmarked Trainers</label>
                  {user.trainerFavorites.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No trainers bookmarked yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {user.trainerFavorites.map(favId => {
                        const coach = trainers.find(t => t.id === favId);
                        if (!coach) return null;
                        return (
                          <span key={favId} className="inline-flex items-center bg-slate-950 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-300 font-medium">
                            {coach.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-mono flex items-center justify-center space-x-1">
                <Database className="w-3.5 h-3.5 text-slate-600" />
                <span>Encrypted local state</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Video call portal */}
      <AnimatePresence>
        {activeVideoCallBooking && (
          <VideoConsultationPortal 
            booking={activeVideoCallBooking} 
            onClose={() => setActiveVideoCallBooking(null)} 
            onAddMessage={handleSendMessage}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
