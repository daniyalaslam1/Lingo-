/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, Difficulty, LessonContent, FeedbackResponse } from './types';
import { GeminiService } from './services/gemini';

type AppState = 'select-language' | 'dashboard' | 'lesson' | 'tutor';

export default function App() {
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [level, setLevel] = useState<Difficulty>('Beginner');
  const [currentView, setCurrentView] = useState<AppState>('select-language');
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);

  // Handle language selection
  const handleSelectLanguage = (lang: Language) => {
    setTargetLanguage(lang);
    setCurrentView('dashboard');
  };

  // Start a new lesson
  const startLesson = async () => {
    if (!targetLanguage) return;
    setIsLoading(true);
    try {
      const lesson = await GeminiService.generateLesson(targetLanguage, level);
      setCurrentLesson(lesson);
      setCurrentView('lesson');
    } catch (error) {
      console.error('Failed to generate lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-natural-bg font-sans selection:bg-natural-sage/20 selection:text-natural-text">
      <nav className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-natural-sage rounded-xl flex items-center justify-center shadow-sm">
            <Languages className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-natural-text italic font-serif">Linguo</span>
        </div>
        
        {targetLanguage && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-natural-sidebar border border-natural-border">
              <span className="text-sm font-medium text-natural-text-sub">{targetLanguage.flag} {targetLanguage.name}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-natural-card border border-natural-border">
              <Trophy className="text-natural-terracotta" size={16} />
              <span className="text-sm font-semibold text-natural-text">{score} XP</span>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {currentView === 'select-language' && (
            <motion.div
              key="select-language"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-natural-text">Choose your next adventure</h1>
                <p className="text-natural-text-sub text-lg">Pick a language and start your personalized learning journey today.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectLanguage(lang)}
                    className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-natural-card border border-natural-border shadow-sm transition-shadow hover:shadow-md group"
                  >
                    <span className="text-5xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <span className="font-semibold text-natural-text">{lang.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'dashboard' && targetLanguage && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-natural-text">Welcome back!</h2>
                  <p className="text-natural-text-sub">Ready to master {targetLanguage.name} today?</p>
                </div>
                <div className="flex gap-2 p-1 bg-natural-sidebar rounded-xl inline-flex self-start border border-natural-border">
                  {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setLevel(d)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        level === d ? 'bg-natural-card text-natural-sage shadow-sm' : 'text-natural-text-sub hover:text-natural-text'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ y: -8 }}
                  className="lesson-card group cursor-pointer"
                  onClick={startLesson}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-natural-sidebar rounded-2xl flex items-center justify-center text-natural-sage group-hover:bg-natural-sage group-hover:text-white transition-colors border border-natural-border">
                        <BookOpen size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-natural-text">Daily Lesson</h3>
                        <p className="text-natural-text-sub">AI-powered interactive grammar and vocabulary exercise.</p>
                      </div>
                    </div>
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <AlertCircle className="text-natural-sage opacity-50" />
                      </motion.div>
                    )}
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-natural-sage font-semibold group-hover:gap-4 transition-all">
                    <span>Start Learning</span>
                    <ChevronRight size={20} />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -8 }}
                  className="lesson-card group cursor-pointer"
                  onClick={() => setCurrentView('tutor')}
                >
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-natural-sidebar rounded-2xl flex items-center justify-center text-natural-terracotta group-hover:bg-natural-terracotta group-hover:text-white transition-colors border border-natural-border">
                      <MessageSquare size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-natural-text">AI Tutor Chat</h3>
                      <p className="text-natural-text-sub">Practice real conversations and get instant grammar feedback.</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-natural-terracotta font-semibold group-hover:gap-4 transition-all">
                    <span>Practise Speaking</span>
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentView === 'lesson' && currentLesson && (
            <LessonView 
              lesson={currentLesson} 
              onComplete={(xp) => {
                setScore(s => s + xp);
                setCurrentView('dashboard');
              }}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'tutor' && targetLanguage && (
            <TutorView 
              targetLanguage={targetLanguage} 
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LessonView({ lesson, onComplete, onBack }: { lesson: LessonContent, onComplete: (xp: number) => void, onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const isCorrect = selectedOption === lesson.quiz.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-natural-text-sub hover:text-natural-text transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      <div className="lesson-card">
        <div className="flex items-center gap-3 mb-8">
          <span className="px-3 py-1 rounded-full bg-natural-sidebar text-natural-sage text-xs font-bold uppercase tracking-wider border border-natural-border">
            {lesson.type}
          </span>
          <h1 className="text-3xl font-bold text-natural-text">{lesson.title}</h1>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-2xl bg-natural-sidebar/30 border border-natural-border">
            <h3 className="text-xl font-bold mb-2 text-natural-text">{lesson.content}</h3>
            {lesson.translation && <p className="text-natural-text-sub italic">"{lesson.translation}"</p>}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-natural-text">Usage Examples:</h4>
            <div className="space-y-2">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-natural-bg border border-natural-border">
                   <div className="w-6 h-6 rounded-full bg-natural-sidebar flex items-center justify-center text-xs text-natural-text-sub font-mono">
                     {i + 1}
                   </div>
                   <p className="text-natural-text">{ex}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-natural-border">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-natural-text">
               <Sparkles className="text-natural-sage" size={20} />
               Quick Check
            </h4>
            <div className="space-y-4">
              <p className="text-lg text-natural-text font-medium">{lesson.quiz.question}</p>
              <div className="grid gap-3">
                {lesson.quiz.options.map((opt) => (
                  <button
                    key={opt}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(opt)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      selectedOption === opt 
                        ? 'border-natural-sage bg-natural-sidebar/50' 
                        : 'border-natural-border hover:border-natural-sage/20'
                    } ${isSubmitted ? 'cursor-not-allowed opacity-75' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 h-24">
              <AnimatePresence>
                {!isSubmitted ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedOption}
                    onClick={handleSubmit}
                    className="w-full natural-button-primary py-4 text-base"
                  >
                    Check Answer
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 ${
                      isCorrect ? 'bg-natural-sidebar/50 border border-natural-sage/30' : 'bg-orange-50 border border-natural-terracotta/30'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {isCorrect ? (
                        <CheckCircle2 className="text-natural-sage shrink-0" size={24} />
                      ) : (
                        <AlertCircle className="text-natural-terracotta shrink-0" size={24} />
                      )}
                      <div>
                        <p className={`font-bold ${isCorrect ? 'text-natural-text' : 'text-natural-terracotta'}`}>
                          {isCorrect ? 'Perfect!' : 'Not quite right'}
                        </p>
                        <p className={`text-sm text-natural-text-sub`}>
                          {lesson.quiz.explanation}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onComplete(isCorrect ? 10 : 2)}
                      className={`px-8 py-3 rounded-xl text-white font-bold shadow-sm ${
                        isCorrect ? 'bg-natural-sage hover:bg-natural-sage/90' : 'bg-natural-text hover:bg-natural-text/90'
                      }`}
                    >
                      {isCorrect ? 'Collect 10 XP' : 'Continue'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TutorView({ targetLanguage, onBack }: { targetLanguage: Language, onBack: () => void }) {
  const [messages, setMessages] = useState<{role: 'user' | 'tutor', content: string, feedback?: FeedbackResponse}[]>([
    { role: 'tutor', content: `Hello! I'm your ${targetLanguage.name} tutor. How are you today? Try answering in ${targetLanguage.name}.` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsThinking(true);

    try {
      const feedback = await GeminiService.getFeedback(userMsg, messages[messages.length-1].content, targetLanguage);
      
      // Add a small delay for natural feeling
      setTimeout(() => {
        setMessages(prev => [
          ...prev.slice(0, -1), 
          { role: 'user', content: userMsg, feedback },
          { role: 'tutor', content: isThinking ? "Thinking..." : "Great! How about we try another sentence?" } 
        ]);
        // Update tutor content response properly
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = feedback.isCorrect 
            ? `That's correct! You're doing great. What else would you like to talk about?`
            : `I see what you mean, but in ${targetLanguage.name} it's better to say: "${feedback.correction}".`;
          return newMessages;
        });
        setIsThinking(false);
      }, 500);

    } catch (error) {
      console.error(error);
      setIsThinking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-[calc(100vh-200px)] flex flex-col gap-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-natural-text-sub hover:text-natural-text transition-colors flex-shrink-0">
        <ArrowLeft size={18} />
        <span>Exit Practice</span>
      </button>

      <div className="flex-1 glass-panel rounded-3xl p-6 overflow-y-auto space-y-6 flex flex-col">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-natural-sage text-white rounded-tr-none shadow-sm' 
                : 'bg-white border border-natural-border shadow-sm rounded-tl-none text-natural-text'
            }`}>
              {m.content}
            </div>
            
            {m.feedback && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="max-w-[80%] p-3 rounded-xl bg-orange-50 border border-natural-terracotta/20 text-xs text-natural-text-sub space-y-2"
              >
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-natural-terracotta">
                  <Sparkles size={12} />
                  <span>AI Feedback</span>
                </div>
                <p>{m.feedback.explanation}</p>
                {m.feedback.suggestions.length > 0 && (
                   <ul className="list-disc pl-4 space-y-1">
                     {m.feedback.suggestions.map((s, idx) => <li key={idx}>Try: {s}</li>)}
                   </ul>
                )}
              </motion.div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-natural-text-sub/50 text-sm animate-pulse italic">
            <Sparkles size={14} />
            <span>AI is analyzing...</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Type in ${targetLanguage.name}...`}
          className="flex-1 p-4 rounded-2xl bg-natural-card border border-natural-border focus:outline-none focus:border-natural-sage shadow-sm text-natural-text"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          className="p-4 natural-button-primary"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}

