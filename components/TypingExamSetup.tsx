import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, ArrowRight, X } from 'lucide-react';
import { getAdminStore, Passage } from '../utils/adminStore';

const TypingExamSetup: React.FC = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi' | 'Marathi'>('English');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPassageId, setSelectedPassageId] = useState<number | null>(null);
    const [inputLimit, setInputLimit] = useState<number>(600);
    const [passages, setPassages] = useState<Passage[]>([]);
    const [filteredPassages, setFilteredPassages] = useState<Passage[]>([]);
    const [isPassageDropdownOpen, setIsPassageDropdownOpen] = useState(false);
    const [exams, setExams] = useState<any[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

    useEffect(() => {
        const store = getAdminStore();
        setPassages(store.passages || []);
        setExams(store.exams || []);
    }, []);

    useEffect(() => {
        // Filter passages based on language
        let basePool = passages.filter(p => p.language.toLowerCase() === language.toLowerCase());

        if (selectedExamId) {
            const selectedExam = exams.find(e => e.id === selectedExamId);
            if (selectedExam) {
                // Filter by exam title or category
                basePool = basePool.filter(p => p.category === selectedExam.title || p.tags?.includes(selectedExam.title));
            }
        }

        // Always group by difficulty and take only the latest one for each to keep it a "Live Test" feel
        const sortedPool = [...basePool].reverse();
        const easy = sortedPool.find(p => p.difficulty === 'Easy');
        const medium = sortedPool.find(p => p.difficulty === 'Medium');
        const hard = sortedPool.find(p => p.difficulty === 'Hard');

        const filtered = [easy, medium, hard].filter((p): p is Passage => !!p);

        setFilteredPassages(filtered);
        setSelectedPassageId(null); // Reset selection on lang/exam change
    }, [language, passages, selectedExamId, exams]);

    const handleNext = () => {
        const selectedExam = exams.find(e => e.id === selectedExamId);
        let finalPassageId = selectedPassageId;

        // Auto-select if no passage is picked but filtered ones exist
        if (!finalPassageId && filteredPassages.length > 0) {
            const seed = date.split('-').join('');
            const index = parseInt(seed) % filteredPassages.length;
            finalPassageId = filteredPassages[index].id;
        }

        if (!finalPassageId) return;

        const params = new URLSearchParams({
            passageId: finalPassageId.toString(),
            limit: inputLimit.toString(),
            lang: language,
            date: date
        });

        if (selectedExam) {
            params.append('examId', selectedExam.id.toString());
            params.append('ruleId', selectedExam.ruleId.toString());
        }

        navigate(`/instructions?${params.toString()}`);
    };

    const selectedPassage = passages.find(p => p.id === selectedPassageId);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decor Elements matching screenshots */}
            <div className="absolute top-10 left-10 text-6xl font-display font-bold text-gray-800 opacity-20 -rotate-12 select-none">LIVE</div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple rounded-full opacity-20 blur-[100px]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-[100px] -z-0"></div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-10">

                {/* LEFT SIDE - Hero Text */}
                <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left-10 duration-700">
                    <h1 className="text-7xl md:text-8xl font-display font-bold text-white leading-tight tracking-tighter">
                        Live <br />
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-blue-500">
                            Test
                            <span className="absolute -bottom-2 left-0 w-full h-2 bg-brand-purple opacity-50 blur-sm rounded-full"></span>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-md leading-relaxed border-l-4 border-brand-purple pl-6">
                        Choose your target exam or daily practice set. <br />
                        <span className="text-gray-500 text-sm">Experience exact exam rules and patterns.</span>
                    </p>

                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm w-fit">
                        <span className="text-blue-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Basic</span>
                        <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Easy</span>
                        <span className="text-yellow-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moderate</span>
                        <span className="text-red-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Hard</span>
                    </div>
                </div>

                {/* RIGHT SIDE - Form */}
                <div className="flex flex-col justify-center space-y-8 pl-0 md:pl-12 animate-in slide-in-from-right-10 duration-700 delay-100">

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="bg-gray-800 text-gray-300 border border-gray-700 px-6 py-3 rounded-xl shadow-lg font-bold text-sm tracking-wide hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all duration-300 backdrop-blur-sm">
                            Special Passages
                        </button>
                    </div>

                    <div className="text-brand-purple font-bold text-xs tracking-[0.2em] uppercase border-b border-gray-800 pb-2">Configuration</div>

                    <div className="space-y-6 max-w-md">
                        {/* Exam Select */}
                        <div className="flex items-center gap-4 group">
                            <label className="w-32 font-bold text-gray-400 text-sm group-hover:text-white transition-colors">Select Exam:</label>
                            <div className="relative flex-1">
                                <select
                                    value={selectedExamId || ''}
                                    onChange={(e) => setSelectedExamId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 appearance-none font-bold text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all hover:bg-gray-800"
                                >
                                    <option value="">General Practice</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>{exam.title} ({exam.language})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Language Select */}
                        <div className="flex items-center gap-4 group">
                            <label className="w-32 font-bold text-gray-400 text-sm group-hover:text-white transition-colors">Select Language:</label>
                            <div className="relative flex-1">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 appearance-none font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all hover:bg-gray-800"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Date Select */}
                        <div className="flex items-center gap-4 group">
                            <label className="w-32 font-bold text-gray-400 text-sm group-hover:text-white transition-colors">Select Date:</label>
                            <div className="relative flex-1">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all hover:bg-gray-800 calendar-dark"
                                />
                            </div>
                        </div>

                        {/* Passage Select (Custom Dropdown) */}
                        <div className="flex items-center gap-4 relative group">
                            <label className="w-32 font-bold text-gray-400 text-sm group-hover:text-white transition-colors">Select Passage:</label>
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setIsPassageDropdownOpen(!isPassageDropdownOpen)}
                                    className={`w-full text-left border rounded-xl px-4 py-3 font-bold flex justify-between items-center transition-all ${!selectedPassageId ? 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800' : 'bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'}`}
                                >
                                    <span className="truncate">{selectedPassage ? selectedPassage.title : "Auto-select from Date"}</span>
                                    <ChevronDown size={16} />
                                </button>

                                {isPassageDropdownOpen && (
                                    <div className="absolute top-full left-0 w-[150%] md:w-[130%] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl mt-2 z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/10">
                                        <div className="p-3 bg-gray-950/50 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available Passages</div>
                                        {filteredPassages.length > 0 ? (
                                            filteredPassages.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => { setSelectedPassageId(p.id); setIsPassageDropdownOpen(false); }}
                                                    className={`px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 text-sm font-medium flex justify-between items-center gap-2 transition-colors ${selectedPassageId === p.id ? 'bg-brand-purple/20 text-brand-purple' : 'text-gray-300'}`}
                                                >
                                                    <span className="truncate flex-1">{p.title}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${p.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                                        p.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                                            'border-red-500/30 text-red-400 bg-red-500/10'
                                                        }`}>
                                                        {p.difficulty === 'Easy' ? 'E' : p.difficulty === 'Medium' ? 'M' : 'H'}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm italic">No matching passages found.</div>
                                        )}
                                        <div
                                            className="px-4 py-3 text-red-400 text-xs font-bold hover:bg-red-950/20 cursor-pointer border-t border-gray-800 transition-colors"
                                            onClick={() => { setSelectedPassageId(null); setIsPassageDropdownOpen(false); }}
                                        >
                                            Use Default (Randomized)
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Limit */}
                        <div className="flex items-center gap-4 group">
                            <label className="w-32 font-bold text-gray-400 text-sm group-hover:text-white transition-colors">Test Duration:</label>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={inputLimit}
                                        onChange={(e) => setInputLimit(parseInt(e.target.value))}
                                        className="w-24 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                                    />
                                    <span className="text-xs font-bold text-gray-500 uppercase">Words</span>
                                </div>
                                <p className="text-[10px] text-gray-600">Default for most exams is 500-1000 words.</p>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleNext}
                                className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${!selectedPassageId && filteredPassages.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-brand-purple text-white hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]'}`}
                            >
                                Start Live Test <ArrowRight size={18} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="absolute right-10 bottom-1/2 translate-y-1/2 text-9xl font-display font-bold text-gray-800/20 select-none -z-0">1</div>
        </div>
    );
};

export default TypingExamSetup;
