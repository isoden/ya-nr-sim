import React, { useCallback, useState } from 'react'

/**
 * 状態を永続化するカスタムフック
 *
 * @param storeKey - localStorageのキー
 * @param defaultValue - デフォルト値
 */
export function usePersistedState<T>(storeKey: string, defaultValue: T): [T, (value: React.SetStateAction<T>) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(storeKey)
      return storedValue ? JSON.parse(storedValue) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setPersistedState = useCallback(
    (value: React.SetStateAction<T>) => {
      setState(value)
      try {
        localStorage.setItem(storeKey, JSON.stringify(value))
      } catch {
        // ignore runtime errors
      }
    },
    [storeKey],
  )

  return [state, setPersistedState]
}
