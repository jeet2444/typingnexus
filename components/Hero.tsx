import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col">
      <section className="relative pt-12 pb-20 overflow-hidden px-4 md:px-8 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 relative z-10">
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tight">
              Start typing <br/>
              free, master <br/>
              with <span className="relative inline-block">
                pro
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-yellow" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> <br/>
              features.
            </h1>

            <p className="text-xl text-gray-700 max-w-md leading-relaxed">
              The Typing Nexus Team is dedicated to provide online English & Hindi typing platform for all Government Exams with exam based typing interface and error calculation.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link to="/exams" className="bg-brand-yellow border-2 border-brand-black text-brand-black px-8 py-4 text-lg font-bold shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2">
                Explore all exams <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative h-full min-h-[400px] flex items-center justify-center">
            {/* Background decoration box */}
            <div className="absolute inset-0 border-2 border-brand-black bg-white shadow-neo md:rotate-3 z-0 dot-pattern"></div>
            
            {/* Illustration layer */}
            <div className="relative z-10 w-full h-full p-8 min-h-[400px] flex flex-col justify-between">
               
               {/* Stats Card 1 - Examinations */}
               <div className="absolute top-12 right-8 bg-white border-2 border-brand-black p-5 shadow-neo rotate-3 hover:rotate-0 transition-transform cursor-default z-10">
                  <div className="text-4xl font-bold text-brand-purple text-center">100+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-bold mt-1">Examinations</div>
               </div>

               {/* Stats Card 2 - Passages */}
               <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-white border-2 border-brand-black p-6 shadow-neo -rotate-2 hover:rotate-0 transition-transform z-20 cursor-default">
                  <div className="text-3xl font-bold text-blue-600">9248+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-bold mt-1">Passages</div>
               </div>

               {/* Stats Card 3 - Visitors */}
               <div className="absolute bottom-12 right-12 bg-white border-2 border-brand-black px-5 py-3 shadow-neo flex items-center gap-3 rotate-1 hover:rotate-0 transition-transform cursor-default z-10">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none">55,39,159+</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Happy Visitors</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
               </div>
               
               {/* Decorative Circle in place of main image */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

            </div>
          </div>
        </div>
        
        {/* Decorative scribbles */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 border-b-4 border-brand-black rounded-full transform rotate-45 opacity-20"></div>

      </section>
    </div>
  );
};

export default Hero;