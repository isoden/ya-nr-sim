import React, { useCallback, type JSX } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Merge } from 'type-fest'

type Props = Merge<
  Omit<JSX.IntrinsicElements['input'], 'type'>,
  {
    onChange?: (checked: boolean) => void
  }
>

export const Checkbox: React.FC<Props> = ({ children, onChange, className, ...props }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked),
    [onChange],
  )

  return (
    <label className={twMerge('inline-flex items-center gap-2', className)}>
      <input
        {...props}
        type="checkbox"
        onChange={handleChange}
        className="size-3.5 accent-accent-light"
      />
      {children}
    </label>
  )
}
