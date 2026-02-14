import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, FileText, ArrowLeft, Play, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminStore, hasTestAccess } from '../utils/adminStore';

const CPTMenu: React.FC = () => {
   const { hasPremiumAccess, isAuthenticated, currentUser } = useAuth();
   const { type } = useParams<{ type: 'excel' | 'word' }>();
   const navigate = useNavigate();
   const isExcel = type === 'excel';

   const store = getAdminStore();

   // 1. Get Native CPT Tests
   const cptTests = store.cptTests.filter(t => t.type === (isExcel ? 'Excel' : 'Word'));

   // 2. Get Typing Tests related to this category (filtered out from main Exams list)
   const typingTests = store.exams?.filter(e => {
      if (e.status !== 'Published') return false;
      const isRelevant = isExcel
         ? (e.title.match(/Excel/i) || e.categoryId?.match(/Excel/i))
         : (e.title.match(/Word/i) || e.categoryId?.match(/Word/i));
      return isRelevant;
   }) || [];

   // 3. Merge & Map
   const LESSONS = [
      ...cptTests.map((test, idx) => ({
         id: test.id,
         title: test.title,
         label: isExcel ? `Practical ${idx + 1}` : `Practical ${idx + 1}`,
         language: test.language || 'Bilingual',
         duration: 15,
         locked: !hasTestAccess(currentUser, test.id),
         isFree: test.isFree,
         isTypingTest: false
      })),
      ...typingTests.map((test, idx) => ({
         id: test.id,
         title: test.title,
         label: `Typing Test ${idx + 1}`,
         language: test.language,
         duration: 10, // Default or parse from rule
         locked: !hasPremiumAccess && idx > 0, // Simple lock logic for now
         isFree: idx === 0,
         isTypingTest: true
      }))
   ];

   const handleStartTest = (lesson: any) => {
      if (!isAuthenticated) {
         navigate('/login');
         return;
      }

      if (lesson.isTypingTest) {
         navigate(`/test/${lesson.id}`);
      } else {
         navigate(`/test/${type}/${lesson.id}/instructions`);
      }
   };

   return (
      <div className="bg-gray-950 min-h-screen py-8 px-4 font-sans text-gray-200">
         <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
               <Link to="/#cpt-section" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-bold transition-colors">
                  <ArrowLeft size={18} /> Back to Home
               </Link>
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isExcel ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'}`}>
                     {isExcel ? <FileSpreadsheet size={24} /> : <FileText size={24} />}
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{isExcel ? 'Excel Efficiency Tests' : 'Word Processing Tests'}</h1>
               </div>
            </div>

            {/* Test List Table */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
               <div className="overflow-x-auto">
                  {LESSONS.length === 0 ? (
                     <div className="p-12 text-center text-gray-500">No tests available in this section yet.</div>
                  ) : (
                     LESSONS.map((lesson, idx) => (
                        <div key={`${lesson.isTypingTest ? 't' : 'c'}-${lesson.id}`} className={`flex flex-col md:flex-row items-center justify-between p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-transparent'}`}>

                           {/* Test Identity */}
                           <div className="flex items-center gap-6 w-full md:w-auto mb-3 md:mb-0">
                              <div className="flex flex-col">
                                 <span className="font-bold text-gray-400 w-24">{lesson.label}</span>
                                 <span className={`text-[10px] uppercase font-bold tracking-wider ${lesson.isTypingTest ? 'text-purple-400' : 'text-cyan-400'}`}>
                                    {lesson.isTypingTest ? 'Typing' : 'Practical'}
                                 </span>
                              </div>
                              <span className="text-gray-200 font-medium text-sm flex-grow md:flex-grow-0">{lesson.title}</span>
                              {lesson.isFree && (
                                 <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                    Free Trial
                                 </span>
                              )}
                           </div>

                           {/* Meta & Action */}
                           <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                              <span className="text-xs text-gray-600 font-mono hidden sm:block uppercase tracking-wider">{lesson.language}</span>

                              <div className="flex items-center gap-2">
                                 <label className="text-xs text-gray-500 hidden sm:block font-bold">DURATION:</label>
                                 <select className="border border-gray-700 rounded px-2 py-1 text-xs bg-gray-800 text-gray-300 focus:outline-none focus:border-cyan-500 font-mono" disabled={lesson.locked}>
                                    <option>{lesson.duration} MIN</option>
                                 </select>
                              </div>

                              {lesson.locked ? (
                                 <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed min-w-[140px] justify-center border border-gray-700">
                                    <Lock size={12} /> LOCKED
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => handleStartTest(lesson)}
                                    className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-lg min-w-[140px] transition-all flex items-center justify-center gap-2 ${isExcel ? 'bg-green-600 hover:bg-green-500 shadow-green-900/40' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'}`}
                                 >
                                    <Play size={12} fill="currentColor" /> {lesson.isFree ? "TRY FOR FREE" : "START TEST"}
                                 </button>
                              )}
                           </div>

                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Pagination / Footer Info */}
            <div className="mt-6 text-center text-xs text-gray-600 font-mono uppercase tracking-widest">
               Showing 1 to {LESSONS.length} of {LESSONS.length} entries
            </div>

         </div>
      </div>
   );
};

export default CPTMenu;