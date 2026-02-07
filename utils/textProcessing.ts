
/**
 * Splits text into grapheme clusters (visually perceived characters).
 * This is essential for languages like Hindi where multiple code points 
 * combine to form a single visual character (ligatures/conjuncts).
 */
export const splitByGraphemes = (text: string, locale: string = 'en'): string[] => {
    if (!text) return [];

    // Check if Intl.Segmenter is supported
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
        const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text)).map(segment => segment.segment);
    }

    // Fallback for environments without Intl.Segmenter (though most modern browsers support it)
    // This is a naive split and will break ligatures, but it's a fallback.
    return text.split('');
};

/**
 * Calculates length of text in graphemes
 */
export const getGraphemeLength = (text: string, locale: string = 'en'): number => {
    return splitByGraphemes(text, locale).length;
};
