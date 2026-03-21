
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

export const useJackpotStore = create(
	devtools(
		immer(set => ({
			jackpots: {},

			setJackpots: data =>
				set(
					state => {
						if (data.jackpots === undefined) return
						state.jackpots = data.jackpots
					},
					false,
					'jackpot/setJackpots',
				),
		})),
		{ name: 'JackpotStore' },
	),
)

export const { setJackpots } = useJackpotStore.getState()
