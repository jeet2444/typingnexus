// --- HELPER FUNCTIONS FOR GENERATION ---
const NAMES = ["Amit", "Rahul", "Priya", "Sneha", "Vikram", "Rohan", "Sita", "Gita", "Mohan", "Sohan", "Anita", "Kavita", "Raj", "Simran", "Arjun", "Karan"];
const SURNAMES = ["Kumar", "Sharma", "Singh", "Gupta", "Verma", "Yadav", "Jain", "Mehta", "Reddy", "Patel", "Mishra", "Joshi"];
const CITIES = ["Jaipur", "Delhi", "Mumbai", "Kota", "Udaipur", "Patna", "Indore", "Bhopal", "Lucknow", "Kanpur"];
const DEPARTMENTS = ["HR", "Sales", "IT", "Marketing", "Finance", "Operations", "Legal"];
const COLORS = ["Red", "Blue", "Green", "Yellow", "Orange"];
const FONTS = ["Arial", "Calibri", "Times New Roman", "Verdana"];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 5 BASE TEMPLATES (High Quality) ---
const EXCEL_TEMPLATES = [
    {
        title: "Salary Calculation",
        dataModel: "Salary",
        tasks: [
            "Calculate 'Net Salary' in Column D (Basic Salary + Bonus). Formula: =B1+C1",
            "Calculate 'Annual Salary' in Column E (Net Salary * 12). Formula: =D1*12",
            "Calculate Average Basic Salary in cell B6 using AVERAGE function.",
            "Calculate Total Bonus in cell C7 using SUM function.",
            "Find Maximum Basic Salary in cell B8 using MAX function.",
            "Find Minimum Basic Salary in cell B9 using MIN function.",
            "Count total employees in cell B10 using COUNT function.",
            "Format the header row (Row 0) with Bold and Yellow background.",
            "Align all numeric values in Columns B and C to Center.",
            "Apply Borders to the entire data range."
        ]
    },
    {
        title: "Sales Report",
        dataModel: "Sales",
        tasks: [
            "Calculate 'Revenue' in Column D (Price * Units). Formula: =B1*C1",
            "Calculate 'Profit' in Column E (Revenue - (Cost * Units)). Assume Cost is 50% of Price: =D1-(B1*0.5*C1)",
            "Calculate Total Revenue in cell D6 using SUM.",
            "Calculate Average Unit Price in cell B7 using AVERAGE.",
            "Find Highest Units Sold in cell C8 using MAX.",
            "Find Lowest Units Sold in cell C9 using MIN.",
            "Count number of products in cell A10 using COUNT.",
            "Format 'Total Rev' cell (D6) text to Bold and Red Color.",
            "Change the Font of Product Names (Column A) to Italic.",
            "Underline the header row."
        ]
    },
    {
        title: "Student Marks Sheet",
        dataModel: "Marks",
        tasks: [
            "Calculate 'Total Marks' in Column E (Maths + Sci + Eng). Formula: =B1+C1+D1",
            "Calculate 'Percentage' in Column F (Total / 3). Formula: =E1/3",
            "Calculate Class Average for Maths in cell B6 using AVERAGE.",
            "Find Highest Marks in Science in cell C7 using MAX.",
            "Find Lowest Marks in English in cell D8 using MIN.",
            "Count total students in cell A9 using COUNT.",
            "Highlight the student with highest total marks in Yellow.",
            "Make the 'Percentage' column (F) text Bold.",
            "Center align all marks.",
            "Apply a thick border around the table."
        ]
    },
    {
        title: "Inventory Management",
        dataModel: "Inventory",
        tasks: [
            "Calculate 'Remaining Stock' in Column D (Opening - Sold). Formula: =B1-C1",
            "Calculate 'Stock Value' in Column E (Remaining * 500). Formula: =D1*500",
            "Calculate Total Opening Stock in cell B6 using SUM.",
            "Calculate Total Sold Items in cell C7 using SUM.",
            "Find Maximum Opening Stock in cell B8 using MAX.",
            "Find Minimum Sold Items in cell C9 using MIN.",
            "Count total number of items in cell A10 using COUNT.",
            "Format 'Stock Value' column to have 'Currency' style (bold + italic).",
            "Highlight 'Printer' row in Red if remaining stock is less than 5.",
            "Align 'Item Name' column to Left."
        ]
    },
    {
        title: "Budget Planner",
        dataModel: "Budget",
        tasks: [
            "Calculate 'Variance' in Column D (Actual - Estimated). Formula: =C1-B1",
            "Calculate 'Variance %' in Column E (Variance / Estimated * 100). Formula: =D1/B1*100",
            "Calculate Total Estimated Cost in cell B6 using SUM.",
            "Calculate Total Actual Cost in cell C7 using SUM.",
            "Find Maximum Variance in cell D8 using MAX.",
            "Find Minimum Variance in cell D9 using MIN.",
            "Count number of expense categories in cell A10 using COUNT.",
            "Format positive variance values in Green, negative in Red.",
            "Bold the 'Total' rows.",
            "Apply 'Grid' borders to the table."
        ]
    }
];

const WORD_TEMPLATES = [
    {
        title: "Official Letter Formatting",
        type: "Letter",
        baseContent: `<p>To,</p><p>The District Collector,</p><p>{CITY}, Rajasthan.</p><p>Subject: Application for {REASON}.</p><p>Sir,</p><p>Most respectfully, I beg to say that {BODY}.</p><p>Kindly grant me leave for two days.</p><p>Thanking You,</p><p>Yours Faithfully,</p><p>{NAME}</p><p>{DESIGNATION}</p>`,
        questions: [
            "Set page size to A4 and margins to 'Normal'.",
            "Make the text 'The District Collector' Bold and Underlined.",
            "Center align the 'Subject' line and make it Bold.",
            "Set font size of the body text to 14.",
            "Right align the 'Yours Faithfully' section.",
            "Justify the main body paragraph.",
            "Change font color of 'Subject' to Blue.",
            "Apply 'Italic' style to '{DESIGNATION}'.",
            "Set line spacing of the body paragraph to 1.5.",
            "Highlight '{CITY}, Rajasthan' in Yellow."
        ]
    },
    {
        title: "Notice Writing",
        type: "Notice",
        baseContent: `<p>NOTICE</p><p>{SCHOOL_NAME}, {CITY}</p><p>Date: {DATE}</p><p>{EVENT_NAME}</p><p>This is to inform all students that the {EVENT_NAME} will be held on {EVENT_DATE} in the school playground. Interested students should submit their names to the undersigned by {DEADLINE}.</p><p>Events: 100m Race, Long Jump, Shot Put.</p><p>Sports Secretary,</p><p>{NAME}</p>`,
        questions: [
            "Center align the word 'NOTICE' and make it Bold.",
            "Make the School Name Bold, Underlined, and Font Size 16.",
            "Right align the 'Date'.",
            "Make '{EVENT_NAME}' Bold and Italic.",
            "Justify the main paragraph text.",
            "Change font of 'Events' line to 'Arial'.",
            "Highlight '{EVENT_DATE}' with Green color.",
            "Make 'Sports Secretary' Bold.",
            "Convert '100m Race, Long Jump, Shot Put' into a Bulleted List.",
            "Apply a text border to the word 'NOTICE'."
        ]
    },
    {
        title: "Resume Formatting",
        type: "Resume",
        baseContent: `<p>CURRICULUM VITAE</p><p>Name: {NAME}</p><p>Address: {ADDRESS}</p><p>Email: {EMAIL}</p><p>CAREER OBJECTIVE</p><p>To secure a challenging position in a reputable organization to expand my learnings, knowledge, and skills.</p><p>EDUCATION</p><p>10th - RBSE Board - {SCORE1}%</p><p>12th - RBSE Board - {SCORE2}%</p><p>B.Com - Rajasthan University - {SCORE3}%</p><p>SKILLS</p><p>MS Office, Tally, Typing (Hindi & English)</p>`,
        questions: [
            "Center align 'CURRICULUM VITAE', make it Bold and Underlined.",
            "Make 'Name', 'Address', 'Email' labels Bold.",
            "Make section headers ('CAREER OBJECTIVE', 'EDUCATION', 'SKILLS') Bold and shade background Grey.",
            "Justify the Career Objective paragraph.",
            "Convert Education details into a Bulleted List.",
            "Change font of the entire document to 'Times New Roman'.",
            "Set font size of section headers to 14.",
            "Italicize the percentages in Education section.",
            "Apply 'Strike-through' to the word 'Tally'.",
            "Change the font color of 'Email' to Blue."
        ]
    },
    {
        title: "Meeting Minutes",
        type: "Minutes",
        baseContent: `<p>MINUTES OF MEETING</p><p>Date: {DATE}</p><p>Time: 10:00 AM</p><p>Venue: Conference Hall</p><p>Attendees:</p><p>1. Mr. {NAME1} (Chairman)</p><p>2. Ms. {NAME2} (Secretary)</p><p>3. All Department Heads</p><p>Agenda:</p><p>1. Review of {TOPIC1}</p><p>2. {TOPIC2}</p><p>3. Employee Welfare Verification</p><p>Action Items:</p><p>HR Dept to organize health camp.</p><p>Marketing Dept to launch new campaign.</p>`,
        questions: [
            "Center align 'MINUTES OF MEETING', make it Bold, Font Size 18.",
            "Make 'Date', 'Time', 'Venue' labels Bold.",
            "Convert 'Attendees' list into a Numbered List.",
            "Convert 'Agenda' list into a Bulleted List.",
            "Make 'Action Items' header Bold and Underlined.",
            "Justify the Action Items text.",
            "Highlight 'Conference Hall' in Yellow.",
            "Change 'Mr. {NAME1} (Chairman)' font color to Red.",
            "Apply Line Spacing of 2.0 to the Agenda list.",
            "Italicize 'Employee Welfare Verification'."
        ]
    },
    {
        title: "Article Formatting",
        type: "Article",
        baseContent: `<p>{TITLE}</p><p>{BODY_START}. It gives us oxygen, store carbon, stabilize the soil and give life to the world’s wildlife.</p><p>Benefits:</p><p>Oxygen Production</p><p>Climate Control</p><p>Air Purification</p><p>Conclusion</p><p>We must plant more trees to save our planet.</p><p>Written by: Environment Club</p>`,
        questions: [
            "Center align title '{TITLE}', make Bold and Underlined.",
            "Set title font size to 20.",
            "Justify the first paragraph.",
            "Make 'Benefits:' header Bold and Italic.",
            "Convert the benefits list into a Bulleted List.",
            "Change font of 'Conclusion' to 'Arial Black'.",
            "Center align 'Written by: Environment Club'.",
            "Highlight 'oxygen' and 'carbon' words in Green.",
            "Apply Subscript to '2' in 'CO2' (if added text manually).",
            "Right align the entire first paragraph."
        ]
    }
];

// --- GENERATORS ---

const generateExcelData = (model: string) => {
    const rows = [];
    if (model === "Salary") {
        for (let i = 1; i <= 5; i++) {
            rows.push({ id: i, name: `${getRandom(NAMES)} ${getRandom(SURNAMES)}`, val1: randomInt(15000, 50000), c: randomInt(1000, 5000), d: "", e: "" });
        }
    } else if (model === "Sales") {
        const products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Printer", "USB Drive", "Webcam", "Headset"];
        for (let i = 1; i <= 5; i++) {
            rows.push({ id: i, name: getRandom(products), val1: randomInt(500, 2000), c: randomInt(10, 100), d: "", e: "" });
        }
    } else {
        // Generic fallback
        for (let i = 1; i <= 5; i++) {
            rows.push({ id: i, name: `Item ${String.fromCharCode(64 + i)}`, val1: randomInt(10, 100), c: randomInt(10, 100), d: "", e: "" });
        }
    }
    // Add calc rows
    for (let i = 6; i <= 10; i++) {
        rows.push({ id: i, name: i === 6 ? "Total" : "", val1: "", c: "", d: "", e: "" });
    }
    return rows;
};

const generateExcelTests = (count: number) => {
    const tests = [];
    let idCounter = 101;

    // First add the 5 specific templates (they are better quality)
    // We recreate them to ensure unique IDs if we want more
    // But sticking to the loop is easier. We will mix templates.

    for (let i = 0; i < count; i++) {
        const template = EXCEL_TEMPLATES[i % EXCEL_TEMPLATES.length];
        const isOriginal = i < 5;

        tests.push({
            id: idCounter++,
            title: isOriginal ? template.title : `${template.title} - Set ${Math.floor(i / 5) + 1}`,
            type: 'Excel',
            language: 'English',
            isFree: i < 2, // First 2 free
            data: generateExcelData(template.dataModel),
            tasks: template.tasks.map((t, idx) => ({
                text: t,
                marks: 1
            }))
        });
    }
    return tests;
};

const generateWordTests = (count: number) => {
    const tests = [];
    let idCounter = 201;

    for (let i = 0; i < count; i++) {
        const template = WORD_TEMPLATES[i % WORD_TEMPLATES.length];
        const isOriginal = i < 5;

        // Fill Template Placeholders
        let content = template.baseContent
            .replace(/{CITY}/g, getRandom(CITIES))
            .replace(/{NAME}/g, `${getRandom(NAMES)} ${getRandom(SURNAMES)}`)
            .replace(/{NAME1}/g, getRandom(SURNAMES))
            .replace(/{NAME2}/g, getRandom(SURNAMES))
            .replace(/{DATE}/g, `${randomInt(1, 28)}th ${getRandom(["Jan", "Feb", "Mar", "Oct", "Dec"])} 2025`)
            .replace(/{EVENT_DATE}/g, `${randomInt(1, 28)}th Next Month`)
            .replace(/{DEADLINE}/g, `${randomInt(1, 28)}th This Month`)
            .replace(/{REASON}/g, getRandom(["fever", "urgent work", "marriage", "festival"]))
            .replace(/{BODY}/g, "I have some urgent piece of work at home")
            .replace(/{DESIGNATION}/g, getRandom(["Clerk", "Assistant", "Manager", "Student"]))
            .replace(/{SCHOOL_NAME}/g, `Govt. Sen. Sec. School`)
            .replace(/{EVENT_NAME}/g, getRandom(["Annual Function", "Sports Day", "Science Fair", "Debate Competition"]))
            .replace(/{ADDRESS}/g, `${randomInt(10, 99)}, Civil Lines, ${getRandom(CITIES)}`)
            .replace(/{EMAIL}/g, `user${randomInt(100, 999)}@example.com`)
            .replace(/{SCORE1}/g, randomInt(60, 95).toString())
            .replace(/{SCORE2}/g, randomInt(60, 95).toString())
            .replace(/{SCORE3}/g, randomInt(55, 85).toString())
            .replace(/{TOPIC1}/g, "Performance")
            .replace(/{TOPIC2}/g, "Future Plans")
            .replace(/{TITLE}/g, "IMPORTANCE OF TREES")
            .replace(/{BODY_START}/g, "Trees are vital");

        tests.push({
            id: idCounter++,
            title: isOriginal ? template.title : `${template.title} - Set ${Math.floor(i / 5) + 1}`,
            type: 'Word',
            language: 'English',
            isFree: i < 2,
            content: content,
            questions: template.questions.map(q => {
                // Randomize colors in questions for variety
                const color = getRandom(COLORS);
                const text = q.replace(/Blue|Red|Green|Yellow/g, color);
                return { text, marks: 1 };
            })
        });
    }
    return tests;
};

export const INITIAL_CPT_EXCEL = generateExcelTests(50);
export const INITIAL_CPT_WORD = generateWordTests(50);
