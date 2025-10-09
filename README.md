# My Way - Islamic Companion App

A React Native mobile app built with Expo Router that provides Islamic content including Hadith collections, prayer times, Qibla direction, and Quran features. The app is localized for English and Malay languages with Malay as the default.

## Tech Stack

- **Framework**: React Native (0.73.6) with Expo SDK 50
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack Query v5 with AsyncStorage persistence
- **Storage**: MMKV for fast synchronous storage, AsyncStorage for query cache
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Internationalization**: i18next with custom AsyncStorage language detector
- **UI Libraries**: Moti for animations, Gorhom Bottom Sheet, Reanimated
- **Audio**: Expo AV (configured for silent mode on iOS)

## Development Commands

```bash
# Start development server (clears cache)
bun start

# Run on specific platform
bun android
bun ios
bun web

# Build production apps
bun build:ios
bun build:android

# Submit to stores
bun submit:ios
bun submit:android

# Development builds (for testing on devices)
bun build:android:development
bun build:ios:development

# OTA updates (after using EAS)
eas update --branch production --message "Update message"
```

## Project Structure

### File-Based Routing (`app/` directory)

The app uses Expo Router with a file-based routing system:

- `app/_layout.js` - Root layout with providers (Query Client, i18n, fonts, gestures)
- `app/(app)/` - Main authenticated app group
  - `(tabs)/` - Bottom tab navigation with 6 tabs:
    - `(default)` - Home screen
    - `(hadeeth)` - Hadith collections
    - `(search)` - Search functionality
    - `(prayers)` - Prayer times
    - `(qibla)` - Qibla compass
    - `(profile)` - User profile/settings
  - `settings/` - Settings screens
  - `user/` - User-related screens
  - `hadith40/` - 40 Hadith collection
  - `introduction/` - Onboarding screens
  - `(auth)/` - Authentication screens

### Key Directories

- `app/components/` - Reusable UI components (HadithItem, Audio player, Compass, etc.)
- `app/shared/` - Shared utilities and hooks
  - `fetcher/` - TanStack Query hooks for API calls
  - `storage.js` - MMKV storage instance
  - `useAppState.js` - App state management
  - `useOnlineManager.js` - Network status tracking
- `app/i18n/` - Internationalization setup
  - `locales/` - Translation files (en.json, ms.json)
- `app/utils/` - Utility functions (shareHadith, toSuperscript, etc.)
- `context/` - React Context providers (Location services)
- `data/` - Static data files (hadith40.json)
- `assets/` - Images, fonts, and static assets

## Key Features

1. **Hadith Collections** - Browse multiple authenticated Hadith collections by book and volume
2. **Search** - Full-text search across all Hadiths
3. **Daily Hadith** - Curated daily Hadith with caching
4. **Prayer Times** - Calculate prayer times based on location
5. **Qibla Direction** - Compass showing Qibla direction using device sensors
6. **Audio Recitations** - Audio playback for Hadiths and Quran
7. **Offline Support** - Aggressive caching with offline-first strategy
8. **OTA Updates** - Expo Updates for production channel

## API Endpoints

All API calls go through `https://my-way-web.vercel.app/api`:
- `GET /books` - List all Hadith books
- `GET /books/:bookId/:volumeId` - Get Hadiths in a volume
- `GET /hadiths/:hadithId` - Get single Hadith
- `GET /today` - Get today's Hadith (cached for 24h, stale after 5min)

## Platform Details

### iOS
- Bundle ID: `com.mdchad.myWay`
- Location permissions required for Qibla
- Audio plays in silent mode
- No tablet support

### Android
- Package: `com.mdchad.myWay`
- Permissions: Location, storage, network state
- Build type: APK for development

## Module Aliases

```javascript
@components → ./app/components
@pages → ./app/pages
@assets → ./assets
@lib → ./lib
@context → ./context
@data → ./data
```

For more detailed information, see [CLAUDE.md](./CLAUDE.md).
