import { Slot } from 'expo-router'
import { Provider } from '@context/auth'
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

function onAppStateChange(status) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      cacheTime: 10000 * 10
    }
  }
})

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  dehydrateOptions: {
    dehydrateMutations: true,
    dehydrateQueries: false
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
    // The results of this query will be cached like a normal query
    await queryClient.prefetchQuery({
      queryKey: ['books'],
      queryFn: async () => {
        const res = await fetch('https://my-way-web.vercel.app/api/books', {
          method: 'GET'
        })
        const result = await res.json()
        return result.data
      }
    })
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
