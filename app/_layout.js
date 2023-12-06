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
import {setRootText} from "./i18n";

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

    await Promise.all([
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
        // Remove the hardcoded
        setRootText('ms')
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
