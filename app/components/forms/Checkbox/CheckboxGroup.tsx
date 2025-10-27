import { Checkbox } from './Checkbox'

type Props = {
  label: string
  name: string
  value: Set<string>
  onChange: (value: string) => void
  items: {
    label: string
    value: string
  }[]
}

export const CheckboxGroup: React.FC<Props> = ({ label, items, name, value: valueSet, onChange }) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="mt-0.5 flex gap-3">
        {items.map(({ label, value }) => (
          <Checkbox
            key={value}
            name={name}
            value={value}
            checked={valueSet.has(value)}
            onChange={() => onChange(value)}
          >
            {label}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  )
}
