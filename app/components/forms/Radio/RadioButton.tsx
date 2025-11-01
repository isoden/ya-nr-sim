import React, { useCallback, useRef, type JSX } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Merge } from 'type-fest'

type Props = Merge<
  Omit<JSX.IntrinsicElements['input'], 'type'>,
  {
    onChange?: (checked: boolean) => void
  }
>

export const RadioButton: React.FC<Props> = ({ children, onChange, className, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked),
    [onChange],
  )

  return (
    <label className={twMerge('inline-flex items-center gap-1', className)}>
      <input
        ref={ref}
        {...props}
        type="radio"
        onChange={handleChange}
        className="size-4 accent-accent-light"
      />
      {children}
    </label>
  )
}
