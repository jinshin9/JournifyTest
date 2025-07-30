export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface JournalEntry {
  id: string
  userId: string
  title?: string
  content: string
  mood?: Mood
  tags: Tag[]
  isHighlight: boolean
  attachments: Attachment[]
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  type: 'folder' | 'person' | 'location' | 'hashtag'
  color?: string
  userId: string
  createdAt: Date
}

export interface Attachment {
  id: string
  entryId: string
  type: 'image' | 'video' | 'audio'
  url: string
  filename: string
  size: number
  createdAt: Date
}

export type Mood = 'happy' | 'sad' | 'excited' | 'calm' | 'angry' | 'neutral'

export interface WritingStats {
  totalEntries: number
  totalWords: number
  averageWordsPerEntry: number
  longestStreak: number
  currentStreak: number
  mostUsedTags: Array<{ tag: Tag; count: number }>
  moodDistribution: Record<Mood, number>
}

export interface AIInsight {
  id: string
  entryId: string
  type: 'mood_trend' | 'writing_pattern' | 'topic_suggestion' | 'goal_progress'
  content: string
  confidence: number
  createdAt: Date
}

export interface Prompt {
  id: string
  text: string
  category: 'daily' | 'reflection' | 'gratitude' | 'goal' | 'creative'
  isAI: boolean
  createdAt: Date
}

export interface GamificationData {
  level: number
  experience: number
  currency: number
  achievements: Achievement[]
  streaks: {
    current: number
    longest: number
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  dailyReminder: boolean
  reminderTime: string
  privacyLevel: 'private' | 'public'
  autoSave: boolean
}

export interface SearchFilters {
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  mood?: Mood[]
  isHighlight?: boolean
  searchTerm?: string
}

export interface CalendarView {
  type: 'month' | 'week' | 'day'
  selectedDate: Date
  entries: JournalEntry[]
}

export interface TimelineView {
  entries: JournalEntry[]
  groupBy: 'day' | 'week' | 'month'
}

export interface VoiceMemo {
  id: string
  entryId: string
  url: string
  duration: number
  transcript?: string
  createdAt: Date
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export interface ChecklistEntry extends JournalEntry {
  items: ChecklistItem[]
}

export interface TextEditorState {
  content: string
  selection: {
    start: number
    end: number
  }
  formatting: {
    bold: boolean
    italic: boolean
    underline: boolean
    color?: string
    fontSize?: number
  }
} 