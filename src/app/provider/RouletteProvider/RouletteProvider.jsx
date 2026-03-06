import { useReducer } from 'react'
import { rouletteReducer } from '@/domain/reducers'
import { initialState } from './initialState'
import {
	RouletteStateContext,
	RouletteDispatchContext,
} from '@/shared/context'

const RouletteProvider = ({ children }) => {
	const [state, dispatch] = useReducer(rouletteReducer, initialState)

	return (
		<RouletteDispatchContext.Provider value={dispatch}>
			<RouletteStateContext.Provider value={state}>
				{children}
			</RouletteStateContext.Provider>
		</RouletteDispatchContext.Provider>
	)
}
export default RouletteProvider
