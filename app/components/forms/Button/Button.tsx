import { Button as AriaButton } from 'react-aria-components'
import { cn, tv } from 'tailwind-variants'

type AriaButtonProps = React.ComponentProps<typeof AriaButton>

type Props = React.PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}>
& Omit<AriaButtonProps, 'className'>

const button = tv({
  base: `
    rounded-sm text-white
    focus:ring-3 focus:ring-offset-2 focus:ring-offset-black focus:outline-none
  `,
  variants: {
    variant: {
      primary: `
        bg-pink-600
        not-disabled:hover:bg-pink-700
        focus:ring-pink-400
        disabled:bg-pink-900 disabled:text-zinc-300
      `,
      secondary: `
        bg-gray-500
        not-disabled:hover:bg-gray-600
        focus:ring-gray-400
        disabled:bg-gray-700 disabled:text-zinc-400
      `,
      outline: `
        border border-gray-500
        not-disabled:hover:border-gray-600
        focus:ring-gray-400
        disabled:bg-gray-700 disabled:text-zinc-400
      `,
      danger: `
        bg-red-500
        not-disabled:hover:bg-red-600
        focus:ring-red-400
        disabled:bg-red-700 disabled:text-zinc-400
      `,
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
    },
    isDisabled: {
      true: 'cursor-not-allowed',
    },
  },
})

export const Button: React.FC<Props> = ({ variant = 'primary', size = 'md', className, isDisabled, ...buttonProps }) => {
  return <AriaButton className={cn(button({ variant, size, isDisabled }), className)({ twMerge: true })} isDisabled={isDisabled} {...buttonProps} />
}
