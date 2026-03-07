import { useReducer } from 'react'
import combineReducers from './combineReducers'
import { initialState } from './initialState'
import { RouletteStateContext, RouletteDispatchContext } from '@/shared/context'

const RouletteProvider = ({ children }) => {
	const [state, dispatch] = useReducer(combineReducers, initialState)

	return (
		<RouletteDispatchContext.Provider value={dispatch}>
			<RouletteStateContext.Provider value={state}>
				{children}
			</RouletteStateContext.Provider>
		</RouletteDispatchContext.Provider>
	)
}
export default RouletteProvider
