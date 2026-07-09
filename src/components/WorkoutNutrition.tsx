/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  CheckCircle, 
  Dumbbell, 
  Apple, 
  Calculator, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  TrendingUp, 
  Clock, 
  Check, 
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { WorkoutPlan, NutritionPlan, Meal, Exercise } from '../types';

interface WorkoutNutritionProps {
  workoutPlan: WorkoutPlan;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<WorkoutPlan>>;
  nutritionPlan: NutritionPlan;
  setNutritionPlan: React.Dispatch<React.SetStateAction<NutritionPlan>>;
  onLogMeal: (calories: number) => void;
  onLoggedMealToggle: (mealId: string, logged: boolean, calories: number) => void;
}

export default function WorkoutNutrition({ 
  workoutPlan, 
  setWorkoutPlan, 
  nutritionPlan, 
  setNutritionPlan, 
  onLogMeal,
  onLoggedMealToggle
}: WorkoutNutritionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'workouts' | 'nutrition' | 'bmi'>('workouts');

  // Workout Timer States
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 minute default rest timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState(120);

  // BMI States
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(72); // kg
  const [bmi, setBmi] = useState(23.5);
  const [bmiCategory, setBmiCategory] = useState<'Underweight' | 'Normal' | 'Overweight' | 'Obese'>('Normal');

  // Handle BMI updates
  useEffect(() => {
    const heightInMeters = height / 100;
    const computedBmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    setBmi(computedBmi);

    if (computedBmi < 18.5) {
      setBmiCategory('Underweight');
    } else if (computedBmi >= 18.5 && computedBmi < 25) {
      setBmiCategory('Normal');
    } else if (computedBmi >= 25 && computedBmi < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  }, [height, weight]);

  // Rest Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      // Optional sound notification trigger can go here
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleExercise = (exId: string) => {
    const updatedExercises = workoutPlan.exercises.map(ex => {
      if (ex.id === exId) {
        return { ...ex, completed: !ex.completed };
      }
      return ex;
    });
    setWorkoutPlan({ ...workoutPlan, exercises: updatedExercises });
  };

  const toggleMealLog = (meal: Meal) => {
    const nextLoggedState = !meal.logged;
    const updatedMeals = nutritionPlan.meals.map(m => {
      if (m.id === meal.id) {
        return { ...m, logged: nextLoggedState };
      }
      return m;
    });
    setNutritionPlan({ ...nutritionPlan, meals: updatedMeals });
    onLoggedMealToggle(meal.id, nextLoggedState, meal.calories);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBmiCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Underweight': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Normal': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Overweight': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Obese': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400';
    }
  };

  const getBmiAdvice = (cat: string) => {
    switch (cat) {
      case 'Underweight': return 'Focus on muscle hypertrophy conditioning and surplus macro plans (increase carbs & protein intake by 15-20%). compound lifts are highly recommended.';
      case 'Normal': return 'Incredible conditioning! Your current metrics are in the elite tier. Maintain high protein and keep progressive lifting schedules to stimulate tissue rebuilding.';
      case 'Overweight': return 'Aim for mild caloric deficit (200-300 kcal under metabolic rate) paired with Zone 2 cardiovascular running & resistance lifting twice weekly.';
      case 'Obese': return 'Prioritize daily light mobility walking, joints-focused stretches, and low glycemic nutrition plans. consult our Rehab or Strength coaches to start safely.';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      
      {/* Sub tabs Row */}
      <div className="flex border-b border-slate-800/80">
        <button
          id="subtab-workouts-btn"
          onClick={() => setActiveSubTab('workouts')}
          className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeSubTab === 'workouts'
              ? 'border-indigo-500 text-indigo-400 font-display'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Workouts</span>
        </button>
        <button
          id="subtab-nutrition-btn"
          onClick={() => setActiveSubTab('nutrition')}
          className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeSubTab === 'nutrition'
              ? 'border-indigo-500 text-indigo-400 font-display'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Nutrition</span>
        </button>
        <button
          id="subtab-bmi-btn"
          onClick={() => setActiveSubTab('bmi')}
          className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeSubTab === 'bmi'
              ? 'border-indigo-500 text-indigo-400 font-display'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>BMI Calculator</span>
        </button>
      </div>

      {/* Panels rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workouts Plan Panel */}
        {activeSubTab === 'workouts' && (
          <>
            {/* Exercises List left side */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">{workoutPlan.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{workoutPlan.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/15 text-indigo-400">
                    {workoutPlan.difficulty}
                  </span>
                </div>
              </div>

              {/* Individual Exercises */}
              <div className="space-y-3">
                {workoutPlan.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    id={`exercise-row-${ex.id}`}
                    onClick={() => toggleExercise(ex.id)}
                    className={`p-4 bg-slate-900 border rounded-2xl flex items-start justify-between gap-4 cursor-pointer hover:border-indigo-500/10 transition-all ${
                      ex.completed ? 'border-indigo-500/15 opacity-60' : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* Checkbox */}
                      <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        ex.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {ex.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold text-slate-100 ${ex.completed ? 'line-through text-slate-500' : ''}`}>
                          {ex.name}
                        </h4>
                        <p className="text-xs text-indigo-400 font-semibold font-mono mt-0.5">{ex.reps}</p>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{ex.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Rest Timer right side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400 mb-3">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 font-display">Inter-set Rest Timer</h4>
                <p className="text-xs text-slate-500 mt-0.5">Optimize glycogen synthesis with structured rest loops</p>

                {/* Big Timer display */}
                <div className="text-5xl font-mono font-bold text-slate-100 my-6 tracking-wider">
                  {formatTime(timerSeconds)}
                </div>

                {/* Controls row */}
                <div className="flex items-center space-x-3 w-full max-w-[240px] bg-transparent">
                  <button
                    id="timer-reset-btn"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(timerInput);
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors flex-1 flex justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    id="timer-toggle-btn"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex-[2] flex justify-center font-bold text-xs items-center space-x-1.5"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </button>
                </div>

                {/* Set duration quick tabs */}
                <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                  {[60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      id={`timer-set-${sec}`}
                      onClick={() => {
                        setTimerInput(sec);
                        setTimerSeconds(sec);
                        setIsTimerRunning(false);
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-mono font-bold border ${
                        timerInput === sec
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                          : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sec}s ({sec / 60}m)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Nutrition Plan Panel */}
        {activeSubTab === 'nutrition' && (
          <>
            {/* Meals tracking left side */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-bold font-display text-white">{nutritionPlan.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Check meal cards below as you consume them to log macros automatically.</p>
              </div>

              {/* Individual Meals row */}
              <div className="space-y-3">
                {nutritionPlan.meals.map((meal) => (
                  <div
                    key={meal.id}
                    id={`meal-row-${meal.id}`}
                    onClick={() => toggleMealLog(meal)}
                    className={`p-4 bg-slate-900 border rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/10 transition-all ${
                      meal.logged ? 'border-indigo-500/15 opacity-65' : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* Custom checkbox */}
                      <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        meal.logged ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {meal.logged && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-bold text-slate-100 ${meal.logged ? 'line-through text-slate-500' : ''}`}>
                            {meal.name}
                          </h4>
                        </div>
                        <span className="text-[10px] bg-slate-950 text-slate-400 font-bold px-2 py-0.5 rounded border border-slate-800/80 inline-block mt-1 font-mono">
                          {meal.type}
                        </span>
                        
                        {/* Macro stats */}
                        <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono font-semibold mt-2">
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fats}g</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-slate-200 block">{meal.calories}</span>
                      <span className="text-[10px] text-slate-500 leading-none">kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro Goals summaries right side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-200 font-display flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Macronutrient Splits</span>
                </h4>

                <div className="space-y-3.5">
                  {/* Protein */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                      <span className="text-slate-400">Protein (Tissue rebuild)</span>
                      <span className="font-bold text-slate-200">
                        {nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.protein, 0)}g / {nutritionPlan.proteinGoal}g
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full" 
                        style={{ width: `${Math.min(100, (nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.protein, 0) / nutritionPlan.proteinGoal) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                      <span className="text-slate-400">Carbohydrates (Glycogen)</span>
                      <span className="font-bold text-slate-200">
                        {nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.carbs, 0)}g / {nutritionPlan.carbsGoal}g
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${Math.min(100, (nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.carbs, 0) / nutritionPlan.carbsGoal) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Fats */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                      <span className="text-slate-400">Fats (Hormonal alignment)</span>
                      <span className="font-bold text-slate-200">
                        {nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.fats, 0)}g / {nutritionPlan.fatsGoal}g
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 rounded-full" 
                        style={{ width: `${Math.min(100, (nutritionPlan.meals.filter(m => m.logged).reduce((acc, m) => acc + m.fats, 0) / nutritionPlan.fatsGoal) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* BMI Calculator Panel */}
        {activeSubTab === 'bmi' && (
          <div className="lg:col-span-12 max-w-2xl mx-auto w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-6">
            <div className="text-center space-y-1.5 pb-4 border-b border-slate-800/60">
              <h3 className="text-xl font-bold font-display text-white">Interactive BMI Calculator</h3>
              <p className="text-xs text-slate-400">Quick metabolic analysis of health and body index categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Sliders on Left */}
              <div className="space-y-5">
                {/* Height slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wide">Height</span>
                    <span className="font-mono font-bold text-indigo-400 text-sm">{height} cm</span>
                  </div>
                  <input
                    id="bmi-height-slider"
                    type="range"
                    min="120"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Weight slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wide">Weight</span>
                    <span className="font-mono font-bold text-indigo-400 text-sm">{weight} kg</span>
                  </div>
                  <input
                    id="bmi-weight-slider"
                    type="range"
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Display score on Right */}
              <div className="p-5 bg-slate-950/45 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Computed Score</span>
                <div className="text-5xl font-mono font-bold text-white tracking-tight">
                  {bmi}
                </div>

                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getBmiCategoryColor(bmiCategory)}`}>
                  {bmiCategory}
                </span>

                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-[11px] text-slate-400 leading-relaxed font-sans max-w-sm mt-2">
                  {getBmiAdvice(bmiCategory)}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
