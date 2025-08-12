import { Button as AriaButton } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

type AriaButtonProps = React.ComponentProps<typeof AriaButton>

type Props = React.PropsWithChildren<{
  variant: 'primary' | 'secondary'
  className?: string
}> &
  Omit<AriaButtonProps, 'className'>

const variants = {
  primary: [
    'bg-pink-600 text-white rounded-full px-4 py-2',
    'not-[:disabled]:hover:bg-pink-700',
    'focus-visible:ring-pink-400 focus-visible:ring-3 focus-visible:ring-offset-black focus-visible:ring-offset-2 focus:outline-none',
    'disabled:text-zinc-300 disabled:bg-pink-900 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'bg-gray-500 text-white px-4 py-2 rounded-full',
    'not-[:disabled]:hover:bg-gray-600',
    'focus-visible:ring-gray-400 focus-visible:ring-3 focus-visible:ring-offset-black focus-visible:ring-offset-2 focus:outline-none',
    'disabled:text-zinc-400 disabled:bg-gray-700 disabled:cursor-not-allowed',
  ].join(' '),
}

export const Button: React.FC<Props> = ({ variant, className, ...buttonProps }) => {
  return <AriaButton className={twMerge(variants[variant], className)} {...buttonProps} />
}
