import React, { useState, useEffect } from 'react';
import {
  Menu, LayoutDashboard, Users, FileText, Settings, LogOut, ChevronRight, Plus, X, Search, Filter, Download, Trash2, Edit, Save, Check, AlertTriangle, Shield, CheckCircle, Smartphone, ExternalLink, Globe, BarChart3, Clock, Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Eye, EyeOff, RotateCcw, CreditCard, Tag, Receipt, Megaphone, Bell, PenTool, Inbox, HelpCircle, UploadCloud, Cpu, ClipboardList, ToggleRight, BookOpen, FileStack, FileSpreadsheet, Package, Award, Trophy, ListChecks, Calculator, GripVertical, CornerDownRight, Edit2, Activity, RefreshCw, Database, FileJson, Code, FileCode, Wallet, Ban, Monitor, ArrowRight, History, ShieldAlert, UserCheck, UserMinus, Briefcase, DollarSign, Image, Zap, BellRing, Server, PlusCircle, MessageSquare, Star, Heart, Share2, PieChart, ShieldCheck, Layers, HardDrive, Moon, Sun, Unlock, TrendingUp, Send, Target, ChevronLeft,
  XCircle, Keyboard, Music, Image as ImageIcon, Folder, List, Layout
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
  fetchAppUsers,
  ExamProfile,
  DEFAULT_EXAM_PROFILE
} from '../utils/adminStore';
import { getAdminLogs, addAdminLog, ActivityLog } from '../utils/adminLogs'; // Import Logger
import CPTTestManager from './CPTTestManager';
import ComboPackManager from './ComboPackManager';
import ContentLibrary from './ContentLibrary';
import ExamProfileManager from './ExamProfileManager';
import CourseManager from './CourseManager';

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


const DashboardView: React.FC<{ stats: any }> = ({ stats }) => {
  const store = getAdminStore();
  const payments = store.payments || [];
  const users = store.users || [];

  // --- REVENUE CHART DATA (Mocking Monthly Data) ---
  const revenueData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    // Generate data for last 6 months
    return Array.from({ length: 6 }).map((_, i) => {
      const monthIdx = (currentMonth - 5 + i + 12) % 12;
      // Mock random revenue for demonstration + actual for current month
      const isCurrent = i === 5;
      const actualRev = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const value = isCurrent ? actualRev : Math.floor(Math.random() * 5000) + 1000;
      return { label: months[monthIdx], value };
    });
  }, [payments]);

  const maxRevenue = Math.max(...revenueData.map(d => d.value)) || 100;

  // --- USER GROWTH DATA ---
  const userGrowth = React.useMemo(() => {
    return [
      { label: 'Mon', value: 12 }, { label: 'Tue', value: 19 }, { label: 'Wed', value: 15 },
      { label: 'Thu', value: 25 }, { label: 'Fri', value: 32 }, { label: 'Sat', value: 28 },
      { label: 'Sun', value: users.length } // Current total
    ];
  }, [users]);
  const maxUsers = Math.max(...userGrowth.map(d => d.value)) || 50;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold font-display text-white">Dashboard Overview</h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat: any, index: number) => (
          <div key={index} className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-brand-purple/50 transition-all shadow-lg backdrop-blur-sm group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-full blur-[40px] group-hover:bg-brand-purple/20 transition-all"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-gray-800 rounded-lg group-hover:scale-110 transition-transform shadow-inner border border-gray-700">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${stat.change.includes('+') ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-red-400 bg-red-900/20 border-red-800'}`}>
                {stat.change}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold font-display text-gray-100 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-200 flex items-center gap-2"><DollarSign size={18} className="text-green-500" /> Revenue Trend</h3>
            <select className="bg-gray-900 border border-gray-700 text-xs rounded px-2 py-1 text-gray-400"><option>Last 6 Months</option></select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {revenueData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden transition-all hover:bg-green-900/40 border-t border-x border-gray-700 group-hover:border-green-500/50" style={{ height: `${(d.value / maxRevenue) * 100}%` }}>
                  <div className="absolute bottom-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded -mb-2 pointer-events-none whitespace-nowrap z-20">₹{d.value}</div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-200 flex items-center gap-2"><Users size={18} className="text-blue-500" /> User Growth</h3>
            <select className="bg-gray-900 border border-gray-700 text-xs rounded px-2 py-1 text-gray-400"><option>Last 7 Days</option></select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {userGrowth.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden transition-all hover:bg-blue-900/40 border-t border-x border-gray-700 group-hover:border-blue-500/50" style={{ height: `${(d.value / maxUsers) * 100}%` }}>
                  <div className="absolute bottom-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded pointer-events-none z-20">{d.value}</div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-4 text-gray-200 flex items-center gap-2"><Activity size={18} className="text-brand-purple" /> System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400">SERVER CPU</span>
              <span className="text-green-400 text-xs font-bold">OK</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">12%</div>
            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden"><div className="w-[12%] h-full bg-green-500"></div></div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400">MEMORY USAGE</span>
              <span className="text-yellow-400 text-xs font-bold">MODERATE</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">45%</div>
            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden"><div className="w-[45%] h-full bg-yellow-500"></div></div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400">DATABASE (Hostinger)</span>
              <span className="text-green-400 text-xs font-bold">CONNECTED</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">AdminStore Sync Active</div>
            <div className="flex items-center gap-1 mt-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> <span className="text-xs text-green-400">Operational</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    penaltyPerFullMistake: 1, penaltyPerHalfMistake: 0.5, maxIgnoredErrors: 5, qualifyingSpeed: 35, qualifyingAccuracy: 95,
    allowNumbers: true, allowSpecialChars: true // [NEW]
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
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{editingId ? 'Edit Rule' : 'Create Rule'}</h3>
          {/* Form Content */}
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div><label className="label-sm">Rule Name</label><input className="input-field bg-gray-800 border-gray-600" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. SSC CGL Mains" /></div>

            <div className="grid grid-cols-2 gap-2">
              <div><label className="label-sm">Category</label><select className="input-field bg-gray-800 border-gray-600" value={newRule.category} onChange={e => setNewRule({ ...newRule, category: e.target.value })}><option>SSC</option><option>Banking</option><option>Court</option><option>State</option><option>Railways</option><option>Central</option><option>Police</option><option>NHM</option></select></div>
              <div><label className="label-sm">Duration (Min)</label><input type="number" className="input-field bg-gray-800 border-gray-600" value={newRule.duration} onChange={e => setNewRule({ ...newRule, duration: Number(e.target.value) })} /></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div><label className="label-sm">Language</label><select className="input-field bg-gray-800 border-gray-600" value={newRule.language} onChange={e => setNewRule({ ...newRule, language: e.target.value })}><option>English</option><option>Hindi</option></select></div>
              <div>
                <label className="label-sm">Font Family</label>
                <select className="input-field bg-gray-800 border-gray-600" value={newRule.font} onChange={e => setNewRule({ ...newRule, font: e.target.value })}>
                  {newRule.language === 'English' ? <><option>Arial</option><option>Verdana</option><option>Times New Roman</option></> : <><option>Mangal</option><option>KrutiDev 010</option><option>KrutiDev 016</option><option>Remington Gail</option></>}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-brand-purple font-bold text-xs uppercase mb-2">Penalties & Logic</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className="label-sm">Backspace</label><select className="input-field bg-gray-800 border-gray-600" value={newRule.backspaceParam} onChange={e => setNewRule({ ...newRule, backspaceParam: e.target.value })}><option value="Enabled">Enabled</option><option value="Disabled">Disabled</option><option value="WordOnly">Word Only</option></select></div>
                <div><label className="label-sm">Highlighting</label><select className="input-field bg-gray-800 border-gray-600" value={newRule.highlighting} onChange={e => setNewRule({ ...newRule, highlighting: e.target.value })}><option value="Word">Current Word</option><option value="Line">Current Line</option><option value="None">None</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className="label-sm">Error Method</label><select className="input-field bg-gray-800 border-gray-600" value={newRule.errorMethod} onChange={e => setNewRule({ ...newRule, errorMethod: e.target.value })}><option value="Full">Full Mistake</option><option value="Half">Half Mistake</option><option value="Ignore">Ignore Errors</option></select></div>
                <div><label className="label-sm">Ignored Errors %</label><input type="number" className="input-field bg-gray-800 border-gray-600" value={newRule.maxIgnoredErrors} onChange={e => setNewRule({ ...newRule, maxIgnoredErrors: Number(e.target.value) })} /></div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-brand-purple font-bold text-xs uppercase mb-2">Security & Restrictions</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <label className="flex items-center gap-2 text-xs text-gray-300"><input type="checkbox" checked={newRule.allowNumbers} onChange={e => setNewRule({ ...newRule, allowNumbers: e.target.checked })} className="accent-brand-purple" /> Allow Numbers</label>
                <label className="flex items-center gap-2 text-xs text-gray-300"><input type="checkbox" checked={newRule.allowSpecialChars} onChange={e => setNewRule({ ...newRule, allowSpecialChars: e.target.checked })} className="accent-brand-purple" /> Allow Symbols</label>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs text-gray-400"><input type="checkbox" checked={newRule.security?.preventCopyPaste} onChange={e => setNewRule({ ...newRule, security: { ...newRule.security, preventCopyPaste: e.target.checked } })} className="accent-red-500" /> Block Copy/Paste</label>
                <label className="flex items-center gap-2 text-xs text-gray-400"><input type="checkbox" checked={newRule.security?.preventRightClick} onChange={e => setNewRule({ ...newRule, security: { ...newRule.security, preventRightClick: e.target.checked } })} className="accent-red-500" /> Block Right Click</label>
                <label className="flex items-center gap-2 text-xs text-gray-400"><input type="checkbox" checked={newRule.security?.singleSession} onChange={e => setNewRule({ ...newRule, security: { ...newRule.security, singleSession: e.target.checked } })} className="accent-red-500" /> Single Session (Start)</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={() => { setShowAddRule(false); setEditingId(null); }} className="flex-1 btn-secondary text-sm">Cancel</button>
              <button onClick={handleSaveRule} className="flex-1 btn-primary text-sm shadow-brand">{editingId ? 'Update Rule' : 'Save Rule'}</button>
            </div>
          </div>
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
              <div className="flex justify-between border-b border-gray-800/50 pb-2"><span>Font:</span><span className="font-bold text-gray-200">{rule.font || 'Arial'}</span></div>
              <div className="flex justify-between"><span>Backspace:</span><span className={`font-bold ${rule.backspace === 'Disabled' ? 'text-red-400' : 'text-green-400'}`}>{rule.backspace}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ContentView: React.FC<{ exams: any[], setExams: any, rules: any[], categories: any[], setCategories: any, examProfiles: ExamProfile[], setExamProfiles: any }> = ({ exams, setExams, rules, categories = [], setCategories, examProfiles = [], setExamProfiles }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [lang, setLang] = useState('English');
  const [enabledLangs, setEnabledLangs] = useState<string[]>(['English']); // New State
  const [profileId, setProfileId] = useState<string>(''); // Swapped ruleId for profileId
  const [status, setStatus] = useState('Published');
  const [liveStatus, setLiveStatus] = useState<'Live' | 'Upcoming' | 'Past'>('Past');
  const [liveDate, setLiveDate] = useState('');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<any[]>([]);
  const [unifiedData, setUnifiedData] = useState<any>(null); // [NEW] Stores Categories + Profiles + Exams
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Category State
  const [newCatName, setNewCatName] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState<string>('');

  const [content, setContent] = useState('');
  const [contentTitle, setContentTitle] = useState(''); // Added Content Title Field

  // --- Category Helpers ---
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      parentId: selectedParentCat || null,
      type: 'folder'
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    if (confirm('Delete this category? Sub-categories will be unlinked.')) {
      setCategories(categories.filter((c: any) => c.id !== id));
    }
  };

  // --- Bulk Upload Helpers ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setIsProcessingBulk(true);
    setUnifiedData(null);

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);

        // Check if it's the Unified Format
        if (data.categories || data.profiles || data.exams) {
          setUnifiedData(data);
          // For preview, we show a summary or just use the exams list
          setBulkPreview(data.exams || []);
        } else {
          // Standard JSON Exam List
          const preview = Array.isArray(data) ? data : [data];
          setBulkPreview(preview.map((p, idx) => ({
            id: Date.now() + idx,
            title: p.title || `Imported Exam ${idx + 1}`,
            content: p.content || '',
            language: p.language || 'English',
            status: 'Draft'
          })));
        }
        setIsProcessingBulk(false);
      } else if (file.name.endsWith('.xlsx')) {
        // Dynamic import to avoid load if not used
        const XLSX = await import('xlsx');
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          // Map columns: Title, Content, Language, Category
          const preview = data.map((row: any, idx: number) => ({
            id: Date.now() + idx,
            title: row['Title'] || `Bulk Import ${idx + 1}`,
            content: row['Content'] || '',
            language: row['Language'] || 'English',
            categoryId: row['Category'] || '', // Optional matching by name
            status: 'Draft'
          }));
          setBulkPreview(preview);
          setIsProcessingBulk(false);
        };
        reader.readAsBinaryString(file);
      } else {
        // Text file - Split by "---"
        const text = await file.text();
        const chunks = text.split('---').map(c => c.trim()).filter(Boolean);
        const preview = chunks.map((chunk, idx) => ({
          id: Date.now() + idx,
          title: `Bulk Text Import ${idx + 1}`,
          content: chunk,
          language: 'English',
          status: 'Draft'
        }));
        setBulkPreview(preview);
        setIsProcessingBulk(false);
      }
    } catch (err) {
      console.error("Bulk upload failed", err);
      alert("Failed to parse file.");
      setIsProcessingBulk(false);
    }
  };

  const saveBulkImport = () => {
    if (unifiedData) {
      // Create a local clone of everything to update at once
      const finalCategories = unifiedData.categories
        ? [...categories, ...unifiedData.categories]
        : categories;

      const finalProfiles = unifiedData.profiles
        ? [...examProfiles, ...unifiedData.profiles.map((p: any) => ({ ...DEFAULT_EXAM_PROFILE, ...p }))]
        : examProfiles;

      let finalExams = exams;
      if (unifiedData.exams) {
        const newExams = unifiedData.exams.map((p: any, idx: number) => ({
          ...p,
          id: Date.now() + idx,
          plays: 0
        }));
        finalExams = [...exams, ...newExams];
      }

      // Perform a SINGLE store update to avoid race conditions
      // We'll use one of our setters but pass the FULL state if we can, 
      // or better: use setExams and rely on it to update the rest since they share the store object.
      // Actually, it's safer to have one unified bulk update function.
      // For now, let's call saveAdminStore directly if possible, or use a helper.

      const store = getAdminStore();
      saveAdminStore({
        ...store,
        categories: finalCategories,
        examProfiles: finalProfiles,
        exams: finalExams
      });

      alert(`Unified Import Successful!`);
    } else {
      // Standard Excel/Text Import
      const newExams = bulkPreview.map(p => ({
        id: p.id,
        title: p.title,
        language: p.language,
        enabledLanguages: [p.language],
        ruleSet: 'Standard',
        ruleId: 1,
        status: 'Published',
        content: p.content,
        contentTitle: p.title,
        categoryId: categoryId || null,
        plays: 0
      }));
      setExams([...exams, ...newExams]);
      alert(`Successfully imported ${newExams.length} exams!`);
    }

    setShowBulkUpload(false);
    setBulkFile(null);
    setBulkPreview([]);
    setUnifiedData(null);
  };


  const handleSave = () => {
    const profile = examProfiles.find(p => p.id === profileId);
    const examData = {
      title,
      categoryId,
      language: enabledLangs.length > 0 ? enabledLangs[0] : 'English', // Default for legacy
      enabledLanguages: enabledLangs, // Save array
      examProfileId: profileId, // Swapped ruleId for profileId
      ruleSet: profile?.profileName || "Standard",
      status,
      liveStatus,
      liveDate, // Ensure liveDate is saved

      content,
      contentTitle, // Saving content title
      plays: editingId ? exams.find(e => e.id === editingId)?.plays : 0
    };

    if (editingId) {
      const existingExam = exams.find(e => e.id === editingId);
      setExams(exams.map(e => e.id === editingId ? {
        ...e,
        ...examData,
        createdAt: existingExam?.createdAt || Date.now() // Preserve or backfill
      } : e));
    } else {
      const newId = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1;
      setExams([...exams, {
        id: newId,
        ...examData,
        createdAt: Date.now() // Set creation time for new exams
      }]);
    }
    setShowAdd(false); setEditingId(null); setTitle(''); setContent(''); setContentTitle(''); setLiveStatus('Past'); setLiveDate(''); setEnabledLangs(['English']); setCategoryId(''); setProfileId('');
  };

  const handleEdit = (exam: any) => {
    setEditingId(exam.id);
    setTitle(exam.title);
    setCategoryId(exam.categoryId || '');
    setLang(exam.language);
    setEnabledLangs(exam.enabledLanguages || [exam.language] || ['English']); // Load saved languages
    setProfileId(exam.examProfileId || ''); // Load profileId
    setStatus(exam.status);
    setLiveStatus(exam.liveStatus || 'Past');
    setLiveDate(exam.liveDate || '');
    setContent(exam.content || '');
    setContentTitle(exam.contentTitle || '');
    setShowAdd(true);
  };

  // --- Search & Filter ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Filter and Sort Exams (Newest First)
  const filteredExams = exams
    .filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? exam.categoryId === filterCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.id - a.id); // Newest first

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Exam Management</h2>
          <p className="text-sm text-gray-400">Manage, edit, and publish your typing exams.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-purple transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:border-brand-purple outline-none w-full md:w-64"
            />
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-gray-900 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-700 outline-none focus:border-brand-purple"
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <button onClick={() => setShowCategoryManager(true)} className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-700 border border-gray-700" title="Manage Categories">
            <Folder size={18} />
          </button>

          <button onClick={() => setShowBulkUpload(true)} className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-700 border border-gray-700 flex items-center gap-2" title="Bulk Upload">
            <UploadCloud size={18} />
          </button>

          <button onClick={() => { setShowAdd(true); setEditingId(null); setContent(''); setContentTitle(''); setTitle(''); setEnabledLangs(['English']); setCategoryId(''); }} className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800 shadow-brand">
            <Plus size={18} /> New Exam
          </button>
        </div>
      </div>

      {/* CATEGORY MANAGER MODAL */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowCategoryManager(false)}>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Category Folders</h3>
            <div className="flex gap-2 mb-4">
              <input className="input-field bg-gray-800 border-gray-600" placeholder="New Folder Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <select className="input-field bg-gray-800 border-gray-600 w-1/3" value={selectedParentCat} onChange={e => setSelectedParentCat(e.target.value)}>
                <option value="">(Root)</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleAddCategory} className="btn-primary"><Plus size={18} /></button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {categories.map((c: any) => (
                <div key={c.id} className="flex justify-between items-center p-2 bg-gray-800/50 rounded border border-gray-700">
                  <span className="text-sm text-gray-200">
                    {c.parentId ? <span className="text-gray-500 mr-2">↳</span> : null}
                    {c.name}
                  </span>
                  <button onClick={() => deleteCategory(c.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-gray-500 text-sm italic text-center">No categories created.</p>}
            </div>
            <button onClick={() => setShowCategoryManager(false)} className="mt-4 w-full btn-secondary">Close</button>
          </div>
        </div>
      )}

      {/* BULK UPLOAD MODAL */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowBulkUpload(false)}>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UploadCloud size={20} /> Bulk Import Exams</h3>

            {!bulkFile ? (
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:bg-gray-800 transition-colors">
                <input type="file" accept=".xlsx,.txt,.json" onChange={handleFileUpload} className="hidden" id="bulk-file" />
                <label htmlFor="bulk-file" className="cursor-pointer">
                  <p className="text-gray-300 font-bold mb-2">Click to Bulk Upload (.xlsx, .txt, .json)</p>
                  <p className="text-xs text-gray-500">Excel columns: Title, Content, Language, Category</p>
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="text-[10px] text-brand-purple font-bold uppercase tracking-wider">New: Upload Unified JSON (Categories + Profiles + Exams)</p>
                    <a
                      href="/master_unified_template.json"
                      download
                      className="text-[10px] bg-brand-purple/20 hover:bg-brand-purple/40 text-brand-purple px-4 py-1.5 rounded-full border border-brand-purple/30 transition-all font-bold flex items-center gap-2"
                      onClick={e => e.stopPropagation()}
                    >
                      <Download size={12} /> Download JSON Template
                    </a>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                  <span className="font-mono text-xs text-gray-300">{bulkFile.name}</span>
                  <button onClick={() => { setBulkFile(null); setBulkPreview([]); }} className="text-red-400 text-xs">Remove</button>
                </div>
                {isProcessingBulk ? <p className="text-yellow-400 animate-pulse text-sm">Processing file...</p> : (
                  <div className="max-h-60 overflow-y-auto border border-gray-700 rounded custom-scrollbar">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-800 text-gray-400"><tr><th className="p-2">Title</th><th className="p-2">Lang</th><th className="p-2">Preview</th></tr></thead>
                      <tbody>
                        {bulkPreview.map((p, i) => (
                          <tr key={i} className="border-b border-gray-800 text-gray-300">
                            <td className="p-2 font-bold">{p.title}</td>
                            <td className="p-2">{p.language}</td>
                            <td className="p-2 truncate max-w-xs opacity-70">{p.content.substring(0, 50)}...</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex gap-2 justify-end mt-4">
                  <select className="input-field bg-gray-800 border-gray-700 w-auto" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">Auto-Detect / No Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button onClick={saveBulkImport} className="btn-primary" disabled={bulkPreview.length === 0}>Import {bulkPreview.length} Exams</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="bg-gray-950 border-2 border-brand-purple rounded-2xl shadow-[0_0_30px_rgba(192,38,211,0.2)] p-8 mb-8 backdrop-blur-md animate-in slide-in-from-top-4">
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
              <label className="label-sm">Category / Folder</label>
              <select className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">(None)</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Paragraph Title (Optional)</label>
              <input type="text" placeholder="e.g. The Fox and Grapes" value={contentTitle} onChange={e => setContentTitle(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple" />
            </div>
            <div>
              <label className="label-sm text-gray-400">Linked Exam Profile (Modern Engine)</label>
              <select value={profileId} onChange={e => setProfileId(e.target.value)} className="input-field bg-gray-900 border-gray-700 text-white focus:border-brand-purple font-bold">
                <option value="">Select a Profile...</option>
                {examProfiles.map(p => <option key={p.id} value={p.id}>{p.profileName}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Allowed Languages</label>
              <div className="flex gap-4 mt-2 bg-gray-900 border border-gray-700 p-2.5 rounded text-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-brand-purple"
                    checked={enabledLangs.includes('English')}
                    onChange={e => {
                      if (e.target.checked) setEnabledLangs([...enabledLangs, 'English']);
                      else setEnabledLangs(enabledLangs.filter(l => l !== 'English'));
                    }}
                  />
                  English
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-brand-purple"
                    checked={enabledLangs.includes('Hindi')}
                    onChange={e => {
                      if (e.target.checked) setEnabledLangs([...enabledLangs, 'Hindi']);
                      else setEnabledLangs(enabledLangs.filter(l => l !== 'Hindi'));
                    }}
                  />
                  Hindi
                </label>
              </div>
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

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
            <FileText size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold">No exams match your search.</p>
            <button onClick={() => { setSearchTerm(''); setFilterCategory('') }} className="text-brand-purple text-sm font-bold mt-2 hover:underline">Clear Filters</button>
          </div>
        ) : filteredExams.map(exam => (
          <div key={exam.id} className="bg-gray-900/50 border border-gray-800 hover:border-brand-purple/50 rounded-2xl p-6 shadow-xl transition-all group backdrop-blur-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${exam.status === 'Published' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm ${exam.status === 'Published' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{exam.status}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(exam)} className="text-gray-400 hover:text-brand-purple p-2 hover:bg-brand-purple/10 rounded-lg transition-colors"><Edit size={16} /></button>
                <button onClick={() => setExams(exams.filter(e => e.id !== exam.id))} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-200 mt-2 text-lg line-clamp-2 min-h-[56px]">{exam.title}</h3>
            <div className="mt-4 p-4 bg-gray-950/50 rounded-xl border border-gray-800 space-y-3">
              <div className="flex justify-between items-center text-[11px] tracking-wide">
                <span className="text-gray-500 font-bold uppercase">Language</span>
                <span className="font-bold text-gray-200">{exam.language}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] tracking-wide">
                <span className="text-gray-500 font-bold uppercase">Active Rule</span>
                <span className="font-bold text-brand-purple truncate max-w-[120px]">{exam.ruleSet}</span>
              </div>
              {exam.liveStatus && exam.liveStatus !== 'Past' && (
                <div className="flex justify-between items-center text-[11px] bg-red-900/20 p-2 rounded border border-red-900/50">
                  <span className="text-red-400 font-bold uppercase flex items-center gap-1"><Zap size={10} /> Live Mode</span>
                  <span className="font-bold text-red-500">{exam.liveStatus}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- NEW FEATURES: Settings, Inquiries ---

const SettingsView: React.FC<{ settings: any, setSettings: any }> = ({ settings, setSettings }) => {
  const [activeCategory, setActiveCategory] = useState('identity');

  const exportLegacyUsers = async () => {
    if (!confirm("Download legacy user data as CSV for Supabase import?")) return;
    try {
      // Fetch directly from the JSON file path
      const response = await fetch('/data/secure_data.json');
      if (!response.ok) throw new Error("Failed to load secure_data.json");
      const data = await response.json();
      const users = data.users || [];

      if (users.length === 0) {
        alert("No legacy users found.");
        return;
      }

      // Create CSV content
      const headers = ['id', 'email', 'name', 'password', 'role', 'plan', 'status', 'joined'];
      const csvContent = [
        headers.join(','),
        ...users.map((u: any) => [
          u.id,
          u.email,
          `"${u.name}"`, // Quote name to handle commas
          u.password,
          u.role,
          u.plan,
          u.status,
          u.joined
        ].join(','))
      ].join('\n');

      // Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `legacy_users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("Error exporting users: " + e.message);
      console.error(e);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const categories = [
    { id: 'identity', label: 'Site Identity', icon: Globe },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'access', label: 'User Access', icon: ShieldCheck },
    { id: 'comm', label: 'Communication', icon: Mail },
    { id: 'sales', label: 'Sales Logic', icon: Wallet },
    { id: 'content', label: 'Dynamic UI', icon: ImageIcon },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'health', label: 'System Health', icon: HardDrive },
  ];

  return (
    <div className="flex gap-8 h-[calc(100vh-180px)] overflow-hidden">
      {/* Settings Navigation */}
      <div className="w-64 shrink-0 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Settings Categories</h3>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeCategory === cat.id ? 'bg-brand-purple text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
          >
            <cat.icon size={18} className={activeCategory === cat.id ? 'text-white' : 'text-gray-500'} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-xl font-display font-bold text-white capitalize">{activeCategory.replace('-', ' ')} Settings</h2>
            <p className="text-xs text-gray-400 mt-1">Configure your platform's {activeCategory} parameters.</p>
          </div>
          <button
            onClick={async () => {
              await saveAdminStore(getAdminStore());
              alert("Settings Synchronized Successfully!");
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} /> Sync to Live
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* 1. SITE IDENTITY & SEO */}
          {activeCategory === 'identity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-sm">Site Name</label>
                  <input className="input-field" value={settings.siteName} onChange={e => updateSetting('siteName', e.target.value)} />
                </div>
                <div>
                  <label className="label-sm">Site Tagline</label>
                  <input className="input-field" value={settings.siteTagline} onChange={e => updateSetting('siteTagline', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-sm">Favicon URL</label>
                  <input className="input-field" value={settings.faviconUrl} onChange={e => updateSetting('faviconUrl', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="label-sm">Logo (Light Mode)</label>
                  <input className="input-field" value={settings.logoLightUrl} onChange={e => updateSetting('logoLightUrl', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-sm">Timezone</label>
                  <select className="input-field" value={settings.timezone} onChange={e => updateSetting('timezone', e.target.value)}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="label-sm">Currency Symbol</label>
                  <input className="input-field" value={settings.currencySymbol} onChange={e => updateSetting('currencySymbol', e.target.value)} />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Globe size={16} /> SEO & Metadata</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm">Homepage Title (SEO)</label>
                    <input className="input-field" value={settings.seoTitle} onChange={e => updateSetting('seoTitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">Meta Keywords</label>
                    <input className="input-field" value={settings.seoKeywords} onChange={e => updateSetting('seoKeywords', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">Robots.txt Content</label>
                    <textarea className="input-field h-24 font-mono text-xs" value={settings.robotsTxt || ''} onChange={e => updateSetting('robotsTxt', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><ToggleRight size={16} /> Maintenance Control</h4>
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-200">Global "Site Off" / Maintenance Mode</div>
                    <div className="text-xs text-gray-500">Enable this to prevent non-admin users from accessing the site.</div>
                  </div>
                  <button
                    onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                {settings.maintenanceMode && (
                  <div className="mt-4">
                    <label className="label-sm">Custom Maintenance Message</label>
                    <textarea className="input-field h-20" value={settings.maintenanceMessage} onChange={e => updateSetting('maintenanceMessage', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. PAYMENT & BILLING */}
          {activeCategory === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                  <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Zap size={16} /> Razorpay</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label-sm">Key ID</label>
                      <input className="input-field font-mono text-xs" value={settings.razorpayKeyId} onChange={e => updateSetting('razorpayKeyId', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-sm">Key Secret</label>
                      <input className="input-field font-mono text-xs" type="password" value={settings.razorpaySecret} onChange={e => updateSetting('razorpaySecret', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                  <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Shield size={16} /> Mode & UPI</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label-sm">Payment Mode</label>
                      <select className="input-field" value={settings.paymentMode} onChange={e => updateSetting('paymentMode', e.target.value)}>
                        <option value="Sandbox">Sandbox (Test Mode)</option>
                        <option value="Live">Live (Production Mode)</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-sm">Manual UPI ID</label>
                      <input className="input-field" value={settings.upiId} onChange={e => updateSetting('upiId', e.target.value)} placeholder="merchant@upi" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Receipt size={16} /> Invoicing System</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label-sm">Invoice Prefix</label>
                    <input className="input-field" value={settings.invoicePrefix} onChange={e => updateSetting('invoicePrefix', e.target.value)} placeholder="TN-2026-" />
                  </div>
                  <div>
                    <label className="label-sm">Tax Rate (%)</label>
                    <input className="input-field" type="number" value={settings.taxRate} onChange={e => updateSetting('taxRate', Number(e.target.value))} />
                  </div>
                  <div className="col-span-2">
                    <label className="label-sm">Company Billing Address</label>
                    <textarea className="input-field h-20" value={settings.companyAddress} onChange={e => updateSetting('companyAddress', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. USER ACCESS */}
          {activeCategory === 'access' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Monitor size={16} /> Session Security</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label-sm">Multi-Device Login Limit</label>
                    <input className="input-field" type="number" value={settings.multiDeviceLimit} onChange={e => updateSetting('multiDeviceLimit', Number(e.target.value))} />
                    <p className="text-[10px] text-gray-500 mt-1">Number of screens a user can be logged into simultaneously.</p>
                  </div>
                  <div>
                    <label className="label-sm">Session Timeout (Hours)</label>
                    <input className="input-field" type="number" value={settings.sessionTimeout} onChange={e => updateSetting('sessionTimeout', Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Ban size={16} /> Restricted Access</h4>
                <div>
                  <label className="label-sm">Global IP Ban List (Comma-separated)</label>
                  <textarea className="input-field h-24 font-mono text-xs" value={settings.ipBanList?.join(', ') || ''} onChange={e => updateSetting('ipBanList', e.target.value.split(',').map((i: string) => i.trim()))} placeholder="1.2.3.4, 5.6.7.8" />
                </div>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-800 border-l-4 border-l-blue-500">
                <h4 className="font-bold text-gray-200 mb-2 flex items-center gap-2"><Database size={16} /> Legacy Data Migration</h4>
                <p className="text-xs text-gray-400 mb-4">Export users from the legacy JSON database to CSV for import into Supabase.</p>
                <button onClick={exportLegacyUsers} className="btn-primary flex items-center gap-2 text-xs">
                  <Download size={14} /> Export Legacy Users (CSV)
                </button>
              </div>
            </div>
          )}

          {/* 4. COMMUNICATION */}
          {activeCategory === 'comm' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Server size={16} /> SMTP / Email Server</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-sm">Host</label>
                    <input className="input-field font-mono text-xs" value={settings.smtpHost} onChange={e => updateSetting('smtpHost', e.target.value)} placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className="label-sm">Port</label>
                    <input className="input-field font-mono text-xs" value={settings.smtpPort} onChange={e => updateSetting('smtpPort', Number(e.target.value))} placeholder="587" />
                  </div>
                  <div>
                    <label className="label-sm">Username</label>
                    <input className="input-field font-mono text-xs" value={settings.smtpUser} onChange={e => updateSetting('smtpUser', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">Password</label>
                    <input className="input-field font-mono text-xs" type="password" value={settings.smtpPass} onChange={e => updateSetting('smtpPass', e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><MessageSquare size={16} /> API Gateways</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-sm">SMS Gateway API URL</label>
                    <input className="input-field" value={settings.smsApiUrl} onChange={e => updateSetting('smsApiUrl', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">WhatsApp API Key</label>
                    <input className="input-field" value={settings.whatsappApiKey} onChange={e => updateSetting('whatsappApiKey', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SALES & COMBO */}
          {activeCategory === 'sales' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><TrendingUp size={16} /> Bulk Discount Rules</h4>
                <p className="text-xs text-gray-500 mb-4">Set rules for multi-license or bulk package purchases.</p>
                <div className="space-y-3">
                  {(settings.bulkDiscounts || []).map((discount: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="label-sm">Min Quantity</label>
                        <input
                          className="input-field"
                          type="number"
                          value={discount.minQty}
                          onChange={(e) => {
                            const newDiscounts = [...(settings.bulkDiscounts || [])];
                            newDiscounts[idx].minQty = Number(e.target.value);
                            updateSetting('bulkDiscounts', newDiscounts);
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="label-sm">Discount %</label>
                        <input
                          className="input-field"
                          type="number"
                          value={discount.discount}
                          onChange={(e) => {
                            const newDiscounts = [...(settings.bulkDiscounts || [])];
                            newDiscounts[idx].discount = Number(e.target.value);
                            updateSetting('bulkDiscounts', newDiscounts);
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newDiscounts = (settings.bulkDiscounts || []).filter((_: any, i: number) => i !== idx);
                          updateSetting('bulkDiscounts', newDiscounts);
                        }}
                        className="btn-secondary text-red-400 hover:text-red-300 h-[38px]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateSetting('bulkDiscounts', [...(settings.bulkDiscounts || []), { minQty: 10, discount: 5 }])}
                    className="btn-primary flex items-center gap-2 text-xs"
                  >
                    <Plus size={14} /> Add Rule
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/20 p-4 rounded-xl border border-gray-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={settings.contentDripEnabled} onChange={e => updateSetting('contentDripEnabled', e.target.checked)} />
                    <div>
                      <span className="text-sm font-bold text-gray-200">Scheduled Content Unlock</span>
                      <p className="text-[10px] text-gray-500">Enable drip content logic for courses.</p>
                    </div>
                  </label>
                </div>
                <div className="bg-gray-800/20 p-4 rounded-xl border border-gray-800">
                  <label className="label-sm">Expiry Reminders (Days before)</label>
                  <input className="input-field" value={settings.expiryReminders?.join(', ') || ''} onChange={e => updateSetting('expiryReminders', e.target.value.split(',').map((i: string) => parseInt(i.trim())))} />
                </div>
              </div>
            </div>
          )}

          {/* 6. DYNAMIC UI */}
          {activeCategory === 'content' && (
            <div className="space-y-8">
              <div className="bg-gray-800/20 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-6 flex items-center gap-2"><Zap size={16} /> Homepage Hero Section</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm">Hero Title</label>
                    <input className="input-field" value={settings.heroTitle} onChange={e => updateSetting('heroTitle', e.target.value)} placeholder="India's #1 Platform for..." />
                  </div>
                  <div>
                    <label className="label-sm">Hero Subtitle</label>
                    <textarea className="input-field h-20" value={settings.heroSubtitle} onChange={e => updateSetting('heroSubtitle', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-sm">CTA Button Text</label>
                      <input className="input-field" value={settings.heroCTAText} onChange={e => updateSetting('heroCTAText', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-sm">CTA Target Link</label>
                      <input className="input-field font-mono text-xs" value={settings.heroCTALink} onChange={e => updateSetting('heroCTALink', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><ImageIcon size={16} /> Homepage Banners</h4>
                <div className="grid grid-cols-1 gap-4">
                  {(settings.homeBanners || []).map((banner: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-900 border border-gray-700 rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newBanners = (settings.homeBanners || []).filter((_: any, i: number) => i !== idx);
                          updateSetting('homeBanners', newBanners);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-gray-800 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-sm">Image URL</label>
                          <input
                            className="input-field"
                            value={banner.image}
                            onChange={(e) => {
                              const newBanners = [...(settings.homeBanners || [])];
                              newBanners[idx].image = e.target.value;
                              updateSetting('homeBanners', newBanners);
                            }}
                          />
                        </div>
                        <div>
                          <label className="label-sm">Target Link</label>
                          <input
                            className="input-field"
                            value={banner.link}
                            onChange={(e) => {
                              const newBanners = [...(settings.homeBanners || [])];
                              newBanners[idx].link = e.target.value;
                              updateSetting('homeBanners', newBanners);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={banner.active}
                          onChange={(e) => {
                            const newBanners = [...(settings.homeBanners || [])];
                            newBanners[idx].active = e.target.checked;
                            updateSetting('homeBanners', newBanners);
                          }}
                        />
                        <span className="text-xs text-gray-400">Active</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-900 border border-dashed border-gray-700 rounded-xl text-center hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => updateSetting('homeBanners', [...(settings.homeBanners || []), { id: Date.now(), image: '', link: '', active: true }])}
                  >
                    <button className="text-brand-purple text-sm font-bold flex items-center gap-2 mx-auto"><Plus size={16} /> Add New Banner</button>
                    <p className="text-[10px] text-gray-500 mt-2">Recommended size: 1920x600px</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Zap size={16} /> Live Exam Configuration</h4>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-200">Enable 24h Auto-Live Exam</div>
                    <div className="text-xs text-gray-500">Automatically rotates a random "Published" exam as the "Live" exam every 24 hours.</div>
                  </div>
                  <button
                    onClick={() => updateSetting('autoLiveExamEnabled', !settings.autoLiveExamEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoLiveExamEnabled !== false ? 'bg-brand-purple' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoLiveExamEnabled !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Monitor size={16} /> Practice Lab (Exam Library)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm">Practice Lab Title</label>
                    <input
                      className="input-field"
                      value={settings.practiceLabTitle || 'Choose Your Exam'}
                      onChange={e => updateSetting('practiceLabTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-sm">Practice Lab Subtitle</label>
                    <input
                      className="input-field"
                      value={settings.practiceLabSubtitle || 'Pick your target exam category and start mastering your typing speed today.'}
                      onChange={e => updateSetting('practiceLabSubtitle', e.target.value)}
                    />
                  </div>
                  <div className="bg-gray-800/20 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-200">Show Social Proof (Student Count)</div>
                      <div className="text-xs text-gray-500">Displays a random (2000+) count on each exam category.</div>
                    </div>
                    <button
                      onClick={() => updateSetting('showStudentCount', !settings.showStudentCount)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showStudentCount ? 'bg-green-600' : 'bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showStudentCount ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><PenTool size={16} /> Legal Page Editor</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm">Refund & Cancellation Policy</label>
                    <textarea className="input-field h-32" value={settings.legalRefund} onChange={e => updateSetting('legalRefund', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">Privacy Policy</label>
                    <textarea className="input-field h-32" value={settings.legalPrivacy} onChange={e => updateSetting('legalPrivacy', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><List size={16} /> Footer Links (Bottom Bar)</h4>
                <div className="space-y-3">
                  {(settings.footerLinks || []).map((link: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <input className="input-field flex-1" value={link.label} onChange={e => {
                        const newLinks = [...settings.footerLinks];
                        newLinks[idx].label = e.target.value;
                        updateSetting('footerLinks', newLinks);
                      }} placeholder="Label" />
                      <input className="input-field flex-1" value={link.href} onChange={e => {
                        const newLinks = [...settings.footerLinks];
                        newLinks[idx].href = e.target.value;
                        updateSetting('footerLinks', newLinks);
                      }} placeholder="URL / Route" />
                      <button onClick={() => updateSetting('footerLinks', settings.footerLinks.filter((_: any, i: number) => i !== idx))} className="text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateSetting('footerLinks', [...(settings.footerLinks || []), { label: '', href: '' }])} className="btn-secondary text-xs py-1"><Plus size={14} /> Add Link</button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Layout size={16} /> Footer: Exams Covered</h4>
                <div className="space-y-3">
                  {(settings.footerExams || []).map((exam: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <input className="input-field flex-1" value={exam.label} onChange={e => {
                        const newExams = [...settings.footerExams];
                        newExams[idx].label = e.target.value;
                        updateSetting('footerExams', newExams);
                      }} placeholder="Exam Name" />
                      <input className="input-field flex-1" value={exam.href} onChange={e => {
                        const newExams = [...settings.footerExams];
                        newExams[idx].href = e.target.value;
                        updateSetting('footerExams', newExams);
                      }} placeholder="/practice-exams" />
                      <button onClick={() => updateSetting('footerExams', settings.footerExams.filter((_: any, i: number) => i !== idx))} className="text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateSetting('footerExams', [...(settings.footerExams || []), { label: '', href: '' }])} className="btn-secondary text-xs py-1"><Plus size={14} /> Add Exam Link</button>
                </div>
              </div>
            </div>
          )}

          {/* 7. MARKETING */}
          {activeCategory === 'marketing' && (
            <div className="space-y-6">
              <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-900/30">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Tracking & Scripts</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-sm">Google Analytics ID</label>
                    <input className="input-field font-mono text-xs" value={settings.googleAnalyticsId} onChange={e => updateSetting('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="label-sm">Facebook Pixel ID</label>
                    <input className="input-field font-mono text-xs" value={settings.facebookPixelId} onChange={e => updateSetting('facebookPixelId', e.target.value)} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label-sm">Custom Header Scripts</label>
                  <textarea className="input-field h-24 font-mono text-[10px]" value={settings.customHeaderScripts} onChange={e => updateSetting('customHeaderScripts', e.target.value)} placeholder="<script>...</script>" />
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Share2 size={16} /> Affiliate & Referral</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <input type="checkbox" checked={settings.affiliateEnabled} onChange={e => updateSetting('affiliateEnabled', e.target.checked)} />
                    <span className="text-sm text-gray-300 font-bold uppercase">Enable Affiliate System</span>
                  </label>
                  <div>
                    <label className="label-sm">Commission Rate (%)</label>
                    <input className="input-field" type="number" value={settings.affiliateCommission} onChange={e => updateSetting('affiliateCommission', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. SUPPORT */}
          {activeCategory === 'support' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Inbox size={16} /> Helpdesk Rules</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="label-sm">Support Departments (Comma separated)</label>
                    <input className="input-field" value={settings.supportDepartments?.join(', ') || ''} onChange={e => updateSetting('supportDepartments', e.target.value.split(',').map((d: string) => d.trim()))} />
                  </div>
                  <div>
                    <label className="label-sm">Auto-Response Confirmation Message</label>
                    <textarea className="input-field h-24" value={settings.supportAutoReply} onChange={e => updateSetting('supportAutoReply', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-sm">Escalation Threshold (Hours)</label>
                    <input className="input-field w-32" type="number" value={settings.escalationHours} onChange={e => updateSetting('escalationHours', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SYSTEM HEALTH */}
          {activeCategory === 'health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => alert("Cache cleared successfully!")}
                  className="flex flex-col items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all group"
                >
                  <RefreshCw size={32} className="text-orange-500 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-bold text-white">Clear System Cache</span>
                  <span className="text-[10px] text-gray-500 uppercase mt-1">Force update frontend stores</span>
                </button>

                <button
                  onClick={() => alert("Manual backup initiated. Check your email when ready.")}
                  className="flex flex-col items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all group"
                >
                  <Database size={32} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Download DB Backup</span>
                  <span className="text-[10px] text-gray-500 uppercase mt-1">Full database dump (SQL/JSON)</span>
                </button>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><HardDrive size={16} /> Advanced Health Rules</h4>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <input type="checkbox" checked={settings.autoBackupEnabled} onChange={e => updateSetting('autoBackupEnabled', e.target.checked)} />
                    <span className="text-sm text-gray-300 font-bold uppercase">Enable Auto Backups</span>
                  </label>
                  <div>
                    <label className="label-sm">Backup Interval (Hours)</label>
                    <input className="input-field" type="number" value={settings.backupIntervalHours} onChange={e => updateSetting('backupIntervalHours', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- NEW: Pricing & Plan Management ---
const PricingView: React.FC<{ plans: any[], setPlans: any }> = ({ plans, setPlans }) => {
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const initialPlan = {
    id: '',
    name: '',
    durationMonths: 1,
    price: 99,
    currency: 'INR',
    features: ['Unlimited Typing Tests', 'Exam Mode Access'],
    isActive: true,
    type: 'Standard'
  };

  const [formData, setFormData] = useState(initialPlan);

  const handleSave = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...formData, id: editingPlan.id } : p));
    } else {
      setPlans([...plans, { ...formData, id: `plan_${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setEditingPlan(null);
    setFormData(initialPlan);
  };

  const openEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this plan? Users on this plan might be affected.")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Subscription Plans</h2>
          <p className="text-gray-400 text-sm">Manage pricing tiers and features.</p>
        </div>
        <button onClick={() => { setEditingPlan(null); setFormData(initialPlan); setIsFormOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-gray-900 border ${plan.isActive ? 'border-gray-700' : 'border-red-900/50 opacity-75'} rounded-xl p-6 relative group hover:border-brand-purple transition-all`}>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(plan)} className="p-1.5 bg-gray-800 text-blue-400 rounded hover:bg-blue-900/30"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(plan.id)} className="p-1.5 bg-gray-800 text-red-400 rounded hover:bg-red-900/30"><Trash2 size={14} /></button>
            </div>

            <div className="mb-4">
              <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${plan.type === 'Pro' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'}`}>
                {plan.type}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="text-2xl font-bold text-white mb-4">
              ₹{plan.price} <span className="text-sm text-gray-500 font-normal">/ {plan.durationMonths} Mo</span>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.slice(0, 4).map((f: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-green-500 mt-0.5" /> {f}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span className={`text-xs font-bold ${plan.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-600 font-mono">{plan.id}</span>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">{editingPlan ? 'Edit Plan' : 'New Plan'}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-sm">Plan Name</label><input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
              <div><label className="label-sm">Type</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                  <option value="Standard">Standard</option>
                  <option value="Pro">Pro</option>
                  <option value="Institute">Institute</option>
                </select>
              </div>
              <div><label className="label-sm">Price (₹)</label><input type="number" className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} /></div>
              <div><label className="label-sm">Duration (Months)</label><input type="number" className="input-field" value={formData.durationMonths} onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })} /></div>
            </div>

            <div>
              <label className="label-sm">Features (Comma Separated)</label>
              <textarea
                className="input-field h-24"
                value={formData.features.join(', ')}
                onChange={e => setFormData({ ...formData, features: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Unlimited Tests, No Ads, Certificate..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
              <span className="text-sm text-gray-300">Plan is Active & Visible</span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save Plan</button>
            </div>
          </div>
        </div>
      )}
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
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ code: '', discountType: 'Percentage', discountValue: 0, expiryDate: '', usageLimit: 100, isActive: true });

  const handleCreate = () => {
    const newCoupon = {
      id: `coup_${Date.now()}`,
      ...formData,
      usedCount: 0,
      code: formData.code.toUpperCase()
    };
    setCoupons([newCoupon, ...coupons]);
    setShowAdd(false);
    setFormData({ code: '', discountType: 'Percentage', discountValue: 0, expiryDate: '', usageLimit: 100, isActive: true });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete coupon?')) setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Coupons & Discounts</h2>
          <p className="text-sm text-gray-400">Create promo codes for plans</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Coupon</button>
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl mb-6">
          <h3 className="font-bold text-white mb-4">Create New Coupon</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className="label-sm">Code</label><input className="input-field bg-gray-800 border-gray-700 uppercase" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="SUMMER50" /></div>
            <div><label className="label-sm">Type</label><select className="input-field bg-gray-800 border-gray-700" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}><option>Percentage</option><option>Flat</option></select></div>
            <div><label className="label-sm">Value</label><input type="number" className="input-field bg-gray-800 border-gray-700" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} /></div>
            <div><label className="label-sm">Expiry Date</label><input type="date" className="input-field bg-gray-800 border-gray-700" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} /></div>
            <div><label className="label-sm">Usage Limit</label><input type="number" className="input-field bg-gray-800 border-gray-700" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} className="btn-primary">Create Coupon</button>
          </div>
        </div>
      )}

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-gray-400 font-bold uppercase text-[10px]"><tr><th className="px-6 py-4">Code</th><th className="px-6 py-4">Discount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Usage</th><th className="px-6 py-4">Expiry</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-gray-800">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 font-mono font-bold text-brand-purple">{c.code}</td>
                <td className="px-6 py-4 text-gray-200 font-bold">{c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`} OFF</td>
                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.isActive ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-gray-400">{c.usedCount} / {c.usageLimit}</td>
                <td className="px-6 py-4 text-gray-400">{c.expiryDate || 'Never'}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PricingManager: React.FC<{ packages: any[], setPackages: any }> = ({ packages, setPackages }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPkg, setNewPkg] = useState({
    name: '', subtitle: '', price: '', currency: '₹', period: '/ Year',
    durationDays: 30, features: [] as string[], isCombo: false,
    highlight: false, badge: '', type: 'Student', buttonText: 'Get Started'
  });
  const [currentFeature, setCurrentFeature] = useState('');

  const resetForm = () => {
    setNewPkg({
      name: '', subtitle: '', price: '', currency: '₹', period: '/ Year',
      durationDays: 30, features: [], isCombo: false,
      highlight: false, badge: '', type: 'Student', buttonText: 'Get Started'
    });
    setEditingId(null);
    setShowAdd(false);
  };

  const handleEdit = (pkg: any) => {
    setNewPkg({
      ...pkg,
      price: pkg.price.toString()
    });
    setEditingId(pkg.id);
    setShowAdd(true);
  };

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

    let updatedPackages;
    if (editingId) {
      updatedPackages = packages.map(p => p.id === editingId ? { ...p, ...newPkg, price: Number(newPkg.price) } : p);
    } else {
      const id = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
      updatedPackages = [...packages, { id, ...newPkg, price: Number(newPkg.price) }];
    }

    setPackages(updatedPackages);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Pricing & Packages</h2>
          <p className="text-xs text-gray-400">Manage subscription plans, combos, and pricing cards displayed on the website.</p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create New Package
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-brand-purple rounded-xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-brand-purple flex items-center gap-2 border-b border-gray-800 pb-4">
            <Tag size={20} /> {editingId ? 'Edit Package' : 'New Package Configuration'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="label-sm">Package Name</label>
              <input className="input-field" placeholder="e.g. 1 Year Premium" value={newPkg.name} onChange={e => setNewPkg({ ...newPkg, name: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Subtitle / Tagline</label>
              <input className="input-field" placeholder="e.g. Best for Students" value={newPkg.subtitle} onChange={e => setNewPkg({ ...newPkg, subtitle: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Type</label>
              <select className="input-field" value={newPkg.type} onChange={e => setNewPkg({ ...newPkg, type: e.target.value as any })}>
                <option value="Student">Student Plan</option>
                <option value="Institute">Institute / Bulk</option>
              </select>
            </div>

            <div>
              <label className="label-sm">Price (Amount)</label>
              <input className="input-field" type="number" placeholder="499" value={newPkg.price} onChange={e => setNewPkg({ ...newPkg, price: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Currency Symbol</label>
              <input className="input-field" placeholder="₹" value={newPkg.currency} onChange={e => setNewPkg({ ...newPkg, currency: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Billing Period Text</label>
              <input className="input-field" placeholder="e.g. / Year" value={newPkg.period} onChange={e => setNewPkg({ ...newPkg, period: e.target.value })} />
            </div>

            <div>
              <label className="label-sm">Duration (Days)</label>
              <input className="input-field" type="number" placeholder="365" value={newPkg.durationDays} onChange={e => setNewPkg({ ...newPkg, durationDays: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label-sm">CTA Button Text</label>
              <input className="input-field" placeholder="Get Started" value={newPkg.buttonText} onChange={e => setNewPkg({ ...newPkg, buttonText: e.target.value })} />
            </div>
            <div>
              <label className="label-sm">Ribbon Badge (Optional)</label>
              <input className="input-field" placeholder="e.g. Best Value" value={newPkg.badge || ''} onChange={e => setNewPkg({ ...newPkg, badge: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-6 mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-brand-purple" checked={newPkg.isCombo} onChange={e => setNewPkg({ ...newPkg, isCombo: e.target.checked })} />
              <span className="text-sm font-bold text-gray-300">Is Combo Pack?</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-brand-purple" checked={newPkg.highlight} onChange={e => setNewPkg({ ...newPkg, highlight: e.target.checked })} />
              <span className="text-sm font-bold text-gray-300">Highlight (Glow Effect)</span>
            </label>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
            <label className="label-sm mb-2">Included Features (Features List)</label>
            <div className="flex gap-2 mb-3">
              <input className="input-field" placeholder="e.g. Unlimited Tests" value={currentFeature} onChange={e => setCurrentFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFeature()} />
              <button onClick={addFeature} className="bg-black text-white px-4 rounded font-bold text-xs hover:bg-gray-800 transition-colors">ADD</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPkg.features.map((f, i) => (
                <span key={i} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-gray-200 group">
                  {f} <button onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-400 group-hover:block ml-1">×</button>
                </span>
              ))}
              {newPkg.features.length === 0 && <span className="text-xs text-gray-500 italic">No features added yet.</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={resetForm} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary px-8">Save Package</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {packages.map(p => (
          <div key={p.id} className={`bg-gray-900/50 p-6 rounded-xl border relative group transition-all hover:-translate-y-1 ${p.highlight ? 'border-brand-purple shadow-lg shadow-purple-900/10' : 'border-gray-800 hover:border-gray-700'}`}>
            {(p.badge || p.isCombo) && (
              <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl text-white ${p.isCombo ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-brand-purple'}`}>
                {p.badge || (p.isCombo ? 'COMBO' : '')}
              </div>
            )}

            <div className="mt-2">
              <h3 className="font-bold text-lg text-white">{p.name}</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">{p.subtitle}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-lg font-bold text-gray-400">{p.currency}</span>
              <span className="text-3xl font-display font-bold text-white">{p.price}</span>
              <span className="text-xs text-gray-500 font-medium">{p.period}</span>
            </div>

            <div className="space-y-3 mb-6 min-h-[100px]">
              {p.features?.slice(0, 4).map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Check size={10} className="text-green-400" />
                  </div>
                  <span className="line-clamp-1">{f}</span>
                </div>
              ))}
              {p.features?.length > 4 && <div className="text-xs text-gray-500 pl-8">+{p.features.length - 4} more features</div>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="flex-1 py-2 border border-blue-900/50 bg-blue-900/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="flex-1 py-2 border border-red-900/50 bg-red-900/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl">
            <Tag size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-gray-400 font-bold mb-2">No Packages Found</h3>
            <p className="text-gray-600 text-sm">Create your first subscription plan to get started.</p>
          </div>
        )}
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

const isUserOnline = (lastSeen?: string) => {
  if (!lastSeen) return false;
  const diff = new Date().getTime() - new Date(lastSeen).getTime();
  return diff < 5 * 60 * 1000; // 5 minutes
};

const UsersView: React.FC<{ users: any[], setUsers: any, toggleUserStatus: (id: number) => void, deleteUser: (id: number) => void }> = ({ users: initialUsers, setUsers, toggleUserStatus, deleteUser }) => {
  const [appUsers, setAppUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', plan: 'Free', role: 'User', status: 'Active' as 'Active' | 'Inactive' | 'Banned', purchasedPackIds: [] as string[], password: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filters
  const [filterRole, setFilterRole] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPack, setFilterPack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const store = getAdminStore();
  const comboPacks = store.comboPacks || [];
  const plans = store.plans || [];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Dynamic import to avoid circular dependency issues if any, though standard import works
    const { fetchAppUsers } = await import('../utils/adminStore');
    const users = await fetchAppUsers();

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
    const matchesPack = filterPack === 'All' || (user.purchasedPackIds && user.purchasedPackIds.includes(filterPack));

    return matchesSearch && matchesRole && matchesPlan && matchesStatus && matchesPack;
  });

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', plan: 'Free', role: 'User', status: 'Active', purchasedPackIds: [], password: '' });
    setShowModal(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const togglePackAccess = (packId: string) => {
    // Treat Pack ID as string since we use strings in DB
    const pid = packId.toString();
    if (formData.purchasedPackIds.includes(pid)) {
      setFormData({ ...formData, purchasedPackIds: formData.purchasedPackIds.filter(id => id !== pid) });
    } else {
      setFormData({ ...formData, purchasedPackIds: [...formData.purchasedPackIds, pid] });
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      status: user.status as any,
      purchasedPackIds: user.purchasedPackIds || [],
      password: ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    // Import update function
    const { updateAppUser, sendPasswordReset } = await import('../utils/adminStore');

    // 1. Prepare updates
    const updates: any = {
      name: formData.name,
      plan: formData.plan,
      role: formData.role,
      status: formData.status,
      purchasedPackIds: formData.purchasedPackIds
    };

    if (editingId) {
      // UPDATE EXISTING USER
      const success = await updateAppUser(editingId, updates);
      if (success) {
        addAdminLog({
          adminName: 'Admin',
          action: 'User Updated',
          details: `Updated ${formData.email}: Role=${formData.role}, Plan=${formData.plan}`,
          type: 'success'
        });

        // Update local list
        setAppUsers(appUsers.map(u => u.id === editingId ? { ...u, ...updates } : u));
        setShowModal(false);
      } else {
        alert("Failed to update user in database.");
      }
    } else {
      alert("Please ask user to Sign Up via the website. Admins can only edit existing users for security.");
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) return;
    if (confirm(`Send password reset email to ${formData.email}?`)) {
      const { sendPasswordReset } = await import('../utils/adminStore');
      const { success, msg } = await sendPasswordReset(formData.email);
      alert(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">User Management</h2>
          <p className="text-sm text-gray-400">Manage students, assign plans, and control access.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} className="btn-secondary"><RefreshCw size={16} /></button>
          {/* <button onClick={handleAddUser} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add User</button> */}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            className="input-field pl-10 bg-gray-950 border-gray-700"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="input-field w-32 bg-gray-950 border-gray-700" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="Super Admin">Super Admin</option>
        </select>
        <select className="input-field w-32 bg-gray-950 border-gray-700" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
          <option value="All">All Plans</option>
          <option value="Free">Free</option>
          {plans.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <select className="input-field w-40 bg-gray-950 border-gray-700" value={filterPack} onChange={e => setFilterPack(e.target.value)}>
          <option value="All">All Combo Packs</option>
          {comboPacks.map(pack => <option key={pack.id} value={pack.id}>{pack.title}</option>)}
        </select>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit User Access' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
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
                <div>
                  <label className="label-sm">Account Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple font-bold">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
                <div>
                  <label className="label-sm">Security</label>
                  <p className="text-xs text-gray-400">Use the "Send Reset Email" button below to allow the student to securely change their own password.</p>
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

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                  {editingId && (
                    <button onClick={handlePasswordReset} className="bg-orange-600/20 text-orange-500 border border-orange-600/50 px-3 py-2 rounded-lg text-xs font-bold hover:bg-orange-600/30 transition-colors flex items-center gap-2">
                      <Mail size={14} /> Send Reset Email
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleSave} className="btn-primary">{editingId ? 'Save Changes' : 'Create Account'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User List Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-700 bg-gray-800 text-brand-purple focus:ring-0 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Access Tier</th>
                  <th className="px-6 py-4">Combo Packs</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found matching filters.</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className={`hover:bg-brand-purple/5 transition-all group ${selectedIds.includes(user.id) ? 'bg-brand-purple/10' : ''}`}>
                      <td className="px-6 py-4 w-10">
                        <input type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={(e) => { e.stopPropagation(); handleSelect(user.id); }}
                          className="rounded border-gray-700 bg-gray-800 text-brand-purple focus:ring-0 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-gray-200 group-hover:text-white">{user.name}</div>
                          {isUserOnline(user.last_seen) && (
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Online Now"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-tight">{user.email}</div>
                        <div className="text-[10px] text-gray-600 mt-1 flex gap-2">
                          <span>Joined: {new Date(user.joined).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.plan && user.plan.includes('Pro') ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                          {user.plan || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.purchasedPackIds && user.purchasedPackIds.length > 0 ? (
                          <span className="text-xs text-brand-purple font-bold">{user.purchasedPackIds.length} Packs Owned</span>
                        ) : <span className="text-xs text-gray-600">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.status === 'Active' ? 'text-green-500 bg-green-900/10' : 'text-red-500 bg-red-900/10'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditUser(user)} className="text-brand-purple hover:text-white font-bold text-xs">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit User Access</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-sm">Name</label><input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div><label className="label-sm">Email (Read Only)</label><input className="input-field opacity-50 cursor-not-allowed" value={formData.email} disabled /></div>
              </div>

              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800 space-y-4">
                <h4 className="font-bold text-brand-purple flex items-center gap-2"><Shield size={16} /> Access Level</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-sm">Role</label>
                    <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })}>
                      <option value="User">User</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-sm">Account Status</label>
                    <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Banned">Banned</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800 space-y-4">
                <h4 className="font-bold text-green-500 flex items-center gap-2"><Award size={16} /> Subscription & Packs</h4>
                <div>
                  <label className="label-sm">Primary Plan</label>
                  <select className="input-field" value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })}>
                    <option value="Free">Free</option>
                    {plans.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label-sm mb-2">Grant Combo Packs</label>
                  <div className="max-h-32 overflow-y-auto bg-gray-900 border border-gray-700 rounded p-2 grid grid-cols-1 gap-1">
                    {comboPacks.map((pack: any) => (
                      <label key={pack.id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.purchasedPackIds.includes(pack.id.toString())}
                          onChange={() => togglePackAccess(pack.id.toString())}
                          className="accent-brand-purple"
                        />
                        <span className="text-sm text-gray-300">{pack.name}</span>
                      </label>
                    ))}
                    {comboPacks.length === 0 && <span className="text-xs text-gray-500">No combo packs created yet.</span>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Security</h4>
                  <p className="text-xs text-gray-500">Send a password reset link to user's email.</p>
                </div>
                <button onClick={handlePasswordReset} className="text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded border border-gray-600">
                  Send Reset Email
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary shadow-lg shadow-purple-900/20">Save Access Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const BillingView: React.FC<{ invoices: any[], setInvoices: any, users: any[], transactions: any[] }> = ({ invoices, setInvoices, users, transactions = [] }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions'>('invoices');
  const [showAdd, setShowAdd] = useState(false);
  const [newInv, setNewInv] = useState({ userId: '', amount: '', description: '', dueDate: '' });

  const handleCreate = () => {
    const user = users.find(u => u.id === newInv.userId);
    const inv = {
      id: `INV-${Date.now()}`,
      userId: newInv.userId,
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
                  <html><head><title>Invoice ${inv.id}</title><style>body{font - family:sans-serif;padding:20px;}</style></head>
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-display font-bold">Billing & Invoices</h2>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
            <button onClick={() => setActiveTab('invoices')} className={`px-4 py-1 text-xs font-bold rounded ${activeTab === 'invoices' ? 'bg-brand-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}>Manual Invoices</button>
            <button onClick={() => setActiveTab('transactions')} className={`px-4 py-1 text-xs font-bold rounded ${activeTab === 'transactions' ? 'bg-brand-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}>Online Transactions</button>
          </div>
        </div>
        {activeTab === 'invoices' && <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Invoice</button>}
      </div>

      {showAdd && activeTab === 'invoices' && (
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

      {activeTab === 'invoices' ? (
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
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-700">
              <tr><th className="px-6 py-4">Transaction ID</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Plan Name</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Method</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-500">No transactions found</td></tr> :
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 font-mono text-xs text-brand-purple">{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-200">{tx.userName}</td>
                    <td className="px-6 py-4 text-gray-400">{tx.planId}</td>
                    <td className="px-6 py-4 font-bold text-green-400">₹{tx.amount}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{tx.date}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{tx.paymentMethod}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tx.status === 'Success' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>{tx.status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
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
  const users = store.users || [];
  const payments = store.payments || [];

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'green' },
    { label: 'Total Tests Taken', value: store.results?.length || 0, color: 'blue' },
    { label: 'Active Users', value: users.filter((u: any) => u.status === 'Active').length || 0, color: 'purple' },
    { label: 'Support Tickets', value: store.supportTickets?.length || 0, color: 'orange' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold font-display text-white">Detailed Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2 relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-bold font-display text-gray-100 relative z-10">{stat.value}</h3>
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

const SupportView: React.FC<{ tickets: any[], setTickets: any }> = ({ tickets, setTickets }) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');

  const handleStatusChange = (status: string) => {
    if (!selectedTicket) return;
    const updated = { ...selectedTicket, status, updatedAt: new Date().toISOString() };
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    addAdminLog({ adminName: 'Admin', action: 'Ticket Updated', details: `Ticket ${selectedTicket.id} status changed to ${status}`, type: 'info' });
  };

  const handleSendReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Admin',
      message: reply,
      timestamp: new Date().toISOString()
    };
    const updated = {
      ...selectedTicket,
      updatedAt: new Date().toISOString(),
      messages: [...selectedTicket.messages, newMessage],
      status: 'In Progress' // Auto-update status on reply
    };
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    setReply('');
    addAdminLog({ adminName: 'Admin', action: 'Reply Sent', details: `Replied to Ticket ${selectedTicket.id}`, type: 'success' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {selectedTicket ? (
        <div className="flex flex-col h-[calc(100vh-150px)]">
          {/* Header */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {selectedTicket.subject}
                  <span className={`px-2 py-0.5 text-xs rounded border ${selectedTicket.priority === 'High' ? 'bg-red-900/20 text-red-500 border-red-800' : 'bg-blue-900/20 text-blue-500 border-blue-800'}`}>
                    {selectedTicket.priority}
                  </span>
                </h2>
                <div className="text-xs text-gray-500 flex gap-2 mt-1">
                  <span>Ticket #{selectedTicket.id}</span>
                  <span>•</span>
                  <span>User: {selectedTicket.userName}</span>
                  <span>•</span>
                  <span>Category: {selectedTicket.category}</span>
                </div>
              </div>
            </div>
            <select
              value={selectedTicket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-2 focus:border-brand-purple"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>

          {/* Chat Body */}
          <div className="flex-1 bg-gray-950/50 border-x border-gray-800 p-6 overflow-y-auto space-y-4">
            {selectedTicket.messages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender === 'Admin' ? 'bg-brand-purple text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                  <div className="text-xs opacity-70 mb-1 flex justify-between gap-4">
                    <span className="font-bold">{msg.sender}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-b-xl flex gap-2">
            <textarea
              className="flex-1 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-purple resize-none"
              rows={2}
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendReply())}
            />
            <button onClick={handleSendReply} className="btn-primary self-end h-full aspect-square flex items-center justify-center">
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-display text-white">Support Tickets</h2>
            <div className="flex gap-2">
              <select className="bg-gray-900 border border-gray-700 text-gray-400 text-xs rounded-lg p-2">
                <option>All Status</option>
                <option>Open</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
                <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Subject</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Last Update</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-200">{ticket.subject}</div>
                      <div className="text-xs text-brand-purple">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{ticket.userName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ticket.status === 'Open' ? 'bg-green-900/20 text-green-400 border-green-800' :
                        ticket.status === 'Resolved' ? 'bg-gray-800 text-gray-500 border-gray-700' :
                          'bg-blue-900/20 text-blue-400 border-blue-800'
                        }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      <ChevronRight size={16} className="ml-auto" />
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No tickets found.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
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
              </div>
              <div><label className="label-sm">Content</label><textarea className="input-field bg-gray-900 border-gray-700 text-gray-200 focus:border-brand-purple h-40" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>

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
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${p.language === 'Hindi' ? 'bg-orange-900/20 text-orange-400 border-orange-800' : 'bg-blue-900/20 text-blue-400 border-blue-800'}`}>{p.language}</span></td>
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

// --- NEW: Sync Status Badge ---
const SyncStatusBadge: React.FC = () => {
  const [status, setStatus] = useState(localStorage.getItem('ar_typing_sync_status') || 'Ready');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkStatus = () => setStatus(localStorage.getItem('ar_typing_sync_status') || 'Ready');
    window.addEventListener('adminStoreUpdate', checkStatus);
    const interval = setInterval(checkStatus, 2000);
    return () => {
      window.removeEventListener('adminStoreUpdate', checkStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncSettingsFromHost();
    setIsSyncing(false);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-xl shadow-inner">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Live Sync</span>
        <span className={`text-[11px] font-bold leading-none ${status.includes('Failed') ? 'text-red-400' : status.includes('Ready') || status.includes('Up') ? 'text-blue-400' : 'text-green-400'}`}>
          {status}
        </span>
      </div>
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`p-1.5 rounded-lg bg-gray-700/50 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-all ${isSyncing ? 'animate-spin' : ''}`}
        title="Force Refresh from Server"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
};

// --- CERTIFICATE MANAGER VIEW ---
const CertificateView: React.FC<any> = ({ templates, criteria, setCriteria }) => {
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

// --- ANNOUNCEMENT MANAGER VIEW ---
const AnnouncementManager: React.FC<{ announcements: any[], setAnnouncements: any }> = ({ announcements, setAnnouncements }) => {
  const [form, setForm] = useState({ message: '', type: 'Info', isActive: true });

  const handleAdd = () => {
    if (!form.message) return;
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      ...form,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days
    };
    // Ensure only one active announcement for simplicity, or allow multiple
    // detailed request implies "global Announcement Bar", usually singular.
    // Let's toggle others off if this one is active to avoid clutter, or just append.
    // For a single bar, it's best to have one active at a time or cycle.
    // Let's just append for now.
    setAnnouncements([newAnnouncement, ...announcements]);
    setForm({ message: '', type: 'Info', isActive: true });
    addAdminLog({ adminName: 'Admin', action: 'Announcement Created', details: `Created: ${form.message}`, type: 'info' });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const toggleActive = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold font-display text-white">Announcement Bar</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="font-bold text-gray-200 mb-4">Create New Announcement</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label-sm">Message</label>
            <input className="input-field bg-gray-950 border-gray-700" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="e.g., Server Maintenance tonight at 10 PM" />
          </div>
          <div className="w-32">
            <label className="label-sm">Type</label>
            <select className="input-field bg-gray-950 border-gray-700" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Info</option>
              <option>Warning</option>
              <option>Success</option>
              <option>Danger</option>
            </select>
          </div>
          <button onClick={handleAdd} className="btn-primary h-[38px] flex items-center gap-2"><Plus size={16} /> Publish</button>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Message</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {announcements.map(a => (
              <tr key={a.id} className="hover:bg-gray-800/50">
                <td className="p-4 font-bold text-gray-200">{a.message}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${a.type === 'Info' ? 'bg-blue-900/20 text-blue-400 border-blue-800' :
                    a.type === 'Warning' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' :
                      a.type === 'Success' ? 'bg-green-900/20 text-green-400 border-green-800' :
                        'bg-red-900/20 text-red-400 border-red-800'
                    }`}>{a.type}</span>
                </td>
                <td className="p-4">
                  <button onClick={() => toggleActive(a.id)} className={`text-xs font-bold ${a.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {announcements.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No announcements.</td></tr>}
          </tbody>
        </table>
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
  const [realUserCount, setRealUserCount] = useState(0); // State for real user count
  const navigate = useNavigate();

  useEffect(() => {
    const loadStore = async () => {
      try {
        // 1. Initial Local Load
        const localData = getAdminStore();
        if (localData) setStore(localData);

        // 2. Background Sync
        await syncSettingsFromHost();

        // 3. Final Sync Update
        const data = getAdminStore();
        if (data) setStore(data);
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

  // Fetch real user count from Supabase for Dashboard
  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        setRealUserCount(count);
      }
    };
    fetchCount();
  }, []);

  const handleReset = () => { localStorage.removeItem('ar_typing_admin_store_v2'); window.location.reload(); };

  if (error) return <div className="p-10 text-red-600">Error: {error} <button onClick={handleReset}>Reset</button></div>;
  if (!store) return <div className="p-10">Loading...</div>;

  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

  // SECURE GUARD: Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) return null; // Prevent rendering while redirecting

  // Dynamic Stats Calculation with safety guards
  const totalRevenue = (store?.payments || []).reduce((sum: number, p: any) => {
    try {
      const amountVal = p?.amount !== undefined && p?.amount !== null ? p.amount : 0;
      const amount = parseFloat(amountVal.toString().replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    } catch (err) {
      return sum;
    }
  }, 0);

  const stats = [
    { label: "Total Students", value: realUserCount || store?.users?.length || 0, change: "+0%", icon: <Users size={20} className="text-blue-600" /> },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+0%", icon: <DollarSign size={20} className="text-green-600" /> },
    { label: "Active Plans", value: (store?.users || []).filter((u: any) => u?.plan !== 'Basic').length, change: "Current", icon: <CreditCard size={20} className="text-brand-purple" /> },
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
          <SidebarItem id="content" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={FileText} label="Exams & Content" />
          <SidebarItem id="exam-profiles" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={ShieldCheck} label="Exam Profiles" />
          <SidebarItem id="content-library" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={BookOpen} label="Paragraphs Library" />
          <SidebarItem id="cpt-tests" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={FileSpreadsheet} label="CPT Management" />
          <SidebarItem id="ads" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Megaphone} label="Ads Manager" />
          <SidebarItem id="pricing" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Tag} label="Pricing & Packages" />

          {store?.users && currentUser && (store.users.find((u: any) => u.id === currentUser?.id)?.role === 'Super Admin') && (
            <>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Super Admin</p>
              <SidebarItem id="admins" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Shield} label="Admin Management" />
            </>
          )}

          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">System Controls</p>
          <SidebarItem id="course-manager" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Layers} label="Course Manager" />
          <SidebarItem id="certificates" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Award} label="Certificates" />
          <SidebarItem id="system" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Cpu} label="System Health" />
          <SidebarItem id="settings" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={Settings} label="Global Settings" />
          <SidebarItem id="logs" activeTab={activeTab} setActiveTab={(id: string) => { setActiveTab(id); setMobileMenuOpen(false); }} icon={ClipboardList} label="Activity Logs" />

        </div>
        <div className="p-4 border-t border-gray-800 mt-auto bg-gray-900/50 space-y-2">
          <a href="https://typingnexus.in" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs text-brand-purple hover:bg-brand-purple/10 bg-gray-800 border border-brand-purple/30 shadow-lg group">
            <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
            <span>Visit Website</span>
          </a>
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

        {/* Desktop Header Sync Bar (New) */}
        <div className="hidden md:flex items-center justify-between px-10 py-4 bg-gray-950/30 border-b border-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse"></div>
              System {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <SyncStatusBadge />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView stats={stats} />}
            {activeTab === 'users' && <UsersView users={store.users} setUsers={(u: any) => saveAdminStore({ ...store, users: u })} toggleUserStatus={toggleUserStatus} deleteUser={deleteUser} />}
            {activeTab === 'content' && <ContentView exams={store.exams} setExams={(e: any) => saveAdminStore({ ...store, exams: e })} rules={store.rules} categories={store.categories} setCategories={(c: any) => saveAdminStore({ ...store, categories: c })} examProfiles={store.examProfiles || []} setExamProfiles={(ep: any) => saveAdminStore({ ...store, examProfiles: ep })} />}
            {activeTab === 'ads' && <AdsView ads={store.ads} setAds={(a: any) => saveAdminStore({ ...store, ads: a })} />}
            {activeTab === 'announcements' && <AnnouncementManager announcements={store.announcements} setAnnouncements={(a: any) => saveAdminStore({ ...store, announcements: a })} />}
            {activeTab === 'admins' && <AdminsView />}
            {activeTab === 'system' && <SystemView />}
            {activeTab === 'settings' && <SettingsView settings={store.settings} setSettings={(s: any) => saveAdminStore({ ...store, settings: s })} />}
            {activeTab === 'logs' && <LogsView />}
            {activeTab === 'exam-profiles' && <ExamProfileManager />}
            {activeTab === 'content-library' && <ContentLibrary />}
            {activeTab === 'cpt-tests' && <CPTTestManager />}
            {activeTab === 'course-manager' && <CourseManager />}
            {activeTab === 'certificates' && <CertificateView templates={store.certificateTemplates} criteria={store.certificateCriteria} setCriteria={(c: any) => saveAdminStore({ ...store, certificateCriteria: c })} />}
            {activeTab === 'pricing' && <PricingManager packages={store.packages || []} setPackages={(p: any) => saveAdminStore({ ...store, packages: p })} />}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;