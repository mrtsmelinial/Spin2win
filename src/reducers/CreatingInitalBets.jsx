export function createInitialBets() {
	const bets = []

	const redNumbers = [
		1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
	]

	for (let i = 0; i <= 36; i++) {
		let color = 'green'
		if (i !== 0) color = redNumbers.includes(i) ? 'red' : 'black' 

		bets.push({
			id: `number-${i}`,
			type: 'number',
			value: i,
			color,
			betAmount: 0,
		})
	}

	bets.push(
		{ id: 'color-red', type: 'color', value: 'red', betAmount: 0 },
		{ id: 'color-black', type: 'color', value: 'black', betAmount: 0 },
		{ id: 'parity-even', type: 'parity', value: 'even', betAmount: 0 },
		{ id: 'parity-odd', type: 'parity', value: 'odd', betAmount: 0 },
		{ id: 'range-1-18', type: 'range', value: [1, 18], betAmount: 0 },
		{ id: 'range-19-36', type: 'range', value: [19, 36], betAmount: 0 },
		{ id: 'dozen-1', type: 'dozen', value: [1, 12], betAmount: 0 },
		{ id: 'dozen-2', type: 'dozen', value: [13, 24], betAmount: 0 },
		{ id: 'dozen-3', type: 'dozen', value: [25, 36], betAmount: 0 },
		{ id: 'section-a', type: 'section', value: 'A', betAmount: 0 },
		{ id: 'section-b', type: 'section', value: 'B', betAmount: 0 },
		{ id: 'section-c', type: 'section', value: 'C', betAmount: 0 },
		{ id: 'section-d', type: 'section', value: 'D', betAmount: 0 },
		{ id: 'section-e', type: 'section', value: 'E', betAmount: 0 },
		{ id: 'section-f', type: 'section', value: 'F', betAmount: 0 },
	)

	return bets
}
