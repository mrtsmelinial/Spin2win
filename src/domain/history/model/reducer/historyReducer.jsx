import { RED_NUMBERS } from '@/shared/constants'

const generateInitialHistory = firstCell => {
	const colorMap = { red: 'r', black: 'b', green: 'g' }

	const rest = Array.from({ length: 9 }, () => {
		const number = Math.floor(Math.random() * 37)
		let color
		if (number === 0) color = 'g'
		else if (RED_NUMBERS.has(number)) color = 'r'
		else color = 'b'
		return { number, color }
	})

	return [
		{ number: firstCell.number, color: colorMap[firstCell.color] },
		...rest,
	]
}

export const createHistoryInitialState = firstCell => ({
	historyCell: generateInitialHistory(firstCell),
	spinCount: 0,
})

export default function historyReducer(state, action) {
	switch (action.type) {
		case 'SPIN_COMPLETE': {
			const { number, color } = action.payload
			const colorMap = { red: 'r', black: 'b', green: 'g' }

			return {
				...state,
				historyCell: [
					{ number, color: colorMap[color] ?? color },
					...state.historyCell,
				],
				spinCount: state.spinCount + 1,
			}
		}

		case 'HISTORY_TRIM_LAST': {
			return {
				...state,
				historyCell: state.historyCell.slice(0, -1),
			}
		}

		default:
			return state
	}
}