import { useReducer } from 'react'
import { rouletteReducer } from '../reducers/RouletteReducer'
import { initialState } from '../reducers/initialState'
import {
	RouletteStateContext,
	RouletteDispatchContext,
} from './rouletteContexts'


export const RouletteProvider = ({ children }) => {
	const [state, dispatch] = useReducer(rouletteReducer, initialState)

	return (
		<RouletteDispatchContext.Provider value={dispatch}>
			<RouletteStateContext.Provider value={state}>
				{children}
			</RouletteStateContext.Provider>
		</RouletteDispatchContext.Provider>
	)
}

