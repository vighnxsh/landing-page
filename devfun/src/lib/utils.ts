import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind and conditional classes.
 * Usage: cn('p-2', condition && 'bg-red-500', 'text-center')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
