import React, { createContext, useContext, useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePersistedState } from '~/hooks/usePersistedState'

const ToggleContext = createContext<
	{ id: string; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> } | undefined
>(undefined)

type RootProps = React.PropsWithChildren<{
	storage?: string
}>

const ToggleRoot: React.FC<RootProps> = ({ children, storage = genId() }) => {
	const id = useId()
	const [open, setOpen] = usePersistedState(storage, true)

	return <ToggleContext.Provider value={{ id, open, setOpen }}>{children}</ToggleContext.Provider>
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
		<div aria-hidden={!open} id={`toggle-${id}`} className={twMerge(className, 'aria-[hidden=true]:collapse-fallback')}>
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

function genId() {
	return `${Math.random().toString(36).slice(2, 9)}`
}
