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
		<label className={twMerge('inline-flex gap-2 items-center', className)}>
			<input {...props} type="checkbox" onChange={handleChange} />
			{children}
		</label>
	)
}
