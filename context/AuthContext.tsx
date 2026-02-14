import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { AdminUser, hasProAccess } from '../utils/adminStore';

interface AuthContextType {
    currentUser: AdminUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    hasPremiumAccess: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<AdminUser>) => Promise<boolean>;
    resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signInWithPhone: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
    verifyPhoneOtp: (phoneNumber: string, token: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// CRITICAL: Capture hash immediately when module loads, before React even mounts
const globalMountHash = typeof window !== 'undefined' ? window.location.hash : '';
console.log("Global Module High-Priority Hash Capture:", globalMountHash);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Capture hash immediately on mount to avoid router stripping it
    // Use the global one if local one is empty
    const [mountHash] = useState(() => globalMountHash || window.location.hash);

    useEffect(() => {
        let subscription: any = null;

        const initAuth = async () => {
            try {
                // 1. Check for Auto-Login Session in URL (from Admin Panel)
                // Use the hash captured at MOUNT time, not current execution time
                const hash = mountHash;
                console.log("Captured Mount Hash:", hash);

                if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
                    console.log("Auth fragment detected in URL");
                    const params = new URLSearchParams(hash.substring(1).replace(/#/g, ''));
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    console.log("Tokens found?", !!accessToken, !!refreshToken);

                    if (accessToken === 'emergency-bypass') {
                        console.log("Emergency Golden Ticket accepted! Granting Super Admin access...");
                        localStorage.setItem('tn_admin_bypass', 'true'); // Persist immediately

                        const superAdminUser = {
                            id: 'emergency-bypass-id',
                            email: 'mahijeet@typingnexus.in',
                            name: 'Mahijeet',
                            role: 'Super Admin',
                            plan: 'Premium',
                            status: 'Active',
                            joined: new Date().toLocaleDateString()
                        };

                        setCurrentUser(superAdminUser as any);

                        // Clear URL but keep state
                        window.history.replaceState(null, '', window.location.pathname + window.location.search);
                        setLoading(false);
                        return;
                    }

                    if (accessToken) {
                        console.log("Injecting session from URL...");
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || ''
                        });

                        if (error) console.error("setSession Error:", error);

                        if (!error && data.user) {
                            console.log("Session injected successfully for:", data.user.email);

                            // Delay clearing hash slightly to ensure debuggability if needed (optional)
                            window.history.replaceState(null, '', window.location.pathname + window.location.search);
                            await fetchProfile(data.user.id, data.user.email || '');
                            setLoading(false);
                            return; // Stop here if auto-login succeeded
                        }
                    }
                }

                // 2. Check for Emergency Bypass persistence
                if (localStorage.getItem('tn_admin_bypass') === 'true') {
                    setCurrentUser({
                        id: 'emergency-bypass-id',
                        email: 'mahijeet@typingnexus.in',
                        name: 'Mahijeet',
                        role: 'Super Admin',
                        plan: 'Premium',
                        status: 'Active',
                        joined: new Date().toLocaleDateString()
                    });
                    setLoading(false);
                } else {
                    // 3. Regular Session Check
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        await fetchProfile(session.user.id, session.user.email || '');
                    }
                    setLoading(false);
                }

                // 4. Setup Auth Change Listener AFTER initial check
                const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    console.log("Auth State Change:", event);
                    if (session?.user) {
                        await fetchProfile(session.user.id, session.user.email || '');
                    } else if (event === 'SIGNED_OUT') {
                        setCurrentUser(null);
                        localStorage.removeItem('tn_admin_bypass');
                    }
                    setLoading(false);
                });
                subscription = sub;

            } catch (err) {
                console.error("Auth Init Error:", err);
                setLoading(false);
            }
        };

        initAuth();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    // --- HEARTBEAT & LAST SEEN ---
    useEffect(() => {
        if (!currentUser || !currentUser.id) return;

        const updateActivity = async () => {
            try {
                // Update 'last_seen' timestamp. If column fails, we catch error silently.
                await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', currentUser.id);
            } catch (e) {
                // console.warn("Could not update last_seen - column might be missing");
            }
        };

        // Initial update on login
        updateActivity();

        // Periodic update every 2 minutes
        const interval = setInterval(updateActivity, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [currentUser?.id]);

    const fetchProfile = async (uid: string, passedEmail?: string) => {
        try {
            let email = passedEmail || '';
            let metaName = '';
            let phone = ''; // Initialize phone

            // Get fresh user data from Auth if email is missing
            if (!email) {
                const { data: { user } } = await supabase.auth.getUser();
                email = user?.email || '';
                phone = user?.phone || ''; // Capture phone
                metaName = user?.user_metadata?.full_name || '';
                console.log("Fetched user data:", { email, phone, metaName });
            } else {
                console.log("Using passed email:", email);
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            // Check for Mahijeet identity across all possible fields
            const isMahijeet = (email?.toLowerCase() === 'mahijeet@typingnexus.in') ||
                (email?.toLowerCase().includes('mahijeet')) ||
                (data?.name?.toLowerCase() === 'mahijeet') ||
                (data?.email?.toLowerCase() === 'mahijeet@typingnexus.in') ||
                (metaName.toLowerCase() === 'mahijeet') ||
                (phone === '+919876543210') || // Add phone check (replace with actual if known)
                (uid === 'emergency-bypass-id');

            console.log("Is Mahijeet?", isMahijeet, "UID:", uid, "Email:", email);

            if (error || !data) {
                console.log('Profile missing or error:', error?.message);

                // CRITICAL: Even if profile missing, if it's Mahijeet, grant access NOW
                if (isMahijeet) {
                    console.log("Mahijeet detected! Granting immediate session access.");
                    setCurrentUser({
                        id: uid,
                        email: email || 'mahijeet@typingnexus.in',
                        name: 'Mahijeet',
                        role: 'Super Admin',
                        plan: 'Premium',
                        status: 'Active',
                        joined: new Date().toLocaleDateString()
                    });

                    // Create the profile in background so it persists
                    supabase.from('profiles').insert([{
                        id: uid,
                        email: email || 'mahijeet@typingnexus.in',
                        name: 'Mahijeet',
                        role: 'Super Admin',
                        plan: 'Premium',
                        status: 'Active',
                        joined: new Date().toLocaleDateString()
                    }]).then(({ error: e }) => { if (e) console.error("Silent profile creation error:", e); });

                    return;
                }

                // Normal user fallback
                if (error?.code === 'PGRST116' || !data) {
                    const params = new URLSearchParams(window.location.hash.substring(1)); // Check hash too
                    // Try to get name from metadata
                    const { data: { user } } = await supabase.auth.getUser();
                    const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name;
                    const name = metaName || (email ? email.split('@')[0] : 'User');

                    const newProfile = {
                        id: uid,
                        email,
                        name,
                        role: 'User',
                        plan: 'Free',
                        status: 'Active',
                        joined: new Date().toLocaleDateString(),
                        last_seen: new Date().toISOString()
                    };

                    // Use Upsert to be safe against race conditions
                    const { error: insertError } = await supabase.from('profiles').upsert([newProfile]);

                    if (insertError) console.error("Profile creation error:", insertError);

                    setCurrentUser(newProfile as any);
                }
                return;
            }

            // Profile exists, but check if we need to promote them to Super Admin
            if (isMahijeet && data.role !== 'Super Admin') {
                console.log("Promoting Mahijeet profile...");
                const upgraded = { ...data, role: 'Super Admin' as const, plan: 'Premium' };
                setCurrentUser(upgraded as any);

                // Update DB in background
                supabase.from('profiles')
                    .update({ role: 'Super Admin', plan: 'Premium' })
                    .eq('id', uid)
                    .then(({ error: e }) => { if (e) console.error("Promotion DB error:", e); });
                return;
            }

            setCurrentUser({
                ...data,
                joined: data.joined || (data.created_at ? new Date(data.created_at).toLocaleDateString() : new Date().toLocaleDateString())
            } as any);
        } catch (e) {
            console.error("fetchProfile Exception:", e);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Emergency Bypass for Rate-Limited Admin
        if ((email.toLowerCase() === 'mahijeet' || email.toLowerCase() === 'mahijeet@typingnexus.in') && password === 'Ramjiram@555999') {
            localStorage.setItem('tn_admin_bypass', 'true');
            const mahijeet = {
                id: 'emergency-bypass-id',
                email: 'mahijeet@typingnexus.in',
                name: 'Mahijeet',
                role: 'Super Admin' as const,
                plan: 'Premium',
                status: 'Active' as const,
                joined: new Date().toLocaleDateString()
            };
            setCurrentUser(mahijeet);
            return { success: true };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        // Wait for profile to be fetched before returning success
        if (data.user) {
            await fetchProfile(data.user.id, data.user.email || '');
        }

        return { success: true };
    };

    const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) return { success: false, error: error.message };

        // Profile will be created by the fetchProfile in onAuthStateChange or manually here
        if (data.user) {
            const isAdmin = email.toLowerCase() === 'mahijeet@typingnexus.in' || name.toLowerCase() === 'mahijeet';
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        name,
                        email,
                        role: isAdmin ? 'Super Admin' : 'User',
                        status: 'Active',
                        plan: isAdmin ? 'Premium' : 'Free',
                        joined: new Date().toLocaleDateString()
                    }
                ]);

            if (profileError) console.error('Error creating profile:', profileError);

            // Wait for the profile to be fetched into state
            await fetchProfile(data.user.id, email);
        }

        return { success: true };
    };

    const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    };

    const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/profile'
            }
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    };

    const signInWithPhone = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.auth.signInWithOtp({
            phone: phoneNumber,
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    };

    const verifyPhoneOtp = async (phoneNumber: string, token: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNumber,
            token: token,
            type: 'sms'
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
            await fetchProfile(data.user.id, data.user.email || data.user.phone || '');
        }

        return { success: true };
    };

    const logout = async () => {
        localStorage.removeItem('tn_admin_bypass');
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const updateProfile = async (updates: Partial<AdminUser>): Promise<boolean> => {
        if (!currentUser) return false;

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id)
            .select()
            .single();

        if (error) {
            console.error('Update profile error:', error);
            return false;
        }

        if (data) {
            setCurrentUser({
                ...data,
                joined: data.joined || (data.created_at ? new Date(data.created_at).toLocaleDateString() : new Date().toLocaleDateString())
            } as any);
            return true;
        }
        return false;
    };

    const value: AuthContextType = {
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || currentUser?.email === 'mahijeet@typingnexus.in' || currentUser?.name?.toLowerCase() === 'mahijeet',
        hasPremiumAccess: hasProAccess(currentUser),
        login,
        signup,
        logout,
        updateProfile,
        resendConfirmationEmail,
        signInWithGoogle,
        signInWithPhone,
        verifyPhoneOtp
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
