import { createInitialBets } from './creatingInitalBets'

export const initialState = {
	bets: createInitialBets(),
	history: [],
	savedRounds: [],
	balance: 10000,
}

const MAX_BET = 200

export function rouletteReducer(state, action) {
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

			const clearedBets = state.bets.map(bet => ({
				...bet,
				betAmount: 0,
			}))

			return {
				...state,
				bets: clearedBets,
				history: [],
				balance: state.balance + totalBets,
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

			const doubledBets = state.bets.map(bet => ({
				...bet,
				betAmount: bet.betAmount * 2,
			}))

			const historyAdd = state.bets
				.filter(bet => bet.betAmount > 0)
				.map(bet => ({
					id: bet.id,
					amount: bet.betAmount,
				}))

			return {
				...state,
				bets: doubledBets,
				balance: state.balance - totalCurrentBets,
				history: [...state.history, ...historyAdd],
			}
		}

		default:
			return state
	}
}