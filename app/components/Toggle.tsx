import React, { createContext, useCallback, useContext, useId, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const ToggleContext = createContext<
	{ id: string; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> } | undefined
>(undefined)

type RootProps = React.PropsWithChildren<{
	storage?: string
}>

const ToggleRoot: React.FC<RootProps> = ({ children, storage }) => {
	const id = useId()
	const [open, setOpen] = useState(() => {
		const defaultValue = false

		if (storage) {
			try {
				const storedValue = localStorage.getItem(`toggle.storage.${storage}`)
				return storedValue ? (JSON.parse(storedValue) as boolean) : defaultValue
			} catch {
				return defaultValue
			}
		}

		return defaultValue
	})

	const setOpenWithStorage = useCallback(
		(value: React.SetStateAction<boolean>) => {
			setOpen(value)
			if (storage) {
				try {
					localStorage.setItem(`toggle.storage.${storage}`, JSON.stringify(value))
				} catch {}
			}
		},
		[storage],
	)

	return <ToggleContext.Provider value={{ id, open, setOpen: setOpenWithStorage }}>{children}</ToggleContext.Provider>
}

type ButtonProps = {
	children?: React.ReactNode | ((props: { open: boolean }) => React.ReactNode)
	className?: string
}

const ToggleButton: React.FC<ButtonProps> = ({ children, className }) => {
	const { id, open, setOpen } = useContext(ToggleContext)!

	return (
		<button
			type="button"
			aria-expanded={open}
			aria-controls={`toggle-${id}`}
			onClick={() => setOpen(!open)}
			className={className}
		>
			{typeof children === 'function' ? children({ open }) : children}
		</button>
	)
}

type ContentProps = React.PropsWithChildren<{
	className?: string
}>

const ToggleContent: React.FC<ContentProps> = ({ children, className }) => {
	const { id, open } = useContext(ToggleContext)!

	return (
		<div aria-hidden={!open} id={`toggle-${id}`} className={twMerge(className, 'aria-[hidden=true]:hidden')}>
			{children}
		</div>
	)
}

export const Toggle = Object.assign(
	{},
	{
		Root: ToggleRoot,
		Button: ToggleButton,
		Content: ToggleContent,
	},
)
