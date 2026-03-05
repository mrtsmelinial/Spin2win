import React from 'react'

export const multipliers = {
	number: 36,
	color: 2,
	parity: 2,
	range: 2,
	dozen: 3,
	section: 6,
}

export function calculateMultiplier(bet, { number, color, sector }) {
	switch (bet.type) {
		case 'number':
			return bet.value === number ? multipliers.number : 0
		case 'color':
			return number !== 0 && bet.value === color ? multipliers.color : 0
		case 'parity':
			if (number === 0) return 0
			if (bet.value === 'even' && number % 2 === 0) return multipliers.parity
			if (bet.value === 'odd' && number % 2 !== 0) return multipliers.parity
			return 0
		case 'range':
			return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
				? multipliers.range
				: 0
		case 'dozen':
			return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
				? multipliers.dozen
				: 0
		case 'section':
			return bet.value === sector ? multipliers.section : 0
		default:
			return 0
	}
}

export function calculateParts(state, action) {
	switch (action.type) {
		case 'CALCULATE_WIN': {
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
