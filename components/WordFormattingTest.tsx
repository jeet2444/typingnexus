import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Highlighter, Undo, Redo, Save, ArrowLeft, Search, List, Image, FileText, Strikethrough, Subscript, Superscript } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';

// Mock Data Sets with Hindi Support - 10 Varied Tests
const WORD_DATA_SETS: Record<string, any> = {
   '1': {
      title: "Test 1: Basic Formatting",
      content: `<p>Rajasthan Staff Selection Board conducts various examinations for recruitment.</p><p>The board ensures fair and transparent selection process for all candidates.</p><p>Computer proficiency test is an essential part of the examination.</p><p>Candidates must demonstrate their typing and formatting skills effectively.</p>`,
      questions: [
         { id: 1, text: "Document ke pehle paragraph ka Font Size 14 pt karein", marks: 2 },
         { id: 2, text: "Dusre paragraph ko 'Bold' aur 'Italic' kijiye", marks: 2 },
         { id: 3, text: "Teesre paragraph ka alignment 'Center' karein", marks: 2 },
         { id: 4, text: "Word 'Rajasthan' ko 'Highlight' karein (Yellow)", marks: 2 },
         { id: 5, text: "Fourth paragraph ko 'Right Align' karein", marks: 2 },
         { id: 6, text: "Pehle word ko 'Double Underline' kijiye", marks: 2 },
         { id: 7, text: "Sabhi paragraphs ki Line Spacing 1.15 set karein", marks: 2 },
         { id: 8, text: "Word 'Computer' ka font color Blue karein", marks: 2 },
         { id: 9, text: "Header mein 'LDC Exam 2024' likhein", marks: 2 },
         { id: 10, text: "Footer mein 'Page Number' insert karein", marks: 2 },
      ]
   },
   '2': {
      title: "Test 2: Table & Layout",
      content: `<p>Government offices require proper documentation skills from employees.</p><p>Table creation is an important skill for office work.</p><p>Formatting data in tables makes information more readable.</p>`,
      questions: [
         { id: 1, text: "Ek 3x3 Table insert karein", marks: 2 },
         { id: 2, text: "Table ki pehli row ko 'Merge' karke usmein 'Monthly Report' likhein", marks: 2 },
         { id: 3, text: "Table ke cells mein 'Shading' (Light Grey color) bharein", marks: 2 },
         { id: 4, text: "Page Orientation ko 'Landscape' karein", marks: 2 },
         { id: 5, text: "Pehle paragraph ka Font Style 'Arial' karein", marks: 2 },
         { id: 6, text: "Poore document par 'Page Border' (Box style) lagayein", marks: 2 },
         { id: 7, text: "Page Size 'A4' select karein", marks: 2 },
         { id: 8, text: "Page Margin ko 'Normal' set karein", marks: 2 },
         { id: 9, text: "Document mein 'Watermark' (Text: 'Draft') lagayein", marks: 2 },
         { id: 10, text: "Table ka border thickness 1.5 pt karein", marks: 2 },
      ]
   },
   '3': {
      title: "Test 3: Advanced Formatting",
      content: `<p>Professional document preparation requires attention to detail.</p><p>H2SO4 is the chemical formula for sulfuric acid.</p><p>The area of circle is πr2 where r is radius.</p><p>Proper formatting enhances document readability significantly.</p>`,
      questions: [
         { id: 1, text: "Pehle paragraph ko 'Justify Align' karein", marks: 2 },
         { id: 2, text: "'H2SO4' mein '2' aur '4' ko Subscript karein", marks: 2 },
         { id: 3, text: "'πr2' mein '2' ko Superscript karein", marks: 2 },
         { id: 4, text: "Font Size poore document ka 12 pt karein", marks: 2 },
         { id: 5, text: "Word 'Professional' ko Bold aur Red color karein", marks: 2 },
         { id: 6, text: "Teesre paragraph ka background color Light Yellow karein", marks: 2 },
         { id: 7, text: "Document ka title 'CPT Exam' header mein add karein", marks: 2 },
         { id: 8, text: "Paragraph spacing Before: 6 pt set karein", marks: 2 },
         { id: 9, text: "Word 'significantly' ko Italic aur Underline karein", marks: 2 },
         { id: 10, text: "Footer mein current date insert karein", marks: 2 },
      ]
   },
   '4': {
      title: "Test 4: Hindi Document Formatting",
      content: `<p>भारत सरकार के कार्यालयों में हिंदी का प्रयोग अनिवार्य है।</p><p>कंप्यूटर पर हिंदी टाइपिंग एक महत्वपूर्ण कौशल है।</p><p>राजस्थान में सरकारी परीक्षाओं का आयोजन नियमित रूप से होता है।</p>`,
      questions: [
         { id: 1, text: "Pehle paragraph ka Font 'Mangal' karein", marks: 2 },
         { id: 2, text: "Word 'भारत सरकार' ko Bold karein", marks: 2 },
         { id: 3, text: "Dusre paragraph ka Font Size 14 pt karein", marks: 2 },
         { id: 4, text: "Teesre paragraph ko Center Align karein", marks: 2 },
         { id: 5, text: "Word 'राजस्थान' ko Highlight (Yellow) karein", marks: 2 },
         { id: 6, text: "Pehle paragraph ko Justify Align karein", marks: 2 },
         { id: 7, text: "Line Spacing poore document ki 1.5 karein", marks: 2 },
         { id: 8, text: "Header mein 'एलडीसी परीक्षा 2024' likhein", marks: 2 },
         { id: 9, text: "Word 'कंप्यूटर' ka color Blue karein", marks: 2 },
         { id: 10, text: "Footer mein page number Hindi mein insert karein", marks: 2 },
      ]
   },
   '5': {
      title: "Test 5: Office Documentation",
      content: `<p>To,</p><p>The Office Superintendent,</p><p>District Administrative Office,</p><p>Jaipur, Rajasthan.</p><p>Subject: Request for leave approval</p><p>Sir, I request you to kindly grant me leave for three days.</p><p>Thanking you,</p><p>Your obedient,</p><p>Employee Name</p>`,
      questions: [
         { id: 1, text: "'The Office Superintendent' ko Bold karein", marks: 2 },
         { id: 2, text: "Subject line ko Center Align aur Underline karein", marks: 2 },
         { id: 3, text: "'Jaipur, Rajasthan' ka font color Red karein", marks: 2 },
         { id: 4, text: "Last three lines ko Right Align karein", marks: 2 },
         { id: 5, text: "Word 'leave' ko Highlight karein", marks: 2 },
         { id: 6, text: "Pehle paragraph ka Font Size 11 pt karein", marks: 2 },
         { id: 7, text: "Poore document ka Line Spacing 1.15 karein", marks: 2 },
         { id: 8, text: "Header mein 'Official Letter' likhein", marks: 2 },
         { id: 9, text: "Page Border (Shadow style) lagayein", marks: 2 },
         { id: 10, text: "Footer mein date aur page number daalein", marks: 2 },
      ]
   },
   '6': {
      title: "Test 6: Report Formatting",
      content: `<p>ANNUAL REPORT 2024</p><p>Department Performance Analysis</p><p>The department achieved 95% target completion rate.</p><p>Total Budget: Rs. 50,00,000</p><p>Expenditure: Rs. 47,50,000</p><p>Savings: Rs. 2,50,000</p>`,
      questions: [
         { id: 1, text: "First line 'ANNUAL REPORT 2024' ko Center Align aur Bold karein", marks: 2 },
         { id: 2, text: "First line ka Font Size 16 pt karein", marks: 2 },
         { id: 3, text: "Second line ko Bold aur Italic karein", marks: 2 },
         { id: 4, text: "Number '95%' ko Highlight (Green) karein", marks: 2 },
         { id: 5, text: "Last three lines ko Bullet Points mein convert karein", marks: 2 },
         { id: 6, text: "Word 'REPORT' ka font color Blue karein", marks: 2 },
         { id: 7, text: "Poore document ka Font 'Calibri' karein", marks: 2 },
         { id: 8, text: "Watermark 'Confidential' add karein", marks: 2 },
         { id: 9, text: "Header mein company logo ke liye space reserve karein", marks: 2 },
         { id: 10, text: "Footer mein 'Page X of Y' format mein page number", marks: 2 },
      ]
   },
   '7': {
      title: "Test 7: Notice & Circular",
      content: `<p>NOTICE</p><p>Date: 15/January/2024</p><p>All employees are hereby informed that office timings have been revised.</p><p>New Timings: 9:00 AM to 5:30 PM</p><p>Effective from: 01/February/2024</p><p>Secretary</p><p>Administration Department</p>`,
      questions: [
         { id: 1, text: "'NOTICE' ko Center Align, Bold aur Underline karein", marks: 2 },
         { id: 2, text: "'NOTICE' ka Font Size 18 pt karein", marks: 2 },
         { id: 3, text: "Date line ko Right Align karein", marks: 2 },
         { id: 4, text: "'New Timings' line ko Bold aur Italic karein", marks: 2 },
         { id: 5, text: "Word 'revised' ko Highlight (Yellow) karein", marks: 2 },
         { id: 6, text: "Last two lines ko Right Align karein", marks: 2 },
         { id: 7, text: "Poore document ka Line Spacing 1.5 karein", marks: 2 },
         { id: 8, text: "Page Border (Double line) lagayein", marks: 2 },
         { id: 9, text: "Header mein 'Government of Rajasthan' likhein", marks: 2 },
         { id: 10, text: "Footer mein department contact details ke liye field", marks: 2 },
      ]
   },
   '8': {
      title: "Test 8: Technical Document",
      content: `<p>Technical Specifications Document</p><p>System Requirements: Windows 10 or above</p><p>RAM: Minimum 4GB (8GB recommended)</p><p>Storage: 500GB HDD or 256GB SSD</p><p>Software: MS Office 2016 or later</p><p>Network: Broadband connection required</p>`,
      questions: [
         { id: 1, text: "Title ko Center Align aur Bold karein", marks: 2 },
         { id: 2, text: "Title ka Font Size 14 pt aur color Dark Blue karein", marks: 2 },
         { id: 3, text: "All requirement lines ko Numbered List mein convert karein", marks: 2 },
         { id: 4, text: "'4GB' aur '8GB' ko Bold karein", marks: 2 },
         { id: 5, text: "Word 'recommended' ko Italic karein", marks: 2 },
         { id: 6, text: "Ek 2x5 table banayein requirements ke liye", marks: 2 },
         { id: 7, text: "Poore document ka Font 'Times New Roman' karein", marks: 2 },
         { id: 8, text: "Header mein 'Technical Documentation' likhein", marks: 2 },
         { id: 9, text: "Page Margin ko 'Narrow' set karein", marks: 2 },
         { id: 10, text: "Footer mein 'Version 1.0' aur date add karein", marks: 2 },
      ]
   },
   '9': {
      title: "Test 9: Meeting Minutes",
      content: `<p>ME

ETING MINUTES</p><p>Date: 10/Dec/2023 | Time: 10:00 AM | Venue: Conference Room</p><p>Attendees: Mr. Sharma, Ms. Patel, Dr. Kumar</p><p>Agenda: Discussion on quarterly targets and budget allocation</p><p>Decisions: Budget increased by 15% for next quarter</p><p>Action Items: Submit revised proposals by 20/Dec/2023</p>`,
      questions: [
         { id: 1, text: "'MEETING MINUTES' ko Center, Bold aur Underline karein", marks: 2 },
         { id: 2, text: "Second line mein '|' ke saath data ko table format mein arrange karein", marks: 2 },
         { id: 3, text: "All headings (Attendees, Agenda, etc.) ko Bold karein", marks: 2 },
         { id: 4, text: "'15%' ko Highlight (Green) karein", marks: 2 },
         { id: 5, text: "Names (Mr. Sharma, etc.) ko Italic karein", marks: 2 },
         { id: 6, text: "Date '20/Dec/2023' ko Bold aur Red color karein", marks: 2 },
         { id: 7, text: "Poore document ka Line Spacing Double (2.0) karein", marks: 2 },
         { id: 8, text: "Header mein organization name ke liye space", marks: 2 },
         { id: 9, text: "Footer mein 'Confidential - Internal Use Only' likhein", marks: 2 },
         { id: 10, text: "Page Border (3D effect) lagayein", marks: 2 },
      ]
   },
   '10': {
      title: "Test 10: Certificate Format",
      content: `<p>CERTIFICATE OF APPRECIATION</p><p>This is to certify that</p><p>Mr./Ms. [Name]</p><p>has successfully completed the Computer Proficiency Training Program</p><p>conducted by Rajasthan Skill Development Center</p><p>Date of Completion: ___________</p><p>Authorized Signature: ___________</p>`,
      questions: [
         { id: 1, text: "'CERTIFICATE OF APPRECIATION' ko Center, Bold karein", marks: 2 },
         { id: 2, text: "Title ka Font Size 20 pt aur color Dark Green karein", marks: 2 },
         { id: 3, text: "All text ko Center Align karein", marks: 2 },
         { id: 4, text: "'Mr./Ms. [Name]' ka Font Size 16 pt karein", marks: 2 },
         { id: 5, text: "Word 'successfully' ko Bold aur Italic karein", marks: 2 },
         { id: 6, text: "'Rajasthan Skill Development Center' ko Underline karein", marks: 2 },
         { id: 7, text: "Poore document ka Line Spacing 1.5 karein", marks: 2 },
         { id: 8, text: "Decorative Page Border (Art style) lagayein", marks: 2 },
         { id: 9, text: "Watermark 'Original' add karein", marks: 2 },
         { id: 10, text: "Footer mein certificate number field add karein", marks: 2 },
      ]
   },
};

const WordFormattingTest: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const lesson = WORD_DATA_SETS[id || '1'] || WORD_DATA_SETS['1'];
   const user = getUserProfile();

   const [timeLeft, setTimeLeft] = useState(600);
   const editorRef = useRef<HTMLDivElement>(null);
   const [content, setContent] = useState(lesson.content);

   useEffect(() => {
      setContent(lesson.content);
      setTimeLeft(600);
   }, [lesson]);

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

            <div className="bg-blue-600 text-white text-center py-1 font-bold text-sm">
               Formatting Tasks
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-2 bg-gray-100">
               {lesson.questions.map((q: any, i: number) => (
                  <div key={q.id} className="bg-white border-l-4 border-blue-500 p-2 shadow-sm text-xs">
                     <div className="flex justify-between font-bold mb-1">
                        <span className="text-blue-700">Q.{i + 1}</span>
                        <span>{q.marks} Marks</span>
                     </div>
                     <p className="text-gray-800 leading-snug">{q.text}</p>
                  </div>
               ))}
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