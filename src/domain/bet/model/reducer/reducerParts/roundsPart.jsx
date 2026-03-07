import { MAX_BET } from '@/domain/bet/config/maxBet'

export default function roundsPart(state, action) {
	switch (action.type) {
		case 'SPIN_COMPLETE': {
			const activeBets = state.bets.filter(bet => bet.betAmount > 0)
			if (activeBets.length === 0) return state

			const newRound = {
				id: Date.now(),
				bets: activeBets.map(bet => ({ id: bet.id, amount: bet.betAmount })),
			}

			return {
				...state,
				savedRounds: [...state.savedRounds, newRound],
			}
		}

		case 'LOAD_ROUND': {
			if (!state.betting) return state

			const round = state.savedRounds.find(r => r.id === action.id)
			if (!round) return state
			if (state.rebetUsed) return state

			const totalAmount = round.bets.reduce((acc, bet) => acc + bet.amount, 0)
			if (totalAmount > state.balance) return state
			if (totalAmount > MAX_BET) return state

			const newBets = state.bets.map(bet => {
				const saved = round.bets.find(b => b.id === bet.id)
				return saved
					? { ...bet, betAmount: saved.amount }
					: { ...bet, betAmount: 0 }
			})

			return {
				...state,
				bets: newBets,
				balance: state.balance - totalAmount,
				history: round.bets.map(bet => ({ id: bet.id, amount: bet.amount })),
				rebetUsed: true,
			}
		}

		default:
			return state
	}
}
