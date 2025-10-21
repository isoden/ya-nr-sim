export type CheckedState = 'checked' | 'indeterminate' | 'unchecked'

export type CheckedEffects = {
  [effectIds: string]: CheckedState
}
