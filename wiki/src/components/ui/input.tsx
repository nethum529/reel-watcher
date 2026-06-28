import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// shadcn Input, re-themed (DESIGN §6.4). Focus ring via global :focus-visible;
// border lifts to primary on focus, to border-strong on hover.
export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type ?? 'text'}
      className={cn(
        'h-11 w-full rounded-lg border border-input bg-card px-3 font-sans text-sm text-foreground transition-colors',
        'placeholder:text-placeholder hover:border-border-strong focus-visible:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
