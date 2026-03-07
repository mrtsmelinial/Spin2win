import  calculateMultiplier  from '@/domain/bet/lib/calculateMultiplier'

export default function calculatePart(state, action) {
	switch (action.type) {
		case 'SPIN_COMPLETE': {
			const totalWin = state.bets.reduce((acc, bet) => {
				if (bet.betAmount === 0) return acc
				const multiplier = calculateMultiplier(bet, action.payload)
				return acc + bet.betAmount * multiplier
			}, 0)

			return {
				...state,
				balance: state.balance + totalWin,
			}
		}

		default:
			return state
	}
}
