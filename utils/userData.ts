export interface CPTResult {
  id: string;
  type: 'Excel' | 'Word';
  date: string;
  score: number;
  maxScore: number;
  accuracy: number;
  timeTaken: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  joined: string;
  bio: string;
  location: string;
  avatar: string;
  cptResults: CPTResult[];
}

const STORAGE_KEY_USER = 'ar_typing_user_profile';

export const DEFAULT_USER: UserProfileData = {
  name: "Rahul Kumar",
  email: "rahul.k@example.com",
  joined: "September 2025",
  bio: "Aspiring government official. Dedicated to mastering high-speed typing for SSC and RRB exams.",
  location: "Patna, India",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  cptResults: []
};

export const getUserProfile = (): UserProfileData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load user profile", e);
  }
  return DEFAULT_USER;
};

export const saveUserProfile = (data: UserProfileData) => {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data));
    // Dispatch a custom event so other components (like Navbar) can update immediately
    window.dispatchEvent(new Event('userProfileUpdate'));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
};