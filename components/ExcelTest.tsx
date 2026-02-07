import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';

import { useAuth } from '../context/AuthContext';
import { getAdminStore, hasTestAccess } from '../utils/adminStore';

const ExcelTest: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const user = getUserProfile(); // Local user (for name/avatar) - kept for display consistency

    // Fetch from Store
    const store = getAdminStore();
    const excelTests = store.cptTests.filter(t => t.type === 'Excel');
    const lesson = excelTests.find(t => t.id === Number(id)) || excelTests[0];

    // Fallback if no lesson found
    if (!lesson) {
        return <div className="p-10 text-center">Test not found.</div>;
    }

    const [timeLeft, setTimeLeft] = useState(600);
    // Initialize grid data from lesson data
    const [gridData, setGridData] = useState<any[]>([]);
    const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

    useEffect(() => {
        if (lesson?.data) {
            setGridData(lesson.data?.map((d: any) => ({ ...d, c: '', d: '' })) || []);
        }
    }, [lesson]);

    // Access Control
    useEffect(() => {
        if (lesson && !hasTestAccess(currentUser, lesson.id)) {
            alert("This test is locked. Please purchase a Combo Pack to access.");
            navigate('/cpt/excel');
        }
    }, [lesson, currentUser, navigate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        const mockScore = Math.floor(Math.random() * 20) + 30;
        const newResult: any = {
            id: Date.now().toString(),
            type: 'Excel',
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

    const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
        const newData = [...gridData];
        newData[rowIndex] = { ...newData[rowIndex], [colKey]: value };
        setGridData(newData);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

            {/* LEFT SIDEBAR - Candidate Details & Tasks */}
            <div className="w-80 bg-white border-r border-gray-300 flex flex-col shrink-0">
                <div className="bg-black text-white text-center py-1 font-bold text-sm">
                    Candidate Details
                </div>

                <div className="p-2 text-xs border-b border-gray-300 bg-gray-50">
                    <div className="flex gap-2 items-center">
                        <div className="w-12 h-12 bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
                            <img src={user.avatar} alt="Candidate" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-bold">{user.name}</div>
                            <div>Roll No: 123456</div>
                            <div className="text-gray-500">Exam: RSSB LDC</div>
                        </div>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="bg-blue-600 text-white text-center py-1 font-bold text-sm flex justify-between items-center px-4">
                    <span>Excel Tasks</span>
                    <button
                        onClick={() => setLanguage(prev => prev === 'English' ? 'Hindi' : 'English')}
                        className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded font-bold hover:bg-gray-100"
                    >
                        {language === 'English' ? 'हिंदी में देखें' : 'View in English'}
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-2 bg-gray-100">
                    {lesson.tasks?.map((task: any, i: number) => {
                        const taskText = (language === 'Hindi' && task.textHi) ? task.textHi : task.text;
                        return (
                            <div key={task.id} className="bg-white border-l-4 border-blue-500 p-2 shadow-sm text-xs">
                                <div className="flex justify-between font-bold mb-1">
                                    <span className="text-blue-700">Task {i + 1}</span>
                                    <span>{task.marks} Marks</span>
                                </div>
                                <p className="text-gray-800 leading-snug">{taskText.replace(/^Task \d+:\s*/, '')}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="flex-grow flex flex-col min-w-0">

                <div className="bg-yellow-500 text-center py-4 px-4 border-b-2 border-orange-600 relative shrink-0">
                    <h1 className="text-3xl font-serif font-bold text-black mb-1">Recruiting Department Name</h1>
                    <p className="text-black font-semibold uppercase tracking-wider">(Computer Proficiency Test)</p>

                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-bold shadow-sm text-sm">
                            Submit Test
                        </button>
                        <Link to="/cpt/excel" className="bg-white/20 hover:bg-white/40 p-1 rounded transition text-black">
                            <ArrowLeft size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-200 border-b border-gray-300 px-4 py-1 flex justify-between items-center text-blue-800 font-bold font-mono text-xl shrink-0">
                    <span></span>
                    <div className="flex items-center gap-2">
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-sans font-normal underline cursor-pointer">Skip Section</div>
                </div>

                <div className="flex-grow flex flex-col p-4 overflow-hidden">

                    <div className="mb-2 text-sm font-semibold text-gray-800 shrink-0">
                        {lesson.instructions}
                    </div>

                    <div className="flex-grow overflow-auto border border-gray-400 bg-white shadow-sm relative">
                        <table className="w-full border-collapse text-sm">
                            <thead className="sticky top-0 bg-gray-100 z-10">
                                <tr>
                                    <th className="w-10 border border-gray-400 bg-gray-200"></th>
                                    <th className="w-1/4 border border-gray-400 p-1 text-center font-normal">A</th>
                                    <th className="w-1/4 border border-gray-400 p-1 text-center font-normal">B</th>
                                    <th className="w-1/4 border border-gray-400 p-1 text-center font-normal">C</th>
                                    <th className="w-1/4 border border-gray-400 p-1 text-center font-normal">D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gridData.map((row, idx) => (
                                    <tr key={row.id}>
                                        <td className="border border-gray-300 bg-gray-100 text-center font-bold text-xs">{idx + 1}</td>
                                        <td className="border border-gray-300 px-2 py-0.5">{row.name}</td>
                                        <td className="border border-gray-300 px-2 py-0.5 text-right">{row.val1}</td>
                                        <td className="border border-gray-300 p-0">
                                            <input
                                                value={row.c}
                                                onChange={(e) => handleCellChange(idx, 'c', e.target.value)}
                                                className="w-full h-full px-2 py-0.5 outline-none focus:bg-blue-50"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-0">
                                            <input
                                                value={row.d}
                                                onChange={(e) => handleCellChange(idx, 'd', e.target.value)}
                                                className="w-full h-full px-2 py-0.5 outline-none focus:bg-blue-50"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={`chk-${i}`}>
                                        <td className="border border-gray-300 bg-gray-100 text-center font-bold text-xs">{gridData.length + i + 1}</td>
                                        <td className="border border-gray-300"></td>
                                        <td className="border border-gray-300"></td>
                                        <td className="border border-gray-300"></td>
                                        <td className="border border-gray-300"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ExcelTest;
