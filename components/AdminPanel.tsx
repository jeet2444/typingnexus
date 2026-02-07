import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit,
  Activity,
  CheckCircle,
  XCircle,
  LogOut,
  Bell,
  Globe,
  Shield,
  Save,
  CreditCard,
  Scale,
  Music,
  AlertTriangle,
  Receipt,
  Cpu,
  Type,
  Calculator,
  ListChecks,
  Timer,
  Keyboard,
  Eye,
  EyeOff,
  Lock,
  Download,
  RefreshCw,
  Database,
  FileJson,
  Code,
  UploadCloud,
  FileCode,
  X,
  Wallet,
  Ban,
  Megaphone,
  Monitor,
  ArrowRight,
  History,
  ShieldAlert,
  Calendar,
  Filter,
  UserCheck,
  UserMinus,
  Briefcase,
  DollarSign,
  Tag,
  PenTool,
  Image,
  Inbox,
  ClipboardList,
  Zap,
  FileSpreadsheet,
  BarChart3,
  BookOpen,
  ToggleRight,
  Award,
  Trophy,
  FileStack,
  Menu,
  BellRing,
  Server,
  Activity as ActivityIcon,
  PlusCircle,
  ChevronRight,
  Check,
  Smartphone,
  MessageSquare,
  Star,
  Heart,
  Share2,
  PieChart,
  ShieldCheck,
  Layers,
  HardDrive,
  ExternalLink,
  Moon,
  Sun,
  Unlock,
  TrendingUp,
  Send,
  Image as ImageIcon,
  Target,
  Package
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { supabase } from '../utils/supabaseClient';
import {
  AdminUser,
  getAdminStore,
  saveAdminStore,
  deleteUser,
  toggleUserStatus,
  exportToCSV,
  getUserById,
  syncSettingsFromHost,
  updateUserProfile,
  hasProAccess,
  fetchAppUsers
} from '../utils/adminStore';
import { getAdminLogs, addAdminLog, ActivityLog } from '../utils/adminLogs'; // Import Logger
import CPTTestManager from './CPTTestManager';
import ComboPackManager from './ComboPackManager';

const CATEGORIES = {
  SSC: "SSC Standard",
  MARKS: "Marks Based",
  PENALTY: "Penalty System",
  RELAXED: "State Relaxed",
  SPRINT: "Short Sprint",
  NTA: "NTA / Central"
};

const AdminsView: React.FC = () => {
  const [store, setStore] = useState(getAdminStore());
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Admin' });

  const refresh = () => setStore(getAdminStore());

  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.password) return;
    const newUser: any = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      plan: 'Pro Yearly',
      joined: new Date().toISOString().split('T')[0],
      status: 'Active',
      authMethod: 'Email',
      role: formData.role
    };
    const newUsers = [...store.users, newUser];
    saveAdminStore({ ...store, users: newUsers });
    setFormData({ name: '', email: '', password: '', role: 'Admin' });
    refresh();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      saveAdminStore({ ...store, users: store.users.filter(u => u.id !== id) });
      refresh();
    }
  };

  const admins = store.users.filter(u => ['Super Admin', 'Admin', 'Moderator'].includes(u.role));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display">Admin Management</h2>
      <div className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <h3 className="font-bold mb-4">Create New Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          <div className="flex gap-2">
            <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
            <button onClick={handleAdd} className="btn-primary whitespace-nowrap"><Plus size={16} /> Add</button>
          </div>
        </div>
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-800/30">
                <td className="px-6 py-3 font-bold text-gray-200">{admin.name}</td>
                <td className="px-6 py-3 text-gray-400">{admin.email}</td>
                <td className="px-6 py-3"><span className="px-2 py-1 bg-purple-900/20 text-purple-400 rounded text-xs font-bold border border-purple-800">{admin.role}</span></td>
                <td className="px-6 py-3">
                  {admin.role !== 'Super Admin' && (
                    <button onClick={() => handleDelete(admin.id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(getAdminLogs());
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Poll for logs or listen to event? For simplicity, just load once or refresh button
    // Adding a simple refetch capability
  }, []);

  const refreshLogs = () => setLogs(getAdminLogs());

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.type === filter.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <ClipboardList className="text-brand-purple" /> Activity Logs
        </h2>
        <button onClick={refreshLogs} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><RefreshCw size={18} /></button>
      </div>

      <div className="flex gap-2 mb-4">
        {['All', 'Info', 'Success', 'Warning', 'Danger'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === f ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-brand-purple'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr><th className="px-6 py-3">Time</th><th className="px-6 py-3">Admin</th><th className="px-6 py-3">Action</th><th className="px-6 py-3">Details</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLogs.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No logs found.</td></tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-3 text-xs text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-3 font-bold text-gray-200">{log.adminName}</td>
                  <td className={`px-6 py-3 font-bold ${log.type === 'success' ? 'text-green-400' : log.type === 'danger' ? 'text-red-400' : log.type === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>{log.action}</td>
                  <td className="px-6 py-3 text-gray-300">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const DashboardView: React.FC<{ stats: any[] }> = ({ stats }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h2 className="text-2xl font-display font-bold">Platform Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-gray-900/50 backdrop-blur-sm border-gray-800 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold font-display text-gray-100">{stat.value}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${stat.change.includes('+') ? 'text-green-400 bg-green-900/20 border border-green-800' : 'text-orange-400 bg-orange-900/20 border border-orange-800'}`}>
              {stat.change}
            </span>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">{stat.icon}</div>
        </div>
      ))}
    </div>
  </div>
);

const RulesView: React.FC<{ rules: any[], setRules: any }> = ({ rules, setRules }) => {
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>('SSC');
  const [configType, setConfigType] = useState('UI'); // UI, JSON, SCRIPT
  const [advancedCode, setAdvancedCode] = useState('');

  // Combined state for UI builder
  const [newRule, setNewRule] = useState<any>({
    name: '', category: 'SSC Standard', duration: 10, language: 'English', font: 'Arial',
    backspace: 'Enabled', highlighting: false, formula: 'Standard', details: '',
    penaltyPerFullMistake: 1, penaltyPerHalfMistake: 0.5, maxIgnoredErrors: 5, qualifyingSpeed: 35, qualifyingAccuracy: 95
  });

  const loadTemplate = (type: string) => {
    setConfigType(type);
    if (type === 'JSON') {
      setAdvancedCode(`{\n  "strictness": "high",\n  "penaltyPerError": 5,\n  "allowBackspace": false,\n  "ignoredKeys": ["Enter"]\n}`);
    } else if (type === 'SCRIPT') {
      setAdvancedCode(`function calculate(netSpeed, accuracy) {\n  return (netSpeed * 0.8) + (accuracy * 0.2);\n}`);
    }
  };

  const handleEdit = (rule: any) => {
    setEditingId(rule.id);
    setNewRule({ ...rule });
    setShowAddRule(true);
  };

  const handleSaveRule = () => {
    // In advanced mode, we might just save a flag or the code string.
    // For now, mapping UI fields to the rule object.
    const ruleData = { ...newRule, id: editingId || Date.now() };

    if (editingId) {
      setRules(rules.map(r => r.id === editingId ? { ...ruleData, id: editingId } : r));
    } else {
      const newId = rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1;
      setRules([...rules, { ...ruleData, id: newId }]);
    }
    setShowAddRule(false); setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Master Rules Engine</h2>
        <button onClick={() => { setShowAddRule(true); setEditingId(null); }} className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Create Rule Set
        </button>
      </div>

      {showAddRule && (
        <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-brand-purple rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.2)] p-6 mb-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-brand-purple">
              <Calculator size={20} /> {editingId ? 'Edit Rule Configuration' : 'New Rule Configuration'}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setConfigType('UI')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${configType === 'UI' ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>Visual Builder</button>
              <button onClick={() => loadTemplate('JSON')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${configType === 'JSON' ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>JSON Config</button>
              <button onClick={() => loadTemplate('SCRIPT')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${configType === 'SCRIPT' ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>Script (JS)</button>
            </div>
          </div>

          {configType === 'UI' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div><label className="label-sm">Rule Name</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} /></div>
                <div><label className="label-sm">Category</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.category} onChange={e => setNewRule({ ...newRule, category: e.target.value })}>{Object.values(CATEGORIES).map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="label-sm">Duration (min)</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.duration} onChange={e => setNewRule({ ...newRule, duration: Number(e.target.value) })} /></div>
                <div><label className="label-sm">Language</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.language} onChange={e => setNewRule({ ...newRule, language: e.target.value })}><option>English</option><option>Hindi (Remington)</option><option>Hindi (Inscript)</option></select></div>
              </div>
              <div className="space-y-4 bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-bold text-brand-purple text-xs uppercase mb-2">Scoring & Penalty</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label-sm">Full Mistake Wt.</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.penaltyPerFullMistake} onChange={e => setNewRule({ ...newRule, penaltyPerFullMistake: Number(e.target.value) })} /></div>
                  <div><label className="label-sm">Half Mistake Wt.</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.penaltyPerHalfMistake} onChange={e => setNewRule({ ...newRule, penaltyPerHalfMistake: Number(e.target.value) })} /></div>
                  <div><label className="label-sm">Max Ignored %</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.maxIgnoredErrors} onChange={e => setNewRule({ ...newRule, maxIgnoredErrors: Number(e.target.value) })} /></div>
                  <div><label className="label-sm">Backspace</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.backspace} onChange={e => setNewRule({ ...newRule, backspace: e.target.value })}><option>Enabled</option><option>Disabled</option></select></div>
                </div>
              </div>
              <div className="space-y-4 bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Qualifying Criteria</h4>
                <div><label className="label-sm">Min. Speed (WPM)</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.qualifyingSpeed} onChange={e => setNewRule({ ...newRule, qualifyingSpeed: Number(e.target.value) })} /></div>
                <div><label className="label-sm">Min. Accuracy (%)</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newRule.qualifyingAccuracy} onChange={e => setNewRule({ ...newRule, qualifyingAccuracy: Number(e.target.value) })} /></div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 h-64">
              <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                <span className="text-gray-400 text-xs font-mono">{configType === 'JSON' ? 'config.json' : 'calculate.js'}</span>
              </div>
              <textarea value={advancedCode} onChange={e => setAdvancedCode(e.target.value)} className="w-full h-full bg-gray-900 text-green-400 font-mono text-xs p-4 focus:outline-none resize-none"></textarea>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3"><button onClick={() => setShowAddRule(false)} className="btn-secondary">Cancel</button><button onClick={handleSaveRule} className="btn-primary">Save Configuration</button></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map(rule => (
          <div key={rule.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-xl group hover:border-brand-purple transition-all relative backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">{rule.category}</span>
                <h3 className="font-bold text-gray-100">{rule.name}</h3>
              </div>
              <button onClick={() => handleEdit(rule)} className="p-1.5 text-gray-500 hover:text-brand-purple hover:bg-brand-purple/10 rounded transition-colors"><Edit size={16} /></button>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between border-b border-gray-800/50 pb-2"><span>Penalty (Full/Half):</span><span className="font-bold text-gray-200">{rule.penaltyPerFullMistake} / {rule.penaltyPerHalfMistake}</span></div>
              <div className="flex justify-between border-b border-gray-800/50 pb-2"><span>Qualify:</span><span className="font-bold text-gray-200">{rule.qualifyingSpeed} WPM @ {rule.qualifyingAccuracy}%</span></div>
              <div className="flex justify-between"><span>Backspace:</span><span className={`font-bold ${rule.backspace === 'Disabled' ? 'text-red-400' : 'text-green-400'}`}>{rule.backspace}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentView: React.FC<{ exams: any[], setExams: any, rules: any[] }> = ({ exams, setExams, rules }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('English');
  const [ruleId, setRuleId] = useState<number>(1);
  const [status, setStatus] = useState('Published');
  const [liveStatus, setLiveStatus] = useState<'Live' | 'Upcoming' | 'Past'>('Past');
  const [liveDate, setLiveDate] = useState('');
  const [content, setContent] = useState(''); // Added Content Field!

  const handleSave = () => {
    const rule = rules.find(r => r.id === Number(ruleId));
    const examData = {
      title,
      language: lang,
      ruleSet: rule?.name || "Standard",
      ruleId: Number(ruleId),
      status,
      liveStatus,
      liveDate,
      content, // Saving content
      plays: editingId ? exams.find(e => e.id === editingId)?.plays : 0
    };

    if (editingId) {
      setExams(exams.map(e => e.id === editingId ? { ...e, ...examData } : e));
    } else {
      const newId = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1;
      setExams([...exams, { id: newId, ...examData }]);
    }
    setShowAdd(false); setEditingId(null); setTitle(''); setContent(''); setLiveStatus('Past'); setLiveDate('');
  };

  const handleEdit = (exam: any) => {
    setEditingId(exam.id);
    setTitle(exam.title);
    setLang(exam.language);
    setRuleId(exam.ruleId);
    setStatus(exam.status);
    setLiveStatus(exam.liveStatus || 'Past');
    setLiveDate(exam.liveDate || '');
    setContent(exam.content || '');
    setShowAdd(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Exam Management</h2>
        <button onClick={() => { setShowAdd(true); setEditingId(null); setContent(''); setTitle(''); }} className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Add New Exam
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-950 border-2 border-brand-purple rounded-2xl shadow-[0_0_30px_rgba(192,38,211,0.2)] p-8 mb-8 backdrop-blur-md">
          <h3 className="font-bold text-xl mb-6 text-white flex items-center gap-3 border-b border-gray-800 pb-4">
            <FileText size={24} className="text-brand-purple" />
            {editingId ? 'Modify Exam Record' : 'Create New Examination'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="label-sm">Exam Title</label>
              <input type="text" placeholder="e.g. SSC CHSL Mains 2024" value={title} onChange={e => setTitle(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" />
            </div>
            <div>
              <label className="label-sm text-gray-400">Linked Rule Set</label>
              <select value={ruleId} onChange={e => setRuleId(Number(e.target.value))} className="input-field bg-gray-900 border-gray-700 text-white focus:border-brand-purple font-bold">
                {rules.map(r => <option key={r.id} value={r.id}>{r.name} ({r.category})</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Default Language</label>
              <select value={lang} onChange={e => setLang(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple">
                <option>English</option><option>Hindi (Remington)</option><option>Hindi (Inscript)</option>
              </select>
            </div>
            <div>
              <label className="label-sm">Publish Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple">
                <option>Published</option><option>Draft</option><option>Archived</option>
              </select>
            </div>
            <div>
              <label className="label-sm text-gray-400">Live Highlight Status</label>
              <select value={liveStatus} onChange={e => setLiveStatus(e.target.value as any)} className="input-field bg-gray-900 border-gray-700 text-white focus:border-brand-purple font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                <option value="Past">None (Standard)</option>
                <option value="Live">LIVE NOW (Home Highlight)</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="label-sm">Live Date/Time (Display Only)</label>
              <input type="text" placeholder="e.g. Today, 10:00 AM" value={liveDate} onChange={e => setLiveDate(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" />
            </div>
          </div>
          {/* ARTICLE CONTENT EDITOR */}
          <div className="mb-4">
            <label className="label-sm">Typing Content (Article)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-48 font-mono text-sm leading-relaxed"
              placeholder="Paste the exam text paragraph here..."
            ></textarea>
            <p className="text-[10px] text-gray-400 mt-1 text-right">{content.split(' ').length} words • {content.length} characters</p>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-800 pt-6">
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-gray-400 hover:text-white transition-colors">Discard</button>
            <button onClick={handleSave} className="btn-primary shadow-[0_0_15px_rgba(192,38,211,0.3)]">Save Exam Data</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-gray-900/50 border border-gray-800 hover:border-brand-purple/50 rounded-2xl p-6 shadow-xl transition-all group backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm ${exam.status === 'Published' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{exam.status}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(exam)} className="text-gray-400 hover:text-brand-purple p-2 hover:bg-brand-purple/10 rounded-lg transition-colors"><Edit size={16} /></button>
                <button onClick={() => setExams(exams.filter(e => e.id !== exam.id))} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-200 mt-2 text-lg">{exam.title}</h3>
            <div className="mt-6 p-4 bg-gray-950/50 rounded-xl border border-gray-800 space-y-3">
              <div className="flex justify-between items-center text-[11px] tracking-wide">
                <span className="text-gray-500 font-bold uppercase">Language</span>
                <span className="font-bold text-gray-200">{exam.language}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] tracking-wide">
                <span className="text-gray-500 font-bold uppercase">Active Rule</span>
                <span className="font-bold text-brand-purple">{exam.ruleSet}</span>
              </div>
              {exam.liveStatus && exam.liveStatus !== 'Past' && (
                <div className="flex justify-between items-center text-[11px] bg-red-900/20 p-2 rounded border border-red-900/50">
                  <span className="text-red-400 font-bold uppercase">Live Mode</span>
                  <span className="font-bold text-red-500">{exam.liveStatus} {exam.liveDate && `(${exam.liveDate})`}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- NEW FEATURES: Results, Settings, Inquiries ---

const ResultsView: React.FC<{ results: any[] }> = ({ results }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold font-display">Exam Results</h2>
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <tr><th className="px-6 py-3">Student</th><th className="px-6 py-3">Exam</th><th className="px-6 py-3">Speed (Net)</th><th className="px-6 py-3">Accuracy</th><th className="px-6 py-3">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {results.map(r => (
            <tr key={r.id} className="hover:bg-gray-800/30 border-b border-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-200">{r.studentName}</td>
              <td className="px-6 py-4 text-gray-400">{r.examTitle}</td>
              <td className="px-6 py-4 font-mono font-bold text-white">{r.netWPM} WPM</td>
              <td className="px-6 py-4 font-mono text-gray-300">{r.accuracy}%</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${r.status === 'Pass' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsView: React.FC<{ settings: any, setSettings: any }> = ({ settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'branding' | 'hero' | 'widgets' | 'payment' | 'footer'>('widgets');

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const updateNavLink = (index: number, field: string, value: any) => {
    const newLinks = [...(settings.navLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateSetting('navLinks', newLinks);
  };

  const updateSocialLink = (index: number, field: string, value: any) => {
    const newLinks = [...(settings.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateSetting('socialLinks', newLinks);
  };

  const updateFeaturedItem = (index: number, field: string, value: any) => {
    const newItems = [...(settings.featuredItems || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSetting('featuredItems', newItems);
  };

  const addFeaturedItem = () => {
    const newItems = [...(settings.featuredItems || [])];
    newItems.push({
      id: Date.now(),
      title: 'New Featured Item',
      description: 'New Description',
      examId: null,
      visible: true,
      type: 'blue'
    });
    updateSetting('featuredItems', newItems);
  };

  const removeFeaturedItem = (index: number) => {
    const newItems = (settings.featuredItems || []).filter((_: any, i: number) => i !== index);
    updateSetting('featuredItems', newItems);
  };

  const store = getAdminStore();
  const exams = store.exams || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">System Configuration</h2>
          <p className="text-sm text-gray-400">Manage your website's global settings and feature availability</p>
        </div>
        <button
          onClick={async () => {
            await saveAdminStore(getAdminStore());
            alert("Settings Saved to Website (Hostinger) Successfully!");
          }}
          className="btn-primary flex items-center gap-2 shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_25px_rgba(192,38,211,0.5)] transition-all"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 overflow-x-auto pb-0 mb-6">
        {['widgets', 'features', 'payment', 'hero', 'general', 'branding', 'footer'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" />}
          </button>
        ))}
      </div>

      <div className="bg-gray-950/80 p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-8 backdrop-blur-md">

        {/* PAYMENT SETTINGS (New) */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
              <CreditCard size={18} /> Payment Gateways
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-200">Razorpay Configuration</h4>
                <div>
                  <label className="label-sm">Key ID</label>
                  <input
                    className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-mono text-xs"
                    value={settings.razorpayKeyId || ''}
                    onChange={e => updateSetting('razorpayKeyId', e.target.value)}
                    placeholder="rzp_test_..."
                  />
                </div>
                <div>
                  <label className="label-sm">Key Secret</label>
                  <input
                    className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-mono text-xs"
                    type="password"
                    value={settings.razorpaySecret || ''}
                    onChange={e => updateSetting('razorpaySecret', e.target.value)}
                    placeholder="••••••••••••••"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-200">Other Gateways</h4>
                <div>
                  <label className="label-sm">Stripe Publishable Key</label>
                  <input
                    className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-mono text-xs"
                    value={settings.stripeKey || ''}
                    onChange={e => updateSetting('stripeKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="label-sm">UPI ID (Manual Payment)</label>
                  <input
                    className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                    value={settings.upiId || ''}
                    onChange={e => updateSetting('upiId', e.target.value)}
                    placeholder="merchant@upi"
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded border border-yellow-700/50 text-xs text-yellow-200">
              <strong>Note:</strong> These keys will be used for processing payments on the Checkout page. Ensure you use Test keys for development.
            </div>
          </div>
        )}

        {/* WIDGETS CONTROL (New) */}
        {activeTab === 'widgets' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
              <Megaphone size={18} /> Home Page Widgets
            </h3>

            {/* Multi-Featured Items (New) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-200">Call-to-Action Widgets (Multiple)</h4>
                <button onClick={addFeaturedItem} className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-700">
                  <Plus size={14} /> Add New CTA
                </button>
              </div>

              <div className="grid gap-4">
                {(settings.featuredItems || []).map((item: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${item.type === 'blue' ? 'bg-blue-900/10 border-blue-900/30' :
                    item.type === 'purple' ? 'bg-purple-900/10 border-purple-900/30' :
                      item.type === 'green' ? 'bg-green-900/10 border-green-900/30' : 'bg-red-900/10 border-red-900/30'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="label-sm">Title</label>
                          <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={item.title} onChange={e => updateFeaturedItem(idx, 'title', e.target.value)} />
                        </div>
                        <div>
                          <label className="label-sm">Widget Theme</label>
                          <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={item.type} onChange={e => updateFeaturedItem(idx, 'type', e.target.value)}>
                            <option value="blue">Blue (Standard)</option>
                            <option value="purple">Purple (Premium)</option>
                            <option value="green">Green (Success)</option>
                            <option value="red">Red (Urgent)</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={() => removeFeaturedItem(idx)} className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="label-sm">Description/Tagline</label>
                        <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={item.description} onChange={e => updateFeaturedItem(idx, 'description', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label-sm">Link to Exam</label>
                          <select
                            className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                            value={item.examId || ''}
                            onChange={e => updateFeaturedItem(idx, 'examId', e.target.value ? Number(e.target.value) : null)}
                          >
                            <option value="">None (Static Widget)</option>
                            {exams.map((exam: any) => (
                              <option key={exam.id} value={exam.id}>{exam.title}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={item.visible} onChange={e => updateFeaturedItem(idx, 'visible', e.target.checked)} />
                            <span className="text-xs font-bold uppercase text-gray-400">{item.visible ? 'Visible' : 'Hidden'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(settings.featuredItems || []).length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 text-sm">
                    No featured items added. Use the button above to add one.
                  </div>
                )}
              </div>
            </div>

            {/* Gamification & Leaderboard */}
            <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-800/50 grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-brand-purple mb-2">Gamification Widget</h4>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-800 p-2 rounded border border-gray-700">
                  <input type="checkbox" checked={settings.showGamification ?? true} onChange={e => updateSetting('showGamification', e.target.checked)} />
                  <span className="text-sm text-gray-300">Show XP/Level Widget</span>
                </label>
              </div>
              <div>
                <h4 className="font-bold text-brand-purple mb-2">Student Leaderboard</h4>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-800 p-2 rounded border border-gray-700">
                  <input type="checkbox" checked={settings.showLeaderboard ?? true} onChange={e => updateSetting('showLeaderboard', e.target.checked)} />
                  <span className="text-sm text-gray-300">Show Top Scorers</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="grid gap-6">
            <h3 className="text-lg font-bold border-b pb-2 text-gray-200">General Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label-sm">Site Name</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.siteName || ''} onChange={e => updateSetting('siteName', e.target.value)} /></div>
              <div><label className="label-sm">Site Tagline</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.siteTagline || ''} onChange={e => updateSetting('siteTagline', e.target.value)} /></div>
              <div><label className="label-sm">Support Email</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.supportEmail || ''} onChange={e => updateSetting('supportEmail', e.target.value)} /></div>
              <div><label className="label-sm">Support Phone</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.supportPhone || ''} onChange={e => updateSetting('supportPhone', e.target.value)} /></div>
              <div className="md:col-span-2"><label className="label-sm">Business Address</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.address || ''} onChange={e => updateSetting('address', e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* BRANDING & NAV */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2 text-gray-200">Branding & Navigation</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Primary Color (Hex)</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={settings.primaryColor || '#2563eb'} onChange={e => updateSetting('primaryColor', e.target.value)} className="h-10 w-10 p-1 rounded cursor-pointer" />
                  <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.primaryColor || ''} onChange={e => updateSetting('primaryColor', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="label-sm mb-2 block">Navigation Links Visibility</label>
              <div className="grid gap-2 border border-gray-800 rounded-lg p-3 bg-gray-900/50">
                {settings.navLinks?.map((link: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded">
                    <span className="font-medium text-gray-200">{link.label}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visible}
                        onChange={e => updateNavLink(idx, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-400">{link.visible ? 'Visible' : 'Hidden'}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="grid gap-6">
            <h3 className="text-lg font-bold border-b pb-2 text-gray-200">Home Page Hero</h3>
            <div className="space-y-4">
              <div><label className="label-sm">Hero Title</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-bold" value={settings.heroTitle || ''} onChange={e => updateSetting('heroTitle', e.target.value)} /></div>
              <div><label className="label-sm">Hero Subtitle</label><textarea className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-24" value={settings.heroSubtitle || ''} onChange={e => updateSetting('heroSubtitle', e.target.value)} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label-sm">CTA Button Text</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.heroCTAText || ''} onChange={e => updateSetting('heroCTAText', e.target.value)} /></div>
                <div><label className="label-sm">CTA Button Link</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.heroCTALink || ''} onChange={e => updateSetting('heroCTALink', e.target.value)} /></div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display text-white pb-4 border-b border-gray-800">Enable/Disable Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { k: 'showPracticeExams', l: 'Practice Exams' },
                { k: 'showTypingTests', l: 'Typing Tests' },
                { k: 'showTypingTutorial', l: 'Typing Tutorials' },
                { k: 'showKeyboardDrill', l: 'Keyboard Drills' },
                { k: 'showRSSBPack', l: 'RSSB CPT Pack' },
                { k: 'showBlog', l: 'Blog Section' },
                { k: 'showPricing', l: 'Pricing Page' },
                { k: 'allowRegistrations', l: 'User Registration' },
                { k: 'maintenanceMode', l: 'Maintenance Mode' },
              ].map(({ k, l }) => (
                <div key={k} className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all group">
                  <span className="font-bold text-gray-100 uppercase text-xs tracking-wider">{l}</span>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${settings[k] ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-600'}`} onClick={() => updateSetting(k, !settings[k])}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${settings[k] ? 'translate-x-6' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        {activeTab === 'footer' && (
          <div className="grid gap-6">
            <h3 className="text-lg font-bold border-b pb-2 text-gray-200">Footer Content</h3>
            <div><label className="label-sm">Footer About Text</label><textarea className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-20" value={settings.footerText || ''} onChange={e => updateSetting('footerText', e.target.value)} /></div>

            <div className="grid md:grid-cols-2 gap-4 border-t border-b py-4 my-2">
              <h4 className="col-span-2 font-bold text-gray-200 text-sm">Contact Details</h4>
              <div><label className="label-sm">Support Phone</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.supportPhone || ''} onChange={e => updateSetting('supportPhone', e.target.value)} placeholder="+91 ..." /></div>
              <div><label className="label-sm">WhatsApp Label</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.whatsappLabel || '(WhatsApp)'} onChange={e => updateSetting('whatsappLabel', e.target.value)} placeholder="(WhatsApp)" /></div>
              <div><label className="label-sm">Support Email</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.supportEmail || ''} onChange={e => updateSetting('supportEmail', e.target.value)} placeholder="contact@..." /></div>
              <div className="md:col-span-2"><label className="label-sm">Footer Address</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.address || ''} onChange={e => updateSetting('address', e.target.value)} placeholder="Full Address..." /></div>
            </div>

            <div><label className="label-sm">Copyright Text</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings.copyrightText || ''} onChange={e => updateSetting('copyrightText', e.target.value)} /></div>

            <div className="space-y-3">
              <label className="label-sm">Social Media Links</label>
              {settings.socialLinks?.map((link: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-24 text-sm font-bold text-gray-500">{link.platform}</span>
                  <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple flex-1" value={link.url} onChange={e => updateSocialLink(idx, 'url', e.target.value)} />
                  <input type="checkbox" checked={link.visible} onChange={e => updateSocialLink(idx, 'visible', e.target.checked)} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const EnquiriesView: React.FC<{ enquiries: any[] }> = ({ enquiries }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold font-display">Support Inbox</h2>
    <div className="space-y-4">
      {enquiries.map(e => (
        <div key={e.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold text-sm text-gray-200">{e.name} <span className="text-gray-400 font-normal">&lt;{e.email}&gt;</span></h3>
            <span className="text-[10px] text-gray-400">{e.date}</span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{e.message}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- REUSED COMPONENTS ---

const AdsView: React.FC<{ ads: any[], setAds: any }> = ({ ads, setAds }) => {
  const [newAd, setNewAd] = useState({ imageUrl: '', linkUrl: '', position: 'RightSidebar' });

  const handleAdd = () => {
    setAds([...ads, { id: Date.now(), ...newAd, isActive: true }]);
    setNewAd({ imageUrl: '', linkUrl: '', position: 'RightSidebar' });
  };

  const deleteAd = (id: number) => {
    setAds(ads.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display">Ad Management</h2>
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-200">Create New Ad Unit</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-sm">Image URL</label>
            <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="https://..." value={newAd.imageUrl} onChange={e => setNewAd({ ...newAd, imageUrl: e.target.value })} />
          </div>
          <div>
            <label className="label-sm">Destination Link</label>
            <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="https://..." value={newAd.linkUrl} onChange={e => setNewAd({ ...newAd, linkUrl: e.target.value })} />
          </div>
          <div>
            <label className="label-sm">Position</label>
            <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newAd.position} onChange={e => setNewAd({ ...newAd, position: e.target.value })}>
              <option value="TopBanner">Top Banner (Above Hero)</option>
              <option value="LeftSidebar">Left Sidebar</option>
              <option value="RightSidebar">Right Sidebar</option>
              <option value="Footer">Footer (Above Copyright)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleAdd} className="btn-primary w-full">Add Advertisement</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
            <img src={ad.imageUrl} alt="Ad" className="w-20 h-20 object-cover rounded bg-gray-100" />
            <div className="flex-1">
              <div className="font-bold text-sm bg-gray-100 px-2 py-1 rounded inline-block mb-1">{ad.position}</div>
              <div className="text-xs text-gray-500 truncate">{ad.linkUrl}</div>
            </div>
            <button onClick={() => deleteAd(ad.id)} className="p-2 text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {ads.length === 0 && <div className="text-center text-gray-400 py-8">No active advertisements.</div>}
      </div>
    </div>
  );
};

const CouponsView: React.FC<{ coupons: any[], setCoupons: any }> = ({ coupons, setCoupons }) => {
  const [newCode, setNewCode] = useState(''); const [discount, setDiscount] = useState(10);
  const handleAdd = () => { setCoupons([...coupons, { code: newCode, discount, expiry: '2026-12-31', isActive: true }]); };
  return (<div className="space-y-6"><h2 className="text-2xl font-bold">Coupons</h2><div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex gap-4"><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Code" /><button onClick={handleAdd} className="btn-primary">Add</button></div><div>{coupons.map((c, i) => <div key={i} className="p-2 border border-gray-800 bg-gray-900/30 mb-2 text-gray-200">{c.code} - {c.discount}%</div>)}</div></div>);
};

const PricingView: React.FC<{ packages: any[], setPackages: any }> = ({ packages, setPackages }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: '', price: '', duration: 'Monthly', isCombo: false, features: [] as string[] });
  const [currentFeature, setCurrentFeature] = useState('');

  const addFeature = () => {
    if (currentFeature.trim()) {
      setNewPkg({ ...newPkg, features: [...newPkg.features, currentFeature.trim()] });
      setCurrentFeature('');
    }
  };

  const removeFeature = (idx: number) => {
    setNewPkg({ ...newPkg, features: newPkg.features.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!newPkg.name || !newPkg.price) return alert("Name and Price are required");
    const id = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    setPackages([...packages, { id, ...newPkg, price: Number(newPkg.price) }]);
    setShowAdd(false);
    setNewPkg({ name: '', price: '', duration: 'Monthly', isCombo: false, features: [] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Pricing & Bundles</h2>
        <button onClick={() => setShowAdd(true)} className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Create Combo / Package
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-brand-purple rounded-xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-brand-purple flex items-center gap-2 border-b pb-4"><Tag size={20} /> New Package Config</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="label-sm">Package Name</label>
              <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="e.g. SSC CGL + Railway Combo" value={newPkg.name} onChange={e => setNewPkg({ ...newPkg, name: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Price (₹)</label>
              <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" type="number" placeholder="499" value={newPkg.price} onChange={e => setNewPkg({ ...newPkg, price: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Duration</label>
              <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newPkg.duration} onChange={e => setNewPkg({ ...newPkg, duration: e.target.value })}>
                <option>Monthly</option>
                <option>Yearly</option>
                <option>Lifetime</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" className="w-5 h-5 accent-brand-purple" checked={newPkg.isCombo} onChange={e => setNewPkg({ ...newPkg, isCombo: e.target.checked })} />
              <label className="font-bold text-gray-200">Is this a Combo Bundle?</label>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
            <label className="label-sm mb-2">Include Features / Exams (Press Add)</label>
            <div className="flex gap-2 mb-3">
              <input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="e.g. Excel Practice Set, Word Typing" value={currentFeature} onChange={e => setCurrentFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFeature()} />
              <button onClick={addFeature} className="bg-black text-white px-4 rounded font-bold text-xs">ADD</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPkg.features.map((f, i) => (
                <span key={i} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-gray-200">
                  {f} <button onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
              {newPkg.features.length === 0 && <span className="text-xs text-gray-400 italic">No features added yet.</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Create Package</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(p => (
          <div key={p.id} className={`bg-gray-900/50 p-6 rounded-xl border shadow-sm relative group ${p.isCombo ? 'border-brand-purple/50 bg-brand-purple/5' : 'border-gray-800'}`}>
            {p.isCombo && <div className="absolute top-0 right-0 bg-brand-purple text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">COMBO</div>}
            <h3 className="font-bold text-lg text-gray-200">{p.name}</h3>
            <div className="text-2xl font-display font-bold text-white mt-2">₹{p.price} <span className="text-sm text-gray-400 font-normal">/{p.duration}</span></div>
            <ul className="mt-4 space-y-2">
              {p.features?.map((f: string, i: number) => (
                <li key={i} className="text-xs font-medium text-gray-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {f}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-2 border border-gray-700 rounded-lg text-xs font-bold hover:bg-gray-800/30 text-gray-400">Edit Package</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogView: React.FC<{ blogs: any[], setBlogs: any }> = ({ blogs, setBlogs }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    imageUrl: '',
    status: 'Draft' as 'Published' | 'Draft',
    linkedExamId: undefined as number | undefined
  });

  const store = getAdminStore();
  const exams = store.exams || [];

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author || 'Admin',
      imageUrl: post.imageUrl || '',
      status: post.status,
      linkedExamId: post.linkedExamId
    });
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    if (editingPost) {
      // Update existing
      setBlogs(blogs.map(b => b.id === editingPost.id ? { ...b, ...formData } : b));
    } else {
      // Create new
      const newPost = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setBlogs([newPost, ...blogs]);
    }
    setIsEditing(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', author: 'Admin', imageUrl: '', status: 'Draft', linkedExamId: undefined });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published' } : b));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <button
          onClick={() => { setIsEditing(true); setEditingPost(null); setFormData({ title: '', content: '', author: 'Admin', imageUrl: '', status: 'Draft', linkedExamId: undefined }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="bg-gray-950/80 backdrop-blur-xl border-2 border-brand-purple rounded-xl p-8 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <h3 className="font-bold text-xl mb-6 text-white border-b border-gray-800 pb-4">{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Title</label>
              <input
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Blog post title..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Author</label>
              <input
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Cover Image URL</label>
              <input
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Content (HTML supported)</label>
              <textarea
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-40"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here... HTML tags like <p>, <h2>, <ul>, <li> are supported."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Status</label>
              <select
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Link to Exam (Optional)</label>
              <select
                className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple"
                value={formData.linkedExamId || ''}
                onChange={e => setFormData({ ...formData, linkedExamId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">None (General Post)</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} ({exam.language})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">If selected, a "Practice Now" button will appear on this blog post.</p>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} className="btn-primary">Save Post</button>
              <button onClick={() => { setIsEditing(false); setEditingPost(null); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-4">
        {blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold uppercase tracking-widest text-xs">No entries found in archive</p>
          </div>
        ) : (
          blogs.map(post => (
            <div key={post.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-between hover:border-brand-purple transition-all backdrop-blur-sm group">
              <div className="flex items-center gap-4">
                {post.imageUrl && (
                  <div className="relative">
                    <img src={post.imageUrl} alt="" className="w-16 h-12 object-cover rounded-lg border border-gray-800 group-hover:border-brand-purple/50 transition-colors" />
                    <div className="absolute inset-0 bg-brand-purple/10 rounded-lg"></div>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-200">{post.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">
                    <span className="text-gray-400">{post.author}</span>
                    <span className="text-gray-700">•</span>
                    <span>{post.date}</span>
                    <span className="text-gray-700">•</span>
                    <span className={`px-2 py-0.5 rounded-full border ${post.status === 'Published' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-orange-900/20 text-orange-400 border-orange-800'}`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(post.id)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Toggle Status">
                  {post.status === 'Published' ? <XCircle size={18} className="text-orange-400" /> : <CheckCircle size={18} className="text-green-400" />}
                </button>
                <button onClick={() => handleEdit(post)} className="p-2 hover:bg-brand-purple/10 rounded-lg text-brand-purple transition-colors" title="Edit">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-900/10 rounded-lg text-red-400 transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const UsersView: React.FC<{ users: any[], setUsers: any, toggleUserStatus: (id: number) => void, deleteUser: (id: number) => void }> = ({ users: initialUsers, setUsers, toggleUserStatus, deleteUser }) => {
  const [appUsers, setAppUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Changed to string for Supabase ID
  const [formData, setFormData] = useState({ name: '', email: '', plan: 'Free', role: 'User', status: 'Active' as 'Active' | 'Inactive', purchasedPackIds: [] as string[] });

  // Filters
  const [filterRole, setFilterRole] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPack, setFilterPack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const store = getAdminStore();
  const comboPacks = store.comboPacks || [];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const users = await fetchAppUsers();
    // Ensure purchasedPackIds is array
    const sanitizedUsers = users.map(u => ({
      ...u,
      purchasedPackIds: u.purchasedPackIds || []
    }));
    setAppUsers(sanitizedUsers);
    setLoading(false);
  };

  const filteredUsers = appUsers.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesPlan = filterPlan === 'All' || (user.plan || 'Free') === filterPlan;
    const matchesStatus = filterStatus === 'All' || (user.status || 'Active') === filterStatus;

    // Combo Pack Filter: Check if user has purchased the selected pack
    const matchesPack = filterPack === 'All' || (user.purchasedPackIds && user.purchasedPackIds.includes(filterPack));

    return matchesSearch && matchesRole && matchesPlan && matchesStatus && matchesPack;
  });

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', plan: 'Free', role: 'User', status: 'Active', purchasedPackIds: [] });
    setShowModal(true);
  };

  const togglePackAccess = (packId: string) => {
    if (formData.purchasedPackIds.includes(packId)) {
      setFormData({ ...formData, purchasedPackIds: formData.purchasedPackIds.filter(id => id !== packId) });
    } else {
      setFormData({ ...formData, purchasedPackIds: [...formData.purchasedPackIds, packId] });
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      status: user.status,
      purchasedPackIds: user.purchasedPackIds || []
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    // Note: Creating/Updating users directly in Supabase from here would require
    // calling specific Supabase Admin APIs or Edge Functions.
    // For now, we'll simulate the update in UI and log it.

    // In a real implementation:
    // if (editingId) await supabase.from('profiles').update(formData).eq('id', editingId);

    // Refresh list locally for demo
    if (editingId) {
      setAppUsers(appUsers.map(u => u.id === editingId ? { ...u, ...formData } : u));
    } else {
      // Mock new user
      const newUser: AdminUser = {
        id: `new-${Date.now()}`,
        ...formData,
        joined: new Date().toISOString(),
        authMethod: 'Manual'
      };
      setAppUsers([newUser, ...appUsers]);
    }

    const actionType = editingId ? 'User Updated' : 'User Created';
    addAdminLog({
      adminName: 'Admin',
      action: actionType,
      details: `${actionType}: ${formData.name} (${formData.email}) - Role: ${formData.role}`,
      type: 'success'
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">User Directory</h2>
          <p className="text-sm text-gray-400">{filteredUsers.length} users found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(appUsers, 'users_list.csv')} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800 hover:text-white transition-all">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={handleAddUser} className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800 border border-brand-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Plus size={16} /> Add New User
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg p-2 focus:border-brand-purple focus:outline-none">
          <option value="All">All Roles</option>
          <option value="User">Student</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
        </select>

        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg p-2 focus:border-brand-purple focus:outline-none">
          <option value="All">All Plans</option>
          <option value="Free">Free Tier</option>
          <option value="Pro Monthly">Pro Monthly</option>
          <option value="Pro Yearly">Pro Yearly</option>
        </select>

        <select value={filterPack} onChange={e => setFilterPack(e.target.value)} className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg p-2 focus:border-brand-purple focus:outline-none">
          <option value="All">All Combo Packs</option>
          {comboPacks.map(pack => (
            <option key={pack.id} value={pack.id}>{pack.title}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg p-2 focus:border-brand-purple focus:outline-none">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {showModal && (
        <div className="bg-gray-950/80 backdrop-blur-xl border-2 border-brand-purple rounded-xl p-8 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <h3 className="font-bold text-xl mb-6 text-white border-b border-gray-800 pb-4 flex items-center gap-3">
            <UserCheck size={24} className="text-brand-purple" /> {editingId ? 'Edit User Details' : 'Register New User'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="label-sm">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="John Doe" />
            </div>
            <div>
              <label className="label-sm">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" placeholder="john@example.com" />
            </div>
            <div>
              <label className="label-sm">Subscription Plan</label>
              <select value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-bold">
                <option value="Free">Free Tier</option>
                <option value="Pro Monthly">Pro Monthly (Paid)</option>
                <option value="Pro Yearly">Pro Yearly (Paid)</option>
              </select>
            </div>
            <div>
              <label className="label-sm">System Role</label>
              <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple">
                <option value="User">Student</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 mb-4">
            <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2"><Package size={16} className="text-brand-purple" /> Grant Combo Pack Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {comboPacks.length === 0 && <span className="text-gray-500 text-xs italic">No combo packs available. Create one in Combo Packs tab.</span>}
              {comboPacks.map(pack => (
                <label key={pack.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer border border-transparent hover:border-gray-700 transition-colors">
                  <input
                    type="checkbox"
                    className="accent-brand-purple w-4 h-4 rounded"
                    checked={formData.purchasedPackIds.includes(pack.id)}
                    onChange={() => togglePackAccess(pack.id)}
                  />
                  <div className="text-xs">
                    <div className="font-bold text-gray-300">{pack.title}</div>
                    <div className="text-gray-500">₹{pack.price}</div>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 italic">* Checked items will be accessible to this user immediately.</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editingId ? 'Save Changes' : 'Create Account'}</button>
          </div>
        </div>
      )}

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
                <tr><th className="px-6 py-4">Student Profile</th><th className="px-6 py-4">Access Tier</th><th className="px-6 py-4">Combo Packs</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found matching filters.</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-brand-purple/5 transition-all group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-200 group-hover:text-white">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-tight">{user.email}</div>
                        <div className="text-[10px] text-gray-600 mt-1">Joined: {new Date(user.joined).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.plan && user.plan.includes('Pro') ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                          {user.plan || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.purchasedPackIds && user.purchasedPackIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.purchasedPackIds.map(pid => {
                              const pack = comboPacks.find(p => p.id === pid);
                              return pack ? (
                                <span key={pid} className="text-[9px] bg-blue-900/30 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded" title={pack.title}>
                                  {pack.title.substring(0, 15)}...
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-[10px] italic">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-2 border transition-colors ${user.status === 'Active' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-gray-800/50 text-gray-500 border-gray-700'}`}>
                          {user.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEditUser(user)} className="p-2 hover:bg-brand-purple/10 rounded-lg text-brand-purple transition-all"><Edit size={16} /></button>
                        <button onClick={() => {
                          // In real app, call delete API
                          if (confirm('Delete user?')) {
                            setAppUsers(appUsers.filter(u => u.id !== user.id));
                            addAdminLog({ adminName: 'Admin', action: 'User Deleted', details: `Deleted user ${user.name}`, type: 'danger' });
                          }
                        }} className="p-2 hover:bg-red-900/10 rounded-lg text-red-500 transition-all"><Ban size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- BUSINESS COMPONENTS ---

const BillingView: React.FC<{ invoices: any[], setInvoices: any, users: any[] }> = ({ invoices, setInvoices, users }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newInv, setNewInv] = useState({ userId: '', amount: '', description: '', dueDate: '' });

  const handleCreate = () => {
    const user = users.find(u => u.id === Number(newInv.userId));
    const inv = {
      id: `INV-${Date.now()}`,
      userId: Number(newInv.userId),
      userName: user ? user.name : 'Unknown',
      date: new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate,
      items: [{ description: newInv.description, amount: Number(newInv.amount) }],
      total: Number(newInv.amount),
      status: 'Unpaid'
    };
    setInvoices([inv, ...invoices]);
    setShowAdd(false);
    addAdminLog({ adminName: 'Admin', action: 'Invoice Generated', details: `Invoice ${inv.id} for ${inv.userName} (₹${inv.total})`, type: 'info' });
  };

  const printInvoice = (inv: any) => {
    const w = window.open('', '_blank');
    w?.document.write(`
            <html><head><title>Invoice ${inv.id}</title><style>body{font-family:sans-serif;padding:20px;}</style></head>
            <body>
                <h1>INVOICE</h1>
                <p><strong>Typing Nexus</strong><br>Invoice ID: ${inv.id}<br>Date: ${inv.date}</p>
                <hr>
                <p><strong>Bill To:</strong><br>${inv.userName}</p>
                <table width="100%" border="1" style="border-collapse:collapse;margin-top:20px;">
                    <tr><th style="padding:10px;">Description</th><th style="padding:10px;">Amount</th></tr>
                    ${inv.items.map((i: any) => `<tr><td style="padding:10px;">${i.description}</td><td style="padding:10px;">₹${i.amount}</td></tr>`).join('')}
                    <tr><td style="padding:10px;"><strong>Total</strong></td><td style="padding:10px;"><strong>₹${inv.total}</strong></td></tr>
                </table>
                <p style="margin-top:20px;">Status: ${inv.status}</p>
                <script>window.print();</script>
            </body></html>
        `);
    w?.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Billing & Invoices</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Invoice</button>
      </div>
      {showAdd && (
        <div className="bg-gray-950/80 backdrop-blur-xl border-2 border-brand-purple rounded-xl p-8 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <h3 className="font-bold text-xl mb-6 text-white border-b border-gray-800 pb-4">New Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-sm">Select Student</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newInv.userId} onChange={e => setNewInv({ ...newInv, userId: e.target.value })}>{users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select></div>
            <div><label className="label-sm">Due Date</label><input type="date" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newInv.dueDate} onChange={e => setNewInv({ ...newInv, dueDate: e.target.value })} /></div>
            <div><label className="label-sm">Description</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newInv.description} onChange={e => setNewInv({ ...newInv, description: e.target.value })} placeholder="e.g. Pro Plan Subscription" /></div>
            <div><label className="label-sm">Amount (₹)</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newInv.amount} onChange={e => setNewInv({ ...newInv, amount: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2"><button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button><button onClick={handleCreate} className="btn-primary">Generate & Save</button></div>
        </div>
      )}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-700">
            <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">{invoices.map(inv => (
            <tr key={inv.id} className="hover:bg-gray-800/30 transition-all border-b border-gray-800/50 last:border-0">
              <td className="px-6 py-4 font-mono text-xs text-gray-500 uppercase">{inv.id}</td>
              <td className="px-6 py-4 font-bold text-gray-200">{inv.userName}</td>
              <td className="px-6 py-4 text-gray-500 font-medium">{inv.date}</td>
              <td className="px-6 py-4 font-bold text-green-400">₹{inv.total}</td>
              <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${inv.status === 'Paid' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-orange-900/20 text-orange-400 border-orange-800'}`}>{inv.status}</span></td>
              <td className="px-6 py-3"><button onClick={() => printInvoice(inv)} className="text-brand-purple hover:underline text-xs font-bold flex items-center gap-1"><CreditCard size={14} /> View/Print</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

const NotificationsView: React.FC<{ notifications: any[], setNotifications: any }> = ({ notifications, setNotifications }) => {
  const [showCompose, setShowCompose] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', target: 'All Users', date: '', type: 'Info' });
  const handleSend = () => {
    const notif = { id: `NOT-${Date.now()}`, ...newNotif, date: new Date().toISOString(), status: 'Sent' };
    setNotifications([notif, ...notifications]);
    setShowCompose(false);
    addAdminLog({ adminName: 'Admin', action: 'Broadcast Sent', details: `Sent "${notif.title}" to ${notif.target}`, type: 'warning' });
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    addAdminLog({ adminName: 'Admin', action: 'Notification Deleted', details: `Deleted notification ${id}`, type: 'danger' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Notification Manager</h2>
        <button onClick={() => setShowCompose(true)} className="btn-primary flex items-center gap-2"><Bell size={16} /> New Broadcast</button>
      </div>
      {showCompose && (
        <div className="bg-gray-950/80 backdrop-blur-xl border-2 border-brand-purple rounded-xl p-8 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <h3 className="font-bold text-xl mb-6 text-white border-b border-gray-800 pb-4">Compose Broadcast</h3>
          <div className="space-y-4">
            <div><label className="label-sm">Title</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} /></div>
            <div><label className="label-sm">Message Body</label><textarea className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-24" value={newNotif.message} onChange={e => setNewNotif({ ...newNotif, message: e.target.value })} /></div>
            <div><label className="label-sm">Target Audience</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newNotif.target} onChange={e => setNewNotif({ ...newNotif, target: e.target.value })}><option>All Users</option><option>Pro Users</option><option>Free Users</option></select></div>
            <div><label className="label-sm">Notification Type</label><select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={newNotif.type} onChange={e => setNewNotif({ ...newNotif, type: e.target.value })}><option>Info</option><option>Alert</option></select></div>
          </div>
          <div className="mt-4 flex justify-end gap-2"><button onClick={() => setShowCompose(false)} className="btn-secondary">Cancel</button><button onClick={handleSend} className="btn-primary">Send Broadcast</button></div>
        </div>
      )}
      <div className="space-y-4">
        {notifications.map(notif => (
          <div key={notif.id} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-brand-purple transition-all backdrop-blur-sm group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-lg ${notif.type === 'Alert' ? 'bg-red-900/20 text-red-500' : 'bg-blue-900/20 text-blue-500'}`}>
                  {notif.type === 'Alert' ? <BellRing size={18} /> : <CheckCircle size={18} />}
                </span>
                <div>
                  <h4 className="font-bold text-gray-100">{notif.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{notif.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${notif.status === 'Sent' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-orange-900/20 text-orange-400 border-orange-800'}`}>{notif.status}</span>
                <button onClick={() => handleDelete(notif.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CMS & ANALYTICS COMPONENTS ---

const MediaView: React.FC<{ media: any[], setMedia: any }> = ({ media, setMedia }) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        name: `image_${Date.now()}.png`,
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop',
        type: 'Image',
        size: '1.2 MB',
        date: new Date().toISOString().split('T')[0]
      };
      setMedia([...media, newItem]);
      setUploading(false);
      addAdminLog({ adminName: 'Admin', action: 'Media Uploaded', details: `Uploaded ${newItem.name}`, type: 'success' });
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setMedia(media.filter(item => item.id !== id));
    addAdminLog({ adminName: 'Admin', action: 'Media Deleted', details: `Deleted media item ${id}`, type: 'danger' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-display font-bold text-white">Media Library</h2>
      <div className="border-2 border-dashed border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-900 hover:border-brand-purple transition-all cursor-pointer group" onClick={handleUpload}>
        <div className={`p-6 rounded-full bg-blue-900/20 mb-4 group-hover:scale-110 transition-transform ${uploading ? 'animate-bounce' : ''}`}>
          <UploadCloud size={40} className="text-blue-400" />
        </div>
        <h3 className="font-bold text-gray-200 text-lg tracking-tight">{uploading ? 'Uploading...' : 'Click or Drag to Upload Assets'}</h3>
        <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, PDF (Max 10MB)</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {media.map(m => (
          <div key={m.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden group hover:border-brand-purple transition-all backdrop-blur-sm">
            <div className="h-32 bg-gray-950 flex items-center justify-center relative">
              {m.type === 'Image' ? (
                <img src={m.url} alt={m.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
              ) : (
                <FileText className="text-gray-700" size={40} />
              )}
              <div className="absolute top-2 right-2 flex gap-1 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button className="p-1.5 bg-gray-900/90 text-gray-300 hover:text-white rounded-lg border border-gray-700"><Eye size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-gray-900/90 text-red-500 hover:text-red-400 rounded-lg border border-gray-700"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-bold text-xs text-gray-200 truncate">{m.name}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-tighter">{m.size}</span>
                <span className="text-[10px] text-brand-purple font-bold uppercase">{m.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-display font-bold text-white">System Health & Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-4"><Cpu size={24} className="text-blue-400" /><h3 className="font-bold text-gray-200">Server Load</h3></div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3 border border-gray-700 shadow-inner"><div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] w-[35%]"></div></div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider"><span className="text-gray-500">CPU Usage: 35%</span><span className="text-green-400">Optimal</span></div>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-4"><Database size={24} className="text-brand-purple" /><h3 className="font-bold text-gray-200">Database</h3></div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3 border border-gray-700 shadow-inner"><div className="h-full bg-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.5)] w-[62%]"></div></div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider"><span className="text-gray-500">Storage: 62%</span><span className="text-green-400">Running Smooth</span></div>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4"><Activity size={24} className="text-green-400" /><h3 className="font-bold text-gray-200">API Gateway</h3></div>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter">14.2k <span className="text-xs text-gray-500 font-sans font-normal uppercase tracking-widest pl-2">Hits / 24h</span></div>
          <div className="text-[10px] text-gray-500 mt-3 font-bold uppercase">Avg Latency: 45ms</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-brand-purple mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
            <Server size={18} /> Server Resources
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-400">
                <span>Core CPU Load</span>
                <span className="text-white">42%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div className="h-full bg-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-400">
                <span>Memory Allocation</span>
                <span className="text-white">1.2 GB / 2.0 GB</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-400">
                <span>SSD Storage (NVMe)</span>
                <span className="text-white">156 GB / 512 GB</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-brand-purple mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
            <Database size={18} /> Engine Health
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Index Health</p>
              <div className="text-xl font-bold text-green-400 font-display">OPTIMIZED</div>
            </div>
            <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Latent Sync</p>
              <div className="text-xl font-bold text-blue-400 font-display">ACTIVE</div>
            </div>
            <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Backup Cycle</p>
              <div className="text-xs font-mono text-gray-400 mt-1">EVERY 6H</div>
            </div>
            <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Traffic Load</p>
              <div className="text-xs font-mono text-gray-400 mt-1">NOMINAL (L2)</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-xs overflow-hidden h-64 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-2 bg-gray-900 text-[10px] font-bold uppercase tracking-wider text-gray-500 rounded-bl-lg">Live Logs</div>
        <div className="space-y-1 opacity-80">
          <p>[{new Date().toLocaleTimeString()}] INFO: Server started on port 3000</p>
          <p>[{new Date().toLocaleTimeString()}] INFO: Database connection established (Latency: 12ms)</p>
          <p>[{new Date().toLocaleTimeString()}] WARN: High memory usage detected on Worker #4</p>
          <p>[{new Date().toLocaleTimeString()}] INFO: User 102 (Priya) authenticated via Google</p>
          <p>[{new Date().toLocaleTimeString()}] INFO: API /v1/exams returned 200 OK</p>
          <p className="animate-pulse">_</p>
        </div>
      </div>
    </div>
  );
};

// --- FEATURE TOGGLES VIEW ---
const FeatureTogglesView: React.FC<{ settings: any, setSettings: any }> = ({ settings, setSettings }) => {
  const [features, setFeatures] = useState({
    keyboardPractice: true,
    typingCourses: true,
    blogSection: true,
    practiceLibrary: true,
    excelTests: true,
    wordTests: true,
    hindiTyping: true,
    englishTyping: true,
    leaderboard: false,
    darkMode: false,
    aiAssistant: false,
    offlineMode: false,
    ...settings.featureToggles
  });

  const handleToggle = (key: string) => {
    const updated = { ...features, [key]: !features[key] };
    setFeatures(updated);
    setSettings({ ...settings, featureToggles: updated });
  };

  const featureGroups = [
    {
      title: "Typing Practice",
      icon: <Keyboard size={20} className="text-blue-600" />,
      items: [
        { key: "keyboardPractice", label: "Keyboard Practice", desc: "Key drilling station with row-by-row exercises" },
        { key: "typingCourses", label: "Typing Courses", desc: "Full English & Hindi typing curriculum" },
        { key: "practiceLibrary", label: "Practice Library", desc: "Text passages for free practice" },
        { key: "hindiTyping", label: "Hindi Typing (Inscript)", desc: "Support for Hindi INSCRIPT layout" },
        { key: "englishTyping", label: "English Typing", desc: "QWERTY English keyboard" },
      ]
    },
    {
      title: "CPT & Tests",
      icon: <FileSpreadsheet size={20} className="text-brand-purple" />,
      items: [
        { key: "excelTests", label: "Excel Tests", desc: "Spreadsheet formula & data entry tests" },
        { key: "wordTests", label: "Word Formatting Tests", desc: "Document formatting tests" },
      ]
    },
    {
      title: "Content & Social",
      icon: <FileText size={20} className="text-purple-600" />,
      items: [
        { key: "blogSection", label: "Blog Section", desc: "Public blog with articles" },
        { key: "leaderboard", label: "Leaderboard", desc: "Show public top scorers (Coming Soon)" },
      ]
    },
    {
      title: "Advanced Features",
      icon: <Zap size={20} className="text-yellow-500" />,
      items: [
        { key: "darkMode", label: "Dark Mode", desc: "Allow users to toggle dark theme" },
        { key: "aiAssistant", label: "AI Writing Assistant", desc: "AI-powered typing suggestions" },
        { key: "offlineMode", label: "Offline Mode", desc: "PWA offline access" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Feature Controls</h2>
          <p className="text-sm text-gray-400">Enable or disable site features</p>
        </div>
        <button onClick={() => alert('Features saved!')} className="btn-primary flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featureGroups.map((group, idx) => (
          <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 bg-gray-800/50 border-b border-gray-800 flex items-center gap-3">
              {group.icon}
              <h3 className="font-bold text-gray-200">{group.title}</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {group.items.map((item) => (
                <div key={item.key} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-gray-200">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${features[item.key] ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${features[item.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LESSONS MANAGEMENT VIEW ---
const LessonsView: React.FC = () => {
  const [lessons, setLessons] = useState([
    { id: 1, level: 'Beginner', title: 'English Home Row', language: 'English', drills: 4, status: 'Active', category: 'Home Row' },
    { id: 2, level: 'Beginner', title: 'English Top Row', language: 'English', drills: 4, status: 'Active', category: 'Top Row' },
    { id: 3, level: 'Beginner', title: 'English Bottom Row', language: 'English', drills: 3, status: 'Active', category: 'Bottom Row' },
    { id: 4, level: 'Intermediate', title: 'Shift & Capitals', language: 'English', drills: 3, status: 'Active', category: 'Advanced' },
    { id: 5, level: 'Beginner', title: 'Hindi Home Row', language: 'Hindi', drills: 3, status: 'Active', category: 'Home Row' },
    { id: 6, level: 'Beginner', title: 'Hindi Top Row', language: 'Hindi', drills: 3, status: 'Active', category: 'Top Row' },
    { id: 7, level: 'Advanced', title: 'Hindi Conjuncts', language: 'Hindi', drills: 3, status: 'Active', category: 'Advanced' },
    { id: 8, level: 'Pro', title: 'Hindi Professional', language: 'Hindi', drills: 2, status: 'Active', category: 'Professional' },
  ]);

  const [keyDrills, setKeyDrills] = useState([
    { id: 1, category: 'Home Row', name: 'Left Hand Only', keys: 'asdfg', status: 'Active' },
    { id: 2, category: 'Home Row', name: 'Right Hand Only', keys: 'hjkl;', status: 'Active' },
    { id: 3, category: 'Top Row', name: 'Left Top', keys: 'qwert', status: 'Active' },
    { id: 4, category: 'Top Row', name: 'Right Top', keys: 'yuiop', status: 'Active' },
    { id: 5, category: 'Numbers', name: 'All Numbers', keys: '1234567890', status: 'Active' },
    { id: 6, category: 'Speed', name: 'Common Words', keys: 'top50', status: 'Active' },
  ]);

  const [activeSubTab, setActiveSubTab] = useState<'lessons' | 'drills'>('lessons');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display">Learning Content</h2>
          <p className="text-sm text-gray-500">Manage typing lessons and key drills</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveSubTab('lessons')}
          className={`px-4 py-2 font-bold text-sm rounded-lg ${activeSubTab === 'lessons' ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'}`}
        >
          Typing Lessons ({lessons.length})
        </button>
        <button
          onClick={() => setActiveSubTab('drills')}
          className={`px-4 py-2 font-bold text-sm rounded-lg ${activeSubTab === 'drills' ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'}`}
        >
          Key Drills ({keyDrills.length})
        </button>
      </div>

      {/* Lessons Table */}
      {activeSubTab === 'lessons' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
              <tr><th className="px-6 py-4">S.No</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Language</th><th className="px-6 py-4">Category</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {lessons.map((lesson, idx) => (
                <tr key={lesson.id} className="hover:bg-brand-purple/5 transition-all group">
                  <td className="px-6 py-4 font-mono text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-200">{lesson.title}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold border border-blue-900/50 bg-blue-900/10 text-blue-400">{lesson.language}</span></td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold border border-purple-900/50 bg-purple-900/20 text-purple-400">{lesson.category}</span></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-brand-purple/10 rounded-lg text-brand-purple"><Edit size={16} /></button>
                    <button className="p-2 hover:bg-red-900/10 rounded-lg text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Key Drills Table */}
      {activeSubTab === 'drills' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50 border-b border-gray-800 text-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Name</th>
                <th className="text-left px-4 py-3 font-bold">Category</th>
                <th className="text-left px-4 py-3 font-bold">Keys</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
                <th className="text-left px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {keyDrills.map(drill => (
                <tr key={drill.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-gray-200">{drill.name}</td>
                  <td className="px-4 py-3 text-gray-400">{drill.category}</td>
                  <td className="px-4 py-3"><code className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs text-brand-purple">{drill.keys}</code></td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/20 text-green-200 border border-green-800">{drill.status}</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="p-1.5 hover:bg-blue-900/30 rounded text-blue-400"><Edit size={14} /></button>
                    <button className="p-1.5 hover:bg-red-900/30 rounded text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- ANALYTICS VIEW ---
const AnalyticsView: React.FC<{ store: any }> = ({ store }) => {
  const stats = [
    { label: 'Total Tests Taken', value: store.results?.length || 0, color: 'blue' },
    { label: 'Active Users', value: store.users?.filter((u: any) => u.status === 'Active').length || 0, color: 'green' },
    { label: 'Blog Posts', value: store.blogs?.length || 0, color: 'purple' },
    { label: 'Support Tickets', value: store.enquiries?.length || 0, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display">Analytics Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900/50 backdrop-blur-sm border-gray-800 rounded-xl p-6">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold font-display text-gray-100">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-4 text-gray-200">Recent Test Results</h3>
        <div className="space-y-3">
          {(store.results || []).slice(0, 5).map((r: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div>
                <div className="font-medium text-sm text-gray-200">{r.userName}</div>
                <div className="text-xs text-gray-400">{r.examName}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-white">{r.wpm} WPM</div>
                <span className={`px-2 py-0.5 rounded-full font-bold shadow-sm ${r.status === 'Pass' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-bold mb-4 text-gray-200">Users by Plan</h3>
          <div className="space-y-3">
            {['Free', 'Pro Monthly', 'Pro Yearly'].map(plan => {
              const count = store.users?.filter((u: any) => u.plan === plan).length || 0;
              const total = store.users?.length || 1;
              const percent = Math.round((count / total) * 100);
              return (
                <div key={plan}>
                  <div className="flex justify-between text-sm mb-1 text-gray-300">
                    <span>{plan}</span>
                    <span className="font-bold">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <div className="h-full bg-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-bold mb-4 text-gray-200">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 border border-gray-700 transition-colors group">
              <Users size={20} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-gray-200">Export Users</div>
              <div className="text-xs text-gray-400">Download CSV</div>
            </button>
            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 border border-gray-700 transition-colors group">
              <FileText size={20} className="text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-gray-200">Export Results</div>
              <div className="text-xs text-gray-400">Download CSV</div>
            </button>
            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 border border-gray-700 transition-colors group">
              <Bell size={20} className="text-brand-purple mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-gray-200">Send Broadcast</div>
              <div className="text-xs text-gray-400">Notify All</div>
            </button>
            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 border border-gray-700 transition-colors group">
              <RefreshCw size={20} className="text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-gray-200">Clear Cache</div>
              <div className="text-xs text-gray-400">Reset stores</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PASSAGE MANAGER VIEW ---
const PassageManagerView: React.FC<{ passages: any[], setPassages: any }> = ({ passages, setPassages }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', content: '', language: 'English', difficulty: 'Medium', category: '', tags: '', audioUrl: '' });

  const handleEdit = (p: any) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags?.join(', ') || '' });
    setShowEditor(true);
  };

  const handleSave = () => {
    const wordCount = form.content.split(/\s+/).filter(Boolean).length;
    const newPassage = {
      ...form,
      id: editing?.id || Date.now(),
      wordCount,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'Active',
      createdDate: editing?.createdDate || new Date().toISOString().split('T')[0]
    };
    if (editing) {
      setPassages(passages.map(p => p.id === editing.id ? newPassage : p));
    } else {
      setPassages([...passages, newPassage]);
    }
    setShowEditor(false);
    setEditing(null);
    setForm({ title: '', content: '', language: 'English', difficulty: 'Medium', category: '', tags: '', audioUrl: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Passage Manager</h2>
          <p className="text-sm text-gray-400">Manage typing test passages and content</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', content: '', language: 'English', difficulty: 'Medium', category: '', tags: '', audioUrl: '' }); setShowEditor(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Passage
        </button>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditor(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h3 className="font-bold text-lg text-gray-200">{editing ? 'Edit Passage' : 'Add New Passage'}</h3>
              <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label-sm">Title</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label-sm">Language</label>
                  <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                    <option>English</option><option>Hindi</option>
                  </select></div>
                <div><label className="label-sm">Difficulty</label>
                  <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select></div>
                <div><label className="label-sm">Category</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              </div>
              <div><label className="label-sm">Content</label><textarea className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-40" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-sm">Tags (comma separated)</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="government, jobs, beginner" /></div>
                <div><label className="label-sm">Exam Atmosphere Sound (MP3 Link)</label><input className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={form.audioUrl} onChange={e => setForm({ ...form, audioUrl: e.target.value })} placeholder="https://example.com/exam-hall-sound.mp3" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowEditor(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary">Save Passage</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passage List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800/50 border-b border-gray-800"><tr>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Title</th>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Language</th>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Difficulty</th>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Words</th>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Atmos Sound</th>
            <th className="text-left px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-800">
            {(passages || []).map(p => (
              <tr key={p.id} className="hover:bg-gray-800/30 border-b border-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200">{p.title}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${p.language === 'Hindi' ? 'bg-orange-900/20 text-orange-400 border-orange-800' : 'bg-blue-900/20 text-blue-400 border-blue-800'}`}>{p.difficulty}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${p.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-800' : p.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-800' : 'bg-yellow-900/20 text-yellow-400 border-yellow-800'}`}>{p.difficulty}</span></td>
                <td className="px-4 py-3 text-gray-400">{p.wordCount}</td>
                <td className="px-4 py-3">
                  {p.audioUrl ? (
                    <span className="text-green-500 flex items-center gap-1 font-bold text-[10px] uppercase"><Music size={12} /> Atmos ON</span>
                  ) : (
                    <span className="text-gray-500 text-[10px] uppercase font-bold">None</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-900/30 rounded text-blue-400 transition-colors"><Edit size={14} /></button>
                  <button onClick={() => setPassages(passages.filter(x => x.id !== p.id))} className="p-1.5 hover:bg-red-900/30 rounded text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- CERTIFICATE MANAGER VIEW ---
const CertificateView: React.FC<{ templates: any[], criteria: any, setCriteria: any }> = ({ templates, criteria, setCriteria }) => {
  const store = getAdminStore();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Certificate Manager</h2>

      {/* Criteria Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-200"><Award size={20} className="text-brand-purple" /> Certificate Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="label-sm">Minimum WPM</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={criteria?.minWPM || 35} onChange={e => setCriteria({ ...criteria, minWPM: parseInt(e.target.value) })} /></div>
          <div><label className="label-sm">Minimum Accuracy %</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={criteria?.minAccuracy || 95} onChange={e => setCriteria({ ...criteria, minAccuracy: parseInt(e.target.value) })} /></div>
          <div><label className="label-sm">Test Type</label>
            <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={criteria?.testType || 'Any'} onChange={e => setCriteria({ ...criteria, testType: e.target.value })}>
              <option>Any</option><option>Exam</option><option>Practice</option>
            </select></div>
          <div className="flex items-end">
            <button onClick={() => setCriteria({ ...criteria, enabled: !criteria?.enabled })} className={`w-full py-2 rounded-lg font-bold transition-all ${criteria?.enabled ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
              {criteria?.enabled ? '✓ Enabled' : '○ Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-4 text-gray-200">Certificate Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {store.certificateTemplates?.map((t: any) => (
            <div key={t.id} className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 group hover:border-brand-purple transition-all relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-gray-100 text-lg">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Template Code: {t.id}</p>
                </div>
                <div className={`p-2 rounded-lg ${t.active ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                  {t.active ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </div>
              </div>
              <div className="aspect-video bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center mb-6 shadow-inner group-hover:border-brand-purple/30 transition-colors">
                <ImageIcon size={48} className="text-gray-800 group-hover:text-brand-purple/20 transition-colors" />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs uppercase tracking-widest font-bold">Edit Design</button>
                <button className="flex-1 btn-primary text-xs uppercase tracking-widest font-bold border border-brand-purple/50">Preview</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ACHIEVEMENTS MANAGER VIEW ---
const AchievementsView: React.FC<{ achievements: any[], setAchievements: any, settings: any, setSettings: any }> = ({ achievements, setAchievements, settings, setSettings }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Gamification Settings</h2>

      {/* XP Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-200"><Zap size={20} className="text-yellow-400" /> XP Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="label-sm">XP per Test</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings?.xpPerTest || 25} onChange={e => setSettings({ ...settings, xpPerTest: parseInt(e.target.value) })} /></div>
          <div><label className="label-sm">XP per Lesson</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings?.xpPerLesson || 15} onChange={e => setSettings({ ...settings, xpPerLesson: parseInt(e.target.value) })} /></div>
          <div><label className="label-sm">XP per Streak Day</label><input type="number" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings?.xpPerStreak || 10} onChange={e => setSettings({ ...settings, xpPerStreak: parseInt(e.target.value) })} /></div>
          <div><label className="label-sm">Streak Bonus Multiplier</label><input type="number" step="0.1" className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={settings?.streakBonusMultiplier || 1.5} onChange={e => setSettings({ ...settings, streakBonusMultiplier: parseFloat(e.target.value) })} /></div>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => setSettings({ ...settings, leaderboardEnabled: !settings?.leaderboardEnabled })} className={`px-4 py-2 rounded-lg font-bold transition-all ${settings?.leaderboardEnabled ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
            {settings?.leaderboardEnabled ? '✓ Leaderboard Enabled' : '○ Leaderboard Disabled'}
          </button>
          <button onClick={() => setSettings({ ...settings, dailyChallengesEnabled: !settings?.dailyChallengesEnabled })} className={`px-4 py-2 rounded-lg font-bold transition-all ${settings?.dailyChallengesEnabled ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
            {settings?.dailyChallengesEnabled ? '✓ Daily Challenges Enabled' : '○ Daily Challenges Disabled'}
          </button>
        </div>
      </div>

      {/* Achievements List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
          <h3 className="font-bold text-gray-300">Achievements ({(achievements || []).length})</h3>
          <button className="btn-primary flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"><Plus size={14} /> Add Achievement</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {(achievements || []).map(a => (
            <div key={a.id} className={`border rounded-xl p-4 transition-all ${a.isActive ? 'bg-gray-800 border-brand-purple/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'bg-gray-900/50 border-gray-800 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <div className="font-bold text-sm text-gray-200">{a.name}</div>
                  <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider">+{a.xpReward} XP</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4 h-8 line-clamp-2">{a.description}</p>
              <div className="flex justify-between items-center">
                <code className="text-[10px] bg-gray-900 border border-gray-700 px-2 py-1 rounded text-brand-purple font-bold font-mono">{a.criteria}</code>
                <button onClick={() => setAchievements(achievements.map(x => x.id === a.id ? { ...x, isActive: !x.isActive } : x))} className={`text-xs font-bold transition-colors ${a.isActive ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
                  {a.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PANEL COMPONENT ---

const SidebarItem: React.FC<any> = ({ id, activeTab, setActiveTab, icon: Icon, label }) => (
  <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm group ${activeTab === id ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
    <Icon size={20} className={`${activeTab === id ? 'text-white' : 'text-gray-500 group-hover:text-brand-purple'} transition-colors`} />
    <span>{label}</span>
  </button>
);

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [store, setStore] = useState<any>(null); // Start null to detect load
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStore = async () => {
      try {
        // --- Sync from Hostinger First (New) ---
        await syncSettingsFromHost();

        const data = getAdminStore();
        if (!data) throw new Error("Store returned null");
        setStore(data);
      } catch (e: any) {
        console.error("Store Load Error:", e);
        setError(e.message || "Failed to load persistence layer");
      }
    };

    loadStore();
    const handleUpdate = () => { try { setStore(getAdminStore()); } catch (err) { console.error(err); } };
    window.addEventListener('adminStoreUpdate', handleUpdate);
    return () => window.removeEventListener('adminStoreUpdate', handleUpdate);
  }, []);

  const handleReset = () => { localStorage.removeItem('ar_typing_admin_store'); window.location.reload(); };

  if (error) return <div className="p-10 text-red-600">Error: {error} <button onClick={handleReset}>Reset</button></div>;
  if (!store) return <div className="p-10">Loading...</div>;
  if (!store.settings || !store.results) return (<div className="p-10 text-center"><h1 className="text-xl font-bold text-orange-600">Database Update Required</h1><button onClick={handleReset} className="bg-brand-black text-white px-6 py-2 rounded mt-4">Upgrade</button></div>);

  const { currentUser, logout } = useAuth();

  // Dynamic Stats Calculation
  const totalRevenue = (store.payments || []).reduce((sum: number, p: any) => {
    const amount = parseFloat(p.amount.toString().replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const pendingEnquiries = (store.enquiries || []).filter((e: any) => e.status === 'New').length;

  const stats = [
    { label: "Total Students", value: store.users?.length || 0, change: "+0%", icon: <Users size={20} className="text-blue-600" /> },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+0%", icon: <DollarSign size={20} className="text-green-600" /> },
    { label: "Pending Enquiries", value: pendingEnquiries, change: pendingEnquiries > 0 ? "Action Req" : "All Clear", icon: <Inbox size={20} className="text-red-500" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden font-sans relative">
      <style>{`.label-sm { font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; display: block; margin-bottom: 4px; } .input-field { width: 100%; padding: 8px; border: 1px solid #374151; background-color: #111827; color: #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.2s; } .input-field:focus { border-color: #c026d3; } .btn-primary { background: #c026d3; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 700; transition: background 0.2s; } .btn-primary:hover { background: #a21caf; } .btn-secondary { color: #9CA3AF; padding: 8px 16px; font-size: 14px; font-weight: 700; } .btn-secondary:hover { color: #e5e7eb; }`}</style>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shrink-0 shadow-2xl md:shadow-none`}>
        <div className="p-6 border-b border-gray-800 flex items-center gap-3"><div className="w-9 h-9 bg-gray-800 border border-gray-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">TN</div><span className="font-display font-bold text-xl tracking-tight text-white">Admin<span className="text-brand-purple">Portal</span></span></div>
        <div className="flex-grow overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Modules</p>
          <SidebarItem id="dashboard" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="users" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Users} label="Users" />
          <SidebarItem id="content" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={FileText} label="Exams" />
          <SidebarItem id="rules" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Calculator} label="Rule Engine" />
          {/* Visit Site Button */}
          {/* Visit Site Button - Fixed to point to root domain with auto-login session */}
          {/* Visit Site Button - Fixed to point to root domain with auto-login session */}
          <button
            onClick={async () => {
              console.log("Visit Website clicked. Fetching session...");
              let { data: { session }, error } = await supabase.auth.getSession();

              if (error || !session) {
                console.log("Session invalid, refreshing...");
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                if (refreshData.session) session = refreshData.session;
                else console.error("Refresh failed:", refreshError);
              }

              const baseUrl = window.location.hostname.includes('localhost')
                ? 'http://localhost:5173'
                : 'https://typingnexus.in'; // Target main domain

              if (session) {
                console.log("Session found, redirecting with tokens...", session.user.email);
                // Pass access_token and refresh_token in hash fragment for security
                const autoLoginUrl = `${baseUrl}/#access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
                window.open(autoLoginUrl, '_blank');
              } else {
                console.warn("No session found even after refresh.");

                // FALLBACK: If we are Mahijeet/SuperAdmin, send a special "Emergency Token"
                // The main site's AuthContext will look for this and grant access
                const isMahijeet = (currentUser?.email === 'mahijeet@typingnexus.in') || (currentUser?.name === 'Mahijeet');
                if (isMahijeet) {
                  console.log("Generating Emergency Golden Ticket for Mahijeet...");
                  const goldenTicketUrl = `${baseUrl}/#access_token=emergency-bypass&refresh_token=valid`;
                  window.open(goldenTicketUrl, '_blank');
                } else {
                  window.open(baseUrl, '_blank');
                }
              }
            }}
            className="mx-4 my-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-700 hover:text-white transition-colors shadow-sm block w-[calc(100%-32px)] text-center border border-gray-700"
          >
            <Globe size={14} /> Visit Website
          </button>

          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Commerce</p>
          <SidebarItem id="pricing" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Tag} label="Pricing" />
          <SidebarItem id="billing" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={CreditCard} label="Billing" />
          <SidebarItem id="coupons" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Receipt} label="Coupons" />
          <SidebarItem id="ads" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Megaphone} label="Ads" />

          {store.users.find((u: any) => u.id === currentUser?.id)?.role === 'Super Admin' && (
            <>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Super Admin</p>
              <SidebarItem id="admins" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Shield} label="Admin Management" />
            </>
          )}

          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">System</p>
          <SidebarItem id="notifications" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Bell} label="Notifications" />
          <SidebarItem id="blog" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={PenTool} label="Blog" />
          <SidebarItem id="enquiries" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Inbox} label="Support" />
          <SidebarItem id="media" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={UploadCloud} label="Media Library" />
          <SidebarItem id="system" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Cpu} label="System Health" />
          <SidebarItem id="settings" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Settings} label="Settings" />
          <SidebarItem id="logs" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={ClipboardList} label="Activity Logs" />
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Controls</p>
          <SidebarItem id="features" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={ToggleRight} label="Feature Toggles" />
          <SidebarItem id="lessons" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={BookOpen} label="Lessons" />
          <SidebarItem id="analytics" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={BarChart3} label="Analytics" />
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Content</p>
          <SidebarItem id="passages" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={FileStack} label="Passages" />
          <SidebarItem id="cpt-tests" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={FileSpreadsheet} label="CPT Management" />
          <SidebarItem id="combo-packs" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Package} label="Combo Packs" />
          <SidebarItem id="certificates" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Award} label="Certificates" />
          <SidebarItem id="achievements" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Trophy} label="Gamification" />
        </div>
        <div className="p-4 border-t border-gray-800 mt-auto bg-gray-900/50">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs text-red-400 hover:bg-red-900/20 bg-gray-800 border border-red-900/50 shadow-lg group">
            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            <span>Logout Securely</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (New) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-purple text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-900/20">AR</div>
            <span className="font-display font-bold text-sm text-white">Admin Portal</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView stats={stats} />}
            {activeTab === 'rules' && <RulesView rules={store.rules} setRules={(r: any) => saveAdminStore({ ...store, rules: r })} />}

            {activeTab === 'settings' && <SettingsView settings={store.settings} setSettings={(s: any) => saveAdminStore({ ...store, settings: s })} />}
            {activeTab === 'enquiries' && <EnquiriesView enquiries={store.enquiries} />}
            {activeTab === 'logs' && <LogsView />}
            {activeTab === 'users' && <UsersView users={store.users} setUsers={(u: any) => saveAdminStore({ ...store, users: u })} toggleUserStatus={toggleUserStatus} deleteUser={deleteUser} />}

            {activeTab === 'content' && <ContentView exams={store.exams} setExams={(e: any) => saveAdminStore({ ...store, exams: e })} rules={store.rules} />}
            {activeTab === 'ads' && <AdsView ads={store.ads} setAds={(a: any) => saveAdminStore({ ...store, ads: a })} />}
            {activeTab === 'coupons' && <CouponsView coupons={store.coupons} setCoupons={(c: any) => saveAdminStore({ ...store, coupons: c })} />}
            {activeTab === 'billing' && <BillingView invoices={store.invoices} setInvoices={(i: any) => saveAdminStore({ ...store, invoices: i })} users={store.users} />}
            {activeTab === 'notifications' && <NotificationsView notifications={store.notifications} setNotifications={(n: any) => saveAdminStore({ ...store, notifications: n })} />}
            {activeTab === 'media' && <MediaView media={store.media} setMedia={(m: any) => saveAdminStore({ ...store, media: m })} />}
            {activeTab === 'admins' && <AdminsView />}
            {activeTab === 'system' && <SystemView />}
            {activeTab === 'pricing' && <PricingView packages={store.packages} setPackages={(p: any) => saveAdminStore({ ...store, packages: p })} />}
            {activeTab === 'blog' && <BlogView blogs={store.blogs} setBlogs={(b: any) => saveAdminStore({ ...store, blogs: b })} />}
            {activeTab === 'features' && <FeatureTogglesView settings={store.settings} setSettings={(s: any) => saveAdminStore({ ...store, settings: s })} />}
            {activeTab === 'lessons' && <LessonsView />}
            {activeTab === 'analytics' && <AnalyticsView store={store} />}
            {activeTab === 'passages' && <PassageManagerView passages={store.passages} setPassages={(p: any) => saveAdminStore({ ...store, passages: p })} />}
            {activeTab === 'cpt-tests' && <CPTTestManager />}
            {activeTab === 'combo-packs' && <ComboPackManager />}
            {activeTab === 'certificates' && <CertificateView templates={store.certificateTemplates} criteria={store.certificateCriteria} setCriteria={(c: any) => saveAdminStore({ ...store, certificateCriteria: c })} />}
            {activeTab === 'achievements' && <AchievementsView achievements={store.achievements} setAchievements={(a: any) => saveAdminStore({ ...store, achievements: a })} settings={store.gamificationSettings} setSettings={(s: any) => saveAdminStore({ ...store, gamificationSettings: s })} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;