import React, { createContext, useContext, useId } from 'react'
import { twMerge } from 'tailwind-merge'

const ToggleContext = createContext<{ id: string; open: boolean; setOpen: (open: boolean) => void } | undefined>(
  undefined,
)

type RootProps = React.PropsWithChildren<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>

const ToggleRoot: React.FC<RootProps> = ({ children, open, onOpenChange: setOpen }) => {
  const id = useId()

  return <ToggleContext.Provider value={{ id, open, setOpen }}>{children}</ToggleContext.Provider>
}

type ButtonProps = {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

const ToggleButton: React.FC<ButtonProps> = ({ children, className, disabled }) => {
  const { id, open, setOpen } = useContext(ToggleContext)!

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`toggle-${id}`}
      onClick={() => setOpen(!open)}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

type ContentProps = React.PropsWithChildren<{
  className?: string
}>

const ToggleContent: React.FC<ContentProps> = ({ children, className }) => {
  const { id, open } = useContext(ToggleContext)!

  return (
    <div
      aria-hidden={!open}
      id={`toggle-${id}`}
      className={twMerge(
        className,
        `
      aria-[hidden=true]:collapse-fallback
    `,
      )}
    >
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
