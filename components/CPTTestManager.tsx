import React, { useState } from 'react';
import { getAdminStore, saveAdminStore, CPTTest, CPTQuestion } from '../utils/adminStore';
import { Trash2, Edit, Plus, Save, X, Eye } from 'lucide-react';

const CPTTestManager: React.FC = () => {
    const store = getAdminStore();
    const [tests, setTests] = useState<CPTTest[]>(store.cptTests);
    const [editingTest, setEditingTest] = useState<CPTTest | null>(null);
    const [view, setView] = useState<'list' | 'edit'>('list');

    const handleSave = () => {
        if (!editingTest) return;

        const updatedTests = editingTest.id
            ? tests.map(t => t.id === editingTest.id ? editingTest : t)
            : [...tests, { ...editingTest, id: Date.now() }]; // Simple ID gen

        store.cptTests = updatedTests;
        saveAdminStore(store);
        setTests(updatedTests);
        setEditingTest(null);
        setView('list');
    };

    const handleDelete = (id: number) => {
        if (!window.confirm('Are you sure you want to delete this test?')) return;
        const updatedTests = tests.filter(t => t.id !== id);
        store.cptTests = updatedTests;
        saveAdminStore(store);
        setTests(updatedTests);
    };

    const handleCreate = () => {
        setEditingTest({
            id: 0, // Placeholder
            title: 'New Test',
            type: 'Word',
            language: 'Bilingual',
            tasks: [],
            questions: [],
            data: [], // For Excel
            content: '', // For Word
            instructions: ''
        });
        setView('edit');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">CPT Test Manager</h2>
                {view === 'list' && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        <Plus size={18} /> Add New Test
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 font-semibold">ID</th>
                                <th className="p-3 font-semibold">Title</th>
                                <th className="p-3 font-semibold">Type</th>
                                <th className="p-3 font-semibold">Questions/Tasks</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map(test => (
                                <tr key={test.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{test.id}</td>
                                    <td className="p-3 font-medium">{test.title}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${test.type === 'Excel' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {test.type}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {test.type === 'Excel' ? test.tasks?.length || 0 : test.questions?.length || 0}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => { setEditingTest(test); setView('edit'); }}
                                            className="text-blue-600 hover:text-blue-800" title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(test.id)}
                                            className="text-red-600 hover:text-red-800" title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">No tests found. Create one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* EDIT FORM */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={editingTest?.title}
                                onChange={e => setEditingTest(prev => prev ? { ...prev, title: e.target.value } : null)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={editingTest?.type}
                                onChange={e => setEditingTest(prev => prev ? { ...prev, type: e.target.value as 'Word' | 'Excel' } : null)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="Word">Word Formatting</option>
                                <option value="Excel">Excel Spreadsheet</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instructions</label>
                        <textarea
                            value={editingTest?.instructions || ''}
                            onChange={e => setEditingTest(prev => prev ? { ...prev, instructions: e.target.value } : null)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20"
                        />
                    </div>

                    {/* Word Content Editor */}
                    {editingTest?.type === 'Word' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                            <textarea
                                value={editingTest?.content || ''}
                                onChange={e => setEditingTest(prev => prev ? { ...prev, content: e.target.value } : null)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32 font-mono text-sm"
                                placeholder="<p>Enter document content here...</p>"
                            />
                            <p className="text-xs text-gray-500 mt-1">Use HTML tags like &lt;p&gt;, &lt;b&gt;, &lt;table&gt; etc.</p>
                        </div>
                    )}

                    {/* EXCEL Data Editor (JSON for now) */}
                    {editingTest?.type === 'Excel' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Initial Data (JSON)</label>
                            <textarea
                                value={JSON.stringify(editingTest?.data || [], null, 2)}
                                onChange={e => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        setEditingTest(prev => prev ? { ...prev, data: parsed } : null);
                                    } catch (err) {
                                        // Ignore parse errors while typing
                                    }
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32 font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Array of objects: {`[{"id":1, "name":"Header", "val1":"Value"}]`}</p>
                        </div>
                    )}

                    {/* Questions/Tasks Editor */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {editingTest?.type === 'Excel' ? 'Tasks' : 'Formatting Questions'}
                            </label>
                            <button
                                onClick={() => {
                                    const newItem: CPTQuestion = { id: Date.now(), text: '', textHi: '', marks: 2 };
                                    if (editingTest?.type === 'Excel') {
                                        setEditingTest(prev => prev ? { ...prev, tasks: [...(prev.tasks || []), newItem] } : null);
                                    } else {
                                        setEditingTest(prev => prev ? { ...prev, questions: [...(prev.questions || []), newItem] } : null);
                                    }
                                }}
                                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                            >
                                + Add Question
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded bg-gray-50">
                            {(editingTest?.type === 'Excel' ? editingTest.tasks : editingTest?.questions)?.map((q, idx) => (
                                <div key={idx} className="bg-white p-2 rounded border flex gap-2 items-start">
                                    <span className="text-xs font-bold w-6 pt-2">{idx + 1}.</span>
                                    <div className="flex-grow space-y-1">
                                        <input
                                            placeholder="Question English"
                                            value={q.text}
                                            onChange={e => {
                                                const newQ = { ...q, text: e.target.value };
                                                updateQuestion(idx, newQ);
                                            }}
                                            className="w-full text-sm border rounded p-1"
                                        />
                                        <input
                                            placeholder="Question Hindi (Optional)"
                                            value={q.textHi || ''}
                                            onChange={e => {
                                                const newQ = { ...q, textHi: e.target.value };
                                                updateQuestion(idx, newQ);
                                            }}
                                            className="w-full text-sm border rounded p-1 bg-orange-50"
                                        />
                                    </div>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            value={q.marks}
                                            onChange={e => {
                                                const newQ = { ...q, marks: Number(e.target.value) };
                                                updateQuestion(idx, newQ);
                                            }}
                                            className="w-full text-sm border rounded p-1"
                                            placeholder="Marks"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeQuestion(idx)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setView('list')}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save size={18} /> Save Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    function updateQuestion(index: number, updated: CPTQuestion) {
        setEditingTest(prev => {
            if (!prev) return null;
            const isExcel = prev.type === 'Excel';
            const list = isExcel ? [...(prev.tasks || [])] : [...(prev.questions || [])];
            list[index] = updated;
            return isExcel ? { ...prev, tasks: list } : { ...prev, questions: list };
        });
    }

    function removeQuestion(index: number) {
        setEditingTest(prev => {
            if (!prev) return null;
            const isExcel = prev.type === 'Excel';
            const list = isExcel ? [...(prev.tasks || [])] : [...(prev.questions || [])];
            list.splice(index, 1);
            return isExcel ? { ...prev, tasks: list } : { ...prev, questions: list };
        });
    }
};

export default CPTTestManager;
