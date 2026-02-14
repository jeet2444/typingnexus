import React from 'react';
import { User, Bell } from 'lucide-react';

interface ExamLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  timeLeft: string;
}

const ExamLayout: React.FC<ExamLayoutProps> = ({ title, subtitle, children, timeLeft }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col font-sans text-sm">
      <div className="flex flex-grow h-screen overflow-hidden">
        
        {/* Left Sidebar - Candidate Details */}
        <div className="w-64 bg-white border-r-2 border-gray-400 flex flex-col flex-shrink-0">
          <div className="bg-black text-white py-1 px-2 font-bold text-center border-b border-white">
            Candidate Details
          </div>
          
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="bg-gray-100 p-1 font-bold border-r border-gray-300">Roll No.</td>
                <td className="p-1 text-right">240105</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-gray-100 p-1 font-bold border-r border-gray-300">Name</td>
                <td className="p-1 text-right">Demo User</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-gray-100 p-1 font-bold border-r border-gray-300">Exam Time</td>
                <td className="p-1 text-right">10:00 AM</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-gray-100 p-1 font-bold border-r border-gray-300">Date</td>
                <td className="p-1 text-right">{new Date().toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-black text-white py-1 px-2 font-bold text-center mt-1">
            Candidate Photo
          </div>
          <div className="p-4 flex justify-center border-b-2 border-gray-400 bg-white">
            <div className="w-24 h-24 bg-gray-200 rounded-full border border-gray-400 flex items-center justify-center overflow-hidden">
               <User size={60} className="text-gray-400" />
            </div>
          </div>

          <div className="bg-black text-white py-1 px-2 font-bold text-center mt-auto">
            Section Details
          </div>
          <table className="w-full text-xs border-collapse mb-4">
             <thead className="bg-gray-100">
                <tr>
                   <th className="border border-gray-300 p-1 text-left">Section</th>
                   <th className="border border-gray-300 p-1 text-right">Status</th>
                </tr>
             </thead>
             <tbody>
                <tr>
                   <td className="border border-gray-300 p-1">Skill Test</td>
                   <td className="border border-gray-300 p-1 text-right text-green-600 font-bold">Active</td>
                </tr>
             </tbody>
          </table>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col h-full overflow-hidden">
           
           {/* Top Yellow Header */}
           <div className="bg-[#ffc107] p-2 flex justify-between items-center border-b-2 border-gray-400 shadow-sm relative z-10 h-24">
              <div className="flex-grow text-center">
                 <h1 className="text-2xl font-bold font-serif text-black">{title}</h1>
                 {subtitle && <p className="text-sm font-medium mt-1">({subtitle})</p>}
              </div>
              
              <div className="absolute right-4 top-4">
                 <div className="bg-white border-2 border-gray-400 p-2 rounded shadow-sm">
                    <Bell className="text-yellow-600 animate-pulse" size={24} />
                 </div>
              </div>
           </div>

           {/* Timer Strip */}
           <div className="bg-[#e0e0e0] border-b border-gray-400 px-4 py-1 flex justify-end items-center">
              <div className="bg-blue-100 border border-blue-300 px-3 py-1 rounded text-xl font-bold font-mono text-blue-800">
                 {timeLeft}
              </div>
              <button className="ml-4 bg-gray-300 text-gray-600 px-3 py-1 border border-gray-400 text-xs rounded shadow-sm cursor-not-allowed">
                 Skip Section
              </button>
           </div>

           {/* Workspace */}
           <div className="flex-grow overflow-auto bg-gray-200 p-2">
              {children}
           </div>

           {/* Footer Strip */}
           <div className="bg-[#ffc107] text-black text-xs font-bold py-1 px-4 text-center border-t border-gray-400">
              To get full version call us at : 7424910327 anytime(24x7) or visit our website
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExamLayout;