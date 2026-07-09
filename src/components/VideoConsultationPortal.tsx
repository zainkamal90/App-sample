/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Sparkles, 
  X, 
  User, 
  Award, 
  FileText,
  Clock,
  Volume2
} from 'lucide-react';
import { Booking } from '../types';

interface VideoConsultationPortalProps {
  booking: Booking;
  onClose: () => void;
  onAddMessage: (trainerId: string, text: string, sender: 'user' | 'trainer') => void;
}

export default function VideoConsultationPortal({ 
  booking, 
  onClose,
  onAddMessage
}: VideoConsultationPortalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // AI Assistant session summaries states
  const [aiNoteText, setAiNoteText] = useState('Consultation initiated. AI is listening to provide automated summaries of compound structures, sets/reps, and macro advice...');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Local user camera stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Format call stopwatch time
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request actual camera access (Optional and graceful fallback)
  useEffect(() => {
    if (!isVideoOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access blocked/unsupported in iframe. Utilizing video simulator fallback.', err);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOff]);

  const handleEndCall = () => {
    // Gracefully stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Add completed message context to chat client
    onAddMessage(
      booking.trainerId,
      `[Video Session Summary]: Completed 30m consultation. Focused on squat depth mechanics, posture alignment, and precision calorie-deficit planning. Good job today, Alex!`,
      'trainer'
    );

    onClose();
  };

  const handleTriggerAISummary = () => {
    setIsGeneratingNote(true);
    setAiNoteText('Analyzing biomechanics and verbal triggers via Gemini Audio Pipeline...');
    
    setTimeout(() => {
      setIsGeneratingNote(false);
      let summary = "1. Squat Stance: Adjust heels slightly wider, toes turned out 15 degrees to allow better hip socket mobilization.\n" +
                    "2. Rest intervals: Keep full 90 seconds between compound working sets to optimize glycogen replenishment.\n" +
                    "3. Post-workout nutrition: Fuel with 35g Whey protein isolates paired with 50g simple carbs within 45 mins of training.";
      
      if (booking.specialty.includes('Yoga')) {
        summary = "1. Alignment: Deepen the stance in Warrior II, keeping front knee stacked precisely over ankle.\n" +
                  "2. Respiratory loop: Breathe via nasal passages (4s inhale, 6s exhale) to align focus and parasympathetic nervous activation.\n" +
                  "3. Routine: 10 mins child's pose and dynamic cat-cow before sleeping to mobilize vertebral spacing.";
      }

      setAiNoteText(summary);
    }, 2000);
  };

  const formatSecs = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col md:flex-row h-screen overflow-hidden text-slate-100 font-sans">
      
      {/* Left Frame: Video stream and layouts */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center">
        
        {/* Main Stream (Trainer video simulation) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={booking.trainerAvatar} 
            alt={booking.trainerName} 
            className="w-full h-full object-cover opacity-35 blur-sm scale-105 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
          
          {/* Animated trainer avatar simulator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <img 
                src={booking.trainerAvatar} 
                alt={booking.trainerName} 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-indigo-500 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl text-white shadow-lg animate-bounce">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold font-display text-white">{booking.trainerName}</h3>
              <p className="text-xs text-indigo-400 font-mono font-medium tracking-wide">Onsite Specialist: {booking.specialty}</p>
            </div>
          </div>
        </div>

        {/* Small PIP Local User Camera stream */}
        <div className="absolute bottom-24 right-5 w-40 h-52 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10">
          {isVideoOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
              <VideoOff className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-mono">Camera Off</span>
            </div>
          ) : stream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]" 
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-indigo-400">
              <div className="relative">
                <User className="w-8 h-8 opacity-60" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono mt-2 text-slate-400">Iframe Camera Sim</span>
            </div>
          )}
        </div>

        {/* Top metadata info overlay */}
        <div className="absolute top-5 left-5 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2 flex items-center space-x-3 z-10 shadow-lg">
          <div className="bg-rose-500 w-2 h-2 rounded-full animate-pulse" />
          <div className="text-xs">
            <span className="font-bold block">Live Consultation</span>
            <span className="text-[10px] text-slate-400 font-mono">Duration: {formatSecs(callDuration)}</span>
          </div>
        </div>

        {/* Call control action deck overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-2xl px-5 py-3.5 flex items-center space-x-4 z-10 shadow-xl">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl transition-all ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-xl transition-all ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
          </button>
          <div className="h-6 w-[1px] bg-slate-800" />
          <button
            id="end-call-btn"
            onClick={handleEndCall}
            className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/20 transition-colors"
          >
            <PhoneOff className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Right Side: Gemini-powered dynamic session notes summary */}
      <div className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-850 flex flex-col h-[320px] md:h-full z-10 shadow-2xl">
        <div className="p-4 border-b border-slate-850 bg-slate-900/40 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">Gemini Live Notes</h3>
          </div>
          <button
            id="trigger-ai-summary-btn"
            onClick={handleTriggerAISummary}
            disabled={isGeneratingNote}
            className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-mono font-bold text-[9px] rounded-lg transition-all"
          >
            {isGeneratingNote ? 'Synthesizing...' : 'Summarize'}
          </button>
        </div>

        {/* Dynamic summarizer output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-850/80">
            <p className="text-xs text-indigo-300 font-bold flex items-center space-x-1.5 mb-1.5 font-mono">
              <FileText className="w-3.5 h-3.5" />
              <span>Coaching Action Plan</span>
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {aiNoteText}
            </p>
          </div>
        </div>

        {/* Drawer footer info */}
        <div className="p-4 border-t border-slate-850 bg-slate-900/10 flex items-center justify-between text-[10px] text-slate-500 font-mono shrink-0">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>AI Listening...</span>
          </div>
          <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[9px]">Server-Safe</span>
        </div>
      </div>

    </div>
  );
}
