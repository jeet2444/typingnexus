// Practice Exams Page - Exam-specific passage browser with real exam interface
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Play, FileText, Globe, Target, Star, Award, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import ExamModeSelector, { EXAM_PRESETS, ExamPreset } from './ExamModeSelector';
import { getAdminStore, Passage } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

const PracticeExams: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, hasPremiumAccess } = useAuth();
    const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [passages, setPassages] = useState<Passage[]>([]);

    const store = getAdminStore();
    const adminExams = store.exams || [];
    const adminRules = store.rules || [];

    // Map Admin Exams to ExamPresets
    const dynamicExams: ExamPreset[] = useMemo(() => {
        const mapped = adminExams.map(ae => {
            const rule = adminRules.find(r => r.id === ae.ruleId) || adminRules[0];
            if (!rule) return null;
            return {
                id: `admin-${ae.id}`,
                name: ae.title,
                shortName: ae.title.split(' ')[0],
                category: (ae.difficulty === 'Hard' ? 'SSC' : ae.difficulty === 'Medium' ? 'RRB' : 'State') as any,
                language: ae.language.toLowerCase().includes('hindi') ? 'hindi' : 'english' as 'hindi' | 'english',
                duration: rule.duration * 60,
                targetKeyDepressions: 2000,
                qualifyingWPM: rule.qualifyingSpeed,
                qualifyingAccuracy: rule.qualifyingAccuracy,
                backspaceAllowed: rule.backspace === 'Enabled',
                highlightingEnabled: rule.highlighting,
                font: rule.font.toLowerCase().includes('mangal') ? 'mangal' : (rule.font.toLowerCase().includes('kruti') ? 'krutidev' : 'arial') as any,
                layout: rule.font.toLowerCase().includes('inscript') ? 'inscript' : (rule.font.toLowerCase().includes('remington') ? 'remington' : 'qwerty') as any,
                description: rule.details || ae.title,
                formula: rule.formula.toLowerCase().includes('net') ? 'net' : (rule.formula.toLowerCase().includes('key') ? 'keydepressions' : 'gross') as any,
                plays: 0 // Mock placeholder
            };
        }).filter(Boolean) as ExamPreset[];

        // Combine with static defaults but filter duplicates by name if any
        const combined = [...EXAM_PRESETS];
        mapped.forEach(m => {
            if (!combined.some(c => c.name === m.name)) {
                combined.push(m);
            }
        });
        return combined;
    }, [adminExams, adminRules]);

    useEffect(() => {
        setPassages(store.passages || []);

        // Auto-select exam if examId is provided in URL
        const examIdParam = searchParams.get('examId');
        if (examIdParam) {
            const foundExam = dynamicExams.find(e => e.id === `admin-${examIdParam}` || e.id === examIdParam);
            if (foundExam) {
                setSelectedExam(foundExam);
            }
        }
    }, [searchParams, dynamicExams]);

    const handleStartExam = (exam: ExamPreset, passageId?: number) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        // Navigate to typing test with exam configuration
        const params = new URLSearchParams({
            exam: exam.id,
            duration: exam.duration.toString(),
            backspace: exam.backspaceAllowed.toString(),
            font: exam.font,
            layout: exam.layout,
            ...(passageId && { passageId: passageId.toString() })
        });

        navigate(`/typing-test?${params.toString()}`);
    };

    const handleSelectPassage = (passage: Passage) => {
        // Find matching exam or use default
        const matchingExam = dynamicExams.find(e =>
            e.category === passage.category ||
            (passage.language === 'Hindi' && e.language === 'hindi') ||
            (passage.language === 'English' && e.language === 'english')
        ) || dynamicExams.find(e => e.id === 'practice-5min') || dynamicExams[0];

        if (matchingExam) {
            handleStartExam(matchingExam, passage.id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-gray-200">
            {/* Ambient BG */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] pointer-events-none rounded-full"></div>

            <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">

                <div className="space-y-6">
                    <div className="space-y-6">
                        {!selectedExam ? (
                            <ExamModeSelector
                                onSelectExam={(exam) => {
                                    setSelectedExam(exam);
                                }}
                                currentExam={selectedExam}
                                exams={dynamicExams}
                            />
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setSelectedExam(null)}
                                            className="p-3 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-700"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="font-bold text-2xl text-white font-display">{selectedExam.name}</h2>
                                                <span className="px-2 py-0.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded border border-brand-purple/30 uppercase tracking-wide">
                                                    {selectedExam.language}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-bold">{selectedExam.category} • {Math.floor(selectedExam.duration / 60)} Minutes Duration</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-xs text-gray-600 font-bold uppercase tracking-widest text-right mb-1">Selected Preset</div>
                                        <div className="text-sm text-gray-400 text-right font-mono">ID: {selectedExam.id}</div>
                                    </div>
                                </div>

                                {/* Article List for Selected Exam */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {passages
                                        .filter(p => p.category === selectedExam.category || p.category === 'General')
                                        .map((passage, index) => {
                                            const isFree = index < 3 || hasPremiumAccess;
                                            return (
                                                <div
                                                    key={passage.id}
                                                    className={`bg-gray-900 rounded-xl border border-gray-800 p-5 transition-all relative group ${isFree ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer hover:border-brand-purple hover:-translate-y-1' : 'opacity-60 grayscale-[0.8]'}`}
                                                    onClick={() => (isFree || hasPremiumAccess) && handleSelectPassage(passage)}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isFree ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                            {isFree ? 'FREE' : 'PREMIUM'}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                                                                <Clock size={10} /> {Math.floor(selectedExam.duration / 60)}m
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-bold text-base text-gray-200 mb-2 group-hover:text-white transition-colors leading-tight min-h-[40px]">
                                                        {passage.title}
                                                    </h3>

                                                    <div className="flex justify-between items-center mt-6 border-t border-gray-800 pt-4">
                                                        <div className="text-[11px] text-gray-500 font-bold">
                                                            {passage.wordCount} words
                                                        </div>
                                                        {isFree ? (
                                                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-[10px] font-bold hover:bg-brand-purple transition-all shadow-lg">
                                                                <Play size={10} className="fill-current" /> Start Test
                                                            </button>
                                                        ) : (
                                                            <Link to="/pricing" className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 hover:text-yellow-400 transition-colors">
                                                                <Star size={10} className="fill-current" /> Upgrade
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main >
        </div >
    );
};

export default PracticeExams;
