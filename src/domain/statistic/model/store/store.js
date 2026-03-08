import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

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

export const useStatisticStore = create(
	devtools(
		immer(set => ({
			arrInfo: createInitialArrInfo(),

			spinComplete: value =>
				set(
					state => {
						const { number } = value
						state.arrInfo.forEach(item => {
							item.level =
								item.id === number
									? item.level + 1
									: Math.max(0, item.level - 1)
						})
						const total = state.arrInfo.reduce(
							(sum, item) => sum + item.level,
							0,
						)

						state.arrInfo.forEach(item => {
							item.level =
								total > 0 ? Math.round((item.level / total) * 300) : 0
						})
					},
					false,
					'statistic/spinComplete',
				),
		})),
		{ name: 'StatisticStore' },
	),
)

export const { spinComplete } = useStatisticStore.getState()
