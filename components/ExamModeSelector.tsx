import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Clock, Keyboard, User, Play, Star, Calendar } from 'lucide-react';

export interface ExamPreset {
    id: string;
    name: string;
    shortName: string;
    category: 'SSC' | 'RRB' | 'State' | 'Court' | 'Banking' | 'Police' | 'NHM';
    language: 'english' | 'hindi' | 'both';
    duration: number; // seconds
    targetKeyDepressions: number;
    qualifyingWPM: number;
    qualifyingAccuracy: number;
    backspaceAllowed: boolean;
    highlightingEnabled: boolean;
    font: 'mangal' | 'krutidev' | 'arial';
    layout: 'qwerty' | 'inscript' | 'remington';
    description: string;
    formula: 'gross' | 'net' | 'keydepressions';
    plays?: number;
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
        <div className="space-y-6 max-w-[1400px] mx-auto px-4 pb-12">
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Exams for Typing</h1>
                <div className="h-px w-full bg-gray-200"></div>
            </div>

            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                <div className="relative flex-grow w-full">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex items-center justify-between px-6 py-3 bg-brand-black text-white rounded-lg text-sm font-bold min-w-[140px]">
                        <span>Exam Type</span>
                        <ChevronDown size={14} className="ml-2" />
                    </button>

                    <button className="flex items-center justify-between px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold min-w-[180px] shadow-sm">
                        <span>Order by: Relevance</span>
                        <ChevronDown size={14} className="ml-2" />
                    </button>
                </div>
            </div>

            {/* Popular Keywords Tags */}
            <div className="flex flex-wrap gap-2 items-center mb-10">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mr-2">
                    <Search size={14} className="text-blue-500" /> Popular Search Keywords
                </span>
                {keywords.map(kw => (
                    <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className={`px-3 py-1.5 rounded-md border text-[11px] font-bold transition-all ${searchQuery === kw
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 shadow-sm'
                            }`}
                    >
                        {kw}
                    </button>
                ))}
                <button className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-700 text-[11px] font-bold hover:bg-amber-200 transition-all">
                    View All
                </button>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredExams.map(exam => (
                    <div
                        key={exam.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col cursor-pointer"
                        onClick={() => onSelectExam(exam)}
                    >
                        <div className="p-8 flex-grow relative bg-[#fafafa]">
                            {/* Dotted background pattern simulation */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none">
                                <svg width="100%" height="100%">
                                    <pattern id={`dots-${exam.id}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="#4b5563" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill={`url(#dots-${exam.id})`} />
                                </svg>
                            </div>

                            <div className="text-[10px] font-bold text-gray-400 mb-6 tracking-widest uppercase">
                                CREATED- JAN 15, 2026
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-8 line-clamp-2 min-h-[56px] group-hover:text-brand-purple transition-colors leading-tight">
                                {exam.name}
                            </h3>

                            <div className="flex items-end justify-between border-t border-gray-200/50 pt-6">
                                <div className="space-y-2">
                                    <div className="text-[12px] font-bold text-gray-700">
                                        {exam.targetKeyDepressions || 2000} words
                                    </div>
                                    <div className="text-[12px] font-bold text-gray-700">
                                        {Math.floor(exam.duration / 60)}:00 min.
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 px-2 py-1 bg-black text-white rounded text-[11px] font-bold">
                                    <User size={12} fill="white" />
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
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Search size={40} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No exams found</h3>
                    <p className="text-gray-500 text-sm">Try changing your search keywords or filters</p>
                </div>
            )}
        </div>
    );
};

export default ExamModeSelector;
