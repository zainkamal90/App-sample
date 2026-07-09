/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  MessageSquare, 
  CheckCheck, 
  Video, 
  Camera, 
  Mic, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Trainer, Message } from '../types';

interface ChatClientProps {
  trainers: Trainer[];
  messages: Message[];
  onSendMessage: (trainerId: string, text: string, sender: 'user' | 'trainer') => void;
  onJoinVideoCall?: (bookingId: string) => void;
}

export default function ChatClient({ 
  trainers, 
  messages, 
  onSendMessage 
}: ChatClientProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer>(trainers[0]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current trainer
  const conversation = messages.filter(
    (m) => m.trainerId === selectedTrainer.id
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    // Send user message
    onSendMessage(selectedTrainer.id, textToSend, 'user');

    // Trigger simulated trainer typing and smart response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "That sounds great! Let's stay focused on the compound lifts. Make sure you complete your rest timers.";
      
      if (selectedTrainer.specialty.includes('Strength')) {
        replyText = `Excellent effort on those compound sets, Alex! Remember to keep your abdominal bracing intense on the final reps. Let's look at loading up 5% next week if your eccentric control is pristine.`;
      } else if (selectedTrainer.specialty.includes('Yoga')) {
        replyText = `Namaste Alex. Focus on deep diaphragmatic nasal breathing during the holds today. Your spinal mobility is progressing beautifully. Let me know if you need any adjustments on the child's pose.`;
      } else if (selectedTrainer.specialty.includes('Cardio')) {
        replyText = `Fantastic cardiovascular effort! Keep your heart rate locked in zone 2 during tomorrow's HIIT interval rest phases. Drink plenty of water and log your recovery logs!`;
      } else if (selectedTrainer.specialty.includes('Rehab')) {
        replyText = `Hi Alex, please avoid loading any joint if you feel any acute pressure. Focus purely on joint mobilization and foam rolling tonight. Let me know if the morning stiffness decreases.`;
      }

      onSendMessage(selectedTrainer.id, replyText, 'trainer');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-0 h-[560px] flex overflow-hidden shadow-xl">
      
      {/* Sidebar: Trainer Contacts List */}
      <div className="w-1/3 border-r border-slate-800/80 flex flex-col h-full bg-slate-950/25">
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/10">
          <h3 className="text-sm font-bold text-slate-200 font-display">In-App Chat Messages</h3>
          <p className="text-[10px] text-slate-500 font-mono">Expert Coach Transits</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {trainers.map((trainer) => {
            const isSelected = selectedTrainer.id === trainer.id;
            const lastMsg = messages
              .filter((m) => m.trainerId === trainer.id)
              .slice(-1)[0];

            return (
              <div
                key={trainer.id}
                id={`chat-contact-${trainer.id}`}
                onClick={() => setSelectedTrainer(trainer)}
                className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-600/10' : 'hover:bg-slate-850/40'
                }`}
              >
                <img 
                  src={trainer.avatar} 
                  alt={trainer.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {trainer.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5 font-sans">
                    {lastMsg ? lastMsg.text : 'Start a chat session...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation panel */}
      <div className="flex-1 flex flex-col h-full bg-slate-900">
        
        {/* Chat Area Header */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/15 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <img 
              src={selectedTrainer.avatar} 
              alt={selectedTrainer.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-100">{selectedTrainer.name}</h3>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active consultation session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Flow Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {conversation.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/5' 
                    : 'bg-slate-950/60 text-slate-300 rounded-bl-none border border-slate-850'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center space-x-1 justify-end mt-1.5 text-[9px] font-mono ${
                    isMe ? 'text-indigo-300' : 'text-slate-500'
                  }`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex justify-start"
              >
                <div className="bg-slate-950/45 rounded-2xl p-3 border border-slate-850 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input box form */}
        <form onSubmit={handleSend} className="p-3.5 bg-slate-950/20 border-t border-slate-800/60 flex items-center space-x-2 shrink-0">
          <input
            id="chat-input"
            type="text"
            placeholder={`Message ${selectedTrainer.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
