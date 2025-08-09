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
  initializeSampleData: () => void
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
    theme: 'system' as const,
    notifications: true,
    dailyReminder: true,
    reminderTime: '20:00',
    privacyLevel: 'private' as const,
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
      addEntry: (entry) => {
        console.log('Adding entry to store:', entry)
        try {
          set((state) => {
            const newState = { 
              entries: [entry, ...state.entries] 
            }
            console.log('New entries state:', newState.entries)
            return newState
          })
          console.log('Store updated successfully')
        } catch (error) {
          console.error('Error updating store:', error)
        }
      },
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
      initializeSampleData: () => {
        const state = get()
        if (state.entries.length === 0 && state.tags.length === 0) {
          const sampleTags: Tag[] = [
            {
              id: '1',
              name: 'Gratitude',
              type: 'hashtag',
              color: '#10B981',
              userId: 'user-1',
              createdAt: new Date(),
            },
            {
              id: '2',
              name: 'Work',
              type: 'hashtag',
              color: '#3B82F6',
              userId: 'user-1',
              createdAt: new Date(),
            },
            {
              id: '3',
              name: 'Personal',
              type: 'hashtag',
              color: '#8B5CF6',
              userId: 'user-1',
              createdAt: new Date(),
            },
          ]

          const sampleEntries: JournalEntry[] = [
            {
              id: '1',
              userId: 'user-1',
              title: 'My First Journal Entry',
              content: 'Today I started my journaling journey with Journify. I\'m excited to see how this practice will help me reflect on my daily experiences and track my personal growth over time.',
              mood: 'excited',
              tags: [sampleTags[0], sampleTags[2]],
              isHighlight: true,
              attachments: [],
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
              id: '2',
              userId: 'user-1',
              title: 'Work Progress',
              content: 'Made significant progress on the project today. The team collaboration was excellent and we achieved our sprint goals ahead of schedule. Feeling accomplished and motivated for the next phase.',
              mood: 'happy',
              tags: [sampleTags[1]],
              isHighlight: false,
              attachments: [],
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
          ]

          set({ entries: sampleEntries, tags: sampleTags })
        }
      },
    }),
    {
      name: 'journify-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        currentView: state.currentView,
        searchFilters: state.searchFilters,
        entries: state.entries,
        tags: state.tags,
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
  
  console.log('useFilteredEntries - all entries:', entries.length)
  console.log('useFilteredEntries - current filters:', filters)
  
  const filtered = entries.filter(entry => {
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
  
  console.log('useFilteredEntries - filtered entries:', filtered.length)
  return filtered
} 