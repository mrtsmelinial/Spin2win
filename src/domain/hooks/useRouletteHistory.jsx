import { useCallback, useEffect, useRef, useState } from 'react'
import { RED_NUMBERS } from '@/shared/constants'

const generateInitialHistory = firstCell => {
	const rest = Array.from({ length: 9 }, () => {
		const number = Math.floor(Math.random() * 37)
		let color
		if (number === 0) color = 'g'
		else if (RED_NUMBERS.has(number)) color = 'r'
		else color = 'b'
		return { number, color }
	})

	const colorMap = { red: 'r', black: 'b', green: 'g' }

	return [
		{ number: firstCell.number, color: colorMap[firstCell.color] },
		...rest,
	]
}

export default function useRouletteHistory(initialCell) {
	const [historyCell, setHistoryCell] = useState(() =>
		generateInitialHistory(initialCell),
	)

		const [spinCount, setSpinCount] = useState(0)
	

	const timeoutRef = useRef(null)

	const addSpin = useCallback(cell => {
		setSpinCount(prev => prev + 1)
		setHistoryCell(prev => [cell, ...prev])
		timeoutRef.current = setTimeout(() => {
			setHistoryCell(prev => prev.slice(0, -1))
		}, 1000)
	}, [])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	return { historyCell, addSpin, spinCount }
}
