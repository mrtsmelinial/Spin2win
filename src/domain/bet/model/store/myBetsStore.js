import { create } from 'zustand'

export const useMyBetsStore = create(set => ({
	isOpen: false,
	bets: [],
	toggleDialog: () => set(state => ({ isOpen: !state.isOpen })),
	addRound: bet =>
		set(state => ({
			bets: [bet, ...state.bets],
		})),
}))

export const { toggleDialog, addRound } = useMyBetsStore.getState()
