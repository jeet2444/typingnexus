import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Users, Filter, Clock, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStore } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

// --- Types ---
interface Exam {
   id: string;
   title: string;
   createdDate: string;
   wordCount: number;
   duration: string; // e.g., "15:00 min"
   attempts: number;
   tags: string[];
   isProfile?: boolean;
}

// --- Mock Data ---
const KEYWORDS = [
   "AHC", "AIIMS", "APHC", "BSF", "BSSC", "CGL", "CHSL", "DSSSB", "JHC", "MP Police",
   "NTPC", "RSSB", "UP Police", "UPSSSC"
];

// --- Versions: 2026-02-15-V2 ---
const Exams: React.FC = () => {
   const navigate = useNavigate();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedTag, setSelectedTag] = useState<string | null>(null);
   const [exams, setExams] = useState<Exam[]>([]);
   const [ads, setAds] = useState<any[]>([]);
   const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
   const [articles, setArticles] = useState<any[]>([]);
   const [articleSearch, setArticleSearch] = useState("");
   const { hasPremiumAccess } = useAuth();

   useEffect(() => {
      // Load exams and ads from the central Admin Store
      const loadData = () => {
         const store = getAdminStore();

         // 1. Check user plan from Auth Context
         const isPro = hasPremiumAccess;

         // 2. Load Ads (only for non-pro users)
         if (!isPro) {
            setAds(store.ads?.filter(a => a.isActive) || []);
         } else {
            setAds([]);
         }

         // 3. Transform Exams
         const mappedExams = store.exams
            .filter(e => e.status === 'Published' && !e.title.match(/Excel|Word|CPT/i) && !e.categoryId?.match(/Excel|Word|CPT/i))
            .map(e => ({
               id: e.id.toString(),
               title: e.title,
               createdDate: "JAN 29, 2026",
               wordCount: 2000,
               duration: `15:00 min`,
               attempts: e.plays,
               tags: [e.language.split(' ')[0], e.ruleSet.split(' ')[0]],
               language: e.language,
               isProfile: false
            }));

         // 4. Transform Profiles (New Requirements)
         const mappedProfiles = (store.examProfiles || [])
            .filter(p => !p.profileName.match(/Excel\b|Word\b|CPT\b/i))
            .map(p => ({
               id: `profile-${p.id}`,
               title: p.profileName,
               createdDate: "Exam Profile",
               wordCount: 0,
               duration: `${p.durationMin || 10}:00 min`,
               attempts: 0,
               tags: [p.fixedLanguage === 'hi' ? 'Hindi' : 'English', 'Pattern'],
               language: p.fixedLanguage === 'hi' ? 'Hindi' : 'English',
               isProfile: true
            }));

         setExams([...mappedExams, ...mappedProfiles]);
         setArticles(store.contentLibrary || []);
      };

      loadData();
      window.addEventListener('adminStoreUpdate', loadData);
      return () => window.removeEventListener('adminStoreUpdate', loadData);
   }, []);

   const filteredExams = exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? exam.tags.includes(selectedTag) || exam.title.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
   });

   const handleArticleSelect = (article: any) => {
      if (!selectedExam) return;

      const profileId = selectedExam.isProfile ? selectedExam.id.replace('profile-', '') : '';
      const examId = !selectedExam.isProfile ? selectedExam.id : '';

      const query = new URLSearchParams();
      if (profileId) query.set('profileId', profileId);
      if (examId) query.set('examId', examId);
      query.set('contentId', article.id);

      navigate(`/typing-test?${query.toString()}`);
   };

   return (
      <div className="min-h-screen bg-gray-950 font-sans pb-20 flex flex-col text-gray-200">

         {/* Ambient BG */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] pointer-events-none rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] pointer-events-none rounded-full"></div>

         {/* MAIN CONTENT AREA */}
         <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 pt-12 relative z-10">

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-8 font-display tracking-tight">
               {selectedExam ? `Select Article for ${selectedExam.title}` : "All Exams"}
            </h1>

            {selectedExam && (
               <button onClick={() => setSelectedExam(null)} className="mb-6 text-brand-purple hover:underline flex items-center gap-2 font-bold">
                  &lt; Back to Exams
               </button>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-800 w-full mb-8"></div>

            {!selectedExam ? (
               <>
                  {/* Filters Toolbar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-80">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-purple transition-colors" size={18} />
                           <input
                              type="text"
                              placeholder="Search exam name..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-lg outline-none transition-all text-sm font-medium text-white placeholder-gray-600"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Popular Keywords */}
                  <div className="mb-12">
                     <div className="flex items-center gap-2 mb-4">
                        <Search size={14} className="text-brand-purple font-bold" strokeWidth={3} />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Popular Search Keywords</span>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {KEYWORDS.map(keyword => (
                           <button
                              key={keyword}
                              onClick={() => setSelectedTag(selectedTag === keyword ? null : keyword)}
                              className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${selectedTag === keyword
                                 ? 'bg-brand-purple text-white border-brand-purple shadow-lg shadow-purple-900/40'
                                 : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                                 }`}
                           >
                              {keyword}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Exam Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredExams.map(exam => (
                        <div key={exam.id} onClick={() => setSelectedExam(exam)} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 hover:border-brand-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                              <span>ID: {exam.id}</span>
                              <span>{exam.createdDate}</span>
                           </div>
                           <h3 className="font-bold text-lg text-white leading-tight mb-8 h-12 line-clamp-2 group-hover:text-brand-purple transition-colors">
                              {exam.title}
                           </h3>
                           <div className="flex justify-between items-center text-xs font-medium text-gray-400 mb-6">
                              <span className='flex items-center gap-1'><FileText size={12} className="text-gray-500" /> {exam.wordCount > 0 ? exam.wordCount : 'Multiple'} words</span>
                              <span className='flex items-center gap-1'><Clock size={12} className="text-gray-500" /> {exam.duration}</span>
                           </div>
                           <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                              <div className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                                 <Users size={12} />
                                 {((parseInt(exam.id.slice(-3)) || 100) + 120).toLocaleString()} students
                              </div>
                              <div className="flex gap-1">
                                 {exam.tags.map((tag, i) => (
                                    <span key={i} className="bg-gray-800 text-[9px] px-1.5 py-0.5 rounded text-gray-400 border border-gray-700">{tag}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            ) : (
               <div className="animate-in fade-in duration-300">
                  {/* Article Search Bar */}
                  <div className="mb-8 max-w-md">
                     <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-purple transition-colors" size={18} />
                        <input
                           type="text"
                           placeholder="Search article by title..."
                           value={articleSearch}
                           onChange={(e) => setArticleSearch(e.target.value)}
                           className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-lg outline-none transition-all text-sm font-medium text-white placeholder-gray-600 shadow-lg"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {articles
                        .filter(a => a.language.toLowerCase() === (selectedExam.language || 'English').toLowerCase())
                        .filter(a => a.title.toLowerCase().includes(articleSearch.toLowerCase()))
                        .map(article => (
                           <div
                              key={article.id}
                              onClick={() => handleArticleSelect(article)}
                              className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-brand-purple transition-all cursor-pointer group"
                           >
                              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-purple transition-colors">{article.title}</h4>
                              <div className="text-xs text-gray-500 flex justify-between italic">
                                 <span>Difficulty: {article.difficulty}</span>
                                 <span>Tags: {article.tags?.join(', ')}</span>
                              </div>
                           </div>
                        ))}
                     {articles.filter(a => a.language.toLowerCase() === (selectedExam.language || 'English').toLowerCase()).length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl">
                           No articles found for this language. Please add content in the Admin Panel.
                        </div>
                     )}
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default Exams;