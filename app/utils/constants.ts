// Base URL for hadith voiceover audio on Cloudflare R2. Overridable per
// environment via EXPO_PUBLIC_R2_BASE_URL (set in .env / EAS env config).
export const R2_VOICEOVER_BASE_URL =
  process.env.EXPO_PUBLIC_R2_BASE_URL ??
  'https://pub-34bac4a6ce3242dabed8105f8908b2ee.r2.dev/myway-voiceover'
