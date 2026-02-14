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

      // SEO & Structured Data Optimization
      const title = "TypingNexus | India's #1 Typing & CPT Exam Preparation (RSSB, SSC, Railway)";
      document.title = title;

      const metaDescContent = "Best platform for RSSB LDC, SSC CGL, and Railway NTPC typing prep. Practice Hindi (Remington GAIL/Inscript) and English typing with exact exam interface. CPT Word & Excel simulation.";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
         metaDesc = document.createElement('meta');
         metaDesc.setAttribute('name', 'description');
         document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", metaDescContent);

      // Add JSON-LD Structured Data
      const structuredData = {
         "@context": "https://schema.org",
         "@type": "WebApplication",
         "name": "Typing Nexus",
         "url": "https://typingnexus.in",
         "description": metaDescContent,
         "applicationCategory": "EducationalApplication",
         "operatingSystem": "All",
         "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
         }
      };

      let script = document.getElementById('json-ld-structured-data');
      if (!script) {
         script = document.createElement('script');
         script.id = 'json-ld-structured-data';
         script.setAttribute('type', 'application/ld+json');
         document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);

      return () => {
         window.removeEventListener('adminStoreUpdate', loadStoreData);
         window.removeEventListener('storage', loadStoreData);
         if (script) script.remove();
      };
   }, [location]);

   const heroTitle = settings?.heroTitle || "Master Typing for RSSB, SSC & Railway Exams";
   const heroSubtitle = settings?.heroSubtitle || "Join 50,000+ aspirants practicing with the exact exam interface for Hindi Remington GAIL, Inscript, and English typing.";
   const heroCTAText = settings?.heroCTAText || "Start Free Practice Now";
   const heroCTALink = settings?.heroCTALink || "/practice-exams";

   return (
      <div className="flex flex-col min-h-screen text-gray-200 bg-[#030712]">
         {/* Background Glows */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-purple/10 blur-[120px] rounded-full"></div>
            <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-600/5 blur-[100px] rounded-full"></div>
         </div>

         {/* LATEST NOTIFICATIONS TICKER */}
         {notifications.length > 0 && (
            <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 text-white py-2 px-4 overflow-hidden relative z-20 flex items-center gap-4">
               <span className="bg-brand-purple text-[10px] font-black px-2 py-0.5 rounded animate-pulse shadow-lg shadow-purple-900/50">LIVE UPDATE</span>
               <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <div className="inline-block animate-marquee font-medium text-gray-300 text-sm">
                     {notifications.map((n, i) => (
                        <span key={i} className="mr-8">
                           {n.message} <span className="text-gray-700 mx-4">❈</span>
                        </span>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Hero Section */}
         <section className="relative pt-24 pb-20 px-4 text-center overflow-hidden z-10">
            <div className="max-w-5xl mx-auto space-y-12 flex flex-col items-center">

               {/* Trust Badge */}
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs font-bold text-gray-300 hover:border-brand-purple/50 transition-colors cursor-default group">
                  <span className="flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-purple opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
                  </span>
                  Trusted by <span className="text-brand-purple group-hover:text-white transition-colors">10,000+ Successful Candidates</span>
               </div>

               <div className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-display font-black leading-[1.1] text-white tracking-tight">
                     {heroTitle.includes("for") ? (
                        <>
                           {heroTitle.split("for")[0]} <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-blue-400 to-brand-cyan">
                              for {heroTitle.split("for")[1]}
                           </span>
                        </>
                     ) : (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-brand-purple">
                           {heroTitle}
                        </span>
                     )}
                  </h1>

                  <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                     {heroSubtitle}
                  </p>
               </div>

               <div className="flex flex-wrap justify-center gap-5 pt-4">
                  <Link to={heroCTALink} className="group relative bg-brand-purple hover:bg-white text-white hover:text-black px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] flex items-center gap-3 active:scale-95">
                     {heroCTAText} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

               {/* Quick Exam Categories Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  {[
                     { name: 'RSSB Typing', link: '/practice-exams' },
                     { name: 'SSC CGL/CHSL', link: '/practice-exams' },
                     { name: 'High Court', link: '/practice-exams' },
                     { name: 'Railway NTPC', link: '/practice-exams' }
                  ].map((cat, i) => (
                     <Link key={i} to={cat.link} className="p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all text-sm font-bold text-gray-400 hover:text-white">
                        {cat.name}
                     </Link>
                  ))}
               </div>

               {/* Live Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 w-full max-w-4xl border-t border-white/5 mt-16">
                  <div className="text-center group">
                     <div className="text-4xl font-black font-display text-white group-hover:text-brand-purple transition-colors">50k+</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 group-hover:text-gray-400 transition-colors">Total Students</div>
                  </div>
                  <div className="text-center group">
                     <div className="text-4xl font-black font-display text-white group-hover:text-blue-400 transition-colors">1.2M+</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 group-hover:text-gray-400 transition-colors">Tests Taken</div>
                  </div>
                  <div className="text-center group">
                     <div className="text-4xl font-black font-display text-white group-hover:text-green-400 transition-colors">98%</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 group-hover:text-gray-400 transition-colors">Success Rate</div>
                  </div>
                  <div className="text-center group">
                     <div className="text-4xl font-black font-display text-white group-hover:text-brand-cyan transition-colors">Real</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 group-hover:text-gray-400 transition-colors">Exam Interface</div>
                  </div>
               </div>
            </div>
         </section>


         {/* LIVE EXAMS SECTION - REFINED */}
         {liveExams.length > 0 && (
            <section className="py-16 px-4 relative overflow-hidden z-10">
               {/* Animated Background Mesh - Replaced with static but elegant grid for performance */}
               <div className="absolute inset-0 bg-gray-950">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
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
         <section id="cpt-section" className="py-20 px-4 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-48 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
               <div className="space-y-8">
                  <div>
                     <span className="text-blue-400 font-black tracking-[0.2em] text-[10px] uppercase mb-4 block">Specialized Modules</span>
                     <h2 className="text-4xl md:text-5xl font-display font-black mb-6 text-white leading-tight">Master <span className="text-blue-500">CPT</span> Word & Excel <br /> <span className="text-gray-500">Efficiency</span></h2>
                     <p className="text-gray-400 text-lg leading-relaxed font-medium">
                        Don't let the Computer Proficiency Test hold you back. Our simulation environment covers all formatting requirements for RSSB LDC, SSC CGL, and other major exams.
                     </p>
                  </div>

                  <div className="grid gap-6">
                     <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 shadow-lg shadow-blue-950/50"><FileSpreadsheet size={24} /></div>
                        <div>
                           <h4 className="font-bold text-white text-lg">Excel Formulas & Formatting</h4>
                           <p className="text-sm text-gray-500">VLOOKUP, Conditional Formatting, Dynamic Charts</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-purple/30 transition-colors">
                        <div className="bg-brand-purple/20 p-3 rounded-xl text-brand-purple shadow-lg shadow-purple-950/50"><FileType size={24} /></div>
                        <div>
                           <h4 className="font-bold text-white text-lg">Word Letter & Report Formatting</h4>
                           <p className="text-sm text-gray-500">Precise Indentation, Line Spacing, Professional Tables</p>
                        </div>
                     </div>
                  </div>

                  <Link to="/cpt/excel" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-white text-white hover:text-black px-8 py-4 rounded-xl font-black transition-all shadow-xl hover:shadow-blue-500/20">
                     Start CPT Practice <ArrowRight size={20} />
                  </Link>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-brand-purple blur-[80px] opacity-10"></div>
                  <div className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative transition-all duration-500 hover:scale-[1.02]">
                     <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-black tracking-widest ml-4 uppercase">cpt_simulation_v2.4</div>
                     </div>
                     <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between items-center text-gray-400"><span>Formula Validation:</span> <span className="text-green-500 font-bold">Passed</span></div>
                        <div className="flex justify-between items-center text-gray-400"><span>Margin Accuracy:</span> <span className="text-blue-500 font-bold">100.0%</span></div>
                        <div className="flex justify-between items-center text-gray-400"><span>Header Check:</span> <span className="text-brand-purple font-bold">Correct</span></div>
                        <div className="mt-6">
                           <div className="flex justify-between text-[10px] text-gray-600 font-black uppercase mb-2">Overall Proficiency</div>
                           <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-600 to-brand-purple w-[88%] shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Hindi Typing Specialized Section (SEO Boost) */}
         <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                     <div className="bg-gray-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest">
                           Regional Language Support
                        </div>
                        <h3 className="text-3xl font-display font-black text-white">Advanced Hindi <span className="text-orange-500">Keyboard</span> Mapping</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">
                           Practice on Remington GAIL, Remington CBI, or Inscript layouts with the official Mangal font. Our system handles complex Hindi characters (Sanyukt Akshar) exactly like the real exam software used by RSSB and SSC.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5">
                              <div className="text-white font-bold mb-1">KrutiDev/Mangal</div>
                              <div className="text-xs text-gray-500">Auto-convert & support</div>
                           </div>
                           <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5">
                              <div className="text-white font-bold mb-1">Exact Highlights</div>
                              <div className="text-xs text-gray-500">Character-level tracking</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="order-1 md:order-2 space-y-6">
                     <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">The Choice of <br /> <span className="text-orange-500">Rajasthan</span> Aspirants</h2>
                     <p className="text-gray-400 text-lg font-medium">
                        Specially tailored for RSSB LDC, High Court JJA, and Informatic Assistant exams. We use the latest TCS-style exam algorithms.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* FAQ Section for SEO */}
         <section className="py-24 px-4 bg-black/20 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-display font-black text-white text-center mb-16">Frequently Asked <span className="text-brand-purple">Questions</span></h2>
               <div className="space-y-6">
                  {[
                     { q: "Is TypingNexus free for SSC and Railway preparation?", a: "Yes, we offer free practice exams covering major exams like SSC CGL, CHSL, and Railway NTPC with the exact official interface." },
                     { q: "Do you support Hindi Remington GAIL keyboard layout?", a: "Absolutely. We provide full support for Remington GAIL, Remington CBI, and Inscript layouts with the Mangal font for RSSB and High Court exams." },
                     { q: "How are typing speeds calculated on this platform?", a: "We follow the official standard formula: (Total Characters / 5 - Errors) / Time. We also provide net WPM and accuracy metrics." },
                     { q: "Can I practice for MS Word and Excel CPT on mobile?", a: "For the best experience, we recommend using a PC or tablet for CPT simulation to mirror the actual exam environment." }
                  ].map((item, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-purple/20 transition-all">
                        <h4 className="text-lg font-bold text-white mb-3">{item.q}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                     </div>
                  ))}
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