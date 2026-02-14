import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, ArrowRight, X, Search, FileText, Settings, Clock, AlertTriangle, Monitor, Lock, Unlock, FileSpreadsheet } from 'lucide-react';
import { getAdminStore, ExamProfile, ContentItem } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

// Helper to extract "Base Name" for grouping
const getExamGroupName = (name: string): string => {
    return name
        .replace(/\b(Hindi|English|Typing|Skill Test|CPT|Test|Exam|Mock|Pattern)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const TypingExamSetup: React.FC = () => {
    const navigate = useNavigate();
    const { hasPremiumAccess } = useAuth();

    // State
    const [view, setView] = useState<'groups' | 'detail'>('groups');
    const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'Hindi' | 'English' | 'CPT'>('English');

    // Data
    const [profiles, setProfiles] = useState<ExamProfile[]>([]);
    const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([]);
    const [cptTests, setCptTests] = useState<any[]>([]);
    const [examGroups, setExamGroups] = useState<string[]>([]);

    useEffect(() => {
        const store = getAdminStore();
        setProfiles(store.examProfiles || []);
        setContentLibrary(store.contentLibrary || []);
        setCptTests(store.cptTests || []);

        // Extract Groups
        const groups = new Set<string>();
        (store.examProfiles || []).forEach(p => groups.add(getExamGroupName(p.profileName)));
        (store.cptTests || []).forEach(t => groups.add(getExamGroupName(t.title)));

        // Filter out empty or too short names to avoid garbage
        const sortedGroups = Array.from(groups).filter(g => g.length > 2).sort();
        setExamGroups(sortedGroups);
    }, []);

    // --- Detail View Helpers ---

    const getProfilesInGroup = (groupName: string) => {
        return profiles.filter(p => getExamGroupName(p.profileName) === groupName);
    };

    const getCptInGroup = (groupName: string) => {
        return cptTests.filter(t => getExamGroupName(t.title) === groupName);
    };

    const hasHindi = (groupName: string) => getProfilesInGroup(groupName).some(p => p.fixedLanguage === 'hi' || p.allowedLanguages?.includes('hi'));
    const hasEnglish = (groupName: string) => getProfilesInGroup(groupName).some(p => p.fixedLanguage === 'en' || p.allowedLanguages?.includes('en'));
    const hasCPT = (groupName: string) => getCptInGroup(groupName).length > 0;

    const handleGroupSelect = (group: string) => {
        setSelectedGroupName(group);
        // Default to first available tab
        if (hasEnglish(group)) setActiveTab('English');
        else if (hasHindi(group)) setActiveTab('Hindi');
        else if (hasCPT(group)) setActiveTab('CPT');
        setView('detail');
    };

    const handleStartTyping = (content: ContentItem, index: number) => {
        if (!selectedGroupName) return;

        // Find the profile for this group and language
        // Prefer one with strict matching, else first available for lang
        const profile = profiles.find(p => {
            const isMatch = getExamGroupName(p.profileName) === selectedGroupName;
            const langCode = activeTab === 'Hindi' ? 'hi' : 'en';
            const isLangMatch = p.fixedLanguage === langCode || p.allowedLanguages?.includes(langCode as any);
            return isMatch && isLangMatch;
        });

        if (!profile) {
            alert(`No ${activeTab} Profile found for ${selectedGroupName}`);
            return;
        }

        // --- Trial Logic ---
        // If Premium: No Limit (mode=full)
        // If Free: 
        //   - Content Index < 2: Free (mode=full)
        //   - Content Index >= 2: Trial (mode=trial, duration=60)

        let mode = 'full';
        let trialDuration = '';

        if (!hasPremiumAccess) {
            if (index >= 2) {
                mode = 'trial';
                trialDuration = '60';
            }
        }

        const params = new URLSearchParams({
            profileId: profile.id,
            contentId: content.id,
            mode,
            trialDuration
        });
        navigate(`/typing-test?${params.toString()}`);
    };

    const handleStartCPT = (testId: number) => {
        const test = cptTests.find(t => t.id === testId);
        if (!test) return;

        // Route to CPT Runner
        // Logic for trial handled inside the runner (WordFormattingTest/ExcelTest)
        navigate(`/test/${test.type.toLowerCase()}/${testId}`);
    };

    // Filter Content based on Tab
    const filteredContent = contentLibrary.filter(c => c.language === activeTab);
    const filteredCPT = selectedGroupName ? getCptInGroup(selectedGroupName) : [];

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col font-sans relative overflow-hidden text-gray-200">

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-md z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => view === 'detail' ? setView('groups') : navigate('/')} className="hover:bg-gray-800 p-2 rounded-lg transition-colors">
                        <X className="text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white leading-tight">
                            {view === 'groups' ? 'Select Exam Pattern' : selectedGroupName}
                        </h1>
                        {view === 'detail' && <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Select Mode & Content</p>}
                    </div>
                </div>
            </div>

            {/* VIEW 1: EXAM GROUPS */}
            {view === 'groups' && (
                <div className="flex-1 overflow-y-auto p-4 md:p-10 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {examGroups.map(group => {
                            const _hasHindi = hasHindi(group);
                            const _hasEnglish = hasEnglish(group);
                            const _hasCPT = hasCPT(group);

                            return (
                                <div
                                    key={group}
                                    onClick={() => handleGroupSelect(group)}
                                    className="group relative bg-gray-900 border border-gray-800 hover:border-brand-purple rounded-2xl p-6 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-display font-bold text-white mb-4 line-clamp-2 min-h-[56px]">{group}</h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {_hasEnglish && <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-900/20 text-blue-400 border border-blue-900/30">ENG</span>}
                                        {_hasHindi && <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-900/20 text-orange-400 border border-orange-900/30">HINDI</span>}
                                        {_hasCPT && <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-900/20 text-green-400 border border-green-900/30">CPT</span>}
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            );
                        })}

                        {examGroups.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No Exams Configured.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW 2: DETAIL (TABS & CONTENT) */}
            {view === 'detail' && selectedGroupName && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

                    {/* Tabs */}
                    <div className="bg-gray-900 border-b border-gray-800 px-6 pt-4 flex gap-6 overflow-x-auto shrink-0">
                        {hasEnglish(selectedGroupName) && (
                            <button
                                onClick={() => setActiveTab('English')}
                                className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'English' ? 'border-brand-purple text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                English Typing
                                {activeTab === 'English' && <span className="absolute -top-1 -right-2 w-2 h-2 bg-brand-purple rounded-full animate-pulse" />}
                            </button>
                        )}
                        {hasHindi(selectedGroupName) && (
                            <button
                                onClick={() => setActiveTab('Hindi')}
                                className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'Hindi' ? 'border-brand-purple text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Hindi Typing
                            </button>
                        )}
                        {hasCPT(selectedGroupName) && (
                            <button
                                onClick={() => setActiveTab('CPT')}
                                className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'CPT' ? 'border-brand-purple text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Computer Proficiency (CPT)
                            </button>
                        )}
                    </div>

                    {/* Content List */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-black/20">
                        <div className="max-w-7xl mx-auto">

                            {/* TYPING LIST */}
                            {activeTab !== 'CPT' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredContent.map((content, index) => {
                                        // Trial Logic Display
                                        const isFree = hasPremiumAccess || index < 2;

                                        return (
                                            <div
                                                key={content.id}
                                                onClick={() => handleStartTyping(content, index)}
                                                className={`relative bg-gray-900 border ${isFree ? 'border-gray-800 hover:border-gray-600' : 'border-yellow-900/30 hover:border-yellow-500/50'} rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 group`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isFree ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-500'}`}>
                                                        {isFree ? 'FULL ACCESS' : '60s TRIAL'}
                                                    </span>
                                                    {!isFree && <Lock size={14} className="text-yellow-500" />}
                                                </div>

                                                <h4 className="font-bold text-white text-lg mb-1 line-clamp-1 group-hover:text-brand-purple transition-colors">{content.title}</h4>
                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2 font-mono opacity-70">{content.text.substring(0, 80)}...</p>

                                                <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-800 pt-3 mt-auto">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {Math.ceil(content.text.split(' ').length / 30)} Mins</span>
                                                    <span>{content.text.split(' ').length} Words</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {filteredContent.length === 0 && <div className="col-span-full text-center text-gray-500 py-20">No matching content found.</div>}
                                </div>
                            )}

                            {/* CPT LIST */}
                            {activeTab === 'CPT' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredCPT.map((test, index) => {
                                        // Trial Logic Display for CPT
                                        // All are clickable, but runner handles trial validation
                                        // We display "Trial" badge if not premium
                                        const isUnlocked = hasPremiumAccess;

                                        return (
                                            <div
                                                key={test.id}
                                                onClick={() => handleStartCPT(test.id)}
                                                className={`relative bg-gray-900 border ${isUnlocked ? 'border-gray-800 hover:border-gray-600' : 'border-yellow-900/30 hover:border-yellow-500/50'} rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 group`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded ${test.type === 'Excel' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                            {test.type === 'Excel' ? <FileSpreadsheet size={16} /> : <FileText size={16} />}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-400">{test.type}</span>
                                                    </div>
                                                    {!isUnlocked && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-900/20 text-yellow-500">20s TRIAL</span>}
                                                </div>

                                                <h4 className="font-bold text-white text-lg mb-1 line-clamp-1 group-hover:text-brand-purple transition-colors">{test.title}</h4>

                                                <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-800 pt-3 mt-4">
                                                    <span>{test.type === 'Excel' ? 'Spreadsheet' : 'Formatting'}</span>
                                                    <span className="flex items-center gap-1">Start Test <ArrowRight size={12} /></span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {filteredCPT.length === 0 && <div className="col-span-full text-center text-gray-500 py-20">No CPT Tests found for this exam.</div>}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TypingExamSetup;
