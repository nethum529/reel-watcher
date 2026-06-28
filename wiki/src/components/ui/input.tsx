import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// shadcn Input, re-themed to brutalism (DESIGN §8.4): SQUARE, hard 2px
// border-input, flat --card fill. The border is already jet/hard at rest; focus
// adds the global :focus-visible ring (index.css) rather than recoloring it.
export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type ?? 'text'}
      className={cn(
        'h-11 w-full border-2 border-input bg-card px-3 font-sans text-label text-foreground',
        'placeholder:text-placeholder',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
