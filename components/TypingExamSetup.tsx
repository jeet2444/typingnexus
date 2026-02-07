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
        <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decor Elements matching screenshots */}
            <div className="absolute top-10 left-10 text-4xl font-cursive opacity-20 rotate-12">scribble</div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8B5CF6] rounded-tr-full opacity-100"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FCD34D] rounded-bl-full opacity-100 -z-0"></div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-10">

                {/* LEFT SIDE - Hero Text */}
                <div className="flex flex-col justify-center space-y-8">
                    <h1 className="text-7xl md:text-8xl font-serif font-bold text-black leading-tight">
                        Live <br />
                        <span className="relative inline-block">
                            Test
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#8B5CF6] -z-10"></span>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-700 max-w-md leading-relaxed">
                        Please choose a target exam or daily passages to practice with exact exam rules and patterns.
                    </p>

                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                        <span className="text-blue-600"><span className="text-black">B</span> - Basic.</span>
                        <span className="text-green-600"><span className="text-black">E</span> - Easy.</span>
                        <span className="text-yellow-600"><span className="text-black">M</span> - Moderate.</span>
                        <span className="text-red-600"><span className="text-black">H</span> - Hard</span>
                    </div>
                </div>

                {/* RIGHT SIDE - Form */}
                <div className="flex flex-col justify-center space-y-8 pl-0 md:pl-12">

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="bg-[#2E8B8B] text-white px-6 py-3 rounded shadow-md font-bold text-sm tracking-wide hover:bg-[#257575] transition-colors">
                            Special Passages
                        </button>
                    </div>

                    <div className="text-gray-500 font-bold text-sm">CONFIGURATION</div>

                    <div className="space-y-6 max-w-md">
                        {/* Exam Select */}
                        <div className="flex items-center gap-4">
                            <label className="w-32 font-bold text-gray-700 text-sm">Select Exam:</label>
                            <div className="relative flex-1">
                                <select
                                    value={selectedExamId || ''}
                                    onChange={(e) => setSelectedExamId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-white border border-gray-200 rounded px-4 py-2 appearance-none font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                                >
                                    <option value="">General Practice</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>{exam.title} ({exam.language})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Language Select */}
                        <div className="flex items-center gap-4">
                            <label className="w-32 font-bold text-gray-700 text-sm">Select Language:</label>
                            <div className="relative flex-1">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="w-full bg-white border border-gray-200 rounded px-4 py-2 appearance-none font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Date Select */}
                        <div className="flex items-center gap-4">
                            <label className="w-32 font-bold text-gray-700 text-sm">Select Date:</label>
                            <div className="relative flex-1">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded px-4 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                                />
                            </div>
                        </div>

                        {/* Passage Select (Custom Dropdown) */}
                        <div className="flex items-center gap-4 relative">
                            <label className="w-32 font-bold text-gray-700 text-sm">Select Passage:</label>
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setIsPassageDropdownOpen(!isPassageDropdownOpen)}
                                    className={`w-full text-left bg-[#D1D5DB] border border-gray-300 rounded px-4 py-2 font-bold text-black flex justify-between items-center transition-all ${!selectedPassageId ? 'bg-gray-100 text-gray-500' : 'bg-gray-800 text-white'}`}
                                >
                                    <span className="truncate">{selectedPassage ? selectedPassage.title : "Auto-select from Date"}</span>
                                    <ChevronDown size={16} />
                                </button>

                                {isPassageDropdownOpen && (
                                    <div className="absolute top-full left-0 w-[150%] md:w-[130%] bg-white border border-gray-200 rounded shadow-xl mt-1 z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="p-2 bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Passages</div>
                                        {filteredPassages.length > 0 ? (
                                            filteredPassages.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => { setSelectedPassageId(p.id); setIsPassageDropdownOpen(false); }}
                                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-sm font-medium flex justify-between items-center gap-2 ${selectedPassageId === p.id ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    <span className="truncate flex-1">{p.title}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${p.difficulty === 'Easy' ? 'border-green-500 text-green-700' :
                                                        p.difficulty === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                                                            'border-red-500 text-red-700'
                                                        }`}>
                                                        {p.difficulty === 'Easy' ? 'E' : p.difficulty === 'Medium' ? 'M' : 'H'}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm italic">No matching passages found.</div>
                                        )}
                                        <div
                                            className="px-4 py-2 text-red-500 text-xs font-bold hover:bg-red-50 cursor-pointer border-t"
                                            onClick={() => { setSelectedPassageId(null); setIsPassageDropdownOpen(false); }}
                                        >
                                            Use Default (Randomized)
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Limit */}
                        <div className="flex items-center gap-4">
                            <label className="w-32 font-bold text-gray-700 text-sm">Test Duration:</label>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={inputLimit}
                                        onChange={(e) => setInputLimit(parseInt(e.target.value))}
                                        className="w-24 bg-white border border-gray-200 rounded px-4 py-2 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                                    />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Words</span>
                                </div>
                                <p className="text-[10px] text-gray-400">Default for most exams is 500-1000 words.</p>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleNext}
                                className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${!selectedPassageId && filteredPassages.length === 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-gray-200'}`}
                            >
                                Start Live Test <ArrowRight size={18} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="absolute right-10 bottom-1/2 translate-y-1/2 text-4xl font-serif italic text-black font-bold">1</div>
        </div>
    );
};

export default TypingExamSetup;
