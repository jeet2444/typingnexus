import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStore } from '../utils/adminStore';
import Navbar from './Navbar';
import Footer from './Footer';

const GlobalAdLayout: React.FC = () => {
    const [ads, setAds] = useState<any[]>([]);
    const { hasPremiumAccess } = useAuth();

    useEffect(() => {
        const loadStoreData = () => {
            const store = getAdminStore();
            setAds(store.ads || []);
        };

        loadStoreData();

        // sync data from hostinger on mount to ensure freshness
        import('../utils/adminStore').then(({ syncSettingsFromHost }) => {
            syncSettingsFromHost().then((hasUpdates) => {
                if (hasUpdates) loadStoreData();
            });
        });

        window.addEventListener('adminStoreUpdate', loadStoreData);
        return () => window.removeEventListener('adminStoreUpdate', loadStoreData);
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-200 bg-gray-950 relative overflow-hidden">
            {/* Global Animated Background */}
            <div className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-purple blur-[150px] rounded-full animate-blob mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-900 blur-[150px] rounded-full animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900 blur-[150px] rounded-full animate-blob animation-delay-4000 mix-blend-screen"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col min-h-screen">
                <Navbar />

                {/* AD SYSTEM: Top Banner */}
                {!hasPremiumAccess && ads.some(ad => ad.position === 'TopBanner') && (
                    <div className="max-w-7xl mx-auto px-4 pt-4">
                        {ads.filter(ad => ad.position === 'TopBanner' && ad.isActive).map(ad => (
                            <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block w-full h-24 bg-gray-800 rounded-xl overflow-hidden relative group mb-4 border border-gray-700 shadow-lg">
                                <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className="absolute top-0 right-0 bg-black/60 text-[10px] px-1 text-gray-400 font-sans backdrop-blur-sm">Ad</span>
                            </a>
                        ))}
                    </div>
                )}

                {/* MAIN LAYOUT: With Sidebars */}
                <div className="max-w-[1920px] mx-auto flex items-start gap-4 px-2 md:px-6 relative flex-grow w-full pt-6">

                    {/* LEFT AD SIDEBAR */}
                    {!hasPremiumAccess && ads.some(ad => ad.position === 'LeftSidebar') && (
                        <div className="hidden xl:block w-[180px] sticky top-24 space-y-4">
                            {ads.filter(ad => ad.position === 'LeftSidebar' && ad.isActive).map(ad => (
                                <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block w-full aspect-[1/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:shadow-cyan-900/20 hover:shadow-lg transition-all relative group">
                                    <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/90 text-[9px] text-center text-gray-500 py-0.5">Advertisement</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* CENTER CONTENT */}
                    <main className="flex-1 w-full min-w-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-2xl p-0.5 overflow-hidden">
                        <Outlet />
                    </main>

                    {/* RIGHT AD SIDEBAR */}
                    {!hasPremiumAccess && ads.some(ad => (ad.position === 'RightSidebar' || ad.position === 'Sidebar') && ad.isActive) && (
                        <div className="hidden xl:block w-[180px] sticky top-24 space-y-4">
                            {ads.filter(ad => (ad.position === 'RightSidebar' || ad.position === 'Sidebar') && ad.isActive).map(ad => (
                                <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block w-full aspect-[1/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:shadow-cyan-900/20 hover:shadow-lg transition-all relative group">
                                    <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/90 text-[9px] text-center text-gray-500 py-0.5">Advertisement</span>
                                </a>
                            ))}
                        </div>
                    )}

                </div>

                <Footer />
            </div>
        </div>
    );
};

export default GlobalAdLayout;
