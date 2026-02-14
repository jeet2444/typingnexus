
export interface DrillConfig {
    weakKeys: string[];
    duration: number; // Seconds
    text: string;
    focusMessage: string;
}

// Simple dictionary for generating meaningful drills
const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

// Generates nonsense patterns like "qaq qwq qeq" for weak key 'q'
const generatePattern = (key: string): string => {
    const patterns = [
        `${key}a${key}`, `${key}s${key}`, `${key}d${key}`, `${key}f${key}`,
        `${key}${key}${key}`, `${key}w${key}`, `${key}e${key}`, `${key}r${key}`
    ];
    return patterns.sort(() => 0.5 - Math.random()).slice(0, 4).join(' ');
};

export const analyzeWeakKeys = (inputText: string, targetText: string): string[] => {
    const errorMap: Record<string, number> = {};
    const inputChars = inputText.split('');
    const targetChars = targetText.split('');

    inputChars.forEach((char, i) => {
        if (i < targetChars.length && char !== targetChars[i]) {
            const expected = targetChars[i].toLowerCase();
            // Ignore spaces and common punctuation for "weak key" detection unless repeated often
            if (/[a-z0-9]/.test(expected)) {
                errorMap[expected] = (errorMap[expected] || 0) + 1;
            }
        }
    });

    // Return keys with more than 2 mistakes, sorted by frequency
    return Object.entries(errorMap)
        .filter(([_, count]) => count >= 2)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 3) // Top 3 weak keys
        .map(([key]) => key);
};

export const generateRemedialDrill = (weakKeys: string[]): DrillConfig => {
    if (weakKeys.length === 0) {
        return {
            weakKeys: [],
            duration: 120,
            text: COMMON_WORDS.sort(() => 0.5 - Math.random()).slice(0, 30).join(' '),
            focusMessage: "General Speed & Accuracy Refresher"
        };
    }

    const primaryKey = weakKeys[0];
    const secondaryKey = weakKeys[1] || weakKeys[0];

    // 1. Select real words containing the weak keys
    const relevantWords = COMMON_WORDS.filter(w => w.includes(primaryKey) || w.includes(secondaryKey));
    const randomFiller = COMMON_WORDS.sort(() => 0.5 - Math.random()).slice(0, 10);

    // 2. Generate nonsense patterns
    const patternA = generatePattern(primaryKey);
    const patternB = generatePattern(secondaryKey);

    // 3. Assemble the Drill Text
    // Structure: Pattern -> Words -> Pattern -> Words
    const drillText = [
        patternA, patternA,
        relevantWords.slice(0, 5).join(' '),
        patternB, patternB,
        relevantWords.slice(5, 10).join(' '),
        randomFiller.join(' '),
        patternA, patternB,
        relevantWords.join(' ')
    ].join(' ');

    return {
        weakKeys,
        duration: 120, // 2 Minutes
        text: drillText,
        focusMessage: `Focus: '${weakKeys.join("', '").toUpperCase()}' - Accuracy Drill`
    };
};
