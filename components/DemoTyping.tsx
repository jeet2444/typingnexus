import React from 'react';

const DemoTyping: React.FC = () => {
  return (
    <div className="bg-cream min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-[#fff9f0] max-w-5xl w-full grid md:grid-cols-2 gap-12 p-8 md:p-16 rounded-xl relative overflow-hidden">
        
        {/* Decorative Circle */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-brand-yellow rounded-full z-0"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-brand-purple rounded-full z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-8">
               <svg width="40" height="40" viewBox="0 0 50 50" className="mb-4">
                  <path d="M10 25 Q 25 10 40 25" fill="none" stroke="black" strokeWidth="2" />
                  <path d="M20 20 Q 25 35 30 20" fill="none" stroke="black" strokeWidth="2" />
               </svg>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-2">
               Start <br/>
               <span className="relative inline-block">
                 Demo
                 <div className="absolute bottom-1 left-0 w-full h-2 bg-brand-purple opacity-80"></div>
               </span>
            </h1>

            <p className="mt-8 text-lg text-gray-700 max-w-sm">
               Select language and passage for a <span className="font-bold">5-minutes typing demo</span> and experience the Typing Nexus.
            </p>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex flex-col justify-center gap-8">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <label className="w-32 font-bold text-gray-800">Select Language:</label>
                   <select className="flex-1 p-3 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                      <option>Select typing language</option>
                      <option>English</option>
                      <option>Hindi (Remington)</option>
                      <option>Hindi (Inscript)</option>
                   </select>
                </div>

                <div className="flex items-center gap-4">
                   <label className="w-32 font-bold text-gray-800">Select Passage:</label>
                   <select className="flex-1 p-3 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                      <option>Select passage for typing</option>
                      <option>Demo Passage 1 (Easy)</option>
                      <option>Demo Passage 2 (Medium)</option>
                      <option>Demo Passage 3 (Hard)</option>
                   </select>
                </div>
            </div>

            <button className="bg-gray-300 text-white font-bold py-4 px-8 rounded shadow-none cursor-not-allowed w-40 mt-4 self-start">
               Start Demo
            </button>
        </div>

        <div className="absolute bottom-20 right-20 text-4xl font-display italic opacity-50">
           7
        </div>
      </div>
    </div>
  );
};

export default DemoTyping;