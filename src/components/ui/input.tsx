import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="input-wrapper">
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn('input', className)}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
