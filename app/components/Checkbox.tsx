import React, { type JSX } from 'react'

type Props = Omit<JSX.IntrinsicElements['input'], 'type'> & {
	label: React.ReactNode
}

export const Checkbox: React.FC<Props> = ({ label, ...props }) => {
	return (
		<label className="inline-flex gap-2 items-center">
			<input type="checkbox" {...props} />
			{label}
		</label>
	)
}
