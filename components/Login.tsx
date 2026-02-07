import React, { useState } from 'react';
import { ArrowRight, AlertCircle, LogIn, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState<{ success?: boolean; error?: string }>({});
    const { login, resendConfirmationEmail, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        const result = await login(formData.email, formData.password);
        setIsLoading(false);

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.error || 'Login failed');
            setResendStatus({});
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const result = await signInWithGoogle();
        if (!result.success) {
            setError(result.error || 'Google login failed');
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!formData.email) return;
        setIsLoading(true);
        const result = await resendConfirmationEmail(formData.email);
        setIsLoading(false);
        setResendStatus(result);
        if (result.success) {
            setError(''); // Clear error if resend was triggered
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple blur-[120px] rounded-full"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden border border-gray-800 relative z-10 bg-gray-900/80 backdrop-blur-xl">

                {/* Left Side: Visuals */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-black to-gray-900 relative border-r border-gray-800">
                    <div>
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                            <LogIn className="text-white" size={24} />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
                            Resume Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-purple">Mission</span>
                        </h1>
                        <p className="text-gray-400 leading-relaxed">
                            Log in to access your dashboard, review performance analytics, and continue your training.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-xl">
                        <p className="font-bold text-sm text-gray-200">"Consistency is the code to mastery."</p>
                        <div className="mt-2 text-xs flex items-center gap-2">
                            <div className="w-5 h-5 bg-brand-purple rounded-full flex items-center justify-center text-[10px] font-bold text-white">TN</div>
                            <span className="text-gray-400">Typing Nexus System</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12 bg-white/5 backdrop-blur-md flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white font-display mb-2">Access Portal</h2>
                        <p className="text-sm text-gray-400">Enter your secure credentials to verify identity.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                            {error.toLowerCase().includes('not confirmed') && (
                                <button
                                    onClick={handleResendEmail}
                                    type="button"
                                    className="text-xs font-bold text-blue-400 hover:text-white transition-colors underline text-left ml-7"
                                >
                                    Resend confirmation email?
                                </button>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-purple transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-medium"
                                placeholder="Email Address"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-purple transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-medium"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-brand-purple text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? 'Decrypting Access...' : 'Authenticate'}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-500 font-bold">Or sync with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full py-3 px-4 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        New Recruit? <Link to="/sign-up" className="text-brand-purple font-bold hover:text-white transition-colors ml-1">Initialize Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
