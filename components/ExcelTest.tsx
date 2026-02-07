import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/userData';

// Mock Data Sets - 10 Varied Tests
const DATA_SETS: Record<string, any> = {
    '1': {
        title: "Test 1: Department Budget Analysis",
        instructions: "Complete all 10 tasks: Enter data in columns C & D, and type formulas in the specified colored cells",
        data: [
            { id: 1, name: "Department", val1: "Budget (Lakhs)", val2: "" },
            { id: 2, name: "Education", val1: "450", val2: "" },
            { id: 3, name: "Health", val1: "320", val2: "" },
            { id: 4, name: "Transport", val1: "280", val2: "" },
            { id: 5, name: "Agriculture", val1: "195", val2: "" },
            { id: 6, name: "Defense", val1: "510", val2: "" },
            { id: 7, name: "Infrastructure", val1: "375", val2: "" },
            { id: 8, name: "Social Welfare", val1: "225", val2: "" },
            { id: 9, name: "IT & Telecom", val1: "165", val2: "" },
            { id: 10, name: "Sports", val1: "80", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Copy column A data to column C", marks: 2 },
            { id: 2, text: "Task 2: Copy column B data to column D", marks: 2 },
            { id: 3, text: "Task 3: Calculate TOTAL budget using SUM formula in D11", marks: 2 },
            { id: 4, text: "Task 4: Calculate AVERAGE budget using AVERAGE formula in D12", marks: 2 },
            { id: 5, text: "Task 5: Calculate MAX budget using MAX formula in D13", marks: 2 },
            { id: 6, text: "Task 6: Calculate MIN budget using MIN formula in D14", marks: 2 },
            { id: 7, text: "Task 7: COUNT departments using COUNT formula in D15", marks: 2 },
            { id: 8, text: "Task 8: Calculate Education percentage: (D2/D11)*100 in E2", marks: 2 },
            { id: 9, text: "Task 9: Apply BOLD formatting to row 1 (headers)", marks: 2 },
            { id: 10, text: "Task 10: Apply CENTER alignment to column headers", marks: 2 },
        ]
    },
    '2': {
        title: "Test 2: Sales Data Analysis",
        instructions: "Complete all tasks: Copy data to C & D columns and apply formulas for sales calculations",
        data: [
            { id: 1, name: "Product", val1: "Sales (Units)", val2: "" },
            { id: 2, name: "Laptop", val1: "125", val2: "" },
            { id: 3, name: "Desktop", val1: "89", val2: "" },
            { id: 4, name: "Printer", val1: "234", val2: "" },
            { id: 5, name: "Scanner", val1: "67", val2: "" },
            { id: 6, name: "Tablet", val1: "312", val2: "" },
            { id: 7, name: "Mobile", val1: "567", val2: "" },
            { id: 8, name: "Keyboard", val1: "445", val2: "" },
            { id: 9, name: "Mouse", val1: "398", val2: "" },
            { id: 10, name: "Monitor", val1: "156", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Type column A (Product names) into column C", marks: 2 },
            { id: 2, text: "Task 2: Type column B (Sales Units) into column D", marks: 2 },
            { id: 3, text: "Task 3: Total sales: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average sales: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Highest sales: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Lowest sales: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Product count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Mobile percentage: =(D7/D11)*100 in E7", marks: 2 },
            { id: 9, text: "Task 9: Bold formatting for header row", marks: 2 },
            { id: 10, text: "Task 10: Right align all numerical data", marks: 2 },
        ]
    },
    '3': {
        title: "Test 3: Student Marks Sheet",
        instructions: "Enter student data and calculate statistics using Excel formulas",
        data: [
            { id: 1, name: "Student Name", val1: "Marks (out of 100)", val2: "" },
            { id: 2, name: "Rahul", val1: "85", val2: "" },
            { id: 3, name: "Priya", val1: "92", val2: "" },
            { id: 4, name: "Amit", val1: "78", val2: "" },
            { id: 5, name: "Sneha", val1: "88", val2: "" },
            { id: 6, name: "Vikram", val1: "95", val2: "" },
            { id: 7, name: "Meera", val1: "81", val2: "" },
            { id: 8, name: "Arjun", val1: "73", val2: "" },
            { id: 9, name: "Kavita", val1: "90", val2: "" },
            { id: 10, name: "Rohan", val1: "87", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Copy student names to column C", marks: 2 },
            { id: 2, text: "Task 2: Copy marks to column D", marks: 2 },
            { id: 3, text: "Task 3: Total marks: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Class average: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Highest marks: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Lowest marks: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Student count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Vikram's percentage: =(D6/100)*100 in E6", marks: 2 },
            { id: 9, text: "Task 9: Bold and color header row (light blue)", marks: 2 },
            { id: 10, text: "Task 10: Add borders to all filled cells", marks: 2 },
        ]
    },
    '4': {
        title: "Test 4: Employee Salary Report",
        instructions: "Type employee data and calculate salary statistics",
        data: [
            { id: 1, name: "Employee", val1: "Salary (₹)", val2: "" },
            { id: 2, name: "Rajesh Kumar", val1: "45000", val2: "" },
            { id: 3, name: "Sunita Sharma", val1: "52000", val2: "" },
            { id: 4, name: "Anil Verma", val1: "38000", val2: "" },
            { id: 5, name: "Pooja Singh", val1: "48000", val2: "" },
            { id: 6, name: "Manoj Gupta", val1: "55000", val2: "" },
            { id: 7, name: "Ritu Patel", val1: "42000", val2: "" },
            { id: 8, name: "Deepak Yadav", val1: "39000", val2: "" },
            { id: 9, name: "Neha Jain", val1: "51000", val2: "" },
            { id: 10, name: "Suresh Meena", val1: "46000", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Enter employee names in column C", marks: 2 },
            { id: 2, text: "Task 2: Enter salary data in column D", marks: 2 },
            { id: 3, text: "Task 3: Total payroll: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average salary: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Maximum salary: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Minimum salary: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Employee count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Manoj's salary %: =(D6/D11)*100 in E6", marks: 2 },
            { id: 9, text: "Task 9: Apply currency format (₹) to all salary cells", marks: 2 },
            { id: 10, text: "Task 10: Center align headers and bold them", marks: 2 },
        ]
    },
    '5': {
        title: "Test 5: Monthly Expenses Tracker",
        instructions: "Record expense data and calculate monthly statistics",
        data: [
            { id: 1, name: "Expense Type", val1: "Amount (₹)", val2: "" },
            { id: 2, name: "Rent", val1: "12000", val2: "" },
            { id: 3, name: "Groceries", val1: "5500", val2: "" },
            { id: 4, name: "Electricity", val1: "1800", val2: "" },
            { id: 5, name: "Water", val1: "600", val2: "" },
            { id: 6, name: "Internet", val1: "899", val2: "" },
            { id: 7, name: "Transportation", val1: "3200", val2: "" },
            { id: 8, name: "Entertainment", val1: "2500", val2: "" },
            { id: 9, name: "Medical", val1: "1500", val2: "" },
            { id: 10, name: "Miscellaneous", val1: "2000", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Type expense categories in column C", marks: 2 },
            { id: 2, text: "Task 2: Type amounts in column D", marks: 2 },
            { id: 3, text: "Task 3: Total expenses: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average expense: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Highest expense: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Lowest expense: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Expense items: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Rent percentage: =(D2/D11)*100 in E2", marks: 2 },
            { id: 9, text: "Task 9: Highlight highest expense in yellow", marks: 2 },
            { id: 10, text: "Task 10: Apply number formatting with comma separator", marks: 2 },
        ]
    },
    '6': {
        title: "Test 6: Inventory Stock Report",
        instructions: "Manage inventory data with formula calculations",
        data: [
            { id: 1, name: "Item Name", val1: "Quantity", val2: "" },
            { id: 2, name: "Notebooks", val1: "450", val2: "" },
            { id: 3, name: "Pens", val1: "1200", val2: "" },
            { id: 4, name: "Pencils", val1: "800", val2: "" },
            { id: 5, name: "Erasers", val1: "600", val2: "" },
            { id: 6, name: "Rulers", val1: "350", val2: "" },
            { id: 7, name: "Markers", val1: "275", val2: "" },
            { id: 8, name: "Files", val1: "520", val2: "" },
            { id: 9, name: "Staplers", val1: "180", val2: "" },
            { id: 10, name: "Clips", val1: "950", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Copy item names to column C", marks: 2 },
            { id: 2, text: "Task 2: Copy quantities to column D", marks: 2 },
            { id: 3, text: "Task 3: Total stock: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average quantity: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Maximum stock: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Minimum stock: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Item count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Pens percentage: =(D3/D11)*100 in E3", marks: 2 },
            { id: 9, text: "Task 9: Add alternating row colors (light grey)", marks: 2 },
            { id: 10, text: "Task 10: Freeze header row for scrolling", marks: 2 },
        ]
    },
    '7': {
        title: "Test 7: Exam Results Summary",
        instructions: "Calculate exam statistics and subject-wise analysis",
        data: [
            { id: 1, name: "Subject", val1: "Total Marks", val2: "" },
            { id: 2, name: "Hindi", val1: "87", val2: "" },
            { id: 3, name: "English", val1: "92", val2: "" },
            { id: 4, name: "Mathematics", val1: "78", val2: "" },
            { id: 5, name: "Science", val1: "85", val2: "" },
            { id: 6, name: "Social Studies", val1: "90", val2: "" },
            { id: 7, name: "Computer", val1: "95", val2: "" },
            { id: 8, name: "Physical Education", val1: "88", val2: "" },
            { id: 9, name: "Drawing", val1: "82", val2: "" },
            { id: 10, name: "Music", val1: "80", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Enter subject names in column C", marks: 2 },
            { id: 2, text: "Task 2: Enter marks in column D", marks: 2 },
            { id: 3, text: "Task 3: Total marks: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average marks: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Best subject: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Weakest subject: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Subject count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Computer %: =(D7/900)*100 in E7", marks: 2 },
            { id: 9, text: "Task 9: Color code: Green if >85, Red if <80", marks: 2 },
            { id: 10, text: "Task 10: Add chart title 'Academic Performance'", marks: 2 },
        ]
    },
    '8': {
        title: "Test 8: Project Timeline Budget",
        instructions: "Track project phases and calculate budget allocations",
        data: [
            { id: 1, name: "Project Phase", val1: "Budget (Lakhs)", val2: "" },
            { id: 2, name: "Planning", val1: "15", val2: "" },
            { id: 3, name: "Design", val1: "25", val2: "" },
            { id: 4, name: "Development", val1: "80", val2: "" },
            { id: 5, name: "Testing", val1: "35", val2: "" },
            { id: 6, name: "Deployment", val1: "20", val2: "" },
            { id: 7, name: "Training", val1: "12", val2: "" },
            { id: 8, name: "Documentation", val1: "8", val2: "" },
            { id: 9, name: "Support", val1: "18", val2: "" },
            { id: 10, name: "Maintenance", val1: "22", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Type project phases in column C", marks: 2 },
            { id: 2, text: "Task 2: Type budget values in column D", marks: 2 },
            { id: 3, text: "Task 3: Total project cost: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average phase cost: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Costliest phase: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Cheapest phase: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Phase count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Development %: =(D4/D11)*100 in E4", marks: 2 },
            { id: 9, text: "Task 9: Merge cells A1:B1 for title", marks: 2 },
            { id: 10, text: "Task 10: Apply table format with borders", marks: 2 },
        ]
    },
    '9': {
        title: "Test 9: Population Census Data",
        instructions: "Analyze district-wise population statistics",
        data: [
            { id: 1, name: "District", val1: "Population (Lakhs)", val2: "" },
            { id: 2, name: "Jaipur", val1: "66.26", val2: "" },
            { id: 3, name: "Jodhpur", val1: "36.87", val2: "" },
            { id: 4, name: "Udaipur", val1: "30.68", val2: "" },
            { id: 5, name: "Kota", val1: "19.51", val2: "" },
            { id: 6, name: "Bikaner", val1: "23.64", val2: "" },
            { id: 7, name: "Ajmer", val1: "25.84", val2: "" },
            { id: 8, name: "Alwar", val1: "36.74", val2: "" },
            { id: 9, name: "Bharatpur", val1: "25.49", val2: "" },
            { id: 10, name: "Sikar", val1: "26.77", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Copy district names to column C", marks: 2 },
            { id: 2, text: "Task 2: Copy population data to column D", marks: 2 },
            { id: 3, text: "Task 3: Total population: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average population: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Most populated: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Least populated: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: District count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Jaipur percentage: =(D2/D11)*100 in E2", marks: 2 },
            { id: 9, text: "Task 9: Sort data by population (descending)", marks: 2 },
            { id: 10, text: "Task 10: Add decimal formatting (2 places)", marks: 2 },
        ]
    },
    '10': {
        title: "Test 10: Quarterly Sales Target",
        instructions: "Calculate quarterly performance and target achievement",
        data: [
            { id: 1, name: "Quarter", val1: "Sales (Crores)", val2: "" },
            { id: 2, name: "Q1-2024", val1: "45.5", val2: "" },
            { id: 3, name: "Q2-2024", val1: "52.3", val2: "" },
            { id: 4, name: "Q3-2024", val1: "48.7", val2: "" },
            { id: 5, name: "Q4-2024", val1: "61.2", val2: "" },
            { id: 6, name: "Q1-2025", val1: "55.8", val2: "" },
            { id: 7, name: "Q2-2025", val1: "58.9", val2: "" },
            { id: 8, name: "Q3-2025", val1: "63.4", val2: "" },
            { id: 9, name: "Q4-2025", val1: "70.1", val2: "" },
            { id: 10, name: "Q1-2026", val1: "67.5", val2: "" },
        ],
        tasks: [
            { id: 1, text: "Task 1: Enter quarter names in column C", marks: 2 },
            { id: 2, text: "Task 2: Enter sales figures in column D", marks: 2 },
            { id: 3, text: "Task 3: Total sales: =SUM(D2:D10) in D11", marks: 2 },
            { id: 4, text: "Task 4: Average quarterly sales: =AVERAGE(D2:D10) in D12", marks: 2 },
            { id: 5, text: "Task 5: Peak sales: =MAX(D2:D10) in D13", marks: 2 },
            { id: 6, text: "Task 6: Lowest sales: =MIN(D2:D10) in D14", marks: 2 },
            { id: 7, text: "Task 7: Quarter count: =COUNT(D2:D10) in D15", marks: 2 },
            { id: 8, text: "Task 8: Q4-2025 share: =(D9/D11)*100 in E9", marks: 2 },
            { id: 9, text: "Task 9: Apply gradient fill to headers", marks: 2 },
            { id: 10, text: "Task 10: Insert column chart for visualization", marks: 2 },
        ]
    },
};

const ExcelTest: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const lesson = DATA_SETS[id || '1'] || DATA_SETS['1'];
    const user = getUserProfile();

    const [timeLeft, setTimeLeft] = useState(600);
    const [gridData, setGridData] = useState<any[]>(lesson.data.map((d: any) => ({ ...d, c: '', d: '' })));

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
                <div className="bg-blue-600 text-white text-center py-1 font-bold text-sm">
                    Excel Tasks
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-2 bg-gray-100">
                    {lesson.tasks?.map((task: any, i: number) => (
                        <div key={task.id} className="bg-white border-l-4 border-blue-500 p-2 shadow-sm text-xs">
                            <div className="flex justify-between font-bold mb-1">
                                <span className="text-blue-700">Task {i + 1}</span>
                                <span>{task.marks} Marks</span>
                            </div>
                            <p className="text-gray-800 leading-snug">{task.text.replace(/^Task \d+:\s*/, '')}</p>
                        </div>
                    ))}
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
