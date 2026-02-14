export interface Exam {
  id: string;
  title: string;
  createdDate: string;
  stats: {
    count: number;
    unit: 'words' | 'keys';
    duration: string; // e.g., "10:00 min"
    users: number;
  };
  tags: string[];
  isNew?: boolean;
  actionText?: string;
  actionColor?: 'yellow' | 'purple' | 'default';
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  excludedFeatures?: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  type: 'Student' | 'Institute';
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  imageUrl: string;
}