import { create } from 'zustand'

export const useMyBetsStore = create(set => ({
	isOpen: false,
	isReady: false,
	bets: [],
	toggleDialog: () => set(state => ({ isOpen: !state.isOpen })),
	addRound: newBets =>
		set(() => ({
			bets: newBets,
		})),
	handleReady: value =>
		set({
			isReady: value,
		}),
}))

export const { toggleDialog, addRound, handleReady } = useMyBetsStore.getState()
