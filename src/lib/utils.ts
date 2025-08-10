import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  // Handle both Date objects and date strings
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function formatTime(date: Date | string): string {
  // Handle both Date objects and date strings
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid time'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function getRelativeTime(date: Date | string): string {
  // Handle both Date objects and date strings
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }
  
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return formatDate(dateObj)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getMoodColor(mood: string): string {
  const moodColors: Record<string, string> = {
    happy: 'text-yellow-500',
    sad: 'text-blue-500',
    excited: 'text-orange-500',
    calm: 'text-green-500',
    angry: 'text-red-500',
    neutral: 'text-gray-500',
  }
  return moodColors[mood] || moodColors.neutral
}

export function getMoodIcon(mood: string): string {
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

export function getTagIcon(tagType: string): string {
  const tagIcons: Record<string, string> = {
    folder: '📁',
    person: '👤',
    hashtag: '#',
    location: '📍',
    highlight: '⭐',
  }
  return tagIcons[tagType] || '🏷️'
}

export function getTagColor(tagType: string): string {
  const tagColors: Record<string, string> = {
    folder: '#3B82F6',
    person: '#10B981',
    hashtag: '#8B5CF6',
    location: '#F59E0B',
    highlight: '#EF4444',
  }
  return tagColors[tagType] || '#6B7280'
}

export function getTagDisplayInfo(tagType: string) {
  return {
    icon: getTagIcon(tagType),
    color: getTagColor(tagType),
    label: tagType.charAt(0).toUpperCase() + tagType.slice(1)
  }
} 