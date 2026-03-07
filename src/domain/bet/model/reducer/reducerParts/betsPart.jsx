import { MAX_BET } from '@/domain/bet/config/maxBet'

export default function betsPart(state, action) {
	switch (action.type) {
		case 'ADD_BET': {
			const betIndex = state.bets.findIndex(b => b.id === action.id)
			if (betIndex === -1) return state

			const totalCurrentBets = state.bets.reduce(
				(acc, bet) => acc + bet.betAmount,
				0,
			)

			if (totalCurrentBets + action.amount > MAX_BET) return state
			if (action.amount > state.balance) return state

			const newBets = [...state.bets]
			newBets[betIndex] = {
				...newBets[betIndex],
				betAmount: newBets[betIndex].betAmount + action.amount,
			}

			return {
				...state,
				bets: newBets,
				balance: state.balance - action.amount,
				history: [...state.history, { id: action.id, amount: action.amount }],
			}
		}

		case 'UNDO': {
			const last = state.history[state.history.length - 1]
			if (!last) return state

			if (last.type === 'double') {
				const newBets = state.bets.map(bet => {
					const original = last.bets.find(b => b.id === bet.id)
					return original ? { ...bet, betAmount: original.amount } : bet
				})
				const refund = last.bets.reduce((acc, b) => acc + b.amount, 0)
				return {
					...state,
					bets: newBets,
					balance: state.balance + refund,
					history: state.history.slice(0, -1),
				}
			}

			const betIndex = state.bets.findIndex(b => b.id === last.id)
			if (betIndex === -1) return state

			const newBets = [...state.bets]
			newBets[betIndex] = {
				...newBets[betIndex],
				betAmount: newBets[betIndex].betAmount - last.amount,
			}

			return {
				...state,
				bets: newBets,
				balance: state.balance + last.amount,
				history: state.history.slice(0, -1),
			}
		}

		case 'CLEAR_BETS': {
			const totalBets = state.bets.reduce((acc, bet) => acc + bet.betAmount, 0)

			return {
				...state,
				bets: state.bets.map(bet => ({ ...bet, betAmount: 0 })),
				history: [],
				balance: state.balance + totalBets,
				rebetUsed: false,
			}
		}

		case 'DOUBLE_BETS': {
			const totalCurrentBets = state.bets.reduce(
				(acc, bet) => acc + bet.betAmount,
				0,
			)

			if (totalCurrentBets === 0) return state
			if (totalCurrentBets > state.balance) return state
			if (totalCurrentBets * 2 > MAX_BET) return state

			const doubleRecord = {
				type: 'double',
				bets: state.bets
					.filter(bet => bet.betAmount > 0)
					.map(bet => ({ id: bet.id, amount: bet.betAmount })),
			}

			return {
				...state,
				bets: state.bets.map(bet => ({ ...bet, betAmount: bet.betAmount * 2 })),
				balance: state.balance - totalCurrentBets,
				history: [...state.history, doubleRecord],
			}
		}

		case 'SPIN_RESET': {
			return {
				...state,
				bets: state.bets.map(bet => ({ ...bet, betAmount: 0 })),
				history: [],
				rebetUsed: false,
			}
		}

		default:
			return state
	}
}
