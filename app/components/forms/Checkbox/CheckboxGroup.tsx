import { Checkbox } from './Checkbox'

type Props = {
  label: string
  name: string
  defaultValue?: string[]
  items: {
    label: string
    value: string
  }[]
}

export const CheckboxGroup: React.FC<Props> = ({ label, items, name, defaultValue }) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="mt-0.5 flex gap-3">
        {items.map(({ label, value }) => (
          <Checkbox
            key={value}
            name={name}
            value={value}
            checked={defaultValue?.includes(value)}
          >
            {label}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  )
}
