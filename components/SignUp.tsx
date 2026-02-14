import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, Check, X, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    if (name === 'password') {
      const criteria = {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };
      setPasswordCriteria(criteria);
      setCanSubmit(Object.values(criteria).every(Boolean));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) return setError('Please enter your full name');
    if (!formData.email) return setError('Email address is required');
    if (!validateEmail(formData.email)) return setError('Invalid email format');

    if (!canSubmit) {
      return setError('Password does not meet security requirements');
    }

    setIsLoading(true);
    const result = await signup(formData.fullName, formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden border border-gray-800 relative z-10 bg-gray-900/80 backdrop-blur-xl">

        {/* Left Side: Visuals */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-black to-gray-900 relative border-r border-gray-800">
          <div>
            <div className="w-12 h-12 bg-brand-purple rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
              Secure Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-pink-500">Digital Legacy</span>
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Join the elite typing community. Track your WPM, compete in global leaderboards, and certify your skills securely.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="text-xs text-gray-300">
                <span className="font-bold text-white">System Status:</span> Operational & Secure
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 bg-white/5 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
            <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-white transition-colors">Sign In instead?</Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                <Check size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Email Sent</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                We've sent a secure confirmation link to <span className="text-white font-bold">{formData.email}</span>. Please verify your identity to continue.
              </p>
              <Link to="/login" className="px-8 py-3 bg-brand-purple text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-900/40 transition-all">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Full Identity</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-medium"
                  placeholder="e.g. Alex Chen"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Email Coordinates</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-medium"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Secure Passkey</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-medium mb-3"
                  placeholder="Create password..."
                />

                {/* Password Criteria Checklist */}
                <div className="grid grid-cols-2 gap-2">
                  <Criterion label="8+ Characters" met={passwordCriteria.length} />
                  <Criterion label="Uppercase Letter" met={passwordCriteria.upper} />
                  <Criterion label="Number (0-9)" met={passwordCriteria.number} />
                  <Criterion label="Special Char (!@#)" met={passwordCriteria.special} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className={`w-full py-4 rounded-xl font-bold bg-gradient-to-r from-brand-purple to-pink-600 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group ${(!canSubmit || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Encrypting Data...' : 'Initialize Account'}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

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
              onClick={handleGoogleSignup}
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
            By joining, you accept our <a href="#" className="underline hover:text-white">Terms of Protocol</a> and <a href="#" className="underline hover:text-white">Privacy Logic</a>.
          </p>
        </div>
      </div>
    </div>
  );
};



const Criterion: React.FC<{ label: string, met: boolean }> = ({ label, met }) => (
  <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-500'}`}>
    {met ? <Check size={12} className="stroke-[3]" /> : <div className="w-3 h-3 rounded-full border border-gray-600"></div>}
    <span className={met ? 'font-bold' : ''}>{label}</span>
  </div>
);

export default SignUp;