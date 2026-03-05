import { calculateMultiplier } from '../reducers/reducerParts/calculateParts'
import { wheelSlots } from '../component/WheelSlots'

export const calculateWin = (bets, target) => {
	const sector = wheelSlots[target.number].sector

	const totalWin = bets.reduce((acc, bet) => {
		if (bet.betAmount === 0) return acc
		const multiplier = calculateMultiplier(bet, { ...target, sector })
		return acc + bet.betAmount * multiplier
	}, 0)

	return { totalWin, sector }
}
