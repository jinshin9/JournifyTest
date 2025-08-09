'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { 
  Home,
  Calendar,
  Grid3X3,
  BarChart3,
  BookOpen,
  Star,
  Tag,
  Plus,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Timeline',
    icon: Home,
    view: 'timeline' as const,
    description: 'View your journal entries in chronological order'
  },
  {
    name: 'Calendar',
    icon: Calendar,
    view: 'calendar' as const,
    description: 'Browse entries by date'
  },
  {
    name: 'Grid',
    icon: Grid3X3,
    view: 'grid' as const,
    description: 'Visual grid layout of your entries'
  },
  {
    name: 'Stats',
    icon: BarChart3,
    view: 'stats' as const,
    description: 'Writing insights and analytics'
  }
]

const quickActions = [
  {
    name: 'New Entry',
    icon: Plus,
    action: 'new-entry',
    description: 'Create a new journal entry'
  },
  {
    name: 'Highlights',
    icon: Star,
    action: 'highlights',
    description: 'View your highlighted entries'
  },
  {
    name: 'Tags',
    icon: Tag,
    action: 'tags',
    description: 'Manage your tags and categories'
  },
  {
    name: 'AI Prompts',
    icon: Sparkles,
    action: 'ai-prompts',
    description: 'Get AI-generated writing prompts'
  }
]

export function Sidebar() {
  const { 
    sidebarOpen, 
    currentView, 
    setCurrentView,
    theme 
  } = useAppStore()
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const handleNavigationClick = (view: typeof currentView) => {
    setCurrentView(view)
  }

  const handleQuickAction = (action: string) => {
    setActiveAction(action)
    // Handle different actions here
    console.log('Quick action:', action)
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 sm:w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full",
      "bg-card border-r"
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Journify
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Views
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant={currentView === item.view ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        currentView === item.view && "bg-secondary text-secondary-foreground"
                      )}
                      onClick={() => handleNavigationClick(item.view)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                {quickActions.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10"
                      onClick={() => handleQuickAction(item.action)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Writing Streak */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                7 days
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep it up! You're on fire 🔥
              </p>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
} 