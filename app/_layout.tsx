import { Slot } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { focusManager, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Platform, StatusBar } from 'react-native'
import useAppState from './shared/useAppState'
import useOnlineManager from './shared/useOnlineManager'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'
import { setAudioModeAsync } from 'expo-audio'
import { PostHogProvider } from 'posthog-react-native'
import '../global.css'
import * as Sentry from '@sentry/react-native'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import all the languages you want here
import en from './i18n/locales/en.json'
import ms from './i18n/locales/ms.json'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalProvider } from '@gorhom/portal'
import { useLocationStore } from './stores/useLocationStore'
import FloatingAudioPlayer from './components/floating-audio-player'
import {HeroUINativeProvider} from "heroui-native";
import Constants from 'expo-constants'
import { useVersionCheck } from './shared/useVersionCheck'
import { UpdateRequiredBlocker } from './components/update-required-blocker'
import storage from './shared/storage'
import { ApiError, isNetworkError } from './utils/api'

const isAndroid = Platform.OS === 'android'
const isHermes = !!(global as Record<string, unknown>).HermesInternal

const API_URL = process.env.EXPO_PUBLIC_API_URL

if (isAndroid || isHermes) {
  require('@formatjs/intl-locale/polyfill')

  require('@formatjs/intl-pluralrules/polyfill')
  require('@formatjs/intl-pluralrules/locale-data/en')
  require('@formatjs/intl-pluralrules/locale-data/es')

  require('@formatjs/intl-displaynames/polyfill')
  require('@formatjs/intl-displaynames/locale-data/en')
  require('@formatjs/intl-displaynames/locale-data/es')
}

i18n
  .use(initReactI18next)
  .use({
    type: 'languageDetector',
    name: 'customDetector',
    async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
    init: function () {
      /* use services and options */
    },
    detect: function (callback: any) {
      console.log('[LANG] detecting language')
      AsyncStorage.getItem('user-language').then((val) => {
        const detected = val || 'ms' //default language
        console.log('[LANG] detected:', detected)
        callback(detected)
      })
    },
    cacheUserLanguage: function (lng: string) {
      return lng
    }
  })
  .init({
    // Add any imported languages here
    resources: {
      en: {
        translation: en
      },
      ms: {
        translation: ms
      }
    },
    fallbackLng: 'ms', // This is the default language if none of the users preffered languages are available
    interpolation: {
      escapeValue: false // https://www.i18next.com/translation-function/interpolation#unescape
    },
    returnNull: false,
    detection: {
      order: ['customDetector']
    }
  })

function onAppStateChange(status: string) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Client errors (4xx) won't succeed on retry — fail immediately.
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        // Retry up to 3 times for network/server errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchInterval: false,
      staleTime: 12 * 60 * 60 * 1000 // 12 hours
    }
  }
})

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000
})

// Cache buster for the persisted React Query cache. Tied to the native app
// version so updating the binary (e.g. 1.0.11 -> 2.0.0) discards any cached
// API responses in the old data shape instead of hydrating them into
// components that expect the new shape.
const PERSIST_BUSTER =
  Constants.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '2.0.0'

// One-time cleanup of AsyncStorage keys that older builds may have written
// with the pre-2.0.0 data shape. None of these are read by 2.x code.
const cleanupLegacyStorage = async () => {
  if (storage.getBoolean('v2-storage-cleaned')) return
  try {
    await AsyncStorage.multiRemove([
      'saved-hadiths',
      'user-notes',
      'last-read-position',
      'app-settings'
    ])
    storage.set('v2-storage-cleaned', true)
  } catch {
    // Non-blocking; retried on next launch.
  }
}

SplashScreen.preventAutoHideAsync()

// Connectivity-level failures are expected operational noise (user is offline,
// flaky connection, request timed out) — not bugs. Don't report them.
const EXPECTED_NETWORK_MESSAGES = [
  'Network request failed',
  'Network unavailable',
  'Request timed out',
  'The Internet connection appears to be offline',
]

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  beforeSend(event, hint) {
    const error = hint?.originalException
    if (isNetworkError(error)) return null
    const message = error instanceof Error ? error.message : String(error ?? '')
    if (EXPECTED_NETWORK_MESSAGES.some((m) => message.includes(m))) return null
    return event
  },
});

export default Sentry.wrap(function Root() {
  useAppState(onAppStateChange)
  useOnlineManager()

  // Check app version
  const { updateRequired, currentVersion, minimumVersion, releaseNotes } = useVersionCheck()

  // Initialize location tracking with Zustand
  const initializeLocationTracking = useLocationStore(
    (state) => state.initializeLocationTracking
  )

  // Best-effort warm-up of the cache. prefetchQuery never rejects, so an
  // offline launch degrades to whatever the persisted cache restores — it
  // must never be able to block startup.
  const prefetchTodos = async () => {
    const { apiGet, apiFetch } = await import('./utils/api')
    const timeZone = 'Asia/Kuala_Lumpur'
    const nowInKualaLumpur = toZonedTime(new Date(), timeZone)
    const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd')

    // Prefetch books and today's hadith
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['books'],
        queryFn: async () => {
          const result = await apiGet('/api/books')
          return result.data
        }
      }),
      queryClient.prefetchQuery({
        queryKey: ['todayHadith', formattedDate],
        queryFn: async () => {
          const result = await apiFetch('/api/today', {
            method: 'GET',
            cache: 'no-store'
          })
          return result
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000
      })
    ])

    // Prefetch all volumes for every book the cache now knows about (empty
    // when the books fetch failed, e.g. offline)
    const books = queryClient.getQueryData<any[]>(['books']) ?? []
    await Promise.all(
      books.map((book: any) =>
        queryClient.prefetchQuery({
          queryKey: ['volumes', book.id],
          queryFn: async () => {
            const result = await apiGet(`/api/books/${book.id}`)
            return result.data
          }
        })
      )
    )
  }

  useEffect(() => {
    // Initialize location tracking and get cleanup function
    const cleanupLocationTracking = initializeLocationTracking()

    cleanupLegacyStorage()

    // Not network-dependent — configure audio regardless of prefetch outcome
    setAudioModeAsync({ playsInSilentMode: true })

    // Hide the splash screen no matter how the warm-up went; an offline
    // launch falls back to the persisted query cache.
    prefetchTodos()
      .catch(() => {})
      .finally(() => {
        SplashScreen.hideAsync()
      })

    // Cleanup location tracking on unmount
    return () => {
      cleanupLocationTracking()
    }
  }, [])

  return (
    // Set up the auth context and render our layout inside it.
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        buster: PERSIST_BUSTER,
        persister: asyncPersist,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const queryIsReadyForPersistance = query.state.status === 'success'
            if (queryIsReadyForPersistance) {
              const { queryKey } = query
              const excludeFromPersisting = queryKey.includes('search')
              return !excludeFromPersisting
            }
            return queryIsReadyForPersistance
          }
        }
      }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
          options={{ host: 'https://us.i.posthog.com' }}
        >
          <PortalProvider>
            <HeroUINativeProvider>
              <Slot />
              <FloatingAudioPlayer />
              <UpdateRequiredBlocker
                visible={updateRequired}
                currentVersion={currentVersion}
                minimumVersion={minimumVersion || currentVersion}
                releaseNotes={releaseNotes}
              />
            </HeroUINativeProvider>
          </PortalProvider>
        </PostHogProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
})
