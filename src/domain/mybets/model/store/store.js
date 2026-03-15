import { useBetStore } from '@/domain/bet'
import calculateMultiplier from '@/domain/bet/lib/calculateMultiplier'
import { useRoundStore } from '@/domain/round/model'
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
	spinComplete: cell =>
		set(
			() => {
				const betState = useBetStore.getState()
				const myBetsState = useMyBetsStore.getState()

				const currentRound = useRoundStore.getState(state => state.round)
				const activeBets = Object.values(betState.bets).filter(
					value => value.betAmount > 0,
				)
				const currentData = new Date().toLocaleString('ru-RU')
				const total = betState.bets.reduce(
					(acc, cells) => acc + cells.betAmount,
					0,
				)
				const quantityBets = activeBets.length
				const lastWin = betState.lastWin
				const details = activeBets.map(item => {
					const multiplier = calculateMultiplier(item, cell)
					const winningAmount = item.betAmount * multiplier

					let combination

					if (item.type === 'range' || item.type === 'dozen') {
						combination = `${item.value[0]}-${item.value[1]}`
					} else combination = item.value

					return {
						id: '000000000',
						status: winningAmount > 0 ? 'Win' : 'Lost',
						combination: combination,
						amount: item.betAmount,
						odds: `x${multiplier}`,
						win: winningAmount,
					}
				})

				if (quantityBets !== 0) {
					myBetsState.addRound({
						id: currentRound.round,
						date: currentData,
						round: `#${currentRound.round}`,
						result: { number: cell.number, color: cell.color },
						bets: quantityBets,
						amount: total,
						win: lastWin,
						details,
					})
				}
			},
			false,
			'myBets/spinComplete',
		),
}))

export const { openDialog, closeDialog, addRound, spinComplete } = useMyBetsStore.getState()
