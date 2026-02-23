import React from 'react'
import { useRoulette } from '../../context/RouletteContext'

export default function BetColumnTotalBet() {
	const{state} = useRoulette()

	const total = state.bets.reduce((acc, cell) => acc + cell.betAmount, 0)
	return (
		<div className='roulette__total-bet'>
			<span className='roulette__total-text'>TOTAL AMOUNT OF BET:</span>
			<span className='roulette__total-sum'>{total.toFixed(2).replace('.', ',')}</span>
		</div>
	)
}
