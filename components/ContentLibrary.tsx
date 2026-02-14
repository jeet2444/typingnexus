import React, { useState } from 'react';
import {
    Search, Plus, Trash2, Edit, Save, X, FileText, Type, Tag, Calendar,
    Check, Filter, Globe, BookOpen
} from 'lucide-react';
import {
    getAdminStore, saveAdminStore, ContentItem
} from '../utils/adminStore';

const ContentLibrary: React.FC = () => {
    const [store, setStore] = useState(getAdminStore());
    const [activeTab, setActiveTab] = useState<'Hindi' | 'English'>('English');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState<Partial<ContentItem>>({
        title: '',
        text: '',
        language: 'English',
        font: 'Sans',
        difficulty: 'Medium',
        tags: ['Common']
    });

    const refreshStore = () => {
        setStore(getAdminStore());
    };

    const filteredContent = (store.contentLibrary || []).filter(item =>
        item.language === activeTab &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.text.substring(0, 50).toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSave = () => {
        if (!formData.title || !formData.text) {
            alert("Title and Text are required!");
            return;
        }

        const newItem: ContentItem = {
            id: Date.now().toString(),
            title: formData.title,
            text: formData.text,
            language: activeTab, // Force current tab language
            font: activeTab === 'Hindi' ? (formData.font as any || 'Mangal') : 'Sans',
            difficulty: formData.difficulty as any || 'Medium',
            tags: formData.tags || ['Common'],
            uploadDate: new Date().toISOString()
        };

        const updatedLibrary = [...(store.contentLibrary || []), newItem];
        saveAdminStore({ ...store, contentLibrary: updatedLibrary });

        setShowAddModal(false);
        setFormData({
            title: '',
            text: '',
            language: activeTab,
            font: activeTab === 'Hindi' ? 'Mangal' : 'Sans',
            difficulty: 'Medium',
            tags: ['Common']
        });
        refreshStore();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this content?')) {
            const updatedLibrary = (store.contentLibrary || []).filter(item => item.id !== id);
            saveAdminStore({ ...store, contentLibrary: updatedLibrary });
            refreshStore();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-display text-white mb-1">Centralized Content Library</h2>
                    <p className="text-gray-400 text-sm">Manage typing paragraphs for {activeTab} exams.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-brand-purple hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
                >
                    <Plus size={18} /> Add New Content
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('English')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'English' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Globe size={16} /> English Library
                </button>
                <button
                    onClick={() => setActiveTab('Hindi')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'Hindi' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="font-mangal">हिंदी</span> Library
                </button>
            </div>

            {/* Content List */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-gray-800 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab} content...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-brand-purple placeholder:text-gray-600"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider px-3 bg-gray-800/50 rounded-lg border border-gray-800">
                        <BookOpen size={14} /> {filteredContent.length} Items
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Preview</th>
                                <th className="px-6 py-3">Properties</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredContent.length > 0 ? (
                                filteredContent.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-200">
                                            {item.title}
                                            <div className="flex gap-1 mt-1">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="px-1.5 py-0.5 bg-gray-800 text-[10px] text-gray-500 rounded border border-gray-700">{tag}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 max-w-xs truncate font-mono text-xs opacity-70">
                                            {item.text.substring(0, 50)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs px-2 py-0.5 bg-gray-800 w-fit rounded border border-gray-700 text-gray-400">
                                                    {item.font}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 w-fit rounded border ${item.difficulty === 'Hard' ? 'bg-red-900/20 text-red-500 border-red-900/30' :
                                                        item.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30' :
                                                            'bg-green-900/20 text-green-500 border-green-900/30'
                                                    }`}>
                                                    {item.difficulty}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(item.uploadDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No content found. Click "Add New Content" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f0f13] border border-gray-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-brand-purple" size={20} />
                                Add {activeTab} Content
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                                <input
                                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. Gandhi Jayanti Speech"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Font</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 outline-none focus:border-brand-purple"
                                        value={formData.font}
                                        onChange={e => setFormData({ ...formData, font: e.target.value as any })}
                                        disabled={activeTab === 'English'}
                                    >
                                        <option value="Sans">Sans Serif (English)</option>
                                        <option value="Mangal">Mangal (Remington/Inscript)</option>
                                        <option value="KrutiDev">KrutiDev 10</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Difficulty</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 outline-none focus:border-brand-purple"
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Paragraph Content</label>
                                <textarea
                                    className={`w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all min-h-[200px] placeholder:text-gray-600 ${activeTab === 'Hindi' && formData.font === 'Mangal' ? 'font-mangal' : 'font-mono'}`}
                                    placeholder="Paste your paragraph text here..."
                                    value={formData.text}
                                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                                ></textarea>
                                <p className="text-xs text-gray-600 mt-1 text-right">
                                    {formData.text?.length || 0} characters | {(formData.text?.split(/\s+/).length || 0)} words
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-gray-900/30 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 rounded-lg text-gray-400 font-bold hover:text-white hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 rounded-lg bg-brand-purple text-white font-bold hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center gap-2"
                            >
                                <Save size={18} /> Save Content
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentLibrary;
