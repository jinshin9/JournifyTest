'use client'

import { useAppStore } from '@/store'
import { TimelineView } from './views/timeline-view'
import { CalendarView } from './views/calendar-view'
import { GridView } from './views/grid-view'
import { StatsView } from './views/stats-view'
import { EntryEditor } from './entry-editor'

export function Dashboard() {
  const { currentView, currentEntry } = useAppStore()

  // If there's a current entry being edited, show the editor
  if (currentEntry) {
    return <EntryEditor />
  }

  // Render the appropriate view based on currentView
  switch (currentView) {
    case 'timeline':
      return <TimelineView />
    case 'calendar':
      return <CalendarView />
    case 'grid':
      return <GridView />
    case 'stats':
      return <StatsView />
    default:
      return <TimelineView />
  }
} 