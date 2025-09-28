import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { FormSchema } from '~/routes/_app._index/schema/FormSchema'
import { characterMap } from '~/data/characters'
import { BuildCriteria } from './BuildCriteria'

test('smoke test', async () => {
  const { container } = setup()

  expect(container.firstElementChild).toBeInTheDocument()
})

function setup() {
  const user = userEvent.setup()

  function TestComponent() {
    const [, fields] = useForm({
      onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
    })

    return <BuildCriteria meta={fields.effects} selectedCharId={characterMap.wylder.id} />
  }

  const view = render(<TestComponent />)

  return { user, ...view }
}
