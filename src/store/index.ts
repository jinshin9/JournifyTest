import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JournalEntry, User, Tag, Mood, AppSettings, SearchFilters } from '@/types'

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // Entries state
  entries: JournalEntry[]
  currentEntry: JournalEntry | null
  isLoading: boolean
  
  // Tags state
  tags: Tag[]
  
  // UI state
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  currentView: 'timeline' | 'calendar' | 'grid' | 'stats'
  
  // Search and filters
  searchFilters: SearchFilters
  
  // Settings
  settings: AppSettings
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setEntries: (entries: JournalEntry[]) => void
  addEntry: (entry: JournalEntry) => void
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void
  deleteEntry: (id: string) => void
  setCurrentEntry: (entry: JournalEntry | null) => void
  setLoading: (loading: boolean) => void
  setTags: (tags: Tag[]) => void
  addTag: (tag: Tag) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setSidebarOpen: (open: boolean) => void
  setCurrentView: (view: 'timeline' | 'calendar' | 'grid' | 'stats') => void
  setSearchFilters: (filters: SearchFilters) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  resetState: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  entries: [],
  currentEntry: null,
  isLoading: false,
  tags: [],
  theme: 'system' as const,
  sidebarOpen: false,
  currentView: 'timeline' as const,
  searchFilters: {},
  settings: {
    theme: 'system',
    notifications: true,
    dailyReminder: true,
    reminderTime: '20:00',
    privacyLevel: 'private',
    autoSave: true,
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setEntries: (entries) => set({ entries }),
      addEntry: (entry) => set((state) => ({ 
        entries: [entry, ...state.entries] 
      })),
      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        ),
        currentEntry: state.currentEntry?.id === id 
          ? { ...state.currentEntry, ...updates }
          : state.currentEntry
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id),
        currentEntry: state.currentEntry?.id === id ? null : state.currentEntry
      })),
      setCurrentEntry: (entry) => set({ currentEntry: entry }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      setTags: (tags) => set({ tags }),
      addTag: (tag) => set((state) => ({ 
        tags: [...state.tags, tag] 
      })),
      updateTag: (id, updates) => set((state) => ({
        tags: state.tags.map(tag => 
          tag.id === id ? { ...tag, ...updates } : tag
        )
      })),
      deleteTag: (id) => set((state) => ({
        tags: state.tags.filter(tag => tag.id !== id)
      })),
      
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      setSearchFilters: (filters) => set({ searchFilters: filters }),
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      
      resetState: () => set(initialState),
    }),
    {
      name: 'journify-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        currentView: state.currentView,
        searchFilters: state.searchFilters,
      }),
    }
  )
)

// Selectors for better performance
export const useEntries = () => useAppStore((state) => state.entries)
export const useCurrentEntry = () => useAppStore((state) => state.currentEntry)
export const useTags = () => useAppStore((state) => state.tags)
export const useUser = () => useAppStore((state) => state.user)
export const useTheme = () => useAppStore((state) => state.theme)
export const useSettings = () => useAppStore((state) => state.settings)
export const useSearchFilters = () => useAppStore((state) => state.searchFilters)

// Computed selectors
export const useHighlightedEntries = () => 
  useAppStore((state) => state.entries.filter(entry => entry.isHighlight))

export const useEntriesByMood = (mood: Mood) =>
  useAppStore((state) => state.entries.filter(entry => entry.mood === mood))

export const useEntriesByTag = (tagId: string) =>
  useAppStore((state) => state.entries.filter(entry => 
    entry.tags.some(tag => tag.id === tagId)
  ))

export const useFilteredEntries = () => {
  const entries = useEntries()
  const filters = useSearchFilters()
  
  return entries.filter(entry => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const contentMatch = entry.content.toLowerCase().includes(searchLower)
      const titleMatch = entry.title?.toLowerCase().includes(searchLower)
      if (!contentMatch && !titleMatch) return false
    }
    
    // Mood filter
    if (filters.mood && filters.mood.length > 0) {
      if (!entry.mood || !filters.mood.includes(entry.mood)) return false
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const entryTagIds = entry.tags.map(tag => tag.id)
      if (!filters.tags.some(tagId => entryTagIds.includes(tagId))) return false
    }
    
    // Highlight filter
    if (filters.isHighlight !== undefined && entry.isHighlight !== filters.isHighlight) {
      return false
    }
    
    // Date range filter
    if (filters.dateRange) {
      const entryDate = new Date(entry.createdAt)
      if (entryDate < filters.dateRange.start || entryDate > filters.dateRange.end) {
        return false
      }
    }
    
    return true
  })
} 