import React from 'react'
import { selectBets } from '@/domain/bet/model/selectors'
import { useSelector } from 'react-redux'

export default function BetColumnTotalBet() {
	const bets = useSelector(selectBets)

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
