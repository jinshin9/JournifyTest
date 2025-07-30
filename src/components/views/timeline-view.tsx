'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFilteredEntries, useAppStore } from '@/store'
import { cn, formatDate, getRelativeTime, getMoodIcon, getMoodColor } from '@/lib/utils'
import { 
  Plus, 
  Star, 
  Star as StarFilled,
  Edit3,
  Trash2,
  Tag,
  Image,
  Mic,
  Calendar,
  Clock
} from 'lucide-react'

export function TimelineView() {
  const entries = useFilteredEntries()
  const { setCurrentEntry, updateEntry, deleteEntry } = useAppStore()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)

  const handleNewEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
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

  const getEntryPreview = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground mt-1">
            Your journal entries in chronological order
          </p>
        </div>
        <Button onClick={handleNewEntry} className="gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {/* Entries */}
      <div className="space-y-6">
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your journaling journey by creating your first entry
              </p>
              <Button onClick={handleNewEntry} className="gap-2">
                <Plus className="h-4 w-4" />
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card 
              key={entry.id} 
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                entry.isHighlight && "ring-2 ring-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-950/20"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(entry.createdAt)}
                      </span>
                      {entry.mood && (
                        <span className={cn("text-lg", getMoodColor(entry.mood))}>
                          {getMoodIcon(entry.mood)}
                        </span>
                      )}
                    </div>
                    {entry.title && (
                      <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleHighlight(entry.id, entry.isHighlight)}
                      className="h-8 w-8"
                    >
                      {entry.isHighlight ? (
                        <StarFilled className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEntry(entry)}
                      className="h-8 w-8"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-foreground leading-relaxed mb-4">
                  {getEntryPreview(entry.content)}
                </p>
                
                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
                      >
                        <Tag className="h-3 w-3" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Attachments indicator */}
                {entry.attachments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="h-4 w-4" />
                    <span>{entry.attachments.length} attachment{entry.attachments.length > 1 ? 's' : ''}</span>
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