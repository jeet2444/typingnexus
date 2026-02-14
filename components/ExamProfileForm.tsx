
import React, { useState } from 'react';
import { ExamProfile, CategoryRule, HalfMistakeRule } from '../types/profile';
import { SelectField } from './SelectField';
import { NumberInput } from './NumberInput';
import { Section } from './Section';
import { Save, X, Plus, Trash2, Shield, Settings, Info, Upload } from 'lucide-react';

const defaultProfile: ExamProfile = {
    profileName: '',
    description: '',
    calculationParam: 'net_wpm',
    wordCalculation: '5char',
    minEligibilityType: 'none',
    languageMode: 'fixed',
    hindiFont: 'none',
    hindiComplexity: 'standard',
    allowAltCodes: false,
    hindiStenoAvailable: false,
    errorClassification: 'simple',
    ignoredErrorLimit: 0,
    penaltyMultiplier: 0,
    penaltyMethod: 'none',
    finalScoreCalc: 'direct',
    scoreDisplay: '2dec',
    showAccuracy: true,
    stenoEnabled: false,
    durationMin: 10,
    practiceSession: 'none',
    breakDurationSec: 0,
    backspaceEnabled: true,
    arrowKeysEnabled: true,
    highlight: 'word',
    showFingerPosition: false,
    showOnscreenKeyboard: false,
    liveErrors: true,
    showSpeedDuringTest: false,
    minKeystrokes: 0,
    categoryWiseEnabled: false,
    scribeAllowed: false,
    examType: 'recruitment',
    resultDisplay: 'detailed',
};

interface ExamProfileFormProps {
    initialProfile?: ExamProfile;
    onSave: (profile: ExamProfile) => void;
    onCancel: () => void;
}

const ExamProfileForm: React.FC<ExamProfileFormProps> = ({ initialProfile, onSave, onCancel }) => {
    const [profile, setProfile] = useState<ExamProfile>(initialProfile || defaultProfile);

    const handleChange = (field: keyof ExamProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = <T,>(field: keyof ExamProfile, item: T, checked: boolean) => {
        setProfile(prev => {
            const current = (prev[field] as T[]) || [];
            const updated = checked
                ? [...current, item]
                : current.filter(i => i !== item);
            return { ...prev, [field]: updated };
        });
    };

    const addCategoryRule = () => {
        const newRule: CategoryRule = { category: 'UR' };
        setProfile(prev => ({
            ...prev,
            categoryRules: [...(prev.categoryRules || []), newRule]
        }));
    };

    const updateCategoryRule = (index: number, field: keyof CategoryRule, value: any) => {
        setProfile(prev => {
            const updated = [...(prev.categoryRules || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, categoryRules: updated };
        });
    };

    const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.profileName || data.calculationParam) {
                    setProfile({ ...defaultProfile, ...data });
                } else {
                    alert("Invalid JSON format for Exam Profile.");
                }
            } catch (err) {
                alert("Error parsing JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const removeCategoryRule = (index: number) => {
        setProfile(prev => ({
            ...prev,
            categoryRules: (prev.categoryRules || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 mt-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-brand-purple/20 rounded-lg">
                            <Settings className="text-brand-purple" size={24} />
                        </div>
                        Configure <span className="text-brand-purple">Exam Profile</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 ml-14">Define specialized rules for calculation, penalties, and interface controls.</p>
                </div>
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-5 py-2.5 bg-cyan-900/20 border border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/40 rounded-xl font-bold transition-all cursor-pointer">
                        <Upload size={18} /> Import JSON
                        <input type="file" accept=".json" className="hidden" onChange={handleJsonImport} />
                    </label>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-bold transition-all"
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(profile)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-purple hover:bg-purple-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all transform hover:scale-105"
                    >
                        <Save size={18} /> Save Profile
                    </button>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-0 text-left">

                {/* Profile Info */}
                <Section title="Basic Identity">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Profile Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., SSC CGL Typing Rule"
                                value={profile.profileName}
                                onChange={(e) => handleChange('profileName', e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Internal Description
                            </label>
                            <textarea
                                placeholder="Mention specific exam department rules here..."
                                value={profile.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm h-24"
                            />
                        </div>
                    </div>
                </Section>

                {/* 1. PRIMARY MODE */}
                <Section title="1. PRIMARY MODE">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Calculation Parameter"
                            value={profile.calculationParam}
                            options={[
                                { value: 'net_wpm', label: 'Net WPM' },
                                { value: 'gross_kdph', label: 'Gross KDPH' },
                                { value: 'gross_kph', label: 'Gross KPH' },
                            ]}
                            onChange={(v) => handleChange('calculationParam', v as any)}
                        />
                        <SelectField
                            label="Word Calculation Method"
                            value={profile.wordCalculation}
                            options={[
                                { value: '5char', label: '5 Characters = 1 Word' },
                                { value: 'actual', label: 'Actual Word Count' },
                            ]}
                            onChange={(v) => handleChange('wordCalculation', v as any)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Minimum Eligibility"
                            value={profile.minEligibilityType}
                            options={[
                                { value: 'none', label: 'None' },
                                { value: 'fixed_wpm', label: 'Fixed WPM' },
                                { value: 'fixed_kdph', label: 'Fixed KDPH' },
                            ]}
                            onChange={(v) => handleChange('minEligibilityType', v as any)}
                        />
                        {profile.minEligibilityType !== 'none' && (
                            <NumberInput
                                label={`Target ${profile.minEligibilityType === 'fixed_wpm' ? 'WPM' : 'KDPH'}`}
                                value={profile.minEligibilityValue || 0}
                                onChange={(v) => handleChange('minEligibilityValue', v)}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput
                            label="Min. Keystrokes (incl. spaces)"
                            value={profile.minKeystrokes || 0}
                            onChange={(v) => handleChange('minKeystrokes', v)}
                        />
                        <div className="flex items-end">
                            <p className="text-[10px] text-gray-500 pb-2">If user types fewer keystrokes than this, they are automatically disqualified. Set 0 to disable.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/50 pt-4 mt-2">
                        <SelectField
                            label="Language Selection Mode"
                            value={profile.languageMode}
                            options={[
                                { value: 'fixed', label: 'Fixed Language' },
                                { value: 'candidate', label: "Candidate's Choice" },
                                { value: 'default_with_change', label: 'Default with Option to Change' },
                            ]}
                            onChange={(v) => handleChange('languageMode', v as any)}
                        />

                        {profile.languageMode === 'fixed' && (
                            <SelectField
                                label="Fixed Language"
                                value={profile.fixedLanguage || 'en'}
                                options={[
                                    { value: 'en', label: 'English' },
                                    { value: 'hi', label: 'Hindi' },
                                    { value: 'both', label: 'Both' },
                                ]}
                                onChange={(v) => handleChange('fixedLanguage', v as any)}
                            />
                        )}

                        {profile.languageMode === 'candidate' && (
                            <div className="mb-4 bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Allowed Languages</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                            checked={profile.allowedLanguages?.includes('en')}
                                            onChange={(e) => handleArrayChange('allowedLanguages', 'en', e.target.checked)}
                                        />
                                        <span className="text-gray-300 group-hover:text-white transition-colors">English</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                            checked={profile.allowedLanguages?.includes('hi')}
                                            onChange={(e) => handleArrayChange('allowedLanguages', 'hi', e.target.checked)}
                                        />
                                        <span className="text-gray-300 group-hover:text-white transition-colors">Hindi</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {profile.languageMode === 'default_with_change' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <SelectField
                                    label="Default Language"
                                    value={profile.defaultLanguage || 'en'}
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'hi', label: 'Hindi' },
                                    ]}
                                    onChange={(v) => handleChange('defaultLanguage', v as any)}
                                />
                                <label className="flex items-center gap-3 cursor-pointer mb-6 group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                        checked={profile.allowLanguageChange}
                                        onChange={(e) => handleChange('allowLanguageChange', e.target.checked)}
                                    />
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Allow Candidate to Change</span>
                                </label>
                            </div>
                        )}
                    </div>
                </Section>

                {/* 2. HINDI TYPING CONFIGURATION */}
                {(profile.languageMode !== 'fixed' || profile.fixedLanguage !== 'en') && (
                    <Section title="2. HINDI TYPING CONFIGURATION">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                                label="Hindi Font Type"
                                value={profile.hindiFont}
                                options={[
                                    { value: 'mangal', label: 'Mangal (Unicode)' },
                                    { value: 'krutidev', label: 'Krutidev' },
                                    { value: 'devlys', label: 'Devlys' },
                                    { value: 'arial', label: 'Arial Unicode MS' },
                                    { value: 'agra', label: 'Agra' },
                                    { value: 'none', label: 'None' },
                                ]}
                                onChange={(v) => handleChange('hindiFont', v as any)}
                            />
                            {profile.hindiFont !== 'none' && (
                                <SelectField
                                    label="Keyboard Layout"
                                    value={profile.hindiKeyboardLayout || 'remington_gail'}
                                    options={[
                                        { value: 'remington_gail', label: 'Remington Gail' },
                                        { value: 'inscript', label: 'Inscript' },
                                        { value: 'remington_cbi', label: 'Remington CBI' },
                                        { value: 'typewriter', label: 'Typewriter' },
                                    ]}
                                    onChange={(v) => handleChange('hindiKeyboardLayout', v as any)}
                                />
                            )}
                        </div>

                        {profile.hindiFont !== 'none' && (
                            <>
                                <SelectField
                                    label="Hindi Complexity Level"
                                    value={profile.hindiComplexity}
                                    options={[
                                        { value: 'basic', label: 'Basic' },
                                        { value: 'standard', label: 'Standard' },
                                        { value: 'advanced', label: 'Advanced' },
                                    ]}
                                    onChange={(v) => handleChange('hindiComplexity', v as any)}
                                />
                                <div className="flex flex-wrap gap-6 mt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                            checked={profile.allowAltCodes}
                                            onChange={(e) => handleChange('allowAltCodes', e.target.checked)}
                                        />
                                        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Allow Alt Codes</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                            checked={profile.hindiStenoAvailable}
                                            onChange={(e) => handleChange('hindiStenoAvailable', e.target.checked)}
                                        />
                                        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Shorthand (Steno) Available</span>
                                    </label>
                                </div>
                            </>
                        )}
                    </Section>
                )}

                {/* 3. ERROR & PENALTY ENGINE */}
                <Section title="3. ERROR & PENALTY ENGINE">
                    <SelectField
                        label="Error Classification"
                        value={profile.errorClassification}
                        options={[
                            { value: 'simple', label: 'Simple Mistake' },
                            { value: 'ssc_aiims', label: 'SSC/AIIMS Style (Full & Half)' },
                            { value: 'advanced', label: 'Advanced Mixed Mode' },
                        ]}
                        onChange={(v) => handleChange('errorClassification', v as any)}
                    />

                    {profile.errorClassification === 'ssc_aiims' && (
                        <div className="mb-6 bg-gray-900/40 p-5 rounded-xl border border-gray-800">
                            <div className="flex items-center gap-2 mb-4 text-brand-purple">
                                <Shield size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Half Mistake Definitions</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(['spacing', 'capitalization', 'punctuation', 'matra', 'conjunct', 'indent'] as HalfMistakeRule[]).map(rule => (
                                    <label key={rule} className="flex items-center gap-3 cursor-pointer group p-2 bg-gray-950/50 rounded-lg hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                            checked={profile.halfMistakeRules?.includes(rule)}
                                            onChange={(e) => handleArrayChange('halfMistakeRules', rule, e.target.checked)}
                                        />
                                        <span className="text-xs text-gray-400 group-hover:text-gray-200 uppercase tracking-tight font-bold">
                                            {rule === 'spacing' && 'Spacing'}
                                            {rule === 'capitalization' && 'Caps/Case'}
                                            {rule === 'punctuation' && 'Punctuation'}
                                            {rule === 'matra' && 'Matras'}
                                            {rule === 'conjunct' && 'Conjuncts'}
                                            {rule === 'indent' && 'Indentation'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-brand-purple/5 p-4 rounded-xl border border-brand-purple/10 flex items-start gap-3">
                        <Info className="text-brand-purple mt-0.5" size={18} />
                        <div>
                            <NumberInput
                                label="Ignored Error Limit (%)"
                                value={profile.ignoredErrorLimit}
                                onChange={(v) => handleChange('ignoredErrorLimit', v)}
                                min={0}
                                max={100}
                                step={0.1}
                            />
                            <p className="text-[10px] text-gray-500 italic">Errors within this percentage of total words typed will not result in a penalty.</p>
                        </div>
                    </div>
                </Section>

                {/* 4. PENALTY & SCORING RULES */}
                <Section title="4. PENALTY & SCORING RULES">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Penalty Application"
                            value={profile.penaltyMethod}
                            options={[
                                { value: 'none', label: 'No Speed Penalty' },
                                { value: 'per_mistake', label: 'Per Mistake Deduction' },
                                { value: 'per_full_mistake', label: 'Per Full Mistake' },
                                { value: 'penalty_factor', label: 'Penalty Factor (e.g., 5x, 10x)' },
                            ]}
                            onChange={(v) => handleChange('penaltyMethod', v as any)}
                        />
                        {profile.penaltyMethod !== 'none' && (
                            <NumberInput
                                label={profile.penaltyMethod === 'penalty_factor' ? 'Factor Value' : 'Deduction Value'}
                                value={profile.deductionValue || 0}
                                onChange={(v) => handleChange('deductionValue', v)}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800/50 pt-4 mt-2">
                        <SelectField
                            label="Final Score Calculation"
                            value={profile.finalScoreCalc}
                            options={[
                                { value: 'direct', label: 'Direct Deduction' },
                                { value: 'penalty_factor', label: 'Penalty Factor' },
                                { value: 'qualifying', label: 'Qualifying (Pass/Fail)' },
                                { value: 'marks', label: 'Marks-based (0-100)' },
                            ]}
                            onChange={(v) => handleChange('finalScoreCalc', v as any)}
                        />
                        <SelectField
                            label="Decimal Display"
                            value={profile.scoreDisplay}
                            options={[
                                { value: 'whole', label: 'Whole No.' },
                                { value: '1dec', label: '1 Decimal' },
                                { value: '2dec', label: '2 Decimals' },
                            ]}
                            onChange={(v) => handleChange('scoreDisplay', v as any)}
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group mt-4">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                            checked={profile.showAccuracy}
                            onChange={(e) => handleChange('showAccuracy', e.target.checked)}
                        />
                        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors text-left">Show Accuracy Percentage on Result</span>
                    </label>
                </Section>

                {/* 5. STENO TEST CONFIGURATION */}
                <Section title="5. STENO TEST CONFIGURATION">
                    <div className="flex items-center gap-3 cursor-pointer group mb-6">
                        <input
                            type="checkbox"
                            id="stenoEnable"
                            className="w-6 h-6 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                            checked={profile.stenoEnabled}
                            onChange={(e) => handleChange('stenoEnabled', e.target.checked)}
                        />
                        <label htmlFor="stenoEnable" className="text-lg font-bold text-gray-200">Enable Specialized Shorthand Logic</label>
                    </div>

                    {profile.stenoEnabled && (
                        <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField
                                    label="Steno Test Type"
                                    value={profile.stenoType || 'qualifying'}
                                    options={[
                                        { value: 'qualifying', label: 'Qualifying' },
                                        { value: 'marks', label: 'Marks-based' },
                                    ]}
                                    onChange={(v) => handleChange('stenoType', v as any)}
                                />
                                <SelectField
                                    label="Dictation Lang"
                                    value={profile.stenoLanguage || 'en'}
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'hi', label: 'Hindi' },
                                        { value: 'both', label: "Both" },
                                    ]}
                                    onChange={(v) => handleChange('stenoLanguage', v as any)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput label="Speed (WPM)" value={profile.stenoSpeed || 0} onChange={(v) => handleChange('stenoSpeed', v)} />
                                <NumberInput label="Dictation (Min)" value={profile.stenoDictationMin || 0} onChange={(v) => handleChange('stenoDictationMin', v)} />
                                <NumberInput label="Transcription (Min)" value={profile.stenoTranscriptionMin || 0} onChange={(v) => handleChange('stenoTranscriptionMin', v)} />
                            </div>

                            <div className="flex flex-wrap gap-6 border-t border-gray-800 pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                        checked={profile.stenoBackspaceAllowed ?? true}
                                        onChange={(e) => handleChange('stenoBackspaceAllowed', e.target.checked)}
                                    />
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white tracking-widest uppercase">Allow Backspace</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                                        checked={profile.stenoSpellcheckAllowed ?? false}
                                        onChange={(e) => handleChange('stenoSpellcheckAllowed', e.target.checked)}
                                    />
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white tracking-widest uppercase">Spellcheck</span>
                                </label>
                            </div>

                            <NumberInput
                                label="Error Limit (%) for Qualification"
                                value={profile.stenoErrorLimit || 0}
                                onChange={(v) => handleChange('stenoErrorLimit', v)}
                                min={0}
                                max={100}
                                step={0.1}
                            />
                        </div>
                    )}
                </Section>

                {/* 6. INTERFACE CONTROLS */}
                <Section title="6. INTERFACE & DURATION">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NumberInput label="Test Duration (Minutes)" value={profile.durationMin} onChange={(v) => handleChange('durationMin', v)} min={1} />
                        <NumberInput label="Break After Session (Seconds)" value={profile.breakDurationSec} onChange={(v) => handleChange('breakDurationSec', v)} min={0} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800/50 pt-4 mt-2">
                        <SelectField
                            label="Practice Session Behavior"
                            value={profile.practiceSession}
                            options={[
                                { value: 'none', label: 'Skip Practice' },
                                { value: 'timer', label: 'Timed Practice (Mandatory)' },
                            ]}
                            onChange={(v) => handleChange('practiceSession', v as any)}
                        />
                        {profile.practiceSession === 'timer' && (
                            <NumberInput
                                label="Practice Time (Min)"
                                value={profile.practiceDurationMin || 1}
                                onChange={(v) => handleChange('practiceDurationMin', v)}
                                min={1}
                            />
                        )}
                    </div>

                    <div className="bg-gray-900/30 p-5 rounded-2xl border border-gray-800/50 space-y-4">
                        <h4 className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em] mb-4">Functional Restrictions</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CheckItem label="Allow Backspace" checked={profile.backspaceEnabled} onChange={(c) => handleChange('backspaceEnabled', c)} />
                            <CheckItem label="Allow Arrow Keys" checked={profile.arrowKeysEnabled} onChange={(c) => handleChange('arrowKeysEnabled', c)} />
                            <CheckItem label="Live Error Indication" checked={profile.liveErrors} onChange={(c) => handleChange('liveErrors', c)} />
                            <CheckItem label="Show Speed Calculator" checked={profile.showSpeedDuringTest} onChange={(c) => handleChange('showSpeedDuringTest', c)} />
                            <CheckItem label="Show Keyboard Legend" checked={profile.showOnscreenKeyboard} onChange={(c) => handleChange('showOnscreenKeyboard', c)} />
                            <CheckItem label="Show Finger Guide" checked={profile.showFingerPosition} onChange={(c) => handleChange('showFingerPosition', c)} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-800/50">
                            <SelectField
                                label="Word/Char Highlighting"
                                value={profile.highlight}
                                options={[
                                    { value: 'word', label: 'Active Word' },
                                    { value: 'character', label: 'Active Character' },
                                    { value: 'none', label: 'No Highlighting (Blind)' },
                                ]}
                                onChange={(v) => handleChange('highlight', v as any)}
                            />
                        </div>
                    </div>
                </Section>

                {/* 7. ADVANCED SETTINGS */}
                <Section title="7. ADVANCED & CATEGORY RULES">
                    <div className="flex items-center gap-3 cursor-pointer group mb-6">
                        <input
                            type="checkbox"
                            id="catEnable"
                            className="w-6 h-6 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
                            checked={profile.categoryWiseEnabled}
                            onChange={(e) => handleChange('categoryWiseEnabled', e.target.checked)}
                        />
                        <label htmlFor="catEnable" className="text-lg font-bold text-gray-200">Enable Category-wise Eligibility</label>
                    </div>

                    {profile.categoryWiseEnabled && (
                        <div className="space-y-4 mb-8">
                            <button
                                type="button"
                                onClick={addCategoryRule}
                                className="w-full py-3 bg-brand-purple/10 border-2 border-dashed border-brand-purple/30 text-brand-purple rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-purple/20 transition-all mb-4"
                            >
                                <Plus size={18} /> Add New Category Exemption
                            </button>

                            {profile.categoryRules?.map((rule, index) => (
                                <div key={index} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 group/item relative animate-in slide-in-from-right-4">
                                    <button
                                        type="button"
                                        onClick={() => removeCategoryRule(index)}
                                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SelectField
                                            label="Candidate Category"
                                            value={rule.category}
                                            options={[
                                                { value: 'UR', label: 'Unreserved (UR)' },
                                                { value: 'SC', label: 'SC' },
                                                { value: 'ST', label: 'ST' },
                                                { value: 'OBC', label: 'OBC' },
                                                { value: 'EWS', label: 'EWS' },
                                                { value: 'PwD', label: 'PwD' },
                                            ]}
                                            onChange={(v) => updateCategoryRule(index, 'category', v as any)}
                                        />
                                        <NumberInput
                                            label="Custom Target Speed"
                                            value={rule.minEligibility || 0}
                                            onChange={(v) => updateCategoryRule(index, 'minEligibility', v)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <NumberInput
                                            label="Allowed Error %"
                                            value={rule.ignoredErrorLimit || 0}
                                            onChange={(v) => updateCategoryRule(index, 'ignoredErrorLimit', v)}
                                            min={0} max={100} step={0.1}
                                        />
                                        <NumberInput
                                            label="Extra Time (Min)"
                                            value={rule.extraTimeMin || 0}
                                            onChange={(v) => updateCategoryRule(index, 'extraTimeMin', v)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-4">
                            <CheckItem label="Scribe/Assistant Allowed" checked={profile.scribeAllowed} onChange={(c) => handleChange('scribeAllowed', c)} />
                            {profile.scribeAllowed && (
                                <NumberInput
                                    label="Extra Time for Scribe (Min)"
                                    value={profile.scribeExtraMin || 0}
                                    onChange={(v) => handleChange('scribeExtraMin', v)}
                                />
                            )}
                        </div>

                        <SelectField
                            label="Exam Domain"
                            value={profile.examType}
                            options={[
                                { value: 'recruitment', label: 'Fresh Recruitment' },
                                { value: 'departmental', label: 'Internal Exam' },
                                { value: 'promotion', label: 'Promotion Basis' },
                                { value: 'practice', label: 'Practice/Dummy' },
                            ]}
                            onChange={(v) => handleChange('examType', v as any)}
                        />
                    </div>

                    <div className="mt-8">
                        <SelectField
                            label="Final Result Presentation"
                            value={profile.resultDisplay}
                            options={[
                                { value: 'detailed', label: 'Full Breakdown Dashboard' },
                                { value: 'pass_fail', label: 'Qualification Status Only' },
                                { value: 'score', label: 'Marks/Score Only' },
                            ]}
                            onChange={(v) => handleChange('resultDisplay', v as any)}
                        />
                    </div>
                </Section>

                {/* Action Bar */}
                <div className="sticky bottom-8 left-0 right-0 bg-gray-900/80 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-2xl flex justify-center gap-4 animate-in slide-in-from-bottom-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition-all shadow-lg"
                    >
                        Reset Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(profile)}
                        className="px-12 py-3 bg-brand-purple hover:bg-purple-600 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105"
                    >
                        Save & Publish Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

interface CheckItemProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-gray-900/50 rounded-xl border border-transparent hover:border-gray-800 transition-all">
        <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-brand-purple focus:ring-brand-purple/20"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors uppercase tracking-tight">{label}</span>
    </label>
);

export default ExamProfileForm;
