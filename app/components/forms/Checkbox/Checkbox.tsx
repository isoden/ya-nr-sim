import React, { useCallback, useEffect, useRef, type JSX } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Merge } from 'type-fest'

type Props = Merge<
  Omit<JSX.IntrinsicElements['input'], 'type'>,
  {
    indeterminate?: boolean
    onChange?: (checked: boolean) => void
  }
>

export const Checkbox: React.FC<Props> = ({ children, onChange, className, indeterminate = false, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked),
    [onChange],
  )

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <label className={twMerge('inline-flex items-center gap-2', className)}>
      <input
        ref={ref}
        {...props}
        type="checkbox"
        onChange={handleChange}
        className="size-3.5 accent-accent-light"
      />
      {children}
    </label>
  )
}
