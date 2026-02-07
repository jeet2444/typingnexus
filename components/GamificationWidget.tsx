import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Star, Target, Crown } from 'lucide-react';
import { getAdminStore, UserProgress, Achievement } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

const GamificationWidget: React.FC = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            const store = getAdminStore();
            // For demo purposes, if no user is logged in, show the first mock user's progress
            // In production, this should be null or a "Sign in to see stats" view
            const userId = user?.id || 1;
            const userProg = store.userProgress.find(p => p.userId === userId) || store.userProgress[0];

            setProgress(userProg);
            setAchievements(store.achievements);
            setLoading(false);
        };

        loadData();

        // Listen for store updates
        window.addEventListener('adminStoreUpdate', loadData);
        return () => window.removeEventListener('adminStoreUpdate', loadData);
    }, [user]);

    if (loading || !progress) return null;

    // Calculate level progress (mock calculation)
    const xpForNextLevel = progress.level * 500;
    const levelProgress = (progress.totalXP % 500) / 500 * 100;

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy size={100} className="text-yellow-500" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Crown size={20} className="text-yellow-500" />
                            Student Dashboard
                        </h3>
                        <p className="text-sm text-gray-500">Your learning journey</p>
                    </div>
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame size={14} fill="currentColor" /> {progress.currentStreak} Day Streak
                    </div>
                </div>

                {/* Level & XP */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-bold text-gray-700">Level {progress.level}</span>
                        <span className="text-gray-500">{progress.totalXP} / {progress.level * 500 + progress.totalXP} XP</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-1 flex items-center gap-1">
                            <Target size={12} /> Tests
                        </div>
                        <div className="text-xl font-bold text-gray-900">{progress.testsCompleted}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                        <div className="text-xs text-green-600 font-bold uppercase mb-1 flex items-center gap-1">
                            <Star size={12} /> Lessons
                        </div>
                        <div className="text-xl font-bold text-gray-900">{progress.lessonsCompleted}</div>
                    </div>
                </div>

                {/* Recent Achievements */}
                {progress.achievementIds.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Recent Badges</h4>
                        <div className="flex gap-2">
                            {progress.achievementIds.slice(0, 3).map(id => {
                                const achievement = achievements.find(a => a.id === id);
                                if (!achievement) return null;
                                return (
                                    <div key={id} className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-lg shadow-sm" title={achievement.name}>
                                        {achievement.icon}
                                    </div>
                                );
                            })}
                            {progress.achievementIds.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                    +{progress.achievementIds.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamificationWidget;
