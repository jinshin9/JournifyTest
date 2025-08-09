'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun, 
  Menu,
  User,
  LogOut
} from 'lucide-react'

export function Header() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    theme, 
    setTheme,
    searchFilters,
    setSearchFilters 
  } = useAppStore()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setSearchFilters({ ...searchFilters, searchTerm: value })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Left side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">J</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Journify
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 sm:pl-10 text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 sm:h-9 sm:w-9"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div className="flex items-center gap-2 ml-1 sm:ml-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 