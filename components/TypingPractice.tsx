import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, Zap, Activity, Clock, Trophy } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';
import { ENGLISH_ARTICLES, HINDI_ARTICLES } from '../utils/practiceData';
import { getAdminStore } from '../utils/adminStore';

const TypingPractice: React.FC = () => {
  const { lang, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const layoutParam = searchParams.get('layout');

  const isHindi = lang === 'hindi';
  const effectiveLayout = (isHindi && layoutParam) ? layoutParam : (isHindi ? 'inscript' : 'qwerty');
  const fontFamily = isHindi ? 'mangal' : 'sans';

  // Logic to fetch unique article based on ID
  const getPracticeText = () => {
    const store = getAdminStore();
    const dynamicItem = (store.contentLibrary || []).find(item => item.id === id);

    let baseText = "";

    if (dynamicItem) {
      baseText = dynamicItem.text;
    } else {
      const articlesList = isHindi ? HINDI_ARTICLES : ENGLISH_ARTICLES;

      // Select article based on ID. 
      // Uses modulo to cycle through list if ID exceeds list length
      const articleIndex = (Number(id) - 1) % articlesList.length;
      baseText = articlesList[articleIndex] || articlesList[0];
    }

    // Process text to limit to ~50 words as per requirement
    const words = baseText.split(/\s+/).filter(w => w.length > 0);

    // If article is short, repeat it
    let resultWords = [...words];
    if (resultWords.length > 0) {
      while (resultWords.length < 50) {
        resultWords = [...resultWords, ...words];
      }
    }

    // Slice exactly 50 words for consistency
    return resultWords.slice(0, 50).join(' ');
  };

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(getPracticeText());
    reset();
  }, [id, lang]);

  const reset = () => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    const val = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Only allow typing if length is within bounds
    if (val.length <= text.length) {
      setInput(val);

      if (val.length === text.length) {
        setEndTime(Date.now());
        setIsFinished(true);
      }
    }
  };

  // Stats
  const getStats = () => {
    if (!startTime) return { wpm: 0, accuracy: 100 };
    const timeEnd = endTime || Date.now();
    const durationMin = (timeEnd - startTime) / 60000;
    const words = input.length / 5;
    const wpm = Math.round(words / (durationMin || 0.001)); // avoid div by 0

    let errors = 0;
    input.split('').forEach((char, i) => {
      if (char !== text[i]) errors++;
    });
    const accuracy = Math.max(0, ((input.length - errors) / (input.length || 1)) * 100).toFixed(1);

    return { wpm, accuracy };
  };

  const stats = getStats();
  const currentNextChar = text[input.length] || '';

  // Theme Classes
  const bgClass = "min-h-screen bg-gray-950 text-gray-200 font-mono selection:bg-fuchsia-500 selection:text-white pb-20";
  const cardClass = "bg-slate-900 border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]";

  return (
    <div className={bgClass} onClick={() => inputRef.current?.focus()}>
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/practice/' + (lang || 'english'))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cyan-400"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="font-bold text-xl text-fuchsia-400 font-mangal tracking-wide drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">
                {isHindi ? 'Hindi' : 'English'} Paragraph #{id}
              </h1>
              <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
                Simulated Environment // 50 Words
              </span>
            </div>
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-bold text-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            RESTART
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center p-4 sm:p-8 gap-8 max-w-5xl mx-auto w-full relative z-10">

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-cyan-600 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Zap size={12} /> Speed</div>
            <div className="text-4xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{stats.wpm}</div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(192,38,211,0.1)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-fuchsia-600 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Activity size={12} /> Accuracy</div>
            <div className="text-4xl font-mono font-bold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]">{stats.accuracy}%</div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Clock size={12} /> Progress</div>
            <div className="text-4xl font-mono font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">{Math.round((input.length / text.length) * 100)}%</div>
          </div>
        </div>

        {/* Text Area */}
        <div className="w-full relative perspective-1000">
          {/* Text Overlay for styling */}
          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-600 rounded-3xl p-8 text-xl sm:text-2xl leading-relaxed min-h-[250px] whitespace-pre-wrap select-none shadow-2xl relative overflow-hidden ${fontFamily === 'mangal' ? 'font-mangal' : 'font-mono'}`}>

            {/* Decorative Scanline */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-scan"></div>

            {text.split('').map((char, i) => {
              let className = "text-gray-600 transition-colors duration-100";
              if (i < input.length) {
                className = input[i] === char ? "text-cyan-300 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" : "text-red-400 bg-red-900/30 rounded";
              }
              if (i === input.length) {
                return (
                  <span key={i} className="relative">
                    <span className="absolute -inset-1 bg-fuchsia-500/30 rounded animate-pulse"></span>
                    <span className="relative bg-fuchsia-600 text-white px-0.5 rounded shadow-[0_0_10px_rgba(192,38,211,0.8)] border border-fuchsia-400 z-10 transition-all transform scale-110 inline-block text-shadow">
                      {char === ' ' ? '␣' : char}
                    </span>
                  </span>
                )
              }
              return <span key={i} className={className}>{char}</span>;
            })}
          </div>

          {/* Invisible Input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none z-20"
            autoFocus
            spellCheck={false}
          />
        </div>

        {/* Virtual Keyboard */}
        <div className="w-full mt-4 opacity-90 hover:opacity-100 transition-opacity">
          <VirtualKeyboard
            activeChar={isFinished ? '' : currentNextChar}
            language={isHindi ? 'hindi' : 'english'}
            layout={effectiveLayout as 'qwerty' | 'remington' | 'inscript'}
            fontFamily={fontFamily as 'sans' | 'mangal' | 'krutidev' | 'devlys'}
          />
        </div>

        {/* Completion Modal */}
        {isFinished && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-fuchsia-500 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(192,38,211,0.3)] animate-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500 rounded-full blur-[60px] opacity-20"></div>

              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(192,38,211,0.5)]">
                <Trophy size={40} className="text-fuchsia-400" />
              </div>

              <h2 className="text-3xl font-bold font-mono mb-2 text-white">SYSTEM CLEARED</h2>
              <p className="text-gray-400 mb-8 font-mono text-sm uppercase tracking-widest">Performance Analysis Complete</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">Speed</div>
                  <div className="text-3xl font-bold text-white font-mono">{stats.wpm} <span className="text-sm text-gray-500">WPM</span></div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-fuchsia-500 font-bold uppercase tracking-wider mb-1">Accuracy</div>
                  <div className="text-3xl font-bold text-white font-mono">{stats.accuracy}%</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={reset} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                  <RefreshCw size={18} /> Retry Simulation
                </button>
                <button onClick={() => navigate('/practice/' + (lang || 'english'))} className="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 py-3 rounded-xl font-bold border border-slate-700 transition-all uppercase tracking-wider">
                  Return to Hub
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TypingPractice;