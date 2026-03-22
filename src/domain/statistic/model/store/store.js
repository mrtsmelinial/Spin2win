import { createInitialBets } from '@/shared/lib'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { mapStatistic } from '../../lib/mapStatistic'

const createInitialArrInfo = () => {
	return Array.from({ length: 37 }, (_, i) => ({ id: i, count: 0, level: 0 }))
}

const createInitialArrExtra = () => {
	return createInitialBets()
		.filter(bet => bet.type !== 'number')
		.map(bet => ({ id: bet.id, count: 0 }))
}

export const useStatisticStore = create(
	devtools(
		immer(set => ({
			arrInfo: createInitialArrInfo(),
			arrExtra: createInitialArrExtra(),

			setStatistic: data =>
				set(
					state => {
						if (data.statistic === undefined) return

						const { arrInfo, arrExtra } = mapStatistic(data.statistic)
						state.arrInfo = arrInfo
						state.arrExtra = arrExtra
					},
					false,
					'statistic/setStatistic',
				),
		})),
		{ name: 'StatisticStore' },
	),
)

export const { setStatistic } = useStatisticStore.getState()
