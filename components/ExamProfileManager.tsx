import React, { useState } from 'react';
import {
    Settings, Plus, Trash2, Edit, Calculator, AlertTriangle,
    Shield, Clock, Languages, UploadCloud, FileJson, Download,
    X, Check, Eye, FileText, Upload, Package
} from 'lucide-react';
import {
    getAdminStore, saveAdminStore, DEFAULT_EXAM_PROFILE, ContentItem
} from '../utils/adminStore';
import { ExamProfile } from '../types/profile';
import ExamProfileForm from './ExamProfileForm';

const ExamProfileManager: React.FC = () => {
    const [store, setStore] = useState(getAdminStore());
    const [profiles, setProfiles] = useState<ExamProfile[]>(store.examProfiles || []);
    const [showForm, setShowForm] = useState(false);
    const [editingProfile, setEditingProfile] = useState<ExamProfile | undefined>(undefined);

    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadMode, setUploadMode] = useState<'bulk' | 'single' | 'unified'>('bulk');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [parsedProfiles, setParsedProfiles] = useState<ExamProfile[]>([]);
    const [parsedContent, setParsedContent] = useState<ContentItem[]>([]);
    const [isUnifiedFormat, setIsUnifiedFormat] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const refreshStore = () => {
        const s = getAdminStore();
        setStore(s);
        setProfiles(s.examProfiles || []);
    };

    const handleEdit = (profile: ExamProfile) => {
        setEditingProfile(profile);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this profile?')) {
            const updated = profiles.filter(p => p.id !== id);
            saveAdminStore({ ...store, examProfiles: updated });
            refreshStore();
        }
    };

    // --- Upload Handlers ---

    const openUploadModal = (mode: 'bulk' | 'single' | 'unified') => {
        setUploadMode(mode);
        setUploadFile(null);
        setParsedProfiles([]);
        setParsedContent([]);
        setIsUnifiedFormat(false);
        setParseError(null);
        setPreviewIndex(null);
        setShowUploadModal(true);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadFile(file);
        setParseError(null);
        setParsedProfiles([]);
        setParsedContent([]);
        setIsUnifiedFormat(false);
        setPreviewIndex(null);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // --- Detect Unified Format (has both "profiles" and "content" keys) ---
            if (data.profiles && data.content) {
                setIsUnifiedFormat(true);
                const profileArray = Array.isArray(data.profiles) ? data.profiles : [data.profiles];
                const contentArray = Array.isArray(data.content) ? data.content : [data.content];

                // Parse Profiles
                const validatedProfiles: ExamProfile[] = [];
                const errors: string[] = [];

                profileArray.forEach((raw: any, idx: number) => {
                    if (!raw.profileName) {
                        errors.push(`Profile #${idx + 1}: Missing "profileName"`);
                        return;
                    }
                    const cleaned: any = {};
                    Object.keys(raw).forEach(key => {
                        if (!key.startsWith('_')) cleaned[key] = raw[key];
                    });
                    validatedProfiles.push({
                        ...DEFAULT_EXAM_PROFILE,
                        ...cleaned,
                        id: cleaned.id || `profile-${Date.now()}-${idx}`
                    });
                });

                // Parse Content Items
                const validatedContent: ContentItem[] = [];
                contentArray.forEach((raw: any, idx: number) => {
                    if (!raw.title || !raw.text) {
                        errors.push(`Content #${idx + 1}: Missing "title" or "text"`);
                        return;
                    }
                    validatedContent.push({
                        id: raw.id || `content-${Date.now()}-${idx}`,
                        title: raw.title,
                        text: raw.text,
                        language: raw.language || 'English',
                        font: raw.font || (raw.language === 'Hindi' ? 'Mangal' : 'Sans'),
                        difficulty: raw.difficulty || 'Medium',
                        tags: raw.tags || [],
                        uploadDate: new Date().toISOString().split('T')[0]
                    });
                });

                if (errors.length > 0) setParseError(errors.join('\n'));
                if (validatedProfiles.length > 0) setParsedProfiles(validatedProfiles);
                if (validatedContent.length > 0) setParsedContent(validatedContent);
                return;
            }

            // --- Standard Profile-Only Format ---
            let profileArray: any[];
            if (uploadMode === 'single') {
                if (Array.isArray(data)) {
                    if (data.length === 1) {
                        profileArray = data;
                    } else {
                        setParseError(`Single upload mode expects 1 profile, but found ${data.length}. Use "Bulk Upload" for multiple profiles.`);
                        return;
                    }
                } else {
                    profileArray = [data];
                }
            } else {
                profileArray = Array.isArray(data) ? data : [data];
            }

            const validated: ExamProfile[] = [];
            const errors: string[] = [];

            profileArray.forEach((raw, idx) => {
                if (!raw.profileName) {
                    errors.push(`Profile #${idx + 1}: Missing required field "profileName"`);
                    return;
                }
                const cleaned: any = {};
                Object.keys(raw).forEach(key => {
                    if (!key.startsWith('_')) cleaned[key] = raw[key];
                });
                validated.push({
                    ...DEFAULT_EXAM_PROFILE,
                    ...cleaned,
                    id: cleaned.id || `profile-${Date.now()}-${idx}`
                });
            });

            if (errors.length > 0) setParseError(errors.join('\n'));
            if (validated.length > 0) setParsedProfiles(validated);
        } catch (err: any) {
            setParseError(`Invalid JSON: ${err.message}`);
        }
    };

    const confirmImport = () => {
        if (parsedProfiles.length === 0 && parsedContent.length === 0) return;

        // Check for duplicate profile names
        const existingNames = profiles.map(p => p.profileName.toLowerCase());
        const duplicates = parsedProfiles.filter(p => existingNames.includes(p.profileName.toLowerCase()));

        if (duplicates.length > 0) {
            const names = duplicates.map(d => d.profileName).join(', ');
            if (!confirm(`The following profiles already exist: "${names}". They will be added as new entries. Continue?`)) {
                return;
            }
        }

        const currentStore = getAdminStore();
        const updatedProfiles = [...(currentStore.examProfiles || []), ...parsedProfiles];
        const updatedContent = [...(currentStore.contentLibrary || []), ...parsedContent];

        saveAdminStore({
            ...currentStore,
            examProfiles: updatedProfiles,
            contentLibrary: updatedContent
        });
        refreshStore();
        setShowUploadModal(false);

        const parts: string[] = [];
        if (parsedProfiles.length > 0) parts.push(`${parsedProfiles.length} profile(s)`);
        if (parsedContent.length > 0) parts.push(`${parsedContent.length} content item(s)`);
        alert(`✅ Successfully imported ${parts.join(' and ')}!\n\nExams will now appear on the website under Practice Exams.`);
    };

    const handleSave = (profileData: ExamProfile) => {
        if (!profileData.profileName) return alert("Profile Name is required");

        const profileId = editingProfile?.id || `profile-${Date.now()}`;
        const newProfile = {
            ...profileData,
            id: profileId
        };

        let updatedProfiles;
        if (editingProfile) {
            updatedProfiles = profiles.map(p => p.id === editingProfile.id ? newProfile : p);
        } else {
            updatedProfiles = [...profiles, newProfile];
        }

        saveAdminStore({ ...store, examProfiles: updatedProfiles });
        refreshStore();
        setShowForm(false);
        setEditingProfile(undefined);
    };

    if (showForm) {
        return (
            <ExamProfileForm
                initialProfile={editingProfile}
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                        Exam Rule <span className="text-brand-purple italic">Engine</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage specialized calculation rules and test profiles for various recruitment exams.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {/* Unified Upload (Profiles + Content) */}
                    <button
                        onClick={() => openUploadModal('unified')}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-brand-purple/30 hover:border-brand-purple text-gray-200 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer group text-sm"
                    >
                        <Package className="text-yellow-400 group-hover:scale-110 transition-transform" size={18} />
                        Unified Upload
                    </button>
                    {/* Single Profile Upload */}
                    <button
                        onClick={() => openUploadModal('single')}
                        className="flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer group text-sm"
                    >
                        <Upload className="text-green-400 group-hover:scale-110 transition-transform" size={18} />
                        Import Single
                    </button>
                    {/* Bulk Upload */}
                    <button
                        onClick={() => openUploadModal('bulk')}
                        className="flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer group text-sm"
                    >
                        <FileJson className="text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
                        Bulk Upload JSON
                    </button>
                    {/* Create New */}
                    <button
                        onClick={() => {
                            setEditingProfile(undefined);
                            setShowForm(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 group"
                    >
                        <Plus className="group-hover:rotate-90 transition-transform" size={20} />
                        Create New Profile
                    </button>
                </div>
            </div>

            {/* ===== UPLOAD MODAL ===== */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setShowUploadModal(false)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                {uploadMode === 'unified' ? (
                                    <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                        <Package className="text-yellow-400" size={22} />
                                    </div>
                                ) : uploadMode === 'single' ? (
                                    <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <Upload className="text-green-400" size={22} />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                        <FileJson className="text-cyan-400" size={22} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {uploadMode === 'unified' ? 'Unified Exam Upload' : uploadMode === 'single' ? 'Import Single Profile' : 'Bulk Import Profiles'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {uploadMode === 'unified'
                                            ? 'Upload profiles + content in one JSON file — exams auto-appear on website'
                                            : uploadMode === 'single'
                                                ? 'Upload a JSON file containing one exam profile'
                                                : 'Upload a JSON file containing an array of exam profiles'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* File Picker */}
                            {!uploadFile ? (
                                <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-brand-purple/50 hover:bg-gray-800/30 transition-all">
                                    <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" id="profile-upload-input" />
                                    <label htmlFor="profile-upload-input" className="cursor-pointer flex flex-col items-center gap-4">
                                        <div className="p-4 bg-gray-800/50 rounded-full">
                                            <UploadCloud className="text-gray-500" size={40} />
                                        </div>
                                        <div>
                                            <p className="text-gray-300 font-bold text-lg">Click to select a .json file</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {uploadMode === 'single'
                                                    ? 'Single profile object or array with 1 item'
                                                    : 'JSON array of profile objects (e.g. [{ ... }, { ... }])'
                                                }
                                            </p>
                                        </div>
                                    </label>

                                    {/* Download Template Links */}
                                    <div className="mt-6 pt-4 border-t border-gray-800 flex flex-wrap justify-center gap-3">
                                        <a
                                            href="/example_exam_profile.json"
                                            download
                                            className="flex items-center gap-2 text-xs bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple px-4 py-2 rounded-full border border-brand-purple/20 transition-all font-bold"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <Download size={14} /> Single Profile Template
                                        </a>
                                        <a
                                            href="/example_bulk_profiles.json"
                                            download
                                            className="flex items-center gap-2 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full border border-cyan-500/20 transition-all font-bold"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <Download size={14} /> Bulk Upload Template (3 Profiles)
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* File info bar */}
                                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-brand-purple" size={18} />
                                            <span className="font-mono text-sm text-gray-300">{uploadFile.name}</span>
                                            <span className="text-[10px] text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
                                                {(uploadFile.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => { setUploadFile(null); setParsedProfiles([]); setParseError(null); setPreviewIndex(null); }}
                                            className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                                        >
                                            <X size={14} /> Remove
                                        </button>
                                    </div>

                                    {/* Parse Error */}
                                    {parseError && (
                                        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 text-sm whitespace-pre-line flex items-start gap-3">
                                            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                                            <div>{parseError}</div>
                                        </div>
                                    )}

                                    {/* Parsed Profiles Preview */}
                                    {parsedProfiles.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-bold text-green-400">
                                                <Check size={16} />
                                                {parsedProfiles.length} profile(s) parsed successfully
                                            </div>

                                            <div className="max-h-72 overflow-y-auto border border-gray-700 rounded-xl">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-800/80 text-gray-400 text-[10px] uppercase font-bold tracking-wider sticky top-0">
                                                        <tr>
                                                            <th className="px-4 py-3">#</th>
                                                            <th className="px-4 py-3">Profile Name</th>
                                                            <th className="px-4 py-3">Calc Param</th>
                                                            <th className="px-4 py-3">Duration</th>
                                                            <th className="px-4 py-3">Language</th>
                                                            <th className="px-4 py-3">Type</th>
                                                            <th className="px-4 py-3 text-right">Preview</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800">
                                                        {parsedProfiles.map((p, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-800/30 text-gray-300">
                                                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{idx + 1}</td>
                                                                <td className="px-4 py-3 font-bold text-white">{p.profileName}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full border border-brand-purple/20 font-bold">
                                                                        {p.calculationParam}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400">{p.durationMin} min</td>
                                                                <td className="px-4 py-3 text-gray-400 capitalize">
                                                                    {p.languageMode === 'fixed' ? p.fixedLanguage : 'Dynamic'}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400 capitalize">{p.examType}</td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <button
                                                                        onClick={() => setPreviewIndex(previewIndex === idx ? null : idx)}
                                                                        className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                                    >
                                                                        <Eye size={14} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* JSON Preview Panel */}
                                            {previewIndex !== null && parsedProfiles[previewIndex] && (
                                                <div className="bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
                                                    <div className="px-4 py-2 bg-gray-800/50 flex justify-between items-center border-b border-gray-700">
                                                        <span className="text-xs font-bold text-gray-300">
                                                            Preview: {parsedProfiles[previewIndex].profileName}
                                                        </span>
                                                        <button onClick={() => setPreviewIndex(null)} className="text-gray-500 hover:text-white">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <pre className="p-4 text-[11px] text-gray-400 font-mono overflow-x-auto max-h-60 overflow-y-auto">
                                                        {JSON.stringify(parsedProfiles[previewIndex], null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* === Content Items Preview (Unified Mode) === */}
                                    {parsedContent.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <h4 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                                                <FileText size={14} />
                                                Content Items ({parsedContent.length})
                                            </h4>
                                            <div className="border border-gray-700 rounded-xl overflow-hidden">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="bg-gray-800/50 text-gray-400 uppercase tracking-wider text-left">
                                                            <th className="px-4 py-2">#</th>
                                                            <th className="px-4 py-2">Title</th>
                                                            <th className="px-4 py-2">Language</th>
                                                            <th className="px-4 py-2">Font</th>
                                                            <th className="px-4 py-2">Words</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800">
                                                        {parsedContent.map((c, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-800/30 text-gray-300">
                                                                <td className="px-4 py-2 text-gray-500 font-mono">{idx + 1}</td>
                                                                <td className="px-4 py-2 font-bold text-white truncate max-w-[200px]">{c.title}</td>
                                                                <td className="px-4 py-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.language === 'Hindi'
                                                                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                        }`}>{c.language}</span>
                                                                </td>
                                                                <td className="px-4 py-2 text-gray-400">{c.font}</td>
                                                                <td className="px-4 py-2 text-gray-400">{c.text.split(' ').length}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-800 flex items-center justify-between shrink-0 bg-gray-900/50">
                            <div className="flex gap-3">
                                <a
                                    href="/example_unified_exam_upload.json"
                                    download
                                    className="text-xs text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors font-bold"
                                >
                                    <Download size={12} /> Unified Template
                                </a>
                                <a
                                    href="/example_exam_profile.json"
                                    download
                                    className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                                >
                                    <Download size={12} /> Single Template
                                </a>
                                <a
                                    href="/example_bulk_profiles.json"
                                    download
                                    className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                                >
                                    <Download size={12} /> Bulk Template
                                </a>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-bold text-sm transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmImport}
                                    disabled={parsedProfiles.length === 0 && parsedContent.length === 0}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${(parsedProfiles.length > 0 || parsedContent.length > 0)
                                        ? 'bg-brand-purple hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Check size={16} />
                                    Import{parsedProfiles.length > 0 ? ` ${parsedProfiles.length} Profile${parsedProfiles.length !== 1 ? 's' : ''}` : ''}{parsedContent.length > 0 ? ` + ${parsedContent.length} Content` : ''}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PROFILE GRID ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.length > 0 ? profiles.map(profile => (
                    <div
                        key={profile.id}
                        className="group bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 hover:border-brand-purple/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                            <button
                                onClick={() => handleEdit(profile)}
                                className="p-2 bg-gray-800/80 hover:bg-brand-purple text-gray-400 hover:text-white rounded-lg transition-all"
                                title="Edit Profile"
                            >
                                <Settings size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(profile.id!)}
                                className="p-2 bg-gray-800/80 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg transition-all"
                                title="Delete Profile"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-purple/10 rounded-xl border border-brand-purple/20">
                                <Shield className="text-brand-purple" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-1">{profile.profileName}</h3>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{profile.examType}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-xs mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                            {profile.description || 'No description provided.'}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-[10px] items-center">
                            <div className="flex flex-col gap-1 p-2 bg-gray-950/50 rounded-lg border border-gray-800/50">
                                <span className="text-gray-600 font-bold uppercase tracking-tight flex items-center gap-1"><Languages size={10} /> Mode</span>
                                <span className="text-gray-300 font-bold uppercase">{profile.languageMode === 'fixed' ? profile.fixedLanguage : 'Dynamic'}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-950/50 rounded-lg border border-gray-800/50">
                                <span className="text-gray-600 font-bold uppercase tracking-tight flex items-center gap-1"><Clock size={10} /> Duration</span>
                                <span className="text-gray-300 font-bold">{profile.durationMin} MIN</span>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-950/50 rounded-lg border border-gray-800/50">
                                <span className="text-gray-600 font-bold uppercase tracking-tight flex items-center gap-1"><AlertTriangle size={10} /> Limit</span>
                                <span className="text-gray-300 font-bold">{profile.ignoredErrorLimit}%</span>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-950/50 rounded-lg border border-gray-800/50">
                                <span className="text-gray-600 font-bold uppercase tracking-tight flex items-center gap-1"><Calculator size={10} /> Param</span>
                                <span className="text-brand-purple font-black">{(profile.calculationParam || '').replace('gross_', '').replace('net_', '').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                            <Shield className="text-gray-600" size={40} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-400">No rule profiles found</h4>
                        <p className="text-gray-600 text-sm mt-2 max-w-xs">Create your first exam profile to define custom scoring and calculation logic.</p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => openUploadModal('single')}
                                className="text-green-400 font-bold hover:underline flex items-center gap-1 text-sm"
                            >
                                <Upload size={14} /> Import JSON
                            </button>
                            <span className="text-gray-700">or</span>
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-brand-purple font-bold hover:underline text-sm"
                            >
                                + Create Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamProfileManager;
