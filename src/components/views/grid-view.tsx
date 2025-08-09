'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFilteredEntries, useEntries, useAppStore } from '@/store'
import { cn, formatDate, getMoodIcon, getMoodColor } from '@/lib/utils'
import { 
  Grid3X3, 
  Plus, 
  Star, 
  Star as StarFilled,
  Edit3,
  Trash2,
  Tag,
  Image,
  Calendar
} from 'lucide-react'

export function GridView() {
  const entries = useFilteredEntries()
  const allEntries = useEntries()
  const { setCurrentEntry, updateEntry, deleteEntry, setSearchFilters } = useAppStore()
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium')

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

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry)
  }

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId)
    }
  }

  const toggleHighlight = (entryId: string, currentHighlight: boolean) => {
    updateEntry(entryId, { isHighlight: !currentHighlight })
  }

  const getGridCols = () => {
    switch (gridSize) {
      case 'small': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'
      case 'medium': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'large': return 'grid-cols-1 lg:grid-cols-2'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  const clearFilters = () => {
    setSearchFilters({})
  }

  const getEntryPreview = (content: string, size: string) => {
    const maxLength = size === 'small' ? 50 : size === 'medium' ? 100 : 200
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Grid View</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Visual grid layout of your journal entries
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Grid size controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={gridSize === 'small' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGridSize('small')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={gridSize === 'medium' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGridSize('medium')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={gridSize === 'large' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGridSize('large')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Button onClick={handleNewEntry} className="gap-1 sm:gap-2 text-sm sm:text-base">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Entry</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className={cn("grid gap-3 sm:gap-4", getGridCols())}>
        {entries.length === 0 ? (
          <div className="col-span-full">
            <Card className="text-center py-8 sm:py-12">
              <CardContent className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Grid3X3 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {allEntries.length === 0 ? "No entries yet" : "No entries match your filters"}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {allEntries.length === 0 
                    ? "Start your journaling journey by creating your first entry"
                    : "Try clearing your search filters to see all entries"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                  <Button onClick={handleNewEntry} className="gap-1 sm:gap-2 text-sm sm:text-base">
                    <Plus className="h-4 w-4" />
                    {allEntries.length === 0 ? "Write Your First Entry" : "Create New Entry"}
                  </Button>
                  {allEntries.length > 0 && (
                    <Button onClick={clearFilters} variant="outline" className="gap-1 sm:gap-2 text-sm sm:text-base">
                      Show All Entries
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          entries.map((entry) => (
            <Card 
              key={entry.id} 
              className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer",
                entry.isHighlight && "ring-2 ring-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-950/20",
                gridSize === 'small' && "h-32",
                gridSize === 'medium' && "h-48",
                gridSize === 'large' && "h-64"
              )}
              onClick={() => handleEditEntry(entry)}
            >
              <CardHeader className={cn(
                "pb-2",
                gridSize === 'small' && "p-3",
                gridSize === 'medium' && "p-4",
                gridSize === 'large' && "p-6"
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-muted-foreground",
                        gridSize === 'small' && "text-xs",
                        gridSize === 'medium' && "text-sm",
                        gridSize === 'large' && "text-sm"
                      )}>
                        {formatDate(entry.createdAt)}
                      </span>
                      {entry.mood && (
                        <span className={cn("text-lg", getMoodColor(entry.mood))}>
                          {getMoodIcon(entry.mood)}
                        </span>
                      )}
                    </div>
                    {entry.title && (
                      <CardTitle className={cn(
                        "mb-2 truncate",
                        gridSize === 'small' && "text-sm",
                        gridSize === 'medium' && "text-base",
                        gridSize === 'large' && "text-lg"
                      )}>
                        {entry.title}
                      </CardTitle>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleHighlight(entry.id, entry.isHighlight)
                      }}
                      className="h-6 w-6"
                    >
                      {entry.isHighlight ? (
                        <StarFilled className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteEntry(entry.id)
                      }}
                      className="h-6 w-6 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className={cn(
                "pt-0",
                gridSize === 'small' && "p-3",
                gridSize === 'medium' && "p-4",
                gridSize === 'large' && "p-6"
              )}>
                <p className={cn(
                  "text-foreground leading-relaxed mb-3",
                  gridSize === 'small' && "text-xs line-clamp-3",
                  gridSize === 'medium' && "text-sm line-clamp-4",
                  gridSize === 'large' && "text-sm line-clamp-6"
                )}>
                  {getEntryPreview(entry.content, gridSize)}
                </p>
                
                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.slice(0, gridSize === 'small' ? 1 : 2).map((tag) => (
                      <span
                        key={tag.id}
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-md",
                          gridSize === 'small' && "text-xs"
                        )}
                      >
                        <Tag className="h-3 w-3" />
                        {tag.name}
                      </span>
                    ))}
                    {entry.tags.length > (gridSize === 'small' ? 1 : 2) && (
                      <span className="text-xs text-muted-foreground">
                        +{entry.tags.length - (gridSize === 'small' ? 1 : 2)}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Attachments indicator */}
                {entry.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Image className="h-3 w-3" />
                    <span>{entry.attachments.length}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 