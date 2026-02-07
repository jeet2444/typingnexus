
export interface ActivityLog {
    id: string;
    adminName: string; // The admin who performed the action
    action: string;    // e.g., "User Updated", "Settings Changed"
    details: string;   // e.g., "Changed plan for Rahul to Pro"
    timestamp: string;
    type: 'info' | 'warning' | 'danger' | 'success';
}

const LOG_STORAGE_KEY = 'tn_admin_logs';

export const getAdminLogs = (): ActivityLog[] => {
    try {
        const stored = localStorage.getItem(LOG_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const addAdminLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    try {
        const logs = getAdminLogs();
        const newLog: ActivityLog = {
            ...log,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        };
        // Keep only last 100 logs
        const updatedLogs = [newLog, ...logs].slice(0, 100);
        localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
        return newLog;
    } catch (e) {
        console.error("Failed to save log", e);
        return null;
    }
};

export const clearAdminLogs = () => {
    localStorage.removeItem(LOG_STORAGE_KEY);
};
