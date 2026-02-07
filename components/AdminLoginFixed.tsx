import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLoginFixed: React.FC = () => {
    const { login, signup, isAdmin } = useAuth();
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
            setPassword('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        let loginEmail = email;
        if (email.toLowerCase() === 'mahijeet') {
            loginEmail = 'mahijeet@typingnexus.in';
        }
        try {
            const result = await login(loginEmail, password);
            if (!result.success) {
                const msg = result.error || 'Invalid credentials';
                setError(msg);
                setLoading(false);
            }
        } catch (err: any) {
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
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans">
            <style>{`
                body { background-color: #030712; }
                .glow-purple { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2); }
                .neon-border { border: 1px solid rgba(168, 85, 247, 0.3); }
            `}</style>

            <div className="mb-8 animate-in fade-in slide-in-from-top duration-700">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-900 border-2 border-brand-purple rounded-2xl flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(168,85,247,0.3)] text-white">TN</div>
                    <div className="text-center">
                        <h1 className="font-display font-black text-3xl tracking-tighter text-white">
                            ADMIN<span className="text-brand-purple">NEXUS</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Management Portal v2.0</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[400px] bg-gray-900/50 backdrop-blur-xl p-8 border border-gray-800 rounded-2xl glow-purple relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldAlert size={120} />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-xs text-red-200 flex items-start gap-3 animate-in shake duration-500">
                        <ShieldAlert size={18} className="text-red-500 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {!isSetup ? (
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Identity Token / Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-gray-700"
                                    placeholder="Enter username or email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Security Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-gray-700"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={toggleSetupMode}
                                className="text-xs text-brand-purple font-bold hover:text-white transition-colors"
                            >
                                First Time? <span className="underline">Setup Admin</span>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group bg-brand-purple hover:bg-purple-500 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'ACCESSING...' : 'LOGIN'}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
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

            <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in duration-1000">
                <Link to="/" className="text-xs text-gray-500 hover:text-brand-purple transition-colors font-bold tracking-widest flex items-center gap-2">
                    <ArrowRight size={14} className="rotate-180" /> RETURN TO SITE
                </Link>
                <div className="h-px w-20 bg-gray-800"></div>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.5em]">Nexus Security Standard © 2026</p>
            </div>
        </div>
    );
};

export default AdminLoginFixed;
