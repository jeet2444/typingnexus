import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Keyboard, Play, RefreshCw, Trophy, Lock, Star, ChevronDown, ChevronUp, ChevronRight, Languages, BookOpen, AlignLeft, Zap, Timer, Hand, Settings, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import VirtualKeyboard, { FINGER_MAP } from './VirtualKeyboard';
import { INSCRIPT_DISPLAY_MAP, REMINGTON_DISPLAY_MAP } from '../utils/keyboardMappings';

// --- DATA STRUCTURES ---

interface Lesson {
  id: string;
  title: string;
  type: 'drill' | 'words' | 'paragraph';
  description: string;
  language: 'english' | 'hindi';
  content: string;
  duration?: string;
}

interface Level {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const CURRICULUM: Level[] = [
  // --- ENGLISH ---
  {
    id: 'eng-phase-1',
    title: 'Phase 1: Home Row Base (Level 1-5)',
    description: 'Focus: Anchor keys and base position.',
    lessons: [
      {
        id: 'eng-lvl-1',
        title: 'Level 1: The Anchor Keys',
        type: 'drill',
        description: 'Index fingers (f j).',
        language: 'english',
        content: "f j f j ff jj fj jf fjfj fff jjj"
      },
      {
        id: 'eng-lvl-2',
        title: 'Level 2: Middle & Ring',
        type: 'drill',
        description: 'Middle and Ring fingers (d k s l).',
        language: 'english',
        content: "d k s l dk sl lk sd ask dad sad lad"
      },
      {
        id: 'eng-lvl-3',
        title: 'Level 3: Pinky & Punctuation',
        type: 'drill',
        description: 'Pinky finger control (a ;).',
        language: 'english',
        content: "a ; a ; asdf jkl; fall alas salad flasks"
      },
      {
        id: 'eng-lvl-4',
        title: 'Level 4: G & H Stretch',
        type: 'drill',
        description: 'Side stretch keys.',
        language: 'english',
        content: "f g f j h j glad hall dash glass a glad dad had a salad."
      },
      {
        id: 'eng-lvl-5',
        title: 'Level 5: Home Row Pro',
        type: 'paragraph',
        description: 'Long combinations using all Home Row keys.',
        language: 'english',
        content: "dad had a glass flask. a lad has a gold flag. the glass dash was fast and glad. ask a lad for a salad and a glass."
      }
    ]
  },
  {
    id: 'eng-phase-2',
    title: 'Phase 2: Upper Row Reach (Level 6-10)',
    description: 'Focus: Reaching upwards.',
    lessons: [
      {
        id: 'eng-lvl-6',
        title: 'Level 6: Index Power',
        type: 'drill',
        description: 'Upward index movement (r u t y).',
        language: 'english',
        content: "frf juj ftf jyj rut try turn fury hurt yard tough"
      },
      {
        id: 'eng-lvl-7',
        title: 'Level 7: Middle & Ring Reach',
        type: 'drill',
        description: 'Middle and Ring reach (e i w o).',
        language: 'english',
        content: "ded kik sws lol we out power write we write our words."
      },
      {
        id: 'eng-lvl-8',
        title: 'Level 8: Pinky Reach',
        type: 'drill',
        description: 'Extreme corner reach (q p).',
        language: 'english',
        content: "aqa ;p; queen paper play quiet quality proper quilt"
      },
      {
        id: 'eng-lvl-9',
        title: 'Level 9: Vowel Harmony',
        type: 'words',
        description: 'All vowels practice.',
        language: 'english',
        content: "education house radio audio union quiet opera area"
      },
      {
        id: 'eng-lvl-10',
        title: 'Level 10: Top & Middle Mix',
        type: 'paragraph',
        description: 'Paragraphs mixing Home and Top rows.',
        language: 'english',
        content: "try to write a report for the top power. you were quiet at the tree root. put the pot on the top. we write our words."
      }
    ]
  },
  {
    id: 'eng-phase-3',
    title: 'Phase 3: Bottom Row Slide (Level 11-15)',
    description: 'Focus: Downward movements.',
    lessons: [
      {
        id: 'eng-lvl-11',
        title: 'Level 11: Downward Index',
        type: 'drill',
        description: 'Downward index (v n b m).',
        language: 'english',
        content: "fvf jnj fbf jmj man van ban sun number move money"
      },
      {
        id: 'eng-lvl-12',
        title: 'Level 12: Lower Middle & Ring',
        type: 'drill',
        description: 'Lower keys (c x , .).',
        language: 'english',
        content: "dcd sxs l.l k,k car box cell voice the cat is in the box."
      },
      {
        id: 'eng-lvl-13',
        title: 'Level 13: Difficult Z & /',
        type: 'drill',
        description: 'Pinky downward stretch.',
        language: 'english',
        content: "aza ;/; zebra zoom pizza size lazy crazy hazy"
      },
      {
        id: 'eng-lvl-14',
        title: 'Level 14: All Row Fusion',
        type: 'words',
        description: 'Mixing all rows.',
        language: 'english',
        content: "can you move the van back to the zone? the moon can be seen at zero hour."
      },
      {
        id: 'eng-lvl-15',
        title: 'Level 15: Full Keyboard Master',
        type: 'paragraph',
        description: 'All 3 rows test.',
        language: 'english',
        content: "the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs. sphinx of black quartz, judge my vow."
      }
    ]
  },
  {
    id: 'eng-phase-4',
    title: 'Phase 4: Shift & Symbols (Level 16-20)',
    description: 'Focus: Capital letters and punctuation.',
    lessons: [
      {
        id: 'eng-lvl-16',
        title: 'Level 16: Shift Key Logic',
        type: 'drill',
        description: 'Using Shift keys.',
        language: 'english',
        content: "Apple Banana India Manish Queen Water Earth Red Green"
      },
      {
        id: 'eng-lvl-17',
        title: 'Level 17: Punctuation Mastery',
        type: 'drill',
        description: 'Common punctuation.',
        language: 'english',
        content: "Don't wait! Why? Hello, World. Yes-No. Up & Down."
      },
      {
        id: 'eng-lvl-18',
        title: 'Level 18: Number Row (1-5)',
        type: 'drill',
        description: 'Left hand numbers.',
        language: 'english',
        content: "1 2 3 4 5 12 apples 45 cats 12345"
      },
      {
        id: 'eng-lvl-19',
        title: 'Level 19: Number Row (6-0)',
        type: 'drill',
        description: 'Right hand numbers.',
        language: 'english',
        content: "6 7 8 9 0 1998 2026 67890 100%"
      },
      {
        id: 'eng-lvl-20',
        title: 'Level 20: Character Mix',
        type: 'words',
        description: 'Complex strings.',
        language: 'english',
        content: "S@fe123 P#ssw0rd Email@Address.com 50% Off! $100 Only."
      }
    ]
  },
  {
    id: 'eng-phase-5',
    title: 'Phase 5: Pro Speed & Topics (Level 21-25)',
    description: 'Focus: Real-world speed building.',
    lessons: [
      {
        id: 'eng-lvl-21',
        title: 'Level 21: Common Patterns',
        type: 'words',
        description: 'High frequency words.',
        language: 'english',
        content: "the and for that with this they have from one had word but what some"
      },
      {
        id: 'eng-lvl-22',
        title: 'Level 22: Double Letter Focus',
        type: 'words',
        description: 'Words with double letters.',
        language: 'english',
        content: "bottle school address speed letter little grass summer happen matter"
      },
      {
        id: 'eng-lvl-23',
        title: 'Level 23: Digital Terminology',
        type: 'words',
        description: 'Tech terms.',
        language: 'english',
        content: "website coding software database network server browser internet algorithm pixel"
      },
      {
        id: 'eng-lvl-24',
        title: 'Level 24: Professional/Office',
        type: 'words',
        description: 'Business vocabulary.',
        language: 'english',
        content: "invoice meeting salary office manager project report deadline schedule client"
      },
      {
        id: 'eng-lvl-25',
        title: 'Level 25: Long Word Stamina',
        type: 'words',
        description: 'Long complex words.',
        language: 'english',
        content: "congratulations organization international development administration responsibility environment communication"
      }
    ]
  },
  {
    id: 'eng-phase-6',
    title: 'Phase 6: The Legend Journey (Level 26-30)',
    description: 'Focus: Extreme mastery.',
    lessons: [
      {
        id: 'eng-lvl-26',
        title: 'Level 26: Short Stories',
        type: 'paragraph',
        description: 'Engaging stories.',
        language: 'english',
        content: "Once upon a time, in a land far away, there lived a king who loved books. He built a great library for all the people in his kingdom to read and learn."
      },
      {
        id: 'eng-lvl-27',
        title: 'Level 27: Tongue Twisters',
        type: 'drill',
        description: 'Muscle coordination.',
        language: 'english',
        content: "She sells seashells by the seashore. How much wood would a woodchuck chuck if a woodchuck could chuck wood?"
      },
      {
        id: 'eng-lvl-28',
        title: 'Level 28: Technical Snippets',
        type: 'paragraph',
        description: 'Scientific terms.',
        language: 'english',
        content: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water."
      },
      {
        id: 'eng-lvl-29',
        title: 'Level 29: Blindfold Challenge',
        type: 'paragraph',
        description: 'Trust your muscle memory.',
        language: 'english',
        content: "Trust your fingers to find the keys. Do not look down. Keep your eyes on the screen. Flow like water. Be the keyboard."
      },
      {
        id: 'eng-lvl-30',
        title: 'Level 30: The Ultimate Sprint',
        type: 'paragraph',
        description: '5 Minute Marathon Goal.',
        language: 'english',
        content: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. Stay hungry, stay foolish."
      }
    ]
  },

  // --- HINDI ---
  {
    id: 'hin-phase-1',
    title: 'Phase 1: Home Row (L1-5)',
    description: 'Foundation: Home Row keys and Aa matra.',
    lessons: [
      {
        id: 'hin-lvl-1',
        title: 'Level 1: Home Row Core',
        type: 'drill',
        description: 'Focus keys: क र न त',
        language: 'hindi',
        content: "क र न त क र न त कर नर तक कन कनक रमन । क र न त"
      },
      {
        id: 'hin-lvl-2',
        title: 'Level 2: Home Row Extension',
        type: 'drill',
        description: 'Focus keys: स ल म य',
        language: 'hindi',
        content: "स ल म य स ल म य सल मल लय यम रस । स ल म य"
      },
      {
        id: 'hin-lvl-3',
        title: "Level 3: Home Row Words",
        type: 'words',
        description: 'Practice words: कर, सर, मन, तक',
        language: 'hindi',
        content: "कर सर मन तक नमन कनक रसम तरक कलश । मन कर सर तक"
      },
      {
        id: 'hin-lvl-4',
        title: "Level 4: The 'Aa' Matra (ा)",
        type: 'words',
        description: 'Words: काम, नाम, तारा',
        language: 'hindi',
        content: "काम नाम तारा माला ताला राम आम काला नाला । काम नाम तारा"
      },
      {
        id: 'hin-lvl-5',
        title: 'Level 5: Home Row Proficiency',
        type: 'paragraph',
        description: 'Sentence mix using learned keys.',
        language: 'hindi',
        content: "राम काम कर। माला ताला ला। सरला खाना खा। कमला गाना गा। रमन नल पर जल भर। सावन आया।"
      }
    ]
  },
  {
    id: 'hin-phase-2',
    title: 'Phase 2: Upper Row (L6-10)',
    description: 'Expanding to Upper Row and Vowels.',
    lessons: [
      {
        id: 'hin-lvl-6',
        title: 'Level 6: Upper Row Core',
        type: 'drill',
        description: 'Focus keys: च व प ज ट',
        language: 'hindi',
        content: "च व प ज ट चट पट जप तप वन जल । च व प ज ट"
      },
      {
        id: 'hin-lvl-7',
        title: 'Level 7: Upper Row Matras',
        type: 'words',
        description: 'Matras: ु ू ो ौ',
        language: 'hindi',
        content: "कुल फूल शोर गौरव सुनो भालू कोमल सूरज । ु ू ो ौ"
      },
      {
        id: 'hin-lvl-8',
        title: 'Level 8: Combined Home & Upper',
        type: 'words',
        description: 'Words mixing home and upper rows.',
        language: 'hindi',
        content: "जलज पवन कलम चमन पलक लपक । च व प ज ट क र न त"
      },
      {
        id: 'hin-lvl-9',
        title: "Level 9: Vowels 'E' and 'Ai'",
        type: 'words',
        description: 'Matras: े ै (मेला, कैसा)',
        language: 'hindi',
        content: "मेला कैसा रेल पैसा खेल थैला बेटा मैना । े ै"
      },
      {
        id: 'hin-lvl-10',
        title: 'Level 10: Phase 2 Milestone',
        type: 'paragraph',
        description: 'Complex upper-home mix.',
        language: 'hindi',
        content: "गौरव मेला देखने गया। उसने वहां खेल देखा। कैलाश ने पैसा दिया। सूरज पूरब से निकलता है।"
      }
    ]
  },
  {
    id: 'hin-phase-3',
    title: 'Phase 3: Lower Row (L11-15)',
    description: 'Mastering the Lower Row keys.',
    lessons: [
      {
        id: 'hin-lvl-11',
        title: 'Level 11: Lower Row Core',
        type: 'drill',
        description: 'Focus keys: ग ब अ इ ध',
        language: 'hindi',
        content: "ग ब अ इ ध गम बल अब इस धन । ग ब अ इ ध"
      },
      {
        id: 'hin-lvl-12',
        title: 'Level 12: Lower Row Extension',
        type: 'drill',
        description: 'Focus keys: ड ढ ण थ',
        language: 'hindi',
        content: "ड ढ ण थ डर ढल कण थल । ड ढ ण थ"
      },
      {
        id: 'hin-lvl-13',
        title: "Level 13: The 'Ri' Matra (ृ)",
        type: 'words',
        description: 'Words: कृपा, मृग',
        language: 'hindi',
        content: "कृपा मृग गृह वृक्ष घृत तृण । ृ कृपा मृग"
      },
      {
        id: 'hin-lvl-14',
        title: 'Level 14: Full Keyboard Fusion',
        type: 'words',
        description: '3-row words.',
        language: 'hindi',
        content: "बगीचा डमरू ढोलक थर्मस अननास । ग ब अ इ ध ड ढ ण थ"
      },
      {
        id: 'hin-lvl-15',
        title: 'Level 15: Phase 3 Milestone',
        type: 'paragraph',
        description: 'Stamina drill.',
        language: 'hindi',
        content: "बाघ वन में रहता है। किसान हल चलाता है। भारत एक विशाल देश है। हमें अपने देश पर गर्व है।"
      }
    ]
  },
  {
    id: 'hin-phase-4',
    title: 'Phase 4: Shift & Half Letters (L16-20)',
    description: 'Advanced characters and conjuncts.',
    lessons: [
      {
        id: 'hin-lvl-16',
        title: 'Level 16: Half Letters - Left Hand',
        type: 'drill',
        description: 'Focus: क् त् न् म्',
        language: 'hindi',
        content: "क् त् न् म् क्या त्याग न्याय म्यान । क् त् न् म्"
      },
      {
        id: 'hin-lvl-17',
        title: 'Level 17: Half Letters - Right Hand',
        type: 'drill',
        description: 'Focus: थ् ध् भ् श्',
        language: 'hindi',
        content: "थ् ध् भ् श् तथ्य ध्यान सभ्य श्याम । थ् ध् भ् श्"
      },
      {
        id: 'hin-lvl-18',
        title: 'Level 18: Conjuncts - Joint Characters',
        type: 'words',
        description: 'Focus: क्ष त्र ज्ञ श्र',
        language: 'hindi',
        content: "क्षमा त्रिशूल ज्ञान श्रम कक्षा मित्र यज्ञ श्रीमान । क्ष त्र ज्ञ श्र"
      },
      {
        id: 'hin-lvl-19',
        title: "Level 19: 'Ra' Variations",
        type: 'words',
        description: 'Focus: ्र र् (प्रेम, धर्म)',
        language: 'hindi',
        content: "क्रम प्रेम धर्म कर्म प्रकाश सूर्य पर्वत । ्र र्"
      },
      {
        id: 'hin-lvl-20',
        title: 'Level 20: Phase 4 Milestone',
        type: 'paragraph',
        description: 'Conjunct mastery.',
        language: 'hindi',
        content: "विद्वान सर्वत्र पूज्यते। परिश्रम सफलता की कुंजी है। राष्ट्र की रक्षा करना हमारा परम कर्तव्य है। क्षमा वीरों का आभूषण है।"
      }
    ]
  },
  {
    id: 'hin-phase-5',
    title: 'Phase 5: Symbols & Professional (L21-25)',
    description: 'Numbers, symbols, and business terms.',
    lessons: [
      {
        id: 'hin-lvl-21',
        title: 'Level 21: Numbers & Punctuation',
        type: 'drill',
        description: 'Focus: 1-0, ।, ?',
        language: 'hindi',
        content: "१ २ ३ ४ ५ ६ ७ ८ ९ ० । ? १० २० ५० १००"
      },
      {
        id: 'hin-lvl-22',
        title: 'Level 22: Advanced Symbols',
        type: 'drill',
        description: 'brackets, quotes',
        language: 'hindi',
        content: "( ) \" ' - [ ] { } / = + * & % $ # @"
      },
      {
        id: 'hin-lvl-23',
        title: 'Level 23: Professional Abbreviations',
        type: 'words',
        description: 'Focus: डॉ., पं., श्रीमान',
        language: 'hindi',
        content: "डॉ. पं. श्री. सुश्री. प्रो. लि. कं. । डॉ. शर्मा"
      },
      {
        id: 'hin-lvl-24',
        title: 'Level 24: High-Frequency Drills',
        type: 'words',
        description: 'Speed building.',
        language: 'hindi',
        content: "है और की के में से को पर इस का कि यह वह"
      },
      {
        id: 'hin-lvl-25',
        title: 'Level 25: Professional Vocabulary',
        type: 'paragraph',
        description: 'Business terms.',
        language: 'hindi',
        content: "महोदय, आपके पत्र के संदर्भ में निवेदन है कि माल की आपूर्ति समय पर कर दी गई है। कृपया भुगतान शीघ्र करें।"
      }
    ]
  },
  {
    id: 'hin-phase-6',
    title: 'Phase 6: Exam Mastery (L26-30)',
    description: 'Final preparation for exams.',
    lessons: [
      {
        id: 'hin-lvl-26',
        title: 'Level 26: Historical/Patriotic',
        type: 'paragraph',
        description: 'Patriotic snippets.',
        language: 'hindi',
        content: "सारे जहां से अच्छा हिंदोस्तां हमारा। हम बुलबुलें हैं इसकी, यह गुलिस्तां हमारा। जय हिंद। वंदे मातरम।"
      },
      {
        id: 'hin-lvl-27',
        title: 'Level 27: Literary Paragraphs',
        type: 'paragraph',
        description: 'Premchand excerpts.',
        language: 'hindi',
        content: "हीरा और मोती दो बैल थे। दोनों में बहुत गहरा प्रेम था। वे नांद में एक साथ मुंह डालते और एक साथ हटाते थे।"
      },
      {
        id: 'hin-lvl-28',
        title: 'Level 28: Legal & Govt Draft',
        type: 'paragraph',
        description: 'Official drafting.',
        language: 'hindi',
        content: "उपर्युक्त विषय में लेख है कि आपके आवेदन पर विचार किया जा रहा है। सक्षम अधिकारी के अनुमोदन उपरांत आदेश जारी किए जाएंगे।"
      },
      {
        id: 'hin-lvl-29',
        title: 'Level 29: Modern Terminology',
        type: 'paragraph',
        description: 'Tech terms in Hindi.',
        language: 'hindi',
        content: "आज का युग सूचना प्रौद्योगिकी का युग है। कंप्यूटर और इंटरनेट ने मानव जीवन को बहुत सरल बना दिया है।"
      },
      {
        id: 'hin-lvl-30',
        title: 'Level 30: Final 50 WPM Marathon',
        type: 'paragraph',
        description: 'The ultimate challenge.',
        language: 'hindi',
        content: "सफलता का कोई शॉर्टकट नहीं होता। निरंतर अभ्यास और दृढ़ संकल्प से ही लक्ष्य की प्राप्ति संभव है। जो समय का सदुपयोग करते हैं, वे ही जीवन में उन्नति करते हैं।"
      }
    ]
  }

];

// Flat list for easier lookup
const ALL_LESSONS = CURRICULUM.flatMap(level => level.lessons);

// --- HAND ANALYSIS COMPONENT ---

const HandAnalysis: React.FC<{ mistakes: Record<string, number> }> = ({ mistakes }) => {
  // Aggregate mistakes by finger
  const fingerErrors: Record<string, number> = {};

  if (mistakes) {
    Object.entries(mistakes).forEach(([key, val]) => {
      if (!key) return;

      // Map the key character to the finger safely
      const lowerKey = key.toLowerCase();
      // Safe access to FINGER_MAP
      const map = FINGER_MAP as Record<string, string>;
      const finger = map[lowerKey] || map[key] || 'Unknown';

      const count = Number(val) || 0;

      if (finger !== 'Unknown' && count > 0) {
        fingerErrors[finger] = (fingerErrors[finger] || 0) + count;
      }
    });
  }

  const getColor = (fingerName: string) => {
    const err = fingerErrors[fingerName] || 0;
    if (err > 5) return "#ff0000"; // Neon Red
    if (err > 0) return "#fbbf24"; // Neon Amber
    return "#374151"; // Gray-700 (Base color)
  };

  const getStroke = (fingerName: string) => {
    const err = fingerErrors[fingerName] || 0;
    if (err > 5) return "#ef4444"; // Red Glow
    if (err > 0) return "#f59e0b"; // Amber Glow
    return "#1f2937"; // Dark Gray Stroke
  };

  const getClass = (fingerName: string) => {
    const err = fingerErrors[fingerName] || 0;
    return err > 0 ? "animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "";
  }

  return (
    <div className="flex flex-col items-center mt-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Finger Error Heatmap</h3>
      <div className="flex gap-12 sm:gap-20">
        {/* Left Hand SVG */}
        <div className="relative w-28 h-28 sm:w-40 sm:h-40 group">
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg filter hover:brightness-110 transition-all">
            {/* Pinky */}
            <path d="M10 50 L10 30 Q10 25 15 25 Q20 25 20 30 L20 50" fill={getColor('Left Pinky')} stroke={getStroke('Left Pinky')} strokeWidth="1.5" className={getClass('Left Pinky')} />
            {/* Ring */}
            <path d="M22 50 L22 20 Q22 15 27 15 Q32 15 32 20 L32 50" fill={getColor('Left Ring')} stroke={getStroke('Left Ring')} strokeWidth="1.5" className={getClass('Left Ring')} />
            {/* Middle */}
            <path d="M34 50 L34 10 Q34 5 39 5 Q44 5 44 10 L44 50" fill={getColor('Left Middle')} stroke={getStroke('Left Middle')} strokeWidth="1.5" className={getClass('Left Middle')} />
            {/* Index */}
            <path d="M46 50 L46 20 Q46 15 51 15 Q56 15 56 20 L56 60" fill={getColor('Left Index')} stroke={getStroke('Left Index')} strokeWidth="1.5" className={getClass('Left Index')} />
            {/* Thumb */}
            <path d="M60 70 L75 60 Q80 65 75 75 L60 85" fill={getColor('Thumbs')} stroke={getStroke('Thumbs')} strokeWidth="1.5" className={getClass('Thumbs')} />
            {/* Palm */}
            <path d="M10 50 L56 60 L60 85 Q60 110 30 110 Q10 110 10 50" fill="#1f2937" stroke="#000000" strokeWidth="1" />
            <text x="35" y="100" fontSize="10" fontWeight="bold" fill="#6b7280">LEFT</text>
          </svg>
        </div>

        {/* Right Hand SVG */}
        <div className="relative w-28 h-28 sm:w-40 sm:h-40 group">
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg filter hover:brightness-110 transition-all">
            {/* Thumb */}
            <path d="M40 70 L25 60 Q20 65 25 75 L40 85" fill={getColor('Thumbs')} stroke={getStroke('Thumbs')} strokeWidth="1.5" className={getClass('Thumbs')} />
            {/* Index */}
            <path d="M44 60 L44 20 Q44 15 49 15 Q54 15 54 20 L54 50" fill={getColor('Right Index')} stroke={getStroke('Right Index')} strokeWidth="1.5" className={getClass('Right Index')} />
            {/* Middle */}
            <path d="M56 50 L56 10 Q56 5 61 5 Q66 5 66 10 L66 50" fill={getColor('Right Middle')} stroke={getStroke('Right Middle')} strokeWidth="1.5" className={getClass('Right Middle')} />
            {/* Ring */}
            <path d="M68 50 L68 20 Q68 15 73 15 Q78 15 78 20 L78 50" fill={getColor('Right Ring')} stroke={getStroke('Right Ring')} strokeWidth="1.5" className={getClass('Right Ring')} />
            {/* Pinky */}
            <path d="M80 50 L80 30 Q80 25 85 25 Q90 25 90 30 L90 50" fill={getColor('Right Pinky')} stroke={getStroke('Right Pinky')} strokeWidth="1.5" className={getClass('Right Pinky')} />
            {/* Palm */}
            <path d="M90 50 L44 60 L40 85 Q40 110 70 110 Q90 110 90 50" fill="#1f2937" stroke="#000000" strokeWidth="1" />
            <text x="45" y="100" fontSize="10" fontWeight="bold" fill="#6b7280">RIGHT</text>
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_red]"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">High Error</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_orange]"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">Low Error</span>
        </div>
      </div>
    </div>
  );
};


const TypingTutorial: React.FC = () => {
  const { lang, lessonId } = useParams();
  const navigate = useNavigate();

  // State
  const [activeLangTab, setActiveLangTab] = useState<'english' | 'hindi'>('english');
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    'eng-beginner': true, 'eng-top': true, 'eng-bottom': false,
    'hin-beginner': true
  });

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [layout, setLayout] = useState<'qwerty' | 'inscript' | 'remington'>('qwerty'); // Layout State
  const [isShiftPressed, setIsShiftPressed] = useState(false); // Shift State

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Analysis State
  const [mistakeKeys, setMistakeKeys] = useState<Record<string, number>>({});

  // Speed Tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  // Sound & Settings
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('typingSoundEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  // Sync Language with URL
  useEffect(() => {
    if (lang === 'hindi') setActiveLangTab('hindi');
    else if (lang === 'english') setActiveLangTab('english');
  }, [lang]);

  // Auto-set layout based on language
  useEffect(() => {
    if (currentLesson?.language === 'hindi') {
      setLayout('inscript');
    } else {
      setLayout('qwerty');
    }
  }, [currentLesson]);

  // Sound Effect
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    const audio = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => { });
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      localStorage.setItem('typingSoundEnabled', String(!prev));
      return !prev;
    });
  };

  // Load Lesson
  useEffect(() => {
    if (lessonId) {
      const found = ALL_LESSONS.find(l => l.id === lessonId);
      if (found) {
        setCurrentLesson(found);
        resetLesson();
      }
    }
  }, [lessonId]);

  const resetLesson = () => {
    setCurrentIndex(0);
    setMistakes(0);
    setMistakeKeys({});
    setIsCompleted(false);
    setLastKeyPressed(null);
    setStartTime(null);
    setWpm(0);
    setTimeLeft(120);
  };

  const getNextLessonId = () => {
    if (!currentLesson) return null;
    const currentIndex = ALL_LESSONS.findIndex(l => l.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < ALL_LESSONS.length - 1) {
      return ALL_LESSONS[currentIndex + 1].id;
    }
    return null;
  };

  // Timer Logic for Paragraphs
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime && !isCompleted && currentLesson?.type === 'paragraph' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isCompleted, currentLesson, timeLeft]);

  const toggleLevel = (id: string) => {
    setExpandedLevels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Key Up (for Shift)
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(false);
    }
  }, []);

  // Handle Typing
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(true);
      return;
    }

    if (isCompleted || !currentLesson) return;

    // Prevent default scrolling for Space
    if (e.key === ' ') e.preventDefault();

    // Ignore modifier keys
    if (['Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

    setLastKeyPressed(e.key);
    playClickSound();

    // Start Timer on first keypress
    let currentStart = startTime;
    if (!currentStart) {
      currentStart = Date.now();
      setStartTime(currentStart);
    }

    const targetChar = currentLesson.content[currentIndex];

    // Hindi Mapping Logic
    let processedKey = e.key;
    if (currentLesson.language === 'hindi' && processedKey !== ' ') {
      const map = layout === 'remington' ? REMINGTON_DISPLAY_MAP : INSCRIPT_DISPLAY_MAP;
      const mapping = map[processedKey.toLowerCase()];
      if (mapping) {
        processedKey = isShiftPressed && mapping.shift ? mapping.shift : mapping.normal;
      }
    }

    // Simple matching
    if (processedKey === targetChar) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Calculate WPM: (Chars / 5) / Time in Minutes
      if (currentStart) {
        const timeElapsedMin = (Date.now() - currentStart) / 60000;
        // Avoid infinity on very start
        if (timeElapsedMin > 0.001) {
          const currentWpm = Math.round((nextIndex / 5) / timeElapsedMin);
          setWpm(currentWpm);
        }
      }

      if (nextIndex >= currentLesson.content.length) {
        setIsCompleted(true);
      }
    } else {
      setMistakes((prev: number) => prev + 1);
      // Track which key should have been pressed
      setMistakeKeys((prev: Record<string, number>) => {
        const currentCount = prev[targetChar] || 0;
        return {
          ...prev,
          [targetChar]: currentCount + 1
        };
      });
    }

    setTimeout(() => setLastKeyPressed(null), 150);

  }, [currentIndex, currentLesson, isCompleted, startTime, mistakeKeys, playClickSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'drill': return <Keyboard size={16} />;
      case 'words': return <BookOpen size={16} />;
      case 'paragraph': return <AlignLeft size={16} />;
      default: return <Keyboard size={16} />;
    }
  };

  // --- VIEW: CURRICULUM LIST ---
  if (!lessonId) {
    const filteredCurriculum = CURRICULUM.filter(level =>
      activeLangTab === 'english' ? level.id.startsWith('eng') : level.id.startsWith('hin')
    );

    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 relative overflow-hidden">
        {/* BG Decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[400px] h-[400px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
          </div>

          {/* Language Toggle (Only if no lang param) */}
          {!lang && (
            <div className="flex justify-center mb-10">
              <div className="bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl shadow-black/50 border border-gray-800 inline-flex relative overflow-hidden">
                {/* Background Slider */}
                <div
                  className="absolute top-1.5 bottom-1.5 bg-brand-purple rounded-xl transition-all duration-300 ease-out z-0"
                  style={{
                    left: activeLangTab === 'english' ? '6px' : 'calc(50% + 1px)',
                    width: 'calc(50% - 7px)'
                  }}
                ></div>

                <button
                  onClick={() => setActiveLangTab('english')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl font-extrabold text-sm transition-colors flex items-center gap-2 min-w-[160px] justify-center ${activeLangTab === 'english' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Languages size={18} /> English Course
                </button>
                <button
                  onClick={() => setActiveLangTab('hindi')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl font-extrabold text-sm transition-colors flex items-center gap-2 min-w-[160px] justify-center ${activeLangTab === 'hindi' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Languages size={18} /> Hindi Course
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredCurriculum.map((level) => (
              <div key={level.id} className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gray-700 transition-all">
                {/* Level Header */}
                <button
                  onClick={() => toggleLevel(level.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${level.title.includes('English') ? 'bg-blue-900/30 text-blue-400' : 'bg-orange-900/30 text-orange-400'}`}>
                      {level.title.includes('English') ? <Keyboard size={20} /> : <Languages size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">{level.title}</h3>
                      <p className="text-[12px] text-gray-500 font-medium">{level.description}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-800 rounded-full text-gray-400 group-hover:text-brand-purple transition-colors">
                    {expandedLevels[level.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Lesson Grid */}
                {expandedLevels[level.id] && (
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-gray-800 bg-gray-950/30">
                    {level.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-brand-purple hover:bg-gray-800 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(`/learn/${lesson.language}/${lesson.id}`)}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="p-1.5 bg-gray-800 rounded-lg text-gray-500 group-hover:text-brand-purple group-hover:bg-purple-900/20 transition-colors">
                                {getLessonIcon(lesson.type)}
                              </span>
                              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest group-hover:text-gray-400">
                                {lesson.type}
                              </span>
                            </div>
                            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-400 font-bold flex items-center gap-1 group-hover:text-white group-hover:bg-brand-purple">
                              <Timer size={10} /> 3M
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-gray-200 mb-1 group-hover:text-white transition-colors">{lesson.title}</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-1">{lesson.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800 group-hover:border-gray-700">
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Foundation</span>
                          <button
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg group-hover:bg-brand-purple group-hover:text-white transition-all shadow-lg transform group-active:scale-95"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW: ACTIVE LESSON ---
  if (!currentLesson) return null;

  const targetChar = currentLesson.content[currentIndex];
  // Safe calculation for progress bar width
  const progress = currentLesson.content.length > 0 ? Math.round((currentIndex / currentLesson.content.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col relative overflow-hidden">
      {/* Ambient BG */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.8)] z-50"></div>

      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-4">
          <Link to="/learn" className="text-gray-400 hover:text-white font-bold flex items-center gap-1 transition-colors">
            <ArrowLeft size={18} /> Course Map
          </Link>
          <div className="hidden sm:block">
            <h2 className="font-bold text-lg leading-tight text-white">{currentLesson.title}</h2>
            <div className="w-32 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-brand-purple transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Stats Display & Settings */}
        <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
          {currentLesson.type === 'paragraph' && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${timeLeft < 10 ? 'bg-red-900/30 border-red-800 text-red-400 animate-pulse' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>
              <Timer size={16} />
              <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400 fill-yellow-400" />
            <div className="flex flex-col leading-none">
              <span className="text-lg text-white font-mono">{wpm}</span>
              <span className="text-lg text-[9px] uppercase tracking-wide">WPM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-green-400" />
            <div className="flex flex-col leading-none">
              <span className="text-lg text-white font-mono">{Math.max(0, 100 - mistakes)}%</span>
              <span className="text-lg text-[9px] uppercase tracking-wide">Acc</span>
            </div>
          </div>

          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg hover:bg-gray-800 transition ${showSettings ? 'bg-gray-800 text-brand-purple' : 'text-gray-400'}`}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-64 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-white">Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white"><Settings size={16} /></button>
          </div>
          <div className="space-y-3">
            <button onClick={toggleSound} className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm">
              <span>Key Sounds</span>
              {soundEnabled ? <Volume2 size={16} className="text-green-400" /> : <VolumeX size={16} className="text-gray-500" />}
            </button>
            {/* Layout Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Keyboard Layout</label>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setLayout('qwerty')}
                  className={`text-left px-3 py-2 rounded-lg text-sm ${layout === 'qwerty' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  English QWERTY
                </button>
                <button
                  onClick={() => setLayout('inscript')}
                  className={`text-left px-3 py-2 rounded-lg text-sm ${layout === 'inscript' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  Hindi Inscript (Generic)
                </button>
                <button
                  onClick={() => setLayout('remington')}
                  className={`text-left px-3 py-2 rounded-lg text-sm ${layout === 'remington' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  Hindi Remington (Kruti Dev)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {!isCompleted ? (
          <>
            {/* TYPING AREA */}
            {/* TYPING AREA */}
            <div className="max-w-4xl w-full mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative min-h-[160px] font-mono text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap break-words tracking-wide">
                {/* Completed Text */}
                <span className="text-green-400">{currentLesson.content.slice(0, currentIndex)}</span>

                {/* Current Character (Cursor) */}
                <span className="bg-brand-purple/50 text-white animate-pulse rounded px-0.5 border-b-2 border-brand-purple">
                  {currentLesson.content[currentIndex] === ' ' ? '\u00A0' : currentLesson.content[currentIndex]}
                </span>

                {/* Future Text */}
                <span className="text-gray-600">{currentLesson.content.slice(currentIndex + 1)}</span>
              </div>
              <div className="mt-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                {isCompleted ? "Complete!" : "Type the highlighted character..."}
              </div>

              {/* KEYBOARD VISUALIZATION */}
              <div className="mt-8 scale-90 sm:scale-100 origin-top transition-transform">
                <VirtualKeyboard
                  activeChar={targetChar}
                  pressedKey={lastKeyPressed}
                  language={currentLesson.language}
                  layout={layout}
                  isShiftPressed={isShiftPressed}
                />
              </div>
            </div>
          </>
        ) : (
          // COMPLETION SCREEN
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Lesson Complete!</h2>
            <p className="text-gray-400 mb-8">Great job keeping your fingers on the keys.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-2xl">
                <div className="text-3xl font-mono font-bold text-white">{wpm}</div>
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Speed (WPM)</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl">
                <div className="text-3xl font-mono font-bold text-green-400">{Math.max(0, 100 - mistakes)}%</div>
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Accuracy</div>
              </div>
            </div>

            {/* FINGER ANALYSIS */}
            {Object.keys(mistakeKeys).length > 0 && (
              <div className="mb-8 p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
                <HandAnalysis mistakes={mistakeKeys} />
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={resetLesson} className="flex-1 py-3 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={18} /> Retry
              </button>
              {getNextLessonId() ? (
                <button onClick={() => navigate(`/learn/${getNextLessonId()}`)} className="flex-1 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-purple-700 transition-shadow shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2">
                  Next Lesson <ArrowRight size={18} />
                </button>
              ) : (
                <Link to="/learn" className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 flex items-center justify-center gap-2">
                  Back to Menu
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTutorial;