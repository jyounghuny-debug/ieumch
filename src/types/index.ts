export interface ChurchTheme {
  primaryColor: string; // e.g. #0284c7 (Sky Blue)
  primaryLightColor: string; // e.g. #e0f2fe
  bgTone: 'warm' | 'pure' | 'cool' | 'cream';
  fontFamily: 'sans' | 'serif' | 'rounded';
  churchName: string;
  churchEngName: string;
  slogan: string;
  subSlogan: string;
  scriptureVerse: string;
  seniorPastor: string;
  pastorTitle: string;
  pastorGreeting: string;
  pastorGreetingDetails: string[];
  heroImage: string;
  pastorImage: string;
  fellowshipImage: string;
  worshipImage: string;
  address: string;
  addressDetail: string;
  phone: string;
  email: string;
  visibleSections: {
    hero: boolean;
    about: boolean;
    worship: boolean;
    calendar: boolean;
    sermon: boolean;
    prayer: boolean;
    posts: boolean;
    gallery: boolean;
    newFamily: boolean;
    directions: boolean;
  };
}

export type PostCategory = 'notice' | 'bulletin' | 'sermon' | 'grace' | 'prayer' | 'mission';

export type EventCategory = 'worship' | 'ministry' | 'education' | 'fellowship' | 'special';

export interface EventRSVP {
  id: string;
  name: string;
  phone?: string;
  note?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  time?: string; // e.g. "오전 11:00" or "19:30"
  place: string;
  category: EventCategory;
  target?: string;
  postId?: string; // Linked post id
  rsvps?: EventRSVP[];
  isHighlight?: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface PostItem {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  isPinned?: boolean;
  imageUrl?: string;
  scripture?: string;
  scripturePassage?: string;
  preacher?: string;
  videoDuration?: string;
  videoUrl?: string;
  pdfDownloadName?: string;
  eventDate?: string;
  eventTime?: string;
  eventPlace?: string;
  eventCategory?: EventCategory;
  linkedEventId?: string;
  comments: CommentItem[];
}

export interface WorshipSchedule {
  id: string;
  name: string;
  time: string;
  target: string;
  place: string;
  isMain?: boolean;
}

export interface CommunityStory {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  imageUrl: string;
  author?: string;
  likes?: number;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  siteUrl: string;
  socialLinks: {
    youtube: string;
    instagram: string;
    kakaotalk: string;
    band: string;
  };
}

export type PrayerCategory = 'healing' | 'family' | 'career' | 'mission' | 'church' | 'nation' | 'general' | 'answered';

export interface PrayerEncouragement {
  id: string;
  author: string;
  isAnonymous?: boolean;
  message: string;
  createdAt: string;
}

export interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  category: PrayerCategory;
  prayerCount: number;
  createdAt: string;
  isAnswered?: boolean;
  answeredTestimony?: string;
  encouragements?: PrayerEncouragement[];
  password?: string;
}

