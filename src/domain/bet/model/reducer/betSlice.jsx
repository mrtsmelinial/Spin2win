import { MAX_BET } from '@/domain/bet/config/maxBet'
import { createSlice } from '@reduxjs/toolkit'
import { createInitialBets } from '@/shared/lib'
import calculateMultiplier from '@/domain/bet/lib/calculateMultiplier'
import { spinComplete, spinReset } from '@/domain/roulette/model/reducer'

const betSlice = createSlice({
	name: 'bet',
	initialState: {
		bets: createInitialBets(),
		balance: 10000,
		history: [],
		savedRounds: [],
		rebetUsed: false,
	},
	reducers: {
		addBet(state, action) {
			const { id, amount } = action.payload
			const betIndex = state.bets.findIndex(b => b.id === id)
			if (betIndex === -1) return

			const totalCurrentBets = state.bets.reduce(
				(acc, b) => acc + b.betAmount,
				0,
			)
			if (totalCurrentBets + amount > MAX_BET) return
			if (amount > state.balance) return

			state.bets[betIndex].betAmount += amount
			state.balance -= amount
			state.history.push({ id, amount })
		},

		undo(state) {
			const last = state.history[state.history.length - 1]
			if (!last) return

			if (last.type === 'double') {
				last.bets.forEach(b => {
					const bet = state.bets.find(bet => bet.id === b.id)
					if (bet) bet.betAmount = b.amount
				})
				const refund = last.bets.reduce((acc, b) => acc + b.amount, 0)
				state.balance += refund
				state.history.pop()
				return
			}

			const bet = state.bets.find(b => b.id === last.id)
			if (!bet) return
			bet.betAmount -= last.amount
			state.balance += last.amount
			state.history.pop()
		},

		clearBets(state) {
			const totalBets = state.bets.reduce((acc, bet) => acc + bet.betAmount, 0)
			state.bets.forEach(b => {
				b.betAmount = 0
			})
			state.balance += totalBets
			state.history = []
			state.rebetUsed = false
		},

		doubleBets(state) {
			const total = state.bets.reduce((acc, b) => acc + b.betAmount, 0)
			if (total === 0 || total > state.balance || total * 2 > MAX_BET) return

			state.history.push({
				type: 'double',
				bets: state.bets
					.filter(b => b.betAmount > 0)
					.map(b => ({ id: b.id, amount: b.betAmount })),
			})
			state.bets.forEach(b => {
				b.betAmount *= 2
			})
			state.balance -= total
		},

		loadRound(state, action) {
			const round = state.savedRounds.find(r => r.id === action.payload)
			if (!round) return
			if (state.rebetUsed) return

			const totalAmount = round.bets.reduce((acc, b) => acc + b.amount, 0)
			if (totalAmount > state.balance) return
			if (totalAmount > MAX_BET) return

			state.bets.forEach(bet => {
				const saved = round.bets.find(b => b.id === bet.id)
				bet.betAmount = saved ? saved.amount : 0
			})
			state.balance -= totalAmount
			state.history = round.bets.map(b => ({ id: b.id, amount: b.amount }))
			state.rebetUsed = true
		},
	},

	extraReducers: builder => {
		builder
			.addCase(spinComplete, (state, action) => {
				const totalWin = state.bets.reduce((acc, bet) => {
					if (bet.betAmount === 0) return acc
					const multiplier = calculateMultiplier(bet, action.payload)
					return acc + bet.betAmount * multiplier
				}, 0)
				state.balance += totalWin

				const activeBets = state.bets.filter(b => b.betAmount > 0)
				if (activeBets.length > 0) {
					state.savedRounds.push({
						id: Date.now(),
						bets: activeBets.map(b => ({ id: b.id, amount: b.betAmount })),
					})
				}
			})

			.addCase(spinReset, state => {
				state.bets.forEach(b => {
					b.betAmount = 0
				})
				state.history = []
				state.rebetUsed = false
			})
	},
})

export const { addBet, undo, clearBets, doubleBets, loadRound } =
	betSlice.actions
export default betSlice.reducer
