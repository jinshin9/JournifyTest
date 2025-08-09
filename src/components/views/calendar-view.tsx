'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFilteredEntries, useEntries, useAppStore } from '@/store'
import { formatDate, getMoodIcon, getMoodColor } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export function CalendarView() {
  const entries = useFilteredEntries()
  const allEntries = useEntries()
  const { setCurrentEntry, setSearchFilters } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleNewEntry = () => {
    const newEntry = {
      userId: 'user-1',
      title: '',
      content: '',
      mood: undefined,
      tags: [],
      isHighlight: false,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setCurrentEntry(newEntry)
  }

  const clearFilters = () => {
    setSearchFilters({})
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const renderCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border"></div>)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEntries = getEntriesForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      
      days.push(
        <div
          key={day}
          className={`
            h-20 sm:h-24 border border-border p-1 sm:p-2 cursor-pointer transition-colors
            ${isToday ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
            hover:bg-muted/50
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              {day}
            </span>
            {dayEntries.length > 0 && (
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-1 py-0.5">
                {dayEntries.length}
              </span>
            )}
          </div>
          
          {dayEntries.slice(0, 2).map((entry, index) => (
            <div 
              key={entry.id} 
              className="text-xs truncate mb-1 cursor-pointer hover:bg-muted/30 px-1 rounded"
              onClick={(e) => {
                e.stopPropagation()
                handleEditEntry(entry)
              }}
            >
              {entry.mood && (
                <span className={getMoodColor(entry.mood)}>
                  {getMoodIcon(entry.mood)}
                </span>
              )}
              <span className="ml-1 truncate">
                {entry.title || entry.content.substring(0, 15)}
              </span>
            </div>
          ))}
          
          {dayEntries.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{dayEntries.length - 2} more
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : []

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Browse your journal entries by date
          </p>
        </div>
        <Button onClick={handleNewEntry} className="gap-1 sm:gap-2 text-sm sm:text-base">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Entry</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">{monthName}</CardTitle>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty state when no entries exist */}
        {allEntries.length === 0 && (
          <div className="xl:col-span-3">
            <Card className="text-center py-8 sm:py-12">
              <CardContent className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">No entries yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Start your journaling journey by creating your first entry
                </p>
                <Button onClick={handleNewEntry} className="gap-1 sm:gap-2 text-sm sm:text-base">
                  <Plus className="h-4 w-4" />
                  Write Your First Entry
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Selected date entries */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? formatDate(selectedDate) : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateEntries.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEntries.map(entry => (
                      <div 
                        key={entry.id} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleEditEntry(entry)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {entry.mood && (
                            <span className={getMoodColor(entry.mood)}>
                              {getMoodIcon(entry.mood)}
                            </span>
                          )}
                          <span className="text-sm font-medium">
                            {entry.title || 'Untitled'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No entries for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Click on a date to view entries</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 