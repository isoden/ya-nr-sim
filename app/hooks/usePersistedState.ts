import React, { useEffect, useState } from 'react'
import { isFunction } from 'es-toolkit/compat'

/**
 * 状態を永続化するカスタムフック
 *
 * @param storeKey - localStorageのキー
 * @param defaultValue - デフォルト値
 */
export function usePersistedState<T>(
  storeKey: string,
  defaultValue: T | (() => T),
): [T, (value: React.SetStateAction<T>) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(storeKey)
      return storedValue ? JSON.parse(storedValue) : isFunction(defaultValue) ? defaultValue() : defaultValue
    } catch {
      return isFunction(defaultValue) ? defaultValue() : defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(state))
    } catch {
      // ignore runtime errors
    }
  }, [state])

  return [state, setState]
}
