import  {MAX_BET} from "../../constants/rouletteConstants"

export function betsPart(state, action) {
	switch (action.type) {
		case 'ADD_BET': {
			if (!state.betting) return state
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
			if (!state.betting) return state

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
			if (!state.betting) return state

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
			if (!state.betting) return state

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
		case 'RESET_BETS': {
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
