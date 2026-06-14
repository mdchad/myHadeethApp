# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"My Way" is a React Native mobile app built with Expo Router that provides Islamic content including Hadith collections such as Kutub Sittah and Forty Hadith. It also has a powerful AI semantic search to search across all the books. User can also use the AI chatbot to get an explanation of a hadith or the summary of it. It also has an Audio both in English and Malay for all the 30,000 hadiths. The app is localized for Malay language with Malay as the default.

## Tech Stack

- **Framework**: React Native (0.73.6) with Expo SDK 50
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack Query v5 with AsyncStorage persistence
- **Storage**: MMKV for fast synchronous storage, AsyncStorage for query cache
- **Styling**: Uniwind (TailwindCSS for React Native)
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
  - `fetcher/` - TanStack Query hooks for API calls (useBooks, useHadiths, useVolumes, useSearch, useTodayHadith)
  - `storage.js` - MMKV storage instance
  - `useAppState.js` - App state management
  - `useOnlineManager.js` - Network status tracking
- `app/i18n/` - Internationalization setup
  - `locales/` - Translation files (en.json, ms.json)
- `app/utils/` - Utility functions (shareHadith, toSuperscript, etc.)
- `context/` - React Context providers
  - `provider.js` - Location services context (Qibla direction)
- `data/` - Static data files (hadith40.json)
- `assets/` - Images, fonts, and static assets

## Architecture Patterns

### Data Fetching & Caching

The app uses TanStack Query with aggressive caching and offline-first strategy:

- **Cache Duration**: 24 hours for most queries, 12 hours stale time
- **Persistence**: Queries persisted to AsyncStorage (except search queries)
- **Prefetching**: Books and daily Hadith are prefetched in root layout
- **Network Mode**: `offlineFirst` for books, standard for other queries
- **API Base**: `https://my-way-web.vercel.app/api`

Key query hooks in `app/shared/fetcher/`:
- `useGetBooks()` - Fetch Hadith book collections
- `useGetHadiths(bookId, volumeId)` - Fetch Hadiths for a volume
- `useGetVolumes(bookId)` - Fetch volumes for a book
- `useSearchHadith(query)` - Search Hadiths
- `useGetTodayHadith()` - Fetch daily Hadith

### Location Services

Location tracking is managed in `context/provider.js`:
- Requests foreground location permissions on app startup
- Updates location when app becomes active
- Provides `userLocation`, `userPlace`, and `permissionStatus` to children
- Used primarily for Qibla direction calculation

### Internationalization

Custom i18next setup with AsyncStorage language detection:
- Default language: Malay (`ms`)
- Fallback: Malay
- Language persisted in AsyncStorage key: `user-language`
- Translations stored in `app/i18n/locales/`

### Custom Fonts

Four Arabic fonts loaded in root layout:
- `arabic_symbols` - KFGQPC Arabic Symbols
- `arabic_regular` - KFGQPC Regular
- `arabic_bold` - KFGQPC Bold
- `uthmanic_hafs` - Uthmanic Hafs (Quran script)

### Module Aliases (Babel)

```javascript
@components → ./app/components
@pages → ./app/pages
@assets → ./assets
@lib → ./lib
@context → ./context
@data → ./data
```

## EAS Build Configuration

EAS profiles defined in `eas.json`:
- **development** - Development client with simulator support
- **development-device** - Development client for physical devices
- **preview** - Internal distribution preview builds
- **production** - Production builds with auto-increment, uses m-medium resources

## Platform-Specific Notes

### iOS
- Bundle ID: `com.mdchad.myWay`
- Location permissions required for Qibla
- Audio plays in silent mode (configured in root layout)
- No tablet support

### Android
- Package: `com.mdchad.myWay`
- Permissions: Location, storage, network state
- Build type: APK for development

## Important Polyfills

For Android and Hermes, the following Intl polyfills are loaded in `app/_layout.js`:
- `@formatjs/intl-locale`
- `@formatjs/intl-pluralrules` (en, es)
- `@formatjs/intl-displaynames` (en, es)

## API Endpoints

All API calls go through `https://my-way-web.vercel.app/api`:
- `GET /books` - List all Hadith books
- `GET /books/:bookId/:volumeId` - Get Hadiths in a volume
- `GET /hadiths/:hadithId` - Get single Hadith
- `GET /today` - Get today's Hadith (cached for 24h, stale after 5min)
- Search endpoints handled via TanStack Query

## Key Features

1. **Hadith Collections** - Browse multiple authenticated Hadith collections by book and volume
2. **Search** - AI semantic search across all Hadiths
3. **Daily Hadith** - Curated daily Hadith with caching
4. **AI Chatbot** - Chatbot to talk to AI for summaries and explanation
5. **Audio Recitations** - Audio playback for Hadiths
6. **Offline Support** - Aggressive caching with offline-first strategy

## Agent-device

Use agent-device only for app/device automation tasks.
Before planning device work, run `agent-device --version` and read `agent-device help workflow`.
For exploratory QA, read `agent-device help dogfood`.
For logs, network, traces, or runtime failures, read `agent-device help debugging`.
For React Native component trees, props/state/hooks, slow renders, or rerenders, read `agent-device help react-devtools`.
For React Native apps, overlays, Metro/Fast Refresh blockers, and routing to React DevTools or debugging evidence, read `agent-device help react-native`.

Use the CLI in the integrated terminal.
If `agent-device` is not on PATH but the user installed it globally in another shell, resolve the absolute binary path instead of using `npx -y agent-device@latest`.
Prefer `open -> snapshot -i -> act -> re-snapshot -> verify -> close`.
Keep mutating commands against one session serial.
