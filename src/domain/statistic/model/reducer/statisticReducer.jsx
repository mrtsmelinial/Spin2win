const createInitialArrInfo = () => {
	const arr = []
	let total = 0

	for (let i = 0; i < 37; i++) {
		const level = Math.random()
		arr.push({ id: i, level })
		total += level
	}

	return arr.map(item => ({
		...item,
		level: Math.round((item.level / total) * 300),
	}))
}

export const createStatisticInitialState = () => ({
	arrInfo: createInitialArrInfo(),
})

export default function statisticReducer(state, action) {
	switch (action.type) {
		case 'SPIN_COMPLETE': {
			const { number } = action.payload

			const updated = state.arrInfo.map(item => ({
				...item,
				level:
					item.id === number ? item.level + 1 : Math.max(0, item.level - 1),
			}))

			const total = updated.reduce((sum, item) => sum + item.level, 0)

			return {
				...state,
				arrInfo: updated.map(item => ({
					...item,
					level: total > 0 ? Math.round((item.level / total) * 300) : 0,
				})),
			}
		}

		default:
			return state
	}
}
