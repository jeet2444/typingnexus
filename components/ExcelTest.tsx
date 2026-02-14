import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, DollarSign, Percent, Lock, Unlock } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';
import { useAuth } from '../context/AuthContext';
import { getAdminStore, hasTestAccess } from '../utils/adminStore';

const ExcelTest: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, hasPremiumAccess } = useAuth();
    const user = getUserProfile();

    const store = getAdminStore();
    const excelTests = store.cptTests.filter(t => t.type === 'Excel');
    const lesson = excelTests.find(t => t.id === Number(id)) || excelTests[0];

    if (!lesson) {
        return <div className="p-10 text-center text-white">Test not found.</div>;
    }

    const isTrial = !hasPremiumAccess;
    const [timeLeft, setTimeLeft] = useState(isTrial ? 20 : 600); // 20s Trial vs 10m Full
    const [isPaused, setIsPaused] = useState(false);

    const [gridData, setGridData] = useState<any[]>([]);
    const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: string } | null>(null);
    const [formulaBarValue, setFormulaBarValue] = useState('');
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        if (lesson?.data) {
            // Initialize with 20 rows (10 data + 10 for formulas)
            const initialData = lesson.data.map((d: any, idx: number) => ({
                ...d,
                c: '',
                d: '',
                e: '',
                rowNum: idx + 1
            }));
            // Add extra rows for formula results
            for (let i = initialData.length; i < 20; i++) {
                initialData.push({ id: i + 1, name: '', val1: '', c: '', d: '', e: '', rowNum: i + 1 });
            }
            setGridData(initialData);
        }
    }, [lesson]);

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        if (isTrial) return;

        const mockScore = Math.floor(Math.random() * 20) + 30;
        const newResult = {
            id: Date.now().toString(),
            type: 'Excel' as const,
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

    const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
        const newData = [...gridData];
        if (!newData[rowIndex]) {
            newData[rowIndex] = { id: rowIndex + 1, name: '', val1: '', c: '', d: '', e: '' };
        }
        newData[rowIndex] = { ...newData[rowIndex], [colKey]: value };
        setGridData(newData);
    };

    // Recursive formula evaluator
    const evaluateFormula = (formula: string, depth = 0): string | number => {
        if (!formula || !formula.startsWith('=')) return formula;
        if (depth > 10) return "#CIRC!"; // Prevent infinite recursion

        const expression = formula.substring(1).toUpperCase();

        try {
            // 1. Resolve Range References (e.g., A1:A5) for Functions
            // This simple regex looks for FUNCTION(RANGE) pattern
            const funcRegex = /(SUM|AVERAGE|MIN|MAX|COUNT)\(([A-E][0-9]+):([A-E][0-9]+)\)/g;

            const resolvedExpression = expression.replace(funcRegex, (match, func, startRef, endRef) => {
                const startCol = startRef.charAt(0);
                const startRow = parseInt(startRef.substring(1)) - 1;
                const endCol = endRef.charAt(0);
                const endRow = parseInt(endRef.substring(1)) - 1;

                const values: number[] = [];

                // Iterate through range
                for (let r = startRow; r <= endRow; r++) {
                    // Simple column mapping for this specific test grid (A=name, B=val1, C=c, D=d, E=e)
                    // Note: 'A' is usually Name/String, so we skip or handle as 0
                    const cols = ['A', 'B', 'C', 'D', 'E'];
                    const startColIdx = cols.indexOf(startCol);
                    const endColIdx = cols.indexOf(endCol);

                    for (let c = startColIdx; c <= endColIdx; c++) {
                        const colKey = ['name', 'val1', 'c', 'd', 'e'][c];
                        const cellVal = gridData[r]?.[colKey];

                        let numVal = 0;
                        if (cellVal && typeof cellVal === 'string' && cellVal.startsWith('=')) {
                            const res = evaluateFormula(cellVal, depth + 1);
                            numVal = Number(res) || 0;
                        } else {
                            numVal = Number(cellVal) || 0;
                        }
                        values.push(numVal);
                    }
                }

                if (func === 'SUM') return values.reduce((a, b) => a + b, 0).toString();
                if (func === 'AVERAGE') return (values.reduce((a, b) => a + b, 0) / values.length).toString();
                if (func === 'MAX') return Math.max(...values).toString();
                if (func === 'MIN') return Math.min(...values).toString();
                if (func === 'COUNT') return values.length.toString();
                return "0";
            });

            // 2. Resolve Individual Cell References (e.g., A1, B2)
            // Regex to find cell refs like A1, B10, E5 within the expression
            const cellRegex = /([A-E])([0-9]+)/g;
            const fullyResolved = resolvedExpression.replace(cellRegex, (match, col, rowNum) => {
                // If it looks like a function name part (e.g. A1 in A1:B1 handled above, but checks just in case)
                const rowIndex = parseInt(rowNum) - 1;
                const colKey = { 'A': 'name', 'B': 'val1', 'C': 'c', 'D': 'd', 'E': 'e' }[col] || 'val1';

                const cellVal = gridData[rowIndex]?.[colKey];
                if (cellVal && typeof cellVal === 'string' && cellVal.startsWith('=')) {
                    const res = evaluateFormula(cellVal, depth + 1);
                    return String(Number(res) || 0);
                }
                return String(Number(cellVal) || 0);
            });

            // 3. Evaluate Math Expression
            // Verify only safe characters are used
            if (!/^[0-9+\-*/().\s]+$/.test(fullyResolved)) {
                return "#ERR";
            }

            // eslint-disable-next-line no-eval
            return eval(fullyResolved);

        } catch (e) {
            return "#ERROR";
        }
    };

    const getDisplayValue = (row: any, col: string) => {
        const val = row[col];
        if (activeTab === 'Formulas') return val; // Show formula
        return evaluateFormula(val);
    };

    const getCellRef = (r: number, c: string) => `${c.toUpperCase()}${r + 1}`;

    return (
        <>
            <div className="h-screen flex flex-col bg-gray-100 font-sans text-xs">
                {/* Header */}
                <div className="bg-[#217346] text-white p-2 flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/cpt/excel')} className="hover:bg-green-700 p-1 rounded">
                            <ArrowLeft size={16} />
                        </button>
                        <div className="flex items-baseline gap-2">
                            <h1 className="font-bold text-lg">Excel Test - {lesson.title}</h1>
                            {isTrial && <span className="text-[10px] bg-yellow-400 text-black px-1 rounded font-bold">TRIAL MODE</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-300 animate-pulse' : ''}`}>
                            {formatTime(timeLeft)}
                        </div>
                        {!isTrial && (
                            <button onClick={handleSubmit} className="bg-white text-green-800 px-4 py-1 rounded font-bold hover:bg-gray-100 shadow">
                                Submit Test
                            </button>
                        )}
                    </div>
                </div>

                {/* Toolbar (Ribbon) */}
                <div className="bg-white border-b border-gray-300 flex flex-col">
                    <div className="flex border-b border-gray-200">
                        {['Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 ${activeTab === tab ? 'text-[#217346] border-b-2 border-[#217346] font-bold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 flex gap-4 items-center h-10 overflow-hidden">
                        <div className="flex gap-1 border-r border-gray-300 pr-2">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><Bold size={14} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><Italic size={14} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><Underline size={14} /></button>
                        </div>
                        <div className="flex gap-1 border-r border-gray-300 pr-2">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><AlignLeft size={14} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><AlignCenter size={14} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><AlignRight size={14} /></button>
                        </div>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><DollarSign size={14} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-700"><Percent size={14} /></button>
                        </div>
                    </div>
                </div>

                {/* Formula Bar */}
                <div className="flex items-center gap-2 p-1 bg-gray-50 border-b border-gray-300">
                    <div className="w-10 text-center font-bold text-gray-500 border-r border-gray-300">
                        {selectedCell ? getCellRef(selectedCell.row, selectedCell.col) : ''}
                    </div>
                    <div className="text-gray-400 px-2 italic">fx</div>
                    <input
                        className="flex-1 outline-none bg-transparent"
                        value={formulaBarValue}
                        onChange={(e) => {
                            setFormulaBarValue(e.target.value);
                            if (selectedCell) handleCellChange(selectedCell.row, selectedCell.col, e.target.value);
                        }}
                    />
                </div>

                {/* Grid Area */}
                <div className="flex-1 overflow-auto bg-gray-200 p-4 flex gap-4">
                    {/* Instructions Panel */}
                    <div className="w-1/3 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                        <div className="bg-gray-100 p-2 border-b font-bold text-gray-700 flex justify-between">
                            <span>Instructions</span>
                            <button className="text-blue-600 text-[10px]" onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}>
                                Switch to {language === 'English' ? 'Hindi' : 'English'}
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 text-sm text-gray-800 space-y-4">
                            {lesson.tasks?.map((task: any, idx: number) => (
                                <div key={idx} className="flex gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                                    <span className="font-bold text-[#217346]">{idx + 1}.</span>
                                    <p>{language === 'English' ? task.text : (task.textHi || task.text)}</p>
                                    <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">({task.marks} Marks)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spreadsheet */}
                    <div className="flex-1 bg-white shadow-lg overflow-auto relative">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="w-10 border border-gray-300"></th>
                                    <th className="border border-gray-300 px-4 py-1 text-gray-600 font-bold w-40">A (Name)</th>
                                    <th className="border border-gray-300 px-4 py-1 text-gray-600 font-bold w-32">B (Value)</th>
                                    <th className="border border-gray-300 px-4 py-1 text-gray-600 font-bold w-32">C</th>
                                    <th className="border border-gray-300 px-4 py-1 text-gray-600 font-bold w-32">D</th>
                                    <th className="border border-gray-300 px-4 py-1 text-gray-600 font-bold w-32">E</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gridData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50">
                                        <td className="border border-gray-300 bg-gray-100 text-center font-bold text-xs text-gray-600 p-1">{idx + 1}</td>
                                        <td className="border border-gray-300 px-2 py-1 bg-gray-50 text-gray-800">{row.name}</td>
                                        <td className="border border-gray-300 px-2 py-1 bg-gray-50 text-right text-gray-800">{row.val1}</td>
                                        <td className={`border border-gray-300 p-0 ${selectedCell?.row === idx && selectedCell?.col === 'c' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-green-50'}`}>
                                            <input
                                                value={row.c || ''}
                                                onChange={(e) => handleCellChange(idx, 'c', e.target.value)}
                                                onFocus={() => { setSelectedCell({ row: idx, col: 'c' }); setFormulaBarValue(row.c || ''); }}
                                                className="w-full h-full px-2 py-1 outline-none bg-transparent"
                                            />
                                        </td>
                                        <td className={`border border-gray-300 p-0 ${selectedCell?.row === idx && selectedCell?.col === 'd' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-green-50'}`}>
                                            <input
                                                value={getDisplayValue(row, 'd')}
                                                onChange={(e) => handleCellChange(idx, 'd', e.target.value)}
                                                onFocus={() => { setSelectedCell({ row: idx, col: 'd' }); setFormulaBarValue(row.d || ''); }}
                                                className="w-full h-full px-2 py-1 outline-none bg-transparent text-right font-mono"
                                            />
                                        </td>
                                        <td className={`border border-gray-300 p-0 ${selectedCell?.row === idx && selectedCell?.col === 'e' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-yellow-50'}`}>
                                            <input
                                                value={getDisplayValue(row, 'e')}
                                                onChange={(e) => handleCellChange(idx, 'e', e.target.value)}
                                                onFocus={() => { setSelectedCell({ row: idx, col: 'e' }); setFormulaBarValue(row.e || ''); }}
                                                className="w-full h-full px-2 py-1 outline-none bg-transparent text-right"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Status Bar */}
                    <div className="bg-[#217346] text-white px-4 py-1 text-xs flex justify-between items-center shrink-0">
                        <div className="flex gap-4">
                            <span>Ready</span>
                            <span>|</span>
                            <span>Sheet 1</span>
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
                            <button onClick={() => navigate('/cpt/excel')} className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 transition-all">
                                Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExcelTest;
