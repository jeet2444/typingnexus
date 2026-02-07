import React, { useState, useEffect } from 'react';
import { kbd, Star, CheckCircle, Zap, Calendar, User, ArrowRight, Monitor, Award, Globe, Shield, Activity, FileSpreadsheet, FileType, Keyboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAdminStore, SiteSettings, BlogPost, ExamResult, Notification } from '../utils/adminStore';

const Home: React.FC = () => {
   const [settings, setSettings] = useState<SiteSettings | null>(null);
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [topScorers, setTopScorers] = useState<ExamResult[]>([]);
   const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
   const [liveExams, setLiveExams] = useState<any[]>([]);

   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      const loadStoreData = () => {
         const store = getAdminStore();
         setSettings(store.settings);
         setNotifications(store.notifications || []);

         // Get Top 5 Scorers
         const sortedResults = [...(store.results || [])]
            .sort((a, b) => b.netWPM - a.netWPM)
            .slice(0, 5);
         setTopScorers(sortedResults);

         // Get Published Blogs
         const publishedBlogs = (store.blogs || [])
            .filter(b => b.status === "Published")
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6);
         setLatestBlogs(publishedBlogs);

         // Get Live Exams
         const live = (store.exams || []).filter(e => e.liveStatus === 'Live');
         setLiveExams(live);
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
                  <Link to="/learn" className="px-8 py-4 rounded-xl font-bold text-lg text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2">
                     View Courses
                  </Link>
               </div>

               {/* Live Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 w-full max-w-3xl border-t border-white/10">
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
                     title="Global Leaderboards"
                     desc="Compete with thousands of aspirants across India. Know where you stand in the competition."
                  />
               </div>
            </div>
         </section>

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