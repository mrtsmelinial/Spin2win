import { calculateMultiplier } from '@/domain/utils'
import { wheelSlots } from '@/shared/lib'

 const calculateWin = (bets, target) => {
	const sector = wheelSlots[target.number].sector

	const totalWin = bets.reduce((acc, bet) => {
		if (bet.betAmount === 0) return acc
		const multiplier = calculateMultiplier(bet, { ...target, sector })
		return acc + bet.betAmount * multiplier
	}, 0)

	return { totalWin, sector }
}
export default calculateWin