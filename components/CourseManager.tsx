import React, { useState } from 'react';
import {
    Package, Plus, Trash2, Edit, Save, CheckCircle, Shield, Globe,
    FileSpreadsheet, DollarSign, Clock, X, Layers
} from 'lucide-react';
import {
    getAdminStore, saveAdminStore, Course, ExamProfile
} from '../utils/adminStore';

const CourseManager: React.FC = () => {
    const [store, setStore] = useState(getAdminStore());
    const [courses, setCourses] = useState<Course[]>(store.courses || []);
    const [profiles] = useState<ExamProfile[]>(store.examProfiles || []);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Default Form State
    const defaultCourse: Course = {
        id: '',
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        modules: [],
        examProfileIds: [],
        isActive: true
    };

    const [formData, setFormData] = useState<Course>(defaultCourse);

    const refreshStore = () => {
        const s = getAdminStore();
        setStore(s);
        setCourses(s.courses || []);
    };

    const handleEdit = (course: Course) => {
        setFormData(course);
        setEditingId(course.id);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this course?')) {
            const updated = courses.filter(c => c.id !== id);
            saveAdminStore({ ...store, courses: updated });
            refreshStore();
        }
    };

    const handleSave = () => {
        if (!formData.name) return alert("Course Name is required");
        if (formData.modules.length === 0) return alert("Select at least one module");
        if (formData.examProfileIds.length === 0) return alert("Select at least one Exam Profile");

        const newCourse = {
            ...formData,
            id: editingId || `course-${Date.now()}`
        };

        let updatedCourses;
        if (editingId) {
            updatedCourses = courses.map(c => c.id === editingId ? newCourse : c);
        } else {
            updatedCourses = [...courses, newCourse];
        }

        saveAdminStore({ ...store, courses: updatedCourses });
        refreshStore();
        setShowModal(false);
        setFormData(defaultCourse);
        setEditingId(null);
    };

    const toggleModule = (mod: 'Hindi' | 'English' | 'CPT') => {
        const current = formData.modules;
        if (current.includes(mod)) {
            setFormData({ ...formData, modules: current.filter(m => m !== mod) });
        } else {
            setFormData({ ...formData, modules: [...current, mod] });
        }
    };

    const toggleProfile = (pid: string) => {
        const current = formData.examProfileIds;
        if (current.includes(pid)) {
            setFormData({ ...formData, examProfileIds: current.filter(id => id !== pid) });
        } else {
            setFormData({ ...formData, examProfileIds: [...current, pid] });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-display text-white mb-1">Course & Subscription Manager</h2>
                    <p className="text-gray-400 text-sm">Bundle Content (Modules) + Rules (Profiles) into Courses.</p>
                </div>
                <button
                    onClick={() => { setFormData(defaultCourse); setEditingId(null); setShowModal(true); }}
                    className="bg-brand-purple hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
                >
                    <Plus size={18} /> Create New Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length > 0 ? courses.map(course => (
                    <div key={course.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-brand-purple/50 transition-all group backdrop-blur-sm relative overflow-hidden">
                        {!course.isActive && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"><span className="px-3 py-1 bg-red-900/80 text-red-200 rounded font-bold text-xs uppercase border border-red-700">Inactive</span></div>}

                        <div className="flex justify-between items-start mb-4 relative z-20">
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    {course.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description || "No description"}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(course)} className="p-1.5 text-gray-400 hover:text-brand-purple hover:bg-purple-900/20 rounded transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(course.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs relative z-20">
                            <div className="flex gap-2 flex-wrap">
                                {course.modules.map(m => (
                                    <span key={m} className={`px-2 py-0.5 rounded border ${m === 'Hindi' ? 'bg-orange-900/20 border-orange-800 text-orange-400' :
                                            m === 'English' ? 'bg-blue-900/20 border-blue-800 text-blue-400' :
                                                'bg-green-900/20 border-green-800 text-green-400'
                                        }`}>
                                        {m}
                                    </span>
                                ))}
                            </div>

                            <div className="p-3 bg-gray-800/50 rounded border border-gray-700/50">
                                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Active Rules (Profiles)</span>
                                <div className="flex flex-col gap-1">
                                    {course.examProfileIds.map(pid => {
                                        const p = profiles.find(pf => pf.id === pid);
                                        return (
                                            <div key={pid} className="flex items-center gap-2 text-gray-300">
                                                <Shield size={12} className="text-brand-purple" />
                                                {p ? p.name : 'Unknown Profile'}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <span className="text-xl font-bold text-white font-mono">₹{course.price}</span>
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={12} /> {course.durationDays} Days</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20 text-gray-500 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                        No courses created yet. Click "Create New Course" to start.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f0f13] border border-gray-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Package className="text-brand-purple" size={20} />
                                {editingId ? 'Edit Course' : 'Create New Course'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">

                            {/* 1. Basic Info */}
                            <section className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-sm">Course Name</label>
                                        <input className="input-field" placeholder="e.g. SSC + AIIMS Combo" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="label-sm">Price (INR)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                            <input type="number" className="input-field pl-8" placeholder="999" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="label-sm">Description</label>
                                    <textarea className="input-field min-h-[80px]" placeholder="Course details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-sm">Duration (Days)</label>
                                        <input type="number" className="input-field" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })} />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 text-sm text-gray-300 font-bold cursor-pointer">
                                            <input type="checkbox" className="accent-brand-purple w-4 h-4" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                            Course Active
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Module Selection */}
                            <section className="space-y-3">
                                <h4 className="text-brand-purple font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2">2. Select Modules</h4>
                                <div className="flex gap-4">
                                    {['Hindi', 'English', 'CPT'].map((mod) => (
                                        <button
                                            key={mod}
                                            onClick={() => toggleModule(mod as any)}
                                            className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.modules.includes(mod as any)
                                                    ? 'bg-brand-purple/20 border-brand-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                                    : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                                                }`}
                                        >
                                            {mod === 'Hindi' && <span className="font-mangal">अ</span>}
                                            {mod === 'English' && <Globe size={16} />}
                                            {mod === 'CPT' && <FileSpreadsheet size={16} />}
                                            <span className="font-bold text-sm">{mod}</span>
                                            {formData.modules.includes(mod as any) && <CheckCircle size={14} className="text-brand-purple" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 3. Exam Profile Mapping */}
                            <section className="space-y-3">
                                <h4 className="text-brand-purple font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2">3. Map Exam Rules (Profiles)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {profiles.map(profile => (
                                        <div
                                            key={profile.id}
                                            onClick={() => toggleProfile(profile.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${formData.examProfileIds.includes(profile.id)
                                                    ? 'bg-blue-900/20 border-blue-500/50 text-blue-100'
                                                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
                                                }`}
                                        >
                                            <div>
                                                <div className="font-bold text-sm">{profile.name}</div>
                                                <div className="text-[10px] opacity-70">{profile.calculationMode} | {profile.penalty.type} Penalty</div>
                                            </div>
                                            {formData.examProfileIds.includes(profile.id) && <CheckCircle size={16} className="text-blue-500" />}
                                        </div>
                                    ))}
                                    {profiles.length === 0 && <div className="text-gray-500 text-sm italic col-span-full">No Profiles Found. Create profiles in "Master Rules" first.</div>}
                                </div>
                            </section>

                        </div>

                        <div className="p-6 border-t border-gray-800 bg-gray-900/30 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save size={18} /> Save Course</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .input-field {
          width: 100%;
          background-color: #111827;
          border-width: 1px;
          border-color: #374151;
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          color: #e5e7eb;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 1px #a855f7;
        }
        .btn-primary {
          background-color: #a855f7;
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 700;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #9333ea;
        }
        .btn-secondary {
          background-color: transparent;
          color: #9ca3af;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 700;
          transition: color 0.2s;
        }
        .btn-secondary:hover {
          color: white;
          background-color: #1f2937;
        }
        .label-sm {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 0.375rem;
        }
      `}</style>
        </div>
    );
};

export default CourseManager;
