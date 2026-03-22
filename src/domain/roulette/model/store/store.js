import { create } from 'zustand'
import { PHASES, wheelSlots } from '@/shared/constants'
import { devtools } from 'zustand/middleware'

export const useRouletteStore = create(
	devtools(set => ({
		phase: PHASES.PLACE_BETS,
		lastResult: null,
		initialCell: null,
		result: null,

		setResultCell: value =>
			set(
				state => {
					state.result = {
						number: Number(value),
						...wheelSlots[value],
					}
				},
				false,
				'roulette/setResultCell',
			),

		setInitialCell: data =>
			set(
				state => {
					const result = data.result

					state.initialCell = {
						number: Number(result),
						...wheelSlots[result],
					}
				},
				false,
				'roulette/setInitialCell',
			),

		setActive: value =>
			set(
				{ phase: value ? PHASES.PLACE_BETS : PHASES.DRAW },
				false,
				'roulette/setActive',
			),

		spinComplete: cell =>
			set(
				state => {
					state.lastResult = cell
				},
				false,
				'roulette/spinComplete',
			),

		spinReset: () =>
			set(
				{ lastResult: null, phase: PHASES.PLACE_BETS },
				false,
				'roulette/spinReset',
			),
	})),
	{ name: 'RouletteStore' },
)

export const {
	setActive,
	spinComplete,
	spinReset,
	setInitialCell,
	setResultCell,
} = useRouletteStore.getState()
