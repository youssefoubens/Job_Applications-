import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 * @param inputs Class names or conditional class objects
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a readable format
 * @param dateString ISO date string
 * @returns Formatted date (e.g., "January 1, 2023")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Creates a delay promise for async operations
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generates a unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Truncates text with an ellipsis if it exceeds the max length
 * @param text Input text
 * @param maxLength Maximum allowed length
 * @returns Truncated text if needed
 */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

/**
 * Converts a string to title case
 * @param str Input string
 * @returns Title-cased string
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )
}

/**
 * Checks if a value is empty (null, undefined, empty string/array/object)
 * @param value Any value
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Formats a date to show how long ago it occurred (e.g., "2 days ago")
 * @param date Date object or string
 * @returns Formatted relative time string
 */
export function formatDistanceToNow(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }
  
  // Calculate the appropriate interval
  if (seconds < 60) return 'just now'
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''}`
    }
  }
  
  return 'just now'
}