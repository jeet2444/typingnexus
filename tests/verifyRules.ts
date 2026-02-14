
import { calculateExamResult, RawStats } from '../utils/masterRulesEngine';
import { ExamProfile } from '../types/profile';

// Mock Profiles
const sscProfile: ExamProfile = {
    id: "ssc",
    profileName: "SSC Mock",
    calculationParam: 'net_wpm',
    wordCalculation: '5char',
    minEligibilityType: 'none',
    languageMode: 'fixed',
    fixedLanguage: 'en',
    hindiFont: 'none',
    hindiComplexity: 'standard',
    allowAltCodes: false,
    hindiStenoAvailable: false,
    errorClassification: 'ssc_aiims', // Half mistakes
    ignoredErrorLimit: 5, // 5%
    penaltyMultiplier: 1,
    penaltyMethod: 'per_mistake', // Deduct 1 per mistake? usually 10? let's assume 10 for test
    deductionValue: 10,
    finalScoreCalc: 'direct',
    scoreDisplay: '2dec',
    showAccuracy: true,
    stenoEnabled: false,
    durationMin: 15,
    practiceSession: 'none',
    breakDurationSec: 0,
    backspaceEnabled: true,
    arrowKeysEnabled: false,
    highlight: 'word',
    showFingerPosition: false,
    showOnscreenKeyboard: false,
    liveErrors: true,
    showSpeedDuringTest: true,
    categoryWiseEnabled: false,
    scribeAllowed: false,
    examType: 'recruitment',
    resultDisplay: 'detailed'
};

const courtProfile: ExamProfile = {
    id: "court",
    profileName: "High Court Mock",
    calculationParam: 'gross_wpm', // Or Net? Usually errors are deducted from marks
    wordCalculation: 'actual', // Space based
    minEligibilityType: 'none',
    languageMode: 'fixed',
    fixedLanguage: 'en',
    hindiFont: 'none',
    hindiComplexity: 'standard',
    allowAltCodes: false,
    hindiStenoAvailable: false,
    errorClassification: 'simple',
    ignoredErrorLimit: 0,
    penaltyMultiplier: 0,
    penaltyMethod: 'none', // No speed penalty, maybe marks?
    finalScoreCalc: 'marks',
    scoreDisplay: '2dec',
    showAccuracy: true,
    stenoEnabled: false,
    durationMin: 10,
    practiceSession: 'none',
    breakDurationSec: 0,
    backspaceEnabled: true,
    arrowKeysEnabled: false,
    highlight: 'word',
    showFingerPosition: false,
    showOnscreenKeyboard: false,
    liveErrors: true,
    showSpeedDuringTest: true,
    categoryWiseEnabled: false,
    scribeAllowed: false,
    examType: 'recruitment',
    resultDisplay: 'detailed'
};


// Test Cases
const runTest = (name: string, profile: ExamProfile, stats: RawStats) => {
    console.log(`\n--- Testing: ${name} ---`);
    const result = calculateExamResult(profile, stats);
    console.log("Input Stats:", stats);
    console.log("Result:", result);
    return result;
};

// 1. SSC Scenario
// 2000 Strokes, 15 Mins. 
// Gross WPM = (2000/5) / 15 = 400 / 15 = 26.66
// Errors: 2 Full, 4 Half -> Total = 2 + 2 = 4 Errors
// Ignored: 5% of 400 words = 20 errors. So 4 < 20. Chargeable = 0.
// Penalty = 0.
// Net Speed = 26.66
runTest("SSC - High Accuracy", sscProfile, {
    totalKeystrokes: 2000,
    correctKeystrokes: 1980,
    backspaceCount: 5,
    totalWordsTyped: 400, // Irrelevant for 5char?
    fullMistakes: 2,
    halfMistakes: 4,
    timeTakenSeconds: 900 // 15 mins
});

// 2. SSC - High Errors
// 2000 Strokes
// Errors: 30 Full = 30.
// Ignored: 20. Chargeable: 10.
// Penalty: 10 * 10 (deduction) = 100 words? 
// Time = 15. Penalty Speed = 100 / 15 = 6.66
// Net = 26.66 - 6.66 = 20
runTest("SSC - High Errors", sscProfile, {
    totalKeystrokes: 2000,
    correctKeystrokes: 1900,
    backspaceCount: 10,
    totalWordsTyped: 400,
    fullMistakes: 30,
    halfMistakes: 0,
    timeTakenSeconds: 900
});

// 3. Court (Space Based)
// 300 words typed in 10 mins. Gross = 30 WPM.
// Simple Errors.
runTest("Court Mock", courtProfile, {
    totalKeystrokes: 1600, // Irrelevant for space based speed?
    correctKeystrokes: 1550,
    backspaceCount: 0,
    totalWordsTyped: 300,
    fullMistakes: 5,
    halfMistakes: 0,
    timeTakenSeconds: 600
});
