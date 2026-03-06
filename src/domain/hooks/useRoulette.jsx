import { useContext } from 'react'
import { RouletteStateContext, RouletteDispatchContext } from '@/shared/context'

export const useRouletteState = () => {
	const context = useContext(RouletteStateContext)
	if (!context) throw new Error('Err')
	return context
}

export const useRouletteDispatch = () => {
	const context = useContext(RouletteDispatchContext)
	if (!context) throw new Error('Err')
	return context
}

export const useRouletteSelector = selector => {
	const state = useRouletteState()
	return selector(state)
}
