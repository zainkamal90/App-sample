/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  LineChart as ChartIcon, 
  Plus, 
  Calendar, 
  Scale, 
  Percent, 
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { DailyActivity, MeasurementLog } from '../types';

interface ProgressTrackerProps {
  activityHistory: DailyActivity[];
  measurementLogs: MeasurementLog[];
  onAddMeasurement: (newLog: Omit<MeasurementLog, 'id'>) => void;
}

export default function ProgressTracker({ 
  activityHistory, 
  measurementLogs, 
  onAddMeasurement 
}: ProgressTrackerProps) {
  // New log form states
  const [logWeight, setLogWeight] = useState('');
  const [logWaist, setLogWaist] = useState('');
  const [logHips, setLogHips] = useState('');
  const [logChest, setLogChest] = useState('');
  const [logBiceps, setLogBiceps] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  // Form submit handler
  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logWeight) return;

    onAddMeasurement({
      date: logDate,
      weight: parseFloat(logWeight),
      waist: logWaist ? parseFloat(logWaist) : undefined,
      hips: logHips ? parseFloat(logHips) : undefined,
      chest: logChest ? parseFloat(logChest) : undefined,
      biceps: logBiceps ? parseFloat(logBiceps) : undefined,
    });

    // Reset inputs
    setLogWeight('');
    setLogWaist('');
    setLogHips('');
    setLogChest('');
    setLogBiceps('');
  };

  // Sort logs by date for charting
  const sortedLogs = [...measurementLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare weight data for line chart
  const weightChartData = sortedLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: log.weight,
  }));

  // Prepare active minutes / calorie data from activity history
  const sortedActivity = [...activityHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const activityChartData = sortedActivity.map(act => ({
    date: new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: act.steps,
    calories: act.caloriesConsumed,
  }));

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progression Chart */}
        <div className="bg-slate-900 border border-slate-800/85 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
            <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              <span>Weight Recomposition History</span>
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">kg</span>
          </div>

          <div className="h-64 w-full">
            {weightChartData.length < 2 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Info className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Add at least two measurement logs to generate your weight progress timeline.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Steps / Calories activity Chart */}
        <div className="bg-slate-900 border border-slate-800/85 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
            <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <ChartIcon className="w-5 h-5 text-indigo-400" />
              <span>Daily Activity & Calorie Track</span>
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Steps vs Kcal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={10} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" name="Steps" dataKey="steps" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                <Line yAxisId="right" type="monotone" name="Calorie Intake" dataKey="calories" stroke="#f43f5e" strokeWidth={2} dot={{ fill: '#f43f5e', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid of Logger form and past logs list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Logs Form panel */}
        <div className="bg-slate-900 border border-slate-800/85 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <form id="measurement-log-form" onSubmit={handleSubmitLog} className="space-y-4">
            <h3 className="text-base font-bold font-display text-white pb-2 border-b border-slate-800/60">
              Log Measurements
            </h3>

            {/* Form input controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Log Date</label>
                <input
                  id="log-date"
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Weight (kg) *</label>
                <input
                  id="log-weight"
                  type="number"
                  step="0.1"
                  required
                  placeholder="78.2"
                  value={logWeight}
                  onChange={(e) => setLogWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Waist (cm)</label>
                <input
                  id="log-waist"
                  type="number"
                  placeholder="82"
                  value={logWaist}
                  onChange={(e) => setLogWaist(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Hips (cm)</label>
                <input
                  id="log-hips"
                  type="number"
                  placeholder="96"
                  value={logHips}
                  onChange={(e) => setLogHips(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Chest (cm)</label>
                <input
                  id="log-chest"
                  type="number"
                  placeholder="104"
                  value={logChest}
                  onChange={(e) => setLogChest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-center"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Biceps (cm)</label>
              <input
                id="log-biceps"
                type="number"
                placeholder="36.5"
                value={logBiceps}
                onChange={(e) => setLogBiceps(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Entry to Logs</span>
              </button>
            </div>
          </form>
        </div>

        {/* Logs List panel */}
        <div className="bg-slate-900 border border-slate-800/85 rounded-2xl p-5 shadow-sm lg:col-span-7">
          <h3 className="text-base font-bold font-display text-white pb-2 border-b border-slate-800/60 mb-4">
            Measurement Logs history
          </h3>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {[...measurementLogs]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-950/20 border border-slate-850 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{log.weight} kg</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{log.date}</span>
                    </div>
                  </div>

                  {/* Body tape measurements indicators */}
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400">
                    {log.waist && (
                      <span className="flex flex-col items-center">
                        <span className="text-slate-500 uppercase tracking-wider font-semibold text-[8px]">Waist</span>
                        <span className="text-slate-300 font-bold">{log.waist}cm</span>
                      </span>
                    )}
                    {log.chest && (
                      <span className="flex flex-col items-center">
                        <span className="text-slate-500 uppercase tracking-wider font-semibold text-[8px]">Chest</span>
                        <span className="text-slate-300 font-bold">{log.chest}cm</span>
                      </span>
                    )}
                    {log.biceps && (
                      <span className="flex flex-col items-center">
                        <span className="text-slate-500 uppercase tracking-wider font-semibold text-[8px]">Arm</span>
                        <span className="text-slate-300 font-bold">{log.biceps}cm</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}
