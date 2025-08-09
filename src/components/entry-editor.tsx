'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { useToast } from '@/hooks/use-toast'
import { cn, formatDate, getMoodIcon, getMoodColor } from '@/lib/utils'
import { 
  ArrowLeft,
  Save,
  Star,
  Star as StarFilled,
  Mic,
  Image,
  Tag,
  Sparkles,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import { Mood, Tag as TagType } from '@/types'

const moods: { value: Mood; label: string; icon: string }[] = [
  { value: 'happy', label: 'Happy', icon: '😊' },
  { value: 'excited', label: 'Excited', icon: '🤩' },
  { value: 'calm', label: 'Calm', icon: '😌' },
  { value: 'neutral', label: 'Neutral', icon: '😐' },
  { value: 'sad', label: 'Sad', icon: '😢' },
  { value: 'angry', label: 'Angry', icon: '😠' },
]

const aiPrompts = [
  "What's the highlight of your day?",
  "What are you grateful for today?",
  "What's something you learned recently?",
  "Describe a challenge you're facing and how you're handling it",
  "What are your goals for this week?",
  "Reflect on a recent conversation that impacted you",
  "What's something you're looking forward to?",
  "Describe a moment that made you smile today",
]

export function EntryEditor() {
  const { currentEntry, updateEntry, setCurrentEntry, addEntry, tags } = useAppStore()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>()
  const [selectedTags, setSelectedTags] = useState<TagType[]>([])
  const [isHighlight, setIsHighlight] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)

  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title || '')
      setContent(currentEntry.content)
      setSelectedMood(currentEntry.mood)
      setSelectedTags(currentEntry.tags)
      setIsHighlight(currentEntry.isHighlight)
    }
  }, [currentEntry])

  const handleSave = () => {
    if (!currentEntry) return

    // Validate that the entry has content
    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please add some content to your entry before saving.",
        variant: "destructive",
      })
      return
    }

    const updatedEntry = {
      ...currentEntry,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      isHighlight,
      updatedAt: new Date(),
    }

    if (currentEntry.id) {
      updateEntry(currentEntry.id, updatedEntry)
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been successfully updated.",
      })
    } else {
      addEntry(updatedEntry)
      toast({
        title: "Entry Saved",
        description: "Your journal entry has been successfully saved.",
      })
    }

    setCurrentEntry(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') {
          e.preventDefault()
          handleSave()
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          handleCancel()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [content, title, selectedMood, selectedTags, isHighlight])

  const handleCancel = () => {
    setCurrentEntry(null)
  }

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(selectedMood === mood ? undefined : mood)
  }

  const handleTagToggle = (tag: TagType) => {
    setSelectedTags(prev => 
      prev.find(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    )
  }

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: TagType = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        type: 'hashtag',
        userId: 'user-1',
        createdAt: new Date(),
      }
      setSelectedTags(prev => [...prev, newTag])
      setNewTagName('')
      setShowTagInput(false)
    }
  }

  const handlePromptSelect = (prompt: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt)
    setShowPrompts(false)
  }

  const startRecording = () => {
    setIsRecording(true)
    // In a real app, this would integrate with Web Speech API
    setTimeout(() => {
      setIsRecording(false)
      // Simulate speech-to-text result
      setContent(prev => prev + (prev ? '\n\n' : '') + 'This is a simulated speech-to-text result.')
    }, 3000)
  }

  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    console.log('Image upload functionality would go here')
  }

  if (!currentEntry) return null

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            title="Cancel (Esc)"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {currentEntry.id ? 'Edit Entry' : 'New Entry'}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(currentEntry.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsHighlight(!isHighlight)}
            className={isHighlight ? 'text-yellow-500' : ''}
          >
            {isHighlight ? (
              <StarFilled className="h-5 w-5 fill-yellow-500" />
            ) : (
              <Star className="h-5 w-5" />
            )}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
            <span className="text-xs opacity-60">⌘S</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Title */}
              <div className="mb-6">
                <Input
                  placeholder="Entry title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <textarea
                  placeholder="Start writing your journal entry..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[400px] resize-none border-none outline-none text-foreground bg-transparent text-base leading-relaxed"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startRecording}
                  disabled={isRecording}
                  className="gap-2"
                >
                  <Mic className="h-4 w-4" />
                  {isRecording ? 'Recording...' : 'Voice'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImageUpload}
                  className="gap-2"
                >
                  <Image className="h-4 w-4" />
                  Image
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrompts(!showPrompts)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Prompts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-12 justify-start gap-2"
                    onClick={() => handleMoodSelect(mood.value)}
                  >
                    <span className="text-lg">{mood.icon}</span>
                    <span className="text-sm">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Tags
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagInput(!showTagInput)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showTagInput && (
                <div className="mb-4 flex gap-2">
                  <Input
                    placeholder="New tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTagInput(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTags.find(t => t.id === tag.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </Button>
                ))}
                
                {selectedTags.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Selected:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md"
                        >
                          {tag.name}
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Prompts */}
          {showPrompts && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handlePromptSelect(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 