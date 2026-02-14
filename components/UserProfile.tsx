import React, { useState, useEffect } from 'react';
import { User, Clock, Award, Settings, TrendingUp, Calendar, Zap, Target, Edit2, Save, MapPin, Star, Crown, ShieldCheck, CreditCard, CheckCircle, History, LogOut } from 'lucide-react';
import { getAllAchievementsStatus, getUserStats, UserStats } from '../utils/achievementSystem';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getUserExamHistory, ExamResultRow } from '../utils/userHistoryStore';

const UserProfile: React.FC = () => {
  const { currentUser, hasPremiumAccess, isAdmin, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'settings' | 'billing'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', location: '' });

  // Real stats from local storage
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [examHistory, setExamHistory] = useState<ExamResultRow[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    // Load dynamic data
    setStats(getUserStats());
    setAchievements(getAllAchievementsStatus());
    if (currentUser) {
      setEditForm({ name: currentUser.name, location: '' });
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    if (!currentUser?.id) return;
    const history = await getUserExamHistory(currentUser.id, 7); // Get last 7 days (or just recent lines)
    setExamHistory(history);

    // Simple calculating for chart: Last 7 attempts or days
    // For visual simplicity, we just take the last 7 WPM scores in chronological order
    // history is sorted desc (newest first).
    const last7 = [...history].reverse().slice(-7);
    const wpms = last7.map(h => h.wpm);
    // Pad with 40s (mock baseline) or 0s if empty
    const padded = Array(Math.max(0, 7 - wpms.length)).fill(0).concat(wpms);
    setWeeklyProgress(padded);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.name.trim()) {
      updateProfile({ name: editForm.name.trim() });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getIcon = (name: string, size = 20, className = "") => {
    const props = { size, className };
    switch (name) {
      case 'zap': return <Zap {...props} />;
      case 'target': return <Target {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'award': return <Award {...props} />;
      case 'trend': return <TrendingUp {...props} />;
      case 'star': return <Star {...props} />;
      default: return <Award {...props} />;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-gray-950 min-h-screen py-8 px-4 relative overflow-hidden text-gray-200">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">

        {/* Left Sidebar: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-brand-purple/20 blur-xl z-0"></div>

            <div className="relative z-10 mx-auto w-24 h-24 rounded-full border-2 border-gray-700 overflow-hidden mb-4 bg-gray-800 flex items-center justify-center shadow-lg shadow-black/50">
              <User size={48} className="text-gray-400" />
            </div>

            <h2 className="text-xl font-display font-bold text-white relative z-10">{currentUser.name}</h2>
            <p className="text-sm text-gray-500 mb-2 relative z-10">{currentUser.email}</p>

            {/* Plan Badge */}
            <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
              {hasPremiumAccess ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/40">
                  <Crown size={12} /> {currentUser.plan}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700">
                  {currentUser.plan}
                </span>
              )}
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-900/50 text-blue-400 border border-blue-800">
                  <ShieldCheck size={12} /> Admin
                </span>
              )}
            </div>

            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-gray-800 pt-4 mt-6">
              Member Since
            </div>
            <div className="text-sm font-bold text-brand-purple mt-1">{currentUser.joined}</div>

            <button onClick={handleLogout} className="mt-6 w-full py-2 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-900/10 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {[
              { id: 'overview', label: 'Overview & Stats', icon: TrendingUp },
              { id: 'history', label: 'Test History', icon: Clock },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'settings', label: 'Profile Settings', icon: Settings },
              { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-6 py-4 font-bold text-sm transition-all border-l-4 ${activeTab === item.id ? 'bg-gray-800 text-white border-brand-purple' : 'text-gray-500 border-transparent hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <item.icon size={18} className={activeTab === item.id ? 'text-brand-purple' : 'text-gray-600'} /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Tests Taken", value: stats.testsCompleted, icon: <FileText size={20} className="text-blue-400" /> },
                  { label: "High Score WPM", value: stats.highestWpm, icon: <Zap size={20} className="text-yellow-400" /> },
                  { label: "Best WPM", value: stats.highestWpm, icon: <Award size={20} className="text-brand-purple" /> },
                  { label: "Best Accuracy", value: `${stats.bestAccuracy}%`, icon: <Target size={20} className="text-green-400" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:border-gray-700 transition-colors">
                    <div className="bg-gray-800 p-3 rounded-full mb-3 shadow-inner">{stat.icon}</div>
                    <div className="text-3xl font-mono font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl shadow-xl">
                <h3 className="font-display font-bold text-lg mb-8 flex items-center gap-2 text-white">
                  <TrendingUp size={20} className="text-brand-purple" /> Last 7 Days Performance (WPM)
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2 border-b border-gray-800 pb-2">
                  {weeklyProgress.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-brand-purple font-bold mb-1">{val}</div>
                      <div
                        className="w-full bg-gray-800 rounded-t-sm transition-all duration-500 hover:bg-brand-purple relative group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        style={{ height: `${(val / 100) * 100}%` }}
                      ></div>
                      <div className="text-[10px] text-gray-600 font-bold">D{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-white">Recent Tests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-800 text-gray-400 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Exam / Module</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Accuracy</th>
                      <th className="px-6 py-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {examHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                          No test history available. <br />
                          <Link to="/practice-exams" className="text-brand-purple hover:underline mt-2 inline-block">Take a test</Link> to see your results here!
                        </td>
                      </tr>
                    ) : (
                      examHistory.map((exam, idx) => (
                        <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 text-gray-300">{new Date(exam.created_at || Date.now()).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-white">{exam.exam_title || 'Typing Test'}</td>
                          <td className="px-6 py-4 text-brand-purple font-bold">{exam.wpm} WPM</td>
                          <td className="px-6 py-4 text-green-400">{exam.accuracy}%</td>
                          <td className="px-6 py-4 text-gray-500">{Math.floor(exam.duration / 60)}:{(exam.duration % 60).toString().padStart(2, '0')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {achievements.map((ach) => (
                <div key={ach.id} className={`border rounded-xl p-5 flex items-start gap-4 transition-all ${ach.unlocked ? 'bg-gray-900 border-brand-purple/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-gray-900/50 border-gray-800 opacity-50 grayscale'}`}>
                  <div className={`p-3 rounded-full ${ach.unlocked ? 'bg-brand-purple text-white shadow-lg' : 'bg-gray-800 text-gray-600'}`}>
                    {getIcon(ach.iconName)}
                  </div>
                  <div>
                    <h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{ach.description}</p>
                    {ach.unlocked && <span className="inline-block mt-3 text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/30">UNLOCKED</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">Edit Profile</h3>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditForm({ name: currentUser.name, location: editForm.location });
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-brand-purple hover:bg-brand-purple/10 px-4 py-2 rounded-lg transition-colors border border-brand-purple/30"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled={true}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subscription Plan</label>
                  <input
                    type="text"
                    value={currentUser.plan}
                    disabled={true}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed mb-2"
                  />
                  {!hasPremiumAccess && (
                    <p className="text-xs text-gray-500">
                      <a href="#/pricing" className="text-brand-purple font-bold hover:text-white transition-colors">Upgrade to Pro</a> to access all content.
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-800 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-600 shadow-lg shadow-purple-900/40"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <BillingTab currentUser={currentUser} hasPremiumAccess={hasPremiumAccess} />
          )}

        </div>
      </div>
    </div>
  );
};

const BillingTab: React.FC<{ currentUser: any, hasPremiumAccess: boolean }> = ({ currentUser, hasPremiumAccess }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBillingData = async () => {
      // Dynamic import to avoid circular dependencies if any
      const { getAdminStore } = await import('../utils/adminStore');
      const store = getAdminStore();

      // Filter invoices for current user (handle both string match and numeric match just in case)
      const userInvoices = (store.invoices || []).filter((inv: any) =>
        inv.userId === currentUser.id || inv.userId == currentUser.id
      );

      const userTransactions = (store.transactions || []).filter((tx: any) =>
        tx.userId === currentUser.id || tx.userId == currentUser.id
      );

      setInvoices(userInvoices);
      setTransactions(userTransactions);
      setLoading(false);
    };

    loadBillingData();
  }, [currentUser.id]);

  const downloadInvoice = (inv: any) => {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
          <html>
            <head>
              <title>Invoice ${inv.id}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #333; }
                .invoice-box { border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.15); max-width: 800px; margin: auto; }
                .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f3f3f3; padding-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f9fafb; font-weight: bold; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
                th, td { padding: 15px; border-bottom: 1px solid #eee; text-align: left; }
                .total { font-size: 1.2rem; font-weight: bold; text-align: right; margin-top: 30px; padding-top: 10px; border-top: 2px solid #333; }
                .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; text-transform: uppercase; }
                .paid { background: #dcfce7; color: #166534; }
                .unpaid { background: #fee2e2; color: #991b1b; }
                .brand { color: #7c3aed; font-size: 1.5rem; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="invoice-box">
                <div class="header">
                  <div>
                    <div class="brand">Typing Nexus</div>
                    <p>contact@typingnexus.in</p>
                  </div>
                  <div style="text-align: right;">
                    <h2 style="margin:0;">INVOICE</h2>
                    <p>#${inv.id}</p>
                    <p><strong>Date:</strong> ${inv.date}</p>
                    <span class="status ${inv.status.toLowerCase() === 'paid' ? 'paid' : 'unpaid'}">${inv.status}</span>
                  </div>
                </div>
                <div>
                  <strong>Billed To:</strong><br/>
                  ${inv.userName}<br/>
                  ${currentUser.email}
                </div>
                <table>
                  <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
                  <tbody>
                    ${inv.items.map((i: any) => `<tr><td>${i.description}</td><td style="text-align:right">₹${i.amount}</td></tr>`).join('')}
                  </tbody>
                </table>
                <div class="total">Total: ₹${inv.total}</div>
                <div style="margin-top: 40px; font-size: 0.8rem; color: #666; text-align: center;">
                  Thank you for your business!
                </div>
              </div>
              <script>window.print();</script>
            </body>
          </html>
      `);
      w.document.close();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Plan Card */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard size={120} className="text-brand-purple" />
        </div>
        <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2 text-white">
          <Crown size={20} className="text-brand-purple" /> Current Subscription
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Plan Name</div>
            <div className="text-3xl font-bold text-white mb-2">{currentUser.plan}</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
              <CheckCircle size={12} /> Active
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Renews On</div>
            <div className="text-xl font-bold text-white mb-2">
              {/* Mock Renewal Date: +1 Month/Year from Joined */}
              {new Date(new Date(currentUser.joined).setFullYear(new Date(currentUser.joined).getFullYear() + 1)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="text-xs text-brand-purple font-medium">Auto-renewal enabled</div>
          </div>
        </div>

        {!hasPremiumAccess && (
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm">
            <div>
              <div className="font-bold text-blue-400">Upgrade to Pro</div>
              <div className="text-xs text-blue-300/70">Unlock unlimited exams and ad-free experience.</div>
            </div>
            <a href="#/pricing" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-colors">
              View Plans
            </a>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
          <h3 className="font-display font-bold text-lg flex items-center gap-2 text-white">
            <History size={20} className="text-gray-400" /> Payment History
          </h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading history...</td></tr>
            ) : invoices.length > 0 || transactions.length > 0 ? (
              <>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-300">{inv.date}</td>
                    <td className="px-6 py-4 font-bold text-white">{inv.items?.[0]?.description || 'Invoice'}</td>
                    <td className="px-6 py-4 text-gray-300">₹{inv.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => downloadInvoice(inv)} className="text-blue-400 font-bold hover:text-white transition-colors text-xs flex items-center gap-1">
                        <CreditCard size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-300">{tx.date}</td>
                    <td className="px-6 py-4 font-bold text-white">{tx.planId || 'Payment'}</td>
                    <td className="px-6 py-4 text-gray-300">₹{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${tx.status === 'Success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs italic">Online Receipt</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No payment history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Helper component for Icon reuse (if needed locally)
const FileText = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default UserProfile;