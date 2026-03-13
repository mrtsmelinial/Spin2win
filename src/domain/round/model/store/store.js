import { create } from 'zustand'

export const useRoundStore = create(set => ({
	round: 660000,
	spinComplete: () => set(state => ({ round: state.round + 1 })),
}))

export const spinComplete = () => useRoundStore.getState().spinComplete()
