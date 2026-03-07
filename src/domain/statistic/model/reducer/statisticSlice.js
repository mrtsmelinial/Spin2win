import { createSlice } from '@reduxjs/toolkit'
import { spinComplete } from '@/domain/roulette/model/reducer'

const createInitialArrInfo = () => {
	const arr = []
	let total = 0

	for (let i = 0; i < 37; i++) {
		const level = Math.random()
		arr.push({ id: i, level })
		total += level
	}

	return arr.map(item => ({
		...item,
		level: Math.round((item.level / total) * 300),
	}))
}

const statisticSlice = createSlice({
	name: 'statistic',
	initialState: {
		arrInfo: createInitialArrInfo(),
	},
	extraReducers: builder => {
		builder.addCase(spinComplete, (state, action) => {
			const { number } = action.payload

			state.arrInfo.forEach(item => {
				item.level =
					item.id === number ? item.level + 1 : Math.max(0, item.level - 1)
			})

			const total = state.arrInfo.reduce((sum, item) => sum + item.level, 0)

			state.arrInfo.forEach(item => {
				item.level = total > 0 ? Math.round((item.level / total) * 300) : 0
			})
		})
	},
})

export default statisticSlice.reducer
