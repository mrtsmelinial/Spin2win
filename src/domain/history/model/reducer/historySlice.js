import { RED_NUMBERS } from '@/shared/constants'
import { createAction, createSlice } from '@reduxjs/toolkit'
import { spinComplete } from '@/domain/roulette/model/reducer'

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

export const historyTrimLast = createAction('history/historyTrimLast')

export const historySlice = initialCell =>
	createSlice({
		name: 'history',
		initialState: {
			historyCell: generateInitialHistory(initialCell),
			spinCount: 0,
		},
		reducers: {},
		extraReducers: builder => {
			builder
				.addCase(historyTrimLast, state => {
					state.historyCell = state.historyCell.slice(0, -1)
				})
				.addCase(spinComplete, (state, action) => {
					const { number, color } = action.payload
					const colorMap = { red: 'r', black: 'b', green: 'g' }
					state.historyCell.unshift({ number, color: colorMap[color] ?? color })
					state.spinCount += 1
				})
		},
	}).reducer

