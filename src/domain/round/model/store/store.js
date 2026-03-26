import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

export const useRoundStore = create(
	devtools(
		immer(set => ({
			round: 0,
			nextRound: null,
			privateRound: null,
			nextPrivateRound: null,

			setRoundData: data =>
				set(
					state => {
						if (data.tir !== undefined) state.round = data.tir
						if (data.next_tir !== undefined) state.nextRound = data.next_tir
						if (data.private_tir !== undefined)
							state.privateRound = data.private_tir
						if (data.next_private_tir !== undefined)
							state.nextPrivateRound = data.next_private_tir
					},
					false,
					'round/setRoundData',
				),
		})),
		{ name: 'RoundStore' },
	),
)

export const { setRoundData } = useRoundStore.getState()
