import { create } from 'zustand'

export const useMyBetsStore = create(set => ({
	isOpen: false,
	bets: [],
	openDialog: () => set({ isOpen: true }),
	closeDialog: () => set({ isOpen: false }),
	addRound: bet =>
		set(state => ({
			bets: [bet, ...state.bets],
		})),
}))

export const { openDialog, closeDialog, addRound } =
	useMyBetsStore.getState()
