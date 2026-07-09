/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  dailyStepGoal: number;
  dailyCalorieGoal: number;
  waterGoal: number; // in ml
  streak: number;
  role: 'user' | 'admin';
  trainerFavorites: string[]; // trainer IDs
  gymFavorites: string[]; // gym IDs
}

export interface Review {
  id: string;
  trainerId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  specialty: 'Strength' | 'Yoga & Mindfulness' | 'Cardio & HIIT' | 'Rehab & Mobility';
  level: 'Pro' | 'Elite' | 'Master';
  rate: number; // per hour in USD
  certs: string[];
  availability: string[]; // e.g. ["09:00", "10:00", "14:00", "16:00"]
  reviews: Review[];
  gymId: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  type: 'Video' | 'In-Person';
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentId?: string;
  amount?: number;
  videoRoomId?: string;
}

export interface Exercise {
  id: string;
  name: string;
  reps: string;
  sets: number;
  videoUrl?: string;
  description: string;
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  durationWeeks: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  logged: boolean;
}

export interface NutritionPlan {
  id: string;
  title: string;
  targetCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  meals: Meal[];
}

export interface Message {
  id: string;
  senderId?: string; // 'user' or trainerId
  trainerId: string;
  sender: 'user' | 'trainer';
  text: string;
  timestamp: string; // ISO String
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  facilities: string[];
  trainers: string[]; // Trainer IDs
  distance: string; // e.g., "1.2 miles"
  imageUrl: string;
}

export interface MeasurementLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  waist?: number; // cm
  hips?: number; // cm
  chest?: number; // cm
  biceps?: number; // cm
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  steps: number;
  activeMinutes: number;
  waterConsumed: number; // ml
  caloriesConsumed: number;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'chat' | 'goal' | 'system';
}
