import { betsPart, calculatePart, roundsPart } from './reducerParts'

export default function rouletteReducer(state, action) {
	return [betsPart, calculatePart, roundsPart].reduce(
		(currentState, reducer) => reducer(currentState, action),
		state,
	)
}
