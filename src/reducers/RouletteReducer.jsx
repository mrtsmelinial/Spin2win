import { createInitialBets } from './creatingInitalBets'

export const initialState = {
	bets: createInitialBets(),
	history: [],
	savedRounds: [],
	balance: 10000,
	betting: true,
	rebetUsed: false,
	lastResult: null,
}

const MAX_BET = 200

export function rouletteReducer(state, action) {
	if (action.type === 'SET_ACTIVE') {
		return {
			...state,
			betting: action.payload,
		}
	}

	if (!state.betting) return state

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

		case 'SAVE_ROUND': {
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
				rebetUsed: true, // блокируем
			}
		}

		case 'CALCULATE_WIN': {
			const { number, color, sector } = action.payload

			let totalWin = 0

			state.bets.forEach(bet => {
				if (bet.betAmount === 0) return

				let multiplier = 0

				switch (bet.type) {
					case 'number':
						if (bet.value === number) multiplier = 36
						break
					case 'color':
						if (number !== 0) {
							if (bet.value === 'red' && color === 'red') multiplier = 2
							if (bet.value === 'black' && color === 'black') multiplier = 2
						}
						break
					case 'parity':
						if (number !== 0) {
							if (bet.value === 'even' && number % 2 === 0) multiplier = 2
							if (bet.value === 'odd' && number % 2 !== 0) multiplier = 2
						}
						break
					case 'range':
						if (
							number !== 0 &&
							number >= bet.value[0] &&
							number <= bet.value[1]
						)
							multiplier = 2
						break
					case 'dozen':
						if (
							number !== 0 &&
							number >= bet.value[0] &&
							number <= bet.value[1]
						)
							multiplier = 3
						break
					case 'section':
						if (bet.value === sector) multiplier = 6
						break
				}

				totalWin += bet.betAmount * multiplier
			})

			return {
				...state,
				balance: state.balance + totalWin,
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

		case 'SET_RESULT': {
			return {
				...state,
				lastResult: action.payload,
			}
		}

		default:
			return state
	}
}
