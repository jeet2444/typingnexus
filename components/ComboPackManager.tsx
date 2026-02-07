import React, { useState } from 'react';
import { getAdminStore, saveAdminStore, ComboPack, CPTTest, Passage } from '../utils/adminStore';
import { Trash2, Edit, Plus, Save, X, CheckSquare, Square, Package } from 'lucide-react';

const ComboPackManager: React.FC = () => {
    const store = getAdminStore();
    const [packs, setPacks] = useState<ComboPack[]>(store.comboPacks || []);
    const [editingPack, setEditingPack] = useState<ComboPack | null>(null);
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');

    // Available Content
    const allPassages = store.passages || [];
    const allCptTests = store.cptTests || [];

    const handleSave = () => {
        if (!editingPack) return;

        const updatedPacks = editingPack.id
            ? packs.map(p => p.id === editingPack.id ? editingPack : p)
            : [...packs, { ...editingPack, id: Date.now().toString() }]; // Simple ID gen

        store.comboPacks = updatedPacks;
        saveAdminStore(store);
        setPacks(updatedPacks);
        setEditingPack(null);
        setView('list');
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Are you sure you want to delete this pack?')) return;
        const updatedPacks = packs.filter(p => p.id !== id);
        store.comboPacks = updatedPacks;
        saveAdminStore(store);
        setPacks(updatedPacks);
    };

    const handleCreate = () => {
        setEditingPack({
            id: '', // Placeholder
            title: 'New Combo Pack',
            price: 99,
            description: '',
            features: [],
            content: {
                typingPassageIds: [],
                cptTestIds: []
            },
            isActive: false,
            coverImage: ''
        });
        setView('edit');
        setActiveTab('details');
    };

    const toggleSelection = (type: 'typing' | 'cpt', id: number) => {
        if (!editingPack) return;
        const currentIds = type === 'typing'
            ? editingPack.content.typingPassageIds
            : editingPack.content.cptTestIds;

        const newIds = currentIds.includes(id)
            ? currentIds.filter(x => x !== id)
            : [...currentIds, id];

        setEditingPack({
            ...editingPack,
            content: {
                ...editingPack.content,
                [type === 'typing' ? 'typingPassageIds' : 'cptTestIds']: newIds
            }
        });
    };

    const addFeature = () => {
        if (!editingPack) return;
        setEditingPack({
            ...editingPack,
            features: [...editingPack.features, 'New Feature']
        });
    };

    const updateFeature = (index: number, val: string) => {
        if (!editingPack) return;
        const newFeatures = [...editingPack.features];
        newFeatures[index] = val;
        setEditingPack({ ...editingPack, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        if (!editingPack) return;
        setEditingPack({
            ...editingPack,
            features: editingPack.features.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="text-purple-600" /> Combo Pack Manager
                </h2>
                {view === 'list' && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-bold"
                    >
                        <Plus size={18} /> Create New Pack
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packs.map(pack => (
                        <div key={pack.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow bg-gray-50 relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{pack.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${pack.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {pack.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="text-purple-600 font-bold text-xl mb-4">₹{pack.price}</div>
                            <div className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">{pack.description}</div>

                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
                                <span>{pack.content.typingPassageIds.length} Passages</span>
                                <span>{pack.content.cptTestIds.length} CPT Tests</span>
                            </div>

                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Hidden actions on hover could go here, but for now explicitly visible edit buttons below */}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => { setEditingPack(pack); setView('edit'); }}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 text-sm font-bold flex justify-center items-center gap-1"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(pack.id)}
                                    className="px-3 py-1.5 rounded text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {packs.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
                            No combo packs found. Create your first bundle!
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* TABS */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-4 py-2 font-bold text-sm ${activeTab === 'details' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Pack Details
                        </button>
                        <button
                            className={`px-4 py-2 font-bold text-sm ${activeTab === 'content' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('content')}
                        >
                            Select Content ({editingPack?.content.typingPassageIds.length + editingPack?.content.cptTestIds.length})
                        </button>
                    </div>

                    {activeTab === 'details' && editingPack && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Pack Title</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        value={editingPack.title}
                                        onChange={e => setEditingPack({ ...editingPack, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded"
                                        value={editingPack.price}
                                        onChange={e => setEditingPack({ ...editingPack, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Description</label>
                                    <textarea
                                        className="w-full border p-2 rounded h-24"
                                        value={editingPack.description}
                                        onChange={e => setEditingPack({ ...editingPack, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={editingPack.isActive}
                                        onChange={e => setEditingPack({ ...editingPack, isActive: e.target.checked })}
                                        className="h-4 w-4 text-purple-600"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active (Visible to Users)</label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-gray-700">Features List</label>
                                        <button onClick={addFeature} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">+ Add Feature</button>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {editingPack.features.map((feat, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    className="flex-1 border p-1 rounded text-sm"
                                                    value={feat}
                                                    onChange={e => updateFeature(idx, e.target.value)}
                                                />
                                                <button onClick={() => removeFeature(idx)} className="text-red-500"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && editingPack && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in h-[500px]">
                            {/* Typing Passages Selection */}
                            <div className="border rounded-lg flex flex-col overflow-hidden">
                                <div className="bg-blue-50 p-3 border-b font-bold text-blue-800 flex justify-between">
                                    <span>Typing Passages</span>
                                    <span className="bg-blue-200 px-2 rounded-full text-xs flex items-center">{editingPack.content.typingPassageIds.length} Selected</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
                                    {allPassages.map(p => {
                                        const isSelected = editingPack.content.typingPassageIds.includes(p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => toggleSelection('typing', p.id)}
                                                className={`p-2 rounded border cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}
                                            >
                                                {isSelected ? <CheckSquare className="text-blue-600" size={18} /> : <Square className="text-gray-400" size={18} />}
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-gray-800">{p.title}</div>
                                                    <div className="text-xs text-gray-500">{p.difficulty} • {p.language}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CPT Tests Selection */}
                            <div className="border rounded-lg flex flex-col overflow-hidden">
                                <div className="bg-green-50 p-3 border-b font-bold text-green-800 flex justify-between">
                                    <span>CPT Tests (Word/Excel)</span>
                                    <span className="bg-green-200 px-2 rounded-full text-xs flex items-center">{editingPack.content.cptTestIds.length} Selected</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
                                    {allCptTests.map(t => {
                                        const isSelected = editingPack.content.cptTestIds.includes(t.id);
                                        return (
                                            <div
                                                key={t.id}
                                                onClick={() => toggleSelection('cpt', t.id)}
                                                className={`p-2 rounded border cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${isSelected ? 'bg-green-50 border-green-300' : 'border-gray-200'}`}
                                            >
                                                {isSelected ? <CheckSquare className="text-green-600" size={18} /> : <Square className="text-gray-400" size={18} />}
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-gray-800">{t.title}</div>
                                                    <div className="text-xs text-gray-500">{t.type} • {t.language || 'Bilingual'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <button
                            onClick={() => setView('list')}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 font-bold shadow-lg"
                        >
                            <Save size={18} /> Save Combo Pack
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComboPackManager;
