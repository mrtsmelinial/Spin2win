import betReducer from '@/domain/bet/model/reducer'
import rouletteReducer from '@/domain/roulette/model/reducer'
import historyReducer from '@/domain/history/model/reducer'
import statisticReducer from '@/domain/statistic/model/reducer'

export default function combineReducers(state, action) {
	return {
		bet: betReducer(state.bet, action),
		roulette: rouletteReducer(state.roulette, action),
		history: historyReducer(state.history, action),
		statistic: statisticReducer(state.statistic, action),
	}
}
