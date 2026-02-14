import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const { login, signup, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSetup, setIsSetup] = useState(false);

    const toggleSetupMode = () => {
        setIsSetup(!isSetup);
        setError(null);
        if (!isSetup) {
            setEmail('mahijeet@typingnexus.in');
            setPassword('');
        } else {
            setEmail('');
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const adminEmail = 'mahijeet@typingnexus.in';
            const res = await signup('Mahijeet', adminEmail, password);
            if (res.success) {
                alert('Admin account created successfully! Please log in now.');
                setIsSetup(false);
                setEmail(adminEmail);
                setPassword('');
            } else {
                alert('Creation Failed: ' + res.error);
                setError(res.error || 'Creation failed');
            }
        } catch (e: any) {
            alert('Error: ' + e.message);
            setError(e.message);
        }
        setLoading(false);
    };

    // Redirect to dashboard if already logged in as admin
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            const isPathBased = window.location.pathname.startsWith('/admin');
            navigate(isPathBased ? '/admin' : '/dashboard');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Auto-handle 'Mahijeet' username
        let loginEmail = email;
        const isMahijeet = email.toLowerCase() === 'mahijeet';
        if (isMahijeet) {
            loginEmail = 'mahijeet@typingnexus.in';
        }

        try {
            // 1. Attempt Login first
            const result = await login(loginEmail, password);

            if (result.success) {
                // Login successful - Force redirect immediately
                const isPathBased = window.location.pathname.startsWith('/admin');
                const target = isPathBased ? '/admin' : '/dashboard';
                console.log("DEBUG [AdminLogin] Login Success, Navigating to:", target);
                navigate(target);
                return;
            }

            if (!result.success) {
                const msg = result.error || 'Invalid credentials';
                setError(msg);
                setLoading(false);
            }
            setLoading(false);

        } catch (err: any) {
            alert("Login Exception: " + (err.message || String(err)));
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    const { currentUser } = useAuth();
    React.useEffect(() => {
        if (currentUser && !isAdmin && loading) {
            const timer = setTimeout(() => {
                if (loading) {
                    setError('Login successful, but you do not have Admin permissions.');
                    setLoading(false);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentUser, isAdmin, loading]);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
            {/* Ambient Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

            <div className="mb-8 relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-900 border border-gray-800 text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4">
                    TN
                </div>
                <h1 className="font-display font-bold text-3xl tracking-tight text-white">
                    Secure<span className="text-brand-purple">Portal</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Restricted Access • Authorized Personnel Only</p>
            </div>

            <div className="w-full max-w-[400px] bg-gray-900/60 backdrop-blur-xl p-8 border border-gray-800 rounded-2xl shadow-2xl relative z-10">
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-200 flex items-start gap-3">
                        <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {!isSetup ? (
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate autoComplete="off">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-purple transition-colors" />
                                <input
                                    type="text"
                                    name="admin_username_field_no_autofill"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm font-medium"
                                    placeholder="Username or Email"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Key</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-purple transition-colors" />
                                <input
                                    type="password"
                                    name="admin_password_field_no_autofill"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm font-medium"
                                    placeholder="Password"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 border-gray-700 rounded bg-gray-800 text-brand-purple focus:ring-offset-gray-900" />
                                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Remember Session</span>
                            </label>
                            <button
                                type="button"
                                onClick={toggleSetupMode}
                                className="text-xs text-brand-purple font-bold hover:text-white transition-colors"
                            >
                                First Time? <span className="underline">Setup Admin</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-500 hover:to-purple-500 text-white py-3 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Authenticating...' : (
                                <>
                                    Access System <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateAdmin} className="space-y-5 relative z-10">
                        <div className="p-4 bg-blue-900/10 border border-blue-900/30 text-blue-200 text-xs rounded-xl mb-4 italic">
                            <span className="font-bold">System Initialization:</span> Registering primary admin role for <strong className="text-blue-400">mahijeet@typingnexus.in</strong>.
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Create Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-brand-purple transition-all"
                                placeholder="Minimum 8 characters"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-2">
                            <button
                                type="button"
                                onClick={toggleSetupMode}
                                className="text-xs text-gray-500 font-bold hover:text-white transition-colors"
                            >
                                ABORT
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
                            >
                                {loading ? 'INITIALIZING...' : 'CREATE ADMIN'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
                <a href="/" className="text-xs font-bold text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-transparent hover:border-gray-800 hover:bg-gray-900">
                    <ArrowRight size={12} className="rotate-180" /> Return to Website
                </a>
                <p className="text-[10px] text-gray-600 font-mono">
                    SECURED CONNECTION • v2.5.0 (Secure)
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
