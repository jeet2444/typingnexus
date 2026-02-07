import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Volume2, Maximize, Layout, Type, RefreshCw, Award, Sparkles, Highlighter, Keyboard, XCircle, Percent, Gauge, MoveRight, Delete, ToggleLeft, ToggleRight, Clock, Check, Target, AlertTriangle, Trophy, ChevronDown, Play, Music } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { processTestResult, Achievement } from '../utils/achievementSystem';
import { getUserProfile } from '../utils/userData';
import { analyzeWeakKeys, generateRemedialDrill, DrillConfig } from '../utils/aiEngine';
import { getAdminStore, Passage } from '../utils/adminStore';
import { splitByGraphemes } from '../utils/textProcessing';
import VirtualKeyboard from './VirtualKeyboard';
import { EXAM_PRESETS, ExamPreset } from './ExamModeSelector';
import { useAuth } from '../context/AuthContext';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { text: string; time: number; hindiText: string }> = {
  Easy: {
    text: "The sun is shining brightly in the blue sky. Birds are singing in the trees. It is a beautiful day to go for a walk in the park. The grass is green and the flowers are blooming. Children are playing on the playground. Everyone looks happy and relaxed. Simple words make typing fast and fun for beginners.",
    hindiText: "भारत एक विशाल देश है। यहाँ विभिन्न संस्कृतियों और धर्मों के लोग मिलजुल कर रहते हैं। हमारी मातृभाषा हिंदी है और हमें इसका सम्मान करना चाहिए। सत्यमेव जयते। परिश्रम ही सफलता की कुंजी है। हमें अपने पर्यावरण की रक्षा करनी चाहिए। शिक्षा जीवन का आधार है।",
    time: 180 // 3 minutes
  },
  Medium: {
    text: "Amazingly, the curious zebra quickly jumps over the vivid fox without making a sound. Just before dawn, every bright star glows in the hazy sky, quietly reflecting on the calm river. The wild jackal enjoys its silent journey across the landscape, watching the playful quail dart between the bushes. Friendly dolphins swim near the shore, where seagulls fly high, echoing their cheerful calls over the ocean waves. As night falls, a yellow moon rises, casting shadows across the tranquil bay.",
    hindiText: "एक बार की बात है, किसी घने जंगल में एक बहुत बड़ा शेर रहता था। वह जंगल का राजा था और सभी जानवर उससे डरते थे। एक दिन शेर सो रहा था कि तभी एक छोटा सा चूहा उसके ऊपर कूदने लगा। शेर की नींद खुल गई और उसने चूहे को अपने पंजों में जकड़ लिया। चूहा बहुत डर गया और उसने चूहे से विनती की कि वह उसे छोड़ दे। शेर को दया आ गई और उसने चूहे को छोड़ दिया। कुछ दिनों बाद, शेर एक शिकारी के जाल में फंस गया।",
    time: 300 // 5 minutes
  },
  Hard: {
    text: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. 12345! It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Unlike classical physics, the accuracy is often probabilistic; calculating the wavefunction requires complex mathematics & rigorous logic.",
    hindiText: "सूचना प्रौद्योगिकी के इस युग में, कंप्यूटर हमारे जीवन का एक अभिन्न अंग बन गया है। इंटरनेट ने दुनिया को एक वैश्विक गाँव में बदल दिया है। शिक्षा, स्वास्थ्य, और व्यापार के क्षेत्र में क्रांतिकारी परिवर्तन हुए हैं। हमें तकनीक का सदुपयोग करना चाहिए ताकि हम समाज की उन्नति में योगदान दे सकें। साइबर सुरक्षा भी एक महत्वपूर्ण मुद्दा है जिस पर ध्यान देना आवश्यक है।",
    time: 300 // 5 minutes
  }
};

interface TestSettings {
  backspace: 'on' | 'off' | 'limited';
  highlight: boolean;
  autoScroll: boolean;
  sound: boolean;
  extraSpace: boolean;
  fontSize: number;
  tcsLayout: boolean;
  sonyHighlight: boolean;
  customDuration: number | null; // Custom duration in seconds
  language: 'english' | 'hindi';
  layout: 'qwerty' | 'remington' | 'inscript';
  fontFamily: 'sans' | 'mangal'; // sans for English, mangal for Hindi Mangal
  hideUserInfo: boolean;
}

interface TestResult {
  wpm: number;
  grossWpm: number;
  netWpm: number;
  accuracy: string;
  errors: number;
  keystrokes: number;
  backspaceCount: number;
  fullMistakes: number;
  halfMistakes: number;
  timeTaken: string;
}

const TypingTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG['Medium'].time);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('appearance');
  const [pasteWarning, setPasteWarning] = useState(false);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Exam Mode State
  const [currentExamMode, setCurrentExamMode] = useState<ExamPreset | null>(null);
  const [keyDepressions, setKeyDepressions] = useState(0);
  const [passageContent, setPassageContent] = useState<string | null>(null);
  const [passageAudioUrl, setPassageAudioUrl] = useState<string | null>(null);

  // Dashboard State
  const [showResult, setShowResult] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [newBadges, setNewBadges] = useState<Achievement[]>([]);
  const [showDetailedComparison, setShowDetailedComparison] = useState(true);

  // AI Coach State
  const [remedialDrill, setRemedialDrill] = useState<DrillConfig | null>(null);
  const [customTextOverride, setCustomTextOverride] = useState<string | null>(null);

  // Authentication & Access Control
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load exam mode from URL params
  useEffect(() => {
    const examId = searchParams.get('exam') || searchParams.get('examId'); // Query param
    const passageId = searchParams.get('passageId');

    if (examId) {
      const store = getAdminStore();
      // Try to find in standard exams first
      const adminExam = store.exams.find(e => e.id.toString() === examId);

      if (adminExam) {
        // Enforce Login for Admin Exams (Premium Content)
        if (!isAuthenticated) {
          // Check if it's one of the "Free" ones (optional logic if we want to flag some admin exams as free)
          // For now, based on user request: "Exam ... will be user can used after login"
          // So ALL admin exams are blocked.
          navigate('/login', { state: { from: `/typing-test?${searchParams.toString()}` } });
          return;
        }

        // Found an Admin-created Exam
        const rule = store.rules.find(r => r.id === adminExam.ruleId);
        if (rule) {
          setTimeLeft(rule.duration * 60);
          setDifficulty(adminExam.difficulty as Difficulty);

          // Set Passage Content if available in Admin Exam
          if (adminExam.content) {
            setPassageContent(adminExam.content);
          }

          setSettings(prev => ({
            ...prev,
            backspace: rule.backspace === 'Enabled' ? 'on' : rule.backspace === 'Disabled' ? 'off' : 'limited',
            highlight: rule.highlighting,
            language: adminExam.language.toLowerCase().includes('hindi') ? 'hindi' : 'english',
            layout: rule.font.toLowerCase().includes('mangal') ? 'remington' : 'qwerty', // Basic inference
            fontFamily: rule.font.toLowerCase().includes('mangal') ? 'mangal' : 'sans',
            customDuration: rule.duration * 60
          }));
        }
      } else {
        // Fallback to Presets (Free Section)
        const exam = EXAM_PRESETS.find(e => e.id === examId);
        if (exam) {
          setCurrentExamMode(exam);
          setTimeLeft(exam.duration);
          setSettings(prev => ({
            ...prev,
            backspace: exam.backspaceAllowed ? 'on' : 'off',
            highlight: exam.highlightingEnabled,
            language: exam.language === 'hindi' ? 'hindi' : 'english',
            layout: exam.layout as any,
            tcsLayout: !exam.highlightingEnabled
          }));
        }
      }
    }

    if (passageId) {
      const store = getAdminStore();

      // 1. Try finding in Passages (Standard + Virtual injected by getAdminStore)
      let passage = store.passages?.find(p => p.id === parseInt(passageId));

      // 2. Fallback: If not found, check if it's a negative ID (Virtual) and try to find matching Exam
      if (!passage && parseInt(passageId) < 0) {
        const virtualExamId = Math.abs(parseInt(passageId));
        const exam = store.exams.find(e => e.id === virtualExamId);
        if (exam && exam.content) {
          passage = {
            id: -exam.id,
            title: exam.contentTitle || exam.title,
            content: exam.content,
            language: exam.language as any,
            difficulty: 'Medium',
            category: 'Exam',
            wordCount: exam.content.split(/\s+/).length,
            tags: ['Exam'],
            status: 'Active',
            createdDate: new Date().toISOString()
          };
        }
      }

      if (passage) {
        setPassageContent(passage.content);
        setPassageAudioUrl(passage.audioUrl || null);
        // Only override if not already set by Exam Logic
        if (!currentExamMode) {
          setTimeLeft(600); // Default 10 mins if just passage
        }
      }
    }
  }, [searchParams, isAuthenticated, navigate]);

  // Settings State
  const [settings, setSettings] = useState<TestSettings>({
    backspace: 'on',
    highlight: false, // TCS Default: Highlight OFF
    autoScroll: true,
    sound: false,
    extraSpace: true,
    fontSize: 18,
    tcsLayout: false,
    sonyHighlight: true,
    customDuration: null,
    language: 'english',
    layout: 'qwerty',
    fontFamily: 'sans',
    hideUserInfo: false
  });

  // Text source: passageContent > customTextOverride > default
  const currentText = passageContent || customTextOverride || (settings.language === 'hindi'
    ? DIFFICULTY_CONFIG[difficulty].hindiText
    : DIFFICULTY_CONFIG[difficulty].text);

  const isTcs = settings.tcsLayout || (currentExamMode && !currentExamMode.highlightingEnabled);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Background Atmosphere Sound Logic
  useEffect(() => {
    if (passageAudioUrl) {
      const audio = new Audio(passageAudioUrl);
      audio.loop = true;
      audio.volume = 0.4;
      backgroundAudioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = "";
        backgroundAudioRef.current = null;
      };
    }
  }, [passageAudioUrl]);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (isActive && !isPaused && !showResult) {
        backgroundAudioRef.current.play().catch(e => console.warn("Atmos audio play failed", e));
      } else {
        backgroundAudioRef.current.pause();
      }
    }
  }, [isActive, isPaused, showResult]);

  // Helper to get effective duration
  const getTotalDuration = () => {
    return settings.customDuration !== null ? settings.customDuration : DIFFICULTY_CONFIG[difficulty].time;
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = (type: 'correct' | 'error' | 'finish') => {
    if (!settings.sound) return;
    try {
      // Use Custom MP3 for correct keystrokes
      if (type === 'correct') {
        const audio = new Audio('/typing-sound.mp3');
        audio.volume = 0.5;
        audio.currentTime = 0;
        audio.play().catch(e => {
          // Fallback to oscillator if file not found/fails
          // console.warn("Custom sound failed, using fallback", e);
          playOscillatorSound(type);
        });
        return;
      }

      // Use Oscillator for Error/Finish
      playOscillatorSound(type);

    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const playOscillatorSound = (type: 'correct' | 'error' | 'finish') => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'correct') { // Fallback only
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.1);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'finish') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.1);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.start(now);
      osc.stop(now + 1.0);
    }
  };

  const resetTest = () => {
    setIsActive(false);
    setIsPaused(false);
    setInputText('');
    setBackspaceCount(0);
    setPressedKey(null);
    setTimeLeft(getTotalDuration());
    setShowResult(false);
    setTestResult(null);
    setNewBadges([]);
    setRemedialDrill(null); // Clear drill offer
    setCustomTextOverride(null); // Reset custom text
    setUserProfile(getUserProfile());
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus();
  };

  const startRemedialDrill = () => {
    if (!remedialDrill) return;
    setCustomTextOverride(remedialDrill.text);
    setSettings(prev => ({
      ...prev,
      customDuration: remedialDrill.duration,
      backspace: 'on'
    }));
  };

  useEffect(() => {
    resetTest();
  }, [difficulty, settings.customDuration, settings.language]);

  const calculateErrors = () => {
    let errors = 0;
    const refChars = splitByGraphemes(currentText, settings.language === 'hindi' ? 'hi' : 'en');
    const inputChars = splitByGraphemes(inputText, settings.language === 'hindi' ? 'hi' : 'en');
    inputChars.forEach((char, idx) => {
      if (idx < refChars.length && char !== refChars[idx]) {
        errors++;
      }
    });
    return errors;
  };

  const errors = calculateErrors();
  const keystrokes = inputText.length;
  const accuracy = keystrokes > 0
    ? Math.max(0, ((keystrokes - errors) / keystrokes) * 100).toFixed(1)
    : '100';

  const finishTest = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('finish');
    const totalTime = getTotalDuration();
    const timeSpentSeconds = totalTime - timeLeft;
    const minutes = timeSpentSeconds / 60;
    const safeMinutes = minutes > 0 ? minutes : 0.01;
    const grossWpm = Math.round((keystrokes / 5) / safeMinutes);
    const netWpm = Math.max(0, Math.round(grossWpm - (errors / safeMinutes)));
    const badges = processTestResult(netWpm, parseFloat(accuracy));

    // AI Analysis
    const weakKeys = analyzeWeakKeys(inputText, currentText);
    if (weakKeys.length > 0) {
      const drill = generateRemedialDrill(weakKeys);
      setRemedialDrill(drill);
    }

    setTestResult({
      wpm: netWpm,
      grossWpm,
      netWpm,
      accuracy,
      errors,
      keystrokes,
      backspaceCount,
      fullMistakes: errors,
      halfMistakes: 0,
      timeTaken: `${Math.floor(timeSpentSeconds / 60).toString().padStart(2, '0')}:${(timeSpentSeconds % 60).toString().padStart(2, '0')} min`
    });
    setNewBadges(badges);
    setShowResult(true);
  };


  const progressPercentage = Math.min(100, (inputText.length / currentText.length) * 100);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      finishTest();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, timeLeft]);

  useEffect(() => {
    if (settings.autoScroll && textContainerRef.current) {
      if (settings.sonyHighlight && currentWordRef.current) {
        currentWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const percent = inputText.length / currentText.length;
        textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight * percent;
      }
    }
  }, [inputText, settings.autoScroll, settings.sonyHighlight]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showResult) return;
    if (!isActive && timeLeft > 0) setIsActive(true);
    const newVal = e.target.value;
    let pKey = null;
    let isBlocked = false;
    if (newVal.length < inputText.length) {
      setBackspaceCount(prev => prev + 1);
      pKey = 'Backspace';
      if (settings.backspace === 'off') isBlocked = true;
      else if (settings.backspace === 'limited' && inputText.endsWith(' ')) isBlocked = true;
    } else if (newVal.length > inputText.length) {
      pKey = newVal.slice(-1);
    }
    if (pKey) {
      setPressedKey(pKey);
      setTimeout(() => setPressedKey(null), 150);
    }
    if (isBlocked) return;
    if (newVal.length <= currentText.length) {
      setInputText(newVal);
      if (newVal.length > inputText.length) {
        const charIndex = newVal.length - 1;
        const char = newVal[charIndex];
        const correctChar = currentText[charIndex];
        char === correctChar ? playSound('correct') : playSound('error');
      } else {
        playSound('correct');
      }
      if (newVal.length === currentText.length) {
        setTimeout(finishTest, 100);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 2500);
  };

  const formatTimeMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} mins : ${secs.toString().padStart(2, '0')} sec`;
  };

  const getFontSizeClass = () => {
    if (settings.fontSize === 14) return 'text-sm';
    if (settings.fontSize === 16) return 'text-base';
    if (settings.fontSize === 18) return 'text-lg';
    if (settings.fontSize === 20) return 'text-xl';
    return 'text-lg';
  };

  const renderStandardText = () => {
    const chars = splitByGraphemes(currentText, settings.language === 'hindi' ? 'hi' : 'en');
    const inputChars = splitByGraphemes(inputText, settings.language === 'hindi' ? 'hi' : 'en');
    return chars.map((char, index) => {
      let colorClass = 'text-gray-400';
      let bgClass = '';
      let isError = false;
      if (index < inputChars.length) {
        if (inputChars[index] === char) {
          colorClass = 'text-green-600 font-medium';
        } else {
          isError = true;
          if (char === ' ') {
            bgClass = 'bg-red-500/50';
            colorClass = 'text-transparent';
          } else {
            colorClass = 'text-red-600 font-bold';
            bgClass = 'bg-red-100';
          }
        }
      } else {
        colorClass = 'text-gray-700';
      }
      const isCurrent = index === inputChars.length;
      let cursorClass = '';


      // If Highlight is OFF, we override colors to be Simple Black/None
      if (!settings.highlight) {
        bgClass = 'bg-transparent';
        colorClass = 'text-black'; // Default all text to black

        // Ensure even past characters are black, overruling the logic above
        if (index < inputChars.length) {
          // Do nothing, keep it black. 
          // Logic above sets colorClass to green/red, so we MUST override it here.
          // Or better, wrap the initial coloring logic in `if (settings.highlight)`.
          // But since I am editing this block, I will just force it here.
          colorClass = 'text-black';
        }

        if (isCurrent) {
          // Minimal cursor
          cursorClass = 'border-l-2 border-black animate-pulse -ml-[1px]';
        }
      } else {
        // Highlight ON: Standard Logic reuse
        // The logic above (lines 496-510) already sets green/red
        // We just need to handle the Current and Future chars here
        if (isCurrent) {
          if (isTcs) {
            bgClass = 'bg-yellow-400';
            colorClass = 'text-black font-bold';
          } else {
            cursorClass = 'border-l-2 border-brand-purple animate-pulse';
          }
        } else {
          // Future text color - make it darker for TCS if not already set
          if (!inputChars[index]) {
            colorClass = 'text-gray-900';
          }
        }
      }

      return (
        <span key={index} className={`relative ${colorClass} ${bgClass} ${cursorClass}`}>
          {char === ' ' && isError && settings.highlight ? '_' : char}
        </span>
      );
    });
  };

  const renderSonyStyleText = () => {
    const words = currentText.split(' ');
    let charCount = 0;
    return words.map((word, i) => {
      const isLastWord = i === words.length - 1;
      const wordStart = charCount;
      const wordEnd = charCount + word.length;
      const spaceIndex = isLastWord ? -1 : wordEnd;
      const nextStart = isLastWord ? wordEnd : wordEnd + 1;
      charCount = nextStart;
      const currentInputLen = inputText.length;
      let isPast = false;
      let isCurrent = false;
      if (currentInputLen > (isLastWord ? wordEnd - 1 : spaceIndex)) isPast = true;
      else if (currentInputLen >= wordStart) isCurrent = true;
      let containerClass = "inline-flex items-center px-1 py-0.5 mx-[1px] rounded-md transition-all duration-200 ";
      if (isCurrent) {
        if (settings.highlight) {
          containerClass += "bg-yellow-100 border-b-2 border-brand-purple ring-2 ring-yellow-200 scale-105 shadow-md ";
        } else {
          containerClass += "border-b-2 border-brand-purple "; // Minimal indication if highlight off
        }
      } else if (isPast) {
        const typedWord = inputText.substring(wordStart, wordEnd);
        const isWordCorrect = typedWord === word;
        let isSpaceCorrect = true;
        if (!isLastWord) isSpaceCorrect = inputText[spaceIndex] === ' ';
        if (isWordCorrect && isSpaceCorrect) containerClass += "opacity-50 grayscale ";
        else containerClass += "bg-red-50 border-b-2 border-red-500 ";
      } else {
        containerClass += "opacity-60 ";
      }
      return (
        <span key={i} className={containerClass} ref={isCurrent ? currentWordRef : null}>
          {splitByGraphemes(word, settings.language === 'hindi' ? 'hi' : 'en').map((char, localIdx) => {
            const absIdx = wordStart + localIdx;
            let charStyle = "text-lg font-mono ";
            if (absIdx < currentInputLen) {
              if (inputText[absIdx] === char) charStyle += "text-green-700 font-bold ";
              else charStyle += "text-red-600 font-bold bg-red-100 ";
            } else charStyle += "text-gray-800 ";
            if (isCurrent && absIdx === currentInputLen) {
              charStyle += "border-l-2 border-brand-black animate-pulse -ml-[1px] ";
            }
            return <span key={localIdx} className={charStyle}>{char}</span>
          })}
          {!isLastWord && (
            <span className={`ml-1 w-2 h-4 inline-block align-middle rounded-sm ${spaceIndex < currentInputLen
              ? (inputText[spaceIndex] === ' ' ? '' : 'bg-red-500')
              : (isCurrent && spaceIndex === currentInputLen ? 'border-l-2 border-brand-black animate-pulse h-5' : '')
              }`}>
            </span>
          )}
        </span>
      );
    });
  };

  const renderDashboard = () => {
    if (!testResult) return null;
    const ComparisonCard = ({ title, text, type }: { title: string, text: string, type: 'original' | 'typed' }) => (
      <div className="flex flex-col h-full">
        <div className="bg-gray-100 p-2 text-xs font-bold text-gray-700 border-b border-gray-200 uppercase tracking-wide">
          {title}
        </div>
        <div className={`flex-grow p-4 text-sm leading-relaxed overflow-y-auto max-h-[300px] whitespace-pre-wrap ${settings.fontFamily === 'mangal' ? 'font-mangal' : 'font-mono'} ${type === 'typed' ? 'bg-white' : 'bg-gray-50'}`}>
          {type === 'typed' ? (
            splitByGraphemes(text, settings.language === 'hindi' ? 'hi' : 'en').map((char, i) => {
              const originalChar = splitByGraphemes(currentText, settings.language === 'hindi' ? 'hi' : 'en')[i];
              const isCorrect = char === originalChar;
              return (
                <span key={i} className={isCorrect ? 'text-gray-800' : 'text-red-500 bg-red-50 font-bold'}>
                  {char}
                </span>
              );
            })
          ) : (
            text
          )}
        </div>
      </div>
    );
    const MetricCard = ({ label, value, icon, subIcon }: any) => (
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm relative flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
        <div>
          <div className="text-gray-600 text-sm font-medium mb-1">{label}</div>
          <div className="text-3xl font-display font-bold text-brand-black">{value}</div>
        </div>
        <div className="absolute top-4 right-4 text-gray-400">{icon}</div>
        {subIcon && <div className="absolute bottom-4 right-4 text-gray-400">{subIcon}</div>}
      </div>
    );
    return (
      <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-brand-black text-white p-3 rounded-md font-bold font-display text-xl">TN</div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Performance Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-sm font-bold text-gray-600">Calculated on Total Time</span>
              <Check className="text-green-600" size={20} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-sm">
            <div>
              <span className="font-bold text-gray-900 block mb-1">Exam Title:</span>
              <span className="text-gray-600">Demo {settings.language === 'hindi' ? 'Hindi' : 'English'} Typing</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 block mb-1">Passage Title:</span>
              <span className="text-gray-600">Standard Test</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 block mb-1">Total Key Depression:</span>
              <span className="text-gray-600">{testResult.keystrokes}</span>
            </div>
            <div className="flex gap-8">
              <div>
                <span className="font-bold text-gray-900 block mb-1">Typing Date:</span>
                <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block mb-1">Time Taken:</span>
                <span className="text-gray-600">{testResult.timeTaken}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard label="Key Depressions Typed" value={testResult.keystrokes} icon={<Keyboard size={24} />} />
            <MetricCard label="Full Mistakes (key strokes)" value={testResult.fullMistakes} icon={<XCircle size={24} />} />
            <MetricCard label="Half Mistakes (key strokes)" value={testResult.halfMistakes} icon={<div className="font-mono font-bold text-lg">{`{ }`}</div>} />
            <MetricCard label="Error %" value={testResult.accuracy === "100" ? "0" : (100 - parseFloat(testResult.accuracy)).toFixed(2)} icon={<Percent size={24} />} />
            <MetricCard label="Gross Speed (wpm)" value={testResult.grossWpm} icon={<Gauge size={24} />} />
            <MetricCard label="Net Speed (wpm)" value={testResult.netWpm} icon={<Gauge size={24} className="text-brand-purple" />} />
            <MetricCard label="Extra Words Typed" value={Math.max(0, inputText.split(' ').length - currentText.split(' ').length)} icon={<MoveRight size={24} />} />
            <MetricCard label="Backspace Count" value={testResult.backspaceCount} icon={<Delete size={24} />} />
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${showDetailedComparison ? 'bg-purple-100 text-brand-purple' : 'bg-gray-100 text-gray-400'}`}>
                <Layout size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-800 block">Detailed Comparison View</span>
                <span className="text-xs text-gray-500">Compare your typed text with the original passage side-by-side</span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailedComparison(!showDetailedComparison)}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative focus:outline-none ring-offset-2 focus:ring-2 focus:ring-brand-purple ${showDetailedComparison ? 'bg-brand-purple' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${showDetailedComparison ? 'translate-x-7' : ''}`}></div>
            </button>
          </div>

          {showDetailedComparison && (
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <ComparisonCard title="Original Passage" text={currentText} type="original" />
                <ComparisonCard title="Typed Passage" text={inputText} type="typed" />
              </div>
            </div>
          )}

          {remedialDrill && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-1 flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-500" /> AI Performance Coach
                </h3>
                <p className="text-blue-700 max-w-xl">
                  I noticed you struggled with <strong>{remedialDrill.weakKeys.join(', ')}</strong>.
                  I've generated a specific 2-minute drill to help you fix this.
                </p>
              </div>
              <button
                onClick={startRemedialDrill}
                className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw size={18} /> Start Remedial Drill
              </button>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-center gap-4 animate-bounce">
              <Sparkles className="text-brand-yellow" />
              <div>
                <h4 className="font-bold text-yellow-800">New Achievements Unlocked!</h4>
                <p className="text-sm text-yellow-700">{newBadges.map(b => b.title).join(', ')}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 pb-12">
            <Link to="/exams">
              <button className="px-8 py-3 rounded-lg border-2 border-gray-300 font-bold hover:bg-gray-50 transition-colors">Back to Exams</button>
            </Link>
            <button onClick={resetTest} className="px-8 py-3 rounded-lg bg-brand-black text-white font-bold hover:bg-gray-800 flex items-center gap-2 transition-colors">
              <RefreshCw size={18} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Check for Custom Mode
  const isCustomMode = searchParams.get('exam') === 'custom';


  if (isCustomMode) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
        {/* Deep Blue Header */}
        <div className="bg-[#1a237e] text-white px-8 py-3 flex justify-between items-center relative shadow-lg h-20">
          <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1a237e] hover:bg-gray-100 transition-colors shadow-md">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <div className="text-xs uppercase tracking-widest opacity-80 mb-0.5 font-bold">Time Left</div>
            <div className="text-2xl font-bold font-mono">
              {formatTimeMinutes(timeLeft)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1a237e] hover:bg-gray-100 transition-colors shadow-md">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Gradient Border below header */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00d2ff] via-[#911f91] to-[#1e3c72]"></div>

        {/* Main Content Area */}
        <div className="flex-grow grid grid-cols-12 gap-8 p-8 max-w-[1600px] mx-auto w-full overflow-hidden">

          {/* Left Column: Text Areas (70%) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 h-full min-h-0">
            {/* Source Text Box with Highlight */}
            <div className="flex-grow border border-gray-300 rounded overflow-y-auto bg-white p-6 scroll-smooth shadow-sm select-none"
              style={{ fontSize: `${settings.fontSize}px` }}>
              <div className={`${settings.fontFamily === 'mangal' ? 'font-mangal' : 'font-serif'} leading-relaxed text-gray-700 whitespace-pre-wrap`}>
                {currentText.split(' ').map((word, i) => {
                  const typedWords = inputText.trim().split(' ');
                  const isCurrentWord = i === (inputText.endsWith(' ') ? typedWords.length : typedWords.length - 1);
                  return (
                    <span key={i} className={`inline-block mr-2 px-1 rounded ${isCurrentWord ? 'bg-yellow-200 border-b-2 border-yellow-400' : ''}`}>
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input Text Box */}
            <div className="h-48 relative shrink-0">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={handleInput}
                onPaste={handlePaste}
                placeholder="Write here"
                className={`w-full h-full border border-gray-300 rounded p-4 focus:outline-none focus:border-blue-500 resize-none shadow-sm transition-colors ${settings.fontFamily === 'mangal' ? 'font-mangal' : 'font-serif'}`}
                style={{ fontSize: `${settings.fontSize}px` }}
                spellCheck={false}
              />
              {timeLeft === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center font-bold text-red-600 text-2xl uppercase tracking-widest">
                  Exam Finished
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center shrink-0">
              <button
                onClick={() => window.history.back()}
                className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-2.5 px-10 rounded shadow transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={finishTest}
                className="bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-2.5 px-10 rounded shadow transition-all active:scale-95"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Right Column: Your Details Panel (30%) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-0">
            <div className="bg-[#f5f5f5] rounded shadow-sm flex flex-col overflow-hidden border border-gray-200">
              {/* Panel Gradient Border (Top) */}
              <div className="h-1 bg-gradient-to-r from-[#00d2ff] via-[#911f91] to-[#1e3c72]"></div>

              <div className="p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Your Details</h2>

                {/* Hide User Info Toggle */}
                <div className="flex items-center justify-between group">
                  <span className="font-bold text-gray-700">Hide User Information:</span>
                  <button
                    onClick={() => setSettings(s => ({ ...s, hideUserInfo: !s.hideUserInfo }))}
                    className={`w-12 h-6 rounded-full transition-all duration-200 relative ${settings.hideUserInfo ? 'bg-[#9CA3AF]' : 'bg-[#9CA3AF]'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${settings.hideUserInfo ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>

                {/* User Details */}
                <div className={`space-y-4 transition-opacity duration-300 ${settings.hideUserInfo ? 'opacity-20' : 'opacity-100'}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-800">Name:</span>
                    <span className="text-gray-700 capitalize">{userProfile?.name || "Dynamite Gehlot"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-800">Test:</span>
                    <span className="text-gray-700">{searchParams.get('testName') || "SSC CGL Free Mock Test 1"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-800">Language:</span>
                    <span className="text-gray-700 capitalize">{settings.language}</span>
                  </div>
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-gray-700">Background Typing Sound:</span>
                  <button
                    onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))}
                    className="w-12 h-6 bg-[#9CA3AF] rounded-full transition-all duration-200 relative"
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${settings.sound ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>

                {/* Font Size Control */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Font Size:</span>
                  <div className="flex items-center border border-blue-400 rounded overflow-hidden">
                    <button
                      onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(12, s.fontSize - 1) }))}
                      className="px-2 py-1 bg-white border-r border-blue-400 text-blue-500 hover:bg-gray-100 font-bold"
                    >—</button>
                    <span className="px-4 py-1 bg-white text-gray-800 font-bold min-w-[40px] text-center">{settings.fontSize}</span>
                    <button
                      onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(32, s.fontSize + 1) }))}
                      className="px-2 py-1 bg-white border-l border-blue-400 text-blue-500 hover:bg-gray-100 font-bold"
                    >+</button>
                  </div>
                </div>

                {/* Full Screen Toggle */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Full Screen:</span>
                  <button
                    onClick={() => {
                      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                      else if (document.exitFullscreen) document.exitFullscreen();
                    }}
                    className="w-12 h-6 bg-[#9CA3AF] rounded-full transition-all duration-200 relative"
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${document.fullscreenElement ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>
              </div>

              {/* Panel Gradient Border (Bottom) */}
              <div className="h-1 bg-gradient-to-r from-[#00d2ff] via-[#911f91] to-[#1e3c72] mt-auto"></div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showResult && renderDashboard()}
      </div>
    );
  }

  // TCS Layout Render
  const renderTCSLayout = () => {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#e0e0e0] font-sans">
        {/* TCS Header */}
        <div className="bg-[#3085d6] text-white px-4 py-2 flex justify-between items-center shadow-md shrink-0 h-16">
          <div>
            <h1 className="font-bold text-lg">System Name: C001</h1>
            <div className="text-xs text-blue-100">{userProfile?.name || 'Candidate Name'}</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-blue-100 opacity-80">Subject</div>
              <div className="font-bold">{settings.language === 'hindi' ? 'Hindi Typing' : 'English Typing'}</div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded flex flex-col items-center min-w-[80px]">
              <div className="text-xs text-blue-100">Time Left</div>
              <div className="font-bold font-mono text-xl leading-none">{formatTimeMinutes(timeLeft).split(' ')[0]}</div>
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={finishTest} className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-1.5 px-4 rounded shadow-sm text-sm transition-colors">
              Submit
            </button>
          </div>
        </div>

        {/* Main Split Container */}
        <div className="flex-grow flex flex-col p-2 gap-2 max-w-[1600px] mx-auto w-full h-[calc(100vh-64px)]">

          {/* Top: Question Area */}
          <div className="flex-1 bg-white border border-gray-400 rounded-sm shadow-sm flex flex-col min-h-0">
            <div className="bg-[#f0f0f0] px-3 py-1.5 border-b border-gray-300 text-sm font-bold text-gray-700 flex justify-between">
              <span>Original Text</span>
              <span className="text-xs font-normal text-gray-500">Scroll to view more</span>
            </div>
            <div
              ref={textContainerRef}
              className={`flex-grow overflow-y-auto p-4 leading-[2rem] select-none text-gray-800 ${getFontSizeClass()} ${settings.fontFamily === 'mangal' ? 'font-mangal' : 'font-mono'}`}
            >
              {renderStandardText()}
            </div>
          </div>

          {/* Resize Handle / Separator (Visual Only) */}
          <div className="h-1 bg-gray-300 rounded-full mx-10"></div>

          {/* Bottom: Answer Area */}
          <div className="flex-1 bg-white border border-gray-400 rounded-sm shadow-sm flex flex-col min-h-0">
            <div className="bg-[#f0f0f0] px-3 py-1.5 border-b border-gray-300 text-sm font-bold text-gray-700">
              Type Here
            </div>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInput}
              onPaste={handlePaste}
              className={`flex-grow w-full p-4 resize-none focus:outline-none focus:bg-[#fcffff] transition-colors text-black font-medium ${getFontSizeClass()} ${settings.fontFamily === 'mangal' ? 'font-mangal' : 'font-mono'}`}
              spellCheck={false}
            />
          </div>

          {/* Footer Info */}
          <div className="shrink-0 flex justify-between items-center text-xs text-gray-500 px-2 py-1">
            <div>
              Words: {keystrokes} | WPM: {Math.round((keystrokes / 5) / ((getTotalDuration() - timeLeft) / 60) || 0)}
            </div>
            <div className="flex gap-2">
              <span>Keyboard: {settings.layout.toUpperCase()}</span>
              <span>|</span>
              <span>{settings.highlight ? 'Highlight: ON' : 'Highlight: OFF'}</span>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showSettings && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setShowSettings(false)}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0f] border border-brand-purple/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] z-[70] w-96 p-6 animate-in zoom-in-95 ring-1 ring-white/10">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Settings className="text-brand-purple" size={20} />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Exam Settings</span>
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                {/* Font Size */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800/50">
                  <label className="font-bold text-gray-300 text-sm">Font Size</label>
                  <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-gray-700">
                    <button onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(14, s.fontSize - 2) }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple/20 rounded-md transition-all font-bold">-</button>
                    <span className="w-8 text-center font-mono font-bold text-brand-purple">{settings.fontSize}</span>
                    <button onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(32, s.fontSize + 2) }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple/20 rounded-md transition-all font-bold">+</button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  {[
                    { label: 'Highlight Text', key: 'highlight' as const, value: settings.highlight },
                    { label: 'Auto Scroll', key: 'autoScroll' as const, value: settings.autoScroll },
                    { label: 'Backspace', key: 'backspace' as const, value: settings.backspace !== 'off', action: () => setSettings(s => ({ ...s, backspace: s.backspace === 'off' ? 'on' : 'off' })) },
                    { label: 'Sound', key: 'sound' as const, value: settings.sound }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-900/30 transition-colors border border-transparent hover:border-gray-800/50">
                      <label className="font-medium text-gray-300 text-sm flex items-center gap-2">
                        {item.label}
                        {item.value && <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>}
                      </label>
                      <button
                        onClick={() => item.action ? item.action() : setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                        className={`w-11 h-6 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 ${item.value ? 'bg-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-gray-800 border border-gray-700'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${item.value ? 'translate-x-5' : ''}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {showResult && renderDashboard()}
      </div >
    );
  };

  return renderTCSLayout();
};

export default TypingTest;