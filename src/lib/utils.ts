import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type DateTimeFormatOpts = Intl.DateTimeFormatOptions;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (
  date: Date,
  options: DateTimeFormatOpts = {
    year: 'numeric',
    month: 'long', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  }
) => {
  return new Intl.DateTimeFormat('en-US', options).format(date); 
}; 
