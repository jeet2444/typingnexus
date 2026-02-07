import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Keyboard, Play, RefreshCw, Trophy, Lock, Star, ChevronDown, ChevronUp, ChevronRight, Languages, BookOpen, AlignLeft, Zap, Timer, Hand, Settings, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import VirtualKeyboard, { FINGER_MAP } from './VirtualKeyboard';

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
    id: 'eng-beginner',
    title: 'English: Home Row (A S D F G H J K L ;)',
    description: 'Foundation: Separate Left and Right Hand Drills.',
    lessons: [
      {
        id: 'eng-left-home',
        title: 'Left Hand Only (A S D F G)',
        type: 'drill',
        description: 'Focus purely on left hand fingers.',
        language: 'english',
        content: "asdf asdf gfdsa asdfg dad sad fad gas sag dag asdf asdfg"
      },
      {
        id: 'eng-right-home',
        title: 'Right Hand Only (H J K L ;)',
        type: 'drill',
        description: 'Focus purely on right hand fingers.',
        language: 'english',
        content: "jkl; jkl; hjkl; has had lad ask all fall hall jkl; hjkl;"
      },
      {
        id: 'eng-home-pairs',
        title: 'Home Row Pairs (aa ss dd ff)',
        type: 'drill',
        description: 'Double press combinations for finger agility.',
        language: 'english',
        content: "aa ss dd ff gg hh jj kk ll ;; as sd df fg gh hj jk kl l; sa ds fd gf hg jh kj lk ;l"
      },
      {
        id: 'eng-home-mixed',
        title: 'Home Row Words',
        type: 'words',
        description: 'Fluid words using home row keys.',
        language: 'english',
        content: "dad has a salad flask; all lads had a salad; alas a lad falls; glass dash"
      },
      {
        id: 'eng-home-para',
        title: 'Home Row Paragraph (2 Min)',
        type: 'paragraph',
        description: 'Controlled paragraph practice with 2-minute limit.',
        language: 'english',
        content: "dad had a glass flask. he had a salad at the glass hall. a lad has a gold flag. the glass dash was fast and glad. ask a lad for a salad and a glass."
      }
    ]
  },
  {
    id: 'eng-top',
    title: 'English: Top Row (Q W E R T Y U I O P)',
    description: 'Reach up efficiently. Drills for each hand.',
    lessons: [
      {
        id: 'eng-left-top',
        title: 'Left Hand Top (Q W E R T)',
        type: 'drill',
        description: 'Left hand reaching up.',
        language: 'english',
        content: "qwert qwert trewq we were tree wet red water rate date gate"
      },
      {
        id: 'eng-right-top',
        title: 'Right Hand Top (Y U I O P)',
        type: 'drill',
        description: 'Right hand reaching up.',
        language: 'english',
        content: "yuiop yuiop poiuy you your pour poor top pot toy joy"
      },
      {
        id: 'eng-top-mixed',
        title: 'Top Row Words',
        type: 'words',
        description: 'Fluid typing on top row.',
        language: 'english',
        content: "write quote power route quiet tree root your type top pot"
      },
      {
        id: 'eng-top-paragraph',
        title: 'Paragraph Drill',
        type: 'paragraph',
        description: 'Sentences using Top & Home rows.',
        language: 'english',
        content: "try to write a report for the top power. you were quiet at the tree root. put the pot on the top."
      }
    ]
  },
  {
    id: 'eng-bottom',
    title: 'English: Bottom Row (Z X C V B N M)',
    description: 'Master the downward reach.',
    lessons: [
      {
        id: 'eng-left-bottom',
        title: 'Left Hand Bottom (Z X C V B)',
        type: 'drill',
        description: 'Left hand reaching down.',
        language: 'english',
        content: "zxcvb zxcvb vcxbz cab vanRoot bad bed cab zen cab"
      },
      {
        id: 'eng-right-bottom',
        title: 'Right Hand Bottom (N M , . /)',
        type: 'drill',
        description: 'Right hand reaching down.',
        language: 'english',
        content: "nm,./ nm,./ mn man men moon noon mon mom no on"
      },
      {
        id: 'eng-all-rows',
        title: 'All Rows Integration',
        type: 'paragraph',
        description: 'Using the full keyboard.',
        language: 'english',
        content: "can you move the van back to the zone? the moon can be seen at zero hour. come back man."
      }
    ]
  },
  {
    id: 'eng-shift',
    title: 'English: Shift Keys & Capitals',
    description: 'Pinky coordination drills.',
    lessons: [
      {
        id: 'eng-left-shift',
        title: 'Right Hand Capitals (Left Shift)',
        type: 'drill',
        description: 'Hold Left Shift, type with Right Hand.',
        language: 'english',
        content: "H J K L M N O P I U Y : < > ? Hello John King Lion Moon"
      },
      {
        id: 'eng-right-shift',
        title: 'Left Hand Capitals (Right Shift)',
        type: 'drill',
        description: 'Hold Right Shift, type with Left Hand.',
        language: 'english',
        content: "Q W E R T A S D F G Z X C V B Queen Water Earth Red Green"
      },
      {
        id: 'eng-sentences-caps',
        title: 'Proper Sentences',
        type: 'paragraph',
        description: 'Real world sentences.',
        language: 'english',
        content: "The quick Brown Fox jumps over the Lazy Dog. Hello World! I live in New Delhi, India."
      }
    ]
  },

  // --- HINDI ---
  {
    id: 'hin-beginner',
    title: 'Hindi: Home Row (आधार पंक्ति)',
    description: 'Vowels (Left) & Consonants (Right).',
    lessons: [
      {
        id: 'hin-left-home',
        title: 'Left Hand Matras (ो े ् ि ु)',
        type: 'drill',
        description: 'Master the left hand vowel signs.',
        language: 'hindi',
        content: "ोे्िु ोे्िु ो े ् ि ु ोे ्ि ु ोो ेे ्् िि ुु"
      },
      {
        id: 'hin-right-home',
        title: 'Right Hand Consonants (प र क त च)',
        type: 'drill',
        description: 'Master the right hand consonants.',
        language: 'hindi',
        content: "परकतच परकतच प र क त च चतकरप कतप चरक"
      },
      {
        id: 'hin-home-pairs',
        title: 'आधार पंक्ति जोड़े (ोो ेे ््)',
        type: 'drill',
        description: 'Double press combinations in Hindi.',
        language: 'hindi',
        content: "ोो ेे ्् िि ुु पप रर कक तत चच ो े ् ि ु प र क त च"
      },
      {
        id: 'hin-home-mixed',
        title: 'Hindi Home Row Words',
        type: 'words',
        description: 'Words using only home row keys.',
        language: 'hindi',
        content: "कर पर तर चर रक कप तत चक रर कक पक तक रपट कटर चटक तड़प"
      },
      {
        id: 'hin-home-para',
        title: 'Hindi Paragraph (2 Min)',
        type: 'paragraph',
        description: 'Hindi paragraph practice with 2-minute limit.',
        language: 'hindi',
        content: "कर पर चर रक. रपट कटर चटक. प र क त च. ो े ् ि ु. सरक पर चटक रपट कर. प र क त च."
      }
    ]
  },
  {
    id: 'hin-top',
    title: 'Hindi: Top Row (ऊपरी पंक्ति)',
    description: 'Matras (Left) & Consonants (Right).',
    lessons: [
      {
        id: 'hin-top-left',
        title: 'Left Hand Matras (ौ ै ा ी ू)',
        type: 'drill',
        description: 'Left hand upper matras.',
        language: 'hindi',
        content: "ौैाीू ौैाीू ौ ै ा ी ू ाी ूौ ै ा ी"
      },
      {
        id: 'hin-top-right',
        title: 'Right Hand Consonants (ब ह ग द ज)',
        type: 'drill',
        description: 'Right hand upper consonants.',
        language: 'hindi',
        content: "बहगदज बहगदज ब ह ग द ज जग हद बद गज"
      },
      {
        id: 'hin-top-mixed',
        title: 'Matra Practice (मात्रा अभ्यास)',
        type: 'words',
        description: 'Combining consonants with matras.',
        language: 'hindi',
        content: "काला माला ताला दादा नाना मामा काका चाचा पाप हार जीत गीत पानी रानी"
      }
    ]
  },
  {
    id: 'hin-bottom',
    title: 'Hindi: Bottom Row (निचली पंक्ति)',
    description: 'Common letters M, N, V, L, S.',
    lessons: [
      {
        id: 'hin-bottom-left',
        title: 'Left Hand (्र ं म न व)',
        type: 'drill',
        description: 'Includes Anusvar and Ra-ref.',
        language: 'hindi',
        content: "्र ं म न व मन वन नम मम नव"
      },
      {
        id: 'hin-bottom-right',
        title: 'Right Hand (ल स , . य)',
        type: 'drill',
        description: 'Includes La, Sa, Ya.',
        language: 'hindi',
        content: "ल स , . य लस सल यल सय लय"
      },
      {
        id: 'hin-bottom-mixed',
        title: 'Common Words (सामान्य शब्द)',
        type: 'words',
        description: 'High frequency words.',
        language: 'hindi',
        content: "नमन गरम नरम सनम वन मनन समय सरल सलम लानत वलय नियम संयम"
      }
    ]
  },
  {
    id: 'hin-shift',
    title: 'Hindi: Shift & Conjuncts (संयुक्त अक्षर)',
    description: 'Advanced: Half Characters & Complex Words.',
    lessons: [
      {
        id: 'hin-half-chars',
        title: 'Half Characters (आधे अक्षर)',
        type: 'drill',
        description: 'Using Shift for half characters.',
        language: 'hindi',
        content: "क क् ख ख् ग ग् घ घ् च च् ज ज् त त् न न् प प् ब ब् म म् य य् स स्"
      },
      {
        id: 'hin-conjuncts',
        title: 'Complex Words (कठिन शब्द)',
        type: 'words',
        description: 'Words with half characters.',
        language: 'hindi',
        content: "क्या क्यों विघ्न प्रश्न उत्तर विद्या विद्यालय द्वारा उद्देश्य प्यास न्याय त्याग ध्यान"
      },
      {
        id: 'hin-paragraph',
        title: 'Full Paragraph (अनुच्छेद)',
        type: 'paragraph',
        description: 'Complete Hindi typing practice.',
        language: 'hindi',
        content: "परिश्रम सफलता की कुंजी है। विद्या ददाति विनयं। हमें अपने देश पर गर्व है। सत्यमेव जयते। स्वास्थ्य ही धन है।"
      }
    ]
  },
  {
    id: 'hin-numbers',
    title: 'Hindi: Numbers & Symbols (संख्या और चिह्न)',
    description: 'Top row numbers and their shift symbols (Inscript).',
    lessons: [
      {
        id: 'hin-num-row',
        title: 'Numbers (1-0)',
        type: 'drill',
        description: 'Standard number row practice.',
        language: 'hindi',
        content: "12345 67890 12 34 56 78 90 1 2 3 4 5 6 7 8 9 0"
      },
      {
        id: 'hin-sym-shift',
        title: 'Shift Symbols (Inscript)',
        type: 'drill',
        description: 'Common symbols and conjunct helpers on Number Row.',
        language: 'hindi',
        content: "ऍ ॅ ्र र् ज्ञ त्र क्ष श्र ( ) । ? : 1 2 3"
      },
      {
        id: 'hin-num-mixed',
        title: 'Mixed Context',
        type: 'words',
        description: 'Numbers used in sentences.',
        language: 'hindi',
        content: "100 रुपए 50 लोग 2025 साल 15 अगस्त 26 जनवरी 10 बजे"
      }
    ]
  },
  {
    id: 'hin-advanced-conjuncts',
    title: 'Hindi: Advanced Ra-Forms (र के रूप)',
    description: 'Mastering Paden, Reph, and Truncated Ra.',
    lessons: [
      {
        id: 'hin-ra-paden',
        title: 'Paden Ra (क्रम, भ्रम)',
        type: 'words',
        description: 'Using the Z key (Inscript) or specialized combos.',
        language: 'hindi',
        content: "क्रम भ्रम वक्र ग्रह प्रभाव प्रकाश प्रश्न प्रति प्रथम ग्राम"
      },
      {
        id: 'hin-ra-reph',
        title: 'Reph Ra (धर्म, कर्म)',
        type: 'words',
        description: 'The flying Ra above letters.',
        language: 'hindi',
        content: "धर्म कर्म गर्व पर्वत सूर्य कार्य मार्ग वर्षा हर्ष"
      },
      {
        id: 'hin-ra-truck',
        title: 'Truck Form (ट्रक, ड्रम)',
        type: 'words',
        description: 'Ra form used with Tta and Dda.',
        language: 'hindi',
        content: "ट्रक ड्रम राष्ट्र राष्ट्रीय ट्रेन ड्रामा पेट्रोल मेट्रो"
      }
    ]
  },
  {
    id: 'hin-pro',
    title: 'Hindi: Professional Typing (व्यावसायिक लेखन)',
    description: 'Long paragraphs for speed building.',
    lessons: [
      {
        id: 'hin-story-1',
        title: 'Moral Story (कहानी)',
        type: 'paragraph',
        description: 'A short story practice.',
        language: 'hindi',
        content: "एक बार की बात है, एक जंगल में एक शेर रहता था। वह बहुत शक्तिशाली था। सभी जानवर उससे डरते थे। एक दिन एक छोटा चूहा उसके पास आया और बोला कि वह उससे दोस्ती करना चाहता है।"
      },
      {
        id: 'hin-official',
        title: 'Official Language (औपचारिक)',
        type: 'paragraph',
        description: 'Formal hindi words used in offices.',
        language: 'hindi',
        content: "महोदय, सविनय निवेदन है कि मुझे दो दिन का अवकाश प्रदान करने की कृपा करें। मैं आपका बहुत आभारी रहूँगा। इस संबंध में आवश्यक कार्यवाही करने का कष्ट करें। धन्यवाद।"
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
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // State
  const [activeLangTab, setActiveLangTab] = useState<'english' | 'hindi'>('english');
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    'eng-beginner': true, 'eng-top': true, 'eng-bottom': false,
    'hin-beginner': true
  });

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
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

  // Handle Typing
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isCompleted || !currentLesson) return;

    // Prevent default scrolling for Space
    if (e.key === ' ') e.preventDefault();

    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

    setLastKeyPressed(e.key);
    playClickSound();

    // Start Timer on first keypress
    let currentStart = startTime;
    if (!currentStart) {
      currentStart = Date.now();
      setStartTime(currentStart);
    }

    const targetChar = currentLesson.content[currentIndex];

    // Simple matching
    if (e.key === targetChar) {
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

  }, [currentIndex, currentLesson, isCompleted, startTime, mistakeKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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

          {/* Language Toggle */}
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
                        onClick={() => navigate(`/learn/${lesson.id}`)}
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
              <span className="text-[9px] uppercase tracking-wide">WPM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-green-400" />
            <div className="flex flex-col leading-none">
              <span className="text-lg text-white font-mono">{Math.max(0, 100 - mistakes)}%</span>
              <span className="text-[9px] uppercase tracking-wide">Acc</span>
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
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {!isCompleted ? (
          <>
            {/* TYPING AREA */}
            <div className="max-w-4xl w-full mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative min-h-[160px] flex flex-wrap content-start gap-1 font-mono text-xl sm:text-2xl leading-relaxed">
                {currentLesson.content.split('').map((char, idx) => {
                  let colorClass = "text-gray-600"; // Future text
                  if (idx < currentIndex) {
                    colorClass = "text-green-400"; // Correctly typed
                    // Check if it was a mistake (if we stored mistake indices - simplifed here)
                  } else if (idx === currentIndex) {
                    colorClass = "bg-brand-purple/50 text-white animate-pulse rounded px-0.5"; // Current cursor
                  }

                  return (
                    <span key={idx} className={`${colorClass} transition-colors`}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  )
                })}
              </div>
              <div className="mt-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                {isCompleted ? "Complete!" : "Type the highlighted character..."}
              </div>

              {/* KEYBOARD VISUALIZATION */}
              {currentLesson.type === 'drill' && (
                <div className="mt-8 scale-90 sm:scale-100 origin-top transition-transform">
                  <VirtualKeyboard
                    activeKey={targetChar}
                    pressedKey={lastKeyPressed}
                    language={currentLesson.language}
                  />
                </div>
              )}
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