import { createInitialBets } from '@/shared/lib'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { addBalance, useBalanceStore } from '@/domain/balance'

export const useBetStore = create(
	devtools(
		immer(set => ({
			bets: createInitialBets(),
			totalStake: 0,
			lastWin: 0,
			history: [],
			savedRounds: [],
			rebetUsed: false,
			billInfo: null,

			addBet: item =>
				set(
					state => {
						const { id, value, amount } = item
						const balance = useBalanceStore.getState().balance
						const betIndex = state.bets.findIndex(b => b.id === id)
						if (betIndex === -1) return

						if (state.totalStake + amount > state.billInfo.max_bet) return
						if (state.totalStake + amount > balance) return

						state.bets[betIndex].betAmount += amount
						state.totalStake += amount
						state.history.push({ id, value, amount })
					},
					false,
					'bet/addBet',
				),

			undo: () =>
				set(
					state => {
						const last = state.history[state.history.length - 1]
						if (!last) return

						if (last.type === 'double') {
							last.bets.forEach(b => {
								const bet = state.bets.find(bet => bet.id === b.id)
								if (bet) bet.betAmount = b.amount
							})
							const refund = last.bets.reduce((acc, b) => acc + b.amount, 0)
							state.totalStake -= refund
							state.history.pop()
							return
						}

						const bet = state.bets.find(b => b.id === last.id)
						if (!bet) return
						bet.betAmount -= last.amount
						state.totalStake -= last.amount
						state.history.pop()
					},
					false,
					'bet/undo',
				),

			clearBets: () =>
				set(
					state => {
						const totalBets = state.bets.reduce(
							(acc, bet) => acc + bet.betAmount,
							0,
						)
						state.bets.forEach(b => {
							b.betAmount = 0
						})
						state.totalStake -= totalBets
						state.history = []
						state.rebetUsed = false
					},
					false,
					'bet/clearBets',
				),

			doubleBets: () =>
				set(
					state => {
						const balance = useBalanceStore.getState().balance
						const total = state.bets.reduce((acc, b) => acc + b.betAmount, 0)
						if (
							total === 0 ||
							total * 2 > balance ||
							total * 2 > state.billInfo.max_bet
						)
							return

						state.history.push({
							type: 'double',
							bets: state.bets
								.filter(b => b.betAmount > 0)
								.map(b => ({ id: b.id, amount: b.betAmount })),
						})
						state.bets.forEach(b => {
							b.betAmount *= 2
						})
						state.totalStake += total
					},
					false,
					'bet/doubleBets',
				),

			loadRound: value =>
				set(
					state => {
						const round = state.savedRounds.find(r => r.id === value)
						if (!round) return
						if (state.rebetUsed) return

						const totalAmount = round.bets.reduce((acc, b) => acc + b.amount, 0)
						if (totalAmount > state.totalStake) return
						if (totalAmount > state.billInfo.max_bet) return

						state.bets.forEach(bet => {
							const saved = round.bets.find(b => b.id === bet.id)
							bet.betAmount = saved ? saved.amount : 0
						})
						state.totalStake += totalAmount
						state.history = round.bets.map(b => ({
							id: b.id,
							amount: b.amount,
						}))
						state.rebetUsed = true
					},
					false,
					'bet/loadRound',
				),

			setBillInfo: data =>
				set(
					state => {
						if (data.bill_info === undefined) return
						state.billInfo = data.bill_info
					},
					false,
					'bet/setBillInfo',
				),

			setLastWins: amount =>
				set(
					state => {
						if (!amount) return
						if (amount.win_amount_bets === undefined) return

						const winAmount = Number(amount.win_amount_bets)
						state.lastWin = winAmount
						addBalance(winAmount)
					},
					false,
					'bet/setLastWins',
				),

			betReset: () =>
				set(
					state => {
						state.bets.forEach(b => {
							b.betAmount = 0
						})
						state.history = []
						state.rebetUsed = false
						state.lastWin = 0
						state.totalStake = 0
					},
					false,
					'bet/betReset',
				),
		})),
		{ name: 'BetStore' },
	),
)

export const {
	addBet,
	undo,
	clearBets,
	doubleBets,
	loadRound,
	betReset,
	setBillInfo,
	setLastWins,
} = useBetStore.getState()
