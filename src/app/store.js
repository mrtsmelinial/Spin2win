import { configureStore } from '@reduxjs/toolkit'
import { rouletteSlice } from '@/domain/roulette/model/reducer'
import betSlice from '@/domain/bet/model/reducer'
import { historySlice } from '@/domain/history/model/reducer'
import statisticSlice from '@/domain/statistic/model/reducer'

import { createRandomCell } from '@/domain/roulette/lib'

const initialCell = createRandomCell()

export const store = configureStore({
	reducer: {
		roulette: rouletteSlice(initialCell),
		bet: betSlice,
		history: historySlice(initialCell),
		statistic: statisticSlice,
	},
})
