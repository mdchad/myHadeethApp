import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite"

export const expoDb = openDatabaseSync("bookmarks.db")

export const db = drizzle(expoDb)