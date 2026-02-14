
import { ExamProfile } from '../types/profile';

export interface TestData {
    typedWords: number;
    typedStrokes: number;
    fullMistakes: number;
    halfMistakes: number;
    totalTimeMinutes: number;
}

export interface Result {
    netSpeed: number;
    grossSpeed: number;
    totalMistakes: number;
    finalMistakes: number;
    accuracy: number;
    qualified: boolean;
    result?: 'PASS' | 'FAIL';
}

/**
 * Calculates typing test results based on a specific ExamProfile.
 * Logic integrated from VPS rule engine codebase.
 */
export function calculateResult(profile: ExamProfile, data: TestData): Result {
    // Step 1: Total mistakes based on classification
    let totalMistakes: number;
    if (profile.errorClassification === 'simple') {
        totalMistakes = data.fullMistakes; // halfMistakes ignored
    } else if (profile.errorClassification === 'ssc_aiims') {
        totalMistakes = data.fullMistakes + data.halfMistakes / 2;
    } else {
        // advanced: custom weighting using halfMistakeRules (placeholder)
        totalMistakes = data.fullMistakes + data.halfMistakes / 2;
    }

    // Step 2: Apply ignored error limit
    const ignored = data.typedWords * (profile.ignoredErrorLimit / 100);
    let finalMistakes = Math.max(0, totalMistakes - ignored);

    // Step 3: Apply penalty method
    let adjustedWords = data.typedWords;
    let adjustedStrokes = data.typedStrokes;

    if (profile.penaltyMethod === 'per_mistake' && profile.deductionValue) {
        adjustedWords = data.typedWords - finalMistakes * profile.deductionValue;
    } else if (profile.penaltyMethod === 'per_full_mistake' && profile.deductionValue) {
        adjustedStrokes = data.typedStrokes - data.fullMistakes * profile.deductionValue;
    } else if (profile.penaltyMethod === 'penalty_factor' && profile.deductionValue) {
        adjustedWords = data.typedWords - finalMistakes * profile.deductionValue;
    }

    // Step 4: Calculate speeds
    let grossSpeed: number, netSpeed: number;
    if (profile.calculationParam === 'net_wpm') {
        grossSpeed = data.typedWords / data.totalTimeMinutes;
        netSpeed = adjustedWords / data.totalTimeMinutes;
    } else {
        // KDPH or KPH
        grossSpeed = (data.typedStrokes / data.totalTimeMinutes) * 60;
        netSpeed = (adjustedStrokes / data.totalTimeMinutes) * 60;
    }

    // Step 5: Accuracy
    const accuracy = data.typedWords > 0
        ? ((data.typedWords - finalMistakes) / data.typedWords) * 100
        : 100;

    // Step 6: Eligibility check
    let qualified = true;
    if (profile.minEligibilityType === 'fixed_wpm' && netSpeed < (profile.minEligibilityValue || 0)) {
        qualified = false;
    } else if (profile.minEligibilityType === 'fixed_kdph' && netSpeed < (profile.minEligibilityValue || 0)) {
        qualified = false;
    }

    // Step 7: Format net speed based on display preference
    let displayNetSpeed = netSpeed;
    if (profile.scoreDisplay === 'whole') {
        displayNetSpeed = Math.round(netSpeed);
    } else if (profile.scoreDisplay === '1dec') {
        displayNetSpeed = Math.round(netSpeed * 10) / 10;
    } else {
        displayNetSpeed = Math.round(netSpeed * 100) / 100;
    }

    const result: Result = {
        netSpeed: displayNetSpeed,
        grossSpeed,
        totalMistakes,
        finalMistakes,
        accuracy,
        qualified,
    };

    // If qualifying only, return pass/fail
    if (profile.finalScoreCalc === 'qualifying') {
        result.result = qualified ? 'PASS' : 'FAIL';
    }

    return result;
}
