import { RED_NUMBERS, wheelSlots } from '@/shared/constants'
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

const getExtraIds = number => {
	const ids = []

	if (number === 0) return ids

	if (RED_NUMBERS.has(number)) ids.push('color-red')
	else ids.push('color-black')

	if (number <= 18) ids.push('range-1-18')
	else ids.push('range-19-36')

	if (number <= 12) ids.push('dozen-1')
	else if (number <= 24) ids.push('dozen-2')
	else ids.push('dozen-3')

	const sector = wheelSlots[number]?.sector
	if (sector) ids.push(`section-${sector.toLowerCase()}`)

	if (number % 2 === 0) ids.push('parity-even')
	else ids.push('parity-odd')

	return ids
}

export const useStatisticStore = create(
	devtools(
		immer(set => ({
			arrInfo: createInitialArrInfo(),
			arrExtra: createInitialArrExtra(),
			spinCount: 10,

			initFromHistory: (
				historyCell, //ДУБЛИРУЕТ ИЗ ЗА СТРИКТ МОДВ
			) =>
				set(
					state => {
						historyCell.forEach(({ number }) => {
							const item = state.arrInfo.find(el => el.id === number)
							if (item) item.count += 1

							getExtraIds(number).forEach(id => {
								const extra = state.arrExtra.find(el => el.id === id)
								if (extra) extra.count += 1
							})
						})

						state.arrInfo.forEach(item => {
							item.level = Math.round((item.count / 15) * 100)
						})
					},
					false,
					'statistic/initFromHistory',
				),

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

			spinComplete: value =>
				set(
					state => {
						const { number } = value
						state.spinCount += 1

						if (state.spinCount >= 120) {
							state.spinCount = 0
							state.arrInfo.forEach(item => {
								item.count = 0
								item.level = 0
							})
							state.arrExtra.forEach(item => {
								item.count = 0
							})
							return
						}

						const item = state.arrInfo.find(el => el.id === number)
						if (item) item.count += 1

						getExtraIds(number).forEach(id => {
							const extra = state.arrExtra.find(el => el.id === id)
							if (extra) extra.count += 1
						})

						state.arrInfo.forEach(item => {
							item.level = Math.round((item.count / 15) * 100)
						})
					},
					false,
					'statistic/spinComplete',
				),
		})),
		{ name: 'StatisticStore' },
	),
)

export const { spinComplete, setStatistic } = useStatisticStore.getState()
