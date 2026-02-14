
import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
    <section className="mt-12 mb-8 p-6 bg-gray-950/50 border border-gray-800 rounded-2xl relative overflow-hidden group hover:border-brand-purple/50 transition-all duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple/20 group-hover:bg-brand-purple transition-all duration-300"></div>
        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-brand-purple font-mono opacity-50">#</span>
            {title}
        </h2>
        <div className="space-y-4">
            {children}
        </div>
    </section>
);
