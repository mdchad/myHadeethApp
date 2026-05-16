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

// Canonical hadith API types (matches new mobile API)
export interface ContentEntry {
  ar: string;
  ms: string;
  en?: string;
}

export interface Book {
  id: string;
  slug: string;
  name: string;
  title_ms: string;
  title_ar: string;
  title_en: string;
}

export interface Volume {
  id: string;
  book_id: string;
  number: number;
  slug: string;
  title_ms: string;
  title_ar: string;
  title_en: string;
  metadata_ms: string;
  metadata_ar: string;
  metadata_en: string;
  transliteration_ms: string;
  transliteration_en: string;
  hadith_first: number | null;
  hadith_last: number | null;
  extra_numbers?: number[];
  variant_anchors?: Record<number, string>;
}

export interface Chapter {
  id: string;
  name: string;
  number: number;
  title_ms: string;
  title_ar: string;
  title_en: string;
  metadata_ms: string;
  metadata_ar: string;
  metadata_en: string;
  transliteration_ms: string;
  transliteration_en: string;
}

export interface Footnote {
  id: number;
  scope: 'hadith' | 'chapter' | 'volume';
  type: string;
  base_type: string | null;
  language: 'ar' | 'ms' | 'en' | null;
  position: number;
  number: number;
  hadith_index: number | null;
  content: string;
}

export interface HadithFootnotes {
  hadith: Footnote[];
  chapter: Footnote[];
  volume: Footnote[];
}

export interface Hadith {
  id: string;
  number: number;
  variant: string | null;
  label: string;
  sort_order: number;
  content: ContentEntry[];
  audio_files: Record<string, Record<string, string>>;
  book: Book;
  volume: Volume;
  chapter: Chapter | null;
  footnotes?: HadithFootnotes;
}

export interface ChapterWithHadiths extends Chapter {
  hadith_first: number | null;
  hadith_last: number | null;
  footnotes: Footnote[];
  hadiths: Hadith[];
}

export interface VolumeWithChapters {
  book: Book;
  volume: Volume;
  chapters: ChapterWithHadiths[];
  volume_footnotes: Footnote[];
}

export interface HadithPreview {
  id: string;
  number: number;
  variant: string | null;
  label: string;
  content: Array<{ ar: string; ms: string }>;
  book: { id: string; slug: string; title_ms: string };
  volume: { id: string; slug: string; title_ms: string };
}

// Search interfaces
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  mode?: 'text' | 'semantic';
  books?: string;
}

export interface SearchResultDocument extends HadithPreview {
  content_index: number;
  similarity?: number;
  highlights?: any[];
}

export interface SearchResult {
  documents: SearchResultDocument[];
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
