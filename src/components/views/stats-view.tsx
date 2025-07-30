'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFilteredEntries, useTags } from '@/store'
import { BarChart3, Calendar, TrendingUp, Target, Award, BookOpen, Star, Tag } from 'lucide-react'

export function StatsView() {
  const entries = useFilteredEntries()
  const tags = useTags()

  const stats = useMemo(() => {
    const totalEntries = entries.length
    const totalWords = entries.reduce((sum, entry) => {
      return sum + entry.content.split(' ').length
    }, 0)
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
    
    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    let currentDate = new Date(today)
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.createdAt)
      const diffTime = Math.abs(currentDate.getTime() - entryDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) {
        currentStreak++
        currentDate = entryDate
      } else {
        break
      }
    }
    
    // Mood distribution
    const moodDistribution = entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    // Most used tags
    const tagUsage = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc[tag.id] = (acc[tag.id] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)
    
    const mostUsedTags = Object.entries(tagUsage)
      .map(([tagId, count]) => {
        const tag = tags.find(t => t.id === tagId)
        return { tag, count }
      })
      .filter(item => item.tag)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // Highlighted entries
    const highlightedEntries = entries.filter(entry => entry.isHighlight).length
    
    return {
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      currentStreak,
      moodDistribution,
      mostUsedTags,
      highlightedEntries
    }
  }, [entries, tags])

  const getMoodIcon = (mood: string) => {
    const moodIcons: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      excited: '🤩',
      calm: '😌',
      angry: '😠',
      neutral: '😐',
    }
    return moodIcons[mood] || moodIcons.neutral
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Writing Stats</h1>
        <p className="text-muted-foreground mt-1">
          Insights and analytics about your journaling journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              Journal entries created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Words written
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Words/Entry</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWordsPerEntry}</div>
            <p className="text-xs text-muted-foreground">
              Average per entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.moodDistribution).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.moodDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMoodIcon(mood)}</span>
                        <span className="capitalize">{mood}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${(count / stats.totalEntries) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No mood data available</p>
                <p className="text-sm">Start tracking your mood in entries</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Used Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Most Used Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostUsedTags.length > 0 ? (
              <div className="space-y-3">
                {stats.mostUsedTags.map(({ tag, count }) => (
                  <div key={tag!.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>{tag!.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(count / stats.totalEntries) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tags used yet</p>
                <p className="text-sm">Add tags to your entries to see usage stats</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {stats.highlightedEntries}
              </div>
              <p className="text-muted-foreground">
                Highlighted entries
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.highlightedEntries > 0 
                  ? `${Math.round((stats.highlightedEntries / stats.totalEntries) * 100)}% of your entries are highlights`
                  : 'Start highlighting your favorite entries'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Writing Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Writing Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium mb-1">Your Writing Pattern</div>
                <p className="text-muted-foreground">
                  {stats.averageWordsPerEntry > 100 
                    ? 'You tend to write detailed entries'
                    : stats.averageWordsPerEntry > 50
                    ? 'You write moderate-length entries'
                    : 'You prefer concise entries'
                  }
                </p>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">Consistency</div>
                <p className="text-muted-foreground">
                  {stats.currentStreak > 7 
                    ? 'Excellent! You\'re very consistent with your journaling'
                    : stats.currentStreak > 3
                    ? 'Good progress! Keep up the momentum'
                    : 'Getting started! Every entry counts'
                  }
                </p>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">Recommendation</div>
                <p className="text-muted-foreground">
                  {stats.totalEntries < 10 
                    ? 'Try writing daily to build a habit'
                    : stats.currentStreak < 3
                    ? 'Focus on consistency over quantity'
                    : 'Consider exploring different writing prompts'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 