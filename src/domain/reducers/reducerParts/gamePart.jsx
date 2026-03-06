export default function gamePart(state, action) {
	switch (action.type) {
		case 'SET_ACTIVE':
			return {
				...state,
				betting: action.payload,
			}

		case 'SET_RESULT':
			return {
				...state,
				lastResult: action.payload,
			}
		default:
			return state
	}
}
