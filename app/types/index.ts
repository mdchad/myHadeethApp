// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// Location interface
export interface UserLocation {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

// User place interface
export interface UserPlace {
  city?: string;
  country?: string;
  district?: string;
  isoCountryCode?: string;
  name?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  streetNumber?: string;
  subregion?: string;
  timezone?: string;
}

// Prayer times interface
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate?: string;
}

// Audio state interface
export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  currentHadithId?: string;
}

// App settings interface
export interface AppSettings {
  language: 'en' | 'ms';
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

// Search interfaces
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  mode?: 'text' | 'semantic';
  books?: string; // Comma-separated book names
}

export interface SearchResult {
  documents: any[]; // Replace 'any' with proper Hadith type when available
  totalCount: [{ count: number }];
  currentPage: number;
}

export interface SearchApiResponse {
  success: boolean;
  data: SearchResult;
}

// Storage keys type
export type StorageKey =
  | 'user-language'
  | 'saved-hadiths'
  | 'user-notes'
  | 'app-settings'
  | 'last-read-position';