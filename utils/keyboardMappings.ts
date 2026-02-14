
// Keyboard Mappings for Hindi Layouts
// Used by both VirtualKeyboard (for display) and TypingTest (for input interception)

export interface KeyMap {
    normal: string;
    shift?: string;
}

export const REMINGTON_DISPLAY_MAP: Record<string, KeyMap> = {
    // Row 1 (Numbers & Symbols)
    '`': { normal: '़', shift: 'द्य' },
    '1': { normal: '१', shift: '।' },
    '2': { normal: '२', shift: '/' },
    '3': { normal: '३', shift: ':' },
    '4': { normal: '४', shift: '₹' },
    '5': { normal: '५', shift: '*' },
    '6': { normal: '६', shift: '‘' },
    '7': { normal: '७', shift: '’' },
    '8': { normal: '८', shift: '(' },
    '9': { normal: '९', shift: ')' },
    '0': { normal: '०', shift: 'ऋ' },
    '-': { normal: '-', shift: '_' },
    '=': { normal: 'ृ', shift: 'त्र' },

    // Row 2
    'q': { normal: 'ु', shift: 'फ' },
    'w': { normal: 'ू', shift: 'ॅ' },
    'e': { normal: 'म', shift: 'म्' },
    'r': { normal: 'त', shift: 'त्' },
    't': { normal: 'ज', shift: 'ज्' },
    'y': { normal: 'ल', shift: 'ल्' },
    'u': { normal: 'न', shift: 'न्' },
    'i': { normal: 'प', shift: 'प्' },
    'o': { normal: 'व', shift: 'व्' },
    'p': { normal: 'च', shift: 'च्' },
    '[': { normal: 'ख', shift: 'क्ष' },
    ']': { normal: ',', shift: 'द्व' },
    '\\': { normal: '?', shift: '!' },

    // Row 3
    'a': { normal: 'ो', shift: 'ओ' },
    's': { normal: 'े', shift: 'ए' },
    'd': { normal: 'क', shift: 'क्' },
    'f': { normal: 'ि', shift: 'थ' },
    'g': { normal: 'ह', shift: 'भ' },
    'h': { normal: 'ी', shift: 'भ्' },
    'j': { normal: 'र', shift: 'श्र' },
    'k': { normal: 'ा', shift: 'ज्ञ' },
    'l': { normal: 'स', shift: 'रू' },
    ';': { normal: 'य', shift: 'रू' },
    "'": { normal: 'श', shift: 'ष' },

    // Row 4
    'z': { normal: '्र', shift: 'र्' },
    'x': { normal: 'ग', shift: 'ग्' },
    'c': { normal: 'ब', shift: 'ब्' },
    'v': { normal: 'अ', shift: 'ट' },
    'b': { normal: 'इ', shift: 'ठ' },
    'n': { normal: 'द', shift: 'ड' },
    'm': { normal: 'उ', shift: 'ढ' },
    ',': { normal: 'ए', shift: 'ण' },
    '.': { normal: 'ण', shift: '।' },
    '/': { normal: 'ध', shift: 'ध्' },
};

export const INSCRIPT_DISPLAY_MAP: Record<string, KeyMap> = {
    'q': { normal: 'ौ', shift: 'औ' },
    'w': { normal: 'ै', shift: 'ऐ' },
    'e': { normal: 'ा', shift: 'आ' },
    'r': { normal: 'ी', shift: 'ई' },
    't': { normal: 'ू', shift: 'ऊ' },
    'y': { normal: 'ब', shift: 'भ' },
    'u': { normal: 'ह', shift: 'ङ' },
    'i': { normal: 'ग', shift: 'घ' },
    'o': { normal: 'द', shift: 'ध' },
    'p': { normal: 'ज', shift: 'झ' },
    '[': { normal: 'ड', shift: 'ढ' },
    ']': { normal: '़', shift: 'ञ' },

    'a': { normal: 'ो', shift: 'ओ' },
    's': { normal: 'े', shift: 'ए' },
    'd': { normal: '्', shift: 'अ' },
    'f': { normal: 'ि', shift: 'इ' },
    'g': { normal: 'ु', shift: 'उ' },
    'h': { normal: 'प', shift: 'फ' },
    'j': { normal: 'र', shift: 'र्' },
    'k': { normal: 'क', shift: 'ख' },
    'l': { normal: 'त', shift: 'थ' },
    ';': { normal: 'च', shift: 'छ' },
    "'": { normal: 'ट', shift: 'ठ' },

    'z': { normal: '्र', shift: '' },
    'x': { normal: 'ं', shift: 'ँ' },
    'c': { normal: 'म', shift: 'ण' },
    'v': { normal: 'न', shift: '' },
    'b': { normal: 'व', shift: '' },
    'n': { normal: 'ल', shift: 'ळ' },
    'm': { normal: 'स', shift: 'श' },
    ',': { normal: ',', shift: 'ष' },
    '.': { normal: '.', shift: '।' },
    '/': { normal: 'य', shift: '?' },

    '1': { normal: '1', shift: 'ऍ' },
    '2': { normal: '2', shift: 'ॅ' },
    '3': { normal: '3', shift: '्र' },
    '4': { normal: '4', shift: 'र्' },
    '5': { normal: '5', shift: 'ज्ञ' },
    '6': { normal: '6', shift: 'त्र' },
    '7': { normal: '7', shift: 'क्ष' },
    '8': { normal: '8', shift: 'श्र' },
    '9': { normal: '9', shift: '(' },
    '0': { normal: '0', shift: ')' },
};
