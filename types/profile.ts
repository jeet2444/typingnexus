
export type CalculationParam = 'net_wpm' | 'gross_kdph' | 'gross_kph';
export type WordCalculation = '5char' | 'actual';
export type MinEligibilityType = 'none' | 'fixed_wpm' | 'fixed_kdph';
export type LanguageMode = 'fixed' | 'candidate' | 'default_with_change';
export type Language = 'en' | 'hi' | 'both';
export type HindiFont = 'krutidev' | 'devlys' | 'mangal' | 'arial' | 'agra' | 'none';
export type HindiKeyboardLayout = 'remington_gail' | 'inscript' | 'remington_cbi' | 'typewriter';
export type HindiComplexity = 'basic' | 'standard' | 'advanced';
export type ErrorClassification = 'simple' | 'ssc_aiims' | 'advanced';
export type HalfMistakeRule = 'spacing' | 'capitalization' | 'punctuation' | 'matra' | 'conjunct' | 'indent';
export type PenaltyMethod = 'none' | 'per_mistake' | 'per_full_mistake' | 'penalty_factor';
export type FinalScoreCalc = 'direct' | 'penalty_factor' | 'qualifying' | 'marks';
export type ScoreDisplay = 'whole' | '1dec' | '2dec';
export type PracticeSession = 'none' | 'timer';
export type Highlight = 'word' | 'character' | 'none';
export type ExamType = 'recruitment' | 'departmental' | 'promotion' | 'practice';
export type ResultDisplay = 'detailed' | 'pass_fail' | 'score';
export type Category = 'UR' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'PwD';

export interface CategoryRule {
    category: Category;
    minEligibility?: number;
    ignoredErrorLimit?: number;
    extraTimeMin?: number;
}

export interface ExamProfile {
    id?: string; // [Nexus Addition] Keep ID for store reference
    profileName: string;
    description: string;

    // 1. Primary Mode
    calculationParam: CalculationParam;
    wordCalculation: WordCalculation;
    minEligibilityType: MinEligibilityType;
    minEligibilityValue?: number;
    languageMode: LanguageMode;
    fixedLanguage?: Language;
    allowedLanguages?: Language[];
    defaultLanguage?: Language;
    allowLanguageChange?: boolean;

    // 2. Hindi Configuration
    hindiFont: HindiFont;
    hindiKeyboardLayout?: HindiKeyboardLayout;
    hindiComplexity: HindiComplexity;
    allowAltCodes: boolean;
    hindiStenoAvailable: boolean;

    // 3. Error & Penalty Engine
    errorClassification: ErrorClassification;
    halfMistakeRules?: HalfMistakeRule[];
    ignoredErrorLimit: number;
    penaltyMultiplier: number;

    // 4. Penalty & Scoring
    penaltyMethod: PenaltyMethod;
    deductionValue?: number;
    finalScoreCalc: FinalScoreCalc;
    scoreDisplay: ScoreDisplay;
    showAccuracy: boolean;

    // 5. Steno Test Configuration
    stenoEnabled: boolean;
    stenoType?: 'qualifying' | 'marks';
    stenoLanguage?: Language;
    stenoSpeed?: number;
    stenoDictationMin?: number;
    stenoTranscriptionMin?: number;
    stenoScribeExtraMin?: number;
    stenoBackspaceAllowed?: boolean;
    stenoSpellcheckAllowed?: boolean;
    stenoErrorLimit?: number;

    // 6. Interface Controls
    durationMin: number;
    practiceSession: PracticeSession;
    practiceDurationMin?: number;
    breakDurationSec: number;
    backspaceEnabled: boolean;
    arrowKeysEnabled: boolean;
    highlight: Highlight;
    showFingerPosition: boolean;
    showOnscreenKeyboard: boolean;
    liveErrors: boolean;
    showSpeedDuringTest: boolean;
    minKeystrokes?: number; // Minimum keystrokes (including spaces) required — below this = disqualified

    // 7. Advanced Settings
    categoryWiseEnabled: boolean;
    categoryRules?: CategoryRule[];
    scribeAllowed: boolean;
    scribeExtraMin?: number;
    examType: ExamType;
    resultDisplay: ResultDisplay;
    security?: {
        preventCopyPaste: boolean;
        preventRightClick: boolean;
        singleSession: boolean;
    };
}
