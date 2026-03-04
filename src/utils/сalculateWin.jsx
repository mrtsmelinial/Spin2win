export const calculateWin = (bets, target, wheelSlots) => {
	const sector = wheelSlots[target.number].sector
	let totalWin = 0

	if (bets && bets.length > 0) {
		bets.forEach(bet => {
			if (bet.betAmount === 0) return
			let multiplier = 0
			switch (bet.type) {
				case 'number':
					if (bet.value === target.number) multiplier = 36
					break
				case 'color':
					if (target.color === bet.value && target.number !== 0) multiplier = 2
					break
				case 'parity':
					if (target.number !== 0) {
						if (bet.value === 'even' && target.number % 2 === 0) multiplier = 2
						if (bet.value === 'odd' && target.number % 2 !== 0) multiplier = 2
					}
					break
				case 'range':
					if (
						target.number !== 0 &&
						target.number >= bet.value[0] &&
						target.number <= bet.value[1]
					)
						multiplier = 2
					break
				case 'dozen':
					if (
						target.number !== 0 &&
						target.number >= bet.value[0] &&
						target.number <= bet.value[1]
					)
						multiplier = 3
					break
				case 'section':
					if (bet.value === sector) multiplier = 6
					break
			}
			totalWin += bet.betAmount * multiplier
		})

		return { totalWin, sector }
	}
}
