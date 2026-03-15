import { create } from 'zustand'
import { initialCell } from '@/shared/lib'
import { PHASES } from '@/shared/constants'
import { devtools } from 'zustand/middleware'

export const useRouletteStore = create(
	devtools(set => ({
		phase: PHASES.PLACE_BETS,
		lastResult: null,
		initialCell,

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

export const { setActive, spinComplete, spinReset } =
	useRouletteStore.getState()
