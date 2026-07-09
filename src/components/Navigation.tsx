/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Users, Calendar, Dumbbell, LineChart, Map, Shield } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export default function Navigation({ activeTab, setActiveTab, isAdmin }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'trainers', label: 'Trainers', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'plans', label: 'Plans', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'gyms', label: 'Gyms', icon: Map },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <>
      {/* Bottom Navigation for Mobile (md:hidden) */}
      <nav id="mobile-nav" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 md:hidden shadow-lg shadow-black/40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-250 relative group"
              >
                {/* Active Indicator Background Pill (Material 3 style) */}
                <div
                  className={`absolute inset-x-3 top-1 bottom-6 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-indigo-500/15 scale-100' : 'scale-75 opacity-0 group-hover:scale-90 group-hover:opacity-40 bg-slate-800'
                  }`}
                />
                <Icon
                  className={`w-5 h-5 z-10 transition-colors duration-250 ${
                    isActive ? 'text-indigo-400 stroke-[2.5px]' : 'text-slate-400 stroke-[2px] group-hover:text-slate-300'
                  }`}
                />
                <span
                  className={`text-[10px] z-10 mt-1.5 font-medium transition-colors duration-250 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Navigation for Desktop (md:flex) */}
      <aside id="desktop-sidebar" className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800/80 min-h-screen p-5 fixed left-0 top-0 text-slate-100 shadow-xl shadow-black/10 z-30">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AuraFit
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 font-mono">
              Expert Consultations
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition-all duration-250 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/10 to-indigo-500/5 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-300 hover:bg-slate-800/40 hover:text-white border border-transparent'
                }`}
              >
                {/* Active Indicator Line (Material 3 style) */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-md" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'text-indigo-400 stroke-[2.5px]' : 'text-slate-400 stroke-[2px] group-hover:text-slate-200'
                  }`}
                />
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 pt-4 px-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local DB Synchronized</span>
          </div>
        </div>
      </aside>
    </>
  );
}
