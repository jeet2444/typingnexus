import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, FileText, ArrowLeft, Play, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CPTMenu: React.FC = () => {
   const { hasPremiumAccess, isAuthenticated } = useAuth();
   const { type } = useParams<{ type: 'excel' | 'word' }>();
   const navigate = useNavigate();
   const isExcel = type === 'excel';

   const LESSON_TITLES: Record<string, string[]> = {
      word: [
         "Basic Character & Paragraph Formatting",
         "Table Creation & Cell Merging",
         "Advanced Page Layout & Borders",
         "Hindi Document (Mangal) Formatting",
         "Official Multi-page Document Setup",
         "Header, Footer & Page Numbering",
         "Bullets, Numbering & Multi-level Lists",
         "Insert Shapes, Images & Text Wrap",
         "Watermark & Security Settings",
         "Certificate & Award Design",
         "Technical Manual Formatting",
         "Legal Document (Krutidev) Formatting",
         "Final Mock Test - Mixed Tasks"
      ],
      excel: [
         "Data Entry & Basic Arithmetic",
         "SUM, AVERAGE, MIN, MAX Functions",
         "Cell Referencing & Percentage Calc",
         "Conditional Formatting (Data Bars)",
         "Salary Sheet with Basic Filters",
         "Budget Allocation & Pie Charts",
         "Grade Sheet & Result Processing",
         "Inventory Management with COUNTIF",
         "Quarterly Sales Report analysis",
         "Employee Payroll with TAX calc",
         "VLOOKUP & Essential Lookups",
         "Data Validation & Dropdowns",
         "Comprehensive Excel Final Test"
      ]
   };

   const LESSONS = Array.from({ length: 13 }, (_, i) => ({
      id: i + 1,
      title: isExcel ? LESSON_TITLES.excel[i] : LESSON_TITLES.word[i],
      label: isExcel ? `Exercise ${i + 1}` : `Test ${i + 1}`,
      language: (isExcel || i === 3 || i === 11) ? "Hindi" : "English", // Mix of lang
      duration: 10,
      // Show only ONE free (index 0). All others locked.
      locked: i > 0 && !hasPremiumAccess
   }));

   const handleStartTest = (lessonId: number) => {
      if (!isAuthenticated) {
         // "Show one free... jab click kare tab login pr send kr de"
         navigate('/login');
         return;
      }
      navigate(`/test/${type}/${lessonId}/instructions`);
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
                  {LESSONS.map((lesson, idx) => (
                     <div key={lesson.id} className={`flex flex-col md:flex-row items-center justify-between p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-transparent'}`}>

                        {/* Test Identity */}
                        <div className="flex items-center gap-6 w-full md:w-auto mb-3 md:mb-0">
                           <span className="font-bold text-gray-400 w-24">{lesson.label}</span>
                           <span className="text-gray-200 font-medium text-sm flex-grow md:flex-grow-0">{lesson.title}</span>
                           {idx === 0 && (
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
                                 <option>10 MIN</option>
                                 <option>20 MIN</option>
                                 <option>30 MIN</option>
                              </select>
                           </div>

                           {lesson.locked ? (
                              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed min-w-[140px] justify-center border border-gray-700">
                                 <Lock size={12} /> LOCKED
                              </button>
                           ) : (
                              <button
                                 onClick={() => handleStartTest(lesson.id)}
                                 className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-lg min-w-[140px] transition-all flex items-center justify-center gap-2 ${isExcel ? 'bg-green-600 hover:bg-green-500 shadow-green-900/40' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'}`}
                              >
                                 <Play size={12} fill="currentColor" /> {idx === 0 ? "TRY FOR FREE" : "START TEST"}
                              </button>
                           )}
                        </div>

                     </div>
                  ))}
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