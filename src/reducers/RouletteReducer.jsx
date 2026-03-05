import { betsPart } from './reducerParts/betsPart'
import { calculateParts } from './reducerParts/calculateParts'
import { gamePart } from './reducerParts/gamePart'
import { roundsPart } from './reducerParts/roundsPart'


export function rouletteReducer(state, action) {
	return [betsPart, calculateParts, roundsPart, gamePart].reduce(
		(currentState, reducer) => reducer(currentState, action),
		state,
	)
}
