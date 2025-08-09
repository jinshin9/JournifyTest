'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { sidebarOpen, setSidebarOpen, theme, initializeSampleData } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize sample data on first load
    initializeSampleData()
  }, [initializeSampleData])

  if (!mounted) {
    return null
  }

  return (
    <div className={cn(
      "min-h-screen bg-background",
      theme === 'dark' ? 'dark' : ''
    )}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden lg:ml-64 xl:ml-72">
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </div>
  )
} 