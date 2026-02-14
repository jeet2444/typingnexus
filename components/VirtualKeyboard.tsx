import React, { useMemo } from 'react';

interface VirtualKeyboardProps {
  activeChar: string;
  language?: 'english' | 'hindi';
  layout?: 'qwerty' | 'remington' | 'inscript';
  pressedKey?: string | null;
  isShiftPressed?: boolean;
  fontFamily?: 'sans' | 'mangal' | 'krutidev' | 'devlys'; // [NEW] Support Hindi Fonts
}


const ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

export const FINGER_MAP: Record<string, string> = {
  '`': 'Left Pinky', '1': 'Left Pinky', 'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky',
  '2': 'Left Ring', 'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring',
  '3': 'Left Middle', 'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle',
  '4': 'Left Index', 'r': 'Left Index', 'f': 'Left Index', 'v': 'Left Index',
  '5': 'Left Index', 't': 'Left Index', 'g': 'Left Index', 'b': 'Left Index',
  '6': 'Right Index', 'y': 'Right Index', 'h': 'Right Index', 'n': 'Right Index',
  '7': 'Right Index', 'u': 'Right Index', 'j': 'Right Index', 'm': 'Right Index',
  '8': 'Right Middle', 'i': 'Right Middle', 'k': 'Right Middle', ',': 'Right Middle',
  '9': 'Right Ring', 'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring',
  '0': 'Right Pinky', 'p': 'Right Pinky', ';': 'Right Pinky', '/': 'Right Pinky',
  '-': 'Right Pinky', '[': 'Right Pinky', '\'': 'Right Pinky',
  '=': 'Right Pinky', ']': 'Right Pinky', '\\': 'Right Pinky',
  ' ': 'Thumbs'
};

import { REMINGTON_DISPLAY_MAP, INSCRIPT_DISPLAY_MAP } from '../utils/keyboardMappings';

// --- INSCRIPT ---
// Imported from utils/keyboardMappings.ts

const INSCRIPT_MAPPING: Record<string, string> = {
  // Row 1
  'ऍ': '!', 'ॅ': '@', '्र': '#', 'र्': '$', 'ज्ञ': '%', 'त्र': '^', 'क्ष': '&', 'श्र': '*', '(': '(', ')': ')',

  // Row 2
  'ौ': 'q', 'ै': 'w', 'ा': 'e', 'ी': 'r', 'ू': 't', 'ब': 'y', 'ह': 'u', 'ग': 'i', 'द': 'o', 'ज': 'p', 'ड': '[', '़': ']',
  'औ': 'Q', 'ऐ': 'W', 'आ': 'E', 'ई': 'R', 'ऊ': 'T', 'भ': 'Y', 'ङ': 'U', 'घ': 'I', 'ध': 'O', 'झ': 'P', 'ढ': '{', 'ञ': '}',

  // Row 3
  'ो': 'a', 'े': 's', '्': 'd', 'ि': 'f', 'ु': 'g', 'प': 'h', 'र': 'j', 'क': 'k', 'त': 'l', 'च': ';', 'ट': "'",
  'ओ': 'A', 'ए': 'S', 'अ': 'D', 'इ': 'F', 'उ': 'G', 'फ': 'H', 'ख': 'K', 'थ': 'L', 'छ': ':', 'ठ': '"',

  // Row 4
  'ं': 'x', 'म': 'c', 'न': 'v', 'व': 'b', 'ल': 'n', 'स': 'm',
  'ँ': 'X', 'ण': 'C', 'ळ': 'N', 'श': 'M',

  ',': ',', '.': '.', 'य': '/', 'य़': '?', '।': '>',
};

// --- REMINGTON GAIL / CBI ---
// Imported from utils/keyboardMappings.ts

const REMINGTON_MAPPING: Record<string, string> = {
  // Unicode -> QWERTY Key
  'ु': 'q', 'फ': 'Q',
  'ू': 'w', 'ॅ': 'W',
  'म': 'e', 'म्': 'E',
  'त': 'r', 'त्': 'R',
  'ज': 't', 'ज्': 'T',
  'ल': 'y', 'ल्': 'Y',
  'न': 'u', 'न्': 'U',
  'प': 'i', 'प्': 'I',
  'व': 'o', 'व्': 'O',
  'च': 'p', 'च्': 'P',
  'ख': '[', 'क्ष': '{',
  ',': ']', 'द्व': '}',

  'ो': 'a', 'ओ': 'A',
  'े': 's', 'ए': ',', // Use comma for 'ए' as it is the unshifted key
  'क': 'd', 'क्': 'D',
  'ि': 'f', 'थ': 'F',
  'ह': 'g', 'भ': 'G',
  'ी': 'h', 'भ्': 'H',
  'र': 'j', 'श्र': 'J',
  'ा': 'k', 'ज्ञ': 'K',
  'स': 'l', 'रू': 'L',
  'य': ';',
  'श': "'", 'ष': '"',

  '्र': 'z',
  'ग': 'x', 'ग्': 'X',
  'ब': 'c', 'ब्': 'C',
  'अ': 'v', 'ट': 'V',
  'इ': 'b', 'ठ': 'B',
  'द': 'n', 'ड': 'N',
  'उ': 'm', 'ढ': 'M',
  'ण': '.',
  'ध': '/', 'ध्': '?',
};

// --- HAND VISUALS ---
const LiveHandGuide: React.FC<{ activeFinger: string }> = ({ activeFinger }) => {
  const getColor = (fingerName: string) => {
    return activeFinger === fingerName ? "#2563eb" : "#374151";
  };

  const getStroke = (fingerName: string) => {
    return activeFinger === fingerName ? "#60a5fa" : "#1f2937";
  };

  const getAnimClass = (fingerName: string) => {
    return activeFinger === fingerName ? "animate-pulse" : "";
  };

  return (
    <div className="flex gap-16 md:gap-32 justify-center mt-6 py-4 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-inner">
      {/* Left Hand */}
      <div className="relative group">
        <svg viewBox="0 0 100 120" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md transition-transform group-hover:scale-105">
          <path d="M10 50 L10 30 Q10 25 15 25 Q20 25 20 30 L20 50" fill={getColor('Left Pinky')} stroke={getStroke('Left Pinky')} strokeWidth="1.5" className={getAnimClass('Left Pinky')} />
          <path d="M22 50 L22 20 Q22 15 27 15 Q32 15 32 20 L32 50" fill={getColor('Left Ring')} stroke={getStroke('Left Ring')} strokeWidth="1.5" className={getAnimClass('Left Ring')} />
          <path d="M34 50 L34 10 Q34 5 39 5 Q44 5 44 10 L44 50" fill={getColor('Left Middle')} stroke={getStroke('Left Middle')} strokeWidth="1.5" className={getAnimClass('Left Middle')} />
          <path d="M46 50 L46 20 Q46 15 51 15 Q56 15 56 20 L56 60" fill={getColor('Left Index')} stroke={getStroke('Left Index')} strokeWidth="1.5" className={getAnimClass('Left Index')} />
          <path d="M60 70 L75 60 Q80 65 75 75 L60 85" fill={getColor('Thumbs')} stroke={getStroke('Thumbs')} strokeWidth="1.5" className={getAnimClass('Thumbs')} />
          <path d="M10 50 L56 60 L60 85 Q60 110 30 110 Q10 110 10 50" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
          <text x="32" y="105" fontSize="8" fontWeight="bold" className="fill-gray-600 uppercase tracking-tighter">Left Hand</text>
        </svg>
        {activeFinger?.startsWith('Left') && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap animate-pulse">Use This</div>}
      </div>

      {/* Right Hand */}
      <div className="relative group">
        <svg viewBox="0 0 100 120" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md transition-transform group-hover:scale-105">
          <path d="M40 70 L25 60 Q20 65 25 75 L40 85" fill={getColor('Thumbs')} stroke={getStroke('Thumbs')} strokeWidth="1.5" className={getAnimClass('Thumbs')} />
          <path d="M44 60 L44 20 Q44 15 49 15 Q54 15 54 20 L54 50" fill={getColor('Right Index')} stroke={getStroke('Right Index')} strokeWidth="1.5" className={getAnimClass('Right Index')} />
          <path d="M56 50 L56 10 Q56 5 61 5 Q66 5 66 10 L66 50" fill={getColor('Right Middle')} stroke={getStroke('Right Middle')} strokeWidth="1.5" className={getAnimClass('Right Middle')} />
          <path d="M68 50 L68 20 Q68 15 73 15 Q78 15 78 20 L78 50" fill={getColor('Right Ring')} stroke={getStroke('Right Ring')} strokeWidth="1.5" className={getAnimClass('Right Ring')} />
          <path d="M80 50 L80 30 Q80 25 85 25 Q90 25 90 30 L90 50" fill={getColor('Right Pinky')} stroke={getStroke('Right Pinky')} strokeWidth="1.5" className={getAnimClass('Right Pinky')} />
          <path d="M90 50 L44 60 L40 85 Q40 110 70 110 Q90 110 90 50" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
          <text x="30" y="105" fontSize="8" fontWeight="bold" className="fill-gray-600 uppercase tracking-tighter">Right Hand</text>
        </svg>
        {activeFinger?.startsWith('Right') && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap animate-pulse">Use This</div>}
      </div>
    </div>
  );
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeChar, language = 'english', layout = 'qwerty', pressedKey, isShiftPressed = false, fontFamily = 'sans' }) => {

  // Resolve Mappings based on Layout
  const getDisplayMap = () => {
    if (layout === 'inscript') return INSCRIPT_DISPLAY_MAP;
    if (layout === 'remington') return REMINGTON_DISPLAY_MAP;
    return {};
  };

  const getInputMap = () => {
    if (layout === 'inscript') return INSCRIPT_MAPPING;
    if (layout === 'remington') return REMINGTON_MAPPING;
    return {};
  };

  const displayMap = getDisplayMap();
  const inputMap = getInputMap();

  const getKeyClass = (key: string) => {
    const base = "m-0.5 sm:m-1 rounded-lg border-b-4 flex items-center justify-center transition-all duration-75 select-none relative overflow-hidden active:border-b-0 active:translate-y-1";

    // [NEW] Dynamic Font Class
    const fontClass = fontFamily === 'mangal' ? 'font-mangal' :
      fontFamily === 'krutidev' ? 'font-krutidev' :
        fontFamily === 'devlys' ? 'font-devlys' : 'font-mono';

    const textStyle = `text-[10px] sm:text-sm font-bold ${fontClass}`;


    // Normalize logic
    let isActive = false;
    let isPressed = false;

    // 1. Resolve Active Char (Guide)
    let effectiveChar = activeChar;
    // Map Unicode char to physical key if using Hindi layout
    if (layout !== 'qwerty' && inputMap[activeChar]) {
      effectiveChar = inputMap[activeChar];
    }

    // 2. Resolve Pressed Char (Feedback)
    let effectivePressedChar = pressedKey;

    // Shift Maps for English QWERTY
    const shiftMap: Record<string, string> = {
      '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };

    // If layout is qwerty, we handle Shift chars for active key
    let targetKey = effectiveChar;
    if (layout === 'qwerty') {
      targetKey = shiftMap[effectiveChar] || effectiveChar;
    }

    // Check Active (Guide)
    if (key.length === 1) {
      if (key.toLowerCase() === targetKey?.toLowerCase()) isActive = true;
    } else if (key === 'Space' && activeChar === ' ') {
      isActive = true;
    } else if (key === 'Shift') {
      // If the target character is uppercase or a shifted symbol, highlight Shift
      if (/[A-Z!@#$%^&*()_+{}:"<>?~|]/.test(effectiveChar)) {
        isActive = true;
      }
    }

    // Check Pressed (Feedback)
    if (pressedKey) {
      // Handle physical key match
      if (key.length === 1) {
        if (key.toLowerCase() === pressedKey.toLowerCase()) isPressed = true;
      } else if (key === 'Space' && pressedKey === ' ') {
        isPressed = true;
      } else if (key === 'Backspace' && pressedKey === 'Backspace') {
        isPressed = true;
      } else if (key === 'Shift') {
        if (pressedKey === 'Shift' || isShiftPressed || /[A-Z!@#$%^&*()_+{}:"<>?~|]/.test(pressedKey)) {
          isPressed = true;
        }
      }
    }

    // Widths
    let size = "w-8 sm:w-10 h-8 sm:h-10";
    if (key === 'Backspace') size = "w-16 sm:w-20 h-8 sm:h-10";
    if (key === 'Tab') size = "w-12 sm:w-16 h-8 sm:h-10";
    if (key === 'CapsLock') size = "w-14 sm:w-18 h-8 sm:h-10";
    if (key === 'Enter') size = "w-16 sm:w-20 h-8 sm:h-10";
    if (key === 'Shift') size = "w-20 sm:w-24 h-8 sm:h-10";
    if (key === 'Space') size = "w-48 sm:w-64 h-8 sm:h-10";

    // Styles - CYBERPUNK THEME
    const pressedColor = "bg-cyan-500 border-cyan-700 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)] z-20 font-bold scale-95";
    const activeColor = "bg-brand-purple border-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10 animate-pulse";
    const inactiveColor = "bg-gray-800 border-gray-950 text-gray-400 hover:bg-gray-700 hover:text-white";

    // Priority: Pressed > Active > Inactive
    if (isPressed) return `${base} ${size} ${textStyle} ${pressedColor}`;
    return `${base} ${size} ${textStyle} ${isActive ? activeColor : inactiveColor}`;
  };

  const renderKeyContent = (key: string) => {
    if (layout !== 'qwerty') {
      const map = displayMap[key.toLowerCase()];
      if (map && key.length === 1) {
        if (isShiftPressed && map.shift) {
          return (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <span className="leading-none text-sm md:text-base font-bold text-yellow-400">{map.shift}</span>
            </div>
          );
        }

        return (
          <div className="flex flex-col items-center justify-center h-full w-full">
            {map.shift && <span className="absolute top-0.5 left-1 text-[8px] opacity-60 leading-none">{map.shift}</span>}
            <span className="mt-1 leading-none text-sm md:text-base">{map.normal}</span>
          </div>
        );
      }
    } else if (key.length === 1) {
      // English QWERTY Shift Support
      const QWERTY_SHIFT: Record<string, string> = {
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
        '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?', '`': '~'
      };

      if (isShiftPressed) {
        const shifted = QWERTY_SHIFT[key] || key.toUpperCase();
        return <span className="text-yellow-400 font-bold">{shifted}</span>;
      }
    }
    return key === 'Space' ? 'Space' : key;
  };

  const getFingerInstruction = () => {
    if (!activeChar) return 'Complete!';

    // Map activeChar to physical QWERTY key
    let effectiveChar = activeChar;
    if (layout !== 'qwerty' && inputMap[activeChar]) {
      effectiveChar = inputMap[activeChar];
    }

    // Handle shift chars for instruction lookup
    const shiftMapInverse: Record<string, string> = {
      '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };
    const key = shiftMapInverse[effectiveChar] || (/[A-Z]/.test(effectiveChar) ? effectiveChar.toLowerCase() : effectiveChar);
    return FINGER_MAP[key] || FINGER_MAP[effectiveChar] || 'Standard';
  };

  const activeFinger = getFingerInstruction();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">

      {/* Hand Animation Top Section */}
      <LiveHandGuide activeFinger={activeFinger} />

      <div className="flex flex-col items-center bg-gray-900/80 p-4 sm:p-6 rounded-2xl border border-gray-800 w-full shadow-2xl backdrop-blur-sm">
        <div className="mb-4 w-full flex justify-between items-center text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <span>Guide:</span>
            <span className="bg-brand-purple text-white px-3 py-1 rounded-full shadow-lg shadow-purple-900/40">{activeFinger}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {isShiftPressed && (
              <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded-full text-[10px] font-black animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                SHIFT ACTIVE
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Layout:</span>
              <span className="text-cyan-400">{layout === 'qwerty' ? 'English QWERTY' : layout === 'inscript' ? 'Hindi Inscript' : 'Hindi Remington'}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-full items-center">
          {ROWS.map((row, i) => (
            <div key={i} className="flex gap-1.5">
              {row.map(key => (
                <div key={key} className={getKeyClass(key)}>
                  {renderKeyContent(key)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;