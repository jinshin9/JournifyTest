'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { useToast } from '@/hooks/use-toast'
import { cn, getTagIcon, getTagColor } from '@/lib/utils'
import { 
  Plus,
  Edit3,
  Trash2,
  Folder,
  Users,
  Hash,
  MapPin,
  Star,
  ChevronDown,
  ChevronRight,
  X,
  Save,
  FolderOpen,
  User,
  Hash as HashIcon,
  MapPin as MapPinIcon,
  Star as StarIcon
} from 'lucide-react'
import { Tag, TagType } from '@/types'

const tagTypeConfig = {
  folder: {
    label: 'Folder',
    icon: Folder,
    color: '#3B82F6',
    description: 'Organize entries into categories'
  },
  person: {
    label: 'People',
    icon: Users,
    color: '#10B981',
    description: 'Tag entries with people'
  },
  hashtag: {
    label: 'Hashtag',
    icon: Hash,
    color: '#8B5CF6',
    description: 'Add topics and themes'
  },
  location: {
    label: 'Location',
    icon: MapPin,
    color: '#F59E0B',
    description: 'Tag entries with places'
  },
  highlight: {
    label: 'Highlights',
    icon: Star,
    color: '#EF4444',
    description: 'Mark important moments'
  }
}

export function TagManager() {
  const { tags, addTag, updateTag, deleteTag } = useAppStore()
  const { toast } = useToast()
  
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newTag, setNewTag] = useState<Partial<Tag>>({})
  const [showNewTagForm, setShowNewTagForm] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedType, setSelectedType] = useState<TagType>('hashtag')

  const handleCreateTag = () => {
    if (!newTag.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a tag name.",
        variant: "destructive",
      })
      return
    }

    const tag: Tag = {
      id: Date.now().toString(),
      name: newTag.name.trim(),
      type: selectedType,
      color: newTag.color || tagTypeConfig[selectedType].color,
      description: newTag.description?.trim(),
      parentId: newTag.parentId,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    }

    addTag(tag)
    setNewTag({})
    setShowNewTagForm(false)
    
    toast({
      title: "Tag Created",
      description: `${tagTypeConfig[selectedType].label} tag "${tag.name}" has been created.`,
    })
  }

  const handleUpdateTag = () => {
    if (!editingTag?.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a tag name.",
        variant: "destructive",
      })
      return
    }

    const updatedTag: Tag = {
      ...editingTag,
      name: editingTag.name.trim(),
      description: editingTag.description?.trim(),
      updatedAt: new Date()
    }

    updateTag(editingTag.id, updatedTag)
    setEditingTag(null)
    
    toast({
      title: "Tag Updated",
      description: `Tag "${updatedTag.name}" has been updated.`,
    })
  }

  const handleDeleteTag = (tag: Tag) => {
    if (confirm(`Are you sure you want to delete the tag "${tag.name}"? This will remove it from all entries.`)) {
      deleteTag(tag.id)
      toast({
        title: "Tag Deleted",
        description: `Tag "${tag.name}" has been deleted.`,
      })
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const getTagsByType = (type: TagType) => {
    return tags.filter(tag => tag.type === type)
  }

  const getFolderTags = () => {
    return tags.filter(tag => tag.type === 'folder')
  }

  const getChildTags = (parentId: string) => {
    return tags.filter(tag => tag.parentId === parentId)
  }

  const renderTagItem = (tag: Tag, isChild = false) => (
    <div key={tag.id} className={cn(
      "flex items-center justify-between p-2 rounded-md border",
      isChild ? "ml-6 bg-muted/30" : "bg-background"
    )}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: tag.color || tagTypeConfig[tag.type].color }}
        />
        <span className="truncate font-medium">{tag.name}</span>
        {tag.description && (
          <span className="text-xs text-muted-foreground truncate hidden sm:block">
            - {tag.description}
          </span>
        )}
        {tag.usageCount !== undefined && tag.usageCount > 0 && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {tag.usageCount}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {tag.type === 'folder' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder(tag.id)}
            className="h-6 w-6 p-0"
          >
            {expandedFolders.has(tag.id) ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingTag(tag)}
          className="h-6 w-6 p-0"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteTag(tag)}
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )

  const renderTagSection = (type: TagType) => {
    const typeTags = getTagsByType(type)
    const config = tagTypeConfig[type]
    const IconComponent = config.icon

    return (
      <Card key={type} className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconComponent className="h-5 w-5" style={{ color: config.color }} />
            {config.label}
            <span className="text-sm text-muted-foreground font-normal">
              ({typeTags.length})
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {typeTags.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No {config.label.toLowerCase()} tags yet.</p>
          ) : (
            typeTags.map(tag => {
              if (type === 'folder') {
                const children = getChildTags(tag.id)
                return (
                  <div key={tag.id}>
                    {renderTagItem(tag)}
                    {expandedFolders.has(tag.id) && children.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {children.map(childTag => renderTagItem(childTag, true))}
                      </div>
                    )}
                  </div>
                )
              }
              return renderTagItem(tag)
            })
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tag Manager</h1>
          <p className="text-muted-foreground mt-2">
            Organize and manage your journal tags by type
          </p>
        </div>
        
        <Button onClick={() => setShowNewTagForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Tag
        </Button>
      </div>

      {/* New Tag Form */}
      {showNewTagForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Create New Tag
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewTagForm(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tag Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TagType)}
                  className="w-full p-2 border rounded-md"
                >
                  {Object.entries(tagTypeConfig).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  placeholder="Enter tag name"
                  value={newTag.name || ''}
                  onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Color (optional)</label>
                <Input
                  type="color"
                  value={newTag.color || tagTypeConfig[selectedType].color}
                  onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                  className="h-10"
                />
              </div>
              
              {selectedType === 'folder' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Parent Folder (optional)</label>
                  <select
                    value={newTag.parentId || ''}
                    onChange={(e) => setNewTag(prev => ({ ...prev, parentId: e.target.value || undefined }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">No parent (root folder)</option>
                    {getFolderTags().map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description (optional)</label>
              <Input
                placeholder="Describe what this tag is for"
                value={newTag.description || ''}
                onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateTag} className="gap-2">
                <Save className="h-4 w-4" />
                Create Tag
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewTagForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Tag Form */}
      {editingTag && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Edit Tag: {editingTag.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingTag(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  placeholder="Enter tag name"
                  value={editingTag.name || ''}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <Input
                  type="color"
                  value={editingTag.color || tagTypeConfig[editingTag.type].color}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, color: e.target.value } : null)}
                  className="h-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                placeholder="Describe what this tag is for"
                value={editingTag.description || ''}
                                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleUpdateTag} className="gap-2">
                <Save className="h-4 w-4" />
                Update Tag
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingTag(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tag Sections */}
      <div className="space-y-6">
        {Object.keys(tagTypeConfig).map(type => renderTagSection(type as TagType))}
      </div>
    </div>
  )
} 