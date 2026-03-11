import  MULTIPLIERS  from '../config/multiplierWin'

export default function calculateMultiplier(bet, { number, color, sector }) {
	switch (bet.type) {
		case 'number':
			return bet.value === number ? MULTIPLIERS.number : 0
		case 'color':
			return number !== 0 && bet.value === color ? MULTIPLIERS.color : 0
		case 'parity':
			if (number === 0) return 0
			if (bet.value === 'even' && number % 2 === 0) return MULTIPLIERS.parity
			if (bet.value === 'odd' && number % 2 !== 0) return MULTIPLIERS.parity
			return 0
		case 'range':
			return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
				? MULTIPLIERS.range
				: 0
		case 'dozen':
			return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
				? MULTIPLIERS.dozen
				: 0
		case 'section':
			return bet.value === sector ? MULTIPLIERS.section : 0
		default:
			return 0
	}
}
