import {Slot} from "expo-router";
import { Provider } from "@context/auth";
import { useFonts } from "expo-font";
import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from "@expo-google-fonts/scheherazade-new";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {Platform} from "react-native";
import {useAppState} from "./shared/useAppState";
import {useOnlineManager} from "./shared/useOnlineManager";

function onAppStateChange(status) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: 0,
        },
        queries: {
            retry: 2,
            cacheTime: 1000 * 10,
        },
    },
});

const asyncPersist = createAsyncStoragePersister({
    storage: AsyncStorage,
    dehydrateOptions: {
        dehydrateMutations: true,
        dehydrateQueries: false,
    },
    throttleTime: 1000,
});
//
// queryClient.setMutationDefaults(['todos'], {
//     mutationFn: async ({ todo }) => {
//         return supabase.from('todos').insert({ todo });
//     },
// });

export default function Root() {
    const [fontsLoaded] = useFonts({
        Traditional_Arabic: require("@assets/fonts/Traditional-Arabic-Regular.ttf"),
        Traditional_ArabicRegular: require("@assets/fonts/trado.ttf"),
        Traditional_ArabicBold: require("@assets/fonts/tradbdo.ttf"),
        KFGQPC_Regular: require("@assets/fonts/kfgqpc-arabic-symbols.ttf"),
        ScheherazadeNew_400Regular,
        ScheherazadeNew_700Bold
    });

    useEffect(() => {
        // await AsyncStorage.clear();
        AsyncStorage.getAllKeys()
          .then(keys => AsyncStorage.multiRemove(keys))
          .then(() => console.log('success'));
    }, [])

    useAppState(onAppStateChange);
    useOnlineManager();

    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded) {
    //         await SplashScreen.hideAsync();
    //     }
    // }, [fontsLoaded]);
    //
    // if (!fontsLoaded) {
    //     return null;
    // }

    return (
        // Set up the auth context and render our layout inside it.
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
            maxAge: Infinity,
            persister: asyncPersist,
        }}
        onSuccess={() =>
          queryClient
            .resumePausedMutations()
            .then(() => queryClient.invalidateQueries())
        }
      >
        <Provider>
            <Slot/>
        </Provider>
      </PersistQueryClientProvider>
    );
}