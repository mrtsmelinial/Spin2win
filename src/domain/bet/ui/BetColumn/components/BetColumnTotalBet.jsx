import React from 'react'
import { useRouletteSelector } from '@/shared/model'
import { selectBets } from '@/domain/bet/model/selectors'

export default function BetColumnTotalBet() {
	const bets = useRouletteSelector(selectBets)

	const total = bets.reduce((acc, cell) => acc + cell.betAmount, 0)
	return (
		<div className='roulette__total-bet'>
			<span className='roulette__total-text'>TOTAL AMOUNT OF BET:</span>
			<span className='roulette__total-sum'>
				{total.toFixed(2).replace('.', ',')}
			</span>
		</div>
	)
}
