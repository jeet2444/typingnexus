import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Zap, Calendar, User, ArrowRight, Monitor, Award, Globe, Activity, FileSpreadsheet, FileType, Keyboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAdminStore, SiteSettings, BlogPost, ExamResult, Notification } from '../utils/adminStore';
import { getLiveExams } from '../utils/liveExamLogic';


const Home: React.FC = () => {
   const [settings, setSettings] = useState<SiteSettings | null>(null);
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [liveResults, setLiveResults] = useState<ExamResult[]>([]);
   const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
   const [liveExams, setLiveExams] = useState<any[]>([]);

   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      const loadStoreData = () => {
         const store = getAdminStore();
         setSettings(store.settings);
         setNotifications(store.notifications || []);

         // Get Recent Live Results
         const results = [...(store.results || [])]
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // Sort by newest
            .slice(0, 6);
         setLiveResults(results);

         // Get Published Blogs
         const publishedBlogs = (store.blogs || [])
            .filter(b => b.status === "Published")
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6);
         setLatestBlogs(publishedBlogs);

         // Get Live Exams (Auto or Manual — returns all live exams)
         const currentLive = getLiveExams(store.exams || [], store.settings)
            .filter(e => !e.title.match(/Excel|Word|CPT/i) && !e.categoryId?.match(/Excel|Word|CPT/i));
         setLiveExams(currentLive);

      };

      loadStoreData(); // Initial load

      // Listen for local updates (same tab)
      window.addEventListener('adminStoreUpdate', loadStoreData);
      // Listen for cross-tab updates
      window.addEventListener('storage', loadStoreData);

      if (location.hash === '#cpt-section') {
         setTimeout(() => {
            document.getElementById('cpt-section')?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }

      // SEO Optimization
      document.title = "TypingNexus | India's #1 Typing & CPT Exam Preparation Platform";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
         metaDesc.setAttribute("content", "Prepare for RSSB, SSC, and Railway exams with TypingNexus. exact-match simulation for Hindi/English typing and CPT (MS Word & Excel) tests.");
      }

      return () => {
         window.removeEventListener('adminStoreUpdate', loadStoreData);
         window.removeEventListener('storage', loadStoreData);
      };
   }, [location]);

   const heroTitle = settings?.heroTitle || "India's #1 Platform for Typing & Computer Efficiency";
   const heroSubtitle = settings?.heroSubtitle || "Prepare for RSSB, SSC, and Railway exams with our exact-match simulation environment.";
   const heroCTAText = settings?.heroCTAText || "Start Free Practice";
   const heroCTALink = settings?.heroCTALink || "/practice-exams";

   return (
      <div className="flex flex-col min-h-screen text-gray-200">

         {/* LATEST NOTIFICATIONS TICKER */}
         {notifications.length > 0 && (
            <div className="bg-black/50 backdrop-blur-md border-b border-white/5 text-white py-2 px-4 overflow-hidden relative flex items-center gap-4">
               <span className="bg-brand-purple text-xs font-bold px-2 py-0.5 rounded animate-pulse shadow-lg shadow-purple-900/50">LIVE</span>
               <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <div className="inline-block animate-marquee">
                     {notifications.map((n, i) => (
                        <span key={i} className="mr-8 text-sm font-medium text-gray-300">
                           {n.message} <span className="text-gray-600 mx-2">|</span>
                        </span>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Hero Section */}
         <section className="relative pt-20 pb-16 px-4 text-center border-b border-white/5 overflow-hidden">

            <div className="max-w-4xl mx-auto space-y-10 relative z-10 flex flex-col items-center">

               {/* Badge */}
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-bold text-brand-purple animate-in fade-in slide-in-from-bottom-4">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Trusted by 50,000+ Aspirants
               </div>

               <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-white drop-shadow-xl">
                  {heroTitle.split("for")[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-blue-500 to-indigo-500 animate-gradient-x">
                     {heroTitle.includes("for") ? "for " + heroTitle.split("for")[1] : "Typing Mastery"}
                  </span>
               </h1>

               <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {heroSubtitle}
               </p>

               <div className="flex flex-wrap justify-center gap-4">
                  <Link to={heroCTALink} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-purple hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center gap-2 transform hover:-translate-y-1">
                     {heroCTAText} <ArrowRight size={20} />
                  </Link>
               </div>

               {/* DYNAMIC BANNERS CAROUSEL */}
               {settings?.homeBanners && settings.homeBanners.filter(b => b.active).length > 0 && (
                  <div className="w-full max-w-5xl mx-auto mt-16 relative group">
                     <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative aspect-[21/9] md:aspect-[24/8]">
                        {settings.homeBanners.filter(b => b.active).map((banner, idx) => (
                           <div key={idx} className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                              {banner.link ? (
                                 <a href={banner.link} target="_blank" rel="noopener noreferrer">
                                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                 </a>
                              ) : (
                                 <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                           </div>
                        ))}
                     </div>
                     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {settings.homeBanners.filter(b => b.active).map((_, i) => (
                           <div key={i} className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors cursor-pointer"></div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Live Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 w-full max-w-3xl border-t border-white/10 mt-12">
                  <div className="text-center">
                     <div className="text-3xl font-bold font-display text-white">50k+</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Students</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold font-display text-white">1.2M+</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Tests Taken</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold font-display text-white">98%</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Pass Rate</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold font-display text-white">24/7</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Platform Uptime</div>
                  </div>
               </div>
            </div>
         </section>


         {/* LIVE EXAMS SECTION - REFINED */}
         {liveExams.length > 0 && (
            <section className="py-16 px-4 relative overflow-hidden">
               {/* Animated Background Mesh */}
               <div className="absolute inset-0 bg-gray-950">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a044e20_1px,transparent_1px),linear-gradient(to_bottom,#4a044e20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
               </div>

               <div className="max-w-6xl mx-auto relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 text-center">
                     <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-red-600 blur opacity-75 animate-pulse"></span>
                        <div className="relative px-4 py-1 bg-red-600 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                           Live Now
                        </div>
                     </div>
                     <h2 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-xl">
                        Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Fast-Track</span> Exams
                     </h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {liveExams.map((exam) => (
                        <div key={exam.id} className="group relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] hover:-translate-y-2">
                           {/* Glow Effect */}
                           <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                           <div className="p-8 relative z-10 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-6">
                                 <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Official Exam
                                 </span>
                                 <Activity className="text-red-500 animate-pulse" size={20} />
                              </div>

                              <h3 className="text-2xl font-bold text-white mb-3 font-display leading-tight group-hover:text-red-400 transition-colors">
                                 {exam.title}
                              </h3>

                              <div className="space-y-3 mb-8 flex-grow">
                                 <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="p-1.5 bg-gray-800 rounded-lg text-gray-400 group-hover:text-white transition-colors"><Globe size={14} /></div>
                                    <span className="font-semibold text-gray-200">{exam.language}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="p-1.5 bg-gray-800 rounded-lg text-gray-400 group-hover:text-white transition-colors"><Calendar size={14} /></div>
                                    <span className="font-semibold text-white">{exam.liveDate || 'Ends Soon'}</span>
                                 </div>
                              </div>

                              <Link to={`/test/${exam.id}`} className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-orange-600 p-[1px]">
                                 <div className="relative bg-gray-900 group-hover/btn:bg-opacity-0 transition-all duration-300 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2">
                                    <span className="font-bold text-white group-hover/btn:scale-105 transition-transform">Enter Exam Hall</span>
                                    <ArrowRight size={18} className="text-white group-hover/btn:translate-x-1 transition-transform" />
                                 </div>
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* Features Grid */}
         <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">Why Choose <span className="text-brand-purple">Nexus?</span></h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">Our platform is engineered to replicate the exact exam environment of major government recruitment bodies.</p>
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  <FeatureCard
                     icon={<Keyboard size={32} className="text-blue-400" />}
                     title="Real Exam Interface"
                     desc="Exact replica of TCS/iON interfaces used in SSC and RSSB exams. Practice on what you'll see on exam day."
                  />
                  <FeatureCard
                     icon={<Activity size={32} className="text-green-400" />}
                     title="Advanced Analytics"
                     desc="Detailed breakdown of your speed, accuracy, and backspace usage. Track your improvement over time."
                  />
                  <FeatureCard
                     icon={<Globe size={32} className="text-purple-400" />}
                     title="Today's Live Results"
                     desc="See real-time scores from aspirants practicing right now. Data is volatile and purges every 24 hours."
                  />
               </div>
            </div>
         </section>

         {/* Today's Live Results Section */}
         <LiveResultsSection results={liveResults} />

         {/* CPT Section */}
         <section id="cpt-section" className="py-20 px-4 bg-white/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[100px] rounded-full"></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
               <div>
                  <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">Computer Proficiency Test</span>
                  <h2 className="text-4xl font-display font-bold mb-6 text-white">Master Excel & Word <br /> <span className="text-gray-400">Efficiency</span></h2>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                     Don't let the CPT hold you back. Our modules covers all formatting requirements found in RSSB LDC, CGL, and other exams.
                  </p>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><FileSpreadsheet size={20} /></div>
                        <div>
                           <h4 className="font-bold text-white">Excel Formulas & Formatting</h4>
                           <p className="text-xs text-gray-500">VLOOKUP, Conditional Formatting, Charts</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><FileType size={20} /></div>
                        <div>
                           <h4 className="font-bold text-white">Word Letter & Report Formatting</h4>
                           <p className="text-xs text-gray-500">Indentation, Spacing, Table Design</p>
                        </div>
                     </div>
                  </div>

                  <Link to="/cpt/excel" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                     Start CPT Practice <ArrowRight size={18} />
                  </Link>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-brand-purple blur-[60px] opacity-20"></div>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl relative rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-red-500"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-gray-500 font-mono ml-4">exam_simulation.exe</div>
                     </div>
                     <div className="space-y-3 font-mono text-sm text-gray-300">
                        <div className="flex justify-between"><span>Typing Speed:</span> <span className="text-green-400">45 WPM</span></div>
                        <div className="flex justify-between"><span>Accuracy:</span> <span className="text-blue-400">98.5%</span></div>
                        <div className="flex justify-between"><span>Backspaces:</span> <span className="text-red-400">Disabled</span></div>
                        <div className="h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-brand-purple w-[75%]"></div>
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-2">Test Progress</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Call to Action Footer */}
         <section className="py-24 text-center px-4 relative">
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Ready to <span className="text-brand-purple">Excel?</span></h2>
               <p className="text-xl text-gray-400">Join thousands of successful candidates who trusted TypingNexus for their government job preparation.</p>
               <Link to="/sign-up" className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold text-xl hover:bg-brand-purple hover:text-white transition-all shadow-xl hover:scale-105 transform duration-300">
                  Get Started for Free
               </Link>
            </div>
         </section>

      </div>
   );
};

const LiveResultsSection: React.FC<{ results: ExamResult[] }> = ({ results }) => {
   if (!results || results.length === 0) return null;

   return (
      <section className="py-20 px-4 bg-gray-950/50 border-y border-white/5 backdrop-blur-sm">
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
               <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Today's <span className="text-brand-purple">Live Results</span></h2>
                  <p className="text-gray-500 text-sm italic">Showing recent attempts from the last 24 hours. Volatile storage.</p>
               </div>
               <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-purple/10 border border-brand-purple/30 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                  <span className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-purple"></span>
                  </span>
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">Real-time Feed</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {results.map((result) => (
                  <div key={result.id} className="group bg-gray-900/40 border border-white/5 rounded-2xl p-6 hover:border-brand-purple/40 transition-all hover:bg-gray-900/60 hover:-translate-y-1 duration-300">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <div className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">{result.studentName}</div>
                           <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mt-0.5">{result.examTitle}</div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${result.status === 'Pass' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                           {result.status}
                        </div>
                     </div>
                     <div className="flex items-end justify-between gap-4">
                        <div className="flex flex-col">
                           <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Net Speed</div>
                           <div className="text-4xl font-display font-bold text-white group-hover:text-brand-purple transition-colors">
                              {result.netWPM} <span className="text-[10px] font-sans font-bold text-gray-500 uppercase">WPM</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Accuracy</div>
                           <div className="text-xl font-mono font-bold text-gray-300">{result.accuracy}%</div>
                        </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[9px] text-gray-600 font-mono italic">Verified Practice Attempt</span>
                        <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">{new Date(result.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
   <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-purple/50 transition-all hover:bg-white/10 group">
      <div className="mb-6 p-4 bg-gray-900 rounded-xl inline-block shadow-lg group-hover:scale-110 transition-transform duration-300 border border-gray-800">
         {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
         {desc}
      </p>
   </div>
);

export default Home;