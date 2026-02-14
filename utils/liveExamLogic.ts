import { AdminExam, SiteSettings } from './adminStore';

/**
 * seededRandom
 * 
 * Generates a pseudo-random number between 0 and 1 based on a string seed.
 * This is used to ensure the same "random" exam is selected for all users on the same day.
 */
function seededRandom(seed: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    h >>>= 0;
    return (h / 4294967296);
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

/**
 * getLiveExams
 * 
 * Returns ALL exams that should be displayed as "Live" on the home page.
 * An exam becomes live when:
 * 1. Manual Override: Admin explicitly set liveStatus to 'Live'
 * 2. Auto-Live (24h): Exam is Published and was created more than 24 hours ago
 * 3. Auto-Rotation: If auto-live is enabled and no other exams qualify, 
 *    picks a random published exam based on today's date.
 */
export const getLiveExams = (exams: AdminExam[], settings: SiteSettings): AdminExam[] => {
    if (!exams || exams.length === 0) return [];

    const now = Date.now();
    const liveExams: AdminExam[] = [];

    // 1. Manual overrides — exams explicitly set to 'Live' by admin
    const manualLive = exams.filter(e => e.liveStatus === 'Live');
    liveExams.push(...manualLive);

    // 2. Auto-live after 24 hours — Published exams older than 24h auto-go live
    const autoLive = exams.filter(e => {
        if (e.status !== 'Published') return false;
        if (e.liveStatus === 'Live') return false; // Already added above
        if (e.liveStatus === 'Past') return false; // Explicitly ended

        // If createdAt exists, check if 24 hours have passed
        if (e.createdAt) {
            return (now - e.createdAt) >= TWENTY_FOUR_HOURS;
        }

        // If no createdAt, treat as old exam — auto-live
        return true;
    });

    autoLive.forEach(exam => {
        liveExams.push({
            ...exam,
            liveStatus: 'Live',
            liveDate: new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })
        });
    });

    // 3. If nothing is live yet, use auto-rotation to pick one
    if (liveExams.length === 0) {
        const isAutoEnabled = settings.autoLiveExamEnabled !== false;
        if (isAutoEnabled) {
            const candidates = exams.filter(e => e.status === 'Published');
            if (candidates.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const seed = `${today}-${settings.siteName}`;
                const rand = seededRandom(seed);
                const index = Math.floor(rand * candidates.length);
                liveExams.push({
                    ...candidates[index],
                    liveStatus: 'Live',
                    liveDate: new Date().toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })
                });
            }
        }
    }

    return liveExams;
};

/**
 * getCurrentLiveExam (backward-compatible)
 * 
 * Returns the first live exam. Used for backward compatibility.
 */
export const getCurrentLiveExam = (exams: AdminExam[], settings: SiteSettings): AdminExam | null => {
    const live = getLiveExams(exams, settings);
    return live.length > 0 ? live[0] : null;
};
