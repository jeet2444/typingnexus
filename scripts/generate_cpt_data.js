// Script to generate 50 Excel and 50 Word CPT tests
import fs from 'fs';

// Excel test topics with Indian context
const EXCEL_TOPICS = [
    { name: 'Department Budget', data: ['Education', 'Health', 'Transport', 'Agriculture', 'Defense', 'Infrastructure', 'Social Welfare', 'IT', 'Sports', 'Tourism'], values: [450, 320, 280, 195, 510, 375, 225, 165, 80, 135] },
    { name: 'Sales Data', data: ['Laptop', 'Desktop', 'Printer', 'Scanner', 'Tablet', 'Mobile', 'Keyboard', 'Mouse', 'Monitor', 'Headphones'], values: [125, 89, 234, 67, 312, 567, 445, 398, 156, 223] },
    { name: 'Student Marks', data: ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Meera', 'Arjun', 'Kavita', 'Rohan', 'Anita'], values: [85, 92, 78, 88, 95, 81, 73, 90, 87, 79] },
    { name: 'Employee Salary', data: ['Rajesh Kumar', 'Sunita Sharma', 'Anil Verma', 'Pooja Singh', 'Manoj Gupta', 'Ritu Patel', 'Deepak Yadav', 'Neha Jain', 'Suresh Meena', 'Kiran Das'], values: [45000, 52000, 38000, 48000, 55000, 42000, 39000, 51000, 46000, 44000] },
    { name: 'Monthly Expenses', data: ['Rent', 'Groceries', 'Electricity', 'Water', 'Internet', 'Transportation', 'Entertainment', 'Medical', 'Education', 'Miscellaneous'], values: [12000, 5500, 1800, 600, 899, 3200, 2500, 1500, 4000, 2000] },
    { name: 'Inventory Stock', data: ['Notebooks', 'Pens', 'Pencils', 'Erasers', 'Rulers', 'Markers', 'Files', 'Staplers', 'Clips', 'Folders'], values: [450, 1200, 800, 600, 350, 275, 520, 180, 950, 420] },
    { name: 'Exam Results', data: ['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Physical Education', 'Drawing', 'Music', 'Sanskrit'], values: [87, 92, 78, 85, 90, 95, 88, 82, 80, 75] },
    { name: 'Project Budget', data: ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Training', 'Documentation', 'Support', 'Maintenance', 'Marketing'], values: [15, 25, 80, 35, 20, 12, 8, 18, 22, 30] },
    { name: 'Population Data', data: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bharatpur', 'Sikar', 'Pali'], values: [66.26, 36.87, 30.68, 19.51, 23.64, 25.84, 36.74, 25.49, 26.77, 20.31] },
    { name: 'Quarterly Sales', data: ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024', 'Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026'], values: [45.5, 52.3, 48.7, 61.2, 55.8, 58.9, 63.4, 70.1, 67.5, 72.3] },
];

// More topics for variety
const MORE_TOPICS = [
    { name: 'Crop Production', data: ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Bajra', 'Jowar', 'Groundnut', 'Mustard', 'Soybean'], values: [1250, 980, 1560, 670, 890, 450, 380, 520, 680, 590] },
    { name: 'Bank Deposits', data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'], values: [250000, 180000, 320000, 290000, 210000, 340000, 280000, 310000, 270000, 350000] },
    { name: 'Hospital Patients', data: ['OPD', 'Emergency', 'Surgery', 'Pediatrics', 'Orthopedics', 'Cardiology', 'Neurology', 'Dermatology', 'ENT', 'Ophthalmology'], values: [1250, 380, 145, 420, 280, 190, 120, 350, 210, 180] },
    { name: 'School Enrollment', data: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], values: [120, 115, 108, 102, 98, 95, 90, 88, 82, 78] },
    { name: 'Vehicle Registration', data: ['Two Wheeler', 'Car', 'Auto', 'Bus', 'Truck', 'Tractor', 'E-Rickshaw', 'Taxi', 'Ambulance', 'Government'], values: [4500, 1200, 890, 120, 340, 560, 780, 230, 45, 180] },
];

// Generate 50 Excel tests
let excelTests = [];
let testId = 1;
const allTopics = [...EXCEL_TOPICS, ...MORE_TOPICS];

for (let i = 0; i < 50; i++) {
    const topic = allTopics[i % allTopics.length];
    const lang = i < 17 ? 'English' : i < 34 ? 'Hindi' : 'Bilingual';
    const isFree = i < 3;

    excelTests.push({
        id: testId++,
        title: `Test ${i + 1}: ${topic.name} Analysis`,
        type: 'Excel',
        language: lang,
        isFree: isFree,
        instructions: lang === 'Hindi'
            ? `सभी 10 कार्य पूर्ण करें: कॉलम C & D में डेटा दर्ज करें और निर्दिष्ट सेल में फॉर्मूला टाइप करें`
            : `Complete all 10 tasks: Enter data in columns C & D, and type formulas in the specified cells`,
        data: topic.data.map((name, idx) => ({
            id: idx + 1,
            name: idx === 0 ? (lang === 'Hindi' ? 'नाम' : 'Name') : name,
            val1: idx === 0 ? (lang === 'Hindi' ? 'मान' : 'Value') : String(topic.values[idx] || topic.values[idx % topic.values.length]),
            val2: ''
        })),
        tasks: [
            { id: 1, text: lang === 'Hindi' ? 'कार्य 1: कॉलम A का डेटा कॉलम C में कॉपी करें' : 'Task 1: Copy column A data to column C', marks: 2 },
            { id: 2, text: lang === 'Hindi' ? 'कार्य 2: कॉलम B का डेटा कॉलम D में कॉपी करें' : 'Task 2: Copy column B data to column D', marks: 2 },
            { id: 3, text: lang === 'Hindi' ? 'कार्य 3: D11 में SUM फॉर्मूला से योग निकालें' : 'Task 3: Calculate TOTAL using SUM formula in D11', marks: 2 },
            { id: 4, text: lang === 'Hindi' ? 'कार्य 4: D12 में AVERAGE फॉर्मूला से औसत निकालें' : 'Task 4: Calculate AVERAGE formula in D12', marks: 2 },
            { id: 5, text: lang === 'Hindi' ? 'कार्य 5: D13 में MAX फॉर्मूला से अधिकतम निकालें' : 'Task 5: Calculate MAX using MAX formula in D13', marks: 2 },
            { id: 6, text: lang === 'Hindi' ? 'कार्य 6: D14 में MIN फॉर्मूला से न्यूनतम निकालें' : 'Task 6: Calculate MIN using MIN formula in D14', marks: 2 },
            { id: 7, text: lang === 'Hindi' ? 'कार्य 7: D15 में COUNT फॉर्मूला से गिनती करें' : 'Task 7: COUNT items using COUNT formula in D15', marks: 2 },
            { id: 8, text: lang === 'Hindi' ? 'कार्य 8: E2 में प्रतिशत निकालें =(D2/D11)*100' : 'Task 8: Calculate percentage: (D2/D11)*100 in E2', marks: 2 },
            { id: 9, text: lang === 'Hindi' ? 'कार्य 9: हेडर रो को BOLD फॉर्मेट करें' : 'Task 9: Apply BOLD formatting to row 1 (headers)', marks: 2 },
            { id: 10, text: lang === 'Hindi' ? 'कार्य 10: हेडर को CENTER एलाइन करें' : 'Task 10: Apply CENTER alignment to column headers', marks: 2 },
        ]
    });
}

// Word test topics
const WORD_TOPICS = [
    { name: 'Basic Formatting', content: 'Rajasthan Staff Selection Board conducts various examinations for recruitment. The board ensures fair and transparent selection process.' },
    { name: 'Table & Layout', content: 'Government offices require proper documentation skills from employees. Table creation is an important skill for office work.' },
    { name: 'Advanced Formatting', content: 'Professional document preparation requires attention to detail. The area of circle is πr2 where r is radius.' },
    { name: 'Hindi Document', content: 'भारत सरकार के कार्यालयों में हिंदी का प्रयोग अनिवार्य है। कंप्यूटर पर हिंदी टाइपिंग एक महत्वपूर्ण कौशल है।' },
    { name: 'Office Letter', content: 'To, The Office Superintendent, District Administrative Office, Jaipur. Subject: Request for leave approval.' },
    { name: 'Report Format', content: 'ANNUAL REPORT 2024. Department Performance Analysis. The department achieved 95% target completion rate.' },
    { name: 'Notice Format', content: 'NOTICE. All employees are hereby informed that office timings have been revised. New Timings: 9:00 AM to 5:30 PM.' },
    { name: 'Technical Doc', content: 'Technical Specifications Document. System Requirements: Windows 10 or above. RAM: Minimum 4GB recommended.' },
    { name: 'Meeting Minutes', content: 'MEETING MINUTES. Date: 10/Dec/2023. Attendees: Mr. Sharma, Ms. Patel. Agenda: Discussion on quarterly targets.' },
    { name: 'Certificate', content: 'CERTIFICATE OF APPRECIATION. This is to certify that Mr./Ms. [Name] has completed the training program.' },
];

// Generate 50 Word tests
let wordTests = [];
testId = 1;

for (let i = 0; i < 50; i++) {
    const topic = WORD_TOPICS[i % WORD_TOPICS.length];
    const lang = i < 17 ? 'English' : i < 34 ? 'Hindi' : 'Bilingual';
    const isFree = i < 3;

    wordTests.push({
        id: testId++,
        title: `Test ${i + 1}: ${topic.name}`,
        type: 'Word',
        language: lang,
        isFree: isFree,
        content: `<p>${topic.content}</p><p>Additional content for test variation ${i + 1}.</p>`,
        questions: [
            { id: 1, text: lang === 'Hindi' ? 'पहले पैराग्राफ का Font Size 14 pt करें' : 'Set first paragraph Font Size to 14 pt', textHi: 'पहले पैराग्राफ का Font Size 14 pt करें', marks: 2 },
            { id: 2, text: lang === 'Hindi' ? 'दूसरे पैराग्राफ को Bold और Italic करें' : 'Apply Bold and Italic to second paragraph', textHi: 'दूसरे पैराग्राफ को Bold और Italic करें', marks: 2 },
            { id: 3, text: lang === 'Hindi' ? 'तीसरे पैराग्राफ को Center Align करें' : 'Center align the third paragraph', textHi: 'तीसरे पैराग्राफ को Center Align करें', marks: 2 },
            { id: 4, text: lang === 'Hindi' ? 'एक शब्द को Yellow Highlight करें' : 'Highlight a word in Yellow', textHi: 'एक शब्द को Yellow Highlight करें', marks: 2 },
            { id: 5, text: lang === 'Hindi' ? 'अंतिम पैराग्राफ को Right Align करें' : 'Right align the last paragraph', textHi: 'अंतिम पैराग्राफ को Right Align करें', marks: 2 },
            { id: 6, text: lang === 'Hindi' ? 'पहले शब्द को Underline करें' : 'Underline the first word', textHi: 'पहले शब्द को Underline करें', marks: 2 },
            { id: 7, text: lang === 'Hindi' ? 'Line Spacing 1.5 सेट करें' : 'Set Line Spacing to 1.5', textHi: 'Line Spacing 1.5 सेट करें', marks: 2 },
            { id: 8, text: lang === 'Hindi' ? 'एक शब्द का Font Color Blue करें' : 'Change font color of a word to Blue', textHi: 'एक शब्द का Font Color Blue करें', marks: 2 },
            { id: 9, text: lang === 'Hindi' ? 'Header में शीर्षक जोड़ें' : 'Add a title in Header', textHi: 'Header में शीर्षक जोड़ें', marks: 2 },
            { id: 10, text: lang === 'Hindi' ? 'Footer में Page Number डालें' : 'Insert Page Number in Footer', textHi: 'Footer में Page Number डालें', marks: 2 },
        ]
    });
}

console.log('Excel tests:', excelTests.length);
console.log('Word tests:', wordTests.length);

// Write to a temp file
fs.writeFileSync('temp_cpt_data.json', JSON.stringify({ excel: excelTests, word: wordTests }, null, 2));
console.log('Data written to temp_cpt_data.json');
