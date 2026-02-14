import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Star, ArrowRight, Keyboard, Layers, Settings, CheckCircle } from 'lucide-react';
import { KEY_DRILLS, ENGLISH_TITLES, HINDI_TITLES } from '../utils/practiceData';
import { getAdminStore } from '../utils/adminStore';

const PracticeLibrary: React.FC = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(getAdminStore());
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [hindiLayout, setHindiLayout] = useState<'remington' | 'inscript'>('remington');
  const [mode, setMode] = useState<'drills' | 'sets'>('drills');

  // Sync with URL param and Store Updates
  useEffect(() => {
    if (lang === 'hindi' || lang === 'english') {
      setLanguage(lang);
    }

    const handleUpdate = () => {
      console.log("[PracticeLibrary] Store updated, refreshing...");
      setStore(getAdminStore());
    };

    window.addEventListener('adminStoreUpdate', handleUpdate);
    return () => window.removeEventListener('adminStoreUpdate', handleUpdate);
  }, [lang]);

  // Flatten drills for display
  const getDrills = () => {
    const data = KEY_DRILLS[language];
    if (!data) return [];

    let categories = Object.values(data);

    // Filter specifically for Hindi layouts if needed
    if (language === 'hindi') {
      if (hindiLayout === 'remington') {
        // Include only Remington specific keys if they exist, or generic ones
        categories = categories.filter((cat: any) => cat.title.includes('Remington'));
      } else {
        // Exclude Remington
        categories = categories.filter((cat: any) => !cat.title.includes('Remington'));
      }
    }

    // Flatten all drills from categories, EXCLUDING 'articles' and 'rawSessions' for main grid if desired,
    // or include them. The user wants "Key Drills".
    const validCategories = categories.filter((cat: any) => cat.title !== 'Articles' && cat.title !== 'Raw Sessions');
    return validCategories.flatMap((cat: any) => cat.drills.map((d: any) => ({ ...d, category: cat.title.replace(' (Inscript)', '').replace(' (Remington)', ''), icon: cat.icon })));
  };

  // Flatten sets (articles) combined with dynamic Content Library
  const getSets = () => {
    const currentStore = getAdminStore(); // Get the latest store state
    const dynamicContent = (currentStore.contentLibrary || [])
      .filter(item => item.language.toLowerCase() === language.toLowerCase())
      .map(item => ({
        id: item.id,
        title: item.title,
        difficulty: item.difficulty,
        category: 'Library',
        isDynamic: true
      }));

    // For English, we have 'articles' category in KEY_DRILLS
    let baseSets = [];
    if (language === 'english' && KEY_DRILLS.english.articles) {
      baseSets = KEY_DRILLS.english.articles.drills.map((d: any) => ({
        ...d,
        title: d.name, // Map 'name' to 'title' for consistency
        difficulty: 'Medium', // Default
        category: 'Articles'
      }));
    } else {
      // For Hindi (or fallback), use Titles logic (Legacy/Mock) until data is populated
      const titles = language === 'english' ? ENGLISH_TITLES : HINDI_TITLES;
      baseSets = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: titles[i % titles.length],
        difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
        category: 'Paragraphs',
        keys: 'All'
      }));
    }

    return [...dynamicContent, ...baseSets];
  };

  const drills = getDrills();
  const sets = getSets();

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 selection:bg-cyan-500 selection:text-black font-mono relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            PRACTICE LIBRARY
          </h1>
          <p className="text-cyan-400/60 max-w-2xl mx-auto mb-8 font-mono text-sm tracking-widest uppercase">
            // MASTER YOUR {language.toUpperCase()} TYPING PROTOCOLS
          </p>

          {/* Controls Container */}
          <div className="bg-gray-900/50 backdrop-blur-xl p-1 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 mb-12 inline-flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-500 min-w-[300px] md:min-w-[500px]">

            <div className="flex flex-col md:flex-row justify-center items-center gap-2 p-4">
              {/* Mode Selection */}
              <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 w-full">
                <button
                  onClick={() => setMode('drills')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${mode === 'drills' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  <Keyboard size={16} /> Key Drills
                </button>
                <button
                  onClick={() => setMode('sets')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${mode === 'sets' ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  <Layers size={16} /> Paragraphs
                </button>
              </div>
            </div>

            {/* Hindi Layout Selection (Conditional) */}
            {mode === 'drills' && language === 'hindi' && (
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300 px-6 pb-6 pt-2 border-t border-white/5">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={12} /> Select Layout Algorithm
                </span>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setHindiLayout('remington')}
                    className={`flex-1 relative px-4 py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1 ${hindiLayout === 'remington' ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}
                  >
                    <span>REMINGTON GAIL</span>
                    <span className="text-[9px] opacity-60 font-normal">MANGAL / CBI</span>
                  </button>
                  <button
                    onClick={() => setHindiLayout('inscript')}
                    className={`flex-1 relative px-4 py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1 ${hindiLayout === 'inscript' ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}
                  >
                    <span>INSCRIPT</span>
                    <span className="text-[9px] opacity-60 font-normal">STANDARD</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {mode === 'drills' && drills.map((drill: any, idx: number) => (
            <Link
              to={`/practice/${language}/drill/${drill.id}${language === 'hindi' ? `?layout=${hindiLayout}` : ''}`}
              key={drill.id}
              className="group"
            >
              <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all h-full flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full blur-xl -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100"></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-cyan-950/50 border border-cyan-900 px-2 py-1 rounded text-cyan-400 font-mono text-[10px] tracking-wider uppercase truncate max-w-[100px]">
                      {drill.category}
                    </div>
                    {drill.icon && <span className="text-lg">{drill.icon}</span>}
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-gray-100 group-hover:text-cyan-400 transition-colors">
                    {drill.name}
                    {language === 'hindi' && <span className="block text-xs text-orange-400 font-normal mt-1 opacity-80 font-mangal">({drill.displayChars || drill.keys})</span>}
                  </h3>

                  <div className="bg-black/30 px-3 py-2 rounded border border-gray-800 mb-4 overflow-hidden">
                    <code className="text-xs text-gray-400 font-mono block truncate">
                      KEYS: {drill.keys}
                    </code>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-cyan-500 uppercase tracking-widest group-hover:gap-2 transition-all">
                  INITIALIZE <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}

          {mode === 'sets' && sets.map((article: any) => (
            <Link to={`/practice/${language}/set/${article.id}`} key={article.id} className="group">
              <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(192,38,211,0.15)] transition-all h-full flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 rounded-bl-full blur-xl -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100"></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-fuchsia-950/30 p-2 rounded-lg text-fuchsia-400 border border-fuchsia-900/50">
                      <BookOpen size={16} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${article.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                      article.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                        'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}>{article.difficulty || 'Medium'}</span>
                  </div>

                  <h3 className={`font-bold text-lg mb-2 group-hover:text-fuchsia-400 transition-colors ${language === 'hindi' ? 'font-mangal' : ''}`}>
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-6 font-mono">
                    <Star size={12} className="fill-fuchsia-900 text-fuchsia-500" />
                    <span>50 WORDS_LIMIT</span>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-fuchsia-500 uppercase tracking-widest group-hover:gap-2 transition-all">
                  LOAD_SET <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeLibrary;