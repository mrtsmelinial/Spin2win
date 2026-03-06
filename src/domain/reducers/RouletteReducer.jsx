import { betsPart } from './reducerParts'
import { calculatePart } from './reducerParts'
import { gamePart } from './reducerParts'
import { roundsPart } from './reducerParts'


export default function rouletteReducer(state, action) {
	return [betsPart, calculatePart, roundsPart, gamePart].reduce(
		(currentState, reducer) => reducer(currentState, action),
		state,
	)
}
