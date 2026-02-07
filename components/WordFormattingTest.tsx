import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Highlighter, Undo, Redo, Save, ArrowLeft, Search, List, Image, FileText, Strikethrough, Subscript, Superscript } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';

import { useAuth } from '../context/AuthContext';
import { getAdminStore, hasTestAccess } from '../utils/adminStore';

const WordFormattingTest: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { currentUser } = useAuth();
   const user = getUserProfile();

   // Fetch from Store
   const store = getAdminStore();
   const wordTests = store.cptTests.filter(t => t.type === 'Word');
   const lesson = wordTests.find(t => t.id === Number(id)) || wordTests[0];

   // Fallback
   if (!lesson) {
      return <div className="p-10 text-center">Test not found.</div>;
   }

   const [timeLeft, setTimeLeft] = useState(600);
   const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
   const editorRef = useRef<HTMLDivElement>(null);
   const [content, setContent] = useState(lesson.content);

   useEffect(() => {
      setContent(lesson.content);
      setTimeLeft(600);
   }, [lesson]);

   // Access Control
   useEffect(() => {
      if (lesson && !hasTestAccess(currentUser, lesson.id)) {
         alert("This test is locked. Please purchase a Combo Pack to access.");
         navigate('/cpt/word');
      }
   }, [lesson, currentUser, navigate]);

   useEffect(() => {
      const timer = setInterval(() => {
         setTimeLeft(prev => {
            if (prev <= 1) {
               handleSubmit();
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
      return () => clearInterval(timer);
   }, []);

   const handleSubmit = () => {
      const mockScore = Math.floor(Math.random() * 20) + 30;
      const newResult: any = {
         id: Date.now().toString(),
         type: 'Word',
         date: new Date().toLocaleDateString(),
         score: mockScore,
         maxScore: 50,
         accuracy: Math.floor(Math.random() * 10) + 90,
         timeTaken: formatTime(600 - timeLeft)
      };

      const updatedUser = { ...user, cptResults: [newResult, ...(user.cptResults || [])] };
      saveUserProfile(updatedUser);
      alert(`Test Submitted! Your Score: ${mockScore}/50`);
      navigate('/profile');
   };

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const execCommand = (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
         editorRef.current.focus();
      }
   };

   return (
      <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

         {/* LEFT SIDEBAR - Candidate Details & Questions */}
         <div className="w-80 bg-white border-r border-gray-300 flex flex-col shrink-0">
            <div className="bg-black text-white text-center py-1 font-bold text-sm">
               Candidate Details
            </div>
            <div className="p-2 text-xs border-b border-gray-300 bg-gray-50 flex gap-2 items-center">
               <div className="w-12 h-12 bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
                  <img src={user.avatar} alt="Candidate" className="w-full h-full object-cover" />
               </div>
               <div>
                  <div className="font-bold">{user.name}</div>
                  <div>Roll No: 123456</div>
                  <div className="text-gray-500">Exam: RSSB LDC</div>
               </div>
            </div>

            <div className="bg-blue-600 text-white text-center py-1 font-bold text-sm flex justify-between items-center px-4">
               <span>Formatting Tasks</span>
               <button
                  onClick={() => setLanguage(prev => prev === 'English' ? 'Hindi' : 'English')}
                  className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded font-bold hover:bg-gray-100"
               >
                  {language === 'English' ? 'हिंदी में देखें' : 'View in English'}
               </button>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-2 bg-gray-100">
               {lesson.questions.map((q: any, i: number) => {
                  const questionText = (language === 'Hindi' && q.textHi) ? q.textHi : q.text;
                  return (
                     <div key={q.id} className="bg-white border-l-4 border-blue-500 p-2 shadow-sm text-xs">
                        <div className="flex justify-between font-bold mb-1">
                           <span className="text-blue-700">Q.{i + 1}</span>
                           <span>{q.marks} Marks</span>
                        </div>
                        <p className="text-gray-800 leading-snug">{questionText}</p>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* RIGHT MAIN CONTENT */}
         <div className="flex-grow flex flex-col min-w-0">

            <div className="bg-yellow-500 text-center py-2 px-4 border-b-2 border-orange-600 relative shrink-0">
               <h1 className="text-2xl font-serif font-bold text-black">Recruiting Department Name</h1>
               <p className="text-black font-semibold text-xs uppercase tracking-wider">(Computer Proficiency Test)</p>

               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <div className="bg-black text-white px-3 py-1 font-mono font-bold text-lg rounded shadow-sm border border-gray-600">
                     {formatTime(timeLeft)}
                  </div>
                  <Link to="/cpt/word" className="bg-white/20 hover:bg-white/40 p-1 rounded transition">
                     <ArrowLeft size={20} className="text-black" />
                  </Link>
               </div>
            </div>

            <div className="bg-[#f3f2f1] border-b border-gray-300 shrink-0">
               <div className="flex px-2 pt-1 gap-4 text-xs text-gray-700 border-b border-gray-200 bg-white">
                  <span className="text-[#2b579a] font-bold border-b-2 border-[#2b579a] px-2 pb-1">Home</span>
                  <span className="px-2 pb-1">Insert</span>
                  <span className="px-2 pb-1">Page Layout</span>
               </div>

               <div className="flex p-1 gap-2 items-center overflow-x-auto h-20">

                  <div className="flex flex-col items-center px-2 border-r border-gray-300 gap-1 h-full justify-center">
                     <div className="flex gap-1 mb-1">
                        <select className="border border-gray-300 text-xs w-28 h-6" onChange={(e) => execCommand('fontName', e.target.value)}>
                           <option value="Arial">Arial</option>
                           <option value="Times New Roman">Times New Roman</option>
                           <option value="Calibri">Calibri</option>
                           <option value="Mangal">Mangal (Hindi)</option>
                           <option value="Kruti Dev 010">Kruti Dev (Hindi)</option>
                        </select>
                        <select className="border border-gray-300 text-xs w-12 h-6" onChange={(e) => execCommand('fontSize', e.target.value)}>
                           <option value="3">11</option>
                           <option value="4">12</option>
                           <option value="5">14</option>
                           <option value="6">18</option>
                           <option value="7">24</option>
                        </select>
                     </div>
                     <div className="flex gap-0.5">
                        <button onClick={() => execCommand('bold')} className="p-1 hover:bg-gray-200 rounded font-bold"><Bold size={14} /></button>
                        <button onClick={() => execCommand('italic')} className="p-1 hover:bg-gray-200 rounded italic"><Italic size={14} /></button>
                        <button onClick={() => execCommand('underline')} className="p-1 hover:bg-gray-200 rounded underline"><Underline size={14} /></button>
                        <div className="w-[1px] bg-gray-300 mx-1 h-4"></div>
                        <button onClick={() => execCommand('foreColor', 'red')} className="p-1 hover:bg-gray-200 rounded text-red-600 font-bold">A</button>
                        <button onClick={() => execCommand('hiliteColor', 'yellow')} className="p-1 hover:bg-gray-200 rounded bg-yellow-100"><Highlighter size={14} /></button>
                        <div className="w-[1px] bg-gray-300 mx-1 h-4"></div>
                        <button onClick={() => execCommand('strikeThrough')} className="p-1 hover:bg-gray-200 rounded" title="Strikethrough"><Strikethrough size={14} /></button>
                        <button onClick={() => execCommand('subscript')} className="p-1 hover:bg-gray-200 rounded font-bold" title="Subscript"><Subscript size={14} /></button>
                        <button onClick={() => execCommand('superscript')} className="p-1 hover:bg-gray-200 rounded font-bold" title="Superscript"><Superscript size={14} /></button>
                     </div>
                  </div>

                  <div className="flex flex-col items-center px-2 border-r border-gray-300 gap-1 h-full justify-center">
                     <div className="flex gap-0.5">
                        <button onClick={() => execCommand('justifyLeft')} className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
                        <button onClick={() => execCommand('justifyCenter')} className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
                        <button onClick={() => execCommand('justifyRight')} className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
                     </div>
                  </div>

               </div>
            </div>

            <div className="flex-grow bg-[#d4d4d4] p-8 overflow-y-auto flex justify-center">
               <div className="w-[21cm] min-h-[29.7cm] bg-white shadow-lg p-[2.54cm] cursor-text print:w-full print:shadow-none">
                  <div
                     className="outline-none min-h-[500px]"
                     contentEditable
                     ref={editorRef}
                     dangerouslySetInnerHTML={{ __html: content }}
                     suppressContentEditableWarning={true}
                     spellCheck={false}
                     style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}
                  ></div>
               </div>
            </div>

            <div className="bg-[#2b579a] text-white px-4 py-0.5 text-xs flex gap-4 shrink-0">
               <span>Page 1 of 1</span>
               <span>Words: {content.replace(/<[^>]*>/g, '').split(' ').filter(Boolean).length}</span>
               <span>English (India) / Hindi</span>
            </div>

         </div>
      </div>
   );
};

export default WordFormattingTest;