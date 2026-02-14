import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Keyboard, ArrowLeft, Play, RefreshCw, Trophy, Target, Zap,
    CheckCircle, Hand, Clock, TrendingUp, Star, BookOpen, Settings, Volume2, VolumeX
} from 'lucide-react';
import VirtualKeyboard, { FINGER_MAP } from './VirtualKeyboard';
import { KEY_DRILLS } from '../utils/practiceData';

// Settings Interface
interface PracticeSettings {
    backspaceOption: 'full' | 'one-word' | 'deactivate';
    moveOnError: boolean;
    showKeyboard: boolean;
    playSounds: boolean;
}

// --- HINDI MAPPING (Inscript) ---
const INSCRIPT_DISPLAY_MAP: Record<string, { normal: string, shift?: string }> = {
    'q': { normal: 'ौ', shift: 'औ' },
    'w': { normal: 'ै', shift: 'ऐ' },
    'e': { normal: 'ा', shift: 'आ' },
    'r': { normal: 'ी', shift: 'ई' },
    't': { normal: 'ू', shift: 'ऊ' },
    'y': { normal: 'ब', shift: 'भ' },
    'u': { normal: 'ह', shift: 'ङ' },
    'i': { normal: 'ग', shift: 'घ' },
    'o': { normal: 'द', shift: 'ध' },
    'p': { normal: 'ज', shift: 'झ' },
    '[': { normal: 'ड', shift: 'ढ' },
    ']': { normal: '़', shift: 'ञ' },

    'a': { normal: 'ो', shift: 'ओ' },
    's': { normal: 'े', shift: 'ए' },
    'd': { normal: '्', shift: 'अ' },
    'f': { normal: 'ि', shift: 'इ' },
    'g': { normal: 'ु', shift: 'उ' },
    'h': { normal: 'प', shift: 'फ' },
    'j': { normal: 'र', shift: 'र्' },
    'k': { normal: 'क', shift: 'ख' },
    'l': { normal: 'त', shift: 'थ' },
    ';': { normal: 'च', shift: 'छ' },
    "'": { normal: 'ट', shift: 'ठ' },

    'z': { normal: '्र', shift: '' },
    'x': { normal: 'ं', shift: 'ँ' },
    'c': { normal: 'म', shift: 'ण' },
    'v': { normal: 'न', shift: '' },
    'b': { normal: 'व', shift: '' },
    'n': { normal: 'ल', shift: 'ळ' },
    'm': { normal: 'स', shift: 'श' },
    ',': { normal: ',', shift: 'ष' },
    '.': { normal: '.', shift: '।' },
    '/': { normal: 'य', shift: '?' },

    '1': { normal: '1', shift: 'ऍ' },
    '2': { normal: '2', shift: 'ॅ' },
    '3': { normal: '3', shift: '्र' },
    '4': { normal: '4', shift: 'र्' },
    '5': { normal: '5', shift: 'ज्ञ' },
    '6': { normal: '6', shift: 'त्र' },
    '7': { normal: '7', shift: 'क्ष' },
    '8': { normal: '8', shift: 'श्र' },
    '9': { normal: '9', shift: '(' },
    '0': { normal: '0', shift: ')' },
};

interface DrillStats {
    wpm: number;
    accuracy: number;
    time: number;
}

const KeyboardPractice: React.FC = () => {
    const { lang, drillId } = useParams();
    const location = useLocation();

    const [activeLang, setActiveLang] = useState<'english' | 'hindi'>('english');
    const [layout, setLayout] = useState<'inscript' | 'remington'>('inscript');

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeDrill, setActiveDrill] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    // Sync Language with URL and Handle Drill ID
    useEffect(() => {
        // Set Language
        if (lang === 'hindi') setActiveLang('hindi');
        else if (lang === 'english') setActiveLang('english');

        // Parse Layout query param
        const searchParams = new URLSearchParams(location.search);
        const layoutParam = searchParams.get('layout');
        if (layoutParam === 'remington') setLayout('remington');
        else setLayout('inscript');

        // Handle Drill ID Auto-start
        if (drillId) {
            // Find the drill in the dataset
            const langData = KEY_DRILLS[lang === 'hindi' ? 'hindi' : 'english'];
            if (langData) {
                // Since TypeScript doesn't know structure, cast or loose check
                // @ts-ignore
                const categories = Object.values(langData);
                for (const category of categories) {
                    // @ts-ignore
                    const foundDrill = category.drills.find((d: any) => d.id === drillId);
                    if (foundDrill) {
                        startDrill(foundDrill);
                        break;
                    }
                }
            }
        }
    }, [lang, drillId, location.search]);

    // Settings State
    const [settings, setSettings] = useState<PracticeSettings>({
        backspaceOption: 'full',
        moveOnError: true,
        showKeyboard: true,
        playSounds: false
    });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Reset drill
    const resetDrill = () => {
        setCurrentIndex(0);
        setMistakes(0);
        setIsCompleted(false);
        setLastKeyPressed(null);
        setStartTime(null);
        setWpm(0);
    };

    // Start a drill
    const startDrill = (drill: any) => {
        setActiveDrill(drill);
        resetDrill();
    };

    // Sound Effect
    const playClickSound = useCallback(() => {
        if (!settings.playSounds) return;
        const audio = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => { });
    }, [settings.playSounds]);

    // Handle keyboard input
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isCompleted || !activeDrill) return;

        // Skip modifier keys
        if (['Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

        // Prevent scrolling with Space
        if (e.key === ' ') e.preventDefault();

        // Handle Backspace
        if (e.key === 'Backspace') {
            if (settings.backspaceOption === 'deactivate') {
                e.preventDefault();
                return;
            }
            if (settings.backspaceOption === 'one-word') {
                if (currentIndex > 0) {
                    const charToDelete = activeDrill.content[currentIndex - 1];
                    if (charToDelete !== ' ') {
                        setCurrentIndex(prev => Math.max(0, prev - 1));
                    }
                }
                return;
            }

            // Full Backspace
            setCurrentIndex(prev => Math.max(0, prev - 1));
            return;
        }

        setLastKeyPressed(e.key);
        playClickSound();

        let currentStart = startTime;
        if (!currentStart) {
            currentStart = Date.now();
            setStartTime(currentStart);
        }

        // --- Logic Update: Multi-Char Handling ---

        let typedChar = e.key;

        // Hindi Mapping Logic (Only if Inscript is active layout)
        if (activeLang === 'hindi' && layout === 'inscript' && typedChar.length === 1) {
            // If user typed essentially "q", try to map it
            const lowerKey = typedChar.toLowerCase();
            const isShift = e.shiftKey || (typedChar !== lowerKey && typedChar.toUpperCase() === typedChar);

            const map = INSCRIPT_DISPLAY_MAP[lowerKey];
            if (map) {
                const mappedChar = isShift ? (map.shift || map.normal) : map.normal;
                // If mapped char is valid, use it.
                if (mappedChar) {
                    typedChar = mappedChar;
                }
            }
        }

        // Check if content at currentIndex matches typedChar
        const remainingContent = activeDrill.content.substring(currentIndex);

        if (remainingContent.startsWith(typedChar)) {
            // Match!
            const nextIndex = currentIndex + typedChar.length;
            setCurrentIndex(nextIndex);

            if (currentStart) {
                const timeElapsedMin = (Date.now() - currentStart) / 60000;
                if (timeElapsedMin > 0.001) {
                    setWpm(Math.round((nextIndex / 5) / timeElapsedMin));
                }
            }

            if (nextIndex >= activeDrill.content.length) {
                setIsCompleted(true);
            }
        } else {
            setMistakes(prev => prev + 1);
            if (settings.moveOnError) {
                // If moving on error, we need to know how much to skip.
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                if (nextIndex >= activeDrill.content.length) {
                    setIsCompleted(true);
                }
            }
        }

        setTimeout(() => setLastKeyPressed(null), 150);
    }, [currentIndex, activeDrill, isCompleted, startTime, settings, playClickSound, activeLang, layout]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Calculate stats
    const progress = activeDrill ? Math.round((currentIndex / activeDrill.content.length) * 100) : 0;
    const accuracy = activeDrill && currentIndex > 0
        ? Math.max(0, 100 - Math.round((mistakes / currentIndex) * 100))
        : 100;

    // Active drill view
    if (activeDrill) {
        // We need to render the target char correctly.
        const targetChar = activeDrill.content[currentIndex] || '';

        // Cyberpunk Theme Classes
        const bgClass = "min-h-screen bg-gray-900 text-white font-mono selection:bg-fuchsia-500 selection:text-white";
        const cardClass = "bg-slate-800 border border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]";

        return (
            <div className={bgClass}>
                {/* Header */}
                <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setActiveDrill(null); navigate('/practice/' + activeLang); }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cyan-400"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="font-bold text-xl text-fuchsia-400 font-mangal tracking-wide drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">
                                {activeDrill.name}
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>KEYS: <code className="text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800 font-mangal">{activeDrill.keys}</code></span>
                                {activeLang === 'hindi' && <span className="text-orange-400 bg-orange-900/30 border border-orange-800 px-2 rounded-full font-bold text-[10px] uppercase tracking-wider">{layout === 'inscript' ? 'Hindi Inscript' : 'Hindi Remington'}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Live Stats */}
                    <div className="flex items-center gap-8">
                        <div className="text-center group">
                            <div className="text-[10px] text-cyan-600 uppercase font-bold tracking-widest group-hover:text-cyan-400 transition-colors">Speed</div>
                            <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{wpm} <span className="text-xs text-cyan-700">WPM</span></div>
                        </div>
                        <div className="text-center group">
                            <div className="text-[10px] text-fuchsia-600 uppercase font-bold tracking-widest group-hover:text-fuchsia-400 transition-colors">Accuracy</div>
                            <div className={`text-3xl font-bold ${accuracy >= 95 ? 'text-green-400' : accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                                {accuracy}%
                            </div>
                        </div>
                        {/* Settings Toggle */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.5)]' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                        >
                            <Settings size={22} />
                        </button>
                    </div>
                </div>

                {/* Settings Panel Overlay */}
                {showSettings && (
                    <div className="absolute top-20 right-4 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-fuchsia-500/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 p-6 text-gray-200">
                        <h3 className="font-bold border-b border-gray-700 pb-3 mb-5 text-fuchsia-400 flex items-center gap-2">
                            <Settings size={18} /> CONFIGURATION
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Backspace Mode</label>
                                <div className="space-y-3">
                                    {['full', 'one-word', 'deactivate'].map((opt) => (
                                        <label key={opt} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${settings.backspaceOption === opt ? 'bg-cyan-900/30 border-cyan-500/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' : 'border-transparent hover:bg-white/5'}`}>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${settings.backspaceOption === opt ? 'border-cyan-400' : 'border-gray-600'}`}>
                                                {settings.backspaceOption === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="backspace"
                                                checked={settings.backspaceOption === opt}
                                                onChange={() => setSettings(s => ({ ...s, backspaceOption: opt as any }))}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-medium capitalize ${settings.backspaceOption === opt ? 'text-cyan-300' : 'text-gray-400'}`}>
                                                {opt.replace('-', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-5 space-y-4">
                                {[
                                    { key: 'showKeyboard', label: 'Virtual Keyboard', icon: Keyboard },
                                    { key: 'playSounds', label: 'Sound FX', icon: settings.playSounds ? Volume2 : VolumeX },
                                    { key: 'moveOnError', label: 'Move on Error', icon: ArrowLeft }
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                                            {/* @ts-ignore */}
                                            {React.createElement(item.icon, { size: 16 })}
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${settings[item.key as keyof PracticeSettings] ? 'bg-fuchsia-600' : 'bg-gray-700'}`}>
                                            <input
                                                type="checkbox"
                                                checked={settings[item.key as keyof PracticeSettings] as boolean}
                                                onChange={(e) => setSettings(s => ({ ...s, [item.key]: e.target.checked }))}
                                                className="hidden"
                                            />
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${settings[item.key as keyof PracticeSettings] ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* Main Area */}
                <div className="flex-grow flex flex-col items-center justify-center p-8 relative overflow-hidden" onClick={() => setShowSettings(false)}>

                    {/* Background Grid Decoration */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    {/* Completion Screen */}
                    {isCompleted && (
                        <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-slate-800 border-2 border-fuchsia-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(192,38,211,0.2)] text-center max-w-md w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500" />

                                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-fuchsia-500 relative">
                                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
                                    <Trophy size={48} className="text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]" />
                                </div>

                                <h1 className="text-4xl font-bold mb-2 text-white tracking-tight">SESSION CLEAR</h1>
                                <p className="text-gray-400 mb-8 font-mono text-sm">SYSTEM STATUS: OPTIMAL</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                        <div className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">Speed</div>
                                        <div className="text-3xl font-bold text-white font-mono">{wpm}</div>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${accuracy >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>Accuracy</div>
                                        <div className="text-3xl font-bold text-white font-mono">{accuracy}%</div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={resetDrill}
                                        className="flex-1 py-3 bg-transparent border border-gray-600 text-white font-bold rounded-lg hover:bg-white/5 hover:border-white transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Retry
                                    </button>
                                    <button
                                        onClick={() => { setActiveDrill(null); navigate('/practice/' + activeLang); }}
                                        className="flex-1 py-3 bg-fuchsia-600 border border-fuchsia-500 text-white font-bold rounded-lg hover:bg-fuchsia-500 hover:shadow-[0_0_20px_rgba(232,121,249,0.4)] transition-all"
                                    >
                                        Library
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Target Character (Floating) */}
                    <div className="mb-12 relative group perspective-1000">
                        <div className="w-40 h-40 bg-slate-800 border-2 border-cyan-500/50 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                            <span className="text-7xl font-bold font-mangal text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                {activeDrill.content[currentIndex] === ' ' ? '␣' : activeDrill.content[currentIndex]}
                            </span>
                            <div className="absolute -top-4 -right-4 bg-fuchsia-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce shadow-lg border border-fuchsia-400">
                                TARGET
                            </div>
                        </div>
                    </div>

                    {/* Text Preview (Cyberpunk Style) */}
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-8 w-full max-w-5xl shadow-2xl mb-10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_#22d3ee]"></div>
                        <div className="text-2xl md:text-4xl text-center leading-relaxed font-mangal break-words whitespace-pre-wrap font-mono">
                            <span className="text-fuchsia-300/50 select-none blur-[0.5px]">
                                {activeDrill.content.slice(0, currentIndex)}
                            </span>
                            <span className="bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-400 rounded px-1 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                {activeDrill.content[currentIndex] === ' ' ? '␣' : activeDrill.content[currentIndex]}
                            </span>
                            <span className="text-slate-500 select-none">
                                {activeDrill.content.substring(currentIndex + 1)}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar (Neon) */}
                    <div className="w-full max-w-4xl mb-12 flex items-center gap-6 relative">
                        <span className="text-xs font-bold text-cyan-900/50 absolute -top-6 left-0">SYSTEM PROGRESS</span>
                        <div className="flex-grow h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner relative">
                            {/* Scanline pattern */}
                            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                            <div
                                className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-fuchsia-600 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(192,38,211,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{progress}%</span>
                    </div>

                    {/* Virtual Keyboard */}
                    {settings.showKeyboard && (
                        <div className="w-full max-w-6xl transform scale-[0.85] origin-top">
                            <VirtualKeyboard
                                activeChar={activeDrill.content[currentIndex] || ''}
                                pressedKey={lastKeyPressed}
                                language={activeLang}
                                layout={activeLang === 'hindi' ? layout : 'qwerty'}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Category/Drill Selection View with Language Toggle
    return (
        <div className="min-h-screen bg-gray-950 py-8 px-4 font-mono text-gray-200 selection:bg-cyan-500 selection:text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors group">
                            <ArrowLeft size={24} className="text-gray-400 group-hover:text-white" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 uppercase tracking-tighter">
                                Nexus<span className="text-cyan-400">Training</span>
                            </h1>
                            <p className="text-gray-500 text-sm tracking-widest uppercase">Select your simulation module</p>
                        </div>
                    </div>

                    {/* Language Toggles (Only if no lang param) */}
                    {!lang && (
                        <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 flex shadow-lg">
                            <button
                                onClick={() => setActiveLang('english')}
                                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeLang === 'english' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'text-gray-500 hover:bg-white/5'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setActiveLang('hindi')}
                                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeLang === 'hindi' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-gray-500 hover:bg-white/5'}`}
                            >
                                Hindi
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Stats Banner */}
                <div className={`rounded-2xl p-8 mb-10 text-white relative overflow-hidden border ${activeLang === 'hindi' ? 'border-orange-500/30' : 'border-cyan-500/30'} shadow-2xl`}>
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${activeLang === 'hindi' ? 'from-orange-600 to-red-600' : 'from-cyan-600 to-blue-700'}`}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

                    <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 tracking-tight">
                                {activeLang === 'hindi' ? 'हिंदी टाइपिंग अभ्यास' : 'NEURAL LINK ESTABLISHED'}
                            </h2>
                            <p className="text-white/70 font-mono text-sm max-w-md border-l-2 border-white/20 pl-4">
                                {activeLang === 'hindi' ? 'कुंजीपटल पर अपनी पकड़ मजबूत करें' : 'Initiate muscle memory subroutines. Select a data packet to begin upload.'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/learn"
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-3 transition-all border border-white/10 backdrop-blur-sm"
                            >
                                <BookOpen size={20} /> Modules
                            </Link>
                            <Link
                                to="/exams"
                                className={`bg-white text-gray-900 px-6 py-3 rounded-xl font-extrabold flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
                            >
                                <Target size={20} className={activeLang === 'hindi' ? 'text-orange-600' : 'text-cyan-600'} /> Initiate Test
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Drill Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {KEY_DRILLS[activeLang] && Object.entries(KEY_DRILLS[activeLang]).map(([key, category]: [string, any]) => (
                        <div
                            key={key}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group duration-300"
                        >
                            {/* Category Header */}
                            <div className="p-6 border-b border-slate-800 bg-slate-900/50 group-hover:bg-cyan-900/10 transition-colors">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 block">{category.icon}</span>
                                    <h3 className="text-xl font-bold font-mangal text-gray-100 group-hover:text-cyan-400 transition-colors">{category.title}</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">{category.description}</p>
                            </div>

                            {/* Drills List */}
                            <div className="p-4 space-y-2 h-[280px] overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                                {category.drills.map((drill: any) => (
                                    <button
                                        key={drill.id}
                                        onClick={() => startDrill(drill)}
                                        className="w-full p-3 bg-slate-950/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-cyan-900/10 rounded-xl text-left transition-all flex items-center justify-between group/btn"
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="font-bold text-sm font-mangal text-gray-300 group-hover/btn:text-white truncate">{drill.name}</div>
                                            <code className="text-[10px] text-gray-600 bg-black/30 px-1.5 py-0.5 rounded font-mono truncate block mt-1 border border-white/5">
                                                {drill.keys.length > 25 ? `${drill.keys.slice(0, 25)}...` : drill.keys}
                                            </code>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover/btn:border-cyan-500/50 group-hover/btn:bg-cyan-500 text-cyan-500 group-hover/btn:text-black transition-all">
                                            <Play size={12} fill="currentColor" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Tips */}
                <div className="mt-16 border-t border-slate-800 pt-8 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
                    Nexus Training System v2.4 // Neural Sync Active
                </div>

            </div>
        </div>
    );
};

export default KeyboardPractice;
