
import React from 'react';

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            {label}
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm hover:bg-gray-800/50"
        />
    </div>
);
