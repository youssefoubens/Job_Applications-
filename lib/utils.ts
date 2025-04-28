import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  // Less than an hour
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }
  
  // Less than a month
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }
  
  // Less than a year
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`
  }
  
  // More than a year
  const years = Math.floor(months / 12)
  return `${years} ${years === 1 ? 'year' : 'years'}`
}
