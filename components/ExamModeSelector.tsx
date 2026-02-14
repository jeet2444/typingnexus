import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Clock, Keyboard, User, Play, Star, Calendar } from 'lucide-react';

export interface ExamPreset {
    id: string;
    name: string;
    shortName: string;
    category: 'SSC' | 'RRB' | 'Banking' | 'State' | 'Court' | 'Police' | 'NHM' | 'Railways' | 'Central';
    language: 'hindi' | 'english';
    duration: number; // seconds
    targetKeyDepressions: number;
    qualifyingWPM: number;
    qualifyingAccuracy: number;
    backspaceAllowed: boolean;
    highlightingEnabled: boolean;
    // New Fields
    backspaceMode?: 'Enabled' | 'Disabled' | 'WordOnly';
    highlightingMode?: 'Word' | 'Line' | 'None';
    errorMethod?: 'Full' | 'Half' | 'Ignore';
    security?: { preventCopyPaste: boolean; preventRightClick: boolean; singleSession: boolean };

    font: 'arial' | 'mangal' | 'krutidev';
    layout: 'qwerty' | 'remington' | 'inscript';
    description: string;
    formula: 'net' | 'gross' | 'keydepressions';
    plays: number;
}

export const EXAM_PRESETS: ExamPreset[] = [
    {
        id: 'mp-police-asi',
        name: 'MP Police ASI LDC Hindi Typing',
        shortName: 'MP Police',
        category: 'Police',
        language: 'hindi',
        duration: 1800,
        targetKeyDepressions: 600,
        qualifyingWPM: 30,
        qualifyingAccuracy: 90,
        backspaceAllowed: true,
        highlightingEnabled: false,
        font: 'krutidev',
        layout: 'remington',
        description: 'MP Police Assistant Sub-Inspector LDC test.',
        formula: 'net',
        plays: 125
    },
    {
        id: 'up-police-asi',
        name: 'UP Police ASI Accounts Hindi Typing',
        shortName: 'UP Police',
        category: 'Police',
        language: 'hindi',
        duration: 900,
        targetKeyDepressions: 250,
        qualifyingWPM: 15,
        qualifyingAccuracy: 85,
        backspaceAllowed: true,
        highlightingEnabled: true,
        font: 'mangal',
        layout: 'inscript',
        description: 'UP Police ASI Accounts typing test.',
        formula: 'net',
        plays: 240
    },
    {
        id: 'rssb-nhm-hindi',
        name: 'RSSB NHM Data Entry Operator Hindi Typing',
        shortName: 'RSSB NHM',
        category: 'NHM',
        language: 'hindi',
        duration: 900,
        targetKeyDepressions: 1250,
        qualifyingWPM: 25,
        qualifyingAccuracy: 90,
        backspaceAllowed: true,
        highlightingEnabled: true,
        font: 'mangal',
        layout: 'inscript',
        description: 'RSSB National Health Mission DEO Hindi test.',
        formula: 'net',
        plays: 520
    },
    {
        id: 'rssb-nhm-english',
        name: 'RSSB NHM Data Entry Operator English Typing',
        shortName: 'RSSB NHM',
        category: 'NHM',
        language: 'english',
        duration: 900,
        targetKeyDepressions: 1250,
        qualifyingWPM: 30,
        qualifyingAccuracy: 95,
        backspaceAllowed: true,
        highlightingEnabled: true,
        font: 'arial',
        layout: 'qwerty',
        description: 'RSSB National Health Mission DEO English test.',
        formula: 'net',
        plays: 480
    },
    {
        id: 'ssc-cgl-dest',
        name: 'SSC CGL DEST (Tier II)',
        shortName: 'CGL DEST',
        category: 'SSC',
        language: 'english',
        duration: 900,
        targetKeyDepressions: 2000,
        qualifyingWPM: 35,
        qualifyingAccuracy: 95,
        backspaceAllowed: true,
        highlightingEnabled: false,
        font: 'arial',
        layout: 'qwerty',
        description: '2000 key depressions in 15 minutes.',
        formula: 'keydepressions',
        plays: 820
    }
];

interface ExamModeSelectorProps {
    onSelectExam: (exam: ExamPreset) => void;
    currentExam?: ExamPreset | null;
    exams: ExamPreset[];
}

const ExamModeSelector: React.FC<ExamModeSelectorProps> = ({ onSelectExam, currentExam, exams }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

    const keywords = ["AHC", "AIIMS", "APHC", "BSF", "BSSC", "CGL", "CHSL", "DSSSB", "JHC", "MP Police", "NTPC", "RSSB", "UP Police", "UPSSSC"];

    const displayingExams = exams && exams.length > 0 ? exams : EXAM_PRESETS;

    const filteredExams = useMemo(() => {
        return displayingExams.filter(exam => {
            const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' || exam.category === selectedType;
            return matchesSearch && matchesType;
        });
    }, [displayingExams, searchQuery, selectedType]);

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto px-4 pb-12 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">
                    Select <span className="text-brand-purple">Exams</span> for Typing
                </h1>
                <div className="h-px w-full bg-gradient-to-r from-brand-purple via-gray-800 to-transparent"></div>
            </div>

            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                <div className="relative flex-grow w-full group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-purple transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for exam patterns..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm placeholder-gray-600 backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex items-center justify-between px-6 py-3 bg-gray-900/50 border border-gray-800 text-gray-300 hover:text-white hover:border-brand-purple/50 rounded-xl text-sm font-bold min-w-[140px] transition-all group backdrop-blur-sm">
                        <span>Exam Type</span>
                        <ChevronDown size={14} className="ml-2 text-gray-500 group-hover:text-brand-purple transition-colors" />
                    </button>

                    <button className="flex items-center justify-between px-6 py-3 bg-gray-900/50 border border-gray-800 text-gray-300 hover:text-white hover:border-brand-purple/50 rounded-xl text-sm font-bold min-w-[180px] transition-all group backdrop-blur-sm">
                        <span>Order by: Relevance</span>
                        <ChevronDown size={14} className="ml-2 text-gray-500 group-hover:text-brand-purple transition-colors" />
                    </button>
                </div>
            </div>

            {/* Popular Keywords Tags */}
            <div className="flex flex-wrap gap-2 items-center mb-10">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mr-2 uppercase tracking-wide">
                    <Search size={12} className="text-brand-purple" /> Popular:
                </span>
                {keywords.map(kw => (
                    <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className={`px - 3 py - 1.5 rounded - lg border text - [11px] font - bold transition - all ${searchQuery === kw
                            ? 'bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-brand-purple/50 hover:text-gray-200 hover:bg-gray-800'
                            } `}
                    >
                        {kw}
                    </button>
                ))}
                <button className="px-3 py-1.5 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-[11px] font-bold hover:bg-brand-purple/20 transition-all">
                    View All
                </button>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredExams.map(exam => (
                    <div
                        key={exam.id}
                        className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/60 hover:border-brand-purple shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer relative"
                        onClick={() => onSelectExam(exam)}
                    >
                        {/* Cyberpunk accent line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-purple/0 to-transparent group-hover:via-brand-purple/80 transition-all duration-500"></div>

                        <div className="p-6 flex-grow relative">
                            {/* Dotted background pattern simulation */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.1] pointer-events-none mix-blend-overlay">
                                <svg width="100%" height="100%">
                                    <pattern id={`dots - ${exam.id} `} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="#a855f7" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill={`url(#dots - ${exam.id})`} />
                                </svg>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase bg-gray-900/80 px-2 py-1 rounded border border-gray-800 group-hover:border-brand-purple/30 transition-colors">
                                    {exam.category}
                                </div>
                                {exam.highlightingEnabled && (
                                    <div className="text-[10px] font-bold text-brand-purple flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Premium
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                {(() => {
                                    // Determine languages to show
                                    const langs = (exam as any).enabledLanguages || (exam.language ? [exam.language] : ['english', 'hindi']);
                                    const showEng = langs.some((l: string) => l.toLowerCase().includes('english'));
                                    const showHin = langs.some((l: string) => l.toLowerCase().includes('hindi'));

                                    if (showEng && showHin) {
                                        return <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-blue-900/40 to-orange-900/40 text-gray-300 border border-gray-700 px-2 py-1 rounded">ENG + HINDI</span>;
                                    } else if (showEng) {
                                        return <span className="text-[10px] font-bold uppercase bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-1 rounded">ENGLISH ONLY</span>;
                                    } else if (showHin) {
                                        return <span className="text-[10px] font-bold uppercase bg-orange-900/30 text-orange-400 border border-orange-900/50 px-2 py-1 rounded">HINDI ONLY</span>;
                                    }
                                    return null;
                                })()}
                            </div>

                            <h3 className="font-display font-bold text-lg text-gray-100 mb-6 line-clamp-2 min-h-[56px] group-hover:text-brand-purple transition-colors leading-tight">
                                {exam.name}
                            </h3>

                            <div className="flex items-end justify-between border-t border-gray-800 pt-4 mt-auto">
                                <div className="space-y-1.5">
                                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                                        <Keyboard size={12} className="text-gray-500" />
                                        {exam.targetKeyDepressions || 2000} words
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                                        <Clock size={12} className="text-gray-500" />
                                        {Math.floor(exam.duration / 60)}:00 min.
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-950 border border-gray-800 text-gray-300 rounded text-[10px] font-bold group-hover:border-brand-purple/30 transition-colors">
                                    <User size={10} className="text-brand-purple" />
                                    <span>
                                        {(() => {
                                            // Stable random seed from ID
                                            const idStr = exam.id.toString();
                                            let seed = 0;
                                            for (let i = 0; i < idStr.length; i++) {
                                                seed += idStr.charCodeAt(i);
                                            }
                                            // Base: stable random 3-digit number (100-999)
                                            const baseOffset = 100 + (seed % 900);

                                            // Start from Feb 4, 10:45 PM (approx 1738708500000)
                                            const referenceTime = 1738708500000;
                                            const timePassed = Math.max(0, Date.now() - referenceTime);
                                            const increment = Math.floor(timePassed / (2 * 60 * 1000));

                                            return (baseOffset + increment).toLocaleString();
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExams.length === 0 && (
                <div className="text-center py-20 bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-800 backdrop-blur-sm">
                    <div className="bg-gray-900 p-4 rounded-full w-fit mx-auto mb-4 border border-gray-800">
                        <Search size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-200">No exams found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try changing your search keywords or filters</p>
                </div>
            )}
        </div>
    );
};

export default ExamModeSelector;
