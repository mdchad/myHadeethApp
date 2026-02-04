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

const isAndroid = Platform.OS === 'android'
const isHermes = !!global.HermesInternal

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
        // Don't retry on 404s
        if (error?.message?.includes('404')) return false
        // Retry up to 3 times for network errors
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

SplashScreen.preventAutoHideAsync()

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
});

export default Sentry.wrap(function Root() {
  useAppState(onAppStateChange)
  useOnlineManager()

  // Initialize location tracking with Zustand
  const initializeLocationTracking = useLocationStore(
    (state) => state.initializeLocationTracking
  )

  const prefetchTodos = async () => {
    const { apiGet, apiFetch } = await import('./utils/api')
    const timeZone = 'Asia/Kuala_Lumpur'
    const nowInKualaLumpur = toZonedTime(new Date(), timeZone)
    const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd')

    // First, fetch books
    const booksResult = await apiGet('/api/books')
    const books = booksResult.data

    // Prefetch books and today's hadith
    const initialPrefetch = [
      queryClient.prefetchQuery({
        queryKey: ['books'],
        queryFn: async () => books
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
    ]

    // Prefetch all volumes for all books
    const volumePrefetches = books.map((book: any) =>
      queryClient.prefetchQuery({
        queryKey: ['volumes', book.id],
        queryFn: async () => {
          const result = await apiGet(`/api/books/${book.id}`)
          return result.data
        }
      })
    )

    return Promise.all([...initialPrefetch, ...volumePrefetches])
  }

  useEffect(() => {
    // Initialize location tracking and get cleanup function
    const cleanupLocationTracking = initializeLocationTracking()

    prefetchTodos().then(() => {
      setAudioModeAsync({ playsInSilentMode: true })
      // Hide the splash screen after prefetching is done
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
      <GestureHandlerRootView>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
          options={{ host: 'https://us.i.posthog.com' }}
        >
          <PortalProvider>
            <Slot />
            <FloatingAudioPlayer />
          </PortalProvider>
        </PostHogProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
})
