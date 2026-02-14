
import { UserProfileData, DEFAULT_USER } from './userData';
import { supabase } from './supabaseClient';
import { INITIAL_CPT_EXCEL, INITIAL_CPT_WORD } from './initialCptData';

// --- Types ---

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    plan: string;
    joined: string;
    status: 'Active' | 'Inactive';
    authMethod: string;
    role: 'Super Admin' | 'Admin' | 'User' | 'Moderator';
    purchasedPackIds?: string[];
    last_seen?: string;
}

// Stats Interface
export interface SiteStats {
    students: string;
    testsTaken: string;
    passRate: string;
    uptime: string;
}


export interface SubscriptionPlan {
    id: string;
    name: string; // "Monthly", "Yearly"
    durationMonths: number;
    price: number;
    currency: string;
    features: string[];
    isActive: boolean;
    type: 'Standard' | 'Pro' | 'Institute';
}

export interface Coupon {
    id: string;
    code: string; // "SAVE10"
    discountType: 'Percentage' | 'Flat';
    discountValue: number;
    expiryDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    planId: string;
    amount: number;
    date: string;
    status: 'Success' | 'Failed' | 'Pending';
    paymentMethod: string; // "Razorpay", "Stripe"
}

export interface ExamCategory {
    id: string;
    name: string;
    parentId: string | null;
    type: 'folder' | 'category';
}

// --- Master Rules Engine Interfaces ---

import { ExamProfile, CategoryRule } from '../types/profile';
export type { ExamProfile, CategoryRule };

// Re-export specific types if needed by other components, or let them import from 'types/profile'
// For now, we keep the store consistent.

// ... (Keep existing ContentItem interface)

export interface ContentItem {
    id: string;
    title: string; // "Gandhi Jayanti Speech"
    text: string;
    language: 'Hindi' | 'English';
    font: 'Mangal' | 'KrutiDev' | 'Sans'; // Mangal/Kruti for Hindi, Sans for English
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[]; // ["Common", "PreviousYear"]
    uploadDate: string;
}

export const INITIAL_CONTENT_LIBRARY: ContentItem[] = [];

export const INITIAL_EXAM_PROFILES: ExamProfile[] = [];

export const DEFAULT_EXAM_PROFILE: ExamProfile = {
    profileName: 'Untitled Profile',
    description: '',
    calculationParam: 'net_wpm',
    wordCalculation: '5char',
    minEligibilityType: 'none',
    languageMode: 'fixed',
    fixedLanguage: 'en',
    hindiFont: 'mangal',
    hindiComplexity: 'standard',
    allowAltCodes: false,
    hindiStenoAvailable: false,
    errorClassification: 'simple',
    ignoredErrorLimit: 0,
    penaltyMultiplier: 0,
    penaltyMethod: 'none',
    finalScoreCalc: 'direct',
    scoreDisplay: '2dec',
    showAccuracy: true,
    stenoEnabled: false,
    durationMin: 10,
    practiceSession: 'none',
    breakDurationSec: 0,
    backspaceEnabled: true,
    arrowKeysEnabled: true,
    highlight: 'word',
    showFingerPosition: false,
    showOnscreenKeyboard: true,
    liveErrors: true,
    showSpeedDuringTest: true,
    minKeystrokes: 0,
    categoryWiseEnabled: false,
    scribeAllowed: false,
    examType: 'practice',
    resultDisplay: 'detailed'
};

export interface Course {
    id: string;
    name: string; // "SSC + AIIMS Combo"
    description?: string;
    price: number;
    durationDays: number;

    // Module Selection
    modules: ('Hindi' | 'English' | 'CPT')[];

    // Exam Rule Mapping
    examProfileIds: string[]; // IDs of profiles active in this course

    isActive: boolean;
}

export interface AdminRule {

    id: number;
    name: string;
    category: string; // Keep for legacy, but utilize ExamCategory for new structure
    duration: number; // in minutes
    language: string;
    font: string; // "Arial", "Mangal", "KrutiDev"

    // Advanced Penalty Logic
    backspace: 'Enabled' | 'Disabled'; // Legacy
    backspaceParam: 'Enabled' | 'Disabled' | 'WordOnly'; // [NEW] More granular
    highlighting: 'Word' | 'Line' | 'None'; // [NEW]
    penaltyPerFullMistake: number;
    penaltyPerHalfMistake: number;
    errorMethod: 'Full' | 'Half' | 'Ignore'; // [NEW]
    maxIgnoredErrors: number;
    qualifyingSpeed: number;
    qualifyingAccuracy: number;

    // Security & Special Settings
    allowNumbers: boolean;
    allowSpecialChars: boolean;
    security: {
        preventCopyPaste: boolean;
        preventRightClick: boolean;
        singleSession: boolean;
    };

    formula: string;
    details: string;
}

export interface AdminExam {
    id: number;
    categoryId?: string; // Link to new Category system
    title: string;
    language: string;
    enabledLanguages?: string[];
    difficulty: string;
    plays: number;
    ruleSet: string;
    ruleId: number;
    examProfileId?: string; // [NEW] Link to Master Rules Profile
    liveStatus?: 'Live' | 'Upcoming' | 'Past';
    liveDate?: string;
    status: 'Published' | 'Draft' | 'Archived';
    content?: string;
    contentTitle?: string;
    createdAt?: number; // Timestamp when exam was created
}

export interface AdminPayment {
    id: string;
    user: string;
    amount: string;
    date: string;
    method: string;
    status: 'Success' | 'Pending' | 'Failed';
}

export interface Coupon {
    code: string;
    discount: number; // Percentage
    expiry: string;
    isActive: boolean;
}

export interface Ad {
    id: number;
    imageUrl: string;
    linkUrl: string;
    position: 'LeftSidebar' | 'RightSidebar' | 'TopBanner' | 'Footer' | 'Sidebar'; // Sidebar kept for backward compat
    isActive: boolean;
}

export interface PricingPackage {
    id: number;
    name: string;
    price: number;
    durationDays: number;
    features: string[]; // List of features or exam IDs included
    isCombo: boolean; // If true, might include specific combo logic
}

export interface BlogPost {
    id: number;
    title: string;
    content: string; // HTML or Markdown
    author: string;
    date: string;
    status: 'Published' | 'Draft';
    imageUrl?: string;
    linkedExamId?: number;
}

export interface SiteSettings {
    // 1. Site Identity & SEO
    siteName: string;
    siteTagline: string;
    supportEmail: string;
    logoUrl: string;
    logoLightUrl?: string; // NEW
    logoDarkUrl?: string;  // NEW
    faviconUrl?: string;   // NEW
    copyrightText: string;
    maintenanceMode: boolean;
    maintenanceMessage?: string; // NEW
    allowAdminBypass?: boolean;  // NEW
    seoTitle?: string;           // NEW
    seoKeywords?: string;        // NEW
    robotsTxt?: string;          // NEW
    timezone?: string;           // NEW
    dateFormat?: string;         // NEW
    currencySymbol?: string;     // NEW

    // 2. Payment & Billing
    upiId: string;
    razorpayKeyId: string;
    razorpaySecret: string;
    stripeKey: string;
    paymentMode?: 'Sandbox' | 'Live'; // NEW
    taxEnabled?: boolean;            // NEW
    taxRate?: number;               // NEW
    taxInclusive?: boolean;          // NEW
    hsnCodes?: string;               // NEW
    invoicePrefix?: string;          // NEW
    companyAddress?: string;         // NEW
    digitalSignatureUrl?: string;    // NEW
    autoRenewal?: boolean;           // NEW
    trialDays?: number;              // NEW
    gracePeriodDays?: number;        // NEW

    // 3. User & Access
    multiDeviceLimit?: number;       // NEW
    sessionTimeout?: number;         // NEW
    verifyEmailRequired?: boolean;   // NEW
    ipBanList?: string[];            // NEW

    // 4. Communication
    smtpHost?: string;               // NEW
    smtpPort?: number;               // NEW
    smtpUser?: string;               // NEW
    smtpPass?: string;               // NEW
    smtpFromEmail?: string;          // NEW
    smtpFromName?: string;           // NEW
    smsApiUrl?: string;              // NEW
    whatsappApiKey?: string;         // NEW
    emailTemplates?: {               // NEW
        welcome?: string;
        passwordReset?: string;
        purchaseSuccess?: string;
    };

    // 5. Sales & Combo Logic
    bulkDiscounts?: { minQty: number, discount: number }[]; // NEW
    contentDripEnabled?: boolean;                           // NEW
    expiryReminders?: number[];                             // NEW (Days before)

    // 6. Dynamic Content
    homeBanners?: { id: string, image: string, link: string, active: boolean }[]; // NEW
    legalPrivacy?: string;           // NEW
    legalTerms?: string;             // NEW
    legalRefund?: string;            // NEW

    // 7. Marketing & Tracking
    googleAnalyticsId?: string;      // NEW
    facebookPixelId?: string;        // NEW
    customHeaderScripts?: string;    // NEW
    customFooterScripts?: string;    // NEW
    affiliateEnabled?: boolean;      // NEW
    affiliateCommission?: number;    // NEW

    // 8. Support
    supportDepartments?: string[];    // NEW
    supportAutoReply?: string;       // NEW
    escalationHours?: number;        // NEW

    // 9. System Health
    autoBackupEnabled?: boolean;     // NEW
    backupIntervalHours?: number;    // NEW

    // 10. Live Exam Settings
    autoLiveExamEnabled?: boolean;   // NEW: Enable 24h auto-rotation of live exams


    // Legacy/Old fields
    allowRegistrations: boolean;
    primaryColor: string;
    navLinks: { label: string; href: string; visible: boolean; subLinks?: { label: string; href: string; visible: boolean }[] }[];
    footerText: string;
    footerLinks: { label: string; href: string }[];
    socialLinks: { platform: string; url: string; visible: boolean }[];
    version?: number;
    showPracticeExams: boolean;
    showTypingTutorial: boolean;
    showKeyboardDrill: boolean;
    showPracticeAds?: boolean; // Added this based on the instruction's snippet context

    // 10. Home & Practice Lab Content
    heroTitle: string;
    heroSubtitle: string;
    heroCTAText: string;
    heroCTALink: string;
    practiceLabTitle?: string;
    practiceLabSubtitle?: string;
    showStudentCount?: boolean;
    showTypingTests: boolean;
    showBlog: boolean;
    showPricing: boolean;
    showRSSBPack: boolean;
    showGamification: boolean;
    showLeaderboard: boolean;
    featuredExamWidget: {
        visible: boolean;
        title: string;
        examId: number | null;
        description?: string;
    };
    featuredItems: {
        id: number;
        title: string;
        description: string;
        examId: number | null;
        visible: boolean;
        type: 'blue' | 'purple' | 'green' | 'red';
    }[];
    siteStats?: SiteStats; // NEW: Dynamic Stats
}


export interface ExamResult {
    id: number;
    studentName: string;
    examTitle: string;
    date: string;
    timestamp?: number; // [NEW] Added for 24h Volatile Logic
    grossWPM: number;
    netWPM: number;
    accuracy: number;
    status: 'Pass' | 'Fail';
}

export interface Enquiry {
    id: number;
    name: string;
    email: string;
    message: string;
    date: string;
    status: 'New' | 'Read' | 'Replied';
}

export interface InvoiceLineItem {
    description: string;
    amount: number;
}

export interface Invoice {
    id: string;
    userId: number;
    userName: string;
    date: string;
    dueDate: string;
    items: InvoiceLineItem[];
    total: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    target: 'All Users' | 'Pro Users' | 'Free Users' | 'Specific User';
    targetUserId?: number;
    date: string;
    status: 'Sent' | 'Scheduled';
    type?: 'Info' | 'Warning' | 'Success' | 'Danger'; // Added type
}


// --- NEW: Passage Manager Types ---
export interface Passage {
    id: number;
    title: string;
    content: string;
    language: 'English' | 'Hindi' | 'Punjabi' | 'Marathi';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    wordCount: number;
    tags: string[];
    audioUrl?: string;
    status: 'Active' | 'Draft';
    createdDate: string;
}

// ... existing code ...

// In DEFAULT_STORE or mock data, add Punjabi/Marathi passages if suitable or just ensure types allow it.

// --- NEW: Certificate Types ---
export interface CertificateTemplate {
    id: number;
    name: string;
    backgroundColor: string;
    borderColor: string;
    logoUrl: string;
    signatureUrl: string;
    isDefault: boolean;
}

export interface CertificateCriteria {
    minWPM: number;
    minAccuracy: number;
    testType: 'Any' | 'Exam' | 'Practice';
    enabled: boolean;
}

// --- NEW: Gamification Types ---
export interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    criteria: string;
    isActive: boolean;
}

export interface Level {
    level: number;
    minXp: number;
    title: string;
    icon: string;
}

export interface GamificationSettings {
    xpPerTest: number;
    xpPerLesson: number;
    xpPerStreak: number;
    streakBonusMultiplier: number;
    leaderboardEnabled: boolean;
    dailyChallengesEnabled: boolean;
    levels?: Level[];
}

export interface UserProgress {
    id: number;
    userId: number;
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    achievementIds: number[];
    testsCompleted: number;
    lessonsCompleted: number;
}

// --- NEW: CPT & Combo Pack Types ---
export interface CPTQuestion {
    id: number;
    text: string;
    textHi?: string; // Hindi Text
    marks: number;
}

export interface CPTTest {
    id: number;
    title: string;
    type: 'Word' | 'Excel';
    data?: any[]; // For Excel: Grid Data
    tasks?: CPTQuestion[]; // For Excel: Tasks
    content?: string; // For Word: HTML Content
    questions?: CPTQuestion[]; // For Word: Formatting Questions
    instructions?: string;
    language?: 'English' | 'Hindi' | 'Bilingual';
    isFree?: boolean; // New field for Free Trial
}

export interface ComboPack {
    id: string; // UUID
    title: string;
    price: number;
    description: string;
    features: string[];
    content: {
        typingPassageIds: number[];
        cptTestIds: number[];
    };
    isActive: boolean;
    coverImage?: string;
}

export interface TicketMessage {
    id: string;
    sender: 'User' | 'Admin';
    message: string;
    timestamp: string;
}

export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    priority: 'Low' | 'Medium' | 'High';
    category: 'General' | 'Technical' | 'Billing';
    createdAt: string;
    updatedAt: string;
    messages: TicketMessage[];
}

export interface Announcement {
    id: string;
    message: string;
    type: 'Info' | 'Warning' | 'Success' | 'Danger';
    isActive: boolean;
    expiryDate?: string;
}



interface AdminStore {
    users: AdminUser[];
    rules: AdminRule[];
    categories: ExamCategory[]; // [NEW]
    exams: AdminExam[];
    payments: AdminPayment[]; // Legacy
    plans: SubscriptionPlan[]; // [NEW]
    coupons: Coupon[]; // [NEW] (Override legacy if any)
    transactions: Transaction[]; // [NEW]
    supportTickets: SupportTicket[]; // [NEW]
    announcements: Announcement[]; // [NEW]
    ads: Ad[]; // Keeping generic for now
    packages: PricingPackage[];
    blogs: BlogPost[];

    // Existing Modules

    settings: SiteSettings;
    results: ExamResult[];
    enquiries: Enquiry[];
    invoices: Invoice[];
    notifications: Notification[];
    media: MediaItem[];

    // Master Rules Engine
    examProfiles: ExamProfile[];
    contentLibrary: ContentItem[];
    courses: Course[];

    // NEW Modules
    passages: Passage[];
    certificateTemplates: CertificateTemplate[];
    certificateCriteria: CertificateCriteria;
    achievements: Achievement[];
    gamificationSettings: GamificationSettings;
    userProgress: UserProgress[];
    cptTests: CPTTest[];
    comboPacks: ComboPack[];
    version?: number;
}


export interface MediaItem {
    id: number;
    name: string;
    url: string;
    type: 'Image' | 'Video' | 'Document';
    size: string;
    date: string;
}

// --- Initial Mock Data ---

const INITIAL_SETTINGS: SiteSettings = {
    // 1. Site Identity & SEO
    siteName: "TypingNexus",
    siteTagline: "India's #1 Typing & Computer Efficiency Platform",
    supportEmail: "support@typingnexus.in",
    logoUrl: "",
    logoLightUrl: "",
    logoDarkUrl: "",
    faviconUrl: "",
    copyrightText: "© 2026 TypingNexus.in. All rights reserved.",
    maintenanceMode: false,
    maintenanceMessage: "Website is under maintenance. Please check back soon.",
    allowAdminBypass: true,
    seoTitle: "TypingNexus - Master Typing with Confidence",
    seoKeywords: "typing, hindi typing, english typing, SSC, RRB, typing test",
    robotsTxt: "User-agent: *\nAllow: /",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currencySymbol: "₹",

    // 2. Payment & Billing
    upiId: "",
    razorpayKeyId: "",
    razorpaySecret: "",
    stripeKey: "",
    paymentMode: 'Sandbox',
    taxEnabled: false,
    taxRate: 18,
    taxInclusive: true,
    hsnCodes: "9983",
    invoicePrefix: "TN-2026-",
    companyAddress: "",
    digitalSignatureUrl: "",
    autoRenewal: false,
    trialDays: 7,
    gracePeriodDays: 3,

    // 3. User & Access
    multiDeviceLimit: 1,
    sessionTimeout: 24,
    verifyEmailRequired: false,
    ipBanList: [],

    // 4. Communication
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpFromEmail: "noreply@typingnexus.in",
    smtpFromName: "TypingNexus",
    smsApiUrl: "",
    whatsappApiKey: "",
    emailTemplates: {
        welcome: "Welcome to TypingNexus! Let's start typing.",
        passwordReset: "Reset your password using the link below.",
        purchaseSuccess: "Thank you for your purchase!"
    },

    // 5. Sales & Combo Logic
    bulkDiscounts: [
        { minQty: 5, discount: 15 },
        { minQty: 20, discount: 30 }
    ],
    contentDripEnabled: false,
    expiryReminders: [1, 3, 7],

    // 6. Dynamic Content
    homeBanners: [
        { id: "1", image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1931&auto=format&fit=crop", link: "/practice-exams", active: true },
        { id: "2", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", link: "/cpt/excel", active: true }
    ],
    legalPrivacy: "",
    legalTerms: "",
    legalRefund: "",

    // 7. Marketing & Tracking
    googleAnalyticsId: "",
    facebookPixelId: "",
    customHeaderScripts: "",
    customFooterScripts: "",
    affiliateEnabled: false,
    affiliateCommission: 10,

    // 8. Support
    supportDepartments: ["Technical", "Billing", "Sales"],
    supportAutoReply: "Thank you for contacting us. We'll get back to you soon.",
    escalationHours: 24,

    // 9. System Health
    autoBackupEnabled: true,
    backupIntervalHours: 24,

    // 10. Live Exam Settings
    autoLiveExamEnabled: true,


    // Legacy/Old fields
    allowRegistrations: true,

    primaryColor: "#2563eb",
    navLinks: [
        { label: "Home", href: "/", visible: true },
        {
            label: "English Typing",
            href: "/practice/english",
            visible: true,
            subLinks: [
                { label: "Typing Test", href: "/practice/english", visible: true },
                { label: "Key Drilling", href: "/learn/english", visible: true },
                { label: "Keyboard Drilling", href: "/keyboard/english", visible: true }
            ]
        },
        {
            label: "Hindi Typing",
            href: "/practice/hindi",
            visible: true,
            subLinks: [
                { label: "Typing Test", href: "/practice/hindi", visible: true },
                { label: "Key Drilling", href: "/learn/hindi", visible: true },
                { label: "Keyboard Drilling", href: "/keyboard/hindi", visible: true }
            ]
        },
        { label: "Exam", href: "/practice-exams", visible: true },
        { label: "Live Test", href: "/start-typing", visible: true },
        {
            label: "CPT",
            href: "#",
            visible: true,
            subLinks: [
                { label: "CPT Word", href: "/cpt/word", visible: true },
                { label: "CPT Excel", href: "/cpt/excel", visible: true }
            ]
        },
        { label: "Pricing", href: "/pricing", visible: true }
    ],
    footerText: "TypingNexus - Your path to typing excellence",
    footerLinks: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" }
    ],
    socialLinks: [
        { platform: "Facebook", url: "https://facebook.com", visible: true },
        { platform: "Twitter", url: "https://twitter.com", visible: true },
        { platform: "YouTube", url: "https://youtube.com", visible: true }
    ],
    showPracticeExams: true,
    showTypingTutorial: true,
    showKeyboardDrill: true,
    showTypingTests: true,
    showBlog: true,
    showPricing: true,
    showRSSBPack: true,
    showGamification: true,
    showLeaderboard: true,
    version: 15,
    heroTitle: "Welcome to TypingNexus",
    heroSubtitle: "Your ultimate platform for typing mastery.",
    heroCTAText: "Start Learning",
    heroCTALink: "/learn",
    featuredExamWidget: {
        visible: false,
        title: "Featured Exam",
        examId: null,
        description: ""
    },
    featuredItems: [],

    // Default Dummy Stats
    siteStats: {
        students: "0",
        testsTaken: "0",
        passRate: "0%",
        uptime: "100%"
    }
};


const INITIAL_RESULTS: ExamResult[] = [];

const INITIAL_ENQUIRIES: Enquiry[] = [];

const INITIAL_USERS: AdminUser[] = [
    {
        id: '1',
        name: 'Mahijeet',
        email: 'admin@typingnexus.in',
        password: 'Ramjiram@555999',
        plan: 'Pro Yearly',
        role: 'Super Admin',
        status: 'Active',
        joined: new Date().toISOString().split('T')[0],
        authMethod: 'Email'
    }
];

const INITIAL_RULES: AdminRule[] = [];

const INITIAL_EXAMS: AdminExam[] = [];

const INITIAL_BLOGS: BlogPost[] = [];

const INITIAL_NOTIFICATIONS: Notification[] = [];

const INITIAL_PAYMENTS: AdminPayment[] = [];

const INITIAL_PACKAGES: PricingPackage[] = [];

// --- Store Implementation ---

const ADMIN_STORAGE_KEY = 'ar_typing_admin_store_v2';

// [NEW] Helper to check feature access
export const checkAccess = (user: AdminUser, feature: string): boolean => {
    if (user.role === 'Super Admin' || user.role === 'Admin') return true;
    if (user.plan && user.plan.toLowerCase().includes('pro')) return true; // Simple check for now

    // Feature-specific logic
    if (feature === 'bulk_upload' || feature === 'create_course') return false; // Basic users can't create content

    return true; // value default allow
};

// Function to save data to localStorage and sync with Hostingerm(ADMIN_STORAGE_KEY);
export const getAdminStore = (): AdminStore => {
    let storedData: any = null;
    try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored) {
            storedData = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load admin store", e);
    }

    // Default Store (Source of Truth for Structure)
    const defaultStore: AdminStore = {
        users: INITIAL_USERS,
        rules: INITIAL_RULES,
        categories: [],
        exams: INITIAL_EXAMS,

        // Master Rules Engine Defaults
        examProfiles: INITIAL_EXAM_PROFILES,
        contentLibrary: INITIAL_CONTENT_LIBRARY,
        courses: [],

        payments: INITIAL_PAYMENTS,
        plans: [
            {
                id: 'plan_1day',
                name: '1 Day Pass',
                durationMonths: 0, // 1 day = special case
                price: 9,
                currency: 'INR',
                features: ['Unlimited Practice Tests', 'All Exam Modules (Excel/Word)', 'Instant Result Analysis', 'Ad-free Experience', 'PDF Downloads'],
                isActive: true,
                type: 'Standard'
            },
            {
                id: 'plan_7day',
                name: '7 Day Booster',
                durationMonths: 0, // 7 days = special case
                price: 29,
                currency: 'INR',
                features: ['Everything in 1 Day Pass', '7 Days Validity', 'Priority Support', 'Daily Progress Tracking', 'Save up to 30%'],
                isActive: true,
                type: 'Standard'
            },
            {
                id: 'plan_6month',
                name: '6 Month Saver',
                durationMonths: 6,
                price: 99,
                currency: 'INR',
                features: ['Same Price as 1 Month!', '180 Days Validity', 'Full Access to All Tests', 'Priority Support', 'Best for Semester Exams'],
                isActive: true,
                type: 'Pro'
            },
            {
                id: 'plan_yearly',
                name: '1 Year Premium',
                durationMonths: 12,
                price: 199,
                currency: 'INR',
                features: ['Everything in Monthly Pro', '365 Days Validity', 'All Future Updates Included', 'Highest Priority Support', 'Save up to 80%'],
                isActive: true,
                type: 'Pro'
            }
        ],
        coupons: [],
        transactions: [],
        supportTickets: [],
        announcements: [], // [NEW]
        ads: [],
        packages: INITIAL_PACKAGES,
        blogs: INITIAL_BLOGS,
        settings: INITIAL_SETTINGS,
        results: INITIAL_RESULTS,
        enquiries: INITIAL_ENQUIRIES,
        invoices: [],
        notifications: INITIAL_NOTIFICATIONS,
        media: [],
        // NEW Modules
        passages: [],
        certificateTemplates: [],
        certificateCriteria: {
            minWPM: 35,
            minAccuracy: 95,
            testType: "Any",
            enabled: true
        },
        achievements: [],
        gamificationSettings: {
            xpPerTest: 25,
            xpPerLesson: 10,
            xpPerStreak: 50,
            streakBonusMultiplier: 1.5,
            leaderboardEnabled: true,
            dailyChallengesEnabled: true,
            levels: [
                { level: 1, minXp: 0, title: "Novice Typist", icon: "🌱" },
                { level: 2, minXp: 500, title: "Speedsters", icon: "🏃" },
                { level: 3, minXp: 1500, title: "Keyboard Warrior", icon: "⚔️" },
                { level: 4, minXp: 3000, title: "Typing Legend", icon: "👑" },
                { level: 5, minXp: 5000, title: "God Mode", icon: "⚡" }
            ]
        },
        userProgress: [],
        cptTests: [...INITIAL_CPT_EXCEL, ...INITIAL_CPT_WORD] as CPTTest[],
        comboPacks: []
    };


    if (storedData) {
        // Merge stored data with defaults. 
        // IMPORTANT: We must merge deeply for new modules to ensure they appear

        // Check if stored users have password field - if not, use defaults
        let usersToUse = storedData.users || defaultStore.users;
        if (usersToUse.length > 0 && !usersToUse[0].password) {
            // Old data without passwords - reset to defaults
            console.log('Resetting users to include password field');
            usersToUse = defaultStore.users;
        }

        // Version migration for settings (Navigation, Hero, etc.)
        const currentVersion = defaultStore.settings.version || 0;
        const storedVersion = storedData.settings?.version || 0;

        let settingsToUse = storedData.settings || defaultStore.settings;
        if (storedVersion < currentVersion) {
            console.log(`Migrating settings from v${storedVersion} to v${currentVersion}`);
            // Force specific fields that were updated in the defaultStore
            settingsToUse = {
                ...defaultStore.settings, // Apply defaults first (base)
                ...storedData.settings,   // User data overrides defaults
                // Ensure new navigation links are prioritized
                navLinks: defaultStore.settings.navLinks,
                // Ensure hero changes are reflected
                heroTitle: defaultStore.settings.heroTitle,
                heroCTAText: defaultStore.settings.heroCTAText,
                heroCTALink: defaultStore.settings.heroCTALink
            };
        }

        const combinedStore = {
            ...defaultStore,
            ...storedData,
            // Core Arrays
            users: usersToUse,
            rules: storedData.rules || defaultStore.rules,
            categories: storedData.categories || defaultStore.categories,
            exams: storedData.exams || defaultStore.exams,
            payments: storedData.payments || defaultStore.payments,
            // FORCE MERGE CPT DATA: Always prefer initial data + any user created ones (if any)
            // For now, since CPTs are static in this version, we reset to defaultStore
            cptTests: defaultStore.cptTests,
            comboPacks: storedData.comboPacks || defaultStore.comboPacks,
            plans: storedData.plans || defaultStore.plans,
            coupons: storedData.coupons || defaultStore.coupons,

            transactions: storedData.transactions || defaultStore.transactions,

            // Master Rules Engine Loading
            examProfiles: (storedData.examProfiles && storedData.examProfiles.length > 0)
                ? storedData.examProfiles : defaultStore.examProfiles,
            contentLibrary: (storedData.contentLibrary && storedData.contentLibrary.length > 0)
                ? storedData.contentLibrary : defaultStore.contentLibrary,
            courses: storedData.courses || defaultStore.courses,

            // New Modules (ensure they exist)
            ads: storedData.ads || defaultStore.ads,
            packages: storedData.packages || defaultStore.packages,
            blogs: storedData.blogs || defaultStore.blogs,
            // Very New Modules (Latest Update)
            settings: settingsToUse,
            results: storedData.results || defaultStore.results,
            enquiries: storedData.enquiries || defaultStore.enquiries,
            invoices: storedData.invoices || defaultStore.invoices,
            notifications: storedData.notifications || defaultStore.notifications,
            media: storedData.media || defaultStore.media,
            // Feature Enhancement Modules
            passages: storedData.passages || defaultStore.passages,
            certificateTemplates: storedData.certificateTemplates || defaultStore.certificateTemplates,
            certificateCriteria: storedData.certificateCriteria || defaultStore.certificateCriteria,
            achievements: storedData.achievements || defaultStore.achievements,
            gamificationSettings: storedData.gamificationSettings || defaultStore.gamificationSettings,
            userProgress: storedData.userProgress || defaultStore.userProgress
        };

        // --- INJECT VIRTUAL PASSAGES FROM EXAMS ---
        // This ensures exams with custom content appear as selectable passages
        if (combinedStore.exams && combinedStore.exams.length > 0) {
            const virtualPassages: Passage[] = combinedStore.exams
                .filter(e => e.content && e.content.trim().length > 0)
                .map(e => ({
                    id: -e.id, // Negative ID to distinguish from real passages
                    title: e.contentTitle || e.title,
                    content: e.content!,
                    language: (e.language as any) || 'English',
                    difficulty: 'Medium',
                    category: e.title, // Match this with Exam Title for filtering
                    wordCount: e.content!.split(/\s+/).length,
                    tags: ['Exam Content'],
                    status: 'Active',
                    createdDate: new Date().toISOString()
                }));

            // Avoid duplicates if they were somehow saved
            const existingIds = new Set(combinedStore.passages.map(p => p.id));
            const newVirtuals = virtualPassages.filter(vp => !existingIds.has(vp.id));

            combinedStore.passages = [...combinedStore.passages, ...newVirtuals];
        }

        // --- 24H VOLATILE PURGE ---
        // Automatically remove results older than 24 hours
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        combinedStore.results = (combinedStore.results || []).filter(r => {
            // Keep recent results, purge anything without a timestamp or older than 24h
            return r.timestamp && r.timestamp > twentyFourHoursAgo;
        });

        return combinedStore;
    }

    // First time load - Save ONLY to local storage, DO NOT sync to server yet
    // This prevents overwriting server data with defaults if local storage is cleared.
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(defaultStore));
    return defaultStore;
};

// [REMOVED] Legacy saveAdminStore - Now using modular version below

// --- NEW: Load Full Content from Hostinger JSON ---
export const syncSettingsFromHost = async () => {
    try {
        console.log("[Sync] Starting sync from Hostinger...");
        const store = getAdminStore();
        let hasUpdates = false;

        localStorage.setItem('ar_typing_sync_status', 'Synchronizing...');

        const fetchData = async (file: string) => {
            try {
                const url = `https://typingnexus.in/data/${file}.json?t=${Date.now()}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    console.log(`[Sync] Success: ${file}.json fetched.`);
                    return data;
                }
                console.warn(`[Sync] ${file}.json not found (Status: ${res.status})`);
            } catch (e) {
                console.error(`[Sync] Error fetching ${file}.json:`, e);
            }
            return null;
        };

        const settingsData = await fetchData('settings');
        if (settingsData && Object.keys(settingsData).length > 0) {
            if (settingsData.settings) store.settings = { ...store.settings, ...settingsData.settings };
            if (settingsData.categories) store.categories = settingsData.categories;
            if (settingsData.plans) store.plans = settingsData.plans;
            hasUpdates = true;
        }

        const contentData = await fetchData('content');
        if (contentData && Object.keys(contentData).length > 0) {
            // Defensive: Only overwrite if the fetched data actually contains keys
            // This prevents complete data loss if the server returns an empty object {}
            if (contentData.exams && contentData.exams.length > 0) store.exams = contentData.exams;
            if (contentData.rules) store.rules = contentData.rules;
            if (contentData.passages) store.passages = contentData.passages;
            if (contentData.examProfiles) store.examProfiles = contentData.examProfiles;
            if (contentData.contentLibrary) store.contentLibrary = contentData.contentLibrary;
            if (contentData.courses) store.courses = contentData.courses;
            if (contentData.cptTests) store.cptTests = contentData.cptTests;
            if (contentData.blogs) store.blogs = contentData.blogs;
            if (contentData.notifications) store.notifications = contentData.notifications;
            hasUpdates = true;
        }

        if (hasUpdates) {
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
            localStorage.setItem('ar_typing_sync_status', `Last Synced: ${new Date().toLocaleTimeString()}`);
            window.dispatchEvent(new Event('adminStoreUpdate'));
            console.log("[Sync] Local store updated with server data.");
            return true;
        } else {
            localStorage.setItem('ar_typing_sync_status', 'Up to date');
        }
    } catch (e) {
        console.error("Sync Error:", e);
        localStorage.setItem('ar_typing_sync_status', 'Sync Failed');
    }
    return false;
};

// --- Modular Save Helper ---
// --- Modular Save Helper ---
const saveToApi = async (type: string, data: any) => {
    try {
        const apiUrl = 'https://typingnexus.in/save_settings.php';
        console.log(`[API] Saving ${type} to ${apiUrl}...`);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(`[API Error] Status: ${response.status}`, result);
            throw new Error(result.error || `Server responded with ${response.status}`);
        }

        console.log(`[API Success] ${type} saved:`, result);
        return true;
    } catch (e: any) {
        console.error(`[API Fatal Error] ${type} save failed:`, e);
        throw e; // Re-throw to be handled by saveAdminStore
    }
};

// [UPDATED] Save Admin Store - Now with better error handling
export const saveAdminStore = async (store: AdminStore) => {
    try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
        window.dispatchEvent(new Event('adminStoreUpdate'));

        const results = await Promise.all([
            saveToApi('settings', {
                settings: store.settings,
                categories: store.categories,
                plans: store.plans
            }),
            saveToApi('content', {
                exams: store.exams,
                rules: store.rules,
                passages: store.passages,
                examProfiles: store.examProfiles,
                contentLibrary: store.contentLibrary,
                courses: store.courses,
                cptTests: store.cptTests,
                blogs: store.blogs,
                notifications: store.notifications
            })
        ]);

        return results.every(r => r === true);
    } catch (error: any) {
        console.error("Critical Save Error:", error);
        alert(`Failed to sync changes to server: ${error.message}\nYour changes are saved locally but won't appear on the website until sync is successful.`);
        return false;
    }
};

// --- Volatile Results Helper ---
export const addLiveResult = (result: Omit<ExamResult, 'id' | 'timestamp'>) => {
    const store = getAdminStore();
    const newResult: ExamResult = {
        ...result,
        id: Date.now(),
        timestamp: Date.now()
    };
    // Keep most recent 50 results to avoid massive localStorage growth
    store.results = [newResult, ...(store.results || [])].slice(0, 50);
    saveAdminStore(store);
};

// --- Helper Actions ---

export const deleteUser = (id: string) => {
    const store = getAdminStore();
    store.users = store.users.filter(u => u.id.toString() === id.toString());
    saveAdminStore(store);
};

export const toggleUserStatus = (id: string) => {
    const store = getAdminStore();
    store.users = store.users.map(u => u.id.toString() === id.toString() ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u);
    saveAdminStore(store);
};

export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// --- Auth Note ---
// registerUser and loginUser have been moved to context/AuthContext.tsx using Supabase.

export const getUserById = (id: string): AdminUser | null => {
    const store = getAdminStore();
    return store.users.find(u => u.id.toString() === id.toString()) || null;
};

export const updateUserProfile = (id: string, updates: Partial<AdminUser>): AdminUser | null => {
    const store = getAdminStore();
    const userIndex = store.users.findIndex(u => u.id.toString() === id.toString());
    if (userIndex === -1) return null;
    store.users[userIndex] = { ...store.users[userIndex], ...updates };
    saveAdminStore(store);
    return store.users[userIndex];
};

// --- NEW: Update App User in Supabase ---
export const updateAppUser = async (id: string, updates: Partial<AdminUser>): Promise<boolean> => {
    try {
        console.log(`Updating Supabase User ${id}:`, updates);

        // Prepare DB-friendly updates
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name; // 'name' column in profiles
        if (updates.plan) dbUpdates.plan = updates.plan;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.purchasedPackIds) dbUpdates.purchasedPackIds = updates.purchasedPackIds;

        const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error("Supabase Update Error:", error);
            // alert(`Failed to update user in database: ${error.message}`);
            return false;
        }

        // Also update local cache if it exists
        updateUserProfile(id, updates);
        return true;
    } catch (e) {
        console.error("Exception updating app user:", e);
        return false;
    }
};

// --- NEW: Send Password Reset Email ---
export const sendPasswordReset = async (email: string): Promise<{ success: boolean; msg: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login#reset=true',
    });

    if (error) return { success: false, msg: error.message };
    return { success: true, msg: `Password reset email sent to ${email}` };
};

// --- NEW: Fetch All App Users (from Supabase) ---
export const fetchAppUsers = async (): Promise<AdminUser[]> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false }); // Changed from 'joined' to 'created_at'

        if (error) {
            console.error("Error fetching app users:", error);
            return [];
        }

        return data.map((u: any) => ({
            ...u,
            joined: u.created_at || u.joined || new Date().toISOString(),
            plan: u.plan || 'Free',
            role: u.role || 'User',
            status: u.status || 'Active',
            authMethod: u.authMethod || 'Email',
            purchasedPackIds: u.purchasedPackIds || []
        })) as AdminUser[];
    } catch (e) {
        console.error("Exception fetching app users:", e);
        return [];
    }
};

// Check if user has access to premium content
export const hasProAccess = (user: AdminUser | null): boolean => {
    if (!user) return false;
    // Admins and Super Admins always have full access
    if (user.role === 'Admin' || user.role === 'Super Admin') return true;
    return user.plan.includes('Pro') || user.plan.includes('Premium');
};

export const hasPackAccess = (user: AdminUser | null, packId: string): boolean => {
    if (!user) return false;
    if (hasProAccess(user)) return true; // Pro users get everything? Or maybe not. Let's assume yes for now or check requirements.
    // If Pro users only get "Pro" exams, then maybe specific packs are separate.
    // For now, let's say Admin/SuperAdmin have access.
    if (user.role === 'Admin' || user.role === 'Super Admin') return true;

    return user.purchasedPackIds?.includes(packId) || false;
};

export const hasTestAccess = (user: AdminUser | null, testId: number): boolean => {
    const store = getAdminStore();

    // 0. Check if test is Free
    const test = store.cptTests.find(t => t.id === testId);
    if (test?.isFree) return true;

    // 1. No user? No access
    if (!user) return false;

    // 2. Pro Access
    if (hasProAccess(user)) return true;

    // 3. Admin/Super Admin
    if (user.role === 'Admin' || user.role === 'Super Admin') return true;

    // 4. Check if test is part of any purchased pack
    const purchasedPackIds = user.purchasedPackIds || [];

    // Find all packs that contain this testId
    const packsWithTest = store.comboPacks.filter(p => p.content.cptTestIds.includes(testId));

    // Check if user owns any of them
    const hasAccessViaPack = packsWithTest.some(p => purchasedPackIds.includes(p.id));

    return hasAccessViaPack;
};

