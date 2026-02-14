
import { ExamProfile } from '../types/profile';

export interface RawStats {
    totalKeystrokes: number;
    correctKeystrokes: number;
    backspaceCount: number;
    totalWordsTyped: number; // Space-based count
    fullMistakes: number;
    halfMistakes: number;
    timeTakenSeconds: number;
}

export interface ExamResultCalc {
    grossSpeed: number; // WPM or KPH based on calculationParam
    netSpeed: number;   // WPM or KPH
    accuracy: number;
    totalErrors: number;
    ignoredErrors: number;
    chargeableErrors: number;
    penaltyDeduction: number;
    isQualified: boolean;
    disqualifiedMinKeystrokes: boolean; // true if user didn't meet minimum keystrokes
    minKeystrokesRequired: number; // the required threshold
    marks?: number;
    grossWPM: number; // Always calculated for reference
    netWPM: number;   // Always calculated for reference
}

export const calculateExamResult = (profile: ExamProfile, stats: RawStats): ExamResultCalc => {

    const durationMins = stats.timeTakenSeconds / 60;
    const effectiveDuration = durationMins > 0 ? durationMins : 1;

    // --- 1. Calculate Gross Speed ---

    // Determine Word Count for Speed Calculation
    let grossWords = 0;
    if (profile.wordCalculation === '5char') {
        grossWords = stats.totalKeystrokes / 5;
    } else {
        // 'actual'
        grossWords = stats.totalWordsTyped;
    }

    const grossWPM = Math.round(grossWords / effectiveDuration);

    // Calculate primary metric based on Calculation Param
    let grossSpeed = 0;
    if (profile.calculationParam === 'gross_kph') {
        // Keystrokes Per Hour
        grossSpeed = Math.round((stats.totalKeystrokes / effectiveDuration) * 60);
    } else if (profile.calculationParam === 'gross_kdph') {
        // Keystrokes Depressions Per Hour (Same as KPH usually)
        grossSpeed = Math.round((stats.totalKeystrokes / effectiveDuration) * 60);
    } else {
        // 'net_wpm' (Base is Gross WPM, then penalized)
        grossSpeed = grossWPM;
    }

    // --- 2. Calculate Errors ---

    let totalErrors = 0;

    if (profile.errorClassification === 'ssc_aiims') {
        // Half Mistakes: Spacing, Capitalization, Punctuation usually
        // Full Mistakes: Omission, Substitution, Addition
        // Formula: Total Errors = Full + (Half / 2)
        totalErrors = stats.fullMistakes + (stats.halfMistakes * 0.5);
    } else {
        // 'simple' or 'advanced' (assuming simple count for now)
        // If 'simple', maybe all are equal? Or user implies standard half/full logic is only for SSC?
        // Let's assume standard weighting is safer unless specified otherwise.
        totalErrors = stats.fullMistakes + STATS_WEIGHT_MAP[profile.errorClassification] * stats.halfMistakes;
    }

    // --- 3. Ignore Error Limit ---

    // Ignored limit is usually % of Total Words Typed (Gross Words)
    // Example: 5% of 300 words = 15 errors ignored.
    const maxIgnored = Math.floor((grossWords * (profile.ignoredErrorLimit || 0)) / 100);
    const ignoredErrors = Math.min(totalErrors, maxIgnored);
    const chargeableErrors = Math.max(0, totalErrors - maxIgnored);

    // --- 4. Calculate Penalty ---

    let penaltyDeduction = 0;

    if (profile.penaltyMethod === 'per_mistake') {
        // Deduct X words/strokes per chargeable error
        // If profile.deductionValue is 10 (words? or strokes?)
        // Usually "10 words" or "1 word" per mistake. 
        // We need to know unit. profile.deductionValue isn't typed with unit in strict sense but let's assume 'words' if param is WPM, 'strokes' if KPH?
        // Actually, for SSC, it's often "Deduct 10 words for every full mistake" (or similar).
        // If deductionValue is e.g. 1.

        // Let's assume deduction is in "Words" equivalent for WPM modes.
        const deductionAmount = chargeableErrors * (profile.deductionValue || 1);

        if (profile.calculationParam === 'net_wpm') {
            // Deduction is in WPM directly? Or Words from total?
            // "Net Speed = Gross Speed - (Penalty)"
            // Usually Penalty = (Mistakes * Deduction) / Time
            penaltyDeduction = deductionAmount / effectiveDuration;
        } else {
            // For KPH, maybe deduction is in Strokes?
            // If KPH, normally we just reduce the count or speed.
            // Let's convert word deduction to strokes: 1 word = 5 strokes
            const strokeDeduction = deductionAmount * 5;
            // Penalty in KPH = (StrokeDeduction / Time) * 60 ??
            // Actually, usually KPH exams rely on Accuracy check or fixed deduction.
            // Placeholder: Convert to Speed Unit
            penaltyDeduction = Math.round((strokeDeduction / effectiveDuration) * 60);
        }

    } else if (profile.penaltyMethod === 'per_full_mistake') {
        // Only penalize full mistakes? Or count chargeable as full?
        // Similar to above but explicit naming.
        const deductionAmount = chargeableErrors * (profile.deductionValue || 1);
        penaltyDeduction = deductionAmount / effectiveDuration;

    } else if (profile.penaltyMethod === 'penalty_factor') {
        // e.g. Multiply errors by factor? 
        // Deprecated penaltyMultiplier?
        // Let's use deductionValue as factor.
        penaltyDeduction = chargeableErrors * (profile.deductionValue || 1);
    }

    // --- 5. Net Speed ---

    // Ensure not negative
    const netSpeed = Math.max(0, grossSpeed - penaltyDeduction);

    // Reference Net WPM (if main mode was KPH, convert back)
    let netWPM = 0;
    if (profile.calculationParam === 'net_wpm') {
        netWPM = netSpeed;
    } else {
        // Convert KPH to WPM: (KPH / 60) / 5
        netWPM = (netSpeed / 60) / 5;
    }

    // --- 6. Accuracy ---
    const totalPossibleStrokes = stats.totalKeystrokes;
    const errorStrokes = totalErrors * 5; // Approx
    const accuracy = totalPossibleStrokes > 0
        ? Math.max(0, ((totalPossibleStrokes - errorStrokes) / totalPossibleStrokes) * 100)
        : 100;

    // --- 7. Qualification / Scoring ---

    let isQualified = true;
    let marks = 0;

    // A. Eligibility
    if (profile.minEligibilityType === 'fixed_wpm') {
        if (netWPM < (profile.minEligibilityValue || 0)) isQualified = false;
    } else if (profile.minEligibilityType === 'fixed_kdph') {
        // Check Net Speed in KPH (assuming netSpeed is KPH if mode is KPH, else convert)
        let checkSpeedKeywords = netSpeed;
        if (profile.calculationParam === 'net_wpm') {
            checkSpeedKeywords = netWPM * 5 * 60;
        }
        if (checkSpeedKeywords < (profile.minEligibilityValue || 0)) isQualified = false;
    }

    // D. Minimum Keystrokes Check (spaces count as keystrokes)
    const minKeystrokesRequired = profile.minKeystrokes || 0;
    let disqualifiedMinKeystrokes = false;
    if (minKeystrokesRequired > 0 && stats.totalKeystrokes < minKeystrokesRequired) {
        isQualified = false;
        disqualifiedMinKeystrokes = true;
    }

    // B. Accuracy Qualification
    // (If min eligibility also implies accuracy? usually handled separately or via speed drop)

    // C. Marks Calculation
    if (profile.finalScoreCalc === 'marks') {
        // Simple linear mapping? Or specific?
        // Let's assume Net WPM = Marks for now, or if deductionValue is used differently.
        // Given lack of explicit "Max Marks" or formula in User Input (other than enum), 
        // we default to Net WPM as the score value.
        marks = netWPM;
    } else if (profile.finalScoreCalc === 'qualifying') {
        marks = isQualified ? 100 : 0;
    } else {
        marks = netSpeed;
    }

    return {
        grossSpeed: parseFloat(grossSpeed.toFixed(2)),
        netSpeed: parseFloat(netSpeed.toFixed(2)),
        accuracy: parseFloat(accuracy.toFixed(2)),
        totalErrors,
        ignoredErrors,
        chargeableErrors,
        penaltyDeduction: parseFloat(penaltyDeduction.toFixed(2)),
        isQualified,
        disqualifiedMinKeystrokes,
        minKeystrokesRequired,
        marks: parseFloat(marks.toFixed(2)),
        grossWPM: parseFloat(grossWPM.toFixed(2)),
        netWPM: parseFloat(netWPM.toFixed(2))
    };
};

const STATS_WEIGHT_MAP: Record<string, number> = {
    'simple': 1,
    'ssc_aiims': 0.5,
    'advanced': 0.5 // assumption
};
