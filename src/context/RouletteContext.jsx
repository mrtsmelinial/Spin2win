import { createContext, useReducer } from 'react'
import { rouletteReducer } from '../reducers/RouletteReducer'
import { initialState } from '../reducers/initialState'

const RouletteStateContext = createContext(null)
const RouletteDispatchContext = createContext(null)

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

