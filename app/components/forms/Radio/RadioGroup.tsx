import { RadioButton } from './RadioButton'

type Props = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  items: {
    label: string
    value: string
  }[]
}

export const RadioGroup: React.FC<Props> = ({ label, items, name, value: selectedValue, onChange }) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="mt-0.5 flex gap-3">
        {items.map(({ label, value }) => (
          <RadioButton
            key={value}
            name={name}
            value={value}
            checked={selectedValue === value}
            onChange={() => onChange(value)}
          >
            {label}
          </RadioButton>
        ))}
      </div>
    </fieldset>
  )
}
