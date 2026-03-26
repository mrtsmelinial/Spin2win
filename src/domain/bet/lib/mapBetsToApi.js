export function mapBetsToApi(bets, eventId) {
	return bets
		.filter(bet => bet.betAmount > 0)
		.map(bet => ({
			bet: getBetKey(bet),
			bet_value: String(bet.betAmount),
			event: eventId,
		}))
}

function getBetKey(bet) {
	switch (bet.type) {
		case 'number':
			return String(bet.value) 

		case 'section':
			return `sector0_${bet.value.toLowerCase()}` 

		case 'color':
			return bet.value 

		case 'parity':
			return bet.value 

		case 'range':
			return bet.value[0] === 1 ? 'half1' : 'half2' 

		case 'dozen':
			if (bet.value[0] === 1) return 'doz1' 
			if (bet.value[0] === 13) return 'doz2'
			return 'doz3' 

		default:
			throw new Error(`Unknown bet type: ${bet.type}`)
	}
}
