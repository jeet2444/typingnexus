
import { UserProfileData, DEFAULT_USER } from './userData';
import { supabase } from './supabaseClient';
import { INITIAL_CPT_EXCEL, INITIAL_CPT_WORD } from './initialCptData';

// --- Types ---

export interface AdminUser {
    id: string; // Changed to string for Supabase UUID
    name: string;
    email: string;
    password?: string; // Optional now with Supabase
    plan: string;
    joined: string;
    status: 'Active' | 'Inactive';
    authMethod: string;
    role: 'Super Admin' | 'Admin' | 'User' | 'Moderator';
    purchasedPackIds?: string[]; // IDs of ComboPacks purchased
    last_seen?: string; // ISO Timestamp of last activity
}

export interface AdminRule {
    id: number;
    name: string;
    category: string;
    duration: number; // in minutes
    language: string;
    font: string;

    // Advanced Penalty Logic
    backspace: 'Enabled' | 'Disabled';
    highlighting: boolean;
    penaltyPerFullMistake: number; // e.g., 50 mistakes deducted from words
    penaltyPerHalfMistake: number;
    maxIgnoredErrors: number; // % or absolute count
    qualifyingSpeed: number; // Minimum WPM to pass
    qualifyingAccuracy: number; // Minimum Accuracy %

    formula: string; // "Standard", "Net Speed", "Accuracy Only"
    details: string;
}

export interface AdminExam {
    id: number;
    title: string;
    language: string;
    difficulty: string;
    plays: number;
    ruleSet: string;
    ruleId: number;
    liveStatus?: 'Live' | 'Upcoming' | 'Past';
    liveDate?: string;
    status: 'Published' | 'Draft' | 'Archived';
    content?: string;
    contentTitle?: string;
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
    // Basic Info
    siteName: string;
    siteTagline: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;

    // Header/Navbar Settings
    logoUrl: string;
    primaryColor: string;
    navLinks: { label: string; href: string; visible: boolean; subLinks?: { label: string; href: string; visible: boolean }[] }[];

    // Footer Settings
    footerText: string;
    footerLinks: { label: string; href: string }[];
    socialLinks: { platform: string; url: string; visible: boolean }[];
    copyrightText: string;
    version?: number; // Added for cache busting/updates


    // Feature Toggles
    showPracticeExams: boolean;
    showTypingTutorial: boolean;
    showKeyboardDrill: boolean;
    showTypingTests: boolean;
    showBlog: boolean;
    showPricing: boolean;
    showRSSBPack: boolean;
    showGamification: boolean; // NEW
    showLeaderboard: boolean;  // NEW

    // Hero Section
    heroTitle: string;
    heroSubtitle: string;
    heroCTAText: string;
    heroCTALink: string;

    // Featured Exam Widget (Admin Controlled)
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

    // Payment Gateway Config
    upiId: string;
    razorpayKeyId: string;
    razorpaySecret: string;
    stripeKey: string;
}

export interface ExamResult {
    id: number;
    studentName: string;
    examTitle: string;
    date: string;
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

interface AdminStore {
    users: AdminUser[];
    rules: AdminRule[];
    exams: AdminExam[];
    payments: AdminPayment[];
    coupons: Coupon[];
    ads: Ad[];
    packages: PricingPackage[];
    blogs: BlogPost[];

    // Existing Modules
    settings: SiteSettings;
    results: ExamResult[];
    enquiries: Enquiry[];
    invoices: Invoice[];
    notifications: Notification[];
    media: MediaItem[];

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
    // Basic Info
    siteName: "TypingNexus",
    siteTagline: "India's #1 Typing & Computer Efficiency Platform",
    supportEmail: "support@typingnexus.in",
    maintenanceMode: false,
    allowRegistrations: true,
    version: 12, // Increment for Live Test & Exam Logic



    // Header/Navbar Settings
    logoUrl: "",
    primaryColor: "#2563eb",
    navLinks: [
        { label: "Home", href: "/", visible: true },
        {
            label: "Learn",
            href: "/learn",
            visible: true,
            subLinks: [
                { label: "Key Drilling", href: "/learn", visible: true },
                { label: "Keyboard Drilling", href: "/keyboard", visible: true }
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

    // Footer Settings
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
    copyrightText: "© 2026 TypingNexus.in. All rights reserved.",

    // Feature Toggles
    showPracticeExams: true,
    showTypingTutorial: true,
    showKeyboardDrill: true,
    showTypingTests: true,
    showBlog: true,
    showPricing: true,
    showRSSBPack: true,
    showGamification: true,
    showLeaderboard: true,
    featuredExamWidget: {
        visible: false,
        title: "Featured Exam",
        examId: null,
        description: ""
    },
    featuredItems: [],

    // Hero Section
    heroTitle: "Welcome to TypingNexus",
    heroSubtitle: "Your ultimate platform for typing mastery.",
    heroCTAText: "Start Learning",
    heroCTALink: "/learn",

    // Payment Gateway Config
    upiId: "",
    razorpayKeyId: "",
    razorpaySecret: "",
    stripeKey: ""
};

const INITIAL_RESULTS: ExamResult[] = [];

const INITIAL_ENQUIRIES: Enquiry[] = [];

const INITIAL_USERS: AdminUser[] = [];

const INITIAL_RULES: AdminRule[] = [];

const INITIAL_EXAMS: AdminExam[] = [];

const INITIAL_PAYMENTS: AdminPayment[] = [];

const INITIAL_PACKAGES: PricingPackage[] = [];

// --- Store Implementation ---

const ADMIN_STORAGE_KEY = 'ar_typing_admin_store_v2';

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
        exams: INITIAL_EXAMS,
        payments: INITIAL_PAYMENTS,
        coupons: [],
        ads: [],
        packages: INITIAL_PACKAGES,
        blogs: [],
        settings: INITIAL_SETTINGS,
        results: INITIAL_RESULTS,
        enquiries: INITIAL_ENQUIRIES,
        invoices: [],
        notifications: [],
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
                ...storedData.settings,
                ...defaultStore.settings,
                // Ensure new navigation links are prioritized
                navLinks: defaultStore.settings.navLinks,
                // Ensure hero changes are reflected
                heroTitle: defaultStore.settings.heroTitle,
                heroCTAText: defaultStore.settings.heroCTAText,
                heroCTALink: defaultStore.settings.heroCTALink
            };
        }

        return {
            ...defaultStore,
            ...storedData,
            // Core Arrays
            users: usersToUse,
            rules: storedData.rules || defaultStore.rules,
            exams: storedData.exams || defaultStore.exams,
            payments: storedData.payments || defaultStore.payments,
            // New Modules (ensure they exist)
            coupons: storedData.coupons || defaultStore.coupons,
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
            userProgress: storedData.userProgress || defaultStore.userProgress,
            cptTests: storedData.cptTests || defaultStore.cptTests,
            comboPacks: storedData.comboPacks || defaultStore.comboPacks
        };
    }

    // First time load
    saveAdminStore(defaultStore);
    return defaultStore;
};

export const saveAdminStore = async (data: AdminStore) => {
    try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));

        // --- Hostinger Sync (PHP Backend) ---
        // Save content (Exams, Rules, Blog, Settings, etc.) to local JSON file on the server
        // We EXCLUDE 'users' as per requirement (keep auth in cloud/local-secure)
        const hostingerPayload = {
            settings: data.settings,
            rules: data.rules,
            exams: data.exams,
            ads: data.ads,
            coupons: data.coupons,
            invoices: data.invoices,
            enquiries: data.enquiries,
            notifications: data.notifications,
            media: data.media,
            passages: data.passages,
            certificateTemplates: data.certificateTemplates,
            certificateCriteria: data.certificateCriteria,
            achievements: data.achievements,
            gamificationSettings: data.gamificationSettings,
            cptTests: data.cptTests,
            comboPacks: data.comboPacks
        };

        if (data.settings) { // Simple check to ensure we have data
            try {
                // CRITICAL: Always target the MAIN domain, even if on admin subdomain
                const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
                const saveUrl = isLocal ? '/save_settings.php' : 'https://typingnexus.in/save_settings.php';

                const response = await fetch(saveUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(hostingerPayload)
                });

                if (!response.ok) {
                    const errText = await response.text();
                    console.warn(`PHP Save Failed: ${response.status} ${response.statusText}`, errText);
                    // Only alert if we aren't just spamming saves (though saves are usually manual)
                    // alert("Warning: Settings NOT saved to website. Hostinger save failed.");
                } else {
                    console.log("Full Content saved to Hostinger via " + saveUrl);
                }
            } catch (err) {
                console.warn("Hostinger Save Network Error:", err);
                alert("Network Error: Could not reach website to save content.");
            }
        }

        // Dispatch event for local updates (same window)
        window.dispatchEvent(new Event('adminStoreUpdate'));
    } catch (error) {
        console.error("Failed to save admin store:", error);
    }
};

// --- NEW: Load Full Content from Hostinger JSON ---
export const syncSettingsFromHost = async () => {
    try {
        // Fetch from the static JSON file served by Hostinger
        const response = await fetch('/settings.json?t=' + Date.now()); // Cache bust

        if (response.ok) {
            const externalData = await response.json();
            if (externalData) {
                const store = getAdminStore();

                // Merge external data into local store
                // We trust Hostinger data for content
                if (externalData.settings) store.settings = { ...store.settings, ...externalData.settings };
                if (externalData.rules) store.rules = externalData.rules;
                if (externalData.exams) store.exams = externalData.exams;
                if (externalData.ads) store.ads = externalData.ads;
                if (externalData.coupons) store.coupons = externalData.coupons;
                if (externalData.invoices) store.invoices = externalData.invoices;
                if (externalData.enquiries) store.enquiries = externalData.enquiries;
                if (externalData.notifications) store.notifications = externalData.notifications;
                if (externalData.media) store.media = externalData.media;
                if (externalData.passages) store.passages = externalData.passages;
                if (externalData.certificateTemplates) store.certificateTemplates = externalData.certificateTemplates;
                if (externalData.certificateCriteria) store.certificateCriteria = externalData.certificateCriteria;
                if (externalData.achievements) store.achievements = externalData.achievements;
                if (externalData.gamificationSettings) store.gamificationSettings = externalData.gamificationSettings;
                if (externalData.cptTests) store.cptTests = externalData.cptTests;
                if (externalData.comboPacks) store.comboPacks = externalData.comboPacks;

                localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
                window.dispatchEvent(new Event('adminStoreUpdate'));
                return true;
            }
        }
    } catch (e) {
        console.error("Hostinger Sync Error:", e);
    }
    return false;
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
    saveAdminStore(store);
    return store.users[userIndex];
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

