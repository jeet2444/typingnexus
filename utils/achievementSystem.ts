export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: 'zap' | 'target' | 'clock' | 'award' | 'trend' | 'star'; // Mapping to Lucide icons
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  testsCompleted: number;
  highestWpm: number;
  bestAccuracy: number;
  lastTestDate: string;
}

const STORAGE_KEY_STATS = 'ar_typing_stats';
const STORAGE_KEY_BADGES = 'ar_typing_badges';

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first typing test',
    iconName: 'star',
    condition: (stats) => stats.testsCompleted >= 1
  },
  {
    id: 'speed_40',
    title: 'Getting Up to Speed',
    description: 'Reach 40 WPM in a test',
    iconName: 'zap',
    condition: (stats) => stats.highestWpm >= 40
  },
  {
    id: 'speed_60',
    title: 'Speed Demon',
    description: 'Reach 60 WPM in a test',
    iconName: 'zap',
    condition: (stats) => stats.highestWpm >= 60
  },
  {
    id: 'speed_80',
    title: 'Keyboard Warrior',
    description: 'Reach 80 WPM in a test',
    iconName: 'zap',
    condition: (stats) => stats.highestWpm >= 80
  },
  {
    id: 'accuracy_95',
    title: 'Sharp Shooter',
    description: 'Achieve 95% accuracy or higher',
    iconName: 'target',
    condition: (stats) => stats.bestAccuracy >= 95
  },
  {
    id: 'accuracy_100',
    title: 'Perfectionist',
    description: 'Achieve 100% accuracy',
    iconName: 'target',
    condition: (stats) => stats.bestAccuracy === 100
  },
  {
    id: 'dedicated_5',
    title: 'Dedicated',
    description: 'Complete 5 typing tests',
    iconName: 'trend',
    condition: (stats) => stats.testsCompleted >= 5
  },
  {
    id: 'dedicated_20',
    title: 'Marathon Runner',
    description: 'Complete 20 typing tests',
    iconName: 'award',
    condition: (stats) => stats.testsCompleted >= 20
  }
];

// Get current stats from local storage
export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY_STATS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    testsCompleted: 0,
    highestWpm: 0,
    bestAccuracy: 0,
    lastTestDate: new Date().toISOString()
  };
};

// Get list of unlocked achievement IDs
export const getUnlockedBadgeIds = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEY_BADGES);
  return stored ? JSON.parse(stored) : [];
};

// Process a test result and return newly unlocked achievements
export const processTestResult = (wpm: number, accuracy: number): Achievement[] => {
  const currentStats = getUserStats();
  const unlockedIds = getUnlockedBadgeIds();

  // Update Stats
  const newStats: UserStats = {
    testsCompleted: currentStats.testsCompleted + 1,
    highestWpm: Math.max(currentStats.highestWpm, wpm),
    bestAccuracy: Math.max(currentStats.bestAccuracy, accuracy),
    lastTestDate: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(newStats));

  // Check for new unlocks
  const newUnlocks: Achievement[] = [];
  const updatedUnlockedIds = [...unlockedIds];

  ACHIEVEMENT_DEFINITIONS.forEach(ach => {
    if (!unlockedIds.includes(ach.id)) {
      if (ach.condition(newStats)) {
        newUnlocks.push(ach);
        updatedUnlockedIds.push(ach.id);
      }
    }
  });

  if (newUnlocks.length > 0) {
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(updatedUnlockedIds));
  }

  return newUnlocks;
};

// Get all achievements with unlocked status for UI
export const getAllAchievementsStatus = () => {
  const unlockedIds = getUnlockedBadgeIds();
  return ACHIEVEMENT_DEFINITIONS.map(ach => ({
    ...ach,
    unlocked: unlockedIds.includes(ach.id)
  }));
};