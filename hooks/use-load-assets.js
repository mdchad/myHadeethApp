import { db } from "../db/client"
import migrations from "../drizzle/migrations"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { SplashScreen } from "expo-router"
import { useEffect } from "react"
import {useFonts} from "expo-font";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export function useLoadAssets() {
  const [fontsLoaded, fontError] = useFonts({
    arabic_symbols: require('@assets/fonts/kfgqpc-arabic-symbols.ttf'),
    arabic_regular: require('@assets/fonts/KFGQPC-Regular.ttf'),
    arabic_bold: require('@assets/fonts/KFGQPC-Bold.ttf'),
    uthmanic_hafs: require('@assets/fonts/uthmanic-hafs.ttf'),
  })

  const { success: hasRunMigrations, error: runningMigrationError } =
    useMigrations(db, migrations)

  useEffect(() => {
    if (fontError) throw fontError
    if (runningMigrationError) throw runningMigrationError
  }, [fontError, runningMigrationError])

  useEffect(() => {
    if (fontsLoaded && hasRunMigrations) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, hasRunMigrations])

  return { isLoaded: fontsLoaded && hasRunMigrations }
}