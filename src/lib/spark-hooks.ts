import { useState, useEffect } from 'react'

// Minimal `useKV` shim that persists to localStorage and has the same basic shape
export function useKV<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) as T : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [key, state])

  const setVal = (v: any) => {
    if (typeof v === 'function') {
      setState((prev: T) => v(prev))
    } else {
      setState(v)
    }
  }

  return [state, setVal]
}
