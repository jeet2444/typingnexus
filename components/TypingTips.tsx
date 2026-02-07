import React from 'react';
import { Search } from 'lucide-react';

const TIPS = [
  {
    title: 'Railway Recruitment Board (RRB) NTPC Computer Based Typing Skill Test Rules',
    subtitle: 'Graduate and Undergraduate Posts',
    desc: 'ENGLISH & HINDI TYPING RULES',
    tags: ['RRB NTPC Typing 2026'],
    modified: '30 December, 2025',
    color: 'bg-red-50'
  },
  {
    title: 'UP Police (UPPRPB) SI, ASI, Computer Operator Grade A Recruitment 2025-26',
    subtitle: 'Typing Test Rules',
    desc: 'Practice Online or Download Passage',
    tags: ['UPPRPB SI, ASI, Computer Operator Grade A'],
    modified: '25 December, 2025',
    color: 'bg-yellow-50'
  },
  {
    title: 'UPSSSC Assistants Recruitment English Typing & Hindi Typing Skill Test',
    subtitle: 'Practice for English typing as well as for Hindi',
    desc: 'Required speed of 30 wpm / 25 wpm respectively',
    tags: ['UPSSSC Assistants 2026'],
    modified: '25 December, 2025',
    color: 'bg-orange-50'
  },
  {
    title: 'BSSC 2nd Inter Level Advt. No. 02/23',
    subtitle: 'English & Hindi Typing',
    desc: 'Typing Nexus',
    tags: ['BSSC 2nd Inter Level'],
    modified: '',
    color: 'bg-blue-50'
  }
];

const TypingTips: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display mb-8">Exam Oriented Typing Tips</h1>
          <div className="max-w-xl mx-auto relative">
             <input 
               type="text" 
               placeholder="Search in 49 blogs by keyword..." 
               className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-brand-black"
             />
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {TIPS.map((tip, idx) => (
             <div key={idx} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className={`h-48 ${tip.color} p-6 flex flex-col justify-center items-center text-center border-b border-gray-100 relative`}>
                   {/* Mock Graphic Content */}
                   {idx === 0 && <div className="text-brand-black font-bold text-lg">RRB NTPC CEN 05/2024</div>}
                   {idx === 1 && <div className="text-brand-black font-bold text-lg">UPPRPB 2024</div>}
                   {idx === 2 && <div className="text-brand-black font-bold text-lg">UPSSSC Skill Test</div>}
                   
                   <p className="text-xs mt-2 text-gray-600 max-w-[200px]">{tip.desc}</p>
                   <div className="absolute top-2 right-2 bg-brand-black text-white text-[10px] px-1 rounded">TN</div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                   <div className="mb-4">
                     {tip.tags.map(tag => (
                       <span key={tag} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-sm font-bold uppercase">{tag}</span>
                     ))}
                   </div>
                   
                   <h3 className="font-bold text-lg mb-2 leading-snug">{tip.title}</h3>
                   <h4 className="text-sm text-gray-600 mb-6 flex-1">{tip.subtitle}</h4>
                   
                   <div className="flex justify-between items-center mt-auto">
                      <span className="text-[10px] text-gray-400">{tip.modified ? `Modified: ${tip.modified}` : ''}</span>
                      <button className="border border-blue-500 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50">
                        Read More
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TypingTips;