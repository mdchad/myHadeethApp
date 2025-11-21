import { create } from 'zustand'
import storage from '@/app/shared/storage'

interface SearchHistoryState {
  history: string[]
  addToHistory: (query: string) => void
  removeFromHistory: (query: string) => void
  clearHistory: () => void
}

const STORAGE_KEY = 'search-history'
const MAX_HISTORY_ITEMS = 15

// Helper to load history from storage
const loadHistoryFromStorage = (): string[] => {
  try {
    const data = storage.getString(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    }
    return []
  } catch (error) {
    console.error('[SearchHistoryStore] Error loading history:', error)
    return []
  }
}

// Helper to save history to storage
const saveHistoryToStorage = (history: string[]) => {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('[SearchHistoryStore] Error saving history:', error)
  }
}

export const useSearchHistoryStore = create<SearchHistoryState>((set, get) => ({
  // Initialize from storage
  history: loadHistoryFromStorage(),

  // Add query to history (removes duplicates and maintains max limit)
  addToHistory: (query: string) => {
    if (!query.trim()) return

    const currentHistory = get().history

    // Remove existing instance of the query
    const filteredHistory = currentHistory.filter((item) => item !== query)

    // Add new query to the beginning
    let newHistory = [query, ...filteredHistory]

    // Limit to MAX_HISTORY_ITEMS
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)
    }

    // Update store and storage
    set({ history: newHistory })
    saveHistoryToStorage(newHistory)
  },

  // Remove specific query from history
  removeFromHistory: (query: string) => {
    const currentHistory = get().history
    const newHistory = currentHistory.filter((item) => item !== query)

    // Update store and storage
    set({ history: newHistory })
    saveHistoryToStorage(newHistory)
  },

  // Clear all history
  clearHistory: () => {
    set({ history: [] })
    storage.delete(STORAGE_KEY)
  },
}))
