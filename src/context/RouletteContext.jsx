import { createContext, useReducer, useContext } from 'react'
import { rouletteReducer } from '../reducers/RouletteReducer'
import { initialState } from '../reducers/initialState'


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
