import { Slot } from 'expo-router'
import { Provider } from '../context/provider'
import { useFonts } from 'expo-font'
import {
  ScheherazadeNew_400Regular,
  ScheherazadeNew_700Bold
} from '@expo-google-fonts/scheherazade-new'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { focusManager, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Platform } from 'react-native'
import { useAppState } from './shared/useAppState'
import { useOnlineManager } from './shared/useOnlineManager'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import {zonedTimeToUtc} from "date-fns-tz";
import {format} from "date-fns";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all the languages you want here
import en from "./i18n/locales/en.json";
import ms from "./i18n/locales/ms.json";

const isAndroid = Platform.OS === "android";
const isHermes = !!global.HermesInternal;

if (isAndroid || isHermes) {
  require("@formatjs/intl-locale/polyfill");

  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/locale-data/en");
  require("@formatjs/intl-pluralrules/locale-data/es");

  require("@formatjs/intl-displaynames/polyfill");
  require("@formatjs/intl-displaynames/locale-data/en");
  require("@formatjs/intl-displaynames/locale-data/es");
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
    detect: function (callback) {
      console.log('[LANG] detecting language');
      AsyncStorage.getItem('user-language').then((val) => {
        const detected = val || 'ms'; //default language
        console.log('[LANG] detected:', detected);
        callback(detected);
      });
    },
    cacheUserLanguage: function (lng) {
      return lng;
    },
  })
  .init({
  // Add any imported languages here
  resources: {
    en: {
      translation: en,
    },
    ms: {
      translation: ms,
    }
  },
  fallbackLng: "ms",  // This is the default language if none of the users preffered languages are available
  interpolation: {
    escapeValue: false, // https://www.i18next.com/translation-function/interpolation#unescape
  },
  returnNull: false,
  detection: {
    order: ['customDetector']
  },
});

function onAppStateChange(status) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchInterval: false,
      staleTime: 12 * 60 * 60 * 1000, // 12 hours
    }
  }
})

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  dehydrateOptions: {
    dehydrateMutations: true,
    dehydrateQueries: false,
    shouldDehydrateQuery: (query) => {
      const queryIsReadyForPersistance = query.state.status === 'success';
      if (queryIsReadyForPersistance) {
        const { queryKey } = query;
        const excludeFromPersisting = queryKey.includes('search');
        return !excludeFromPersisting;
      }
      return queryIsReadyForPersistance;
    }
  },
  throttleTime: 1000
})

SplashScreen.preventAutoHideAsync()

export default function Root() {
  useAppState(onAppStateChange)
  useOnlineManager()

  const [fontsLoaded, fontError] = useFonts({
    Traditional_Arabic: require('@assets/fonts/Traditional-Arabic-Regular.ttf'),
    Traditional_ArabicRegular: require('@assets/fonts/trado.ttf'),
    Traditional_ArabicBold: require('@assets/fonts/tradbdo.ttf'),
    KFGQPC_Regular: require('@assets/fonts/kfgqpc-arabic-symbols.ttf'),
    ScheherazadeNew_400Regular,
    ScheherazadeNew_700Bold
  })

  const prefetchTodos = async () => {
    const timeZone = 'Asia/Kuala_Lumpur';
    const nowInKualaLumpur = zonedTimeToUtc(new Date(), timeZone);
    const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd', { timeZone });
    // The results of this query will be cached like a normal query

    return Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['books'],
        queryFn: async () => {
          const res = await fetch('https://my-way-web.vercel.app/api/books', {
            method: 'GET'
          })
          const result = await res.json()
          return result.data
        }
      }),
      queryClient.prefetchQuery({
        queryKey: ['todayHadith', formattedDate],
        queryFn: async () => {
          const res = await fetch('https://my-way-web.vercel.app/api/today', {
            cache: 'no-store',
            method: 'GET'
          })
          const result = await res.json()
          return result
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 24 * 60 * 60 * 1000
      })
    ])
  }

  useEffect(() => {
    prefetchTodos().then((t) => {
      if (fontsLoaded || fontError) {
        // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
        SplashScreen.hideAsync()
      }
    })
  }, [fontsLoaded, fontError])

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    // Set up the auth context and render our layout inside it.
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: Infinity,
        persister: asyncPersist
      }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
    >
      <Provider>
        <Slot />
      </Provider>
    </PersistQueryClientProvider>
  )
}
