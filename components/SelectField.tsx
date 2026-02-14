
import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            {label}
        </label>
        <div className="relative group">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm cursor-pointer hover:bg-gray-800/50 group-hover:border-gray-700"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-gray-900 text-gray-200">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 group-hover:text-brand-purple transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);
