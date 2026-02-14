import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, ArrowLeft, List, ListOrdered, Strikethrough, Subscript, Superscript, Undo, Redo, Printer, Save, FileText, Table, Image, Link as LinkIcon, Lock, Unlock } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';
import { useAuth } from '../context/AuthContext';
import { getAdminStore, hasTestAccess } from '../utils/adminStore';

const WordFormattingTest: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { currentUser, hasPremiumAccess } = useAuth();
   const user = getUserProfile();

   const store = getAdminStore();
   const wordTests = store.cptTests.filter(t => t.type === 'Word');
   const lesson = wordTests.find(t => t.id === Number(id)) || wordTests[0];

   if (!lesson) {
      return <div className="p-10 text-center text-white">Test not found.</div>;
   }

   const isTrial = !hasPremiumAccess;
   const [timeLeft, setTimeLeft] = useState(isTrial ? 20 : 600);
   const [isPaused, setIsPaused] = useState(false);

   const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
   const editorRef = useRef<HTMLDivElement>(null);

   // Clean content - remove any inline styles that make text invisible
   const cleanContent = (html: string) => {
      return html
         .replace(/color:\s*[^;]+;?/gi, '')
         .replace(/style="[^"]*"/gi, '')
         .replace(/<p>/g, '<p style="margin-bottom: 12px; color: #000000;">')
         .replace(/<\/p>/g, '</p>');
   };

   const [content, setContent] = useState(cleanContent(lesson.content || ''));

   useEffect(() => {
      setContent(cleanContent(lesson.content || ''));
      setTimeLeft(isTrial ? 20 : 600);
   }, [lesson, isTrial]);

   useEffect(() => {
      const timer = setInterval(() => {
         if (isPaused) return;

         setTimeLeft(prev => {
            if (prev <= 1) {
               if (isTrial) {
                  setIsPaused(true);
                  return 0;
               } else {
                  handleSubmit();
                  return 0;
               }
            }
            return prev - 1;
         });
      }, 1000);
      return () => clearInterval(timer);
   }, [isPaused, isTrial]);

   const handleSubmit = () => {
      if (isTrial) return;

      const mockScore = Math.floor(Math.random() * 20) + 30;
      const newResult = {
         id: Date.now().toString(),
         type: 'Word' as const,
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
      editorRef.current?.focus();
   };

   const [activeTab, setActiveTab] = useState('Home');
   const [fontSize, setFontSize] = useState('12');
   const [fontFamily, setFontFamily] = useState('Calibri');

   // Toolbar Button Component
   const ToolBtn = ({ onClick, title, children, active = false }: any) => (
      <button
         onClick={onClick}
         title={title}
         className={`p-1.5 hover:bg-blue-100 rounded transition-colors ${active ? 'bg-blue-200' : ''}`}
      >
         {children}
      </button>
   );

   return (
      <>
         <div className="h-screen flex flex-col bg-gray-100 font-sans text-xs">
            {/* Header */}
            <div className="bg-[#2b579a] text-white p-2 flex justify-between items-center shadow-md z-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/cpt/word')} className="hover:bg-blue-700 p-1 rounded">
                     <ArrowLeft size={16} />
                  </button>
                  <div className="flex items-baseline gap-2">
                     <h1 className="font-bold text-lg">Word Test - {lesson.title}</h1>
                     {isTrial && <span className="text-[10px] bg-yellow-400 text-black px-1 rounded font-bold">TRIAL MODE</span>}
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className={`font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-300 animate-pulse' : ''}`}>
                     {formatTime(timeLeft)}
                  </div>
                  {!isTrial && (
                     <button onClick={handleSubmit} className="bg-white text-blue-800 px-4 py-1 rounded font-bold hover:bg-gray-100 shadow">
                        Submit Test
                     </button>
                  )}
               </div>
            </div>

            {/* Toolbar (Ribbon) */}
            <div className="bg-white border-b border-gray-300 flex flex-col">
               <div className="flex border-b border-gray-200">
                  {['Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 ${activeTab === tab ? 'text-[#2b579a] border-b-2 border-[#2b579a] font-bold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>
               <div className="p-2 flex gap-2 items-center h-20 overflow-hidden relative">

                  {activeTab === 'Home' && (
                     <div className="flex items-start gap-4 h-full">
                        {/* Clipboard Group */}
                        <div className="flex flex-col items-center px-3 border-r border-gray-300">
                           <div className="flex gap-1 mb-1">
                              <ToolBtn onClick={() => execCommand('paste')} title="Paste">📋</ToolBtn>
                              <ToolBtn onClick={() => execCommand('copy')} title="Copy">📄</ToolBtn>
                              <ToolBtn onClick={() => execCommand('cut')} title="Cut">✂️</ToolBtn>
                           </div>
                           <span className="text-[10px] text-gray-500 mt-1">Clipboard</span>
                        </div>

                        {/* Font Group */}
                        <div className="flex flex-col items-center px-3 border-r border-gray-300">
                           <div className="flex gap-1 items-center mb-1">
                              <select
                                 value={fontFamily}
                                 onChange={(e) => { setFontFamily(e.target.value); execCommand('fontName', e.target.value); }}
                                 className="border border-gray-300 text-xs h-6 w-28 rounded"
                              >
                                 <option value="Calibri">Calibri</option>
                                 <option value="Arial">Arial</option>
                                 <option value="Arial Black">Arial Black</option>
                                 <option value="Verdana">Verdana</option>
                                 <option value="Times New Roman">Times New Roman</option>
                                 <option value="Mangal">Mangal (Hindi)</option>
                                 <option value="Georgia">Georgia</option>
                              </select>
                              <select
                                 value={fontSize}
                                 onChange={(e) => { setFontSize(e.target.value); execCommand('fontSize', e.target.value); }}
                                 className="border border-gray-300 text-xs h-6 w-14 rounded"
                              >
                                 {[1, 2, 3, 4, 5, 6, 7].map(s => <option key={s} value={s}>{[8, 10, 12, 14, 18, 24, 36][s - 1]} pt</option>)}
                              </select>
                           </div>
                           <div className="flex gap-0.5 items-center">
                              <ToolBtn onClick={() => execCommand('bold')} title="Bold (Ctrl+B)"><Bold size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('italic')} title="Italic (Ctrl+I)"><Italic size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('underline')} title="Underline (Ctrl+U)"><Underline size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('strikeThrough')} title="Strikethrough"><Strikethrough size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('subscript')} title="Subscript"><Subscript size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('superscript')} title="Superscript"><Superscript size={14} /></ToolBtn>
                              <div className="w-px bg-gray-300 mx-1" />

                              {/* Color Pickers */}
                              <div className="flex flex-col items-center group relative">
                                 <label htmlFor="fontColor" className="cursor-pointer p-0.5 hover:bg-gray-100 rounded flex flex-col items-center justify-center w-7 h-6">
                                    <span className="font-bold text-sm text-gray-800 leading-none">A</span>
                                    <div className="h-1 w-4 bg-red-500 rounded-full mt-0.5"></div>
                                 </label>
                                 <input
                                    id="fontColor"
                                    type="color"
                                    className="absolute opacity-0 w-full h-full cursor-pointer"
                                    onChange={(e) => execCommand('foreColor', e.target.value)}
                                    title="Font Color"
                                 />
                              </div>

                              <div className="flex flex-col items-center group relative ml-1">
                                 <label htmlFor="hiliteColor" className="cursor-pointer p-0.5 hover:bg-gray-100 rounded flex flex-col items-center justify-center w-7 h-6">
                                    <Highlighter size={14} className="text-gray-800" />
                                    <div className="h-1 w-4 bg-yellow-400 rounded-full mt-0.5"></div>
                                 </label>
                                 <input
                                    id="hiliteColor"
                                    type="color"
                                    className="absolute opacity-0 w-full h-full cursor-pointer"
                                    onChange={(e) => execCommand('hiliteColor', e.target.value)}
                                    title="Highlight Color"
                                 />
                              </div>

                           </div>
                           <span className="text-[10px] text-gray-500 mt-1">Font</span>
                        </div>

                        {/* Paragraph Group */}
                        <div className="flex flex-col items-center px-3 border-r border-gray-300">
                           <div className="flex gap-0.5">
                              <ToolBtn onClick={() => execCommand('justifyLeft')} title="Align Left"><AlignLeft size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('justifyCenter')} title="Center"><AlignCenter size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('justifyRight')} title="Align Right"><AlignRight size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('justifyFull')} title="Justify"><AlignJustify size={14} /></ToolBtn>
                              <div className="w-px bg-gray-300 mx-1" />
                              <ToolBtn onClick={() => execCommand('insertUnorderedList')} title="Bullets"><List size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('insertOrderedList')} title="Numbering"><ListOrdered size={14} /></ToolBtn>
                           </div>
                           <span className="text-[10px] text-gray-500 mt-1">Paragraph</span>
                        </div>

                        {/* Editing Group */}
                        <div className="flex flex-col items-center px-3">
                           <div className="flex gap-1">
                              <ToolBtn onClick={() => execCommand('undo')} title="Undo"><Undo size={14} /></ToolBtn>
                              <ToolBtn onClick={() => execCommand('redo')} title="Redo"><Redo size={14} /></ToolBtn>
                           </div>
                           <span className="text-[10px] text-gray-500 mt-1">Editing</span>
                        </div>

                     </div>
                  )}
               </div>


               {/* Main Work Area */}
               <div className="flex-1 overflow-hidden flex bg-[#525252]">

                  {/* Instructions Panel (New) */}
                  <div className="w-80 bg-white border-r border-gray-300 flex flex-col shadow-lg z-10">
                     <div className="bg-gray-100 p-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
                        <span className="flex items-center gap-2"><List size={16} /> Tasks</span>
                        <button className="text-blue-600 text-xs font-bold hover:underline" onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}>
                           {language === 'English' ? 'हिंदी में देखें' : 'View in English'}
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {lesson.questions?.length > 0 ? (
                           lesson.questions.map((q: any, idx: number) => (
                              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm">
                                 <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-blue-600">Q{idx + 1}.</span>
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">{q.marks} Marks</span>
                                 </div>
                                 <p className="text-gray-700 leading-relaxed">{language === 'English' ? q.text : (q.textHi || q.text)}</p>
                              </div>
                           ))
                        ) : (
                           <div className="text-center text-gray-400 mt-10 italic">
                              No specific questions for this test.<br />Format the document as per the title.
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Document Area - MS Word Canvas */}
                  <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-[#525252]">
                     <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl cursor-text relative transition-transform origin-top scale-90 sm:scale-100" style={{ padding: '25mm' }}>
                        {/* Ruler (decorative) */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-200 to-gray-100 border-b border-gray-300 flex items-end justify-center text-[8px] text-gray-500 select-none">
                           {[...Array(21)].map((_, i) => <span key={i} className="w-[1cm] text-center border-l border-gray-400">{i}</span>)}
                        </div>

                        <div
                           className="outline-none min-h-[800px] mt-4 word-document-area"
                           contentEditable
                           ref={editorRef}
                           dangerouslySetInnerHTML={{ __html: content }}
                           suppressContentEditableWarning={true}
                           spellCheck={false}
                           style={{
                              fontFamily: 'Calibri, Arial, sans-serif',
                              fontSize: '14pt',
                              lineHeight: '1.8',
                              color: '#000000',
                              caretColor: '#000000'
                           }}
                        />
                     </div>
                  </div>
               </div>

               {/* Status Bar */}
               <div className="bg-[#2b579a] text-white px-4 py-1 text-xs flex justify-between items-center shrink-0">
                  <div className="flex gap-4">
                     <span>Page 1 of 1</span>
                     <span>|</span>
                     <span>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <div className="flex gap-2">
                     <span>English (India)</span>
                     <span>|</span>
                     <span>100%</span>
                  </div>
               </div>

            </div>
         </div>

         {/* TRIAL EXPIRED MODAL */}
         {isPaused && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <div className="w-16 h-16 bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free Trial Ended</h3>
                  <p className="text-gray-400 mb-8">
                     You've completed the 20-second preview of this test.
                     <br />Unlock full access to continue practicing.
                  </p>
                  <div className="space-y-3">
                     <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-pink-600 text-white font-bold shadow-lg hover:shadow-brand-purple/25 transition-all">
                        Login to Unlock
                     </button>
                     <button onClick={() => navigate('/cpt/word')} className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 transition-all">
                        Back to Menu
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default WordFormattingTest;