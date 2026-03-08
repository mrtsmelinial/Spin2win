import { create } from 'zustand'
import { initialCell } from '@/shared/lib'
import { devtools } from 'zustand/middleware'

export const useRouletteStore = create(
	devtools(set => ({
		betting: true,
		lastResult: null,
		initialCell,

		setActive: value => set({ betting: value }, false, 'roulette/setActive'),
		spinComplete: cell =>
			set({ lastResult: cell }, false, 'roulette/spinComplete'),
		spinReset: () =>
			set({ lastResult: null, betting: true }, false, 'roulette/spinReset'),
	})),
	{ name: 'RouletteStore' },
)

export const { setActive, spinComplete, spinReset } =
	useRouletteStore.getState()
