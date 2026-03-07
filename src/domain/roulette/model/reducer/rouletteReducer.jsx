export default function rouletteReducer(state, action) {
	switch (action.type) {
		case 'SET_ACTIVE':
			return {
				...state,
				betting: action.payload,
			}

		case 'SPIN_COMPLETE':
			return {
				...state,
				lastResult: action.payload,
			}

		case 'SPIN_RESET':
			return {
				...state,
				lastResult: null,
				betting: true,
			}
		default:
			return state
	}
}
