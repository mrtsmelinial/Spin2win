import { useState } from 'react'

export default function useLocalStorage(key, initialValue) {
	const [value, setValue] = useState(() => {
		const stored = localStorage.getItem(key)
		if (stored === null || stored === 'undefined') return initialValue
		try {
			return JSON.parse(stored)
		} catch {
			return initialValue
		}
	})

	const setStoredValue = newValue => {
		const valueToStore =
			newValue instanceof Function ? newValue(value) : newValue
		if (valueToStore === undefined) return
		setValue(valueToStore)
		localStorage.setItem(key, JSON.stringify(valueToStore))
	}

	return [value, setStoredValue]
}
