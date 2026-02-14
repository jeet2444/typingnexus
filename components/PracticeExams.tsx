import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Play, FileText, Globe, Target, Star, Award, ArrowRight, Clock, ChevronRight, Search, Filter, CheckCircle2, Monitor, Box, X, Lock, Unlock, FileSpreadsheet, Users, Sparkles, Edit3 } from 'lucide-react';
import { getAdminStore, Passage, ExamProfile, CPTTest, ContentItem, INITIAL_EXAM_PROFILES } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

// --- Improved Helper to Group Exams ---
const getExamGroupName = (name: string): string => {
    return name
        .replace(/\b(Hindi|English|Typing|Skill Test|CPT|Test|Exam|Mock|Pattern)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const PracticeExams: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, hasPremiumAccess } = useAuth();

    // UI State
    const [view, setView] = useState<'groups' | 'detail'>('groups');
    const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'Hindi' | 'English' | 'Excel' | 'Word'>('English');
    const [searchTerm, setSearchTerm] = useState('');

    // State for Custom Text Modal
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customText, setCustomText] = useState('');

    const handleCustomTextSubmit = () => {
        if (!customText || customText.length < 50) {
            alert("Text too short! Please paste at least 50 characters.");
            return;
        }

        handleStartTyping({
            ...displayContent[0],
            id: 'custom-text',
            title: 'Custom Text Practice',
            text: customText,
            isCustom: true
        } as any);
        setShowCustomModal(false);
        setCustomText('');
    };

    // Data State
    const [profiles, setProfiles] = useState<any[]>([]);
    const [cptTests, setCptTests] = useState<CPTTest[]>([]);
    const [passages, setPassages] = useState<Passage[]>([]);
    const [examGroups, setExamGroups] = useState<string[]>([]);
    const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([]);
    const [adminExams, setAdminExams] = useState<any[]>([]); // New state for Admin-defined Exams
    const [settings, setSettings] = useState<any>(null);


    useEffect(() => {
        const loadData = () => {
            const store = getAdminStore();
            setSettings(store.settings);

            // 1. Load Modern Profiles (handle both old and new ExamProfile format)
            let rawProfiles = store.examProfiles || [];
            if (rawProfiles.length === 0) {
                rawProfiles = INITIAL_EXAM_PROFILES;
            }

            const modernProfiles: any[] = rawProfiles.map((p: any) => {
                // Normalize: new format uses profileName, old uses name
                const name = p.name || p.profileName || 'Untitled';
                // Normalize language: new format uses fixedLanguage ('hi'/'en'), old uses language ('Hindi'/'English')
                let language = p.language;
                if (!language) {
                    if (p.fixedLanguage === 'hi') language = 'Hindi';
                    else if (p.fixedLanguage === 'en') language = 'English';
                    else language = name.toLowerCase().includes('hindi') ? 'Hindi' : 'English';
                }
                return { ...p, name, language };
            });

            // 2. Load Legacy Rules and Map to Profile Format
            const legacyRules = store.rules || [];
            const legacyMappedProfiles: any[] = legacyRules.map(r => ({
                id: `legacy-${r.id}`,
                name: r.name,
                language: (r.language === 'Hindi' ? 'Hindi' : 'English') as 'Hindi' | 'English',
                duration: r.duration,
                allowBackspace: (r.backspaceParam || r.backspace) as any,
                allowHighlight: (r.highlighting || 'None') as any,
                calculationMode: 'Speed',
                wordMethod: 'Keystroke',
                minEligibility: {
                    type: 'Words',
                    value: r.qualifyingSpeed || 35
                },
                errorMethod: (r.errorMethod === 'Full' ? 'Full' : r.errorMethod === 'Half' ? 'Half' : 'Ignored') as any,
                penalty: {
                    type: 'Words',
                    value: r.penaltyPerFullMistake || 1
                },
                ignoreErrorLimit: r.maxIgnoredErrors || 0,
                scoringFormula: 'WPM',
                showErrorCount: true,
                layout: 'Standard'
            }));

            // Combine All Profiles
            const allProfiles: any[] = [...modernProfiles, ...legacyMappedProfiles];
            setProfiles(allProfiles);

            setCptTests(store.cptTests || []);
            setPassages(store.passages || []);
            setContentLibrary(store.contentLibrary || []);
            setAdminExams(store.exams || []);

            // Extract Groups from ALL Profiles
            const groups = new Set<string>();
            allProfiles.forEach(p => groups.add(getExamGroupName(p.name)));
            // Also add groups from Admin Exams (Categories)
            (store.exams || []).forEach((e: any) => {
                const catName = store.categories?.find((c: any) => c.id === e.categoryId)?.name;
                if (catName) groups.add(catName);
            });


            // Filter & Sort
            const sortedGroups = Array.from(groups)
                .filter(g => g.length >= 2)
                .sort();
            setExamGroups(sortedGroups);
        };

        loadData();

        // Real-time Update Listeners
        window.addEventListener('adminStoreUpdate', loadData);
        window.addEventListener('storage', loadData);

        return () => {
            window.removeEventListener('adminStoreUpdate', loadData);
            window.removeEventListener('storage', loadData);
        };
    }, []);

    const filteredExamGroups = useMemo(() => {
        return examGroups.filter(group =>
            group.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [examGroups, searchTerm]);

    // --- Helpers ---
    const getProfilesInGroup = (groupName: string) => profiles.filter(p => getExamGroupName(p.name) === groupName);

    // Fallback: If no CPT tests match the group name, show all CPT tests for practice
    const getCptInGroup = (groupName: string) => {
        const matching = cptTests.filter(t => getExamGroupName(t.title).toLowerCase().includes(groupName.toLowerCase()));
        return matching.length > 0 ? matching : cptTests;
    };

    const hasHindi = (groupName: string) => getProfilesInGroup(groupName).some(p => p.language === 'Hindi');
    const hasEnglish = (groupName: string) => getProfilesInGroup(groupName).some(p => p.language === 'English');
    const hasCPT = (groupName: string) => true; // Always show CPT tab for practice lab

    // --- Handlers ---
    const handleGroupSelect = (group: string) => {
        setSelectedGroupName(group);
        // Smart Default Tab
        if (hasEnglish(group)) setActiveTab('English');
        else if (hasHindi(group)) setActiveTab('Hindi');
        else setActiveTab('English'); // Default to English if no typing
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleStartTyping = (content: any) => {
        if (!selectedGroupName) return;

        // 1. If this is a direct AdminExam, it has an explicit profileId
        if (content.examProfileId) {
            const explicitProfile = profiles.find(p => p.id === content.examProfileId);
            if (explicitProfile) {
                navigate(`/typing-test?profileId=${explicitProfile.id}&contentId=${content.id}&mode=full&custom=true`);
                return;
            }
        }

        // 2. Otherwise find the specific Exam Profile for this group + language
        let targetProfile = profiles.find(p => getExamGroupName(p.name) === selectedGroupName && p.language === activeTab);

        // Fallback: If no group-specific profile, find any profile for that language
        if (!targetProfile) {
            targetProfile = profiles.find(p => p.language === activeTab);
        }

        if (!targetProfile) {
            alert(`No ${activeTab} Exam Profile found. Please create one in Admin Panel.`);
            return;
        }

        // Navigate to Unified Runner
        const params = new URLSearchParams({
            profileId: targetProfile.id,
            contentId: content.id,
            mode: 'full'
        });

        if (content.isCustom) {
            navigate(`/typing-test?${params.toString()}`, { state: { customText: content.text, customTitle: content.title } });
        } else {
            navigate(`/typing-test?${params.toString()}`);
        }
    };

    const handleStartCPT = (testId: number) => {
        const test = cptTests.find(t => t.id === testId);
        if (!test) return;
        navigate(`/test/${test.type.toLowerCase()}/${testId}`);
    };

    // TABS (Homepage Style Split)
    const renderTabs = () => {
        const tabs = [
            { id: 'English' as const, label: 'English', icon: Globe, color: 'text-blue-400 border-blue-500/30' },
            { id: 'Hindi' as const, label: 'Hindi', icon: FileText, color: 'text-orange-400 border-orange-500/30' }
        ];

        return (
            <div className="flex flex-wrap gap-4 mb-10">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all border backdrop-blur-xl relative group ${activeTab === tab.id
                            ? `bg-gray-900/60 ${tab.color} border-current shadow-lg shadow-black/20`
                            : 'bg-gray-900/20 text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} className="group-hover:scale-110 transition-transform" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    // --- Filtered Data for View ---
    const displayContent = useMemo(() => {
        if (activeTab === 'Excel' || activeTab === 'Word') return [];

        // 1. Get articles from Content Library
        const libraryItems = contentLibrary.filter(c => {
            const artLang = c.language.toLowerCase();
            const tabLang = activeTab.toLowerCase();
            // Match if tab is "Both" or article matches tab (e.g., "Hindi" matches "Hindi Remington")
            return tabLang === 'both' || artLang.includes(tabLang) || tabLang.includes(artLang);
        });

        // 2. Get exams from Admin Exams that match the language and (group or category)
        const relevantExams = adminExams.filter(e => {
            const examLang = (e.language || '').toLowerCase();
            const tabLang = activeTab.toLowerCase();
            const langMatch = tabLang === 'both' || examLang.includes(tabLang) || tabLang.includes(examLang) ||
                (e.enabledLanguages && e.enabledLanguages.some(l => l.toLowerCase().includes(tabLang)));
            if (!langMatch) return false;

            // Match by category name
            const store = getAdminStore();
            const catName = store.categories?.find((c: any) => c.id === e.categoryId)?.name;
            return catName === selectedGroupName || e.ruleSet?.includes(selectedGroupName || '');
        }).map(e => ({
            id: `exam-${e.id}`,
            title: e.title,
            text: e.content || '',
            language: (e.language as any) || activeTab,
            font: (e.language === 'Hindi' ? 'Mangal' : 'Sans') as any,
            difficulty: 'Medium',
            tags: [],
            examProfileId: e.examProfileId // Pass through for handleStartTyping
        }));

        const filtered = [...relevantExams, ...libraryItems];

        if (!searchTerm) return filtered;

        return filtered.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [contentLibrary, adminExams, activeTab, selectedGroupName, searchTerm]);

    const filteredCPTTests = useMemo(() => {
        if (activeTab !== 'Excel' && activeTab !== 'Word') return [];
        const tests = getCptInGroup(selectedGroupName || '');
        return tests.filter(t => t.type === activeTab);
    }, [cptTests, activeTab, selectedGroupName]);

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-brand-purple/30 relative overflow-hidden font-sans">
            {/* Subtle Static Background Mesh (Homepage Style) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">

                {/* Header (Aligned with Home) */}
                <div className="bg-gray-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl mb-12 flex justify-between items-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_10px_#c026d3]"></span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Neural Interface</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4">
                            {view === 'groups' ? (settings?.practiceLabTitle || 'Choose Your Exam') : selectedGroupName}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            {view === 'groups'
                                ? (settings?.practiceLabSubtitle || 'Pick your target exam category and start mastering your typing speed today.')
                                : `Advanced preparation module for ${selectedGroupName}`}
                        </p>
                    </div>
                    {view === 'detail' && (
                        <button
                            onClick={() => setView('groups')}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10 backdrop-blur-md group shadow-xl"
                        >
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Lab
                        </button>
                    )}
                </div>

                {/* Search Bar (Floating Style) */}
                <div className="mb-12 relative max-w-2xl mx-auto transform hover:scale-[1.01] transition-all duration-300">
                    <div className="absolute inset-x-0 -bottom-2 h-10 bg-brand-purple/20 blur-2xl rounded-full opacity-50"></div>
                    <div className="relative flex items-center">
                        <div className="absolute left-6 text-gray-400 group-focus-within:text-brand-purple transition-colors">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder={view === 'groups' ? "Search Exam Category (e.g. RSSB, SSC, AIIMS)..." : "Search Article or Topic..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/60 backdrop-blur-2xl border-2 border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-lg font-medium focus:outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-purple/5 transition-all placeholder:text-gray-600 shadow-2xl"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-6 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* VIEW 1: EXAM GROUPS GRID (HIGH-PERFORMANCE TILES - 4 COLS) */}
                {view === 'groups' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {filteredExamGroups.map(group => {
                            if (!group) return null;

                            const profilesInGroup = getProfilesInGroup(group);
                            const hasH = profilesInGroup.some(p => p.language === 'Hindi');
                            const hasE = profilesInGroup.some(p => p.language === 'English');
                            const groupCpts = getCptInGroup(group);
                            const hasEx = groupCpts.some(t => t.type === 'Excel');
                            const hasW = groupCpts.some(t => t.type === 'Word');

                            return (
                                <div
                                    key={group}
                                    onClick={() => handleGroupSelect(group)}
                                    className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col h-full min-h-[300px] hover:border-brand-purple/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:-translate-y-2 cursor-pointer overflow-hidden"
                                >
                                    {/* Subtle Gradient Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-1.5 h-4 bg-brand-purple rounded-full"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pattern Detected</span>
                                            </div>

                                            <h3 className="font-bold text-3xl text-white leading-tight mb-2 group-hover:text-brand-purple transition-colors">
                                                {group}
                                            </h3>

                                            {settings?.showStudentCount !== false && (
                                                <div className="flex items-center gap-2 mb-6">
                                                    <Users size={14} className="text-gray-500" />
                                                    <span className="text-xs font-medium text-gray-500">
                                                        {2000 + (group.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 850)}+ students prepared
                                                    </span>
                                                </div>
                                            )}

                                            {/* Subject Availability Indicators */}
                                            <div className="flex flex-wrap gap-2.5 mb-8">
                                                {hasE && (
                                                    <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                                                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                            <Globe size={12} /> English
                                                        </span>
                                                    </div>
                                                )}
                                                {hasH && (
                                                    <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
                                                        <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                            <FileText size={12} /> Hindi
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-brand-purple text-white rounded-xl shadow-[0_0_20px_#c026d3]/30">
                                                    <Play size={18} fill="currentColor" />
                                                </div>
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple mb-1">Practice Unit</span>
                                                    <span className="text-white font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                        Enter Lab <ArrowRight size={16} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredExamGroups.length === 0 && (
                            <div className="col-span-full text-center py-24 bg-gray-900/20 border-2 border-dashed border-white/5 rounded-[3rem]">
                                <Search size={48} className="mx-auto text-gray-700 mb-6" />
                                <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">No Active Uplink Detected</div>
                            </div>
                        )}
                    </div>
                )}


                {/* VIEW 2: TABS & ARTICLE LIST */}
                {view === 'detail' && selectedGroupName && (
                    <div className="animate-in slide-in-from-right-10 duration-500">

                        {/* TABS (Excel and Word Split) */}
                        {renderTabs()}

                        {/* ARTICLE GRID (4 COLS) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {/* TYPING ARTICLES */}
                            {(activeTab === 'Hindi' || activeTab === 'English') && (
                                <>
                                    {/* CUSTOM TEXT CARD (PAID ONLY) */}
                                    <div
                                        onClick={() => {
                                            if (hasPremiumAccess) {
                                                setShowCustomModal(true);
                                            } else {
                                                alert("This feature is available for Pro users only!");
                                            }
                                        }}
                                        className={`bg-gradient-to-br from-brand-purple/20 to-blue-500/10 backdrop-blur-xl border border-brand-purple/30 rounded-3xl p-6 relative group transition-all flex flex-col min-h-[250px] cursor-pointer hover:border-brand-purple/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-1`}
                                    >
                                        <div className="absolute top-4 right-4">
                                            {hasPremiumAccess ? (
                                                <div className="bg-brand-purple text-white p-1.5 rounded-lg shadow-lg shadow-purple-900/40 animate-pulse">
                                                    <Sparkles size={16} fill="currentColor" />
                                                </div>
                                            ) : (
                                                <div className="bg-gray-800/80 text-gray-400 p-1.5 rounded-lg border border-white/10">
                                                    <Lock size={16} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-brand-purple/20 px-3 py-1 rounded-lg text-[9px] font-bold uppercase text-brand-purple border border-brand-purple/30 tracking-wider">
                                                Pro Feature
                                            </div>
                                            <div className="p-2 bg-brand-purple/10 rounded-lg border border-brand-purple/20 text-brand-purple">
                                                <Edit3 size={16} />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-brand-purple transition-colors">
                                            Paste Custom Text
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                                            Practice with your own content while keeping the exact exam rules and interface.
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    Any Length
                                                </div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${hasPremiumAccess ? 'bg-brand-purple text-white shadow-purple-900/40 group-hover:scale-110' : 'bg-gray-800 text-gray-500'}`}>
                                                <Play size={18} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>

                                    {displayContent.map((article, index) => {
                                        const isFree = index < 10 || hasPremiumAccess; // Article limits
                                        return (
                                            <div
                                                key={article.id}
                                                onClick={() => isFree && handleStartTyping(article)}
                                                className={`bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative group transition-all flex flex-col min-h-[250px] ${isFree ? 'hover:border-brand-purple/50 cursor-pointer shadow-xl hover:-translate-y-1' : 'opacity-30 grayscale pointer-events-none'}`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-brand-purple/10 px-3 py-1 rounded-lg text-[9px] font-bold uppercase text-brand-purple border border-brand-purple/20 tracking-wider">
                                                        {article.language} Node
                                                    </div>
                                                    <div className="p-2 bg-white/5 rounded-lg border border-white/5 opacity-50">
                                                        <FileText size={16} />
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-white mb-4 line-clamp-3 leading-tight group-hover:text-brand-purple transition-colors">
                                                    {article.title}
                                                </h3>

                                                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                            {article.font}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-2">
                                                            <Target size={12} /> {article.text.split(' ').length} CHR
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-lg shadow-purple-900/40">
                                                        <Play size={18} fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* CPT CONTENT (Excel/Word Split) */}
                            {(activeTab === 'Excel' || activeTab === 'Word') && filteredCPTTests.map((test, index) => {
                                const isFree = index < 2 || hasPremiumAccess;
                                const isExcel = test.type === 'Excel';
                                return (
                                    <div
                                        key={test.id}
                                        onClick={() => isFree && handleStartCPT(test.id)}
                                        className={`bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative group transition-all flex flex-col min-h-[260px] ${isFree ? 'hover:border-white/30 cursor-pointer shadow-xl hover:-translate-y-1' : 'opacity-30 grayscale'}`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${isExcel ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                Module: {test.type}
                                            </div>
                                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white group-hover:text-black transition-all text-gray-500">
                                                {isExcel ? <FileSpreadsheet size={20} /> : <Monitor size={20} />}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-6 line-clamp-2 leading-tight">
                                            {test.title}
                                        </h3>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <div className="text-xs font-bold text-brand-purple flex items-center gap-3 uppercase tracking-wider">
                                                <Award size={16} /> Marks: {test.totalMarks}
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-white/10">
                                                <Play size={18} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* EMPTY STATES */}
                            {(activeTab === 'Hindi' || activeTab === 'English') && displayContent.length === 0 && (
                                <div className="col-span-full py-24 text-center text-gray-500 font-bold border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md">
                                    No {activeTab} articles available for this terminal.
                                </div>
                            )}

                            {(activeTab === 'Excel' || activeTab === 'Word') && filteredCPTTests.length === 0 && (
                                <div className="col-span-full py-24 text-center text-gray-500 font-bold border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md">
                                    No {activeTab} field manual available.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL FOR CUSTOM TEXT */}
                {showCustomModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#0f111a] border border-brand-purple/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] transform transition-all scale-100 relative">
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-brand-purple/20 text-brand-purple rounded-xl border border-brand-purple/20">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Custom Text</h3>
                                    <p className="text-gray-400 text-sm">Paste your own content to practice.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="Paste your text here (min 50 characters)..."
                                    className="w-full h-64 bg-black/50 border border-white/10 rounded-2xl p-6 text-gray-300 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all resize-none font-mono text-sm leading-relaxed"
                                    autoFocus
                                />

                                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                                    <span>{customText.length} characters</span>
                                    <span>Min: 50</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        onClick={() => setShowCustomModal(false)}
                                        className="py-3 px-6 rounded-xl font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCustomTextSubmit}
                                        disabled={customText.length < 50}
                                        className="py-3 px-6 rounded-xl font-bold text-white bg-brand-purple hover:bg-brand-purple/90 transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Play size={18} fill="currentColor" /> Start Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default PracticeExams;
