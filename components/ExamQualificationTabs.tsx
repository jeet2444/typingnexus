
import React, { useState } from 'react';
import { ExamProfile } from '../types/profile';
import { calculateExamResult, RawStats } from '../utils/masterRulesEngine';

interface Props {
    stats: RawStats;
    profiles: ExamProfile[];
    currentProfile?: ExamProfile; // Updated prop name for clarity
    result: { // Pass calculated result to avoid re-calc if possible, or use stats
        grossWPM: number;
        netWPM: number;
        accuracy: number;
        totalErrors: number;
        grossSpeed?: number;
    };
}

const ExamQualificationTabs: React.FC<Props> = ({ stats, profiles, currentProfile, result }) => {
    // If no profiles provided, we can't show anything.
    if (!profiles || profiles.length === 0) return null;

    const [selectedProfileId, setSelectedProfileId] = useState<string>(currentProfile?.id || profiles[0].id);

    const activeProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

    // Recalculate based on specific profile rules (eligibility might differ)
    // We reuse the passed stats.
    const calculatedResult = calculateExamResult(activeProfile, {
        ...stats,
        // Ensure accurate word count for specific profile method if needed, 
        // though stats.totalWordsTyped is usually fixed per test.
        // If profile uses 5-char, calculateExamResult handles it.
    });

    // Helper to format numbers
    const fmt = (n: number) => n.toFixed(2);

    return (
        <div className="bg-[#0a0a0f] border border-gray-800 rounded-xl overflow-hidden mb-10 shadow-2xl animate-in fade-in duration-500 text-left">
            <div className="p-4 bg-gray-900/50 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-purple rounded-full"></span>
                    Unified Qualification Check
                </h3>
                <p className="text-xs text-gray-500 ml-3">Check your result against multiple exam standards instantly.</p>
            </div>

            {/* Tabs - Wrapping Grid */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/30">
                <div className="flex flex-wrap gap-2">
                    {profiles.map(profile => {
                        const r = calculateExamResult(profile, stats);
                        const isActive = selectedProfileId === profile.id;
                        return (
                            <button
                                key={profile.id}
                                onClick={() => setSelectedProfileId(profile.id || '')}
                                title={profile.profileName}
                                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border ${isActive
                                    ? 'border-brand-purple bg-brand-purple/15 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                    : 'border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/60 hover:border-gray-600'
                                    }`}
                            >
                                <span className="max-w-[180px] truncate">{profile.profileName}</span>
                                <span className={`text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${r.isQualified
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {r.isQualified ? '✓' : '✗'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 space-y-6">

                {/* Compact Status Banner */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${calculatedResult.isQualified ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`text-xl font-black ${calculatedResult.isQualified ? 'text-green-400' : 'text-red-400'}`}>
                            {calculatedResult.isQualified ? '✓ QUALIFIED' : '✗ FAILED'}
                        </span>
                        {calculatedResult.marks !== undefined && calculatedResult.marks > 0 && (
                            <span className="text-xs text-brand-purple font-bold">Marks: {calculatedResult.marks}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Net: <span className="text-white font-bold">{calculatedResult.netSpeed} {activeProfile.calculationParam.includes('kph') ? 'KPH' : 'WPM'}</span></span>
                        <span className="text-gray-400">Gross: <span className="text-white font-bold">{calculatedResult.grossSpeed} {activeProfile.calculationParam.includes('kph') ? 'KPH' : 'WPM'}</span></span>
                        <span className="text-gray-400">Accuracy: <span className={`font-bold ${calculatedResult.accuracy >= 95 ? 'text-green-400' : 'text-yellow-400'}`}>{calculatedResult.accuracy}%</span></span>
                        <span className="text-gray-400">Errors: <span className="text-red-400 font-bold">{calculatedResult.totalErrors}</span></span>
                    </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Metric</th>
                                <th className="px-6 py-3 text-right">Value</th>
                                <th className="px-6 py-3 text-right">Rule Applied</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900/20">
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Gross Speed</td>
                                <td className="px-6 py-3 text-right font-bold text-white">
                                    {calculatedResult.grossSpeed} {activeProfile.calculationParam.includes('kph') ? 'KPH' : 'WPM'}
                                </td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                    {activeProfile.wordCalculation === '5char' ? '5 Chars / Word' : 'Space Delimited'}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Net Speed</td>
                                <td className="px-6 py-3 text-right font-bold text-cyan-400">
                                    {calculatedResult.netSpeed} {activeProfile.calculationParam.includes('kph') ? 'KPH' : 'WPM'}
                                </td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                    Gross − Penalty
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Total Words Typed</td>
                                <td className="px-6 py-3 text-right font-bold text-white">{stats.totalWordsTyped}</td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">Space-delimited count</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Total Keystrokes</td>
                                <td className="px-6 py-3 text-right font-bold text-white">{stats.totalKeystrokes}</td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                    Correct: {stats.correctKeystrokes}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Penalty</td>
                                <td className="px-6 py-3 text-right font-bold text-red-400">-{fmt(calculatedResult.penaltyDeduction)}</td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                    {activeProfile.penaltyMethod}
                                    {activeProfile.deductionValue ? ` (${activeProfile.deductionValue})` : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-gray-300">Ignored Errors</td>
                                <td className="px-6 py-3 text-right font-bold text-gray-400">{calculatedResult.ignoredErrors}</td>
                                <td className="px-6 py-3 text-right text-gray-500 text-xs">{activeProfile.ignoredErrorLimit}% Limit</td>
                            </tr>
                            {activeProfile.minEligibilityType !== 'none' && (
                                <tr>
                                    <td className="px-6 py-3 font-medium text-gray-300">Min. Eligibility</td>
                                    <td className="px-6 py-3 text-right font-bold text-yellow-500">
                                        {activeProfile.minEligibilityValue}
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                        {activeProfile.minEligibilityType === 'fixed_wpm' ? 'Net WPM' : 'Keys/Hr'}
                                    </td>
                                </tr>
                            )}
                            {(activeProfile.minKeystrokes || 0) > 0 && (
                                <tr className={calculatedResult.disqualifiedMinKeystrokes ? 'bg-red-500/5' : ''}>
                                    <td className="px-6 py-3 font-medium text-gray-300">
                                        Min. Keystrokes
                                        {calculatedResult.disqualifiedMinKeystrokes && (
                                            <span className="ml-2 text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-md font-black uppercase">Disqualified</span>
                                        )}
                                    </td>
                                    <td className={`px-6 py-3 text-right font-bold ${calculatedResult.disqualifiedMinKeystrokes ? 'text-red-400' : 'text-green-400'}`}>
                                        {stats.totalKeystrokes} / {activeProfile.minKeystrokes}
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-500 text-xs">
                                        Includes spaces
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Profile Description / Notes */}
                <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-lg p-4">
                    <h4 className="text-brand-purple font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        Profile Description
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {activeProfile.description || "No specific description available for this profile."}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ExamQualificationTabs;
