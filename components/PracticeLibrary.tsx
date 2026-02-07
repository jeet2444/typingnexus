import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ArrowRight, Keyboard, Layers } from 'lucide-react';

const ENGLISH_TITLES = [
  "The Quick Brown Fox", "The Power of Habits", "Nature's Beauty", "The Digital Age", "Importance of Reading",
  "Healthy Lifestyle", "Space Exploration", "History of Internet", "Mindfulness", "Leadership Skills"
];

const HINDI_TITLES = [
  "टाइपिंग का अभ्यास", "समय का सदुपयोग", "स्वास्थ्य और व्यायाम", "अनुशासन का महत्व", "भारतीय त्यौहार",
  "पर्यावरण संरक्षण", "शिक्षा का उद्देश्य", "विज्ञान के लाभ", "सच्ची मित्रता", "परोपकार की भावना"
];

const KEY_DRILLS_ENG = [
  { id: 'k1', title: "Home Row", keys: "asdf jkl;", difficulty: "Easy" },
  { id: 'k2', title: "Top Row", keys: "qwerty uiop", difficulty: "Easy" },
  { id: 'k3', title: "Bottom Row", keys: "zxcv bnm,.", difficulty: "Medium" },
  { id: 'k4', title: "Capital Letters", keys: "Shift + Keys", difficulty: "Hard" },
  { id: 'k5', title: "Numbers", keys: "12345 67890", difficulty: "Medium" },
];

const KEY_DRILLS_HIN = [
  { id: 'hk1', title: "Home Row (मध्य पंक्ति)", keys: "ो े ् ि ु प र क त च", difficulty: "Easy" },
  { id: 'hk2', title: "Top Row (ऊपरी पंक्ति)", keys: "ौ ै ा ी ू ब ह ग द ज", difficulty: "Easy" },
  { id: 'hk3', title: "Bottom Row (निचली पंक्ति)", keys: "्र ं म न व ल स , . य", difficulty: "Medium" },
  { id: 'hk4', title: "Shift Keys (आधे अक्षर)", keys: "Shift + Keys", difficulty: "Hard" },
  { id: 'hk5', title: "Complex Words (संयुक्त अक्षर)", keys: "द्व, द्ध, ट्ट", difficulty: "Hard" },
];

const PracticeLibrary: React.FC = () => {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [mode, setMode] = useState<'drills' | 'sets'>('drills');

  // Generate 50 mock articles using the titles array cyclically
  const articles = Array.from({ length: 50 }, (_, i) => {
    const titles = language === 'english' ? ENGLISH_TITLES : HINDI_TITLES;
    const title = titles[i % titles.length];

    return {
      id: i + 1,
      title: title,
      category: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      words: 50
    };
  });

  const drills = language === 'english' ? KEY_DRILLS_ENG : KEY_DRILLS_HIN;

  return (
    <div className="bg-cream min-h-screen py-12 px-4 dot-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Practice Library</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Master your typing with Key Drills and Full Paragraph Sets.
            Choose your language and start improving today.
          </p>

          {/* Controls Container */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">

            {/* Language Toggle */}
            <div className="inline-flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setLanguage('english')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${language === 'english' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hindi')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${language === 'hindi' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                हिंदी (Hindi)
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="inline-flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setMode('drills')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'drills' ? 'bg-brand-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Keyboard size={16} /> Key Drills
              </button>
              <button
                onClick={() => setMode('sets')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'sets' ? 'bg-brand-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Layers size={16} /> Paragraph Sets
              </button>
            </div>

          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {mode === 'drills' && drills.map((drill, idx) => (
            <Link to={`/practice/${language}/drill/${drill.id}`} key={drill.id} className="group">
              <div className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full opacity-50 -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 font-bold text-xs">
                      Unit {idx + 1}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{drill.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{drill.title}</h3>
                  <code className="text-xs bg-gray-50 px-2 py-1 rounded block mb-4 text-gray-500 font-mono border border-gray-100">{drill.keys}</code>
                </div>
                <div className="flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                  Start Drill <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}

          {mode === 'sets' && articles.map((article) => (
            <Link to={`/practice/${language}/set/${article.id}`} key={article.id} className="group">
              <div className="bg-white border-2 border-brand-black rounded-lg p-6 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-brand-yellow/20 p-2 rounded-lg text-brand-black">
                      <BookOpen size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${article.category === 'Easy' ? 'bg-green-100 text-green-700 border-green-200' :
                        article.category === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                      }`}>
                      {article.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand-purple transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-6">
                    <Star size={12} className="fill-brand-yellow text-brand-yellow" />
                    <span>50 Words Limit</span>
                  </div>
                </div>

                <div className="flex items-center text-sm font-bold text-brand-black group-hover:gap-2 transition-all">
                  Start Set <ArrowRight size={16} className="ml-1" />
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