import { createContext, useReducer, useContext } from 'react'
import { rouletteReducer, initialState } from '../reducers/RouletteReducer'

const RouletteContext = createContext(null)

export const useRoulette = () => {
	const context = useContext(RouletteContext)
	if (!context) {
		throw new Error('Err')
	}
	return context
}

export const RouletteProvider = ({ children }) => {
	const [state, dispatch] = useReducer(rouletteReducer, initialState)

	return (
		<RouletteContext.Provider value={{ state, dispatch }}>
			{children}
		</RouletteContext.Provider>
	)
}
