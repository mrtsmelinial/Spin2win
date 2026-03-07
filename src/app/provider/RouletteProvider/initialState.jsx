import { createInitialBets } from '@/shared/lib'
import { getCellRandom } from '@/domain/roulette/lib'
import { createHistoryInitialState } from '@/domain/history/model/reducer'
import { createStatisticInitialState } from '@/domain/statistic/model/reducer'

const initialCell = getCellRandom()

export const initialState = {
	bet: {
		bets: createInitialBets(),
		balance: 10000,
		history: [],
		savedRounds: [],
		rebetUsed: false,
	},
	roulette: {
		betting: true,
		lastResult: null,
		initialCell,
	},
	history: createHistoryInitialState(initialCell),
	statistic: createStatisticInitialState(),
}
