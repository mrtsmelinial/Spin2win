import { RED_NUMBERS } from '@/shared/constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { initialCell } from '@/shared/lib'
import { devtools } from 'zustand/middleware'

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

export const useHistoryStore = create(
	devtools(
		immer(set => ({
			historyCell: generateInitialHistory(initialCell),
			spinCount: 0,

			historyTrimLast: () =>
				set(
					state => ({
						historyCell: state.historyCell.slice(0, -1),
					}),
					false,
					'history/historyTrimLast',
				),

			spinComplete: cell =>
				set(
					state => {
						const { number, color } = cell
						const colorMap = { red: 'r', black: 'b', green: 'g' }
						state.historyCell.unshift({
							number,
							color: colorMap[color] ?? color,
						})
						state.spinCount += 1
					},
					false,
					'history/spinComplete',
				),
		})),
		{ name: 'HistoryStore' },
	),
)

export const { historyTrimLast, spinComplete } = useHistoryStore.getState()
